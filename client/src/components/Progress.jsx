import React, { useState, useEffect, useContext } from 'react';
import { 
  Card, Row, Col, Typography, 
  Statistic, Progress as AntProgress,
  Tag, Space, Empty, Select, Spin,
  Alert, Timeline, Collapse, Badge, Tooltip
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
    flashcardProgress: {},
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
          const { studyHabits = {}, quizzes = [], subjects = [] } = progressRes.data;
          
          // Process flashcard activities to calculate mastery levels
          const flashcardActivities = (activitiesRes.data?.activities || [])
            .filter(activity => activity.type === 'flashcard');

          // Group activities by card to get latest confidence ratings
          const cardProgress = {};
          const detailedProgress = {};

          flashcardActivities.forEach(activity => {
            if (!activity.data) return;
            const { subject, topic, subtopic, cardIndex, confidenceRating } = activity.data;
            if (!subject || !topic || !subtopic || cardIndex === undefined || !confidenceRating) return;
            
            const cardKey = `${subject}-${topic}-${subtopic}-${cardIndex}`;
            
            // Only update if this is the latest rating for this card
            if (!cardProgress[cardKey] || activity.timestamp > cardProgress[cardKey].timestamp) {
              cardProgress[cardKey] = {
                timestamp: activity.timestamp,
                confidenceRating,
                subject,
                topic,
                subtopic
              };
            }
          });

          // Calculate mastery levels based on confidence ratings
          const totalCards = Object.keys(cardProgress).length;
          const masteryLevels = { mastered: 0, reviewing: 0, learning: 0 };

          // Organize progress by subject/topic/subtopic
          Object.values(cardProgress).forEach(card => {
            const { subject, topic, subtopic, confidenceRating } = card;

            // Initialize structures if they don't exist
            if (!detailedProgress[subject]) {
              detailedProgress[subject] = {};
            }
            if (!detailedProgress[subject][topic]) {
              detailedProgress[subject][topic] = {};
            }
            if (!detailedProgress[subject][topic][subtopic]) {
              detailedProgress[subject][topic][subtopic] = {
                total: 0,
                mastered: 0,
                reviewing: 0,
                learning: 0
              };
            }

            // Update counts
            const progress = detailedProgress[subject][topic][subtopic];
            progress.total++;

            if (confidenceRating >= 5) {
              progress.mastered++;
              masteryLevels.mastered++;
            } else if (confidenceRating >= 3) {
              progress.reviewing++;
              masteryLevels.reviewing++;
            } else {
              progress.learning++;
              masteryLevels.learning++;
            }
          });

          setStats({
            quizzes,
            subjects,
            flashcards: {
              total: totalCards,
              mastered: masteryLevels.mastered,
              reviewing: masteryLevels.reviewing,
              learning: masteryLevels.learning
            },
            flashcardProgress: detailedProgress
          });

          // Update activity stats
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
          
          // Update activity counts
          const stats = activitiesRes.data.stats || {};
          setActivityStats(prevStats => ({
            ...prevStats,
            activityCounts: stats.activityCounts || {
              quiz: 0,
              flashcard: 0,
              career: 0,
              notes: 0
            }
          }));
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

      {/* Detailed Flashcard Progress */}
      <Col xs={24}>
        <Card title={<Title level={4}><ReadOutlined /> Flashcard Progress by Subject</Title>}>
          {Object.keys(stats.flashcardProgress || {}).length > 0 ? (
            <Collapse>
              {Object.entries(stats.flashcardProgress).map(([subject, topicData]) => {
                // Calculate subject-level statistics
                const subjectStats = Object.values(topicData).reduce((acc, topics) => {
                  Object.values(topics).forEach(cards => {
                    acc.total += cards.total;
                    acc.mastered += cards.mastered;
                    acc.reviewing += cards.reviewing;
                    acc.learning += cards.learning;
                  });
                  return acc;
                }, { total: 0, mastered: 0, reviewing: 0, learning: 0 });

                return (
                  <Collapse.Panel 
                    key={subject} 
                    header={
                      <Row justify="space-between" align="middle" style={{ width: '100%' }}>
                        <Col>
                          <Text strong>{subject}</Text>
                        </Col>
                        <Col>
                          <Space size="middle">
                            <Tooltip title="Total Flashcards">
                              <span>
                                <Text type="secondary" style={{ marginRight: 4 }}>Total:</Text>
                                <Badge count={subjectStats.total} style={{ backgroundColor: '#304979' }} />
                              </span>
                            </Tooltip>
                            <Tooltip title="Cards you've mastered (5 stars)">
                              <span>
                                <Text type="secondary" style={{ marginRight: 4 }}>Mastered:</Text>
                                <Badge count={subjectStats.mastered} style={{ backgroundColor: '#418f63' }} />
                              </span>
                            </Tooltip>
                            <Tooltip title="Cards you're reviewing (3-4 stars)">
                              <span>
                                <Text type="secondary" style={{ marginRight: 4 }}>Reviewing:</Text>
                                <Badge count={subjectStats.reviewing} style={{ backgroundColor: '#5e82c2' }} />
                              </span>
                            </Tooltip>
                            <Tooltip title="Cards you're learning (1-2 stars)">
                              <span>
                                <Text type="secondary" style={{ marginRight: 4 }}>Learning:</Text>
                                <Badge count={subjectStats.learning} style={{ backgroundColor: '#304979' }} />
                              </span>
                            </Tooltip>
                          </Space>
                        </Col>
                      </Row>
                    }
                  >
                    <Collapse>
                      {Object.entries(topicData).map(([topic, subtopics]) => {
                        // Calculate topic-level statistics
                        const topicStats = Object.values(subtopics).reduce((acc, cards) => {
                          acc.total += cards.total;
                          acc.mastered += cards.mastered;
                          acc.reviewing += cards.reviewing;
                          acc.learning += cards.learning;
                          return acc;
                        }, { total: 0, mastered: 0, reviewing: 0, learning: 0 });

                        return (
                          <Collapse.Panel 
                            key={topic}
                            header={
                              <Row justify="space-between" align="middle" style={{ width: '100%' }}>
                                <Col>
                                  <Text>{topic}</Text>
                                </Col>
                                <Col>
                                  <Space size="middle">
                                    <Tooltip title="Total Flashcards">
                                      <span>
                                        <Text type="secondary" style={{ marginRight: 4 }}>Total:</Text>
                                        <Badge count={topicStats.total} style={{ backgroundColor: '#304979' }} />
                                      </span>
                                    </Tooltip>
                                    <Tooltip title="Cards you've mastered (5 stars)">
                                      <span>
                                        <Text type="secondary" style={{ marginRight: 4 }}>Mastered:</Text>
                                        <Badge count={topicStats.mastered} style={{ backgroundColor: '#418f63' }} />
                                      </span>
                                    </Tooltip>
                                    <Tooltip title="Cards you're reviewing (3-4 stars)">
                                      <span>
                                        <Text type="secondary" style={{ marginRight: 4 }}>Reviewing:</Text>
                                        <Badge count={topicStats.reviewing} style={{ backgroundColor: '#5e82c2' }} />
                                      </span>
                                    </Tooltip>
                                    <Tooltip title="Cards you're learning (1-2 stars)">
                                      <span>
                                        <Text type="secondary" style={{ marginRight: 4 }}>Learning:</Text>
                                        <Badge count={topicStats.learning} style={{ backgroundColor: '#304979' }} />
                                      </span>
                                    </Tooltip>
                                  </Space>
                                </Col>
                              </Row>
                            }
                          >
                            {Object.entries(subtopics).map(([subtopic, cards]) => (
                              <Card key={subtopic} style={{ marginBottom: '12px' }}>
                                <Row justify="space-between" align="middle">
                                  <Col>
                                    <Text strong>{subtopic}</Text>
                                  </Col>
                                  <Col>
                                    <Space size="middle">
                                      <Tooltip title="Total number of flashcards in this subtopic">
                                        <span>
                                          <Text type="secondary" style={{ marginRight: 4 }}>Total:</Text>
                                          <Badge count={cards.total} style={{ backgroundColor: '#304979' }} />
                                        </span>
                                      </Tooltip>
                                      <Tooltip title="Cards you've mastered completely (5 stars)">
                                        <span>
                                          <Text type="secondary" style={{ marginRight: 4 }}>Mastered:</Text>
                                          <Badge count={cards.mastered} style={{ backgroundColor: '#418f63' }} />
                                        </span>
                                      </Tooltip>
                                      <Tooltip title="Cards you're getting better at (3-4 stars)">
                                        <span>
                                          <Text type="secondary" style={{ marginRight: 4 }}>Reviewing:</Text>
                                          <Badge count={cards.reviewing} style={{ backgroundColor: '#5e82c2' }} />
                                        </span>
                                      </Tooltip>
                                      <Tooltip title="Cards you're still learning (1-2 stars)">
                                        <span>
                                          <Text type="secondary" style={{ marginRight: 4 }}>Learning:</Text>
                                          <Badge count={cards.learning} style={{ backgroundColor: '#304979' }} />
                                        </span>
                                      </Tooltip>
                                    </Space>
                                  </Col>
                                </Row>
                                <AntProgress 
                                  percent={100} 
                                  success={{ percent: (cards.mastered / cards.total) * 100 }}
                                  strokeColor={{
                                    '0%': '#304979',
                                    '50%': '#5e82c2',
                                    '100%': '#418f63'
                                  }}
                                  style={{ marginTop: '8px' }}
                                />
                              </Card>
                            ))}
                          </Collapse.Panel>
                        );
                      })}
                    </Collapse>
                  </Collapse.Panel>
                );
              })}
            </Collapse>
          ) : (
            <Empty description="No flashcard progress yet" />
          )}
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
