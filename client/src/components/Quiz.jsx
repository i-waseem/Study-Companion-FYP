import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Radio, Button, Typography, Space, Alert, Progress, Result, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';
import api from '../api/config';
import './Quiz.css';

const { Title, Text } = Typography;

function Quiz() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { subjectId, topicId, subtopicId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);

  useEffect(() => {
    const generateQuiz = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get curriculum data for the selected topic
        const curriculumResponse = await api.get(`/curriculum/o-level/${subjectId}`);
        if (!curriculumResponse.data || !curriculumResponse.data.topics) {
          throw new Error('Invalid curriculum data');
        }

        const selectedTopic = curriculumResponse.data.topics.find(t => t.name === decodeURIComponent(topicId));
        if (!selectedTopic) {
          throw new Error('Selected topic not found');
        }

        console.log('Selected topic:', selectedTopic);
        console.log('Looking for subtopic:', subtopicId);

        // Find subtopic by name instead of index
        const selectedSubtopic = selectedTopic.subtopics.find(s => s.name === decodeURIComponent(subtopicId));
        if (!selectedSubtopic) {
          throw new Error('Selected subtopic not found');
        }

        console.log('Selected subtopic:', selectedSubtopic);

        const response = await api.post('/quiz/generate', {
          subject: decodeURIComponent(subjectId),
          topic: selectedTopic.name,
          subtopic: selectedSubtopic.name,
          learningObjectives: selectedSubtopic.learningObjectives
        });

        console.log('Quiz response:', response.data);

        if (!response.data || !response.data.questions) {
          throw new Error('Invalid quiz data received');
        }

        setQuestions(response.data.questions);
        setCurrentQuestionIndex(0);
        setSelectedAnswerIndex(null);
        setShowExplanation(false);
        setScore(0);
        setQuizCompleted(false);
        setIsCorrect(null);
        setStartTime(new Date()); // Start timing when quiz begins
      } catch (err) {
        console.error('Error generating quiz:', err);
        setError(err.message || 'Failed to generate quiz');
      } finally {
        setLoading(false);
      }
    };

    generateQuiz();
  }, [subjectId, topicId, subtopicId]);

  const handleAnswerSelect = (index) => {
    if (!showExplanation) {
      setSelectedAnswerIndex(index);
    }
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const correct = currentQuestion.options[selectedAnswerIndex] === currentQuestion.correctAnswer;
    
    // Record incorrect answer if wrong
    if (!correct) {
      setIncorrectAnswers(prev => [...prev, {
        question: currentQuestion.question,
        userAnswer: currentQuestion.options[selectedAnswerIndex],
        correctAnswer: currentQuestion.correctAnswer
      }]);
    } else {
      setScore(score + 1);
    }

    setIsCorrect(correct);
    setShowExplanation(true);
  };

  const handleContinue = async () => {
    if (currentQuestionIndex === questions.length - 1) {
      try {
        const duration = Math.round((new Date() - startTime) / 1000); // Convert to seconds
        const subject = decodeURIComponent(subjectId);
        const topic = decodeURIComponent(topicId);
        const subtopic = decodeURIComponent(subtopicId);

        // Prepare detailed question data
        const questionDetails = incorrectAnswers.map(detail => ({
          question: detail.question,
          userAnswer: detail.userAnswer,
          correctAnswer: detail.correctAnswer,
          isCorrect: false,
          learningObjective: questions.find(q => q.question === detail.question)?.learningObjective
        }));

        // Add correct answers
        questions.forEach((q, index) => {
          if (!incorrectAnswers.find(wrong => wrong.question === q.question)) {
            questionDetails.push({
              question: q.question,
              userAnswer: q.options[selectedAnswerIndex],
              correctAnswer: q.correctAnswer,
              isCorrect: true,
              learningObjective: q.learningObjective
            });
          }
        });

        // Record detailed quiz progress
        const quizScore = Math.round((score / questions.length) * 100);
        
        await api.post('/progress/quiz', {
          subject,
          topic,
          subtopic,
          score: quizScore,
          totalQuestions: questions.length,
          correctAnswers: score,
          weakAreas: incorrectAnswers.map(wrong => wrong.question)
        });

        // Record activity
        await api.post('/progress/activity', {
          type: 'quiz',
          data: {
            subject,
            topic,
            subtopic,
            score: quizScore,
            totalQuestions: questions.length,
            correctAnswers: score,
            weakAreas: incorrectAnswers.map(wrong => wrong.question)
          },
          duration
        });

        // Dispatch event to notify Progress component
        window.dispatchEvent(new CustomEvent('quizComplete', { 
          detail: { 
            subject, 
            topic, 
            score: quizScore,
            totalQuestions: questions.length,
            correctAnswers: score,
            timestamp: new Date().toISOString()
          } 
        }));
      } catch (err) {
        console.error('Error recording quiz progress:', err);
      }

      setQuizCompleted(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswerIndex(null);
      setShowExplanation(false);
    }
  };

  const handleTryAgain = () => {
    navigate('/quiz');
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <Card>
          <Space direction="vertical" align="center" style={{ width: '100%' }}>
            <Spin size="large" />
            <Text>Generating your quiz...</Text>
          </Space>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-container">
        <Card>
          <Result
            status="error"
            title="Failed to generate quiz"
            subTitle={error}
            extra={[
              <Button key="tryAgain" onClick={handleTryAgain}>
                Try Again
              </Button>
            ]}
          />
        </Card>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = (score / questions.length) * 100;
    return (
      <div className="quiz-container">
        <Card>
          <Result
            status={percentage >= 70 ? "success" : "warning"}
            title={`Quiz Completed! Score: ${percentage.toFixed(1)}%`}
            subTitle={`You got ${score} out of ${questions.length} questions correct`}
            extra={[
              <Button key="tryAgain" type="primary" onClick={handleTryAgain}>
                Take Another Quiz
              </Button>
            ]}
          />
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div className="quiz-header">
            <Progress 
              percent={Math.round((currentQuestionIndex + 1) / questions.length * 100)}
              format={() => `${currentQuestionIndex + 1}/${questions.length}`}
            />
            <Title level={4}>{currentQuestion.question}</Title>
          </div>

          <Radio.Group 
            onChange={(e) => handleAnswerSelect(e.target.value)}
            value={selectedAnswerIndex}
            disabled={showExplanation}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {currentQuestion.options.map((option, index) => (
                <Radio key={index} value={index}>
                  {option}
                </Radio>
              ))}
            </Space>
          </Radio.Group>

          {showExplanation ? (
            <>
              <Alert
                message={isCorrect ? "Correct!" : "Incorrect"}
                description={currentQuestion.explanation}
                type={isCorrect ? "success" : "error"}
                showIcon
                icon={isCorrect ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
              />
              <Button type="primary" onClick={handleContinue}>
                {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </Button>
            </>
          ) : (
            <Button 
              type="primary" 
              onClick={handleNextQuestion}
              disabled={selectedAnswerIndex === null}
            >
              Check Answer
            </Button>
          )}
        </Space>
      </Card>
    </div>
  );
}

export default Quiz;
