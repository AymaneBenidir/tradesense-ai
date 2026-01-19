import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, Brain, RefreshCw, Target, Shield, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function AISignalsPanel({ signal, isLoading, onRefresh, challenge, marketType }) {
  const getSignalIcon = (signal) => {
    switch (signal) {
      case 'BUY': return <TrendingUp className="w-5 h-5" />;
      case 'SELL': return <TrendingDown className="w-5 h-5" />;
      case 'HOLD': return <AlertTriangle className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getSignalColor = (signal) => {
    switch (signal) {
      case 'BUY': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'SELL': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'HOLD': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getRiskLevel = () => {
    if (!challenge) return { level: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500/10' };
    const dailyLoss = ((challenge.daily_start_balance - challenge.current_balance) / challenge.daily_start_balance) * 100;
    if (dailyLoss >= 4) return { level: 'Critical', color: 'text-red-400', bg: 'bg-red-500/10' };
    if (dailyLoss >= 2) return { level: 'High', color: 'text-orange-400', bg: 'bg-orange-500/10' };
    return { level: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
  };

  const riskInfo = getRiskLevel();
  const dailyLossPercent = challenge ? ((challenge.daily_start_balance - challenge.current_balance) / challenge.daily_start_balance) * 100 : 0;
  const totalLossPercent = challenge ? ((challenge.initial_balance - challenge.current_balance) / challenge.initial_balance) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* AI Signal Card */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-emerald-400" />
            <CardTitle className="text-white">AI Signal</CardTitle>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-slate-400 hover:text-white"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {signal ? (
            <>
              {/* Signal Badge */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Recommendation</p>
                  <p className="text-sm text-slate-300">{signal.reason}</p>
                </div>
                <Badge className={`${getSignalColor(signal.signal)} border flex items-center gap-2 px-4 py-2`}>
                  {getSignalIcon(signal.signal)}
                  {signal.signal}
                </Badge>
              </div>

              {/* Risk Level */}
              <div className={`p-3 rounded-xl ${riskInfo.bg} border border-${riskInfo.color.split('-')[1]}-500/30`}>
                <div className="flex items-center gap-2">
                  <Shield className={`w-4 h-4 ${riskInfo.color}`} />
                  <div>
                    <p className="text-xs text-slate-400">Risk Level</p>
                    <p className={`text-sm font-medium ${riskInfo.color}`}>{riskInfo.level}</p>
                  </div>
                </div>
              </div>

              {/* AI Analysis */}
              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <div className="flex items-start gap-2">
                  <BarChart3 className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Market Analysis</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{signal.reason}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-6 text-slate-400">
              <Brain className="w-10 h-10 mx-auto mb-2 opacity-50 animate-pulse" />
              <p className="text-sm">AI is analyzing...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Challenge Rules & Stats */}
      {challenge && (
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" />
              Challenge Rules & Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Trading Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Current Balance</p>
                <p className="text-lg font-bold text-white">{marketType === 'morocco' ? 'MAD ' : '$'}{challenge.current_balance?.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Profit/Loss</p>
                <p className={`text-lg font-bold ${challenge.profit_percent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {challenge.profit_percent >= 0 ? '+' : ''}{challenge.profit_percent?.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Daily Loss Limit */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-slate-400">Daily Loss Limit</p>
                <p className="text-xs font-medium text-slate-300">{dailyLossPercent.toFixed(1)}% / 5%</p>
              </div>
              <Progress value={Math.min(dailyLossPercent, 5) * 20} className="h-2 bg-slate-700" />
            </div>

            {/* Total Loss Limit */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-slate-400">Total Loss Limit</p>
                <p className="text-xs font-medium text-slate-300">{totalLossPercent.toFixed(1)}% / 10%</p>
              </div>
              <Progress value={Math.min(totalLossPercent, 10) * 10} className="h-2 bg-slate-700" />
            </div>

            {/* Profit Target */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-slate-400">Profit Target</p>
                <p className="text-xs font-medium text-slate-300">{challenge.profit_percent?.toFixed(1)}% / 10%</p>
              </div>
              <Progress value={Math.min(Math.max(challenge.profit_percent, 0), 10) * 10} className="h-2 bg-slate-700" />
            </div>

            {/* Rules Alert */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-amber-400 mb-1">Challenge Rules</p>
                  <ul className="text-xs text-slate-300 space-y-1">
                    <li>• Max 5% daily loss</li>
                    <li>• Max 10% total loss</li>
                    <li>• Target 10% profit to pass</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}