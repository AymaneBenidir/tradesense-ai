import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, AlertTriangle, TrendingUp, Loader2, Bitcoin, TrendingUpIcon, Globe, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useLanguage } from '../components/LanguageProvider';
import { motion, AnimatePresence } from "framer-motion";
import TradingChart from '../components/dashboard/TradingChart';
import AISignalsPanel from '../components/dashboard/AISignalsPanel';
import TradePanel from '../components/dashboard/TradePanel';
import AccountStats from '../components/dashboard/AccountStats';

// Trading symbols by market
const SYMBOLS = {
  crypto: [
    { symbol: 'BTCUSD', name: 'Bitcoin' },
    { symbol: 'ETHUSD', name: 'Ethereum' },
    { symbol: 'SOLUSD', name: 'Solana' },
    { symbol: 'BNBUSD', name: 'Binance Coin' },
    { symbol: 'XRPUSD', name: 'Ripple' },
    { symbol: 'ADAUSD', name: 'Cardano' },
    { symbol: 'DOGEUSD', name: 'Dogecoin' },
    { symbol: 'MATICUSD', name: 'Polygon' },
  ],
  us_stock: [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'NVDA', name: 'NVIDIA' },
  ],
  morocco: [
    { symbol: 'IAM', name: 'Maroc Telecom' },
    { symbol: 'ATW', name: 'Attijariwafa Bank' },
    { symbol: 'BCP', name: 'Banque Centrale Pop.' },
    { symbol: 'LBV', name: 'Label Vie' },
    { symbol: 'CDM', name: 'Crédit du Maroc' },
  ]
};

export default function Dashboard() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSD');
  const [marketType, setMarketType] = useState('crypto');
  const [priceData, setPriceData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [changePercent, setChangePercent] = useState(0);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [aiSignals, setAiSignals] = useState(null);
  const [isLoadingSignals, setIsLoadingSignals] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (e) {
      base44.auth.redirectToLogin();
    }
  };

  // Fetch user's active challenge
  const { data: challenges, isLoading: loadingChallenges } = useQuery({
    queryKey: ['challenges', user?.email],
    queryFn: () => base44.entities.Challenge.filter({ user_email: user?.email, status: 'active' }),
    enabled: !!user?.email,
  });

  const activeChallenge = challenges?.[0];

  // Fetch market data from backend
  const fetchMarketData = useCallback(async () => {
    setIsLoadingPrice(true);
    
    try {
      const response = await base44.functions.invoke('fetchMarketData', {
        symbol: selectedSymbol,
        market: marketType
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      const { priceData: data, currentPrice: price, changePercent: change } = response.data;
      
      setPriceData(data);
      setCurrentPrice(price);
      setChangePercent(change);
      setIsLoadingPrice(false);
    } catch (error) {
      console.error('Error fetching market data:', error);
      toast.error('Failed to fetch market data');
      setIsLoadingPrice(false);
    }
  }, [selectedSymbol, marketType]);

  // Auto-refresh prices every 30 seconds
  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  // Update symbol when market changes
  useEffect(() => {
    const firstSymbol = SYMBOLS[marketType][0];
    if (firstSymbol) {
      setSelectedSymbol(firstSymbol.symbol);
    }
  }, [marketType]);

  // Fetch AI signals
  const fetchAISignals = async () => {
    setIsLoadingSignals(true);

    // Generate AI signal for the selected symbol only
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a trading signal for ${selectedSymbol}. 
        Provide a signal (BUY, SELL, or HOLD) and a brief reason (max 20 words).
        Consider current market conditions and technical analysis.
        Market type: ${marketType}`,
        response_json_schema: {
          type: "object",
          properties: {
            signal: { type: "string", enum: ["BUY", "SELL", "HOLD"] },
            reason: { type: "string" }
          }
        }
      });

      setAiSignals(response);
    } catch (e) {
      console.error('Error fetching AI signals:', e);
      // Fallback signal based on selected symbol
      const fallbackSignals = {
        crypto: { signal: 'HOLD', reason: 'Consolidation phase, monitoring key support levels' },
        us_stock: { signal: 'BUY', reason: 'Strong fundamentals and bullish momentum detected' },
        morocco: { signal: 'BUY', reason: 'Undervalued with strong fundamentals and growth potential' }
      };
      setAiSignals(fallbackSignals[marketType] || fallbackSignals.crypto);
    }

    setIsLoadingSignals(false);
  };

  useEffect(() => {
    fetchAISignals();
  }, [selectedSymbol, marketType]);

  // Execute trade
  const tradeMutation = useMutation({
    mutationFn: async (tradeData) => {
      // Create trade record
      const trade = await base44.entities.Trade.create({
        challenge_id: activeChallenge.id,
        user_email: user.email,
        symbol: tradeData.symbol,
        type: tradeData.type,
        quantity: tradeData.quantity,
        entry_price: tradeData.price,
        status: 'open'
      });

      // Update challenge balance
      const tradeValue = tradeData.quantity * tradeData.price;
      let newBalance = activeChallenge.current_balance;
      
      if (tradeData.type === 'buy') {
        newBalance -= tradeValue;
      } else {
        // Simulate instant P/L for sell
        const pnl = (Math.random() - 0.4) * tradeValue * 0.1;
        newBalance += tradeValue + pnl;
      }

      // Check challenge rules
      const dailyLossPercent = ((activeChallenge.daily_start_balance - newBalance) / activeChallenge.daily_start_balance) * 100;
      const totalLossPercent = ((activeChallenge.initial_balance - newBalance) / activeChallenge.initial_balance) * 100;
      const profitPercent = ((newBalance - activeChallenge.initial_balance) / activeChallenge.initial_balance) * 100;

      let newStatus = 'active';
      let failReason = null;

      if (dailyLossPercent >= 5) {
        newStatus = 'failed';
        failReason = 'Max daily loss exceeded (5%)';
      } else if (totalLossPercent >= 10) {
        newStatus = 'failed';
        failReason = 'Max total loss exceeded (10%)';
      } else if (profitPercent >= 10) {
        newStatus = 'passed';
      }

      await base44.entities.Challenge.update(activeChallenge.id, {
        current_balance: newBalance,
        highest_balance: Math.max(activeChallenge.highest_balance, newBalance),
        profit_percent: profitPercent,
        status: newStatus,
        fail_reason: failReason
      });

      return { trade, newStatus, failReason };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['challenges']);
      
      if (data.newStatus === 'failed') {
        toast.error(`Challenge Failed: ${data.failReason}`, {
          duration: 10000,
          description: "Your challenge has been terminated. Review the rules and try again.",
        });
      } else if (data.newStatus === 'passed') {
        toast.success('🎉 Congratulations! You passed the challenge!', {
          duration: 10000,
          description: "You've reached the 10% profit target. You're now eligible for funding!",
        });
      } else {
        toast.success('Trade executed successfully');
      }
    },
    onError: (error) => {
      toast.error('Failed to execute trade');
    }
  });

  const handleTrade = (tradeData) => {
    if (!activeChallenge) {
      toast.error('No active challenge. Please start a challenge first.');
      return;
    }
    tradeMutation.mutate(tradeData);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Trading Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">Welcome back, {user.full_name || 'Trader'}</p>
          </div>

          {!activeChallenge && !loadingChallenges && (
            <Link to={createPageUrl('Pricing')}>
              <Button className="bg-emerald-500 hover:bg-emerald-600">
                Start a Challenge
              </Button>
            </Link>
          )}
        </div>

        {/* Account Stats */}
        <AccountStats challenge={activeChallenge} />

        {/* Challenge Status Alerts */}
        <AnimatePresence>
          {activeChallenge?.status === 'failed' && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-gradient-to-r from-red-500/10 to-red-600/10 border-2 border-red-500/40 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-400 mb-1">Challenge Failed</h3>
                  <p className="text-slate-300 dark:text-slate-400 text-sm mb-3">
                    {activeChallenge.fail_reason}
                  </p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mb-4">
                    Don't give up! Every great trader has faced setbacks. Learn from this experience and come back stronger.
                  </p>
                  <Link to={createPageUrl('Pricing')}>
                    <Button className="bg-red-500 hover:bg-red-600 text-white">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Start New Challenge
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {activeChallenge?.status === 'passed' && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-gradient-to-r from-emerald-500/10 to-green-600/10 border-2 border-emerald-500/40 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-emerald-400 mb-1">🎉 Congratulations! You're Funded!</h3>
                  <p className="text-slate-300 dark:text-slate-400 text-sm mb-3">
                    You've successfully completed the challenge and proven your trading skills.
                  </p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs">
                    You've reached the 10% profit target! You're now eligible for funding. Our team will contact you soon with next steps.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Market Selection */}
        <div className="flex flex-wrap items-center gap-4">
          <Tabs value={marketType} onValueChange={setMarketType} className="w-auto">
            <TabsList className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <TabsTrigger value="crypto" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white gap-2">
                <Bitcoin className="w-4 h-4" />
                {t('market.crypto')}
              </TabsTrigger>
              <TabsTrigger value="us_stock" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white gap-2">
                <TrendingUpIcon className="w-4 h-4" />
                {t('market.usstock')}
              </TabsTrigger>
              <TabsTrigger value="morocco" className="data-[state=active]:bg-green-500 data-[state=active]:text-white gap-2">
                <Globe className="w-4 h-4" />
                {t('market.morocco')}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
            <SelectTrigger className="w-[220px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              {SYMBOLS[marketType].map((s) => (
                <SelectItem key={s.symbol} value={s.symbol} className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700">
                  {s.symbol} - {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {currentPrice && (
            <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {marketType === 'morocco' ? 'MAD ' : '$'}{currentPrice.toFixed(2)}
              </div>
              <div className={`text-sm font-medium ${changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
              </div>
            </div>
          )}

          <Button 
            variant="ghost" 
            size="icon"
            onClick={fetchMarketData}
            disabled={isLoadingPrice}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <RefreshCw className={`w-5 h-5 ${isLoadingPrice ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Trading Interface */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <TradingChart 
                symbol={selectedSymbol} 
                data={priceData} 
                isLoading={isLoadingPrice}
                marketType={marketType}
              />

              <TradePanel
                symbol={selectedSymbol}
                currentPrice={currentPrice}
                onTrade={handleTrade}
                isLoading={tradeMutation.isPending}
                balance={activeChallenge?.current_balance || 0}
                marketType={marketType}
              />
            </div>

            <div>
              <AISignalsPanel 
                signal={aiSignals}
                isLoading={isLoadingSignals}
                onRefresh={fetchAISignals}
                challenge={activeChallenge}
                marketType={marketType}
              />
            </div>
          </div>
      </div>
    </div>
  );
}