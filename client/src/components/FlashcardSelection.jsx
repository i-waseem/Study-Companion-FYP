import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Select, Button, Typography, Alert, Spin } from 'antd';
import api from '../api/config';
import AuthService from '../services/auth.service';
import './FlashcardSelection.css';

const { Title } = Typography;
const { Option } = Select;

function FlashcardSelection() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState('');
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(AuthService.isLoggedIn());

  // Fetch available subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const response = await api.get('/curriculum/subjects');
        console.log('Subjects response:', response.data);
        
        if (response.data && Array.isArray(response.data)) {
          // Extract subject names and format them
          const subjectsArray = response.data.map(item => {
            // If item is an object with subject property, use that
            if (item && typeof item === 'object' && item.subject) {
              return item.subject;
            }
            // Otherwise use the item directly if it's a string
            return String(item);
          });
          
          setSubjects(subjectsArray);
          console.log('Set subjects:', subjectsArray);
        } else {
          throw new Error('Invalid subjects data format');
        }
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
        setError('Failed to load subjects. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch topics when subject changes
  useEffect(() => {
    const fetchTopics = async () => {
      if (!selectedSubject) return;
      try {
        setLoading(true);
        console.log('Fetching topics for subject:', selectedSubject);
        const response = await api.get(`/curriculum/o-level/${selectedSubject}`);
        console.log('Topics response:', response.data);
        
        if (response.data && response.data.topics) {
          // Ensure we have the correct structure
          const topicsArray = response.data.topics.map(topic => ({
            name: topic.name,
            subtopics: topic.subtopics || []
          }));
          console.log('Setting topics:', topicsArray);
          setTopics(topicsArray);
          setSelectedTopic('');
          setSelectedSubtopic('');
        }
      } catch (err) {
        console.error('Failed to fetch topics:', err);
        setError('Failed to load topics. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [selectedSubject]);

  // Update subtopics when topic changes
  useEffect(() => {
    if (!selectedTopic) {
      setSubtopics([]);
      return;
    }
    const topic = topics.find(t => {
      const topicName = t.name.toLowerCase().replace(/\s+/g, '-');
      return topicName === selectedTopic;
    });
    
    if (topic) {
      console.log('Found topic:', topic);
      console.log('Setting subtopics:', topic.subtopics);
      setSubtopics(topic.subtopics || []);
      setSelectedSubtopic('');
    } else {
      console.error('Topic not found:', selectedTopic);
      setSubtopics([]);
    }
  }, [selectedTopic, topics]);

  const handleSubjectChange = (subject) => {
    setSelectedSubject(subject);
  };

  const handleTopicChange = (topic) => {
    setSelectedTopic(topic);
  };

  const handleSubtopicChange = (subtopic) => {
    setSelectedSubtopic(subtopic);
  };

  const handleStartStudying = () => {
    if (!selectedSubject || !selectedTopic || !selectedSubtopic) {
      setError('Please select all options');
      return;
    }

    console.log('Navigating to:', {
      subject: selectedSubject,
      topic: selectedTopic,
      subtopic: selectedSubtopic
    });

    navigate(`/flashcards/study/${selectedSubject}/${selectedTopic}/${selectedSubtopic}`);
  };

  if (loading && subjects.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <Spin size="large" />
          <p>Loading subjects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcard-selection-container">
      <div className="flashcard-setup-container">
        <Title level={2}>Study with Flashcards</Title>

        {!isLoggedIn && (
          <Alert
            message="Please Log In"
            description="You need to log in to use flashcards."
            type="warning"
            showIcon
            action={
              <Button type="primary" onClick={() => navigate('/login')}>
                Log In
              </Button>
            }
            style={{ marginBottom: 16 }}
          />
        )}

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: 16 }}
          />
        )}

        <div className="steps-container">
          <div className="step-row">
            <div className={`step ${selectedSubject ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-text">Choose Subject</div>
            </div>
            <div className="step-connector"></div>
            <div className={`step ${selectedTopic ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-text">Select Topic</div>
            </div>
            <div className="step-connector"></div>
            <div className={`step ${selectedSubtopic ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-text">Pick Subtopic</div>
            </div>
          </div>
        </div>

        <div className="flashcard-selection-form">
          <div className="form-item">
            <Select
              placeholder="Select a subject"
              style={{ width: '100%' }}
              value={selectedSubject}
              onChange={handleSubjectChange}
              loading={loading}
            >
              {subjects.map(subject => {
                try {
                  const formattedValue = String(subject).toLowerCase().replace(/\s+/g, '-');
                  const displayText = String(subject)
                    .split(/[-\s]+/)
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ');
                  
                  return (
                    <Option 
                      key={formattedValue} 
                      value={formattedValue}
                    >
                      {displayText}
                    </Option>
                  );
                } catch (err) {
                  console.error('Error formatting subject:', subject, err);
                  return null;
                }
              }).filter(Boolean)}
            </Select>
          </div>

          {selectedSubject && (
            <div className="form-item">
              <Select
                placeholder="Select a topic"
                style={{ width: '100%' }}
                value={selectedTopic}
                onChange={handleTopicChange}
              >
                {topics.map(topic => {
                  try {
                    const formattedValue = String(topic.name).toLowerCase().replace(/\s+/g, '-');
                    const displayText = String(topic.name)
                      .split(/[-\s]+/)
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                      .join(' ');

                    return (
                      <Option 
                        key={formattedValue}
                        value={formattedValue}
                      >
                        {displayText}
                      </Option>
                    );
                  } catch (err) {
                    console.error('Error formatting topic:', topic, err);
                    return null;
                  }
                }).filter(Boolean)}
              </Select>
            </div>
          )}

          {selectedTopic && (
            <div className="form-item">
              <Select
                placeholder="Select a subtopic"
                style={{ width: '100%' }}
                value={selectedSubtopic}
                onChange={handleSubtopicChange}
              >
                {subtopics.map(subtopic => {
                  try {
                    const formattedValue = String(subtopic.name).toLowerCase().replace(/\s+/g, '-');
                    const displayText = String(subtopic.name)
                      .split(/[-\s]+/)
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                      .join(' ');

                    return (
                      <Option 
                        key={formattedValue}
                        value={formattedValue}
                      >
                        {displayText}
                      </Option>
                    );
                  } catch (err) {
                    console.error('Error formatting subtopic:', subtopic, err);
                    return null;
                  }
                }).filter(Boolean)}
              </Select>
            </div>
          )}

          <Button
            type="primary"
            onClick={handleStartStudying}
            disabled={!selectedSubject || !selectedTopic || !selectedSubtopic}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            Start Studying
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FlashcardSelection;
