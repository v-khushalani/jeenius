// src/components/paywall/SubscriptionPaywall.tsx

import React from 'react';
import { X, Lock, Zap, BookOpen, Brain, Award, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubscriptionPaywallProps {
  contentType: 'chapter' | 'test' | 'ai';
  onClose: () => void;
  onUpgrade: () => void;
  message?: string;
}

export const SubscriptionPaywall: React.FC<SubscriptionPaywallProps> = ({
  contentType,
  onClose,
  onUpgrade,
  message
}) => {
  const contentMessages = {
    chapter: {
      title: '🔒 Premium Chapter',
      description: 'This chapter is available for Premium members only.',
      icon: BookOpen
    },
    test: {
      title: '🔒 Premium Test',
      description: 'Access unlimited tests with Premium membership.',
      icon: Award
    },
    ai: {
      title: '🤖 AI Limit Reached',
      description: 'Upgrade to get unlimited AI-powered doubt solving.',
      icon: Brain
    }
  };

  const content = contentMessages[contentType];
  const Icon = content.icon;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-3 rounded-full">
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{content.title}</h2>
              <p className="text-white/90 text-sm mt-1">
                {message || content.description}
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4">Unlock Premium Benefits:</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 p-2 rounded-full mt-1">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Unlimited Chapters</p>
                <p className="text-sm text-gray-600">
                  Access all chapters across Physics, Chemistry & Maths
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-2 rounded-full mt-1">
                <Award className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Unlimited Practice Tests</p>
                <p className="text-sm text-gray-600">
                  Take as many tests as you want, track your progress
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-purple-100 p-2 rounded-full mt-1">
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">AI-Powered Learning</p>
                <p className="text-sm text-gray-600">
                  Unlimited AI doubt solving & personalized study plans
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-orange-100 p-2 rounded-full mt-1">
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium">Advanced Analytics</p>
                <p className="text-sm text-gray-600">
                  Detailed performance tracking & improvement insights
                </p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="mt-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 border-2 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Starting at</p>
                <p className="text-3xl font-bold text-primary">₹299</p>
                <p className="text-sm text-gray-500">per month</p>
              </div>
              <div className="text-right">
                <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  SAVE ₹1000
                </div>
                <p className="text-xs text-gray-600 mt-1">on yearly plan</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-6 space-y-3">
            <Button
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-6 text-lg font-bold rounded-xl"
            >
              <Star className="w-5 h-5 mr-2" />
              Upgrade to Premium Now
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full py-3"
            >
              Maybe Later
            </Button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            ✨ Join 10,000+ students already learning with JEEnius Premium
          </p>
        </div>
      </div>
    </div>
  );
};

// src/components/paywall/LockedChapterCard.tsx

interface LockedChapterCardProps {
  chapterName: string;
  subject: string;
  chapterNumber: number;
  onUnlock: () => void;
}

export const LockedChapterCard: React.FC<LockedChapterCardProps> = ({
  chapterName,
  subject,
  chapterNumber,
  onUnlock
}) => {
  return (
    <div className="relative border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Lock Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-gray-100/80 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-br from-orange-400 to-red-500 p-4 rounded-full inline-block mb-3">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <p className="font-bold text-lg mb-2">Premium Content</p>
          <p className="text-sm text-gray-600 mb-4 max-w-xs">
            Upgrade to unlock this chapter and many more!
          </p>
          <button
            onClick={onUnlock}
            className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-shadow"
          >
            🔓 Unlock Now
          </button>
        </div>
      </div>

      {/* Blurred Content */}
      <div className="opacity-30">
        <div className="flex items-center justify-between mb-4">
          <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
            Chapter {chapterNumber}
          </span>
          <span className="text-sm text-gray-500">{subject}</span>
        </div>
        <h3 className="text-xl font-bold mb-2">{chapterName}</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>📚 50+ Questions</span>
          <span>⏱️ 2 hours</span>
          <span>⭐ Medium</span>
        </div>
      </div>
    </div>
  );
};

// src/components/paywall/UsageLimitBanner.tsx

interface UsageLimitBannerProps {
  type: 'chapters' | 'questions' | 'ai';
  used: number;
  limit: number;
  onUpgrade: () => void;
}

export const UsageLimitBanner: React.FC<UsageLimitBannerProps> = ({
  type,
  used,
  limit,
  onUpgrade
}) => {
  const percentage = (used / limit) * 100;
  const remaining = limit - used;

  const getColor = () => {
    if (percentage >= 90) return 'red';
    if (percentage >= 70) return 'orange';
    return 'green';
  };

  const color = getColor();
  const colorClasses = {
    red: 'bg-red-100 border-red-300 text-red-700',
    orange: 'bg-orange-100 border-orange-300 text-orange-700',
    green: 'bg-green-100 border-green-300 text-green-700'
  };

  const messages = {
    chapters: `${remaining} free chapter${remaining !== 1 ? 's' : ''} remaining`,
    questions: `${remaining} question${remaining !== 1 ? 's' : ''} remaining today`,
    ai: `${remaining} AI quer${remaining !== 1 ? 'ies' : 'y'} remaining today`
  };

  if (used === 0) return null;

  return (
    <div
      className={`border-2 rounded-lg p-4 ${colorClasses[color]} flex items-center justify-between`}
    >
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <div className="font-bold">
            {used}/{limit} {type} used
          </div>
          {percentage >= 70 && <Zap className="w-4 h-4" />}
        </div>
        <div className="w-full bg-white/50 rounded-full h-2 mb-2">
          <div
            className={`h-full rounded-full transition-all ${
              color === 'red'
                ? 'bg-red-500'
                : color === 'orange'
                ? 'bg-orange-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-sm">{messages[type]}</p>
      </div>

      {percentage >= 70 && (
        <Button
          onClick={onUpgrade}
          size="sm"
          className="ml-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
        >
          Upgrade
        </Button>
      )}
    </div>
  );
};

// src/components/paywall/FreemiumBadge.tsx

export const FreemiumBadge: React.FC<{ isPremium: boolean }> = ({ isPremium }) => {
  if (isPremium) {
    return (
      <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm">
        <Star className="w-4 h-4" />
        <span>Premium Member</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium text-sm">
      <span>Free Plan</span>
    </div>
  );
};
