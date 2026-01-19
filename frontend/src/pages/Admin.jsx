import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Shield, Users, DollarSign, TrendingUp, Search, 
  CheckCircle, XCircle, Loader2, AlertTriangle,
  Settings, CreditCard, BarChart3, Trash2
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      if (userData.role !== 'admin') {
        toast.error('Access denied. Admin only.');
        navigate(createPageUrl('Dashboard'));
      }
    } catch (e) {
      navigate(createPageUrl('Landing'));
    }
    setLoading(false);
  };

  // Fetch all challenges
  const { data: challenges, isLoading: loadingChallenges } = useQuery({
    queryKey: ['admin-challenges'],
    queryFn: () => base44.entities.Challenge.list('-created_date', 100),
    enabled: user?.role === 'admin',
  });

  // Fetch all users
  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      try {
        return await base44.entities.User.list();
      } catch (e) {
        return [];
      }
    },
    enabled: user?.role === 'admin',
  });

  // Update challenge status
  const updateChallengeMutation = useMutation({
    mutationFn: async ({ id, status, reason }) => {
      await base44.entities.Challenge.update(id, {
        status,
        fail_reason: status === 'failed' ? reason : null
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-challenges']);
      toast.success('Challenge updated');
    },
    onError: () => {
      toast.error('Failed to update challenge');
    }
  });

  // Delete user
  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      const response = await base44.functions.invoke('deleteUser', { userId });
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      queryClient.invalidateQueries(['admin-challenges']);
      toast.success('User and all related data deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete user: ' + error.message);
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return null;
  }

  const getUserEmail = (email) => {
    const u = users?.find(u => u.email === email);
    return u?.full_name || email;
  };

  const stats = {
    totalUsers: users?.length || 0,
    activeChallenges: challenges?.filter(c => c.status === 'active').length || 0,
    passedChallenges: challenges?.filter(c => c.status === 'passed').length || 0,
    totalRevenue: challenges?.reduce((sum, c) => sum + (c.amount_paid || 0), 0) || 0
  };

  const filteredChallenges = challenges?.filter(c => 
    c.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.tier?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-4">
            <Shield className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-medium">Admin Panel</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Administration</h1>
          <p className="text-slate-400">
            Manage challenges, users, and platform settings.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                  <p className="text-xs text-slate-400">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.activeChallenges}</p>
                  <p className="text-xs text-slate-400">Active Challenges</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.passedChallenges}</p>
                  <p className="text-xs text-slate-400">Funded Traders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.totalRevenue} DH</p>
                  <p className="text-xs text-slate-400">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="challenges" className="space-y-6">
          <TabsList className="bg-slate-800">
            <TabsTrigger value="challenges" className="data-[state=active]:bg-emerald-500">
              Challenges
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-emerald-500">
              Users
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-emerald-500">
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Challenges Tab */}
          <TabsContent value="challenges">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">All Challenges</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search challenges..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-slate-800 border-slate-700 text-white w-64"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {loadingChallenges ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredChallenges?.map(challenge => (
                      <div 
                        key={challenge.id}
                        className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl"
                      >
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-white font-medium">{getUserEmail(challenge.user_email)}</p>
                            <p className="text-xs text-slate-400">{challenge.user_email}</p>
                          </div>
                          <Badge className="capitalize bg-slate-700 text-slate-300">{challenge.tier}</Badge>
                          <Badge className={
                            challenge.status === 'passed' ? 'bg-emerald-500/20 text-emerald-400' :
                            challenge.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                            'bg-blue-500/20 text-blue-400'
                          }>
                            {challenge.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-white">${challenge.current_balance?.toLocaleString()}</p>
                            <p className={`text-xs ${challenge.profit_percent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {challenge.profit_percent >= 0 ? '+' : ''}{challenge.profit_percent?.toFixed(2)}%
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10"
                              onClick={() => updateChallengeMutation.mutate({ 
                                id: challenge.id, 
                                status: 'passed' 
                              })}
                              disabled={updateChallengeMutation.isPending}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-400 hover:bg-red-500/10"
                              onClick={() => updateChallengeMutation.mutate({ 
                                id: challenge.id, 
                                status: 'failed',
                                reason: 'Manually failed by admin'
                              })}
                              disabled={updateChallengeMutation.isPending}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredChallenges?.length === 0 && (
                      <div className="text-center py-8 text-slate-400">
                        No challenges found
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">All Users</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {users?.map(u => (
                      <div 
                        key={u.id}
                        className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl"
                      >
                        <div>
                          <p className="text-white font-medium">{u.full_name || 'No name'}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={u.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-slate-500/20 text-slate-400'}>
                            {u.role}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-400 hover:bg-red-500/10"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${u.full_name || u.email}?`)) {
                                deleteUserMutation.mutate(u.id);
                              }
                            }}
                            disabled={deleteUserMutation.isPending || u.email === user?.email}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    PayPal Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-400">PayPal Client ID</label>
                    <Input 
                      placeholder="Enter PayPal Client ID"
                      className="bg-slate-800 border-slate-700 text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">PayPal Secret</label>
                    <Input 
                      type="password"
                      placeholder="Enter PayPal Secret"
                      className="bg-slate-800 border-slate-700 text-white mt-1"
                    />
                  </div>
                  <Button className="bg-emerald-500 hover:bg-emerald-600">
                    Save PayPal Settings
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Challenge Rules
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-400">Max Daily Loss (%)</label>
                    <Input 
                      type="number"
                      defaultValue={5}
                      className="bg-slate-800 border-slate-700 text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Max Total Loss (%)</label>
                    <Input 
                      type="number"
                      defaultValue={10}
                      className="bg-slate-800 border-slate-700 text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Profit Target (%)</label>
                    <Input 
                      type="number"
                      defaultValue={10}
                      className="bg-slate-800 border-slate-700 text-white mt-1"
                    />
                  </div>
                  <Button className="bg-emerald-500 hover:bg-emerald-600">
                    Save Rules
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}