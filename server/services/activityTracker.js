const Progress = require('../models/Progress');

/**
 * Central service for tracking all user activities
 */
class ActivityTracker {
  /**
   * Update user's streak data
   * @param {string} userId - User ID
   * @param {Date} currentTime - Current timestamp
   * @private
   */
  static async _updateStreak(userId, currentTime = new Date()) {
    try {
      const progress = await Progress.findOne({ userId });
      if (!progress) return;

      const lastStudied = progress.studyHabits?.streakData?.lastStudied;
      const currentStreak = progress.studyHabits?.streakData?.current || 0;
      const longestStreak = progress.studyHabits?.streakData?.longest || 0;

      // Initialize dates
      const today = new Date(currentTime.setHours(0, 0, 0, 0));
      const lastStudyDate = lastStudied ? new Date(new Date(lastStudied).setHours(0, 0, 0, 0)) : null;
      
      // Calculate days difference
      const daysDiff = lastStudyDate ? Math.floor((today - lastStudyDate) / (1000 * 60 * 60 * 24)) : null;

      let newStreak = currentStreak;
      
      // If this is the first activity ever
      if (!lastStudied) {
        newStreak = 1;
      }
      // If studied today already, maintain streak
      else if (daysDiff === 0) {
        // Do nothing, maintain current streak
      }
      // If studied yesterday, increment streak
      else if (daysDiff === 1) {
        newStreak += 1;
      }
      // If missed a day or more, reset streak
      else {
        newStreak = 1;
      }

      // Update longest streak if current is higher
      const newLongestStreak = Math.max(newStreak, longestStreak);

      // Update progress with new streak data
      await Progress.findOneAndUpdate(
        { userId },
        {
          $set: {
            'studyHabits.streakData': {
              current: newStreak,
              longest: newLongestStreak,
              lastStudied: currentTime
            }
          }
        },
        { new: true }
      );

      return {
        current: newStreak,
        longest: newLongestStreak,
        lastStudied: currentTime
      };
    } catch (error) {
      console.error('Error updating streak:', error);
      throw error;
    }
  }
  /**
   * Log a user activity
   * @param {string} userId - User ID
   * @param {string} type - Activity type (quiz, flashcard, notes, etc)
   * @param {Object} data - Activity specific data
   * @param {number} duration - Duration in seconds
   */
  static async logActivity(userId, type, data = {}, duration = 0) {
    const currentTime = new Date();
    try {
      // Enhance activity data based on type
      let enhancedData = { ...data };
      
      switch (type) {
        case 'flashcard':
          enhancedData = {
            ...enhancedData,
            setName: data.setName || 'Untitled Set',
            cardsReviewed: data.cardsReviewed || 0,
            correctAnswers: data.correctAnswers || 0,
            accuracy: data.accuracy || 0
          };
          break;
        case 'quiz':
          enhancedData = {
            ...enhancedData,
            subject: data.subject || 'General',
            topic: data.topic || 'Unknown',
            score: data.score || 0,
            totalQuestions: data.totalQuestions || 0
          };
          break;
        case 'notes':
          enhancedData = {
            ...enhancedData,
            subject: data.subject || 'General',
            title: data.title || 'Untitled Note',
            wordCount: data.wordCount || 0
          };
          break;
        case 'career':
          enhancedData = {
            ...enhancedData,
            action: data.action || 'Viewed',
            resource: data.resource || 'Career Guide'
          };
          break;
      }

      const activity = {
        type,
        timestamp: new Date(),
        data: enhancedData
      };

      // Update activity
      const progress = await Progress.findOneAndUpdate(
        { userId },
        {
          $push: { activities: activity },
          $set: { lastActive: currentTime }
        },
        { new: true, upsert: true }
      );

      // Update streak if this is a study-related activity
      if (['quiz', 'flashcard', 'notes'].includes(type)) {
        await this._updateStreak(userId, currentTime);
      }

      return activity;
    } catch (error) {
      console.error('Activity tracking error:', error);
      throw error;
    }
  }

  /**
   * Get user activities with optional filtering
   * @param {string} userId - User ID
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} List of activities
   */
  static async getUserActivities(userId, filters = {}) {
    try {
      const progress = await Progress.findOne({ userId });
      if (!progress) return [];

      let activities = progress.activities || [];

      // Apply filters if any
      if (filters.type) {
        activities = activities.filter(a => a.type === filters.type);
      }
      if (filters.startDate) {
        activities = activities.filter(a => new Date(a.timestamp) >= new Date(filters.startDate));
      }
      if (filters.endDate) {
        activities = activities.filter(a => new Date(a.timestamp) <= new Date(filters.endDate));
      }

      return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      console.error('Error getting user activities:', error);
      throw error;
    }
  }

  /**
   * Get activity statistics for a user
   * @param {string} userId - The user's ID
   */
  static async getStats(userId) {
    try {
      const progress = await Progress.findOne({ userId });
      if (!progress) return null;

      const stats = {
        totalStudyTime: progress.totalStudyTime || 0,
        lastActive: progress.lastActive,
        activityCounts: {
          quiz: 0,
          flashcard: 0,
          career: 0,
          study: 0
        },
        streakData: {
          current: progress.studyHabits?.streakData?.current || 0,
          longest: progress.studyHabits?.streakData?.longest || 0,
          lastStudied: progress.studyHabits?.streakData?.lastStudied || null
        }
      };

      // Count activities by type
      progress.activities?.forEach(activity => {
        if (stats.activityCounts[activity.type] !== undefined) {
          stats.activityCounts[activity.type]++;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
};

module.exports = ActivityTracker;
