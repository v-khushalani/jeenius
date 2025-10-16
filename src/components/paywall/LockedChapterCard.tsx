import React from 'react';
import { Lock } from 'lucide-react';

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
