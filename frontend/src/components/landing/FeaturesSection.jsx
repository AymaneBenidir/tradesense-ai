import React from 'react';
import { motion } from "framer-motion";
import { 
  Brain, Newspaper, MessageCircle, GraduationCap, 
  TrendingUp, Shield, Zap, BarChart3, 
  Users, BookOpen, Trophy, Globe
} from "lucide-react";
import { useLanguage } from '../LanguageProvider';

export default function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Brain,
      titleKey: "features.ai.title",
      descKey: "features.ai.desc",
      color: "emerald",
      highlights: ["Real-time signals", "Personal trading plans", "Risk detection alerts"]
    },
    {
      icon: Newspaper,
      titleKey: "features.news.title",
      descKey: "features.news.desc",
      color: "cyan",
      highlights: ["Real-time updates", "AI summaries", "Event alerts"]
    },
    {
      icon: MessageCircle,
      titleKey: "features.community.title",
      descKey: "features.community.desc",
      color: "violet",
      highlights: ["Chat & network", "Strategy sharing", "Expert insights"]
    },
    {
      icon: GraduationCap,
      titleKey: "features.masterclass.title",
      descKey: "features.masterclass.desc",
      color: "amber",
      highlights: ["All skill levels", "Live webinars", "Practical challenges"]
    }
  ];

const colorClasses = {
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    dot: "bg-emerald-400"
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    dot: "bg-cyan-400"
  },
  violet: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    text: "text-violet-400",
    dot: "bg-violet-400"
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    dot: "bg-amber-400"
  }
};

  return (
    <section className="py-24 bg-slate-100 dark:bg-slate-950 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-100 via-slate-50/50 to-slate-100 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {t('features.heading')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            {t('features.subheading')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
              >
                <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${colors.text}`} />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{t(feature.titleKey)}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{t(feature.descKey)}</p>
                
                <div className="space-y-2">
                  {feature.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 ${colors.dot} rounded-full`} />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{highlight}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-3xl p-8 md:p-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            {t('features.why.title')}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'features.why.1',
              'features.why.2',
              'features.why.3',
              'features.why.4',
              'features.why.5',
              'features.why.6'
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-slate-700 dark:text-slate-300">{t(item)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}