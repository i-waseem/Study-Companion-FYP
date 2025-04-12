import React, { useState, useEffect, useContext } from 'react';
import { 
  Card, Row, Col, Typography, Tabs, 
  Table, Alert, Statistic, Progress as AntProgress,
  Tag, Space, Tooltip, Empty, Select, Spin
} from 'antd';
import { 
  TrophyOutlined, FireOutlined, ClockCircleOutlined, 
  StarOutlined, BookOutlined, BulbOutlined, RocketOutlined,
  CheckCircleOutlined, BarChartOutlined,
  QuestionCircleOutlined, ReadOutlined, CompassOutlined
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
    }
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

  // Loading state
  if (loading) {
    return (
      <div className="progress-container" style={{ textAlign: 'center', padding: '50px' }}>
        <Space direction="vertical" size="large">
          <Spin size="large" />
          <Text>Loading your progress...</Text>
        </Space>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="progress-container" style={{ padding: '50px' }}>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  // Not logged in state
  if (!user) {
    return (
      <div className="progress-container" style={{ padding: '50px' }}>
        <Alert
          message="Not Logged In"
          description="Please log in to view your progress."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="progress-container">
      <Row gutter={[16, 16]}>
        {/* Main stats section */}
        <Col xs={24} lg={16}>
          <Card title="Progress Overview">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* Time range selector */}
              <div>
                <Text>Time Range: </Text>
                <Select 
                  value={selectedTimeRange}
                  onChange={setSelectedTimeRange}
                  style={{ width: 120, marginLeft: 8 }}
                >
                  <Option value="week">Last Week</Option>
                  <Option value="month">Last Month</Option>
                  <Option value="year">Last Year</Option>
                </Select>
              </div>

              {/* Activity type filter */}
              <div>
                <Text>Activity Type: </Text>
                <Select
                  value={selectedActivityType}
                  onChange={setSelectedActivityType}
                  style={{ width: 120, marginLeft: 8 }}
                >
                  <Option value="all">All</Option>
                  <Option value="quiz">Quiz</Option>
                  <Option value="flashcard">Flashcard</Option>
                  <Option value="notes">Notes</Option>
                </Select>
              </div>

              {/* Activity stats */}
              <div>
                <Title level={4}>Activity Stats</Title>
                <Row gutter={[16, 16]}>
                  {Object.entries(activityStats.activityCounts).map(([type, count]) => (
                    <Col key={type} xs={12} sm={6}>
                      <Card>
                        <Statistic
                          title={type.charAt(0).toUpperCase() + type.slice(1)}
                          value={count}
                          prefix={ActivityIcon[type]}
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Side stats section */}
        <Col xs={24} lg={8}>
          <Card title="Learning Stats">
            <Tabs
              defaultActiveKey="quiz"
              items={[
                {
                  key: 'quiz',
                  label: 'Quiz Performance',
                  children: (
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
                            size={80}
                          />
                          <Text type="secondary">Average Score</Text>
                        </div>
                      )}
                    </div>
                  )
                },
                {
                  key: 'flashcard',
                  label: 'Flashcard Progress',
                  children: (
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
                  )
                }
              ]}
            />
          </Card>

          <Card title="Study Habits" style={{ marginTop: '16px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="habit-item">
                <Text>Current Streak</Text>
                <Tag color="blue">{activityStats.streakData.current} days</Tag>
              </div>
              <div className="habit-item">
                <Text>Longest Streak</Text>
                <Tag color="gold">{activityStats.streakData.longest} days</Tag>
              </div>
              <div className="habit-item">
                <Text>Total Study Time</Text>
                <Tag color="purple">
                  {activityStats.totalStudyTime >= 60
                    ? `${Math.floor(activityStats.totalStudyTime / 60)}h ${activityStats.totalStudyTime % 60}m`
                    : `${activityStats.totalStudyTime}m`}
                </Tag>
              </div>
              <div className="habit-item">
                <Text>Last Active</Text>
                <Tag color="cyan">
                  {activityStats.streakData.lastStudied
                    ? new Date(activityStats.streakData.lastStudied).toLocaleDateString()
                    : 'Never'}
                </Tag>
              </div>
              <div className="habit-item">
                <Text>Activity Distribution</Text>
                <div style={{ marginTop: '8px' }}>
                  {Object.entries(activityStats.activityCounts).map(([type, count]) => (
                    <Tag 
                      key={type} 
                      icon={ActivityIcon[type]}
                      color={type === 'quiz' ? 'green' : type === 'flashcard' ? 'purple' : type === 'notes' ? 'blue' : 'orange'} 
                      style={{ margin: '0 4px 4px 0' }}
                    >
                      {type}: {count}
                    </Tag>
                  ))}
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Progress;
