import React from 'react';
import { Home, BookOpen, MessageSquare, Trophy, User, Target, BarChart3, PlusCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const navItems = isAuthenticated ? [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: BookOpen, label: 'Study', path: '/study-now' },
    { icon: Target, label: 'Tests', path: '/tests' },
    { icon: MessageSquare, label: 'Doubts', path: '/doubts' },
    { icon: User, label: 'Profile', path: '/settings' }
  ] : [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Lessons', path: '/lessons' },
    { icon: MessageSquare, label: 'Doubts', path: '/doubts' },
    { icon: Trophy, label: 'Gaming', path: '/gamification' },
    { icon: User, label: 'Login', path: '/login' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 safe-area-pb z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                isActive 
                  ? 'text-primary bg-primary/10 transform scale-105' 
                  : 'text-gray-600 hover:text-primary hover:bg-gray-50'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
              <span className={`text-xs font-medium truncate ${isActive ? 'text-primary font-semibold' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-primary rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Enhanced features indicator */}
      {isAuthenticated && (
        <div className="absolute -top-12 right-4">
          <button
            onClick={() => navigate('/lesson-builder')}
            className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all"
          >
            <PlusCircle className="w-6 h-6 text-white" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default MobileNavigation;
