import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Typography, Alert, Spin, Progress } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, RedoOutlined } from '@ant-design/icons';
import api from '../api/config';
import './FlashcardStudy.css';

const { Title, Text } = Typography;

function FlashcardStudy() {
  const { subject, topic, subtopic } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/flashcards/${subject}/${topic}/${subtopic}`);
        if (response.data && Array.isArray(response.data.cards)) {
          setFlashcards(response.data.cards);
          setProgress(0);
        }
      } catch (err) {
        console.error('Failed to fetch flashcards:', err);
        setError('Failed to load flashcards. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcards();
  }, [subject, topic, subtopic]);

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
      setProgress(((currentIndex + 2) / flashcards.length) * 100);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
      setProgress(((currentIndex) / flashcards.length) * 100);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setProgress(0);
  };

  if (loading) {
    return (
      <div className="flashcard-study-container">
        <div className="flashcard-loading">
          <Spin size="large" />
          <p>Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flashcard-study-container">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!flashcards.length) {
    return (
      <div className="flashcard-study-container">
        <Alert
          message="No Flashcards"
          description="No flashcards found for this topic."
          type="info"
          showIcon
        />
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="flashcard-study-container">
      <Title level={2}>{topic} - {subtopic}</Title>
      
      <div className="progress-container">
        <Progress percent={progress} status="active" />
        <Text>Card {currentIndex + 1} of {flashcards.length}</Text>
      </div>

      <Card
        className={`flashcard ${isFlipped ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <Text>{currentCard.question}</Text>
          </div>
          <div className="flashcard-back">
            <Text>{currentCard.answer}</Text>
          </div>
        </div>
      </Card>

      <div className="controls">
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>
        <Button
          icon={<RedoOutlined />}
          onClick={handleRestart}
        >
          Restart
        </Button>
        <Button
          type="primary"
          icon={<ArrowRightOutlined />}
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default FlashcardStudy;
