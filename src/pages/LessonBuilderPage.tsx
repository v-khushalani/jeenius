import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import { Plus, BookOpen, Video, FileText, Calculator, Beaker, Target, Save, Eye, Share } from 'lucide-react';

const LessonBuilderPage = () => {
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const subjects = [
    { name: 'Physics', icon: Target, color: 'bg-blue-500' },
    { name: 'Chemistry', icon: Beaker, color: 'bg-green-500' },
    { name: 'Mathematics', icon: Calculator, color: 'bg-purple-500' }
  ];

  const contentTypes = [
    {
      type: 'text',
      title: 'Text Content',
      description: 'Add explanations, concepts, and theory',
      icon: FileText,
      color: 'bg-gray-500'
    },
    {
      type: 'video',
      title: 'Video Content',
      description: 'Embed educational videos',
      icon: Video,
      color: 'bg-red-500'
    },
    {
      type: 'example',
      title: 'Worked Example',
      description: 'Step-by-step problem solutions',
      icon: BookOpen,
      color: 'bg-orange-500'
    },
    {
      type: 'exercise',
      title: 'Practice Exercise',
      description: 'Interactive questions for students',
      icon: Target,
      color: 'bg-indigo-500'
    }
  ];

  const [lessonContent, setLessonContent] = useState([]);
  const [activeContent, setActiveContent] = useState(null);

  const addContentBlock = (type) => {
    const newBlock = {
      id: Date.now(),
      type,
      content: '',
      title: `New ${type} block`
    };
    setLessonContent([...lessonContent, newBlock]);
    setActiveContent(newBlock.id);
  };

  const updateContentBlock = (id, field, value) => {
    setLessonContent(prev => prev.map(block => 
      block.id === id ? { ...block, [field]: value } : block
    ));
  };

  const removeContentBlock = (id) => {
    setLessonContent(prev => prev.filter(block => block.id !== id));
  };

  const sampleLessons = [
    {
      title: "Newton's Laws of Motion",
      subject: "Physics",
      difficulty: "Medium",
      duration: "45 min",
      blocks: 6,
      views: 1250
    },
    {
      title: "Organic Chemistry Basics", 
      subject: "Chemistry",
      difficulty: "Easy",
      duration: "30 min",
      blocks: 4,
      views: 890
    },
    {
      title: "Calculus - Limits and Derivatives",
      subject: "Mathematics", 
      difficulty: "Hard",
      duration: "60 min",
      blocks: 8,
      views: 2100
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📚 Lesson Builder
            </h1>
            <p className="text-xl text-gray-600">
              Create interactive lessons and share knowledge with the JEE community
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Main Builder Area */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Lesson Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Lesson Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      placeholder="Lesson title..."
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                    />
                    <select 
                      className="px-3 py-2 border rounded-md"
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(subject => (
                        <option key={subject.name} value={subject.name}>{subject.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <Textarea 
                    placeholder="Describe what this lesson covers..."
                    value={lessonDescription}
                    onChange={(e) => setLessonDescription(e.target.value)}
                    rows={3}
                  />
                  
                  <div className="flex gap-4">
                    <select 
                      className="px-3 py-2 border rounded-md"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                    >
                      <option value="">Difficulty Level</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                    <div className="flex gap-2">
                      <Badge variant="outline">Draft</Badge>
                      {selectedSubject && <Badge>{selectedSubject}</Badge>}
                      {difficulty && <Badge variant="secondary">{difficulty}</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Blocks */}
              <Card>
                <CardHeader>
                  <CardTitle>Lesson Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {lessonContent.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p>No content blocks yet. Add your first block to get started!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {lessonContent.map((block, index) => (
                        <Card key={block.id} className="border-l-4 border-l-primary">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <Badge variant="outline">Block {index + 1}: {block.type}</Badge>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeContentBlock(block.id)}
                              >
                                ✕
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <Input 
                              placeholder="Block title..."
                              value={block.title}
                              onChange={(e) => updateContentBlock(block.id, 'title', e.target.value)}
                            />
                            
                            {block.type === 'text' && (
                              <Textarea 
                                placeholder="Add your explanation, concepts, or theory here..."
                                value={block.content}
                                onChange={(e) => updateContentBlock(block.id, 'content', e.target.value)}
                                rows={4}
                              />
                            )}
                            
                            {block.type === 'video' && (
                              <div className="space-y-2">
                                <Input 
                                  placeholder="Video URL (YouTube, Vimeo, etc.)"
                                  value={block.content}
                                  onChange={(e) => updateContentBlock(block.id, 'content', e.target.value)}
                                />
                                <p className="text-sm text-gray-500">Paste a video URL to embed it in your lesson</p>
                              </div>
                            )}
                            
                            {block.type === 'example' && (
                              <div className="space-y-2">
                                <Textarea 
                                  placeholder="Problem statement..."
                                  rows={2}
                                />
                                <Textarea 
                                  placeholder="Step-by-step solution..."
                                  rows={4}
                                />
                              </div>
                            )}
                            
                            {block.type === 'exercise' && (
                              <div className="space-y-2">
                                <Input placeholder="Question..." />
                                <div className="grid grid-cols-2 gap-2">
                                  <Input placeholder="Option A" />
                                  <Input placeholder="Option B" />
                                  <Input placeholder="Option C" />
                                  <Input placeholder="Option D" />
                                </div>
                                <select className="px-3 py-2 border rounded-md w-full">
                                  <option>Correct Answer</option>
                                  <option>A</option>
                                  <option>B</option>
                                  <option>C</option>
                                  <option>D</option>
                                </select>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  {/* Add Content Buttons */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Add Content Block:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {contentTypes.map((type) => (
                        <Button
                          key={type.type}
                          variant="outline"
                          className="h-20 flex-col gap-2"
                          onClick={() => addContentBlock(type.type)}
                        >
                          <type.icon className="w-5 h-5" />
                          <span className="text-xs">{type.title}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline">
                    <Share className="w-4 h-4 mr-2" />
                    Share Draft
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Save Draft</Button>
                  <Button>
                    <Save className="w-4 h-4 mr-2" />
                    Publish Lesson
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Content Types Guide */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Content Types</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {contentTypes.map((type) => (
                    <div key={type.type} className="flex gap-3">
                      <div className={`w-8 h-8 ${type.color} rounded flex items-center justify-center flex-shrink-0`}>
                        <type.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{type.title}</div>
                        <div className="text-xs text-gray-600">{type.description}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Lessons */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Community Lessons</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sampleLessons.map((lesson, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="font-medium text-sm mb-1">{lesson.title}</div>
                      <div className="flex gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">{lesson.subject}</Badge>
                        <Badge variant="secondary" className="text-xs">{lesson.difficulty}</Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        {lesson.duration} • {lesson.blocks} blocks • {lesson.views} views
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tips</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 space-y-2">
                  <p>• Start with a clear learning objective</p>
                  <p>• Mix theory with practical examples</p>
                  <p>• Add interactive exercises to engage students</p>
                  <p>• Use videos for complex concepts</p>
                  <p>• Preview your lesson before publishing</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonBuilderPage;