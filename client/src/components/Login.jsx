import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Auth.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission
    setError(''); // Clear any existing errors

    const { email, password } = formData;

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      console.log('Attempting login with:', { email, password: '***' });
      
      // Call login function from AuthContext with actual values
      await login(formData.email, formData.password);
      
      console.log('Login successful, redirecting to home');
      navigate('/', { replace: true }); // Use replace to prevent back navigation
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="auth-container">
      <h2>Welcome Back</h2>
      <p className="auth-subtitle">Continue your learning journey</p>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="auth-button">Login</button>
      </form>

      <p className="auth-switch">
        Don't have an account?{' '}
        <span onClick={() => navigate('/register')} className="auth-link">
          Register here
        </span>
      </p>
    </div>
  );
}

export default Login;
