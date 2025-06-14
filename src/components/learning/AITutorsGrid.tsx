
import React from 'react';
import { Button } from '@/components/ui/button';

const AITutorsGrid = () => {
  const aiTutors = [
    { name: 'Code Master', avatar: '🧑‍💻', specialty: 'Programming', status: 'Available' },
    { name: 'Professor Pine', avatar: '👨‍🔬', specialty: 'Sciences', status: 'Available' },
    { name: 'Chef Charlie', avatar: '👨‍🍳', specialty: 'Culinary', status: 'Available' },
    { name: 'Sensei Sam', avatar: '🥋', specialty: 'Fitness', status: 'Available' },
    { name: 'Language Luna', avatar: '🗣️', specialty: 'Languages', status: 'Available' }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold gradient-text mb-6">Meet Your AI Tutors</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {aiTutors.map((tutor, index) => (
          <div key={index} className="ai-card text-center">
            <div className="text-4xl mb-3">{tutor.avatar}</div>
            <h3 className="font-bold text-white mb-1">{tutor.name}</h3>
            <p className="text-blue-400 text-sm mb-2">{tutor.specialty}</p>
            <span className="inline-block px-2 py-1 rounded text-xs bg-green-900 text-green-400 mb-3">
              {tutor.status}
            </span>
            <Button 
              className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
              size="sm"
            >
              Start Session
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AITutorsGrid;
