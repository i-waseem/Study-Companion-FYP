const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  gradeLevel: {
    type: String,
    enum: ['Grade-1', 'Grade-2', 'Grade-3', 'Grade-4', 'Grade-5', 
           'Grade-6', 'Grade-7', 'Grade-8', 'O-Level'],
    required: false
  },
  selectedSubjects: [{
    type: String,
    enum: ['Mathematics', 'Science', 'English', 'History', 'Geography', 
           'Physics', 'Chemistry', 'Biology', 'Pakistan-Studies']
  }],
  themeSettings: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'light'
    },
    fontSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium'
    },
    colorScheme: {
      type: String,
      enum: ['default', 'blue', 'green', 'purple'],
      default: 'default'
    }
  },
  studyPreferences: {
    sessionDuration: {
      type: Number,
      min: 5,
      max: 120,
      default: 25
    },
    breakInterval: {
      type: Number,
      min: 1,
      max: 30,
      default: 5
    },
    cardsPerSession: {
      type: Number,
      min: 5,
      max: 50,
      default: 10
    },
    timePerQuestion: {
      type: Number,
      min: 30,
      max: 300,
      default: 60
    }
  },
  privacySettings: {
    profileVisibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'public'
    },
    shareProgress: {
      type: Boolean,
      default: true
    },
    trackActivity: {
      type: Boolean,
      default: true
    }
  },
  notificationPreferences: {
    studyReminders: {
      enabled: { type: Boolean, default: true },
      frequency: { 
        type: String, 
        enum: ['daily', 'weekly', 'custom'],
        default: 'daily'
      },
      customSchedule: [{
        dayOfWeek: { 
          type: String,
          enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        },
        time: String // HH:mm format
      }],
      lastSent: Date
    },
    quizReminders: {
      enabled: { type: Boolean, default: true },
      frequency: { 
        type: String, 
        enum: ['daily', 'weekly', 'custom'],
        default: 'weekly'
      }
    },
    progressUpdates: {
      enabled: { type: Boolean, default: true },
      frequency: { 
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'weekly'
      }
    },
    emailNotifications: {
      studyReminders: { type: Boolean, default: true },
      quizAvailable: { type: Boolean, default: true },
      progressReports: { type: Boolean, default: true },
      inactivityAlerts: { type: Boolean, default: true }
    }
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  studyStreak: {
    currentStreak: {
      type: Number,
      default: 0
    },
    lastStudyDate: {
      type: Date,
      default: null
    }
  },
  quizHistory: [{
    subject: String,
    score: Number,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  studySessions: [{
    subject: String,
    duration: Number, // in minutes
    date: {
      type: Date,
      default: Date.now
    }
  }],
  // Achievement System
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  xp: {
    type: Number,
    default: 0,
    min: 0
  },
  badges: [{
    type: {
      type: String,
      enum: ['quiz', 'flashcard', 'notes', 'career', 'study', 'social']
    },
    name: {
      type: String,
      required: true
    },
    description: String,
    category: {
      type: String,
      enum: ['consistency', 'performance', 'study_habits', 'social', 'special']
    },
    earnedAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0
    },
    maxProgress: {
      type: Number,
      required: true
    },
    relatedData: {
      componentId: String,
      score: Number,
      timeSpent: Number,
      additionalData: mongoose.Schema.Types.Mixed
    }
  }],
  achievements: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    progress: {
      type: Number,
      default: 0
    },
    target: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      enum: ['quiz', 'flashcard', 'notes', 'career', 'study', 'social']
    },
    unlockedAt: Date,
    isCompleted: {
      type: Boolean,
      default: false
    }
  }],
  progress: {
    quizzes: [{
      subject: String,
      topic: String,
      score: Number,
      totalQuestions: Number,
      date: { type: Date, default: Date.now }
    }],
    strengths: [String],
    weaknesses: [String]
  },
  notes: [{
    subject: String,
    topic: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  flashcards: [{
    subject: String,
    topic: String,
    front: String,
    back: String,
    status: {
      type: String,
      enum: ['new', 'learning', 'mastered'],
      default: 'new'
    },
    lastReviewed: Date
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  console.log('Pre-save middleware running');
  console.log('Password modified:', this.isModified('password'));
  
  if (!this.isModified('password')) {
    console.log('Password not modified, skipping hashing');
    return next();
  }

  try {
    console.log('Hashing password...');
    console.log('Original password length:', this.password.length);
    
    // Check if password is already hashed
    if (this.password.startsWith('$2a$')) {
      console.log('Password is already hashed, skipping...');
      return next();
    }
    
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    console.log('Generated salt');
    
    // Hash password
    const hashedPassword = await bcrypt.hash(this.password, salt);
    console.log('Password hashed, new length:', hashedPassword.length);
    
    // Set hashed password
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  console.log('Comparing passwords in model');
  console.log('Candidate password length:', candidatePassword.length);
  console.log('Stored hash length:', this.password.length);
  
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Password comparison result:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
};

// Update last active timestamp
userSchema.methods.updateLastActive = async function() {
  this.lastActive = new Date();
  await this.save();
};

// Update study streak
userSchema.methods.updateStudyStreak = async function() {
  const now = new Date();
  const lastStudy = this.studyStreak.lastStudyDate;
  
  if (!lastStudy) {
    this.studyStreak.currentStreak = 1;
  } else {
    const daysSinceLastStudy = Math.floor((now - lastStudy) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastStudy <= 1) {
      this.studyStreak.currentStreak += 1;
    } else {
      this.studyStreak.currentStreak = 1;
    }
  }
  
  this.studyStreak.lastStudyDate = now;
  await this.save();
};

// Static method to get weekly stats
userSchema.statics.getWeeklyStats = async function(userId) {
  const user = await this.findById(userId);
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Get quizzes from last week
  const weeklyQuizzes = user.quizHistory.filter(quiz => 
    quiz.date >= oneWeekAgo
  );

  // Get study sessions from last week
  const weeklyStudySessions = user.studySessions.filter(session => 
    session.date >= oneWeekAgo
  );

  // Calculate stats
  const quizzesTaken = weeklyQuizzes.length;
  const averageScore = quizzesTaken > 0 
    ? weeklyQuizzes.reduce((acc, quiz) => acc + quiz.score, 0) / quizzesTaken 
    : 0;
  const studyHours = weeklyStudySessions.reduce((acc, session) => 
    acc + (session.duration / 60), 0
  );

  // Generate recommendations
  let recommendations = '';
  if (quizzesTaken === 0) {
    recommendations = 'Try taking some quizzes this week to track your progress!';
  } else {
    const weakSubjects = weeklyQuizzes
      .filter(quiz => quiz.score < 70)
      .map(quiz => quiz.subject);
    
    if (weakSubjects.length > 0) {
      recommendations = `Focus on improving in: ${weakSubjects.join(', ')}`;
    } else {
      recommendations = 'Great work! Keep maintaining your excellent performance!';
    }
  }

  return {
    quizzesTaken,
    averageScore,
    studyHours,
    streak: user.studyStreak.currentStreak,
    recommendations
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User;
