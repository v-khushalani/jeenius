import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { Users, BookOpen, TrendingUp, Clock, Award, Target } from 'lucide-react';

interface PlatformStats {
  total_users: number;
  active_users_today: number;
  total_questions_attempted: number;
  total_assessments: number;
  avg_accuracy: number;
  total_study_time: number;
}

interface UserAnalytics {
  date: string;
  new_users: number;
  active_users: number;
  questions_attempted: number;
}

export const AdminAnalytics: React.FC = () => {
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlatformStats = async () => {
      try {
        const { data, error } = await supabase.rpc('get_platform_stats');
        
        if (error) {
          console.error('Error fetching platform stats:', error);
          return;
        }

        if (data && data.length > 0) {
          setPlatformStats(data[0]);
        }
      } catch (error) {
        console.error('Platform stats fetch error:', error);
      }
    };

    const fetchUserAnalytics = async () => {
      try {
        // Get last 7 days of user data
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('joined_at')
          .gte('joined_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        const { data: attemptsData, error: attemptsError } = await supabase
          .from('question_attempts')
          .select('attempted_at, user_id')
          .gte('attempted_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        if (profilesError || attemptsError) {
          console.error('Error fetching analytics:', profilesError || attemptsError);
          return;
        }

        // Process data for charts
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
          return date.toISOString().split('T')[0];
        });

        const analyticsData = last7Days.map(date => {
          const newUsers = profilesData?.filter(p => 
            p.joined_at.startsWith(date)
          ).length || 0;

          const dayAttempts = attemptsData?.filter(a => 
            a.attempted_at.startsWith(date)
          ) || [];

          const activeUsers = new Set(dayAttempts.map(a => a.user_id)).size;

          return {
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            new_users: newUsers,
            active_users: activeUsers,
            questions_attempted: dayAttempts.length
          };
        });

        setUserAnalytics(analyticsData);
      } catch (error) {
        console.error('User analytics fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlatformStats();
    fetchUserAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const subjectData = [
    { name: 'Physics', questions: 1200, color: '#8B5CF6' },
    { name: 'Chemistry', questions: 900, color: '#06B6D4' },
    { name: 'Math', questions: 1500, color: '#10B981' },
    { name: 'Biology', questions: 600, color: '#F59E0B' }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {platformStats?.total_users?.toLocaleString() || '0'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Active Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {platformStats?.active_users_today?.toLocaleString() || '0'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Questions</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {platformStats?.total_questions_attempted?.toLocaleString() || '0'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Assessments</CardTitle>
            <Award className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {platformStats?.total_assessments?.toLocaleString() || '0'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900 border-cyan-200 dark:border-cyan-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Avg Accuracy</CardTitle>
            <Target className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-900 dark:text-cyan-100">
              {platformStats?.avg_accuracy ? `${Math.round(platformStats.avg_accuracy)}%` : '0%'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900 border-rose-200 dark:border-rose-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-rose-700 dark:text-rose-300">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-900 dark:text-rose-100">
              {platformStats?.total_study_time ? formatTime(Number(platformStats.total_study_time)) : '0h 0m'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Trends */}
        <Card>
          <CardHeader>
            <CardTitle>User Activity (Last 7 Days)</CardTitle>
            <CardDescription>Daily active users and question attempts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userAnalytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="active_users" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Active Users"
                />
                <Line 
                  type="monotone" 
                  dataKey="questions_attempted" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  name="Questions"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Distribution</CardTitle>
            <CardDescription>Questions attempted by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="questions"
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* New User Registration */}
        <Card>
          <CardHeader>
            <CardTitle>New User Registrations</CardTitle>
            <CardDescription>Daily new user sign-ups</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userAnalytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="new_users" 
                  fill="hsl(var(--chart-3))"
                  name="New Users"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Question Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Question Activity</CardTitle>
            <CardDescription>Daily question attempts trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userAnalytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="questions_attempted" 
                  fill="hsl(var(--chart-4))"
                  name="Questions Attempted"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};