const Progress = require('../models/Progress');

/**
 * Central service for tracking all user activities
 */
class ActivityTracker {
  /**
   * Log a user activity
   * @param {string} userId - User ID
   * @param {string} type - Activity type (quiz, flashcard, notes, etc)
   * @param {Object} data - Activity specific data
   * @param {number} duration - Duration in seconds
   */
  static async logActivity(userId, type, data = {}, duration = 0) {
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
        data: enhancedData,
        duration: Math.round(duration)
      };

      await Progress.findOneAndUpdate(
        { userId },
        {
          $push: { activities: activity },
          $set: { lastActive: new Date() },
          $inc: { totalStudyTime: Math.round(duration / 60) } // Convert to minutes for total time
        },
        { new: true, upsert: true }
      );

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
