import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="user-info">
          {user ? (
            <>
              <h3>Welcome, {user.username}!</h3>
            </>
          ) : (
            <h3>Welcome!</h3>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link to="/" className={`nav-item ${isActive('/')}`}>
          Home
        </Link>
        <Link to="/dashboard" className={`nav-item ${isActive('/dashboard')}`}>
          Dashboard
        </Link>
        <Link to="/subjects" className={`nav-item ${isActive('/subjects')}`}>
          Subjects
        </Link>
        <Link to="/flashcards" className={`nav-item ${isActive('/flashcards')}`}>
          Flashcards
        </Link>
        <Link to="/quiz" className={`nav-item ${isActive('/quiz')}`}>
          Quiz
        </Link>
        <Link to="/progress" className={`nav-item ${isActive('/progress')}`}>
          Progress
        </Link>
        <Link to="/notes" className={`nav-item ${isActive('/notes')}`}>
          Notes
        </Link>
        <Link to="/career-guidance" className={`nav-item ${isActive('/career-guidance')}`}>
          Career Guidance
        </Link>
        <Link to="/feedback" className={`nav-item ${isActive('/feedback')}`}>
          Feedback
        </Link>
        <Link to="/profile-settings" className={`nav-item ${isActive('/profile-settings')}`}>
          Settings
        </Link>
      </nav>

      <div className="sidebar-footer">
        {user && (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
