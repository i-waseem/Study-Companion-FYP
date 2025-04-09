import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Register from './components/Register';
import Quiz from './components/Quiz';
import SubjectSelection from './components/SubjectSelection';
import Home from './components/Home';
import Subjects from './components/Subjects';
import Flashcards from './components/Flashcards';
import FlashcardSelection from './components/FlashcardSelection';
import Progress from './components/Progress';
import Notes from './components/Notes';
import CareerGuidance from './components/CareerGuidance';
import Feedback from './components/Feedback';
import ProfileSettings from './components/ProfileSettings';
import Dashboard from './components/Dashboard';
import './App.css';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <div className="app-container">
      {user && <Sidebar />}
      <div className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/quiz" element={
            <ProtectedRoute>
              <SubjectSelection />
            </ProtectedRoute>
          } />
          <Route path="/quiz/:subjectId/:topicId/:subtopicId" element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          } />
          <Route path="/subject-selection/:subject" element={
            <ProtectedRoute>
              <SubjectSelection />
            </ProtectedRoute>
          } />
          <Route path="/subjects" element={
            <ProtectedRoute>
              <Subjects />
            </ProtectedRoute>
          } />
          <Route path="/flashcards" element={
            <ProtectedRoute>
              <FlashcardSelection />
            </ProtectedRoute>
          } />
          <Route path="/flashcards/:subject/:topic/:subtopic" element={
            <ProtectedRoute>
              <Flashcards />
            </ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          } />
          <Route path="/notes" element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          } />
          <Route path="/career-guidance" element={
            <ProtectedRoute>
              <CareerGuidance />
            </ProtectedRoute>
          } />
          <Route path="/feedback" element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          } />
          <Route path="/profile-settings" element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
