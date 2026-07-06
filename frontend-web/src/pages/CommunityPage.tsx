import React, { useState } from 'react';
import { Trophy, Award, Heart, MessageSquare, Share2, Plus, Sparkles } from 'lucide-react';

export default function CommunityPage() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'David Miller',
      role: 'User',
      avatar: '🏋️‍♂️',
      content: 'Just smashed my workout routine logged via AI Coach! Logged 45 minutes of HIIT, feeling absolutely refreshed! 🥗🔥',
      likes: 24,
      comments: 6,
      liked: false
    },
    {
      id: 2,
      author: 'Sarah Jenkins',
      role: 'Nutritionist',
      avatar: '🥑',
      content: 'Pro tip for fat loss: swap standard sour cream dressings for low-fat greek yogurt. Increases protein intake and saves ~120 kcal per serving!',
      likes: 85,
      comments: 14,
      liked: true
    }
  ]);

  const [newPostContent, setNewPostContent] = useState('');

  const handleLike = (id: number) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return {
          ...p,
          likes: p.liked ? p.likes - 1 : p.likes + 1,
          liked: !p.liked
        };
      }
      return p;
    }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost = {
      id: Date.now(),
      author: 'You',
      role: 'User',
      avatar: '🌟',
      content: newPostContent,
      likes: 0,
      comments: 0,
      liked: false
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const leaderboardUsers = [
    { rank: 1, name: 'Jessica Vance', points: 3450, badge: '🏆 Calorie Master' },
    { rank: 2, name: 'Marcus Brody', points: 3200, badge: '🔥 Streaks Champion' },
    { rank: 3, name: 'Sarah Jenkins', points: 2980, badge: '🥗 Meal Planner Pro' },
    { rank: 4, name: 'You', points: 2450, badge: '💪 Fitness Rookie' }
  ];

  const activeChallenges = [
    { title: '10k Steps Sprint', target: '10,000 steps daily for 7 days', participants: 450, points: 500 },
    { title: 'Water Hydration Habit', target: 'Drink 3L water every day for 2 weeks', participants: 890, points: 800 },
    { title: 'No Junk Food Challenge', target: 'Clean eating for 10 consecutive days', participants: 1200, points: 1000 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* SOCIAL FEED */}
      <div className="lg:col-span-2 space-y-6">
        {/* Create Post */}
        <div className="glass p-6 rounded-3xl shadow-sm">
          <form onSubmit={handleCreatePost} className="space-y-4">
            <textarea
              placeholder="Share your meal logs, workout achievements, or health questions with the community..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-slate-900 dark:text-white"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Keep posts encouraging and healthy!</span>
              <button
                type="submit"
                className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-md shadow-primary/10 transition-colors"
              >
                <Plus size={14} />
                <span>Post Feed</span>
              </button>
            </div>
          </form>
        </div>

        {/* Posts lists */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="glass p-6 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl p-2 rounded-xl bg-slate-100 dark:bg-slate-800">{post.avatar}</span>
                  <div>
                    <h4 className="font-bold text-sm">{post.author}</h4>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider">{post.role}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{post.content}</p>

              <div className="flex space-x-6 pt-3 border-t border-slate-100 dark:border-slate-800/40 text-xs text-slate-400">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-1.5 hover:text-red-500 transition-colors ${post.liked ? 'text-red-500 font-bold' : ''}`}
                >
                  <Heart size={16} className={post.liked ? 'fill-red-500' : ''} />
                  <span>{post.likes}</span>
                </button>

                <button className="flex items-center space-x-1.5 hover:text-primary transition-colors">
                  <MessageSquare size={16} />
                  <span>{post.comments} Comments</span>
                </button>

                <button className="flex items-center space-x-1.5 hover:text-slate-600 dark:hover:text-white transition-colors">
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LEADERBOARDS & CHALLENGES PANEL */}
      <div className="space-y-6">
        {/* Leaderboard Card */}
        <div className="glass p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-lg font-bold">
            <Trophy className="text-amber-500" size={20} />
            <span>Leaderboard Ranks</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/40">
            {leaderboardUsers.map((u) => (
              <div key={u.rank} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                <div className="flex items-center space-x-3">
                  <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    u.rank === 1 ? 'bg-amber-500 text-white' :
                    u.rank === 2 ? 'bg-slate-300 text-slate-800' :
                    u.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {u.rank}
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-white">{u.name}</h4>
                    <span className="text-[10px] text-slate-400 block">{u.badge}</span>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-primary">{u.points} pts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Challenges Card */}
        <div className="glass p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-lg font-bold">
            <Award className="text-primary" size={20} />
            <span>Active Challenges</span>
          </div>

          <div className="space-y-3">
            {activeChallenges.map((c, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/60 shadow-sm space-y-2">
                <h4 className="font-bold text-xs flex items-center space-x-1">
                  <Sparkles size={12} className="text-primary" />
                  <span>{c.title}</span>
                </h4>
                <p className="text-[10px] text-slate-400 leading-normal">{c.target}</p>
                <div className="flex justify-between items-center pt-2 text-[10px] text-slate-500">
                  <span>{c.participants} tracking</span>
                  <span className="font-bold text-primary">+{c.points} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
