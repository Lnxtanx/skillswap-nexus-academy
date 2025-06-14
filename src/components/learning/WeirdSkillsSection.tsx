
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Flame, Users, Star, Trophy, Share2, ArrowUp, MessageCircle } from 'lucide-react';
import WeirdSkillCard from './WeirdSkillCard';
import CommunityChallenge from './CommunityChallenge';

const WeirdSkillsSection = () => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'leaderboard' | 'memes'>('challenges');

  const weirdSkills = [
    {
      id: 1,
      title: "Master the Art of Speed Cubing",
      description: "Learn to solve a Rubik's cube in under 30 seconds",
      difficulty: "Medium",
      upvotes: 42,
      comments: 15,
      participants: 127,
      timeLimit: "7 days",
      badge: "🎲 Cube Wizard",
      progress: 65
    },
    {
      id: 2,
      title: "Juggle Flaming Torches",
      description: "Master the ancient art of fire juggling (digitally safe!)",
      difficulty: "Insane",
      upvotes: 89,
      comments: 23,
      participants: 45,
      timeLimit: "14 days",
      badge: "🔥 Fire Master",
      progress: 0
    },
    {
      id: 3,
      title: "Speak Only in Movie Quotes",
      description: "Communicate for 24 hours using only famous movie lines",
      difficulty: "Hard",
      upvotes: 156,
      comments: 34,
      participants: 203,
      timeLimit: "3 days",
      badge: "🎬 Quote Master",
      progress: 100
    }
  ];

  const communityStats = {
    totalUsers: 15420,
    weeklyActive: 3200,
    skillsCompleted: 8950,
    memesGenerated: 2341
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">
            🔥 Weird Skills Wednesday
          </h2>
          <p className="text-gray-400">Join the chaos, learn the impossible, earn epic badges!</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-orange-900 text-orange-400 border-orange-500">
            <Users className="h-3 w-3 mr-1" />
            {communityStats.weeklyActive} active
          </Badge>
          <Badge variant="outline" className="bg-red-900 text-red-400 border-red-500">
            <Flame className="h-3 w-3 mr-1" />
            Hot
          </Badge>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        {[
          { key: 'challenges', label: 'Weekly Challenges', icon: Flame },
          { key: 'leaderboard', label: 'Leaderboard', icon: Trophy },
          { key: 'memes', label: 'Meme Generator', icon: Star }
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`${
              activeTab === key
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            } border-0`}
          >
            <Icon className="h-4 w-4 mr-2" />
            {label}
          </Button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'challenges' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weirdSkills.map((skill) => (
              <WeirdSkillCard key={skill.id} skill={skill} />
            ))}
          </div>
          
          <CommunityChallenge />
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="ai-card">
          <h3 className="text-xl font-bold text-white mb-4">🏆 Weekly Weirdness Champions</h3>
          <div className="space-y-3">
            {[
              { rank: 1, name: "SkillNinja42", points: 2850, badge: "🔥 Chaos Master", avatar: "🥷" },
              { rank: 2, name: "WeirdWonder", points: 2340, badge: "🎪 Circus Star", avatar: "🤹" },
              { rank: 3, name: "QuirkQueen", points: 1980, badge: "👑 Oddity Royalty", avatar: "👸" },
              { rank: 4, name: "BizarreBob", points: 1755, badge: "🎭 Drama King", avatar: "🎭" },
              { rank: 5, name: "CrazyCarl", points: 1632, badge: "🎨 Art Anarchist", avatar: "🎨" }
            ].map((user) => (
              <div key={user.rank} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-yellow-400">#{user.rank}</span>
                  <span className="text-2xl">{user.avatar}</span>
                  <div>
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="text-sm text-gray-400">{user.badge}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-400">{user.points} pts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'memes' && (
        <div className="ai-card text-center">
          <h3 className="text-xl font-bold text-white mb-4">🎨 Skill Completion Meme Generator</h3>
          <div className="bg-gray-800 rounded-lg p-6 mb-4">
            <div className="text-6xl mb-4">🎓</div>
            <h4 className="text-lg font-bold text-white mb-2">Drake pointing meme template</h4>
            <p className="text-gray-400 mb-4">Generate your epic skill completion meme!</p>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
              Generate My Meme
            </Button>
          </div>
          <p className="text-sm text-gray-500">Complete a weird skill to unlock meme templates!</p>
        </div>
      )}

      {/* Community Stats Footer */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="ai-card text-center">
          <div className="text-2xl font-bold gradient-text">{communityStats.totalUsers.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Members</div>
        </div>
        <div className="ai-card text-center">
          <div className="text-2xl font-bold gradient-text">{communityStats.skillsCompleted.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Skills Mastered</div>
        </div>
        <div className="ai-card text-center">
          <div className="text-2xl font-bold gradient-text">{communityStats.memesGenerated.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Memes Created</div>
        </div>
        <div className="ai-card text-center">
          <div className="text-2xl font-bold gradient-text">42</div>
          <div className="text-sm text-gray-400">Easter Eggs Found</div>
        </div>
      </div>
    </div>
  );
};

export default WeirdSkillsSection;
