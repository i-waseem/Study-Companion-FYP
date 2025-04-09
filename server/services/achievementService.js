const User = require('../models/User');
const Achievement = require('../models/Achievement');
const { checkAchievements, achievementDefinitions } = require('../utils/achievements');

// XP requirements for each level
const LEVEL_XP_REQUIREMENTS = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 1000,
  6: 2000,
  7: 3500,
  8: 5500,
  9: 8000,
  10: 11000
};

// XP rewards for different actions
const XP_REWARDS = {
  flashcard: {
    review: 5,           // Per card reviewed
    mastery: 20,         // Per card mastered
    setCompletion: 50,   // Completing a full set
    perfectRecall: 100   // All cards in set rated 5
  },
  streaks: {
    daily: 25,          // Daily login
    threeDay: 50,       // 3-day streak
    weekly: 100,        // 7-day streak
    monthly: 500        // 30-day streak
  },
  achievements: {
    common: 50,
    rare: 100,
    epic: 250,
    legendary: 500
  }
};

class AchievementService {
  // Add XP to user and handle level ups
  static async addXP(userId, amount, category, details = {}) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      // Add XP
      user.xp += amount;

      // Check for level up
      const currentLevel = user.level;
      let newLevel = currentLevel;

      // Find the highest level the user qualifies for
      for (const [level, requirement] of Object.entries(LEVEL_XP_REQUIREMENTS)) {
        if (user.xp >= requirement) {
          newLevel = Math.max(newLevel, parseInt(level));
        }
      }

      // Handle level up
      if (newLevel > currentLevel) {
        user.level = newLevel;
        // Trigger level up notification
        await this.createNotification(userId, 'level_up', {
          oldLevel: currentLevel,
          newLevel,
          xpForNext: LEVEL_XP_REQUIREMENTS[newLevel + 1]
        });
      }

      await user.save();
      return { xpGained: amount, newLevel, oldLevel: currentLevel };
    } catch (error) {
      console.error('Error adding XP:', error);
      throw error;
    }
  }

  // Check and award achievements based on progress
  static async checkAndAwardAchievements(userId, progress) {
    try {
      let achievement = await Achievement.findOne({ userId });
      if (!achievement) {
        achievement = new Achievement({ userId, achievements: [] });
      }

      const { newAchievements, stats } = await checkAchievements(
        userId,
        progress,
        achievement
      );

      // Award XP for new achievements
      for (const achievement of newAchievements) {
        await this.addXP(
          userId,
          XP_REWARDS.achievements[achievement.rarity],
          'achievement',
          { type: achievement.type }
        );

        // Create notification for new achievement
        await this.createNotification(userId, 'achievement_earned', {
          achievement: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          rarity: achievement.rarity
        });
      }

      // Update achievements and stats
      achievement.achievements.push(...newAchievements);
      achievement.stats = stats;
      await achievement.save();

      return newAchievements;
    } catch (error) {
      console.error('Error checking achievements:', error);
      throw error;
    }
  }

  // Get achievement summary for user
  static async getAchievementSummary(userId) {
    try {
      const achievement = await Achievement.findOne({ userId });
      if (!achievement) {
        return {
          total: 0,
          recent: [],
          byRarity: { common: 0, rare: 0, epic: 0, legendary: 0 },
          stats: {
            totalStudyTime: 0,
            longestStreak: 0,
            totalCardsMastered: 0,
            perfectRecalls: 0,
            subjectsCompleted: 0
          }
        };
      }

      // Get achievements earned in the last 7 days
      const recent = achievement.achievements
        .filter(a => {
          const daysSinceEarned = (Date.now() - a.earnedAt.getTime()) / (1000 * 60 * 60 * 24);
          return daysSinceEarned <= 7;
        })
        .sort((a, b) => b.earnedAt - a.earnedAt);

      // Count achievements by rarity
      const byRarity = achievement.achievements.reduce((acc, a) => {
        acc[a.rarity] = (acc[a.rarity] || 0) + 1;
        return acc;
      }, { common: 0, rare: 0, epic: 0, legendary: 0 });

      return {
        total: achievement.achievements.length,
        recent,
        byRarity,
        stats: achievement.stats
      };
    } catch (error) {
      console.error('Error getting achievement summary:', error);
      throw error;
    }
  }

  // Create a notification
  static async createNotification(userId, type, data) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      user.notifications.push({
        type,
        data,
        createdAt: new Date(),
        read: false
      });

      await user.save();
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }
}

module.exports = AchievementService;
