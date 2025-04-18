import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Spin, Space, Rate, Tooltip } from 'antd';
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
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  
  // Study state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [generatedAnswer, setGeneratedAnswer] = useState(null);
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [confidenceRating, setConfidenceRating] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [cardsReviewed, setCardsReviewed] = useState(new Set());
  const [sessionDuration, setSessionDuration] = useState(0);

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
        console.error('Error fetching subjects:', err);
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
      console.log('Fetching flashcards for subject:', subject);
      const response = await api.get(`/flashcards-new/${subject}`);
      console.log('Response:', response.data);
      
      if (response.data && Array.isArray(response.data.cards)) {
        // Group flashcards by topic and subtopic
        const topicGroups = {};
        response.data.cards.forEach(card => {
          if (!topicGroups[card.topic]) {
            topicGroups[card.topic] = {
              topic: card.topic,
              subtopics: {}
            };
          }
          if (!topicGroups[card.topic].subtopics[card.subtopic]) {
            topicGroups[card.topic].subtopics[card.subtopic] = [];
          }
          topicGroups[card.topic].subtopics[card.subtopic].push({
            ...card,
            question: card.question,
            answer: card.answer
          });
        });
        
        const topics = Object.values(topicGroups);
        console.log('Organized topics:', topics);
        setTopics(topics);
      } else {
        console.error('Invalid response format:', response.data);
        setError('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Error fetching topics:', err);
      setError('Failed to load topics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTopicSelect = (topic, subtopic) => {
    setSelectedTopic({ topic, subtopic });
    const topicData = topics.find(t => t.topic === topic);
    if (topicData) {
      setFlashcards(topicData.subtopics[subtopic]);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      const now = Date.now();
      setStartTime(now);
      setCardsReviewed(new Set());
      setSessionDuration(0);
      console.log('Starting new flashcard session at:', new Date(now).toISOString());
    }
  };

  const handleConfidenceRate = async (rating) => {
    setConfidenceRating(rating);
    setShowRating(false);
    setCardsReviewed(prev => new Set([...prev, currentCardIndex]));

    // Log the activity with confidence rating
    try {
      const now = Date.now();
      const duration = Math.round((now - startTime) / 1000); // Convert to seconds
      const reviewedCount = cardsReviewed.size + 1; // Include current card
      setSessionDuration(duration);
      console.log('Logging flashcard activity - Duration:', duration, 'seconds, Cards reviewed:', reviewedCount);
      await api.post('/progress/activity', {
        type: 'flashcard',
        data: {
          subject: selectedSubject,
          topic: selectedTopic.topic,
          subtopic: selectedTopic.subtopic,
          cardIndex: currentCardIndex,
          confidenceRating: rating,
          cardsReviewed: reviewedCount,
          totalCards: flashcards.length
        },
        duration
      });
    } catch (error) {
      console.error('Error logging confidence rating:', error);
    }
  };

  const handleFlip = async () => {
    if (!isFlipped && !generatedAnswer) {
      try {
        setGeneratingAnswer(true);
        const currentCard = flashcards[currentCardIndex];
        const response = await api.post('/flashcards-new/generate-answer', {
          question: currentCard.question,
          keyPoints: currentCard.answer
        });
        setGeneratedAnswer(response.data.answer);
      } catch (error) {
        console.error('Error generating answer:', error);
        setError('Failed to generate answer. Using key points instead.');
      } finally {
        setGeneratingAnswer(false);
      }
    }
    setIsFlipped(!isFlipped);
  };
  
  const handleNext = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      setGeneratedAnswer(null);
    }
  };
  
  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      setGeneratedAnswer(null);
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
      
      {!selectedSubject ? (
        // Subject Selection
        <>
          <Text className="subtitle">Select a subject to begin studying with flashcards.</Text>
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
        </>
      ) : !selectedTopic ? (
        // Topic Selection
        <>
          <Text className="subtitle">Select a topic from {selectedSubject} to study.</Text>
          <Button className="back-button" onClick={() => setSelectedSubject(null)}>
            ← Back to Subjects
          </Button>
          
          <div className="topics-grid">
            {topics.map((topicGroup) => (
              <div key={topicGroup.topic} className="topic-group">
                <Title level={4}>{topicGroup.topic}</Title>
                <div className="subtopic-buttons">
                  {Object.entries(topicGroup.subtopics).map(([subtopic, cards]) => (
                    <Button
                      key={subtopic}
                      className="subtopic-button"
                      onClick={() => handleTopicSelect(topicGroup.topic, subtopic)}
                    >
                      {subtopic}
                      <span className="card-count">{cards.length} cards</span>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        // Flashcard Study
        <>
          <Text className="subtitle">{selectedTopic.subtopic}</Text>
          <Button 
            className="back-button" 
            onClick={() => {
              setSelectedTopic(null);
              setFlashcards([]);
            }}
          >
            ← Back to Topics
          </Button>
          {startTime && (
            <Text className="study-duration">
              Study time: {Math.round((Date.now() - startTime) / 1000)}s
            </Text>
          )}
          
          <div className="flashcard" onClick={handleFlip}>
            <div className={`card-content ${isFlipped ? 'flipped' : ''}`}>
              <div className="card-front">
                <p>{flashcards[currentCardIndex]?.question}</p>
              </div>
              <div className="card-back">
                {generatingAnswer ? (
                  <div className="generating-answer">
                    <Spin />
                    <p>Generating comprehensive answer...</p>
                  </div>
                ) : (
                  <div>
                    <p className="answer-text">{generatedAnswer || flashcards[currentCardIndex]?.answer}</p>
                    {!generatedAnswer && (
                      <div className="key-points-note">
                        <Text type="secondary">These are the key points. Flip again to see the full answer.</Text>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card-progress">
            Card {currentCardIndex + 1} of {flashcards.length}
          </div>

          {showRating ? (
            <div className="confidence-rating">
              <Text>How well did you know this?</Text>
              <div className="rating-description">
                <Rate
                  character={({ index }) => (
                    <Tooltip title={[
                      'Did not know it at all',
                      'Remembered with difficulty',
                      'Had to think about it',
                      'Knew it well',
                      'Knew it perfectly'
                    ][index]}>
                      ⭐
                    </Tooltip>
                  )}
                  onChange={(rating) => {
                    handleConfidenceRate(rating);
                  }}
                  style={{ fontSize: '24px' }}
                />
                <Text type="secondary" style={{ marginTop: '8px', display: 'block' }}>
                  1 star: Still learning | 3 stars: Reviewing | 5 stars: Mastered
                </Text>
              </div>
            </div>
          ) : (
            <div className="navigation-buttons">
              <Button onClick={handlePrevious} disabled={currentCardIndex === 0}>
                Previous
              </Button>
              <Button onClick={handleFlip}>Flip</Button>
              {isFlipped && !generatingAnswer && (
                <Button 
                  className="rate-confidence-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent event bubbling
                    setShowRating(true);
                  }}
                >
                  Rate Your Confidence
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={currentCardIndex === flashcards.length - 1}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );


}

export default FlashcardNew;
