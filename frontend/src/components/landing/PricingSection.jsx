import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useLanguage } from '../LanguageProvider';

export default function PricingSection() {
  const { t } = useLanguage();
  
  const tiers = [
    {
      name: "Starter",
      price: 200,
      balance: 5000,
      icon: Zap,
      featureKeys: [
        'tier.starter.feature1',
        'tier.starter.feature2',
        'tier.starter.feature3',
        'tier.starter.feature4',
        'tier.starter.feature5',
        'tier.starter.feature6',
        'tier.starter.feature7'
      ],
      popular: false,
      color: "slate"
    },
    {
      name: "Pro",
      price: 500,
      balance: 15000,
      icon: Star,
      featureKeys: [
        'tier.pro.feature1',
        'tier.pro.feature2',
        'tier.pro.feature3',
        'tier.pro.feature4',
        'tier.pro.feature5',
        'tier.pro.feature6',
        'tier.pro.feature7',
        'tier.pro.feature8'
      ],
      popular: true,
      color: "emerald"
    },
    {
      name: "Elite",
      price: 1000,
      balance: 50000,
      icon: Crown,
      featureKeys: [
        'tier.elite.feature1',
        'tier.elite.feature2',
        'tier.elite.feature3',
        'tier.elite.feature4',
        'tier.elite.feature5',
        'tier.elite.feature6',
        'tier.elite.feature7',
        'tier.elite.feature8',
        'tier.elite.feature9'
      ],
      popular: false,
      color: "amber"
    }
  ];
  return (
    <section className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {t('pricing.heading')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            {t('pricing.subheading')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                tier.popular 
                  ? 'bg-gradient-to-b from-emerald-500/20 to-white dark:to-slate-900 border-2 border-emerald-500/50' 
                  : 'bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-white text-sm font-medium rounded-full">
                  {t('pricing.popular')}
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                  tier.popular ? 'bg-emerald-500/20' : 'bg-slate-700/50'
                }`}>
                  <tier.icon className={`w-8 h-8 ${tier.popular ? 'text-emerald-400' : 'text-slate-400'}`} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-slate-900 dark:text-white">{tier.price}</span>
                  <span className="text-slate-600 dark:text-slate-400">DH</span>
                </div>
                <p className="text-emerald-400 text-sm mt-2">
                  ${tier.balance.toLocaleString()} {t('pricing.balance')}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.featureKeys.map((featureKey, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      tier.popular ? 'bg-emerald-500/20' : 'bg-slate-700'
                    }`}>
                      <Check className={`w-3 h-3 ${tier.popular ? 'text-emerald-400' : 'text-slate-400'}`} />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 text-sm">{t(featureKey)}</span>
                  </li>
                ))}
              </ul>

              <Link to={createPageUrl("Checkout") + `?tier=${tier.name.toLowerCase()}&price=${tier.price}&balance=${tier.balance}`}>
                <Button 
                  className={`w-full py-6 rounded-xl text-lg font-medium ${
                    tier.popular 
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                >
                  {t('pricing.startchallenge').replace('{tier}', tier.name)}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Challenge Rules */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-2xl p-8"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">{t('pricing.rules.title')}</h3>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-red-400 mb-2">5%</div>
              <div className="text-slate-400 text-sm">{t('pricing.rules.daily')}</div>
              <p className="text-xs text-slate-500 mt-1">{t('pricing.rules.daily.desc')}</p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-red-400 mb-2">10%</div>
              <div className="text-slate-400 text-sm">{t('pricing.rules.total')}</div>
              <p className="text-xs text-slate-500 mt-1">{t('pricing.rules.total.desc')}</p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-emerald-400 mb-2">+10%</div>
              <div className="text-slate-400 text-sm">{t('pricing.rules.profit')}</div>
              <p className="text-xs text-slate-500 mt-1">{t('pricing.rules.profit.desc')}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}