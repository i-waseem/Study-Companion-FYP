const Progress = require('../models/Progress');

/**
 * Central service for tracking all user activities
 */
const activityTracker = {
  /**
   * Log any type of activity
   * @param {string} userId - The user's ID
   * @param {string} type - Type of activity (quiz, flashcard, career, study)
   * @param {Object} data - Activity specific data
   * @param {number} duration - Duration in minutes (optional)
   */
  async logActivity(userId, type, data, duration = 0) {
    try {
      const activity = {
        type,
        timestamp: new Date(),
        data,
        duration
      };

      // Update progress document
      const progress = await Progress.findOneAndUpdate(
        { userId },
        {
          $push: { activities: activity },
          $set: { lastActive: new Date() },
          $inc: { totalStudyTime: duration }
        },
        { upsert: true, new: true }
      );

      return progress;
    } catch (error) {
      console.error('Activity tracking error:', error);
      throw error;
    }
  },

  /**
   * Get all activities for a user
   * @param {string} userId - The user's ID
   * @param {Object} filter - Optional filter criteria
   */
  async getActivities(userId, filter = {}) {
    try {
      const progress = await Progress.findOne({ userId });
      if (!progress) return [];

      let activities = progress.activities || [];

      // Apply filters if any
      if (filter.type) {
        activities = activities.filter(a => a.type === filter.type);
      }
      if (filter.startDate) {
        activities = activities.filter(a => a.timestamp >= filter.startDate);
      }
      if (filter.endDate) {
        activities = activities.filter(a => a.timestamp <= filter.endDate);
      }

      return activities;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },

  /**
   * Get activity statistics for a user
   * @param {string} userId - The user's ID
   */
  async getStats(userId) {
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

module.exports = activityTracker;
