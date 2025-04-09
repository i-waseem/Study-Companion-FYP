import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Tabs, message } from 'antd';
import api from '../api/config';
import './ProfileSettings.css';

function ProfileSettings() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('1');
  
  // All settings state

  const [settings, setSettings] = useState({
    profile: {
      username: user?.username || '',
      email: user?.email || '',
      gradeLevel: user?.gradeLevel || '',
      selectedSubjects: user?.selectedSubjects || []
    },
    theme: {
      theme: 'light',
      fontSize: 'medium',
      colorScheme: 'default'
    },
    studyPreferences: {
      sessionDuration: 25,
      breakInterval: 5,
      cardsPerSession: 10,
      timePerQuestion: 60
    },
    privacy: {
      profileVisibility: 'public',
      shareProgress: true,
      trackActivity: true
    },
    notifications: {
      studyReminders: {
        enabled: true,
        frequency: 'daily',
        customSchedule: []
      },
      quizReminders: {
        enabled: true,
        frequency: 'weekly'
      },
      progressUpdates: {
        enabled: true,
        frequency: 'weekly'
      },
      emailNotifications: {
        studyReminders: true,
        quizAvailable: true,
        progressReports: true,
        inactivityAlerts: true
      }
    }
  });

  useEffect(() => {
    if (user?.notificationPreferences) {
      setSettings(user.notificationPreferences);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    setError('');
    setSuccess('');
  };

  const handleSubjectToggle = (subject) => {
    setFormData(prev => {
      const subjects = prev.selectedSubjects.includes(subject)
        ? prev.selectedSubjects.filter(s => s !== subject)
        : [...prev.selectedSubjects, subject];
      
      return {
        ...prev,
        selectedSubjects: subjects
      };
    });
  };

  const handleToggle = (category, field) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field]
      }
    }));
  };

  const handleFrequencyChange = (category, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        frequency: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put('/api/user/profile', formData);
      setSuccess('Profile updated successfully!');
      // Update local storage with new user data
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.put('/api/user/notification-settings', settings);
      setSuccess('Notification settings updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/api/user/settings');
        setSettings(response.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load settings');
        message.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSettingChange = (section, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = async (section) => {
    try {
      setLoading(true);
      await api.put('/api/user/settings', { [section]: settings[section] });
      message.success('Settings saved successfully');
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (oldPassword, newPassword) => {
    try {
      setLoading(true);
      await api.put('/api/user/password', { oldPassword, newPassword });
      message.success('Password updated successfully!');
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDelete = async () => {
    try {
      setLoading(true);
      await api.delete('/api/user/account');
      message.success('Account deleted successfully!');
      // Handle logout and redirect
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: '1',
      label: 'Profile',
      children: (
        <div className="settings-section">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={settings.profile.username}
              onChange={(e) => handleSettingChange('profile', 'username', e.target.value)}
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="gradeLevel">Grade Level</label>
            <input
              type="text"
              id="gradeLevel"
              value="O-Level"
              disabled
            />
          </div>
          <button 
            className="save-button" 
            onClick={() => handleSaveSettings('profile')}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      )
    },
    {
      key: '2',
      label: 'Theme',
      children: (
        <div className="settings-section">
          <div className="setting-item">
            <label>Theme Mode</label>
            <select
              value={settings.theme.theme}
              onChange={(e) => handleSettingChange('theme', 'theme', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Font Size</label>
            <select
              value={settings.theme.fontSize}
              onChange={(e) => handleSettingChange('theme', 'fontSize', e.target.value)}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <button 
            className="save-button" 
            onClick={() => handleSaveSettings('theme')}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Theme Settings'}
          </button>
        </div>
      )
    },
    {
      key: '3',
      label: 'Notifications',
      children: (
        <div className="settings-section">
          <div className="setting-item">
            <label>Notification Frequency</label>
            <select
              value={settings.notifications.frequency}
              onChange={(e) => handleSettingChange('notifications', 'frequency', e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Notification Time</label>
            <input
              type="time"
              value={settings.notifications.time}
              onChange={(e) => handleSettingChange('notifications', 'time', e.target.value)}
            />
          </div>
          <button 
            className="save-button" 
            onClick={() => handleSaveSettings('notifications')}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Notification Settings'}
          </button>
        </div>
      )
    },
    {
      key: '4',
      label: 'Account',
      children: (
        <div className="settings-section">
          <h3>Account Settings</h3>
          <div className="setting-item">
            <h4>Change Password</h4>
            <div className="form-group">
              <input
                type="password"
                placeholder="Current Password"
                className="password-input"
              />
              <input
                type="password"
                placeholder="New Password"
                className="password-input"
              />
              <button className="secondary-button">Change Password</button>
            </div>
          </div>
          <div className="setting-item danger-zone">
            <h4>Danger Zone</h4>
            <button className="delete-button" onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                handleAccountDelete();
              }
            }}>Delete Account</button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="profile-settings">
      <h2>Settings</h2>
      
      <Tabs
        defaultActiveKey="1"
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        items={items}
        className="settings-tabs"
      />

      {/* ... (rest of the code remains the same) */}
    </div>
  );
};

export default ProfileSettings;
