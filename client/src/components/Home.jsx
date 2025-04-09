import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Row, Col, Card, Button, Statistic, Calendar, Timeline, Avatar, Alert } from 'antd';
import { BookOutlined, RocketOutlined, BulbOutlined, TrophyOutlined, 
         ScheduleOutlined, TeamOutlined, FileTextOutlined, StarOutlined, NotificationOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { getGeminiResponse } from '../utils/gemini';
import logo from '../assets/SC2.png';
import './Home.css';

const { Content } = Layout;

// Navigation menu items configuration
const MENU_ITEMS = [
  { path: '/study-session', title: 'Study Session', icon: BookOutlined, description: 'Start studying' },
  { path: '/quiz', title: 'Take a Quiz', icon: RocketOutlined, description: 'Test your knowledge' },
  { path: '/notes', title: 'Notes', icon: FileTextOutlined, description: 'View your notes' },
  { path: '/flashcards', title: 'Flashcards', icon: BulbOutlined, description: 'Review with flashcards' },
  { path: '/career-guidance', title: 'Career Guidance', icon: TeamOutlined, description: 'Get career advice' },
  { path: '/dashboard', title: 'Dashboard', icon: TrophyOutlined, description: 'View your progress' }
];

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Quote state management
  const [quoteState, setQuoteState] = useState({
    quote: '',
    source: '',
    error: false,
    errorMessage: '',
    loading: true,
    isGemini: false
  });

  // Handle navigation
  const handleNavigation = (path) => () => navigate(path);

  // Fetch quote from Gemini API
  const fetchQuote = async (mounted = true) => {
    try {
      setQuoteState(prev => ({ ...prev, loading: true, error: false }));
      const response = await getGeminiResponse(null, 'quote');
      
      if (mounted) {
        setQuoteState(prev => ({
          ...prev,
          quote: response.quote,
          source: response.source,
          isGemini: response.isGemini,
          error: response.error,
          errorMessage: response.error ? (response.message || 'Unknown error') : '',
          loading: false
        }));
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      if (mounted) {
        setQuoteState(prev => ({
          ...prev,
          error: true,
          errorMessage: error.message || 'Failed to fetch quote',
          loading: false
        }));
      }
    }
  };

  // Initial quote fetch
  useEffect(() => {
    let mounted = true;
    fetchQuote(mounted);
    return () => { mounted = false; };
  }, []);

  return (
    <Layout className="home-layout">
      <Content className="home-content">
        <div className="welcome-section">
          <Card className="brand-card">
            <div className="brand-section">
              <div className="brand-content">
                <div className="brand-logo">
                  <img src={logo} alt="Study Companion Logo" />
                </div>
                <h1>Study Companion</h1>
              </div>
              <div className="ai-badge">Powered by AI</div>
            </div>
          </Card>

          <Card className="quote-card">
            <div className="motivation-section">
              <h3>Today's Motivation</h3>
              {quoteState.loading ? (
                <p className="quote-text">Loading your daily motivation...</p>
              ) : quoteState.error ? (
                <div>
                  <Alert
                    message="Gemini API Error"
                    description={quoteState.quote || quoteState.errorMessage || "Unable to connect to Gemini API"}
                    type="error"
                    showIcon
                  />
                  <Button onClick={() => fetchQuote(true)} type="primary" style={{ marginTop: '10px' }}>Try Again</Button>
                </div>
              ) : (
                <blockquote>
                  <p className="quote-text">{quoteState.quote}</p>
                  {quoteState.source && <p className="quote-source">- {quoteState.source}</p>}
                </blockquote>
              )}
              {!quoteState.loading && !quoteState.error && (
                <Button className='quote-button' onClick={fetchQuote} type="primary">Get New Quote</Button>
              )}
            </div>
          </Card>
        </div>

        <div className="actions-section">
          <Row gutter={[16, 16]}>
            <Col xs={6}>
              <Card className="action-card whats-new-card">
                <h3>What's New</h3>
                <Timeline
                  className="mini-timeline"
                  items={[
                    { children: 'New AI-powered quiz generation' },
                    { children: 'Improved flashcard study mode' }
                  ]}
                />
              </Card>
            </Col>
            {/* Dynamic action cards */}
            {MENU_ITEMS.slice(1, 4).map((item) => (
              <Col xs={6} key={item.path}>
                <Card 
                  className={`action-card ${item.path.substring(1)}-card`}
                  onClick={handleNavigation(item.path)}
                  hoverable
                >
                  <item.icon className="card-icon" />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <div className="main-content-section">
          <Row gutter={[16, 16]}>
            {/* Left Column - Progress and Activity */}
            <Col xs={24} lg={16}>
              <Card title="Your Progress" className="progress-card">
                <Row gutter={[16, 16]}>
                  <Col xs={8}>
                    <Statistic 
                      title="Study Streak" 
                      value={user?.studyStreak || 0} 
                      suffix="days"
                    />
                  </Col>
                  <Col xs={8}>
                    <Statistic 
                      title="Quizzes Taken" 
                      value={user?.quizHistory?.length || 0}
                    />
                  </Col>
                  <Col xs={8}>
                    <Statistic 
                      title="Average Score" 
                      value={75} 
                      suffix="%"
                    />
                  </Col>
                </Row>
              </Card>

              <Card title="Recent Activity" className="activity-card">
                <Timeline
                  items={[
                    {
                      dot: <BookOutlined />,
                      children: 'Completed Mathematics Quiz - 85%'
                    },
                    {
                      dot: <BulbOutlined />,
                      children: 'Created new Physics flashcards'
                    },
                    {
                      dot: <RocketOutlined />,
                      children: 'Achieved study streak of 3 days'
                    }
                  ]}
                />
              </Card>
            </Col>

            {/* Right Column - Calendar and Quick Links */}
            <Col xs={24} lg={8}>
              <Card title="Study Calendar" className="calendar-card">
                <div className="calendar-wrapper">
                  <Calendar fullscreen={false} />
                </div>
              </Card>

              <Card title="Quick Links" className="quick-links-card">
                <div className="quick-links-wrapper">
                  {MENU_ITEMS.filter(item => ['Notes', 'Career Guidance'].includes(item.title)).map((item) => (
                    <Button 
                      key={item.path}
                      type="link" 
                      icon={<item.icon />} 
                      onClick={handleNavigation(item.path)}
                    >
                      {item.title}
                    </Button>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}

export default Home;
