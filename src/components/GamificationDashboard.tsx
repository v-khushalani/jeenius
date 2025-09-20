
import React, { useState, useEffect } from 'react';
import { Trophy, Zap, Star, Gift, TrendingUp, Award, Coins, Smartphone, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const GamificationDashboard = () => {
  const [jeePoints, setJeePoints] = useState(0);
  const [animateCoins, setAnimateCoins] = useState(false);

  useEffect(() => {
    // Animate JEEnius Points counter
    const timer = setTimeout(() => {
      let count = 0;
      const target = 2547;
      const increment = target / 50;
      
      const counter = setInterval(() => {
        count += increment;
        if (count >= target) {
          setJeePoints(target);
          clearInterval(counter);
        } else {
          setJeePoints(Math.floor(count));
        }
      }, 50);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const badges = [
    { name: 'Physics Master', icon: Zap, color: 'bg-yellow-500', earned: true, level: 'JEE Warrior' },
    { name: 'Chemistry Pro', icon: Star, color: 'bg-green-500', earned: true, level: 'JEE Champion' },
    { name: 'Math Wizard', icon: Trophy, color: 'bg-blue-500', earned: false, level: 'JEE Legend' },
    { name: 'Speed Solver', icon: TrendingUp, color: 'bg-purple-500', earned: true, level: 'JEE Warrior' },
    { name: 'Streak King', icon: Award, color: 'bg-red-500', earned: false, level: 'JEE Master' },
  ];

  const rewards = [
    {
      title: 'Premium Study Notes',
      cost: '500 JEEnius Points',
      description: 'Unlock exclusive handwritten notes by JEE toppers',
      image: '📚'
    },
    {
      title: 'Mock Test Marathon',
      cost: '1000 JEEnius Points', 
      description: 'Access to 50+ premium mock tests with detailed analysis',
      image: '📝'
    },
    {
      title: 'AI Tutor Premium Session',
      cost: '750 JEEnius Points',
      description: 'Extended 1-on-1 session with advanced AI features',
      image: '🤖'
    }
  ];

  const playerLevels = [
    { level: 1, name: 'JEE Rookie', points: '0-499', color: 'text-gray-600' },
    { level: 2, name: 'JEE Warrior', points: '500-1499', color: 'text-green-600' },
    { level: 3, name: 'JEE Champion', points: '1500-2999', color: 'text-blue-600' },
    { level: 4, name: 'JEE Legend', points: '3000-4999', color: 'text-purple-600' },
    { level: 5, name: 'JEE Master', points: '5000+', color: 'text-gold-600' }
  ];

  const getCurrentLevel = (points: number) => {
    if (points >= 5000) return playerLevels[4];
    if (points >= 3000) return playerLevels[3];
    if (points >= 1500) return playerLevels[2];
    if (points >= 500) return playerLevels[1];
    return playerLevels[0];
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile App Promotion */}
        <div className="mb-12 bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl font-bold">Unlock More Rewards in App!</div>
                <div className="text-sm opacity-90">Exclusive badges, bonus JEEnius Points, daily challenges & leaderboards</div>
              </div>
            </div>
            <Button variant="secondary" size="lg" className="bg-white text-orange-600">
              <Download className="w-5 h-5 mr-2" />
              Get Premium
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Your Learning
            <span className="text-primary"> Achievements</span>
          </h2>
          <p className="text-xl text-gray-600">
            Track your progress, earn JEEnius Points, and unlock exclusive rewards as you advance through JEE Warrior levels
          </p>
        </div>

        {/* JEEnius Points Counter */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-6 bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Coins className="w-8 h-8 animate-coin-flip" />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold j-points-glow">
                {jeePoints.toLocaleString()}
              </div>
              <div className="text-lg opacity-90">JEEnius Points Earned</div>
              <div className={`text-sm font-medium ${getCurrentLevel(jeePoints).color} bg-white/20 px-3 py-1 rounded-full mt-2`}>
                {getCurrentLevel(jeePoints).name}
              </div>
            </div>
            <Button 
              variant="secondary" 
              className="bg-white text-primary hover:bg-gray-100"
              onClick={() => setAnimateCoins(!animateCoins)}
            >
              <Gift className="w-4 h-4 mr-2" />
              Redeem
            </Button>
          </div>
        </div>

        {/* Player Levels Guide */}
        <div className="mb-12">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-center">JEE Warrior Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {playerLevels.map((level, index) => (
                  <div
                    key={index}
                    className={`text-center p-4 rounded-lg border-2 transition-all ${
                      getCurrentLevel(jeePoints).level === level.level
                        ? 'border-primary bg-primary/5 scale-105'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className={`text-2xl font-bold ${level.color} mb-2`}>
                      {level.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {level.points} Points
                    </div>
                    {getCurrentLevel(jeePoints).level === level.level && (
                      <div className="mt-2">
                        <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                          Current Level
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Badge Gallery */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-primary" />
                <span>Achievement Badges</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge, index) => (
                  <div
                    key={index}
                    className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                      badge.earned
                        ? 'border-primary bg-primary/5 hover:scale-105'
                        : 'border-gray-200 bg-gray-50 opacity-50'
                    }`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className={`w-16 h-16 ${badge.color} rounded-full flex items-center justify-center mx-auto mb-3 ${
                      badge.earned ? 'animate-scale-in' : ''
                    }`}>
                      <badge.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-800 mb-1">
                        {badge.name}
                      </div>
                      <div className="text-xs text-primary font-medium">
                        {badge.level}
                      </div>
                    </div>
                    {badge.earned && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rewards Catalog */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gift className="w-6 h-6 text-primary" />
                <span>JEEnius Points Store</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {rewards.map((reward, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{reward.image}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{reward.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                        <div className="text-sm text-primary font-medium">{reward.cost}</div>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-primary hover:bg-primary/90"
                        disabled={jeePoints < parseInt(reward.cost.match(/\d+/)?.[0] || '0')}
                      >
                        {jeePoints >= parseInt(reward.cost.match(/\d+/)?.[0] || '0') ? 'Redeem' : 'Need More Points'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Visualization */}
        <div className="mt-12 bg-gradient-to-r from-primary/10 to-blue-50 rounded-2xl p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">127</div>
              <div className="text-gray-600">Days Streak</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-primary h-2 rounded-full animate-progress" style={{'--progress-width': '85%'} as any}></div>
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">89%</div>
              <div className="text-gray-600">Accuracy Rate</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-500 h-2 rounded-full animate-progress" style={{'--progress-width': '89%'} as any}></div>
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">2,547</div>
              <div className="text-gray-600">Problems Solved</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-500 h-2 rounded-full animate-progress" style={{'--progress-width': '65%'} as any}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GamificationDashboard;
