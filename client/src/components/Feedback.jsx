import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/config';
import './Feedback.css';

function Feedback() {
  const [feedback, setFeedback] = useState({
    type: 'general',
    message: '',
    rating: 5
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting feedback:', feedback);
      const response = await api.post('/feedback', feedback);
      console.log('Feedback submitted successfully:', response.data);
      
      toast.success('Thank you for your feedback!');
      
      // Reset form
      setFeedback({
        type: 'general',
        message: '',
        rating: 5
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        toast.error(`Failed to submit feedback: ${error.response.data.error || 'Unknown error'}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        toast.error('Server not responding. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
        toast.error('Error setting up request. Please try again.');
      }
    }
  };

  return (
    <div className="feedback">
      <h1>Feedback</h1>
      <p className="subtitle">Help us improve your learning experience</p>

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label>Feedback Type</label>
          <select 
            value={feedback.type}
            onChange={(e) => setFeedback({...feedback, type: e.target.value})}
          >
            <option value="general">General</option>
            <option value="bug">Bug Report</option>
            <option value="feature">Feature Request</option>
            <option value="content">Content Improvement</option>
          </select>
        </div>

        <div className="form-group">
          <label>Rating</label>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`rating-star ${num <= feedback.rating ? 'active' : ''}`}
                onClick={() => setFeedback({...feedback, rating: num})}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Your Message</label>
          <textarea
            value={feedback.message}
            onChange={(e) => setFeedback({...feedback, message: e.target.value})}
            placeholder="Tell us what you think..."
            rows="5"
          />
        </div>

        <button type="submit" className="submit-btn">
          Submit Feedback
        </button>
      </form>
    </div>
  );
}

export default Feedback;
