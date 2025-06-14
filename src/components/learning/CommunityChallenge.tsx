
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Send, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CommunityChallenge = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [newSkill, setNewSkill] = useState({
    title: '',
    description: '',
    difficulty: 'Medium'
  });
  const { toast } = useToast();

  const handleSubmitSkill = () => {
    if (!newSkill.title.trim() || !newSkill.description.trim()) {
      toast({
        title: "Oops! 🤔",
        description: "Please fill in all fields for your weird skill idea!",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Skill Submitted! 🚀",
      description: "Your weird skill idea has been submitted to the community for voting!",
    });

    setNewSkill({ title: '', description: '', difficulty: 'Medium' });
    setIsCreating(false);
  };

  const randomSkillIdeas = [
    "Learn to write with your non-dominant hand",
    "Master the art of backwards walking",
    "Speak in rhymes for an entire day",
    "Learn to fold origami blindfolded",
    "Communicate only through interpretive dance"
  ];

  return (
    <div className="ai-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">🎪 Community Skill Creator</h3>
        <Button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isCreating ? 'Cancel' : 'Create Weird Skill'}
        </Button>
      </div>

      {isCreating ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Skill Title
            </label>
            <Input
              placeholder="e.g., Master the art of eating cereal with chopsticks"
              value={newSkill.title}
              onChange={(e) => setNewSkill({ ...newSkill, title: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <Textarea
              placeholder="Describe this wonderfully weird skill challenge..."
              value={newSkill.description}
              onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Difficulty Level
            </label>
            <div className="flex space-x-2">
              {['Easy', 'Medium', 'Hard', 'Insane'].map((difficulty) => (
                <Badge
                  key={difficulty}
                  variant="outline"
                  className={`cursor-pointer ${
                    newSkill.difficulty === difficulty
                      ? 'bg-orange-600 text-white border-orange-500'
                      : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
                  }`}
                  onClick={() => setNewSkill({ ...newSkill, difficulty })}
                >
                  {difficulty}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleSubmitSkill}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white border-0"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit for Community Vote
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-gray-400 mb-4">
            Got an idea for a hilariously weird skill? Submit it to the community and watch the chaos unfold!
          </p>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Lightbulb className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="font-semibold text-white">Random Inspiration</span>
            </div>
            <div className="space-y-2">
              {randomSkillIdeas.slice(0, 3).map((idea, index) => (
                <div key={index} className="text-sm text-gray-300 bg-gray-700 rounded p-2">
                  💡 {idea}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityChallenge;
