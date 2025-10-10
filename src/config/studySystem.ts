export const MASTERY_CONFIG = {
  LEVEL_1: { 
    minAccuracy: 0, 
    questionsNeeded: 15,
    questionsPerDay: 5,
    description: 'Foundation Building'
  },
  LEVEL_2: { 
    minAccuracy: 70, 
    questionsNeeded: 25,
    questionsPerDay: 10,
    description: 'Intermediate Practice'
  },
  LEVEL_3: { 
    minAccuracy: 85, 
    questionsNeeded: 40,
    questionsPerDay: 15,
    description: 'Advanced Mastery'
  },
  LEVEL_4: { 
    minAccuracy: 90, 
    questionsNeeded: 60,
    questionsPerDay: 3,
    description: 'Maintenance Mode'
  },
  STUCK_THRESHOLD_DAYS: 7,
  WEAK_ACCURACY_THRESHOLD: 60,
  STRONG_ACCURACY_THRESHOLD: 80
};

export const SPACED_REPETITION = {
  INTERVALS: [1, 3, 7, 15, 30, 60], // days
  REVIEW_DURATION: [10, 8, 5, 5, 3, 3] // minutes
};

export const BURNOUT_CONFIG = {
  MIN_ENERGY_SCORE: 40,
  REST_DAY_THRESHOLD: 30,
  CONSECUTIVE_LOW_DAYS: 3,
  SIGNALS: {
    accuracy_drop: -15, // % drop from avg
    time_decrease: -30, // % decrease
    night_study: 22, // hour threshold
    incomplete_targets: 0.5 // 50% completion
  }
};

export const JEE_CONFIG = {
  EXAM_DATE: '2026-05-24',
  SUBJECT_WEIGHTAGE: {
    Physics: 0.33,
    Chemistry: 0.33,
    Mathematics: 0.34
  },
  PHASES: {
    LEARNING: 0.60, // 60% of total time
    REVISION: 0.25, // 25% of total time
    MOCK_TESTS: 0.15 // 15% of total time
  },
  DAILY_TARGET: 30, // questions
  MIN_STUDY_HOURS: 4,
  MAX_STUDY_HOURS: 10
};

export const PERFORMANCE_MULTIPLIERS = {
  WEAK: 1.3,    // +30% time for weak subjects
  MEDIUM: 1.0,  // Base time
  STRONG: 0.85  // -15% time for strong subjects
};

export const TOPIC_CATEGORIES = {
  Physics: [
    'Mechanics', 'Thermodynamics', 'Electromagnetism', 
    'Optics', 'Modern Physics', 'Waves'
  ],
  Chemistry: [
    'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'
  ],
  Mathematics: [
    'Algebra', 'Calculus', 'Coordinate Geometry', 
    'Trigonometry', 'Vectors', 'Probability'
  ]
};
