import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Select, Button, Typography, Alert, Spin } from 'antd';
import api from '../api/config';
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

  // Fetch available subjects from flashcard sets
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const response = await api.get('/flashcards/subjects');
        if (response.data && Array.isArray(response.data)) {
          setSubjects(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
        if (err.response?.status === 401) {
          setError('Please log in to access flashcards');
        } else {
          setError('Failed to load subjects. Please refresh the page.');  
        }
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
        const response = await api.get(`/flashcards/topics/${selectedSubject}`);
        if (response.data && Array.isArray(response.data)) {
          setTopics(response.data);
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

  // Fetch subtopics when topic changes
  useEffect(() => {
    const fetchSubtopics = async () => {
      if (!selectedSubject || !selectedTopic) {
        setSubtopics([]);
        return;
      }
      try {
        setLoading(true);
        const response = await api.get(`/flashcards/subtopics/${selectedSubject}/${selectedTopic}`);
        if (response.data && Array.isArray(response.data)) {
          setSubtopics(response.data);
          setSelectedSubtopic('');
        }
      } catch (err) {
        console.error('Failed to fetch subtopics:', err);
        setError('Failed to load subtopics. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubtopics();
  }, [selectedSubject, selectedTopic]);

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
    navigate(`/flashcards/study/${selectedSubject}/${selectedTopic}/${selectedSubtopic}`);
  };

  if (loading && subjects.length === 0) {
    return (
      <div className="flashcard-selection-container">
        <div className="flashcard-loading">
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
              {subjects.map(subject => (
                <Option key={subject} value={subject}>
                  {subject}
                </Option>
              ))}
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
                {topics.map(topic => (
                  <Option key={topic} value={topic}>
                    {topic}
                  </Option>
                ))}
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
                {subtopics.map(subtopic => (
                  <Option key={subtopic} value={subtopic}>
                    {subtopic}
                  </Option>
                ))}
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
