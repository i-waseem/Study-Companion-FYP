import React, { useState, useEffect, useContext } from 'react';
import { 
  Card, Row, Col, Typography, 
  Statistic, Progress as AntProgress,
  Tag, Space, Empty, Select, Spin,
  Alert, Timeline
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



  // Format last active time
  const formatLastActive = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes}m ago`;
      }
      return `${diffInHours}h ago`;
    }
    return date.toLocaleDateString();
  };
  
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
          const { studyHabits = {}, quizzes = [], subjects = [], flashcards = {} } = progressRes.data;
          
          setStats({
            quizzes,
            subjects,
            flashcards: {
              total: flashcards.total || 0,
              mastered: flashcards.mastered || 0,
              reviewing: flashcards.reviewing || 0,
              learning: flashcards.learning || 0
            }
          });

          // Update activity stats from studyHabits
          setActivityStats(prevStats => ({
            ...prevStats,
            totalStudyTime: studyHabits.totalStudyTime || 0,
            streakData: studyHabits.streakData || {
              current: 0,
              longest: 0,
              lastStudied: null
            }
          }));
        }

        if (activitiesRes.data) {
          setActivities(activitiesRes.data.activities || []);
          // Set activity stats from response
          if (activitiesRes.data.stats) {
            const stats = activitiesRes.data.stats;
            setActivityStats({
              totalStudyTime: stats.studyHabits?.totalStudyTime || 0,
              activityCounts: stats.activityCounts || {
                quiz: 0,
                flashcard: 0,
                career: 0,
                notes: 0
              },
              streakData: stats.studyHabits?.streakData || {
                current: 0,
                longest: 0,
                lastStudied: null
              }
            });
          }
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
    <Row gutter={[16, 16]}>
      {/* Overview */}
      <Col xs={24}>
        <Card title={<Title level={4}><FireOutlined /> Study Overview</Title>}>
          <Row gutter={[16, 16]} className="stats-overview">
            <Col xs={12}>
              <Card>
                <Statistic
                  title="Current Streak"
                  value={`${activityStats.streakData.current} days`}
                  prefix={<FireOutlined style={{ color: '#ff4d4f' }} />}
                />
              </Card>
            </Col>
            <Col xs={12}>
              <Card>
                <Statistic
                  title="Last Active"
                  value={formatLastActive(activityStats.streakData.lastStudied)}
                  prefix={<CalendarOutlined style={{ color: '#52c41a' }} />}
                />
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>

      {/* Flashcard Progress */}
      <Col xs={24}>
        <Card title={<Title level={4}><ReadOutlined /> Flashcard Progress</Title>}>
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
                    '100%': '#52c41a'
                  }}
                  style={{ marginTop: 16 }}
                />
              </Card>
            </Col>
            <Col xs={24} md={16}>
              <Row gutter={[16, 16]}>
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
              </Row>
            </Col>
          </Row>
        </Card>
      </Col>

      {/* Quiz Progress */}
      <Col xs={24}>
        <Card title={<Title level={4}><QuestionCircleOutlined /> Quiz Progress</Title>}>
          {stats.quizzes.length > 0 ? (
            <div>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Statistic
                    title="Total Quizzes"
                    value={stats.quizzes.length}
                    prefix={<QuestionCircleOutlined style={{ color: '#1890ff' }} />}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Statistic
                    title="Average Score"
                    value={`${Math.round(stats.quizzes.reduce((acc, quiz) => acc + quiz.score, 0) / stats.quizzes.length)}%`}
                    prefix={<TrophyOutlined style={{ color: '#52c41a' }} />}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Statistic
                    title="Mastered Topics"
                    value={stats.subjects.reduce((acc, subject) => 
                      acc + subject.topics.reduce((tacc, topic) => 
                        tacc + (topic.subtopics?.filter(st => st.status === 'mastered')?.length || 0), 0
                      ), 0
                    )}
                    prefix={<TrophyOutlined style={{ color: '#722ed1' }} />}
                  />
                </Col>
              </Row>

              {/* Recent Quiz Attempts */}
              <Card style={{ marginTop: 16 }} type="inner" title="Recent Quiz Attempts">
                <Timeline>
                  {stats.quizzes.slice(-5).reverse().map((quiz, index) => (
                    <Timeline.Item 
                      key={index}
                      color={quiz.score >= 80 ? 'green' : quiz.score >= 60 ? 'blue' : 'red'}
                    >
                      <Card size="small">
                        <Row gutter={[16, 8]}>
                          <Col span={24}>
                            <Text strong>{quiz.subject} - {quiz.topic}</Text>
                            <Tag color={quiz.score >= 80 ? 'success' : quiz.score >= 60 ? 'processing' : 'error'} style={{ marginLeft: 8 }}>
                              {quiz.score}%
                            </Tag>
                            {quiz.improvement && quiz.improvement.improvement > 0 && (
                              <Tag color="green" style={{ marginLeft: 8 }}>
                                +{quiz.improvement.improvement}% Improvement
                              </Tag>
                            )}
                          </Col>
                          <Col span={12}>
                            <Text type="secondary">Correct: {quiz.correctAnswers}/{quiz.totalQuestions}</Text>
                          </Col>
                          <Col span={12} style={{ textAlign: 'right' }}>
                            <Text type="secondary">{new Date(quiz.timestamp).toLocaleDateString()}</Text>
                          </Col>
                        </Row>
                      </Card>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            </div>
          ) : (
            <Empty description="No quizzes completed yet" />
          )}
        </Card>
      </Col>
    </Row>
  </div>
  );
};

export default Progress;
