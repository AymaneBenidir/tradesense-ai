import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard, Bitcoin, Check, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Checkout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cmi');
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const tier = urlParams.get('tier') || 'starter';
  const price = parseInt(urlParams.get('price')) || 200;
  const balance = parseInt(urlParams.get('balance')) || 5000;

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (e) {
      base44.auth.redirectToLogin(window.location.href);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Create the challenge
    await base44.entities.Challenge.create({
      user_email: user.email,
      tier: tier,
      initial_balance: balance,
      current_balance: balance,
      highest_balance: balance,
      daily_start_balance: balance,
      status: 'active',
      profit_percent: 0,
      payment_method: paymentMethod,
      amount_paid: price
    });

    setSuccess(true);
    setProcessing(false);

    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      navigate(createPageUrl('Dashboard'));
    }, 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2 text-center">Complete Your Purchase</h1>
          <p className="text-slate-400 text-center mb-8">
            You're about to start your {tier.charAt(0).toUpperCase() + tier.slice(1)} Challenge
          </p>

          {success ? (
            <Card className="bg-slate-900 border-emerald-500/50">
              <CardContent className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                <p className="text-slate-400 mb-4">Your challenge has been activated.</p>
                <p className="text-emerald-400">Redirecting to dashboard...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {/* Order Summary */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Challenge Tier</span>
                      <span className="text-white font-medium capitalize">{tier}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Virtual Balance</span>
                      <span className="text-emerald-400 font-medium">${balance.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
                      <span className="text-white font-medium">Total</span>
                      <span className="text-2xl font-bold text-white">{price} DH</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    <div className={`flex items-center space-x-4 p-4 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'cmi' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 hover:border-slate-600'
                    }`}>
                      <RadioGroupItem value="cmi" id="cmi" className="border-emerald-500" />
                      <Label htmlFor="cmi" className="flex items-center gap-3 cursor-pointer flex-1">
                        <CreditCard className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-white font-medium">Pay with CMI</p>
                          <p className="text-sm text-slate-400">Credit/Debit Card</p>
                        </div>
                      </Label>
                    </div>

                    <div className={`flex items-center space-x-4 p-4 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'crypto' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 hover:border-slate-600'
                    }`}>
                      <RadioGroupItem value="crypto" id="crypto" className="border-emerald-500" />
                      <Label htmlFor="crypto" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Bitcoin className="w-5 h-5 text-orange-400" />
                        <div>
                          <p className="text-white font-medium">Pay with Crypto</p>
                          <p className="text-sm text-slate-400">BTC, ETH, USDT</p>
                        </div>
                      </Label>
                    </div>

                    <div className={`flex items-center space-x-4 p-4 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'paypal' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 hover:border-slate-600'
                    }`}>
                      <RadioGroupItem value="paypal" id="paypal" className="border-emerald-500" />
                      <Label htmlFor="paypal" className="flex items-center gap-3 cursor-pointer flex-1">
                        <div className="w-5 h-5 bg-blue-500 rounded text-white text-xs font-bold flex items-center justify-center">P</div>
                        <div>
                          <p className="text-white font-medium">PayPal</p>
                          <p className="text-sm text-slate-400">Pay securely with PayPal</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                <Shield className="w-4 h-4" />
                <span>Your payment is secure and encrypted</span>
              </div>

              {/* Pay Button */}
              <Button 
                onClick={handlePayment}
                disabled={processing}
                className="w-full py-6 text-lg bg-emerald-500 hover:bg-emerald-600 rounded-xl"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  `Pay ${price} DH`
                )}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}