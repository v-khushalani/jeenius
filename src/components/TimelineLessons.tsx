import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Clock, 
  Target, 
  CheckCircle, 
  Star,
  Lock,
  Play,
  Award,
  Zap,
  TrendingUp
} from 'lucide-react';
import { jeeData } from '@/data/jeeData';

interface LessonNode {
  id: string;
  title: string;
  subject: string;
  subjectColor: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  progress: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  concepts: number;
  practice: number;
  streak?: number;
}

const TimelineLessons = () => {
  const [selectedClass, setSelectedClass] = useState<11 | 12>(11);
  
  // Generate a progressive timeline from the JEE data
  const generateTimeline = (): LessonNode[] => {
    const timeline: LessonNode[] = [];
    const classData = jeeData.find(data => data.class === selectedClass);
    
    if (!classData) return [];
    
    let nodeIndex = 0;
    classData.subjects.forEach((subject, subjectIndex) => {
      subject.chapters.forEach((chapter, chapterIndex) => {
        chapter.topics.forEach((topic, topicIndex) => {
          timeline.push({
            id: `${subject.id}-${chapter.id}-${topic.id}`,
            title: `${chapter.name}: ${topic.name}`,
            subject: subject.name,
            subjectColor: subject.color,
            difficulty: topic.difficulty as 'Easy' | 'Medium' | 'Hard',
            estimatedTime: topic.estimatedTime,
            progress: nodeIndex < 3 ? 100 : nodeIndex < 6 ? 60 : 0,
            isUnlocked: nodeIndex < 8,
            isCompleted: nodeIndex < 3,
            concepts: topic.concepts.length,
            practice: Math.floor(Math.random() * 50) + 10,
            streak: nodeIndex < 3 ? Math.floor(Math.random() * 7) + 1 : undefined
          });
          nodeIndex++;
        });
      });
    });
    
    return timeline;
  };

  const timeline = generateTimeline();
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress > 0) return 'bg-blue-500';
    return 'bg-gray-300';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Learning Journey</h1>
            <p className="text-gray-600">Progressive JEE preparation timeline</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant={selectedClass === 11 ? "default" : "outline"}
              onClick={() => setSelectedClass(11)}
            >
              Class 11
            </Button>
            <Button 
              variant={selectedClass === 12 ? "default" : "outline"}
              onClick={() => setSelectedClass(12)}
            >
              Class 12
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-700">3</div>
              <div className="text-sm text-green-600">Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">2</div>
              <div className="text-sm text-blue-600">In Progress</div>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-700">5</div>
              <div className="text-sm text-orange-600">Next Up</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Central Line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200 rounded-full"></div>
        
        <div className="space-y-6">
          {timeline.slice(0, 10).map((lesson, index) => (
            <div key={lesson.id} className="relative flex items-start">
              {/* Timeline Node */}
              <div className={`relative z-10 w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${
                lesson.isCompleted 
                  ? 'bg-green-500' 
                  : lesson.progress > 0 
                    ? 'bg-blue-500' 
                    : lesson.isUnlocked
                      ? 'bg-gray-300'
                      : 'bg-gray-200'
              }`}>
                {lesson.isCompleted ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : lesson.progress > 0 ? (
                  <Play className="w-6 h-6 text-white" />
                ) : lesson.isUnlocked ? (
                  <BookOpen className="w-6 h-6 text-gray-600" />
                ) : (
                  <Lock className="w-6 h-6 text-gray-400" />
                )}
              </div>

              {/* Content Card */}
              <Card className={`ml-6 flex-1 ${
                lesson.isUnlocked ? 'cursor-pointer hover:shadow-lg transition-shadow' : 'opacity-60'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge 
                          className={`text-xs px-2 py-1`}
                          style={{ backgroundColor: lesson.subjectColor, color: 'white' }}
                        >
                          {lesson.subject}
                        </Badge>
                        <Badge className={`text-xs ${getDifficultyColor(lesson.difficulty)}`}>
                          {lesson.difficulty}
                        </Badge>
                        {lesson.streak && (
                          <Badge className="bg-orange-100 text-orange-800 text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            {lesson.streak} day streak
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{lesson.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {lesson.estimatedTime}
                        </div>
                        <div className="flex items-center">
                          <Target className="w-4 h-4 mr-1" />
                          {lesson.concepts} concepts
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {lesson.practice} practice
                        </div>
                      </div>
                    </div>
                    
                    {lesson.isUnlocked && (
                      <Button 
                        className={`${
                          lesson.isCompleted 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : lesson.progress > 0
                              ? 'bg-blue-500 hover:bg-blue-600'
                              : 'bg-primary hover:bg-primary/90'
                        }`}
                      >
                        {lesson.isCompleted ? 'Review' : lesson.progress > 0 ? 'Continue' : 'Start'}
                      </Button>
                    )}
                  </div>
                  
                  {/* Progress Bar */}
                  {lesson.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-900 font-medium">{lesson.progress}%</span>
                      </div>
                      <Progress value={lesson.progress} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      
      {/* Continue Learning CTA */}
      <Card className="mt-8 bg-gradient-to-r from-primary to-blue-600 text-white">
        <CardContent className="p-6 text-center">
          <Award className="w-12 h-12 mx-auto mb-3 opacity-90" />
          <h3 className="text-xl font-bold mb-2">Great Progress!</h3>
          <p className="mb-4 opacity-90">
            You're doing amazing! Keep up the momentum to unlock more lessons.
          </p>
          <Button variant="secondary" className="bg-white text-primary hover:bg-gray-100">
            View All Subjects
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimelineLessons;