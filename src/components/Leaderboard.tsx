import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Flame,
  Zap,
  Crown,
  Target,
  Medal,
  Activity
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface LeaderboardUser {
  id: string;
  full_name: string;
  avatar_url?: string;
  total_questions: number;
  accuracy: number;
  streak: number;
  rank: number;
  rank_change: number;
  questions_today: number;
}

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([]);
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'alltime'>('week');

  useEffect(() => {
    fetchLeaderboard();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [timeFilter]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);

      // Get all users with their profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .limit(100);

      if (!profiles) return;

      // Calculate stats for each user
      const userStats = await Promise.all(
        profiles.map(async (profile) => {
          const { data: attempts } = await supabase
            .from('question_attempts')
            .select('is_correct, created_at')
            .eq('user_id', profile.id);

          if (!attempts || attempts.length === 0) {
            return null;
          }

          // Filter based on time
          let filteredAttempts = attempts;
          if (timeFilter === 'today') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            filteredAttempts = attempts.filter(a => new Date(a.created_at) >= today);
          } else if (timeFilter === 'week') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            filteredAttempts = attempts.filter(a => new Date(a.created_at) >= weekAgo);
          }

          const totalQuestions = filteredAttempts.length;
          const correctAnswers = filteredAttempts.filter(a => a.is_correct).length;
          const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

          // Calculate today's questions
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayAttempts = attempts.filter(a => new Date(a.created_at) >= today);

          // Calculate streak
          let streak = 0;
          const DAILY_TARGET = 30;
          const sortedAttempts = [...attempts].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          
          let currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);
          
          for (let i = 0; i < 365; i++) {
            const questionsOnThisDay = sortedAttempts.filter(a => {
              const attemptDate = new Date(a.created_at);
              attemptDate.setHours(0, 0, 0, 0);
              return attemptDate.getTime() === currentDate.getTime();
            }).length;
            
            if (questionsOnThisDay >= DAILY_TARGET) {
              streak++;
              currentDate.setDate(currentDate.getDate() - 1);
            } else if (i === 0 && questionsOnThisDay > 0) {
              currentDate.setDate(currentDate.getDate() - 1);
            } else {
              break;
            }
          }

          return {
            id: profile.id,
            full_name: profile.full_name || 'Anonymous',
            avatar_url: profile.avatar_url,
            total_questions: totalQuestions,
            accuracy,
            streak,
            rank: 0,
            rank_change: 0,
            questions_today: todayAttempts.length
          };
        })
      );

      // Filter out null values and sort by total questions
      const validUsers = (userStats.filter((u) => u && u.total_questions > 0) as LeaderboardUser[])
        .sort((a, b) => {
          // Primary sort: total questions
          if (b.total_questions !== a.total_questions) {
            return b.total_questions - a.total_questions;
          }
          // Secondary sort: accuracy
          return b.accuracy - a.accuracy;
        });

      // Assign ranks
      validUsers.forEach((user, index) => {
        user.rank = index + 1;
        user.rank_change = Math.floor(Math.random() * 5) - 2; // Mock rank change
      });

      // Get current user
      const current = validUsers.find(u => u.id === user?.id);
      if (current) {
        setCurrentUser(current);
      }

      // Top 10 users
      setTopUsers(validUsers.slice(0, 10));

    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return null;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white";
    if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
    if (rank === 3) return "bg-gradient-to-r from-amber-400 to-orange-600 text-white";
    if (rank <= 10) return "bg-gradient-to-r from-blue-500 to-indigo-600 text-white";
    return "bg-gray-200 text-gray-700";
  };

  if (loading) {
    return (
      <Card className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl">
        <CardContent className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Activity className="h-12 w-12 text-blue-500 animate-pulse mx-auto mb-3" />
            <p className="text-slate-600">Loading leaderboard...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl">
      <CardHeader className="border-b border-slate-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-2 rounded-lg">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Leaderboard</CardTitle>
              <p className="text-xs text-slate-500">Compete with top performers</p>
            </div>
          </div>
          <Badge className="bg-green-500 text-white animate-pulse text-xs">
            <Activity className="h-3 w-3 mr-1" />LIVE
          </Badge>
        </div>

        {/* Time Filter */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setTimeFilter('today')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              timeFilter === 'today'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeFilter('week')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              timeFilter === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeFilter('alltime')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              timeFilter === 'alltime'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Time
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
        
        {/* Current User Card */}
        {currentUser && currentUser.rank > 10 && (
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {currentUser.rank}
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900">You</p>
                  <p className="text-xs text-slate-600">
                    {currentUser.total_questions} questions • {currentUser.accuracy}% accuracy
                  </p>
                </div>
              </div>
              {currentUser.rank_change !== 0 && (
                <Badge className={currentUser.rank_change > 0 ? 'bg-green-500' : 'bg-red-500'}>
                  {currentUser.rank_change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {Math.abs(currentUser.rank_change)}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Top Users */}
        <div className="space-y-2">
          {topUsers.map((user, index) => {
            const isCurrentUser = user.id === currentUser?.id;
            
            return (
              <div
                key={user.id}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isCurrentUser
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-lg'
                    : index < 3
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {/* Rank */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getRankBadge(user.rank)}`}>
                      {getRankIcon(user.rank) || user.rank}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-slate-900 truncate">
                          {isCurrentUser ? 'You' : user.full_name}
                        </p>
                        {user.streak >= 7 && (
                          <Badge className="bg-orange-500 text-white text-xs">
                            <Flame className="h-3 w-3 mr-1" />
                            {user.streak}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {user.total_questions}
                        </span>
                        <span className={`font-semibold ${
                          user.accuracy >= 80 ? 'text-green-600' :
                          user.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {user.accuracy}%
                        </span>
                        {user.questions_today > 0 && (
                          <Badge className="bg-blue-100 text-blue-700 text-xs">
                            +{user.questions_today} today
                          </Badge>
                        )}
                      </div>

                      {/* Progress bar */}
                      <Progress 
                        value={user.accuracy} 
                        className="h-1.5 mt-2"
                      />
                    </div>
                  </div>

                  {/* Rank Change */}
                  {user.rank_change !== 0 && (
                    <div className={`flex items-center gap-1 text-xs font-bold ${
                      user.rank_change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {user.rank_change > 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {Math.abs(user.rank_change)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Motivational Footer */}
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-purple-600" />
            <p className="text-xs font-bold text-purple-900">Climb the Ranks!</p>
          </div>
          <p className="text-xs text-purple-700">
            {currentUser && currentUser.rank > 1
              ? `You're ${currentUser.rank - 1} ${currentUser.rank === 2 ? 'position' : 'positions'} away from the top! Keep pushing! 🚀`
              : "You're at the top! Maintain your position! 👑"}
          </p>
        </div>

      </CardContent>
    </Card>
  );
};

export default Leaderboard;
