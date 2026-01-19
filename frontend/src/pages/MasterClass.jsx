import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, Play, Clock, BookOpen, BarChart2, 
  Shield, Brain, Lock, Star, CheckCircle, Video
} from "lucide-react";
import { motion } from "framer-motion";

const COURSES = [
  {
    id: 1,
    title: "Trading Fundamentals 101",
    description: "Learn the basics of financial markets, how to read charts, and understand market dynamics.",
    level: "beginner",
    category: "fundamental",
    duration_minutes: 45,
    thumbnail_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
    is_premium: false,
    lessons: 8
  },
  {
    id: 2,
    title: "Technical Analysis Mastery",
    description: "Master candlestick patterns, support/resistance levels, and technical indicators.",
    level: "intermediate",
    category: "technical",
    duration_minutes: 120,
    thumbnail_url: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400",
    is_premium: false,
    lessons: 15
  },
  {
    id: 3,
    title: "Risk Management Strategies",
    description: "Protect your capital with proven risk management techniques used by professional traders.",
    level: "intermediate",
    category: "risk_management",
    duration_minutes: 90,
    thumbnail_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
    is_premium: true,
    lessons: 12
  },
  {
    id: 4,
    title: "Advanced Price Action Trading",
    description: "Trade like institutions using pure price action without indicators.",
    level: "advanced",
    category: "technical",
    duration_minutes: 180,
    thumbnail_url: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=400",
    is_premium: true,
    lessons: 20
  },
  {
    id: 5,
    title: "Trading Psychology",
    description: "Master your emotions and develop the mindset of a successful trader.",
    level: "beginner",
    category: "psychology",
    duration_minutes: 60,
    thumbnail_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    is_premium: false,
    lessons: 10
  },
  {
    id: 6,
    title: "Cryptocurrency Trading",
    description: "Navigate the crypto markets with confidence. Bitcoin, Ethereum, and altcoins.",
    level: "intermediate",
    category: "technical",
    duration_minutes: 150,
    thumbnail_url: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400",
    is_premium: true,
    lessons: 18
  }
];

export default function MasterClass() {
  const [user, setUser] = useState(null);
  const [levelFilter, setLevelFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (e) {}
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'intermediate': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'advanced': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'technical': return BarChart2;
      case 'fundamental': return BookOpen;
      case 'risk_management': return Shield;
      case 'psychology': return Brain;
      default: return BookOpen;
    }
  };

  const filteredCourses = COURSES.filter(course => {
    const levelMatch = levelFilter === 'all' || course.level === levelFilter;
    const categoryMatch = categoryFilter === 'all' || course.category === categoryFilter;
    return levelMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-4">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">MasterClass Academy</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Learn Trading</h1>
            <p className="text-slate-400 max-w-2xl">
              From beginner to advanced, master the art of trading with our comprehensive courses, 
              live webinars, and AI-assisted learning paths.
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen, value: '50+', label: 'Courses' },
            { icon: Video, value: '200+', label: 'Video Lessons' },
            { icon: GraduationCap, value: '10K+', label: 'Students' },
            { icon: Star, value: '4.9', label: 'Rating' },
          ].map((stat, i) => (
            <Card key={i} className="bg-slate-900 border-slate-800">
              <CardContent className="p-4 text-center">
                <stat.icon className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Learning Path */}
        <Card className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-500/20 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">AI-Assisted Learning Path</h3>
                <p className="text-slate-400 text-sm">Personalized course recommendations based on your skill level</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Your Progress</span>
                <span className="text-emerald-400">3 of 6 courses completed</span>
              </div>
              <Progress value={50} className="h-2 bg-slate-700" />
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div>
            <p className="text-xs text-slate-400 mb-2">Level</p>
            <Tabs value={levelFilter} onValueChange={setLevelFilter}>
              <TabsList className="bg-slate-800">
                <TabsTrigger value="all" className="data-[state=active]:bg-emerald-500">All</TabsTrigger>
                <TabsTrigger value="beginner" className="data-[state=active]:bg-emerald-500">Beginner</TabsTrigger>
                <TabsTrigger value="intermediate" className="data-[state=active]:bg-emerald-500">Intermediate</TabsTrigger>
                <TabsTrigger value="advanced" className="data-[state=active]:bg-emerald-500">Advanced</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-2">Category</p>
            <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
              <TabsList className="bg-slate-800">
                <TabsTrigger value="all" className="data-[state=active]:bg-emerald-500">All</TabsTrigger>
                <TabsTrigger value="technical" className="data-[state=active]:bg-emerald-500">Technical</TabsTrigger>
                <TabsTrigger value="fundamental" className="data-[state=active]:bg-emerald-500">Fundamental</TabsTrigger>
                <TabsTrigger value="risk_management" className="data-[state=active]:bg-emerald-500">Risk</TabsTrigger>
                <TabsTrigger value="psychology" className="data-[state=active]:bg-emerald-500">Psychology</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => {
            const CategoryIcon = getCategoryIcon(course.category);
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-slate-900 border-slate-800 overflow-hidden hover:border-slate-700 transition-all group">
                  <div className="relative">
                    <img 
                      src={course.thumbnail_url} 
                      alt={course.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    {course.is_premium && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-amber-500 text-white">
                          <Lock className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      </div>
                    )}
                    <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </button>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${getLevelColor(course.level)} border capitalize`}>
                        {course.level}
                      </Badge>
                      <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <Clock className="w-3 h-3" />
                        {Math.floor(course.duration_minutes / 60)}h {course.duration_minutes % 60}m
                      </div>
                    </div>
                    <h3 className="text-white font-semibold mb-2">{course.title}</h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-slate-400 text-sm">
                        <CategoryIcon className="w-4 h-4" />
                        <span>{course.lessons} lessons</span>
                      </div>
                      <Button size="sm" variant={course.is_premium ? "outline" : "default"} 
                        className={course.is_premium ? "border-amber-500 text-amber-400" : "bg-emerald-500 hover:bg-emerald-600"}>
                        {course.is_premium ? 'Unlock' : 'Start'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Live Webinars */}
        <Card className="bg-slate-800/50 border-slate-700 mt-12">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-red-400" />
              Live Webinars
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                    <Video className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                </div>
                <div>
                  <p className="text-white font-medium">Weekly Market Analysis</p>
                  <p className="text-slate-400 text-sm">Every Friday at 2:00 PM GMT</p>
                </div>
              </div>
              <Button className="bg-red-500 hover:bg-red-600">
                Join Live
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}