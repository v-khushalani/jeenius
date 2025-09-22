import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ChevronRight, Calendar, BookOpen, Stethoscope, Calculator, Clock } from 'lucide-react';

const GoalSelectionPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [examDate, setExamDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Calculate exam dates and days remaining
  const examDates = {
    'JEE Main': '2025-04-10',
    'JEE Advanced': '2025-05-25',
    'NEET': '2025-05-05',
    'Foundation': null
  };

  // Check if user has already set up their goals
  useEffect(() => {
    const checkUserProfile = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if user already has goals set up
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('target_exam, grade, subjects')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Profile check error:', error);
          setIsLoading(false);
          return;
        }

        // If user already has goals, redirect to dashboard
        if (profile && profile.target_exam && profile.grade) {
          console.log('✅ User already has goals set up, redirecting to dashboard');
          navigate('/dashboard', { replace: true });
          return;
        }

        // Also check localStorage for goals
        const savedGoals = localStorage.getItem('userGoals');
        if (savedGoals) {
          const goals = JSON.parse(savedGoals);
          if (goals.goal && goals.grade) {
            console.log('✅ Goals found in localStorage, redirecting to dashboard');
            navigate('/dashboard', { replace: true });
            return;
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error checking user profile:', error);
        setIsLoading(false);
      }
    };

    checkUserProfile();
  }, [user, navigate]);

  useEffect(() => {
    if (selectedGoal && examDates[selectedGoal]) {
      const today = new Date();
      const exam = new Date(examDates[selectedGoal]);
      const timeDiff = exam.getTime() - today.getTime();
      const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setDaysRemaining(days > 0 ? days : 0);
      setExamDate(examDates[selectedGoal]);
    }
  }, [selectedGoal]);

  const grades = [
    { id: '6', name: 'Class 6', icon: '🌱', desc: 'Foundation Building' },
    { id: '7', name: 'Class 7', icon: '🌿', desc: 'Concept Development' },
    { id: '8', name: 'Class 8', icon: '🌳', desc: 'Skill Enhancement' },
    { id: '9', name: 'Class 9', icon: '🏗️', desc: 'Pre-Foundation' },
    { id: '10', name: 'Class 10', icon: '📚', desc: 'Foundation Mastery' },
    { id: '11', name: 'Class 11', icon: '🎯', desc: 'Competitive Edge' },
    { id: '12', name: 'Class 12', icon: '🚀', desc: 'Final Sprint' }
  ];

  const goals = {
    '6': [{ id: 'Foundation', name: 'Foundation Building', icon: <BookOpen className="w-6 h-6" />, color: 'bg-slate-600' }],
    '7': [{ id: 'Foundation', name: 'Foundation Building', icon: <BookOpen className="w-6 h-6" />, color: 'bg-slate-600' }],
    '8': [{ id: 'Foundation', name: 'Foundation Building', icon: <BookOpen className="w-6 h-6" />, color: 'bg-slate-600' }],
    '9': [{ id: 'Foundation', name: 'Foundation Building', icon: <BookOpen className="w-6 h-6" />, color: 'bg-slate-600' }],
    '10': [{ id: 'Foundation', name: 'Foundation Building', icon: <BookOpen className="w-6 h-6" />, color: 'bg-slate-600' }],
    '11': [
      { id: 'JEE', name: 'JEE Preparation', icon: <Calculator className="w-6 h-6" />, color: 'bg-red-500' },
      { id: 'NEET', name: 'NEET Preparation', icon: <Stethoscope className="w-6 h-6" />, color: 'bg-green-500' }
    ],
    '12': [
      { id: 'JEE', name: 'JEE Preparation', icon: <Calculator className="w-6 h-6" />, color: 'bg-red-500' },
      { id: 'NEET', name: 'NEET Preparation', icon: <Stethoscope className="w-6 h-6" />, color: 'bg-green-500' }
    ]
  };
  
  // Auto-select all subjects based on goal
  const subjects = {
    'JEE': ['Physics', 'Chemistry', 'Mathematics'],
    'NEET': ['Physics', 'Chemistry', 'Biology'],
    'Foundation': ['Mathematics', 'Science', 'English']
  };

  const handleNext = () => {
  if (currentStep < 2) {
    setCurrentStep(currentStep + 1);
  }
};

// Add this new handleStartJourney function:
const handleStartJourney = async () => {
  if (!selectedGoal || !selectedGrade) {
    console.error('Missing required selections');
    return;
  }

  // Auto-select all subjects for the chosen goal
  const selectedSubjects = subjects[selectedGoal] || [];
  
  try {
    // Save user goals to profile
    const userGoals = {
      grade: selectedGrade,
      goal: selectedGoal,
      subjects: selectedSubjects,
      daysRemaining: daysRemaining,
      createdAt: new Date().toISOString()
    };
    
    // Save to localStorage first
    localStorage.setItem('userGoals', JSON.stringify(userGoals));
    console.log('✅ Goals saved to localStorage:', userGoals);
    
    if (user?.id) {
      // Update profile in Supabase
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          target_exam: selectedGoal,
          grade: parseInt(selectedGrade),
          subjects: selectedSubjects,
          daily_goal: selectedSubjects.length * 10,
          goals_set: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        // Don't throw error, still navigate
      } else {
        console.log('✅ User goals saved to profile');
      }
    }
    
    // Navigate to dashboard
    console.log('🚀 Navigating to dashboard...');
    navigate('/dashboard');
    
  } catch (error) {
    console.error('Error saving goals:', error);
    // Still navigate even if save fails
    navigate('/dashboard');
  }
};

  const canProceed = () => {
    if (currentStep === 1) return selectedGrade;
    if (currentStep === 2) return selectedGoal;
    return false;
  };

  // Show loading while checking user profile
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center" style={{backgroundColor: '#e9e9e9'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderColor: '#013062'}}></div>
          <p className="text-gray-600">Setting up your learning journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" style={{backgroundColor: '#e9e9e9'}}>
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4" style={{color: '#013062'}}>
            Welcome to JEEnius! 🎯
          </h1>
          <p className="text-xl text-gray-600">Let's customize your learning journey</p>
          
          {/* Progress Bar - Only 2 steps */}
          <div className="flex justify-center mt-8 mb-4">
            <div className="flex space-x-4">
              {[1, 2].map((step) => (
                <div key={step} className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                  step <= currentStep ? 'text-white shadow-lg' : 'bg-gray-400 text-gray-600'
                }`} style={{
                  backgroundColor: step <= currentStep ? '#013062' : undefined
                }}>
                  {step}
                </div>
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Step {currentStep}: {currentStep === 1 ? 'Select Grade' : 'Choose Course'}
          </div>
        </div>

        {/* Step 1: Grade Selection */}
        {currentStep === 1 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8" style={{color: '#013062'}}>Which grade are you in? 📚</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {grades.map((grade) => (
                <div
                  key={grade.id}
                  onClick={() => setSelectedGrade(grade.id)}
                  className={`p-4 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 border-2 bg-white shadow-lg hover:shadow-xl ${
                    selectedGrade === grade.id
                      ? 'shadow-2xl transform scale-105'
                      : 'hover:border-gray-300'
                  }`}
                  style={{
                    borderColor: selectedGrade === grade.id ? '#013062' : '#e5e7eb',
                    boxShadow: selectedGrade === grade.id ? '0 0 0 3px rgba(1, 48, 98, 0.1)' : undefined
                  }}
                >
                  <div className="text-3xl sm:text-4xl mb-3 text-center">{grade.icon}</div>
                  <h3 className="text-lg sm:text-xl font-bold text-center mb-2" style={{color: '#013062'}}>{grade.name}</h3>
                  <p className="text-sm text-gray-500 text-center">{grade.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Course Selection */}
        {currentStep === 2 && selectedGrade && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8" style={{color: '#013062'}}>What's your target? 🎯</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {goals[selectedGrade]?.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={`p-4 sm:p-6 lg:p-8 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 border-2 bg-white shadow-lg hover:shadow-xl ${
                    selectedGoal === goal.id
                      ? 'shadow-2xl transform scale-105'
                      : 'hover:border-gray-300'
                  }`}
                  style={{
                    borderColor: selectedGoal === goal.id ? '#013062' : '#e5e7eb',
                    boxShadow: selectedGoal === goal.id ? '0 0 0 3px rgba(1, 48, 98, 0.1)' : undefined
                  }}
                >
                  <div className={`inline-flex p-3 rounded-full ${goal.color} mb-4`}>
                    {goal.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{color: '#013062'}}>{goal.name}</h3>
                  
                  {examDates[goal.id] && selectedGoal === goal.id && (
                    <div className="mt-4 p-3 rounded-lg" style={{backgroundColor: '#f8fafc', border: '1px solid #e2e8f0'}}>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" style={{color: '#013062'}} />
                          <span style={{color: '#013062'}}>Exam Date: {new Date(examDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center font-bold" style={{color: '#dc2626'}}>
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{daysRemaining} days left</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="text-center mt-12">
          {currentStep === 1 && (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform text-white shadow-lg hover:shadow-xl ${
                canProceed()
                  ? 'hover:scale-105'
                  : 'opacity-50 cursor-not-allowed'
              }`}
              style={{
                backgroundColor: canProceed() ? '#013062' : '#9ca3af'
              }}
            >
              Continue
              <ChevronRight className="inline ml-2 w-5 h-5" />
            </button>
          )}

          {currentStep === 2 && (
            <div className="space-x-4">
              <button
                onClick={handleStartJourney}
                disabled={!selectedGoal}
                className={`px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform text-white shadow-lg hover:shadow-xl ${
                  selectedGoal
                    ? 'hover:scale-105'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                style={{
                  backgroundColor: selectedGoal ? '#013062' : '#9ca3af'
                }}
              >
                Start My Journey! 🚀
              </button>
              
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-4 rounded-full border border-gray-400 text-gray-600 hover:bg-gray-100 transition-all duration-300"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalSelectionPage;
