import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Spin, Space } from 'antd';
import { BookOutlined, CodeOutlined, LineChartOutlined } from '@ant-design/icons';
import api from '../api/config';
import './FlashcardNew.css';

const { Title, Text } = Typography;

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

function FlashcardNew() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState('selection'); // 'selection' or 'study'
  
  // Selection state
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  
  // Study state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Fetch subjects on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const response = await api.get('/flashcards-new/subjects');
        if (Array.isArray(response.data)) {
          setSubjects(response.data);
        }
      } catch (err) {
        setError('Failed to load subjects. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch flashcards when subject is selected
  const handleSubjectSelect = async (subject) => {
    try {
      setLoading(true);
      setSelectedSubject(subject);
      const response = await api.get(`/flashcards-new/${subject}`);
      if (response.data && Array.isArray(response.data.cards)) {
        setFlashcards(response.data.cards);
        setCurrentStep('study');
        setCurrentCardIndex(0);
        setIsFlipped(false);
      }
    } catch (err) {
      setError('Failed to load flashcards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => setIsFlipped(!isFlipped);
  
  const handleNext = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };
  
  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleBackToSelection = () => {
    setCurrentStep('selection');
    setSelectedSubject(null);
    setFlashcards([]);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  if (loading && subjects.length === 0) {
    return (
      <div className="flashcard-new-container">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flashcard-new-container">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
        />
      </div>
    );
  }

  return (
    <div className="flashcard-new-container">
      <Title level={2}>Study with Flashcards</Title>
      <Text className="subtitle">Select a subject to begin studying with flashcards.</Text>

      {!selectedSubject ? (
        <div className="subject-buttons">
          {subjects.map((subject) => (
            <Button
              key={subject}
              className="subject-button"
              onClick={() => handleSubjectSelect(subject)}
            >
              {subject}
            </Button>
          ))}
        </div>
      ) : (
        <>
          <Button className="back-button" onClick={() => setSelectedSubject(null)}>
            ← Back to Subjects
          </Button>
          
          <div className="flashcard" onClick={handleFlip}>
            <div className={`card-content ${isFlipped ? 'flipped' : ''}`}>
              <div className="card-front">
                <p>{flashcards[currentCardIndex]?.question}</p>
              </div>
              <div className="card-back">
                <p>{flashcards[currentCardIndex]?.answer}</p>
              </div>
            </div>
          </div>

          <div className="card-progress">
            Card {currentCardIndex + 1} of {flashcards.length}
          </div>

          <div className="navigation-buttons">
            <Button onClick={handlePrevious} disabled={currentCardIndex === 0}>
              Previous
            </Button>
            <Button onClick={handleFlip}>Flip</Button>
            <Button
              onClick={handleNext}
              disabled={currentCardIndex === flashcards.length - 1}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );


}

export default FlashcardNew;
