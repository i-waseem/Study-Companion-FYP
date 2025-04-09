import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Spin, Alert, Progress } from 'antd';
import api from '../api/config';
import './Flashcards.css';

function Flashcards() {
  const { subject, topic, subtopic } = useParams();
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  // Fetch flashcards
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        setLoading(true);
        console.log('Fetching flashcards for:', { subject, topic, subtopic });
        
        const response = await api.get(`/api/flashcards/o-level/${subject}/${topic}/${subtopic}`);
        console.log('Flashcards response:', response.data);

        if (response.data && response.data.flashcards) {
          setCards(response.data.flashcards);
          setProgress(0);
          setCurrentCardIndex(0);
          setIsFlipped(false);
        } else {
          throw new Error('Invalid flashcard data received');
        }
      } catch (error) {
        console.error('Error fetching flashcards:', error);
        setError(error.message || 'Failed to load flashcards');
      } finally {
        setLoading(false);
      }
    };

    if (subject && topic && subtopic) {
      fetchFlashcards();
    }
  }, [subject, topic, subtopic]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      setProgress(((currentCardIndex + 1) / cards.length) * 100);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      setProgress((currentCardIndex / cards.length) * 100);
    }
  };

  if (loading) {
    return (
      <div className="flashcards-container">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flashcards-container">
        <Alert message={error} type="error" showIcon />
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="flashcards-container">
        <Alert message="No flashcards available for this topic." type="info" showIcon />
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="flashcards-container">
      <div className="progress-container">
        <Progress percent={progress} showInfo={false} />
        <span className="card-count">
          Card {currentCardIndex + 1} of {cards.length}
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
        <Button 
          onClick={handlePrevious}
          disabled={currentCardIndex === 0}
        >
          Previous
        </Button>
        <Button onClick={handleFlip}>Flip</Button>
        <Button
          onClick={handleNext}
          disabled={currentCardIndex === cards.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default Flashcards;
