import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, Trophy } from "lucide-react";

export default function AccountStats({ challenge }) {
  if (!challenge) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-20 mb-2"></div>
                <div className="h-6 bg-slate-700 rounded w-24"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const profitLoss = challenge.current_balance - challenge.initial_balance;
  const profitPercent = ((profitLoss / challenge.initial_balance) * 100);
  const dailyLoss = challenge.daily_start_balance - challenge.current_balance;
  const dailyLossPercent = (dailyLoss / challenge.daily_start_balance) * 100;
  const totalLossPercent = ((challenge.initial_balance - challenge.current_balance) / challenge.initial_balance) * 100;
  
  // Progress towards targets
  const profitProgress = Math.min(Math.max(profitPercent / 10 * 100, 0), 100); // 10% target
  const dailyLossProgress = Math.min(Math.max(dailyLossPercent / 5 * 100, 0), 100); // 5% limit
  const totalLossProgress = Math.min(Math.max(totalLossPercent / 10 * 100, 0), 100); // 10% limit

  const stats = [
    {
      label: 'Balance',
      value: `$${challenge.current_balance?.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10'
    },
    {
      label: 'Profit/Loss',
      value: `${profitLoss >= 0 ? '+' : ''}$${profitLoss.toFixed(2)}`,
      subValue: `${profitPercent >= 0 ? '+' : ''}${profitPercent.toFixed(2)}%`,
      icon: profitLoss >= 0 ? TrendingUp : TrendingDown,
      color: profitLoss >= 0 ? 'text-emerald-400' : 'text-red-400',
      bgColor: profitLoss >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'
    },
    {
      label: 'Daily Loss',
      value: `${dailyLossPercent.toFixed(2)}%`,
      subValue: 'of 5% limit',
      icon: AlertTriangle,
      color: dailyLossPercent > 3 ? 'text-red-400' : 'text-amber-400',
      bgColor: dailyLossPercent > 3 ? 'bg-red-500/10' : 'bg-amber-500/10',
      progress: dailyLossProgress,
      progressColor: dailyLossPercent > 3 ? 'bg-red-500' : 'bg-amber-500'
    },
    {
      label: 'Status',
      value: challenge.status?.toUpperCase(),
      icon: Trophy,
      color: challenge.status === 'passed' ? 'text-emerald-400' : challenge.status === 'failed' ? 'text-red-400' : 'text-blue-400',
      bgColor: challenge.status === 'passed' ? 'bg-emerald-500/10' : challenge.status === 'failed' ? 'bg-red-500/10' : 'bg-blue-500/10'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                  <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                  {stat.subValue && (
                    <p className="text-xs text-slate-500">{stat.subValue}</p>
                  )}
                </div>
              </div>
              {stat.progress !== undefined && (
                <div className="mt-2">
                  <Progress value={stat.progress} className="h-1 bg-slate-700" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Bars */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Profit Target (10%)</span>
                <span className="text-emerald-400">{profitPercent.toFixed(2)}%</span>
              </div>
              <Progress value={profitProgress} className="h-2 bg-slate-700" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Daily Loss Limit (5%)</span>
                <span className={dailyLossPercent > 3 ? 'text-red-400' : 'text-amber-400'}>
                  {dailyLossPercent.toFixed(2)}%
                </span>
              </div>
              <Progress value={dailyLossProgress} className="h-2 bg-slate-700" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Total Loss Limit (10%)</span>
                <span className={totalLossPercent > 7 ? 'text-red-400' : 'text-amber-400'}>
                  {totalLossPercent.toFixed(2)}%
                </span>
              </div>
              <Progress value={totalLossProgress} className="h-2 bg-slate-700" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}