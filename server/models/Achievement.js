const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  achievements: [{
    type: {
      type: String,
      enum: [
        // Study Streaks
        'first_study_session',
        'three_day_streak',
        'week_streak',
        'month_streak',
        
        // Mastery Achievements
        'first_card_mastered',
        'ten_cards_mastered',
        'fifty_cards_mastered',
        'hundred_cards_mastered',
        
        // Topic Achievements
        'topic_completed',
        'subject_completed',
        'all_subjects_completed',
        
        // Study Time
        'study_time_30min',
        'study_time_1hr',
        'study_time_5hr',
        'study_time_24hr',
        
        // Special Achievements
        'perfect_recall',      // All cards in a set rated 5
        'quick_learner',      // Master a card in minimum reviews
        'consistent_student'   // Study every subject in a week
      ],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: String,
    earnedAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      current: Number,
      target: Number
    },
    icon: String,
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary'],
      required: true
    }
  }],
  stats: {
    totalStudyTime: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    totalCardsMastered: {
      type: Number,
      default: 0
    },
    perfectRecalls: {
      type: Number,
      default: 0
    },
    subjectsCompleted: {
      type: Number,
      default: 0
    }
  }
});

module.exports = mongoose.model('Achievement', achievementSchema);
