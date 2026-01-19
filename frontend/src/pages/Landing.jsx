import React from 'react';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import PricingSection from '../components/landing/PricingSection';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Brain, Shield, Users, BookOpen } from "lucide-react";
import { useLanguage } from '../components/LanguageProvider';

export default function Landing() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <HeroSection />
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="pricing">
        <PricingSection />
      </div>
      
      {/* CTA Section */}
      <section id="about" className="py-24 bg-slate-100 dark:bg-slate-950 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Ready to Start Your
              <span className="text-emerald-400"> Trading Journey?</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
              Join thousands of traders who are already using TradeSense AI to make smarter decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Pricing")}>
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg rounded-xl">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to={createPageUrl("Dashboard")}>
                <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 px-8 py-6 text-lg rounded-xl">
                  View Demo Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">TradeSense AI</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                The first AI-assisted prop trading firm for Africa.
              </p>
            </div>
            
            <div>
              <h4 className="text-slate-900 dark:text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm">
                <li><Link to={createPageUrl("Dashboard")} className="hover:text-emerald-400">{t('nav.dashboard')}</Link></li>
                <li><Link to={createPageUrl("Pricing")} className="hover:text-emerald-400">{t('nav.pricing')}</Link></li>
                <li><Link to={createPageUrl("Leaderboard")} className="hover:text-emerald-400">{t('nav.leaderboard')}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-slate-900 dark:text-white font-semibold mb-4">Learn</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm">
                <li><Link to={createPageUrl("MasterClass")} className="hover:text-emerald-400">{t('nav.masterclass')}</Link></li>
                <li><Link to={createPageUrl("News")} className="hover:text-emerald-400">{t('nav.news')}</Link></li>
                <li><Link to={createPageUrl("Community")} className="hover:text-emerald-400">{t('nav.community')}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-slate-900 dark:text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm">
                <li><a href="#" className="hover:text-emerald-400">Contact Us</a></li>
                <li><a href="#" className="hover:text-emerald-400">FAQ</a></li>
                <li><a href="#" className="hover:text-emerald-400">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 dark:border-slate-800 pt-8 text-center text-slate-600 dark:text-slate-500 text-sm">
            © 2024 TradeSense AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}