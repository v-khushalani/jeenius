import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Award, 
  Download, 
  Share, 
  Trophy, 
  Star, 
  Target,
  Calendar,
  CheckCircle,
  Medal,
  Crown,
  Flame,
  Brain,
  BookOpen
} from 'lucide-react';

const CertificateGenerator = () => {
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const certificateRef = useRef(null);

  // Sample user data - this would come from your auth context
  const userData = {
    name: "Arjun Kumar Sharma",
    userId: "JEE2024001",
    achievements: {
      physicsQuestions: 95,
      chemistryQuestions: 120,
      mathQuestions: 88,
      streak: 42,
      totalTests: 25,
      rank: 147
    }
  };

  // Certificate types with progress tracking
  const certificateTypes = [
    {
      id: 'physics_master',
      title: 'Physics Mastery Certificate',
      description: 'Complete 100 Physics questions with 80%+ accuracy',
      icon: Target,
      progress: userData.achievements.physicsQuestions,
      required: 100,
      unlocked: userData.achievements.physicsQuestions >= 100,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: '#013062'
    },
    {
      id: 'chemistry_master',
      title: 'Chemistry Expert Certificate',
      description: 'Complete 100 Chemistry questions with 80%+ accuracy',
      icon: Award,
      progress: userData.achievements.chemistryQuestions,
      required: 100,
      unlocked: userData.achievements.chemistryQuestions >= 100,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'math_master',
      title: 'Mathematics Champion Certificate',
      description: 'Complete 100 Math questions with 80%+ accuracy',
      icon: Brain,
      progress: userData.achievements.mathQuestions,
      required: 100,
      unlocked: userData.achievements.mathQuestions >= 100,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'streak_warrior',
      title: 'Streak Warrior Certificate',
      description: 'Maintain a 30-day study streak',
      icon: Flame,
      progress: userData.achievements.streak,
      required: 30,
      unlocked: userData.achievements.streak >= 30,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      id: 'test_champion',
      title: 'Test Series Champion',
      description: 'Complete 20 full-length tests',
      icon: Trophy,
      progress: userData.achievements.totalTests,
      required: 20,
      unlocked: userData.achievements.totalTests >= 20,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      id: 'top_ranker',
      title: 'Top Ranker Certificate',
      description: 'Achieve rank under 500',
      icon: Crown,
      progress: userData.achievements.rank <= 500 ? 1 : 0,
      required: 1,
      unlocked: userData.achievements.rank <= 500,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ];

  const generateCertificateId = () => {
    return `JEENIUS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const CertificatePreview = ({ certificate }) => {
    const certificateId = generateCertificateId();
    
    return (
      <div className="w-full flex justify-center">
        <div 
          ref={certificateRef}
          className="bg-white shadow-2xl relative"
          style={{ 
            width: '960px',
            height: '640px',
            fontFamily: '"Saira", sans-serif'
          }}
        >
          {/* Load Saira Font */}
          <style>
            {`@import url('https://fonts.googleapis.com/css2?family=Saira:wght@300;400;500;600;700;800&display=swap');`}
          </style>
          
          {/* Certificate Border with Golden Gradient */}
          <div 
            className="h-full relative overflow-hidden"
            style={{
              background: '#013062',
              padding: '8px'
            }}
          >
            {/* Inner White Background */}
            <div className="h-full bg-white relative overflow-hidden">
              
              {/* Decorative Background Pattern */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23667eea' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '60px 60px'
                }}
              />

              {/* Top Decorative Border */}
              <div 
                className="absolute top-0 left-0 right-0 h-2"
                style={{
                  background: '#013062'
                }}
              />
              
              {/* Bottom Decorative Border */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-2"
                style={{
                  background: '#013062'
                }}
              />

              {/* Certificate Content */}
              <div className="h-full flex flex-col items-center justify-center p-12 text-center relative">
                
                {/* JEEnius Logo and Heading */}
                <div className="mb-8">
                <img src="public/logo.png" alt="JEEnius Logo" className="w-10 h-10 object-contain rounded-lg"/>
                  <div className="mb-6">
                    <div 
                      className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                      style={{
                        background: '#013062',
                        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
                      }}
                    >
                      <span style={{ fontFamily: '"Saira", sans-serif', fontWeight: 800 }}>J</span>
                    </div>
                    
                    {/* JEEnius Brand Name */}
                    <div 
                      className="text-4xl font-bold mb-2"
                      style={{ 
                        fontFamily: '"Saira", sans-serif',
                        fontWeight: 800,
                        background: '#013062',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        color: 'transparent'
                      }}
                    >
                      JEEnius
                    </div>
                    
                    <div 
                      className="w-24 h-1 mx-auto mb-6"
                      style={{
                        background: '#013062'
                      }}
                    />
                  </div>
                </div>

                {/* Certificate Title */}
                <div className="mb-8">
                  <h2 
                    className="text-3xl font-bold text-gray-800 mb-4 tracking-wider"
                    style={{ fontFamily: '"Saira", sans-serif', fontWeight: 700 }}
                  >
                    CERTIFICATE OF ACHIEVEMENT
                  </h2>
                  
                  <div 
                    className="w-32 h-0.5 mx-auto"
                    style={{
                      background: '#013062'
                    }}
                  />
                </div>

                {/* Achievement Details */}
                <div className="mb-8">
                  <p 
                    className="text-lg text-gray-700 mb-3"
                    style={{ fontFamily: '"Saira", sans-serif', fontWeight: 400 }}
                  >
                    This is to certify that
                  </p>
                  
                  <div 
                    className="text-3xl font-bold mb-4 pb-2 inline-block"
                    style={{ 
                      fontFamily: '"Saira", sans-serif',
                      fontWeight: 700,
                      background: '#013062',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      color: 'transparent',
                      borderBottom: '3px solid',
                      borderImageSource: '#013062',
                      borderImageSlice: 1
                    }}
                  >
                    {userData.name}
                  </div>
                  
                  <p 
                    className="text-lg text-gray-700 mb-3"
                    style={{ fontFamily: '"Saira", sans-serif', fontWeight: 400 }}
                  >
                    has successfully achieved
                  </p>
                  
                  <h4 
                    className="text-2xl font-bold text-gray-800 mb-4"
                    style={{ fontFamily: '"Saira", sans-serif', fontWeight: 600 }}
                  >
                    {certificate.title.replace(' Certificate', '')}
                  </h4>
                  
                  <p 
                    className="text-base text-gray-600 italic"
                    style={{ fontFamily: '"Saira", sans-serif', fontWeight: 400 }}
                  >
                    {certificate.description}
                  </p>
                </div>
                {/* Footer Section */}
                <div className="flex justify-between items-end w-full mt-auto">
                  <div className="text-left">
                    <p 
                      className="text-sm text-gray-600 mb-1"
                      style={{ fontFamily: '"Saira", sans-serif', fontWeight: 400 }}
                    >
                      Date of Achievement
                    </p>
                    <p 
                      className="font-semibold text-gray-800 mb-3"
                      style={{ fontFamily: '"Saira", sans-serif', fontWeight: 600 }}
                    >
                      {getCurrentDate()}
                    </p>
                    <p 
                      className="text-xs text-gray-500"
                      style={{ fontFamily: '"Saira", sans-serif', fontWeight: 400 }}
                    >
                      Certificate ID: {certificateId}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    {/* Digital Seal */}
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2"
                      style={{
                        background: '#013062',
                        opacity: 0.8
                      }}
                    >
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <p 
                      className="text-xs text-gray-600"
                      style={{ fontFamily: '"Saira", sans-serif', fontWeight: 500 }}
                    >
                      Official Seal
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div 
                      className="w-32 h-0.5 mb-2"
                      style={{
                        background: '#013062'
                      }}
                    />
                    <p 
                      className="text-sm font-semibold text-gray-700"
                      style={{ fontFamily: '"Saira", sans-serif', fontWeight: 600 }}
                    >
                      JEEnius Team
                    </p>
                    <p 
                      className="text-xs text-gray-500"
                      style={{ fontFamily: '"Saira", sans-serif', fontWeight: 400 }}
                    >
                      Authorized Authority
                    </p>
                  </div>
                </div>

                {/* Verification QR Code */}
                <div 
                  className="absolute bottom-4 right-4 w-12 h-12 border-2 flex items-center justify-center text-xs font-bold"
                  style={{
                    borderColor: '#667eea',
                    color: '#667eea',
                    fontFamily: '"Saira", sans-serif'
                  }}
                >
                  QR
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const downloadCertificate = (certificate) => {
    alert(`Downloading ${certificate.title} for ${userData.name}`);
  };

  const shareCertificate = (certificate) => {
    const text = `I earned my ${certificate.title} from JEEnius! 🏆`;
    if (navigator.share) {
      navigator.share({ title: certificate.title, text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            className="text-4xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: '"Saira", sans-serif', fontWeight: 800 }}
          >
            🏆 Your Certificates
          </h1>
          <p 
            className="text-xl text-gray-600"
            style={{ fontFamily: '"Saira", sans-serif', fontWeight: 400 }}
          >
            Showcase your JEE preparation achievements
          </p>
        </div>

        {/* Certificate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {certificateTypes.map((cert) => (
            <Card 
              key={cert.id} 
              className={`hover:shadow-xl transition-all duration-300 ${
                cert.unlocked ? cert.bgColor : 'bg-gray-50'
              } ${cert.unlocked ? cert.borderColor : 'border-gray-200'} border-2`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 ${cert.unlocked ? cert.color : 'bg-gray-400'} rounded-full flex items-center justify-center`}>
                    <cert.icon className="w-5 h-5 text-white" />
                  </div>
                  {cert.unlocked ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Earned
                    </Badge>
                  ) : (
                    <Badge variant="outline">Locked</Badge>
                  )}
                </div>
                <CardTitle 
                  className="text-lg leading-tight"
                  style={{ fontFamily: '"Saira", sans-serif', fontWeight: 600 }}
                >
                  {cert.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p 
                  className="text-sm text-gray-600"
                  style={{ fontFamily: '"Saira", sans-serif', fontWeight: 400 }}
                >
                  {cert.description}
                </p>
                
                {!cert.unlocked && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span style={{ fontFamily: '"Saira", sans-serif' }}>Progress</span>
                      <span style={{ fontFamily: '"Saira", sans-serif', fontWeight: 600 }}>
                        {cert.progress}/{cert.required}
                      </span>
                    </div>
                    <Progress value={(cert.progress / cert.required) * 100} className="h-2" />
                  </div>
                )}
                
                <div className="flex gap-2">
                  {cert.unlocked ? (
                    <>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedCertificate(cert)}
                        style={{ fontFamily: '"Saira", sans-serif', fontWeight: 500 }}
                      >
                        <Award className="w-3 h-3 mr-1" />
                        View Certificate
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => downloadCertificate(cert)}
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => shareCertificate(cert)}
                      >
                        <Share className="w-3 h-3" />
                      </Button>
                    </>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="flex-1" 
                      disabled
                      style={{ fontFamily: '"Saira", sans-serif' }}
                    >
                      <Trophy className="w-3 h-3 mr-1" />
                      {Math.round((cert.progress / cert.required) * 100)}% Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Certificate Preview Modal */}
        {selectedCertificate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 
                    className="text-2xl font-bold"
                    style={{ fontFamily: '"Saira", sans-serif', fontWeight: 700 }}
                  >
                    Certificate Preview
                  </h2>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => downloadCertificate(selectedCertificate)}
                      style={{ fontFamily: '"Saira", sans-serif', fontWeight: 500 }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedCertificate(null)}
                      style={{ fontFamily: '"Saira", sans-serif', fontWeight: 500 }}
                    >
                      Close
                    </Button>
                  </div>
                </div>
                
                <CertificatePreview certificate={selectedCertificate} />
              </div>
            </div>
          </div>
        )}

        {/* Achievement Summary */}
        <Card className="bg-gradient-to-r from-primary/10 to-blue-50">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 
                className="text-2xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: '"Saira", sans-serif', fontWeight: 700 }}
              >
                Your Achievement Summary
              </h2>
              <p 
                className="text-gray-600"
                style={{ fontFamily: '"Saira", sans-serif', fontWeight: 400 }}
              >
                Track your progress across all certificate categories
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div 
                  className="text-2xl font-bold text-blue-600"
                  style={{ fontFamily: '"Saira", sans-serif', fontWeight: 700 }}
                >
                  {userData.achievements.physicsQuestions}
                </div>
                <div 
                  className="text-sm text-gray-600"
                  style={{ fontFamily: '"Saira", sans-serif', fontWeight: 400 }}
                >
                  Physics Questions
                </div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div 
                  className="text-2xl font-bold text-green-600"
                  style={{ fontFamily: '"Saira", sans-serif', fontWeight: 700 }}
                >
                  {userData.achievements.chemistryQuestions}
                </div>
                <div 
                  className="text-sm text-gray-600"
                  style={{ fontFamily: '"Saira", sans-serif', fontWeight: 400 }}
                >
                  Chemistry Questions
                </div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div 
                  className="text-2xl font-bold text-purple-600"
                  style={{ fontFamily: '"Saira", sans-serif', fontWeight: 700 }}
                >
                  {userData.achievements.mathQuestions}
                </div>
                <div 
                  className="text-sm text-gray-600"
                  style={{ fontFamily: '"Saira", sans-serif', fontWeight: 400 }}
                >
                  Math Questions
                </div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div 
                  className="text-2xl font-bold text-orange-600"
                  style={{ fontFamily: '"Saira", sans-serif', fontWeight: 700 }}
                >
                  {userData.achievements.streak}
                </div>
                <div 
                  className="text-sm text-gray-600"
                  style={{ fontFamily: '"Saira", sans-serif', fontWeight: 400 }}
                >
                  Day Streak
                </div>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <Badge 
                className="bg-yellow-100 text-yellow-800 px-4 py-2"
                style={{ fontFamily: '"Saira", sans-serif', fontWeight: 500 }}
              >
                <Star className="w-4 h-4 mr-2" />
                {certificateTypes.filter(cert => cert.unlocked).length} of {certificateTypes.length} Certificates Earned
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CertificateGenerator;
