const express = require('express');
const router = express.Router();
const StudyPlan = require('../models/StudyPlan');
const Quiz = require('../models/Quiz');
const { authMiddleware } = require('../middleware/auth');

// Generate AI Study Plan
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's performance data from last 7 days
    const performanceData = await getUserPerformance(userId);
    
    // Generate AI-based study plan
    const studyPlan = await generateAIStudyPlan(userId, performanceData);
    
    // Save the study plan
    const newPlan = new StudyPlan(studyPlan);
    await newPlan.save();
    
    res.json({ success: true, studyPlan: newPlan });
  } catch (error) {
    console.error('Error generating study plan:', error);
    res.status(500).json({ error: 'Failed to generate study plan' });
  }
});

// Get current study plan
router.get('/current', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let studyPlan = await StudyPlan.findOne({
      userId,
      date: { $gte: today }
    }).sort({ date: -1 });
    
    // If no plan exists or plan is older than 24 hours, generate new one
    if (!studyPlan || isOlderThan24Hours(studyPlan.lastUpdated)) {
      const performanceData = await getUserPerformance(userId);
      const planData = await generateAIStudyPlan(userId, performanceData);
      studyPlan = new StudyPlan(planData);
      await studyPlan.save();
    }
    
    res.json({ success: true, studyPlan });
  } catch (error) {
    console.error('Error fetching study plan:', error);
    res.status(500).json({ error: 'Failed to fetch study plan' });
  }
});

// Update plan completion status
router.put('/update-progress', authMiddleware, async (req, res) => {
  try {
    const { planId, topicId, completed } = req.body;
    
    const plan = await StudyPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ error: 'Study plan not found' });
    }
    
    // Update completion status logic here
    // Calculate overall completion percentage
    
    await plan.save();
    res.json({ success: true, plan });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Helper function to get user performance
async function getUserPerformance(userId) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const quizResults = await Quiz.find({
    userId,
    createdAt: { $gte: sevenDaysAgo }
  }).select('score totalQuestions subject topics accuracy timeSpent');
  
  // Analyze performance
  const subjectPerformance = {};
  const topicStrengths = [];
  const topicWeaknesses = [];
  let totalAccuracy = 0;
  let quizCount = 0;
  
  quizResults.forEach(quiz => {
    if (!subjectPerformance[quiz.subject]) {
      subjectPerformance[quiz.subject] = {
        totalScore: 0,
        totalQuestions: 0,
        quizCount: 0,
        topics: {}
      };
    }
    
    subjectPerformance[quiz.subject].totalScore += quiz.score;
    subjectPerformance[quiz.subject].totalQuestions += quiz.totalQuestions;
    subjectPerformance[quiz.subject].quizCount++;
    
    // Track topic performance
    quiz.topics?.forEach(topic => {
      if (!subjectPerformance[quiz.subject].topics[topic]) {
        subjectPerformance[quiz.subject].topics[topic] = {
          correct: 0,
          total: 0
        };
      }
      // Add topic performance tracking
    });
    
    if (quiz.accuracy) {
      totalAccuracy += quiz.accuracy;
      quizCount++;
    }
  });
  
  // Calculate averages and identify strengths/weaknesses
  Object.keys(subjectPerformance).forEach(subject => {
    const perf = subjectPerformance[subject];
    perf.accuracy = (perf.totalScore / perf.totalQuestions) * 100;
    
    if (perf.accuracy >= 80) {
      topicStrengths.push(subject);
    } else if (perf.accuracy < 60) {
      topicWeaknesses.push(subject);
    }
  });
  
  return {
    subjectPerformance,
    topicStrengths,
    topicWeaknesses,
    averageAccuracy: quizCount > 0 ? totalAccuracy / quizCount : 0,
    totalQuizzes: quizResults.length
  };
}

// AI Study Plan Generation
async function generateAIStudyPlan(userId, performanceData) {
  const { subjectPerformance, topicStrengths, topicWeaknesses, averageAccuracy } = performanceData;
  
  // AI Logic for generating study plan
  const subjects = [];
  const recommendations = [];
  
  // Prioritize weak subjects
  Object.keys(subjectPerformance).forEach(subjectName => {
    const perf = subjectPerformance[subjectName];
    let priority = 'medium';
    let allocatedTime = 45; // default minutes
    
    if (perf.accuracy < 60) {
      priority = 'high';
      allocatedTime = 60;
      recommendations.push({
        type: 'weakness',
        message: `Focus more on ${subjectName} - Current accuracy: ${perf.accuracy.toFixed(1)}%`,
        priority: 'high'
      });
    } else if (perf.accuracy >= 80) {
      priority = 'low';
      allocatedTime = 30;
    }
    
    // Generate topics based on performance
    const topics = [];
    
    // Add weak topics first
    if (perf.accuracy < 70) {
      topics.push({
        name: `${subjectName} Fundamentals Review`,
        duration: 20,
        difficulty: 'medium',
        reason: 'Strengthen foundation',
        focusArea: 'weakness'
      });
    }
    
    // Add practice topics
    topics.push({
      name: `${subjectName} Practice Problems`,
      duration: 25,
      difficulty: perf.accuracy < 60 ? 'easy' : 'medium',
      reason: 'Regular practice',
      focusArea: 'revision'
    });
    
    // Add advanced topics for strong subjects
    if (perf.accuracy >= 80) {
      topics.push({
        name: `Advanced ${subjectName} Concepts`,
        duration: 15,
        difficulty: 'hard',
        reason: 'Challenge yourself',
        focusArea: 'strength'
      });
    }
    
    subjects.push({
      name: subjectName,
      allocatedTime,
      priority,
      topics
    });
  });
  
  // Add general recommendations
  if (averageAccuracy < 60) {
    recommendations.push({
      type: 'general',
      message: 'Consider reviewing basic concepts across all subjects',
      priority: 'high'
    });
  }
  
  if (performanceData.totalQuizzes < 3) {
    recommendations.push({
      type: 'practice',
      message: 'Take more practice quizzes to better assess your performance',
      priority: 'medium'
    });
  }
  
  // Calculate total study time
  const totalStudyTime = subjects.reduce((sum, subject) => sum + subject.allocatedTime, 0);
  
  return {
    userId,
    date: new Date(),
    lastUpdated: new Date(),
    planType: 'daily',
    subjects,
    performance: {
      overallAccuracy: averageAccuracy,
      strengths: topicStrengths,
      weaknesses: topicWeaknesses,
      improvementAreas: topicWeaknesses
    },
    recommendations,
    totalStudyTime,
    studyGoals: [
      {
        goal: 'Complete all high-priority topics',
        targetDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        progress: 0
      }
    ]
  };
}

// Check if plan is older than 24 hours
function isOlderThan24Hours(date) {
  const now = new Date();
  const diff = now - date;
  return diff > (24 * 60 * 60 * 1000);
}

module.exports = router;
