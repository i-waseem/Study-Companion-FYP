import React, { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, Progress as AntProgress, Typography, Tabs, Empty, Badge, Tooltip, Table, Alert } from 'antd';
import { TrophyOutlined, FireOutlined, ClockCircleOutlined, StarOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';
import api from '../api/config';
import './Progress.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const rarityColors = {
  common: '#78909C',
  rare: '#7E57C2',
  epic: '#FF7043',
  legendary: '#FFD700'
};

const Progress = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressRes, achievementsRes, summaryRes] = await Promise.all([
          api.getProgress(),
          api.getAchievements(),
          api.getAchievementSummary()
        ]);

        setStats(progressRes.data);
        setAchievements(achievementsRes.data);
        setSummary(summaryRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to load progress');
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div className="progress-loader">Loading progress...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  const renderAchievementCard = (achievement) => {
    const rarityColor = rarityColors[achievement.rarity];
    const progress = achievement.progress || { current: 0, target: 1 };
    const progressPercent = Math.min((progress.current / progress.target) * 100, 100);

    return (
      <Col xs={24} sm={12} md={8} lg={6} key={achievement._id}>
        <Card 
          className="achievement-card"
          style={{ borderColor: rarityColor }}
        >
          <Badge.Ribbon text={achievement.rarity} color={rarityColor}>
            <div className="achievement-icon">
              {achievement.icon}
            </div>
            <Title level={4}>{achievement.name}</Title>
            <Text>{achievement.description}</Text>
            {!achievement.earned && (
              <AntProgress 
                percent={progressPercent} 
                strokeColor={rarityColor}
                format={() => `${progress.current}/${progress.target}`}
              />
            )}
            {achievement.earned && (
              <Text type="secondary">
                Earned on {new Date(achievement.earnedAt).toLocaleDateString()}
              </Text>
            )}
          </Badge.Ribbon>
        </Card>
      </Col>
    );
  };

  const renderSummaryCards = () => {
    if (!summary) return null;

    const cards = [
      {
        icon: <TrophyOutlined />,
        title: 'Total Achievements',
        value: summary.totalAchievements,
        color: '#1890ff'
      },
      {
        icon: <StarOutlined />,
        title: 'Current Level',
        value: summary.currentLevel,
        color: '#52c41a'
      },
      {
        icon: <FireOutlined />,
        title: 'Study Streak',
        value: `${summary.currentStreak} days`,
        color: '#fa8c16'
      },
      {
        icon: <ClockCircleOutlined />,
        title: 'Study Time',
        value: `${Math.round(summary.totalStudyTime / 60)} hrs`,
        color: '#722ed1'
      }
    ];

    return (
      <Row gutter={[16, 16]} className="summary-cards">
        {cards.map((card, index) => (
          <Col xs={12} sm={6} key={index}>
            <Card className="summary-card">
              <div className="summary-icon" style={{ color: card.color }}>
                {card.icon}
              </div>
              <Title level={4}>{card.value}</Title>
              <Text type="secondary">{card.title}</Text>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  const renderAchievementsByCategory = () => {
    if (!achievements.length) {
      return <Empty description="No achievements yet. Keep studying!" />;
    }

    const categories = {
      streak: 'Study Streaks',
      mastery: 'Subject Mastery',
      completion: 'Completions',
      time: 'Study Time',
      special: 'Special'
    };

    return (
      <Tabs defaultActiveKey="streak">
        {Object.entries(categories).map(([key, title]) => (
          <TabPane tab={title} key={key}>
            <Row gutter={[16, 16]}>
              {achievements
                .filter(a => a.category === key)
                .map(renderAchievementCard)}
            </Row>
          </TabPane>
        ))}
      </Tabs>
    );
  };

  // Quiz progress data
  const quizColumns = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Topic',
      dataIndex: 'topic',
      key: 'topic',
    },
    {
      title: 'Average Score',
      dataIndex: 'averageScore',
      key: 'averageScore',
      render: (score) => `${Math.round(score)}%`
    },
    {
      title: 'Quizzes Taken',
      dataIndex: 'quizzesTaken',
      key: 'quizzesTaken',
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => (
        <AntProgress 
          percent={Math.round(progress * 100)} 
          status={progress >= 0.8 ? "success" : "active"}
        />
      )
    }
  ];

  const quizData = stats?.subjects?.flatMap(subject => 
    subject.topics.map(topic => ({
      key: `${subject.name}-${topic.name}`,
      subject: subject.name,
      topic: topic.name,
      averageScore: topic.averageScore,
      quizzesTaken: topic.quizzesTaken,
      progress: topic.progress
    }))
  ) || [];

  // Recent quizzes data
  const recentQuizColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Topic',
      dataIndex: 'topic',
      key: 'topic',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score) => `${Math.round(score)}%`
    }
  ];

  const recentQuizzes = stats?.recentQuizzes?.map(quiz => ({
    key: quiz._id,
    date: quiz.date,
    subject: quiz.subject,
    topic: quiz.topic,
    score: quiz.score
  })) || [];

  return (
    <div className="progress-container">
      <Title level={2}>Your Progress</Title>
      
      {renderSummaryCards()}

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card className="stats-card">
            <Title level={3}>Quiz Progress</Title>
            <Table 
              dataSource={quizData}
              columns={quizColumns}
              pagination={false}
              scroll={{ x: true }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card className="stats-card">
            <Title level={3}>Recent Quizzes</Title>
            <Table 
              dataSource={recentQuizzes}
              columns={recentQuizColumns}
              pagination={{ pageSize: 5 }}
              scroll={{ x: true }}
            />
          </Card>
        </Col>
      </Row>

      <Card className="achievements-card">
        <Title level={3}>Achievements</Title>
        {renderAchievementsByCategory()}
      </Card>
    </div>
  );
};

export default Progress;
