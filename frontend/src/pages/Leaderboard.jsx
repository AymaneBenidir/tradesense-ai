import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, TrendingUp, Users, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState('month');
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (e) {}
  };

  // Fetch challenges for leaderboard
  const { data: challenges, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => base44.entities.Challenge.filter({ status: 'passed' }, '-profit_percent', 10),
  });

  // Fetch all users to get names
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        return await base44.entities.User.list();
      } catch (e) {
        return [];
      }
    },
  });

  const getUserName = (challenge) => {
    if (challenge.author_name) return challenge.author_name;
    const u = users?.find(u => u.email === challenge.user_email);
    return u?.full_name || challenge.user_email?.split('@')[0] || 'Trader';
  };

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (index === 1) return <Medal className="w-6 h-6 text-slate-300" />;
    if (index === 2) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center text-slate-400 font-bold">{index + 1}</span>;
  };

  const getRankBg = (index) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
    if (index === 1) return 'bg-gradient-to-r from-slate-400/20 to-slate-500/20 border-slate-400/30';
    if (index === 2) return 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30';
    return 'bg-slate-800/50 border-slate-700';
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-4">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">Top Traders</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Leaderboard</h1>
            <p className="text-slate-400 max-w-lg mx-auto">
              Top 10 traders ranked by profit percentage. Complete your challenge to join the leaderboard!
            </p>
          </motion.div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{challenges?.length || 0}</p>
              <p className="text-xs text-slate-400">Funded Traders</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {challenges?.[0]?.profit_percent?.toFixed(1) || 0}%
              </p>
              <p className="text-xs text-slate-400">Top Profit</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                ${challenges?.reduce((sum, c) => sum + (c.initial_balance || 0), 0).toLocaleString() || 0}
              </p>
              <p className="text-xs text-slate-400">Total Funded</p>
            </CardContent>
          </Card>
        </div>

        {/* Timeframe Filter */}
        <div className="flex justify-center mb-8">
          <Tabs value={timeframe} onValueChange={setTimeframe}>
            <TabsList className="bg-slate-800">
              <TabsTrigger value="week" className="data-[state=active]:bg-emerald-500">This Week</TabsTrigger>
              <TabsTrigger value="month" className="data-[state=active]:bg-emerald-500">This Month</TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-emerald-500">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Leaderboard Table */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Top 10 Traders of the Month</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-16 bg-slate-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : challenges?.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400">No funded traders yet</p>
                <p className="text-sm text-slate-500">Be the first to complete a challenge!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {challenges?.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-4 p-4 rounded-xl border ${getRankBg(index)} ${
                      user?.email === challenge.user_email ? 'ring-2 ring-emerald-500' : ''
                    }`}
                  >
                    <div className="w-10 h-10 flex items-center justify-center">
                      {getRankIcon(index)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium truncate">
                          {getUserName(challenge)}
                        </p>
                        {user?.email === challenge.user_email && (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            You
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 capitalize">{challenge.tier} Challenge</p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-400">
                        +{challenge.profit_percent?.toFixed(2)}%
                      </p>
                      <p className="text-xs text-slate-400">
                        ${challenge.current_balance?.toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* How to Join */}
        <Card className="bg-slate-800/50 border-slate-700 mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Want to join the leaderboard?</h3>
            <p className="text-slate-400 text-sm mb-4">
              Complete your trading challenge with at least 10% profit to become a funded trader.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}