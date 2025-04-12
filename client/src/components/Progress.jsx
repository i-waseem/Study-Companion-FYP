import React, { useState, useEffect, useContext } from 'react';
import { 
  Card, Row, Col, Typography, Tabs, Badge, 
  Table, Alert, Statistic, Progress as AntProgress,
  Tag, Space, Tooltip, Empty, Select
} from 'antd';
import { 
  TrophyOutlined, FireOutlined, ClockCircleOutlined, 
  StarOutlined, BookOutlined, BulbOutlined, RocketOutlined,
  CheckCircleOutlined, BarChartOutlined
} from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';
import api from '../api/config';
import './Progress.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const rarityColors = {
  common: '#78909C',
  rare: '#7E57C2',
  epic: '#FF7043',
  legendary: '#FFD700'
};

const Progress = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ 
    quizzes: [], 
    subjects: [],
    flashcards: {
      total: 0,
      mastered: 0,
      reviewing: 0,
      learning: 0
    }
  });
  const [activities, setActivities] = useState([]);
  const [activityStats, setActivityStats] = useState({ 
    totalStudyTime: 0, 
    activityCounts: { 
      quiz: 0, 
      flashcard: 0, 
      career: 0,
      notes: 0
    },
    streakData: null
  });
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [selectedActivityType, setSelectedActivityType] = useState('all');
  const [achievements, setAchievements] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressRes, activitiesRes, achievementsRes, summaryRes] = await Promise.all([
          api.getProgress(),
          api.getActivities(),
          api.getAchievements(),
          api.getAchievementSummary()
        ]);

        if (activitiesRes.data) {
          setActivities(activitiesRes.data.activities || []);
          const stats = activitiesRes.data.stats || {};
          // Ensure streakData has a default value if not present
          stats.streakData = stats.streakData || { current: 0, longest: 0, lastStudied: null };
          setActivityStats(stats);
        }

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
      <div className="progress-header">
        <Title level={2}>Learning Analytics</Title>
        <Space>
          <Select value={selectedTimeRange} onChange={setSelectedTimeRange} style={{ width: 120 }}>
            <Option value="week">This Week</Option>
            <Option value="month">This Month</Option>
            <Option value="year">This Year</Option>
            <Option value="all">All Time</Option>
          </Select>
        </Space>
      </div>

      {/* Overview Cards */}
      <Row gutter={[16, 16]} className="overview-section">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Study Streak"
              value={activityStats.streakData.current}
              suffix="days"
              prefix={<FireOutlined style={{ color: '#ff4d4f' }} />}
            />
            <Text type="secondary">Longest: {activityStats.streakData.longest} days</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Study Time"
              value={Math.round(activityStats.totalStudyTime / 60)} // Convert to hours
              suffix="hours"
              prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Quiz Average"
              value={stats.quizzes.length > 0 ? 
                Math.round(stats.quizzes.reduce((acc, quiz) => acc + quiz.score, 0) / stats.quizzes.length) : 0
              }
              suffix="%"
              prefix={<TrophyOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Flashcards Mastered"
              value={stats.flashcards.mastered}
              suffix={`/ ${stats.flashcards.total}`}
              prefix={<CheckCircleOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Activity Analysis */}
      <Row gutter={[16, 16]} className="analysis-section">
        <Col xs={24} lg={16}>
          <Card title="Activity Distribution" extra={
            <Select value={selectedActivityType} onChange={setSelectedActivityType} style={{ width: 120 }}>
              <Option value="all">All Activities</Option>
              <Option value="quiz">Quizzes</Option>
              <Option value="flashcard">Flashcards</Option>
              <Option value="notes">Notes</Option>
              <Option value="career">Career</Option>
            </Select>
          }>
            <Table
              dataSource={activities.filter(activity => 
                selectedActivityType === 'all' || activity.type === selectedActivityType
              )}
              columns={[
                {
                  title: 'Activity',
                  dataIndex: 'type',
                  key: 'type',
                  render: (type) => (
                    <Space>
                      {type === 'quiz' && <RocketOutlined style={{ color: '#52c41a' }} />}
                      {type === 'flashcard' && <BulbOutlined style={{ color: '#722ed1' }} />}
                      {type === 'notes' && <BookOutlined style={{ color: '#1890ff' }} />}
                      {type === 'career' && <StarOutlined style={{ color: '#fa8c16' }} />}
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Space>
                  )
                },
                {
                  title: 'Date & Time',
                  dataIndex: 'timestamp',
                  key: 'timestamp',
                  render: (date) => new Date(date).toLocaleString()
                },
                {
                  title: 'Details',
                  dataIndex: 'data',
                  key: 'data',
                  render: (data) => {
                    if (data.subject) return (
                      <Space direction="vertical" size="small">
                        <Text strong>{data.subject}</Text>
                        {data.topic && <Text type="secondary">{data.topic}</Text>}
                        {data.score && <Tag color="green">{data.score}%</Tag>}
                      </Space>
                    );
                    return data.action || '-';
                  }
                },
                {
                  title: 'Duration',
                  dataIndex: 'duration',
                  key: 'duration',
                  render: (mins) => mins ? (
                    <Tooltip title={`${mins} minutes`}>
                      {mins >= 60 ? `${Math.round(mins/60)}h ${mins%60}m` : `${mins}m`}
                    </Tooltip>
                  ) : '-'
                }
              ]}
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} activities`
              }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Learning Stats" className="learning-stats">
            <Tabs defaultActiveKey="quiz">
              <TabPane tab="Quiz Performance" key="quiz">
                <div className="stat-group">
                  <Statistic 
                    title="Total Quizzes"
                    value={stats.quizzes.length}
                    prefix={<RocketOutlined />}
                  />
                  {stats.quizzes.length > 0 && (
                    <div className="quiz-stats">
                      <AntProgress 
                        type="circle"
                        percent={Math.round(stats.quizzes.reduce((acc, quiz) => acc + quiz.score, 0) / stats.quizzes.length)}
                        width={80}
                      />
                      <Text type="secondary">Average Score</Text>
                    </div>
                  )}
                </div>
              </TabPane>
              <TabPane tab="Flashcard Progress" key="flashcard">
                <Row gutter={[8, 16]}>
                  <Col span={12}>
                    <Statistic 
                      title="Total Cards"
                      value={stats.flashcards.total}
                      prefix={<BulbOutlined />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic 
                      title="Mastered"
                      value={stats.flashcards.mastered}
                      prefix={<CheckCircleOutlined />}
                    />
                  </Col>
                  <Col span={24}>
                    <AntProgress 
                      percent={stats.flashcards.total > 0 ? 
                        Math.round((stats.flashcards.mastered / stats.flashcards.total) * 100) : 0
                      }
                      status="active"
                      strokeColor="#722ed1"
                    />
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Card>

          <Card title="Study Habits" className="study-habits" style={{ marginTop: '16px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="habit-item">
                <Text>Best Study Time</Text>
                <Tag color="blue">Evening</Tag>
              </div>
              <div className="habit-item">
                <Text>Most Active Day</Text>
                <Tag color="green">Wednesday</Tag>
              </div>
              <div className="habit-item">
                <Text>Average Session</Text>
                <Tag color="purple">45 minutes</Tag>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Progress;
