import React, { useState, useEffect, useContext } from 'react';
import { 
  Card, Row, Col, Typography, 
  Statistic, Progress as AntProgress,
  Tag, Space, Empty, Select, Spin,
  Alert
} from 'antd';
import { 
  TrophyOutlined, FireOutlined, ClockCircleOutlined, 
  CalendarOutlined, BarChartOutlined,
  QuestionCircleOutlined, ReadOutlined,
  CompassOutlined, BookOutlined
} from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';
import api from '../api/config';
import './Progress.css';

const { Title, Text } = Typography;
const { Option } = Select;

// Activity type icons mapping
const ActivityIcon = {
  quiz: <QuestionCircleOutlined />,
  flashcard: <ReadOutlined />,
  career: <CompassOutlined />,
  notes: <BookOutlined />
};

const Progress = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Stats state
  const [stats, setStats] = useState({ 
    quizzes: [], 
    subjects: [],
    flashcards: {
      total: 0,
      mastered: 0,
      reviewing: 0,
      learning: 0
    },
    subjectProgress: {}
  });
  
  // Activities state
  const [activities, setActivities] = useState([]);
  const [activityStats, setActivityStats] = useState({ 
    totalStudyTime: 0, 
    activityCounts: { 
      quiz: 0, 
      flashcard: 0, 
      career: 0,
      notes: 0
    },
    streakData: {
      current: 0,
      longest: 0,
      lastStudied: null
    }
  });
  
  // Filters state
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [selectedActivityType, setSelectedActivityType] = useState('all');

  // Get date range based on selected time range
  const getDateRange = () => {
    const now = new Date();
    const startDate = new Date();
    
    switch (selectedTimeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }
    
    return { startDate, endDate: now };
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const { startDate, endDate } = getDateRange();
        
        const [progressRes, activitiesRes] = await Promise.all([
          api.getProgress(),
          api.getActivities({
            type: selectedActivityType !== 'all' ? selectedActivityType : undefined,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
          })
        ]);

        if (progressRes.data) {
          setStats({
            quizzes: progressRes.data.quizzes || [],
            subjects: progressRes.data.subjects || [],
            flashcards: progressRes.data.flashcards || {
              total: 0,
              mastered: 0,
              reviewing: 0,
              learning: 0
            }
          });
        }

        if (activitiesRes.data) {
          setActivities(activitiesRes.data.activities || []);
          const stats = activitiesRes.data.stats || {};
          setActivityStats({
            totalStudyTime: stats.totalStudyTime || 0,
            activityCounts: stats.activityCounts || {
              quiz: 0,
              flashcard: 0,
              career: 0,
              notes: 0
            },
            streakData: stats.streakData || {
              current: 0,
              longest: 0,
              lastStudied: null
            }
          });
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching progress data:', err);
        setError('Failed to load progress data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, [user, selectedTimeRange, selectedActivityType]);

  // Not logged in state
  if (!user) {
    return (
      <div className="progress-container">
        <Alert
          message="Not Logged In"
          description="Please log in to view your progress."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="progress-container">
        <Space direction="vertical" align="center" style={{ width: '100%', padding: '50px' }}>
          <Spin size="large" />
          <Text>Loading your progress...</Text>
        </Space>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="progress-container">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  // Main content
  return (
    <div className="progress-container">
      {/* Filters Section */}
      <Row gutter={[16, 16]}>
        {/* Overview */}
        <Col xs={24}>
          <Card title={<Title level={4}><FireOutlined /> Study Overview</Title>}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Statistic
                  title="Current Streak"
                  value={activityStats.streakData.current}
                  suffix="days"
                  prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
                />
              </Col>
              <Col xs={24} md={8}>
                <Statistic
                  title="Study Time"
                  value={activityStats.totalStudyTime}
                  suffix="m"
                  prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
                />
              </Col>
              <Col xs={24} md={8}>
                <Statistic
                  title="Last Active"
                  value={activityStats.streakData.lastStudied ? 
                    new Date(activityStats.streakData.lastStudied).toLocaleDateString() : 
                    'Never'
                  }
                  prefix={<CalendarOutlined style={{ color: '#52c41a' }} />}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Quiz Progress */}
        <Col xs={24}>
          <Card 
            title={<Title level={4}><QuestionCircleOutlined /> Quiz Progress</Title>}
            className="subject-progress-card"
          >
            {stats.quizzes.length > 0 ? (
              <div>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Statistic
                      title="Total Quizzes"
                      value={stats.quizzes.length}
                      prefix={<QuestionCircleOutlined style={{ color: '#1890ff' }} />}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <Statistic
                      title="Average Score"
                      value={`${Math.round(stats.quizzes.reduce((acc, quiz) => acc + quiz.score, 0) / stats.quizzes.length)}%`}
                      prefix={<TrophyOutlined style={{ color: '#52c41a' }} />}
                    />
                  </Col>
                </Row>
                <div style={{ marginTop: 24 }}>
                  <Text strong>Recent Quiz Performance</Text>
                  <div className="quiz-history">
                    {stats.quizzes.slice(-3).reverse().map((quiz, index) => (
                      <Card key={index} className="quiz-card">
                        <div className="quiz-info">
                          <Text strong>{quiz.subject}</Text>
                          <div>{quiz.topic}</div>
                          <div className="quiz-score">{quiz.score}%</div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Empty description="No quizzes completed yet" />
            )}
          </Card>
        </Col>

        {/* Flashcard Progress */}
        <Col xs={24}>
          <Card 
            title={<Title level={4}><ReadOutlined /> Flashcard Progress</Title>}
            className="flashcard-progress-card"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card className="stat-card">
                  <Statistic
                    title="Total Flashcards"
                    value={stats.flashcards.total}
                    prefix={<ReadOutlined style={{ color: '#722ed1' }} />}
                  />
                  <AntProgress
                    percent={stats.flashcards.total > 0 ? 
                      Math.round((stats.flashcards.mastered / stats.flashcards.total) * 100) : 0
                    }
                    strokeColor={{
                      '0%': '#722ed1',
                      '100%': '#52c41a',
                    }}
                    style={{ marginTop: 16 }}
                  />
                </Card>
              </Col>
              <Col xs={24} md={16}>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Card className="mastery-card mastered">
                      <Statistic
                        title="Mastered"
                        value={stats.flashcards.mastered}
                        suffix={stats.flashcards.total > 0 ? 
                          `(${Math.round((stats.flashcards.mastered / stats.flashcards.total) * 100)}%)` : 
                          '(0%)'
                        }
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card className="mastery-card learning">
                      <Statistic
                        title="Learning"
                        value={stats.flashcards.learning}
                        suffix={stats.flashcards.total > 0 ? 
                          `(${Math.round((stats.flashcards.learning / stats.flashcards.total) * 100)}%)` : 
                          '(0%)'
                        }
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card className="mastery-card reviewing">
                      <Statistic
                        title="Reviewing"
                        value={stats.flashcards.reviewing}
                        suffix={stats.flashcards.total > 0 ? 
                          `(${Math.round((stats.flashcards.reviewing / stats.flashcards.total) * 100)}%)` : 
                          '(0%)'
                        }
                      />
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Progress;
