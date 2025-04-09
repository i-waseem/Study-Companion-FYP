import React, { useState } from 'react';
import './CareerGuidance.css';
import { getGeminiResponse, generateCareerGuidancePrompt } from '../utils/gemini';

function CareerGuidance() {
  const [step, setStep] = useState('assessment');
  const [answers, setAnswers] = useState({
    interests: [],
    skills: [],
    subjects: [],
    workStyle: '',
    values: []
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const questions = {
    interests: {
      title: "What interests you the most?",
      options: [
        "Problem Solving",
        "Creative Work",
        "Helping Others",
        "Technology",
        "Business",
        "Science",
        "Mathematics",
        "Communication",
        "Design",
        "Research"
      ],
      multiple: true
    },
    skills: {
      title: "What are your strongest skills?",
      options: [
        "Critical Thinking",
        "Programming",
        "Writing",
        "Public Speaking",
        "Analysis",
        "Organization",
        "Leadership",
        "Creativity",
        "Technical Skills",
        "Teamwork"
      ],
      multiple: true
    },
    subjects: {
      title: "Which subjects do you enjoy?",
      options: [
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Computer Science",
        "Literature",
        "Economics",
        "Art",
        "Psychology",
        "Business Studies"
      ],
      multiple: true
    },
    workStyle: {
      title: "What's your preferred work style?",
      options: [
        "Independent Work",
        "Team Collaboration",
        "Structured Environment",
        "Flexible/Creative Environment"
      ],
      multiple: false
    },
    values: {
      title: "What do you value most in a career?",
      options: [
        "Innovation",
        "Helping Society",
        "Financial Security",
        "Work-Life Balance",
        "Continuous Learning",
        "Leadership Opportunities"
      ],
      multiple: true
    }
  };

  const careerPaths = {
    tech: {
      title: "Technology & Software Development",
      matches: ["Problem Solving", "Technology", "Programming", "Computer Science"],
      careers: [
        {
          role: "Software Developer",
          description: "Build applications and systems using programming languages and tools.",
          skills: ["Programming", "Problem Solving", "Technical Skills"],
          education: ["Computer Science Degree", "Coding Bootcamps", "Online Certifications"],
          resources: [
            { title: "Learn to Code", type: "Course", link: "#" },
            { title: "Software Architecture", type: "Guide", link: "#" }
          ]
        },
        {
          role: "Data Scientist",
          description: "Analyze complex data to help organizations make better decisions.",
          skills: ["Mathematics", "Programming", "Analysis"],
          education: ["Mathematics/Statistics Degree", "Data Science Certifications"],
          resources: [
            { title: "Data Science Fundamentals", type: "Course", link: "#" },
            { title: "Machine Learning Basics", type: "Guide", link: "#" }
          ]
        }
      ]
    },
    science: {
      title: "Science & Research",
      matches: ["Science", "Research", "Analysis", "Critical Thinking"],
      careers: [
        {
          role: "Research Scientist",
          description: "Conduct research to advance knowledge in scientific fields.",
          skills: ["Research", "Analysis", "Critical Thinking"],
          education: ["PhD in Science Field", "Masters Degree"],
          resources: [
            { title: "Research Methodologies", type: "Course", link: "#" },
            { title: "Scientific Writing", type: "Guide", link: "#" }
          ]
        }
      ]
    },
    business: {
      title: "Business & Management",
      matches: ["Business", "Leadership", "Communication", "Economics"],
      careers: [
        {
          role: "Business Analyst",
          description: "Analyze business problems and propose solutions.",
          skills: ["Analysis", "Communication", "Problem Solving"],
          education: ["Business Degree", "MBA", "Professional Certifications"],
          resources: [
            { title: "Business Analysis", type: "Course", link: "#" },
            { title: "Project Management", type: "Guide", link: "#" }
          ]
        }
      ]
    }
  };

  const handleOptionSelect = (category, option) => {
    setAnswers(prev => {
      if (questions[category].multiple) {
        const updated = prev[category].includes(option)
          ? prev[category].filter(item => item !== option)
          : [...prev[category], option];
        return { ...prev, [category]: updated };
      }
      return { ...prev, [category]: option };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const prompt = generateCareerGuidancePrompt(answers);
      const response = await getGeminiResponse(prompt);
      setResult(response); // response is already in the correct format
      setStep('result');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to get career recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const parseAIResponse = (recommendations) => {
    try {
      if (!Array.isArray(recommendations)) {
        throw new Error('Invalid response format from AI');
      }

      return recommendations;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Failed to parse AI recommendations: ' + error.message);
    }
  };

  if (step === 'result' && result) {
    const parsedResponse = parseAIResponse(result);
    
    return (
      <div className="career-guidance">
        <h1>Your Career Recommendations</h1>

        <div className="ai-recommendations">
          <div className="careers-section">
            {parsedResponse.map((career, index) => (
              <div key={index} className="career-card">
                <h3>{career.title}</h3>
                <p className="description">{career.description}</p>
                
                <div className="career-details">
                  <div className="education">
                    <h4>Education Path</h4>
                    <p>{career.educationPath}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          className="restart-btn" 
          onClick={() => {
            setStep('assessment');
            setAnswers({
              interests: [],
              skills: [],
              subjects: [],
              workStyle: '',
              values: []
            });
            setResult(null);
          }}
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="career-guidance">
      <h1>Career Guidance Assessment</h1>
      <p className="intro-text">
        Let's help you find the perfect career path based on your interests and skills.
      </p>

      {error && <div className="error-message">{error}</div>}

      <div className="assessment-form">
        {Object.entries(questions).map(([category, question]) => (
          <div key={category} className="question-section">
            <h3>{question.title}</h3>
            <div className="options-grid">
              {question.options.map((option) => (
                <button
                  key={option}
                  className={`option-btn ${
                    question.multiple
                      ? answers[category].includes(option) ? 'selected' : ''
                      : answers[category] === option ? 'selected' : ''
                  }`}
                  onClick={() => handleOptionSelect(category, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button 
          className={`submit-btn ${loading ? 'loading' : ''}`}
          onClick={handleSubmit}
          disabled={loading || Object.values(answers).every(val => 
            Array.isArray(val) ? val.length === 0 : !val
          )}
        >
          {loading ? 'Getting AI Recommendations...' : 'Get Career Recommendations'}
        </button>
      </div>
    </div>
  );
}

export default CareerGuidance;
