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

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quote, setQuote] = useState('');
  const [source, setSource] = useState('');
  const [quoteError, setQuoteError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [isGemini, setIsGemini] = useState(false);

  useEffect(() => {
    let mounted = true;

    const getQuote = async () => {
      try {
        setQuoteLoading(true);
        setQuoteError(false);
        const response = await getGeminiResponse();
        if (mounted) {
          setQuote(response.quote);
          setSource(response.source);
          setIsGemini(response.isGemini);
          
          if (response.error) {
            setQuoteError(true);
            setErrorMessage(response.message || 'Unknown error');
          }
        }
      } catch (error) {
        console.error('Error fetching quote:', error);
        if (mounted) {
          setQuoteError(true);
          setErrorMessage(error.message || 'Failed to fetch quote');
        }
      } finally {
        if (mounted) {
          setQuoteLoading(false);
        }
      }
    };

    getQuote();

    return () => {
      mounted = false;
    };
  }, []);

  const fetchNewQuote = async () => {
    try {
      setQuoteLoading(true);
      setQuoteError(false);
      const response = await getGeminiResponse();
      setQuote(response.quote);
      setSource(response.source);
      setIsGemini(response.isGemini);
      
      if (response.error) {
        setQuoteError(true);
        setErrorMessage(response.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      setQuoteError(true);
      setErrorMessage(error.message || 'Failed to fetch quote');
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleStartStudy = () => {
    navigate('/study-session');
  };

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  const handleViewNotes = () => {
    navigate('/notes');
  };

  const handleViewFlashcards = () => {
    navigate('/flashcards');
  };

  const handleCareerGuidance = () => {
    navigate('/career-guidance');
  };

  const handleViewDashboard = () => {
    navigate('/dashboard');
  };

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
              {quoteLoading ? (
                <p className="quote-text">Loading your daily motivation...</p>
              ) : quoteError ? (
                <div>
                  <Alert
                    message="Gemini API Error"
                    description={quote || errorMessage || "Unable to connect to Gemini API"}
                    type="error"
                    showIcon
                  />
                  <Button onClick={fetchNewQuote} type="primary" style={{ marginTop: '10px' }}>Try Again</Button>
                </div>
              ) : (
                <blockquote>
                  "{quote}"
                  <footer>
                    — {source || 'Unknown'}
                  </footer>
                </blockquote>
              )}
              {!quoteLoading && !quoteError && (
                <Button onClick={fetchNewQuote} type="primary">Get New Quote</Button>
              )}
            </div>
          </Card>
        </div>

        <div className="actions-section">
          <Row gutter={[16, 16]}>
            <Col xs={6}>
              <Card className="action-card whats-new-card">
                <NotificationOutlined className="card-icon" />
                <h3>What's New</h3>
                <Timeline
                  className="mini-timeline"
                  items={[
                    {
                      children: 'New AI-powered quiz generation'
                    },
                    {
                      children: 'Improved flashcard study mode'
                    }
                  ]}
                />
              </Card>
            </Col>
            <Col xs={6}>
              <Card 
                className="action-card quiz-card"
                onClick={handleStartQuiz}
                hoverable
              >
                <RocketOutlined className="card-icon" />
                <h3>Take a Quiz</h3>
                <p>Test your knowledge</p>
              </Card>
            </Col>
            <Col xs={6}>
              <Card 
                className="action-card flashcard-card"
                onClick={handleViewFlashcards}
                hoverable
              >
                <BulbOutlined className="card-icon" />
                <h3>Flashcards</h3>
                <p>Review with flashcards</p>
              </Card>
            </Col>
            <Col xs={6}>
              <Card 
                className="action-card dashboard-card"
                onClick={handleViewDashboard}
                hoverable
              >
                <TrophyOutlined className="card-icon" />
                <h3>Dashboard</h3>
                <p>View your progress</p>
              </Card>
            </Col>
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
                  <Button type="link" icon={<FileTextOutlined />} onClick={handleViewNotes}>
                    Notes
                  </Button>
                  <Button type="link" icon={<TeamOutlined />} onClick={handleCareerGuidance}>
                    Career Guidance
                  </Button>
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
