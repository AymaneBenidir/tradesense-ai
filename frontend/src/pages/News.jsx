import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Newspaper, Globe, TrendingUp, Loader2, RefreshCw, Brain, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function News() {
  const [category, setCategory] = useState('all');
  const [aiSummary, setAiSummary] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  // Fetch news from AI
  const { data: news, isLoading, refetch } = useQuery({
    queryKey: ['news', category],
    queryFn: async () => {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 8 realistic financial news headlines for today's market. Include news about:
        - US stocks (Apple, Tesla, Microsoft)
        - Cryptocurrency (Bitcoin, Ethereum)
        - African markets
        - Moroccan market (Casablanca Stock Exchange)
        
        For each news item, provide:
        - A compelling headline
        - A brief summary (2-3 sentences)
        - Category (market, crypto, morocco, or global)
        - A fictional but realistic source name`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            news: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  summary: { type: "string" },
                  category: { type: "string" },
                  source: { type: "string" }
                }
              }
            }
          }
        }
      });
      return response.news || [];
    },
  });

  const fetchAISummary = async () => {
    setIsLoadingSummary(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Provide a brief AI-generated market summary for today. Include:
        - Overall market sentiment
        - Key events affecting markets
        - What traders should watch for
        Keep it concise (4-5 sentences).`,
        add_context_from_internet: true,
      });
      setAiSummary(response);
    } catch (e) {
      console.error(e);
    }
    setIsLoadingSummary(false);
  };

  useEffect(() => {
    fetchAISummary();
  }, []);

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'market': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'crypto': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'morocco': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'global': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const filteredNews = news?.filter(item => 
    category === 'all' || item.category === category
  ) || [];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4">
              <Newspaper className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium">Live News Hub</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Financial News</h1>
            <p className="text-slate-400">
              Stay informed with real-time financial news and AI-generated market summaries.
            </p>
          </motion.div>
        </div>

        {/* AI Market Summary */}
        <Card className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-500/20 mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-emerald-400" />
              <CardTitle className="text-white">AI Market Summary</CardTitle>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={fetchAISummary}
              disabled={isLoadingSummary}
              className="text-slate-400 hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingSummary ? 'animate-spin' : ''}`} />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoadingSummary ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                <span className="text-slate-400">Generating AI summary...</span>
              </div>
            ) : (
              <p className="text-slate-300 leading-relaxed">{aiSummary}</p>
            )}
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="flex items-center justify-between mb-6">
          <Tabs value={category} onValueChange={setCategory}>
            <TabsList className="bg-slate-800">
              <TabsTrigger value="all" className="data-[state=active]:bg-emerald-500">All</TabsTrigger>
              <TabsTrigger value="market" className="data-[state=active]:bg-emerald-500">Markets</TabsTrigger>
              <TabsTrigger value="crypto" className="data-[state=active]:bg-emerald-500">Crypto</TabsTrigger>
              <TabsTrigger value="morocco" className="data-[state=active]:bg-emerald-500">Morocco</TabsTrigger>
              <TabsTrigger value="global" className="data-[state=active]:bg-emerald-500">Global</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            disabled={isLoading}
            className="border-slate-700 text-slate-400"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* News Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-slate-700 rounded w-1/4" />
                    <div className="h-6 bg-slate-700 rounded w-3/4" />
                    <div className="h-4 bg-slate-700 rounded w-full" />
                    <div className="h-4 bg-slate-700 rounded w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredNews.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-12 text-center">
              <Newspaper className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400">No news available</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredNews.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={`${getCategoryColor(item.category)} border`}>
                        {item.category}
                      </Badge>
                      <span className="text-xs text-slate-500">{item.source}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {item.summary}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Economic Calendar Teaser */}
        <Card className="bg-slate-800/50 border-slate-700 mt-8">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Economic Calendar</h3>
                <p className="text-slate-400 text-sm">Track important economic events</p>
              </div>
            </div>
            <Badge className="bg-amber-500/20 text-amber-400">Coming Soon</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}