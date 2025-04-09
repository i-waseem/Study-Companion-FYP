import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard({ user }) {
  const [studyData, setStudyData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Study Hours',
        data: [2, 3, 1.5, 4, 2.5, 3.5, 2],
        borderColor: 'var(--primary-brown)',
        backgroundColor: 'rgba(121, 85, 72, 0.1)',
        tension: 0.4
      }
    ]
  });

  const subjects = [
    {
      name: 'Economics',
      progress: 65,
      topics: 15,
      totalTopics: 23,
      nextTopic: 'Market Structures',
      strongTopics: ['Supply and Demand', 'Price Elasticity'],
      weakTopics: ['International Trade', 'Market Failure']
    },
    {
      name: 'Pakistan Studies',
      progress: 45,
      topics: 9,
      totalTopics: 20,
      nextTopic: 'War of Independence',
      strongTopics: ['Geographic Regions', 'Natural Resources'],
      weakTopics: ['Constitutional Development', 'Foreign Relations']
    }
  ];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Weekly Study Hours'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours'
        }
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="streak-counter">
          <span className="streak-number">5</span>
          <span className="streak-label">Day Streak 🔥</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Study Progress Overview */}
        <section className="progress-overview card">
          <h2>Study Progress</h2>
          <div className="chart-container">
            <Line options={chartOptions} data={studyData} />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions card">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn quiz-btn">
              <span className="icon">📝</span>
              Start Quiz
            </button>
            <button className="action-btn flashcard-btn">
              <span className="icon">🗂️</span>
              Flashcards
            </button>
            <button className="action-btn goals-btn">
              <span className="icon">🎯</span>
              Set Goals
            </button>
          </div>
        </section>

        {/* Subject Cards */}
        <section className="subject-cards">
          {subjects.map(subject => (
            <div key={subject.name} className="subject-card card">
              <div className="subject-header">
                <h3>{subject.name}</h3>
                <div className="progress-circle">
                  <svg viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="var(--light-gray)"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="var(--primary-brown)"
                      strokeWidth="3"
                      strokeDasharray={`${subject.progress}, 100`}
                    />
                    <text x="18" y="20.35" className="progress-percentage">
                      {subject.progress}%
                    </text>
                  </svg>
                </div>
              </div>
              <div className="subject-progress">
                <p>{subject.topics} of {subject.totalTopics} topics completed</p>
                <p className="next-topic">Next: {subject.nextTopic}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Study Analytics */}
        <section className="study-analytics card">
          <h2>Study Analytics</h2>
          {subjects.map(subject => (
            <div key={subject.name} className="subject-analytics">
              <h3>{subject.name}</h3>
              <div className="topics-analysis">
                <div className="strong-topics">
                  <h4>Strong Topics</h4>
                  <ul>
                    {subject.strongTopics.map(topic => (
                      <li key={topic}>{topic}</li>
                    ))}
                  </ul>
                </div>
                <div className="weak-topics">
                  <h4>Areas for Improvement</h4>
                  <ul>
                    {subject.weakTopics.map(topic => (
                      <li key={topic}>{topic}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
