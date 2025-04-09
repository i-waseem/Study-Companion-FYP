import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Select, Button, Typography, Alert, Spin, Steps } from 'antd';
import { BookOutlined, CheckCircleOutlined } from '@ant-design/icons';
import api from '../api/config';
import './SubjectSelection.css';

const { Title } = Typography;
const { Option } = Select;
const { Step } = Steps;

// Helper function to convert subject name to URL-friendly format
const toUrlFriendly = (subject) => {
  if (!subject) return '';
  // Special case for Pakistan Studies
  if (subject.startsWith('Pakistan Studies')) {
    const type = subject.split('- ')[1];
    return `pakistan-studies-${type.toLowerCase()}`;
  }
  return subject.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

// Helper function to convert URL-friendly format back to display format
const fromUrlFriendly = (urlSubject) => {
  if (!urlSubject) return '';
  return urlSubject
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

function SubjectSelection() {
  const navigate = useNavigate();
  const { subject } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [curriculum, setCurriculum] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(subject || '');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Fetch available subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        console.log('Fetching subjects...');
        const response = await api.get('/curriculum/subjects');
        console.log('Subjects API response:', response.data);
        
        if (response.data && Array.isArray(response.data)) {
          setSubjects(response.data);
          
          // Only auto-select if we don't have a subject from navigation
          if (!subject && !selectedSubject && response.data.length > 0) {
            const firstSubject = response.data[0].urlFriendlySubject;
            console.log('Auto-selecting first subject:', firstSubject);
            setSelectedSubject(firstSubject);
          }
        }
      } catch (err) {
        console.error('Failed to fetch subjects:', err.response || err);
        setError('Failed to load subjects. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch curriculum data for selected subject
  useEffect(() => {
    const fetchCurriculum = async () => {
      if (!selectedSubject) {
        console.log('No subject selected, skipping curriculum fetch');
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching curriculum for subject:', selectedSubject);
        const response = await api.get(`/curriculum/o-level/${selectedSubject}`);
        console.log('Curriculum API response:', response.data);
        
        if (response.data && response.data.topics) {
          console.log('Setting curriculum with topics:', response.data.topics.map(t => t.name));
          setCurriculum(response.data);
        } else {
          console.error('Invalid curriculum data:', response.data);
          setError('Received invalid curriculum data');
        }
      } catch (err) {
        console.error('Failed to fetch curriculum:', err.response || err);
        setError(`Failed to fetch curriculum for ${selectedSubject}`);
        setCurriculum(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculum();
  }, [selectedSubject]);

  // Handle subject change
  const handleSubjectChange = (value) => {
    console.log('Selected subject changed to:', value);
    setSelectedSubject(value);
    setSelectedTopic('');
    setSelectedSubtopic('');
    // Fetch curriculum data when subject changes
    const fetchCurriculumData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/curriculum/o-level/${value}`);
        console.log('Curriculum data:', response.data);
        if (response.data && response.data.topics) {
          setCurriculum(response.data);
          setCurrentStep(1); // Move to topic selection after curriculum is loaded
        }
      } catch (err) {
        console.error('Error fetching curriculum:', err);
        setError('Failed to load curriculum data');
      } finally {
        setLoading(false);
      }
    };
    fetchCurriculumData();
  };

  // Helper function to check if curriculum matches subject
  const doesCurriculumMatchSubject = (curriculumData, subjectData) => {
    if (!curriculumData || !subjectData) return false;
    
    // Try different formats of subject names
    const currSubject = curriculumData.subject.toLowerCase();
    const dataSubject = subjectData.subject.toLowerCase();
    
    // Special case for Pakistan Studies
    if (currSubject.startsWith('pakistan studies') || dataSubject.startsWith('pakistan studies')) {
      const currType = currSubject.includes('-') ? currSubject.split('-')[1].trim() : currSubject;
      const dataType = dataSubject.includes('-') ? dataSubject.split('-')[1].trim() : dataSubject;
      return currType === dataType;
    }
    
    // For other subjects, do a direct match
    return currSubject === dataSubject;
  };

  // Helper function to get display name for subject
  const getDisplayName = (subject) => {
    if (!subject) return '';
    return subject; // Return the full subject name as it comes from the server
  };

  return (
    <div className="quiz-subject-selection">
      <div className="quiz-header">
        <Title level={2}>Let's Set Up Your Quiz!</Title>
        <p className="quiz-subtitle">Follow these steps to create a personalized quiz</p>
      </div>
      
      <div className="quiz-setup-container">
        <div className="progress-indicator">
          <div className={`step ${currentStep >= 0 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Choose Subject</div>
          </div>
          <div className="step-connector" />
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Select Topic</div>
          </div>
          <div className="step-connector" />
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Pick Subtopic</div>
          </div>
        </div>

        {error && <Alert message={error} type="error" className="error-alert" />}

        <div className="selection-area">
          {currentStep === 0 && (
            <div className="selection-step">
              <div className="step-header">
                <BookOutlined className="quiz-subject-icon" />
                <Title level={4}>Which subject would you like to study?</Title>
              </div>
              {loading ? (
                <div className="loading-state">
                  <Spin size="large" />
                  <p>Loading subjects...</p>
                </div>
              ) : (
                <div className="quiz-setup-container">
                  <div className="quiz-subject-grid">
                    {subjects.map(subject => (
                      <div
                        key={subject.urlFriendlySubject}
                        className={`quiz-subject-card ${selectedSubject === subject.urlFriendlySubject ? 'selected' : ''}`}
                        onClick={() => handleSubjectChange(subject.urlFriendlySubject)}
                      >
                        <h3>{subject.subject}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 1 && (
            <div className="selection-step">
              <div className="step-header">
                <BookOutlined className="quiz-subject-icon" />
                <Title level={4}>Choose a topic to focus on</Title>
              </div>
              {loading ? (
                <div className="loading-state">
                  <Spin size="large" />
                  <p>Loading topics...</p>
                </div>
              ) : curriculum ? (
                <div className="topics-grid">
                  {curriculum.topics.map(topic => (
                    <div
                      key={topic.name}
                      className={`topic-card ${selectedTopic === topic.name ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedTopic(topic.name);
                        setSelectedSubtopic('');
                        setCurrentStep(2);
                      }}
                    >
                      <h3>{topic.name}</h3>
                      <p className="topic-description">{topic.description || 'Click to select this topic'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="error-state">
                  <Alert message="No curriculum data available" type="error" />
                  <Button onClick={() => setCurrentStep(0)} type="link">Go back to subject selection</Button>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="selection-step">
              <div className="step-header">
                <CheckCircleOutlined className="step-icon" />
                <Title level={4}>Final Step: Choose a subtopic</Title>
              </div>
              {loading ? (
                <div className="loading-state">
                  <Spin size="large" />
                  <p>Loading subtopics...</p>
                </div>
              ) : curriculum ? (
                <div className="subtopics-container">
                  <div className="subtopics-grid">
                    {curriculum.topics
                      .find(t => t.name === selectedTopic)?.subtopics
                      .map(subtopic => (
                        <div
                          key={subtopic.name}
                          className={`subtopic-card ${selectedSubtopic === subtopic.name ? 'selected' : ''}`}
                          onClick={() => setSelectedSubtopic(subtopic.name)}
                        >
                          <h3>{subtopic.name}</h3>
                          <p className="subtopic-description">
                            {subtopic.description || 'Test your knowledge on this subtopic'}
                          </p>
                        </div>
                      ))}
                  </div>
                  
                  {selectedSubtopic && (
                    <div className="start-quiz-section">
                      <Button 
                        type="primary" 
                        size="large"
                        icon={<CheckCircleOutlined />}
                        onClick={() => {
                          console.log('Starting quiz with:', {
                            subject: selectedSubject,
                            topic: selectedTopic,
                            subtopic: selectedSubtopic
                          });
                          navigate(`/quiz/${selectedSubject}/${encodeURIComponent(selectedTopic)}/${encodeURIComponent(selectedSubtopic)}`);
                        }}
                      >
                        Start Your Quiz
                      </Button>
                      <p className="quiz-info">Get ready to test your knowledge!</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="error-state">
                  <Alert message="No curriculum data available" type="error" />
                  <Button onClick={() => setCurrentStep(1)} type="link">Go back to topic selection</Button>
                </div>
              )}
            </div>
          )}

          {currentStep > 0 && (
            <Button 
              onClick={() => {
                setCurrentStep(currentStep - 1);
                if (currentStep === 2) setSelectedSubtopic('');
                if (currentStep === 1) setSelectedTopic('');
              }}
              style={{ marginTop: '1rem' }}
            >
              Back
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubjectSelection;
