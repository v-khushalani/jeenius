import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ChevronRight, Calendar, Target, BookOpen, Stethoscope, Calculator, Atom, FlaskConical, User, Clock, Trophy, Star } from 'lucide-react';

const GoalSelectionPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [examDate, setExamDate] = useState('');

  // Calculate exam dates and days remaining
  const examDates = {
    'JEE Main': '2025-04-10',
    'JEE Advanced': '2025-05-25',
    'NEET': '2025-05-05',
    'Foundation': null
  };

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
  
  const subjects = {
  'JEE': ['Physics', 'Chemistry', 'Mathematics'],
  'NEET': ['Physics', 'Chemistry', 'Biology'],
  'Foundation': ['Mathematics', 'Science', 'English']
};

  const subjectIcons = {
    'Physics': <Atom className="w-5 h-5" />,
    'Chemistry': <FlaskConical className="w-5 h-5" />,
    'Mathematics': <Calculator className="w-5 h-5" />,
    'Biology': <Stethoscope className="w-5 h-5" />
  };

  const handleSubjectToggle = (subject) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleNext = async () => {
  if (currentStep < 3) {
    setCurrentStep(currentStep + 1);
  } else {
    try {
      // Save user goals to profile
      const userGoals = {
        grade: selectedGrade,
        goal: selectedGoal,
        subjects: selectedSubjects,
        daysRemaining: daysRemaining,
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem('userGoals', JSON.stringify(userGoals));
      
      if (user?.id) {
        // Update profile in Supabase with goals
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            target_exam: selectedGoal,
            grade: parseInt(selectedGrade),
            subjects: selectedSubjects,
            daily_goal: selectedSubjects.length * 10, // 10 questions per subject
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
          throw profileError;
        }

        console.log('✅ User goals saved to profile');
      }
      
      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error saving goals:', error);
      // Still navigate even if save fails
      navigate('/dashboard');
    }
  }
};

  const canProceed = () => {
    if (currentStep === 1) return selectedGrade;
    if (currentStep === 2) return selectedGoal;
    if (currentStep === 3) return selectedSubjects.length > 0;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" style={{backgroundColor: '#e9e9e9'}}>
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4" style={{color: '#013062'}}>
            Welcome to JEEnius! 🎯
          </h1>
          <p className="text-xl text-gray-600">Let's customize your learning journey</p>
          
          {/* Progress Bar */}
          <div className="flex justify-center mt-8 mb-4">
            <div className="flex space-x-4">
              {[1, 2, 3].map((step) => (
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
            Step {currentStep}: {currentStep === 1 ? 'Select Grade' : currentStep === 2 ? 'Choose Goal' : 'Pick Subjects'}
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

        {/* Step 2: Goal Selection */}
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

        {/* Step 3: Subject Selection */}
        {currentStep === 3 && selectedGoal && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4" style={{color: '#013062'}}>Choose your subjects 📖</h2>
            <p className="text-gray-500 text-center mb-8">Select the subjects you want to focus on</p>
            
            {daysRemaining > 0 && (
              <div className="mb-8 p-6 rounded-2xl border text-center bg-white shadow-lg" style={{borderColor: '#013062', backgroundColor: '#f8fafc'}}>
                <div className="text-3xl font-bold mb-2" style={{color: '#013062'}}>{daysRemaining}</div>
                <div style={{color: '#013062'}}>Days remaining for {selectedGoal}</div>
                <div className="text-sm text-gray-500 mt-1">Make every day count! 💪</div>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-4">
              {subjects[selectedGoal]?.map((subject) => (
                <div
                  key={subject}
                  onClick={() => handleSubjectToggle(subject)}
                  className={`p-6 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 border-2 bg-white shadow-lg hover:shadow-xl ${
                    selectedSubjects.includes(subject)
                      ? 'shadow-2xl transform scale-105'
                      : 'hover:border-gray-300'
                  }`}
                  style={{
                    borderColor: selectedSubjects.includes(subject) ? '#013062' : '#e5e7eb',
                    boxShadow: selectedSubjects.includes(subject) ? '0 0 0 3px rgba(1, 48, 98, 0.1)' : undefined
                  }}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3`} style={{
                      backgroundColor: selectedSubjects.includes(subject) ? '#013062' : '#6b7280',
                      color: 'white'
                    }}>
                      {subjectIcons[subject]}
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{color: '#013062'}}>{subject}</h3>
                      {selectedSubjects.includes(subject) && (
                        <div className="text-sm" style={{color: '#059669'}}>✓ Selected</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Button */}
        <div className="text-center mt-12">
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
            {currentStep === 3 ? 'Start My Journey! 🚀' : 'Continue'}
            {currentStep < 3 && <ChevronRight className="inline ml-2 w-5 h-5" />}
          </button>
          
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="ml-4 px-6 py-4 rounded-full border border-gray-400 text-gray-600 hover:bg-gray-100 transition-all duration-300"
            >
              Back
            </button>
          )}
        </div>

        {/* Selected Summary */}
        {(selectedGrade || selectedGoal || selectedSubjects.length > 0) && (
          <div className="mt-12 p-6 rounded-2xl max-w-2xl mx-auto bg-white shadow-lg" style={{border: '1px solid #e5e7eb'}}>
            <h3 className="font-bold mb-4 text-center" style={{color: '#013062'}}>Your Selection Summary</h3>
            <div className="space-y-2 text-sm" style={{color: '#4b5563'}}>
              {selectedGrade && <div>📚 Grade: Class {selectedGrade}</div>}
              {selectedGoal && <div>🎯 Goal: {selectedGoal}</div>}
              {selectedSubjects.length > 0 && <div>📖 Subjects: {selectedSubjects.join(', ')}</div>}
              {daysRemaining > 0 && <div>⏰ Days Remaining: {daysRemaining} days</div>}
            </div>
          </div>
        )}

        {/* Study Tips */}
        <div className="mt-16 max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8" style={{color: '#013062'}}>Why JEEnius is Different 🌟</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl shadow-lg text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="font-bold mb-2" style={{color: '#013062'}}>Adaptive Learning</h4>
              <p className="text-gray-600 text-sm">Questions adjust to your level - never too easy, never too hard</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg text-center">
              <div className="text-4xl mb-4">📊</div>
              <h4 className="font-bold mb-2" style={{color: '#013062'}}>Smart Analytics</h4>
              <p className="text-gray-600 text-sm">Detailed insights into your strengths and improvement areas</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h4 className="font-bold mb-2" style={{color: '#013062'}}>Gamified Progress</h4>
              <p className="text-gray-600 text-sm">Level up, earn points, compete with peers - learning made fun!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalSelectionPage;
