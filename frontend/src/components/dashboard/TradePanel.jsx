import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";

export default function TradePanel({ 
  symbol, 
  currentPrice, 
  onTrade, 
  isLoading,
  balance,
  marketType
}) {
  const isMoroccan = marketType === 'morocco';
  const currencySymbol = isMoroccan ? 'MAD ' : '$';
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState('market');

  const totalValue = quantity * (currentPrice || 0);
  const canAfford = totalValue <= balance;

  const handleTrade = (type) => {
    if (!canAfford && type === 'buy') return;
    onTrade({
      symbol,
      type,
      quantity: parseFloat(quantity),
      price: currentPrice
    });
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Trade {symbol}</span>
          <span className="text-emerald-400 text-lg">{currencySymbol}{currentPrice?.toFixed(2) || '0.00'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="market" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger value="market" className="data-[state=active]:bg-emerald-500">Market</TabsTrigger>
            <TabsTrigger value="limit" className="data-[state=active]:bg-emerald-500">Limit</TabsTrigger>
          </TabsList>
          
          <TabsContent value="market" className="space-y-4 mt-4">
            <div>
              <Label className="text-slate-400">Quantity</Label>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white mt-1"
              />
            </div>

            <div className="p-3 bg-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Price</span>
                <span className="text-white">{currencySymbol}{currentPrice?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Quantity</span>
                <span className="text-white">{quantity}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-slate-700 pt-2">
                <span className="text-slate-400">Total</span>
                <span className={`font-bold ${canAfford ? 'text-white' : 'text-red-400'}`}>
                  {currencySymbol}{totalValue.toFixed(2)}
                </span>
              </div>
            </div>

            {!canAfford && (
              <p className="text-red-400 text-sm text-center">Insufficient balance</p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleTrade('buy')}
                disabled={isLoading || !canAfford || !currentPrice}
                className="bg-emerald-500 hover:bg-emerald-600 text-white py-6"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Buy
                  </>
                )}
              </Button>
              <Button
                onClick={() => handleTrade('sell')}
                disabled={isLoading || !currentPrice}
                className="bg-red-500 hover:bg-red-600 text-white py-6"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <TrendingDown className="w-5 h-5 mr-2" />
                    Sell
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="limit" className="mt-4">
            <div className="text-center py-8 text-slate-400">
              <p>Limit orders coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}