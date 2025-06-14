
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowUp, MessageCircle, Users, Clock, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WeirdSkill {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  upvotes: number;
  comments: number;
  participants: number;
  timeLimit: string;
  badge: string;
  progress: number;
}

interface WeirdSkillCardProps {
  skill: WeirdSkill;
}

const WeirdSkillCard: React.FC<WeirdSkillCardProps> = ({ skill }) => {
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(skill.upvotes);
  const { toast } = useToast();

  const handleUpvote = () => {
    if (!hasUpvoted) {
      setUpvotes(prev => prev + 1);
      setHasUpvoted(true);
      toast({
        title: "Upvoted! 🔥",
        description: "You've supported this weird skill challenge!",
      });
    }
  };

  const handleJoinChallenge = () => {
    toast({
      title: "Challenge Accepted! 🎯",
      description: `You've joined "${skill.title}". Time to get weird!`,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`Check out this weird skill challenge: ${skill.title}!`);
    toast({
      title: "Link Copied! 📋",
      description: "Share this weird challenge with your friends!",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-900 text-green-400 border-green-500';
      case 'medium': return 'bg-yellow-900 text-yellow-400 border-yellow-500';
      case 'hard': return 'bg-orange-900 text-orange-400 border-orange-500';
      case 'insane': return 'bg-red-900 text-red-400 border-red-500';
      default: return 'bg-gray-900 text-gray-400 border-gray-500';
    }
  };

  return (
    <div className="ai-card hover:border-orange-500 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <Badge variant="outline" className={getDifficultyColor(skill.difficulty)}>
          {skill.difficulty}
        </Badge>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleUpvote}
            className={`p-1 ${hasUpvoted ? 'text-orange-400' : 'text-gray-400 hover:text-orange-400'}`}
          >
            <ArrowUp className="h-4 w-4" />
            <span className="ml-1 text-xs">{upvotes}</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleShare}
            className="p-1 text-gray-400 hover:text-blue-400"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <h3 className="font-bold text-white mb-2 text-lg">{skill.title}</h3>
      <p className="text-gray-400 text-sm mb-4">{skill.description}</p>

      {skill.progress > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Your Progress</span>
            <span className="text-orange-400 font-semibold">{skill.progress}%</span>
          </div>
          <Progress value={skill.progress} className="h-2" />
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <div className="flex items-center space-x-3">
          <span className="flex items-center">
            <Users className="h-3 w-3 mr-1" />
            {skill.participants}
          </span>
          <span className="flex items-center">
            <MessageCircle className="h-3 w-3 mr-1" />
            {skill.comments}
          </span>
          <span className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {skill.timeLimit}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className="text-yellow-400">🏆 Reward: </span>
          <span className="text-gray-300">{skill.badge}</span>
        </div>
        <Button
          onClick={handleJoinChallenge}
          size="sm"
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0"
        >
          {skill.progress > 0 ? 'Continue' : 'Join Challenge'}
        </Button>
      </div>
    </div>
  );
};

export default WeirdSkillCard;
