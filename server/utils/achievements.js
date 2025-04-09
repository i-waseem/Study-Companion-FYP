const achievementDefinitions = {
  // Study Streaks
  first_study_session: {
    name: 'First Steps',
    description: 'Complete your first study session',
    icon: '🎯',
    rarity: 'common'
  },
  three_day_streak: {
    name: 'Building Momentum',
    description: 'Study for 3 days in a row',
    icon: '🔥',
    rarity: 'common'
  },
  week_streak: {
    name: 'Weekly Warrior',
    description: 'Maintain a 7-day study streak',
    icon: '⚔️',
    rarity: 'rare'
  },
  month_streak: {
    name: 'Unstoppable Scholar',
    description: 'Maintain a 30-day study streak',
    icon: '👑',
    rarity: 'legendary'
  },

  // Mastery Achievements
  first_card_mastered: {
    name: 'Memory Master',
    description: 'Master your first flashcard',
    icon: '🧠',
    rarity: 'common'
  },
  ten_cards_mastered: {
    name: 'Knowledge Collector',
    description: 'Master 10 flashcards',
    icon: '📚',
    rarity: 'common'
  },
  fifty_cards_mastered: {
    name: 'Walking Encyclopedia',
    description: 'Master 50 flashcards',
    icon: '🎓',
    rarity: 'rare'
  },
  hundred_cards_mastered: {
    name: 'Genius at Work',
    description: 'Master 100 flashcards',
    icon: '🌟',
    rarity: 'epic'
  },

  // Topic Achievements
  topic_completed: {
    name: 'Topic Champion',
    description: 'Master all cards in a topic',
    icon: '🏆',
    rarity: 'rare'
  },
  subject_completed: {
    name: 'Subject Expert',
    description: 'Complete all topics in a subject',
    icon: '🎖️',
    rarity: 'epic'
  },
  all_subjects_completed: {
    name: 'Ultimate Scholar',
    description: 'Master all subjects',
    icon: '💫',
    rarity: 'legendary'
  },

  // Study Time
  study_time_30min: {
    name: 'Quick Study',
    description: 'Study for 30 minutes total',
    icon: '⏱️',
    rarity: 'common'
  },
  study_time_1hr: {
    name: 'Dedicated Learner',
    description: 'Study for 1 hour total',
    icon: '⌛',
    rarity: 'common'
  },
  study_time_5hr: {
    name: 'Study Marathon',
    description: 'Study for 5 hours total',
    icon: '🏃',
    rarity: 'rare'
  },
  study_time_24hr: {
    name: 'Time Lord',
    description: 'Study for 24 hours total',
    icon: '⭐',
    rarity: 'epic'
  },

  // Special Achievements
  perfect_recall: {
    name: 'Perfect Recall',
    description: 'Rate all cards in a set with confidence level 5',
    icon: '✨',
    rarity: 'epic'
  },
  quick_learner: {
    name: 'Quick Learner',
    description: 'Master a card in minimum number of reviews',
    icon: '⚡',
    rarity: 'rare'
  },
  consistent_student: {
    name: 'Well-Rounded Scholar',
    description: 'Study every subject in a week',
    icon: '🌈',
    rarity: 'epic'
  }
};

const checkAchievements = async (userId, progress, achievements) => {
  const newAchievements = [];
  const stats = achievements?.stats || {
    totalStudyTime: 0,
    longestStreak: 0,
    totalCardsMastered: 0,
    perfectRecalls: 0,
    subjectsCompleted: 0
  };

  // Helper function to add achievement if not already earned
  const addAchievement = (type) => {
    if (!achievements?.achievements.some(a => a.type === type)) {
      const definition = achievementDefinitions[type];
      newAchievements.push({
        type,
        ...definition,
        earnedAt: new Date()
      });
    }
  };

  // Check study streak achievements
  const maxStreak = Math.max(...progress.flashcardSets.map(set => set.studyStreak));
  if (maxStreak >= 1) addAchievement('first_study_session');
  if (maxStreak >= 3) addAchievement('three_day_streak');
  if (maxStreak >= 7) addAchievement('week_streak');
  if (maxStreak >= 30) addAchievement('month_streak');

  // Check mastery achievements
  const totalMastered = progress.flashcardSets.reduce(
    (sum, set) => sum + set.masteredCards, 0
  );
  if (totalMastered >= 1) addAchievement('first_card_mastered');
  if (totalMastered >= 10) addAchievement('ten_cards_mastered');
  if (totalMastered >= 50) addAchievement('fifty_cards_mastered');
  if (totalMastered >= 100) addAchievement('hundred_cards_mastered');

  // Check study time achievements
  const totalStudyTime = progress.totalStudyTime;
  if (totalStudyTime >= 30) addAchievement('study_time_30min');
  if (totalStudyTime >= 60) addAchievement('study_time_1hr');
  if (totalStudyTime >= 300) addAchievement('study_time_5hr');
  if (totalStudyTime >= 1440) addAchievement('study_time_24hr');

  // Check for perfect recall
  const perfectSets = progress.flashcardSets.filter(set => 
    set.cards.length > 0 && 
    set.cards.every(card => card.confidenceLevel === 5)
  );
  if (perfectSets.length > stats.perfectRecalls) {
    addAchievement('perfect_recall');
    stats.perfectRecalls = perfectSets.length;
  }

  // Update stats
  stats.totalStudyTime = totalStudyTime;
  stats.longestStreak = Math.max(stats.longestStreak, maxStreak);
  stats.totalCardsMastered = totalMastered;

  return { newAchievements, stats };
};

module.exports = {
  achievementDefinitions,
  checkAchievements
};
