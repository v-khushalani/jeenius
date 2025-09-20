
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Target, 
  Trophy, 
  Flame, 
  Star, 
  Crown, 
  Rocket,
  Brain,
  Heart,
  Sparkles
} from 'lucide-react';

const InteractiveFeatures = () => {
  const [streakDays, setStreakDays] = useState(23);
  const [dailyGoal, setDailyGoal] = useState(65);
  const [jPoints, setJPoints] = useState(2847);
  const [level, setLevel] = useState(7);
  const [showAnimation, setShowAnimation] = useState(false);

  const achievements = [
    { id: 1, name: 'First Steps', desc: 'Complete your first practice session', icon: Star, unlocked: true },
    { id: 2, name: 'Streak Master', desc: 'Maintain 7-day learning streak', icon: Flame, unlocked: true },
    { id: 3, name: 'Physics Champion', desc: 'Score 90%+ in Physics mock test', icon: Zap, unlocked: true },
    { id: 4, name: 'Question Hunter', desc: 'Solve 1000 questions', icon: Target, unlocked: false },
    { id: 5, name: 'Community Helper', desc: 'Help 50 fellow students', icon: Heart, unlocked: false },
    { id: 6, name: 'JEE Warrior', desc: 'Complete JEE syllabus', icon: Crown, unlocked: false },
  ];

  const dailyQuests = [
    { id: 1, task: 'Solve 10 Physics problems', progress: 7, total: 10, points: 50, completed: false },
    { id: 2, task: 'Help 2 students in doubt forum', progress: 1, total: 2, points: 75, completed: false },
    { id: 3, task: 'Complete daily mock test', progress: 0, total: 1, points: 100, completed: false },
    { id: 4, task: 'Study for 2 hours', progress: 85, total: 120, points: 80, completed: false },
  ];

  const triggerCelebration = () => {
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 3000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setJPoints(prev => prev + 50);
      triggerCelebration();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Make Learning
            <span className="text-primary"> Addictively Fun!</span>
          </h2>
          <p className="text-xl text-gray-600">
            Gamified learning that keeps you motivated and engaged every single day
          </p>
        </div>

        {/* Celebration Animation */}
        {showAnimation && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="text-6xl font-bold text-primary animate-bounce">
              +50 JEEnius Points! 🎉
            </div>
            <div className="absolute inset-0 bg-yellow-300/20 animate-pulse"></div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Level & Progress */}
          <Card className="shadow-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Crown className="w-6 h-6" />
                  <span>Level {level}</span>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  JEE Warrior
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress to Level 8</span>
                    <span>2,847 / 3,500 XP</span>
                  </div>
                  <Progress value={81} className="h-3 bg-white/20" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{jPoints.toLocaleString()}</div>
                  <div className="text-white/80">JEEnius Points</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Streak */}
          <Card className="shadow-xl bg-gradient-to-br from-orange-500 to-red-600 text-white border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Flame className="w-6 h-6" />
                <span>Study Streak</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold">{streakDays}</div>
                <div className="text-white/80">Days in a row!</div>
                <div className="flex justify-center space-x-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-full ${
                        i < 5 ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
                <Button 
                  variant="secondary" 
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                  onClick={triggerCelebration}
                >
                  Keep It Going! 🚀
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Daily Goal */}
          <Card className="shadow-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-6 h-6" />
                <span>Today's Goal</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{dailyGoal}%</div>
                  <div className="text-white/80">Complete</div>
                </div>
                <Progress value={dailyGoal} className="h-3 bg-white/20" />
                <div className="text-center text-sm text-white/80">
                  Almost there! 35% to go
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Daily Quests */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Rocket className="w-6 h-6 text-primary" />
                <span>Daily Quests</span>
                <Badge variant="outline">4 Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyQuests.map((quest) => (
                  <div
                    key={quest.id}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{quest.task}</span>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        +{quest.points} JP
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Progress 
                        value={(quest.progress / quest.total) * 100} 
                        className="flex-1 h-2"
                      />
                      <span className="text-sm text-gray-600">
                        {quest.progress}/{quest.total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-primary" />
                <span>Achievements</span>
                <Badge variant="outline">3/6 Unlocked</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                      achievement.unlocked
                        ? 'bg-primary/5 border border-primary/20'
                        : 'bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      achievement.unlocked
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <achievement.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{achievement.name}</div>
                      <div className="text-sm text-gray-600">{achievement.desc}</div>
                    </div>
                    {achievement.unlocked && (
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="inline-block bg-gradient-to-r from-primary to-blue-600 text-white border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-center space-x-4">
                <Brain className="w-12 h-12" />
                <div className="text-left">
                  <h3 className="text-2xl font-bold mb-2">Ready to Start Your Journey?</h3>
                  <p className="text-white/90 mb-4">Join thousands of students already crushing their JEE goals!</p>
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    className="bg-white text-primary hover:bg-gray-100"
                  >
                    Start Your Free Trial Now!
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default InteractiveFeatures;
