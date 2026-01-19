import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function TradingChart({ symbol, data, isLoading, marketType }) {
  const chartContainerRef = useRef(null);
  const [timeframe, setTimeframe] = useState('1D');
  const currencySymbol = marketType === 'morocco' ? 'MAD ' : '$';

  useEffect(() => {
    if (!chartContainerRef.current || isLoading || !data || data.length === 0) return;

    // Clear previous content
    chartContainerRef.current.innerHTML = '';

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = chartContainerRef.current.clientWidth;
    canvas.height = 300;
    chartContainerRef.current.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;

    // Get price range
    const prices = data.map(d => d.close);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.1)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');

    // Calculate points
    const points = data.map((d, i) => ({
      x: padding + (i / (data.length - 1)) * (width - padding * 2),
      y: height - padding - ((d.close - minPrice) / priceRange) * (height - padding * 2)
    }));

    // Draw fill
    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Y axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 4; i++) {
      const price = minPrice + (priceRange * i / 4);
      const y = height - padding - (i / 4) * (height - padding * 2);
      ctx.fillText(price.toFixed(2), padding - 10, y + 4);
      
      // Grid line
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw current price marker
    const lastPoint = points[points.length - 1];
    ctx.beginPath();
    ctx.arc(lastPoint.x, lastPoint.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lastPoint.x, lastPoint.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

  }, [data, isLoading]);

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-white text-lg">{symbol}</CardTitle>
          {data && data.length > 0 && (
            <p className="text-2xl font-bold text-emerald-400">
              {currencySymbol}{data[data.length - 1]?.close?.toFixed(2)}
            </p>
          )}
        </div>
        <div className="flex gap-1">
          {['1D', '1W', '1M'].map(tf => (
            <Button
              key={tf}
              size="sm"
              variant={timeframe === tf ? 'default' : 'ghost'}
              className={timeframe === tf ? 'bg-emerald-500 hover:bg-emerald-600' : 'text-slate-400'}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          </div>
        ) : (
          <div ref={chartContainerRef} className="h-[300px]" />
        )}
      </CardContent>
    </Card>
  );
}