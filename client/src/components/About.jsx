import React from 'react';
import { Layout, Card, Row, Col, Typography } from 'antd';
import { BookOutlined, RocketOutlined, TeamOutlined, BulbOutlined } from '@ant-design/icons';
import './About.css';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

function About() {
  const features = [
    {
      icon: <BookOutlined className="feature-icon" />,
      title: 'Smart Learning',
      description: 'AI-powered learning experience tailored to your needs'
    },
    {
      icon: <RocketOutlined className="feature-icon" />,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics'
    },
    {
      icon: <TeamOutlined className="feature-icon" />,
      title: 'Career Guidance',
      description: 'Get personalized career advice based on your interests'
    },
    {
      icon: <BulbOutlined className="feature-icon" />,
      title: 'Interactive Learning',
      description: 'Engage with quizzes, flashcards, and study materials'
    }
  ];

  return (
    <Layout className="about-layout">
      <Content className="about-content">
        <div className="about-container">
          <Card className="about-header-card">
            <Title level={1}>About Study Companion</Title>
            <Paragraph className="about-intro">
              Study Companion is your personal AI-powered learning assistant, designed to help O-Level students
              achieve their academic goals through personalized learning experiences.
            </Paragraph>
          </Card>

          <Row gutter={[24, 24]} className="features-section">
            {features.map((feature, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card className="feature-card">
                  <div className="feature-icon-wrapper">
                    {feature.icon}
                  </div>
                  <Title level={3}>{feature.title}</Title>
                  <Paragraph>{feature.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>

          <Card className="mission-card">
            <Title level={2}>Our Mission</Title>
            <Paragraph>
            To revolutionize education for O-level students by providing them with an intelligent, personalized learning
            companion that adapts to their unique needs and helps them excel in their studies.
            </Paragraph>
          </Card>

          <Row gutter={[24, 24]} className="details-section">
            <Col xs={24} md={12}>
              <Card className="tech-card">
                <Title level={2}>Technology</Title>
                <Paragraph>
                  Powered by advanced AI technologies including:
                </Paragraph>
                <ul>
                  <li>Google's Gemini AI for intelligent interactions</li>
                  <li>Adaptive learning algorithms</li>
                  <li>Real-time progress tracking</li>
                  <li>Smart quiz generation</li>
                  <li>Smart flashcard practice</li>
                  <li>Notes generation</li>
                </ul>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className="benefits-card">
                <Title level={2}>Benefits</Title>
                <Paragraph>
                  What makes Study Companion special:
                </Paragraph>
                <ul>
                  <li>Personalized learning paths</li>
                  <li>Interactive study materials</li>
                  <li>Progress monitoring</li>
                  <li>Career guidance</li>
                  <li>24/7 learning support</li>
                  <li>Feedback and suggestions to admin</li>
                </ul>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}

export default About;
