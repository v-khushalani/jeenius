// src/components/admin/ChapterManager.tsx

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GripVertical, Lock, Unlock } from 'lucide-react';

const ChapterManager = () => {
  const [chapters, setChapters] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('Physics');

  useEffect(() => {
    fetchChapters();
  }, [selectedSubject]);

  const fetchChapters = async () => {
    const { data } = await supabase
      .from('chapters')
      .select('*')
      .eq('subject', selectedSubject)
      .order('chapter_number');
    setChapters(data || []);
  };

  const updateChapterSequence = async (chapterId: string, newNumber: number) => {
    await supabase
      .from('chapters')
      .update({ chapter_number: newNumber })
      .eq('id', chapterId);
    fetchChapters();
  };

  const toggleFreeStatus = async (chapterId: string, currentStatus: boolean) => {
    await supabase
      .from('chapters')
      .update({ is_free: !currentStatus })
      .eq('id', chapterId);
    fetchChapters();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Chapter Management</h1>
      
      {/* Subject Selector */}
      <div className="flex space-x-4 mb-6">
        {['Physics', 'Chemistry', 'Maths'].map(subject => (
          <button
            key={subject}
            onClick={() => setSelectedSubject(subject)}
            className={`px-4 py-2 rounded-lg ${
              selectedSubject === subject
                ? 'bg-primary text-white'
                : 'bg-gray-200'
            }`}
          >
            {subject}
          </button>
        ))}
      </div>

      {/* Chapters List */}
      <div className="space-y-2">
        {chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            className="flex items-center space-x-4 p-4 bg-white border rounded-lg"
          >
            {/* Drag Handle */}
            <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
            
            {/* Chapter Number */}
            <input
              type="number"
              value={chapter.chapter_number}
              onChange={(e) => updateChapterSequence(chapter.id, parseInt(e.target.value))}
              className="w-16 px-2 py-1 border rounded"
            />
            
            {/* Chapter Name */}
            <div className="flex-1">
              <p className="font-medium">{chapter.chapter_name}</p>
              <p className="text-sm text-gray-500">{chapter.description}</p>
            </div>
            
            {/* Free/Premium Toggle */}
            <button
              onClick={() => toggleFreeStatus(chapter.id, chapter.is_free)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                chapter.is_free
                  ? 'bg-green-100 text-green-700'
                  : 'bg-orange-100 text-orange-700'
              }`}
            >
              {chapter.is_free ? (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Free</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Premium</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChapterManager;
