import React, { useState, useEffect } from 'react';
import { Card, Typography, List, Button, Collapse, Space, Modal, Spin, Alert } from 'antd';
import { CodeOutlined, BookOutlined, LineChartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../api/config';
import './Subjects.css';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const iconMap = {
  'Computer Science': <CodeOutlined />,
  'Pakistan Studies - History': <BookOutlined />,
  'Pakistan Studies - Geography': <BookOutlined />,
  'Economics': <LineChartOutlined />
};

const colorMap = {
  'Computer Science': '#1890ff',
  'Pakistan Studies - History': '#52c41a',
  'Pakistan Studies - Geography': '#52c41a',
  'Economics': '#722ed1'
};

function Subjects() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [curriculumMap, setCurriculumMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllTopics, setShowAllTopics] = useState({});  // Track expanded state for each subject

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First fetch all available subjects
        console.log('Fetching subjects...');
        const subjectsResponse = await api.get('/curriculum/subjects');
        console.log('Subjects response:', subjectsResponse.data);
        
        if (!subjectsResponse.data || !Array.isArray(subjectsResponse.data)) {
          throw new Error('Invalid subjects data format');
        }
        
        const availableSubjects = subjectsResponse.data.filter(s => s.gradeLevel === 'O-Level');
        console.log('Filtered O-Level subjects:', availableSubjects);
        setSubjects(availableSubjects);

        // Then fetch curriculum for each subject
        const curriculumData = {};
        for (const subject of availableSubjects) {
          try {
            console.log(`Fetching curriculum for ${subject.subject} (${subject.urlFriendlySubject})`);
            const response = await api.get(`/curriculum/o-level/${subject.urlFriendlySubject}`);
            console.log(`Curriculum response for ${subject.subject}:`, response.data);
            if (response.data && response.data.topics) {
              curriculumData[subject.subject] = response.data;
            } else {
              console.error(`Invalid curriculum data for ${subject.subject}`);
            }
          } catch (err) {
            console.error(`Failed to fetch curriculum for ${subject.subject}:`, err);
            setError(prev => prev || 'Failed to fetch some curriculum data');
          }
        }
        
        console.log('Final curriculum data:', curriculumData);
        setCurriculumMap(curriculumData);
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
        setError('Failed to fetch subject data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubjects();
  }, []);

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
  };

  const handleStudyModeSelect = (mode, subject) => {
    // Find the urlFriendlySubject for the selected subject
    const selectedSubjectObj = subjects.find(s => s.subject === subject);
    
    if (!selectedSubjectObj) {
      console.error(`Subject not found: ${subject}`);
      return;
    }
    
    const urlFriendlySubject = selectedSubjectObj.urlFriendlySubject;
    
    if (mode === 'quiz') {
      navigate(`/subject-selection/${urlFriendlySubject}`);
    } else if (mode === 'flashcards') {
      navigate(`/flashcards/${urlFriendlySubject}`);
    }
    
    setSelectedSubject(null);
  };

  const toggleTopics = (subject, event) => {
    event.stopPropagation();  // Prevent card click when clicking "Show More"
    setShowAllTopics(prev => ({
      ...prev,
      [subject]: !prev[subject]
    }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Space direction="vertical" align="center">
          <Spin size="large" />
          <Text>Loading subjects...</Text>
        </Space>
      </div>
    );
  }

  return (
    <div className="subjects-container">
      <Title level={2}>O Level Subjects</Title>
      <p className="subtitle">Select a subject to begin studying.</p>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="error-alert"
          style={{ marginBottom: '1rem' }}
        />
      )}

      <div className="subjects-grid">
        {subjects.map((subject) => {
          const icon = iconMap[subject.subject] || <BookOutlined />;
          const color = colorMap[subject.subject] || '#1890ff';
          const curriculum = curriculumMap[subject.subject];
          const isExpanded = showAllTopics[subject.subject];

          return (
            <Card
              key={subject.urlFriendlySubject}
              className={`subject-card ${selectedSubject === subject.subject ? 'selected' : ''}`}
              onClick={() => handleSubjectClick(subject.subject)}
              style={{ borderColor: color }}
            >
              <div className="subject-icon" style={{ color }}>
                {icon}
              </div>
              <Title level={4}>{subject.subject}</Title>
              <div className="subject-details">
                <Title level={5}>Key Topics:</Title>
                {curriculum ? (
                  <>
                    <List
                      size="small"
                      dataSource={isExpanded ? curriculum.topics : curriculum.topics.slice(0, 3)}
                      renderItem={topic => (
                        <List.Item>
                          <Text>{topic.name}</Text>
                        </List.Item>
                      )}
                    />
                    {curriculum.topics.length > 3 && (
                      <Button 
                        type="link" 
                        onClick={(e) => toggleTopics(subject.subject, e)}
                        style={{ padding: 0, height: 'auto' }}
                      >
                        {isExpanded ? 'Show Less' : `Show ${curriculum.topics.length - 3} More Topics`}
                      </Button>
                    )}
                  </>
                ) : (
                  <Text type="secondary">Loading topics...</Text>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        title="Choose Study Mode"
        open={!!selectedSubject}
        onCancel={() => setSelectedSubject(null)}
        footer={null}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            type="primary"
            block
            onClick={() => handleStudyModeSelect('quiz', selectedSubject)}
          >
            Take a Quiz
          </Button>
          <Button
            block
            onClick={() => handleStudyModeSelect('flashcards', selectedSubject)}
          >
            Study with Flashcards
          </Button>
        </Space>
      </Modal>
    </div>
  );
}

export default Subjects;
