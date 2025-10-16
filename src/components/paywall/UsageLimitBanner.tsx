import React from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
