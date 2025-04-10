import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Typography, Spin, Alert } from 'antd';
import api from '../api/config';
import './FlashcardNew.css';

const { Title } = Typography;
const { Option } = Select;

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

  if (currentStep === 'selection') {
    return (
      <div className="flashcard-new-container">
        <Title level={2}>Study with Flashcards</Title>
        <Card className="subject-selection">
          <Select
            placeholder="Select a subject"
            style={{ width: '100%' }}
            onChange={handleSubjectSelect}
            loading={loading}
          >
            {subjects.map(subject => (
              <Option key={subject} value={subject}>
                {subject}
              </Option>
            ))}
          </Select>
        </Card>
      </div>
    );
  }

  if (currentStep === 'study' && flashcards.length > 0) {
    const currentCard = flashcards[currentCardIndex];
    return (
      <div className="flashcard-new-container">
        <div className="study-header">
          <Button onClick={handleBackToSelection}>← Back to Subjects</Button>
          <span className="card-count">
            Card {currentCardIndex + 1} of {flashcards.length}
          </span>
        </div>

        <Card
          className={`flashcard ${isFlipped ? 'flipped' : ''}`}
          onClick={handleFlip}
        >
          <div className="card-content">
            <div className="card-front">
              <p>{currentCard.question}</p>
            </div>
            <div className="card-back">
              <p>{currentCard.answer}</p>
            </div>
          </div>
        </Card>

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
      </div>
    );
  }

  return (
    <div className="flashcard-new-container">
      <Alert
        message="No flashcards available"
        description="Please select a different subject."
        type="info"
        showIcon
      />
    </div>
  );
}

export default FlashcardNew;
