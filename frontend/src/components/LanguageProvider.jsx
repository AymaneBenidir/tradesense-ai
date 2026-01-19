import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: () => {},
  isRTL: false,
});

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.leaderboard': 'Leaderboard',
    'nav.news': 'News',
    'nav.community': 'Community',
    'nav.masterclass': 'MasterClass',
    'nav.pricing': 'Pricing',
    'nav.admin': 'Admin Panel',
    'nav.logout': 'Logout',
    'nav.signin': 'Sign In',
    'nav.getstarted': 'Get Started',
    
    // Landing Page
    'landing.tagline': 'The First AI-Assisted Prop Firm for Africa',
    'landing.title1': 'Trade Smarter with',
    'landing.title2': 'TradeSense AI',
    'landing.subtitle': 'Combine real-time AI analysis, smart trading tools, live news, and premium education into one powerful ecosystem. Get funded and trade with confidence.',
    'landing.startchallenge': 'Start Your Challenge',
    'landing.exploremasterclass': 'Explore MasterClass',
    
    // Features
    'features.ai.title': 'AI-Powered Trading',
    'features.ai.desc': 'Get instant Buy/Sell/Stop signals, personalized trading plans, and smart risk filtering - all powered by advanced AI.',
    'features.news.title': 'Live News Hub',
    'features.news.desc': 'Stay ahead with real-time financial news, AI-generated summaries, and economic event alerts.',
    'features.community.title': 'Community Zone',
    'features.community.desc': 'Connect with traders, share strategies, join themed groups, and learn from experts.',
    'features.masterclass.title': 'MasterClass Academy',
    'features.masterclass.desc': 'Access beginner to advanced courses, live webinars, and AI-assisted learning paths.',
    
    // Dashboard
    'dashboard.title': 'Trading Dashboard',
    'dashboard.welcome': 'Welcome back',
    'dashboard.balance': 'Balance',
    'dashboard.profitloss': 'Profit/Loss',
    'dashboard.dailyloss': 'Daily Loss',
    'dashboard.status': 'Status',
    'dashboard.buy': 'Buy',
    'dashboard.sell': 'Sell',
    'dashboard.trade': 'Trade',
    'dashboard.quantity': 'Quantity',
    'dashboard.price': 'Price',
    'dashboard.total': 'Total',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.all': 'All',
    
    // Landing Stats
    'stats.funded': 'Funded Capital',
    'stats.traders': 'Active Traders',
    'stats.success': 'Success Rate',
    
    // Landing Features Bottom
    'feature.signals': 'AI Trading Signals',
    'feature.signals.desc': 'Buy/Sell/Stop signals powered by advanced AI',
    'feature.protection': 'Risk Protection',
    'feature.protection.desc': 'Real-time alerts when danger approaches',
    'feature.execution': 'Instant Execution',
    'feature.execution.desc': 'Trade on live markets with real-time data',
    
    // Features Section
    'features.heading': 'Everything You Need to Succeed',
    'features.subheading': 'One platform for trading, learning, and community. Make smarter decisions, faster.',
    'features.why.title': 'Why Traders Choose TradeSense AI',
    'features.why.1': 'One platform for trading, learning, and community',
    'features.why.2': 'AI signals and risk alerts',
    'features.why.3': 'News + social + MasterClass in a single interface',
    'features.why.4': 'Ideal for beginners and experienced traders',
    'features.why.5': 'Helps you make smarter decisions, faster',
    'features.why.6': 'Get funded with our Trading Challenge',
    
    // Markets
    'market.crypto': 'Crypto Market',
    'market.usstock': 'US Stock Market',
    'market.morocco': 'Moroccan Market',
    
    // Pricing
    'pricing.heading': 'Choose Your Challenge',
    'pricing.subheading': 'Pay once, prove your skills, and get funded. No recurring fees.',
    'pricing.popular': 'Most Popular',
    'pricing.balance': 'Virtual Balance',
    'pricing.startchallenge': 'Start {tier} Challenge',
    'pricing.rules.title': 'Challenge Rules',
    'pricing.rules.daily': 'Max Daily Loss',
    'pricing.rules.daily.desc': 'Lose more than 5% in one day = Failed',
    'pricing.rules.total': 'Max Total Loss',
    'pricing.rules.total.desc': 'Total drawdown exceeds 10% = Failed',
    'pricing.rules.profit': 'Profit Target',
    'pricing.rules.profit.desc': 'Reach 10% profit = Funded!',
    
    // Tier features
    'tier.starter.feature1': '$5,000 Virtual Balance',
    'tier.starter.feature2': '5% Max Daily Loss Limit',
    'tier.starter.feature3': '10% Max Total Loss Limit',
    'tier.starter.feature4': '10% Profit Target',
    'tier.starter.feature5': 'Basic AI Signals',
    'tier.starter.feature6': 'Community Access',
    'tier.starter.feature7': 'Email Support',
    
    'tier.pro.feature1': '$15,000 Virtual Balance',
    'tier.pro.feature2': '5% Max Daily Loss Limit',
    'tier.pro.feature3': '10% Max Total Loss Limit',
    'tier.pro.feature4': '10% Profit Target',
    'tier.pro.feature5': 'Advanced AI Signals',
    'tier.pro.feature6': 'Priority Community Access',
    'tier.pro.feature7': 'MasterClass Access',
    'tier.pro.feature8': '24/7 Support',
    
    'tier.elite.feature1': '$50,000 Virtual Balance',
    'tier.elite.feature2': '5% Max Daily Loss Limit',
    'tier.elite.feature3': '10% Max Total Loss Limit',
    'tier.elite.feature4': '10% Profit Target',
    'tier.elite.feature5': 'Premium AI Signals',
    'tier.elite.feature6': 'VIP Community Access',
    'tier.elite.feature7': 'Full MasterClass Access',
    'tier.elite.feature8': 'Personal Trading Coach',
    'tier.elite.feature9': 'Priority Support',
  },
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.leaderboard': 'Classement',
    'nav.news': 'Actualités',
    'nav.community': 'Communauté',
    'nav.masterclass': 'MasterClass',
    'nav.pricing': 'Tarification',
    'nav.admin': 'Panneau Admin',
    'nav.logout': 'Déconnexion',
    'nav.signin': 'Se connecter',
    'nav.getstarted': 'Commencer',
    
    // Landing Page
    'landing.tagline': 'La Plateforme de Trading Nouvelle Génération',
    'landing.title1': 'Tradez Avec',
    'landing.title2': 'TradeSense AI',
    'landing.subtitle': 'TradeSense AI combine des analyses IA en temps réel, des outils de trading intelligents, des actualités en direct, une interaction communautaire et une éducation MasterClass premium dans un écosystème puissant.',
    'landing.startchallenge': 'Commencer Votre Défi',
    'landing.exploremasterclass': 'Explorer MasterClass',
    
    // Features
    'features.ai.title': 'Assistance Trading Propulsée par l\'IA',
    'features.ai.desc': 'Signaux Achat/Vente/Stop directement sur la page de trading. Plans de Trade IA personnalisés pour chaque marché. Alertes de Détection de Risque. Tri Intelligent qui filtre automatiquement les bons trades des risqués.',
    'features.news.title': 'Hub d\'Actualités en Direct',
    'features.news.desc': 'Actualités financières en temps réel. Résumés de marché créés par l\'IA. Alertes d\'événements économiques. Gardez toujours une longueur d\'avance.',
    'features.community.title': 'Zone Communautaire',
    'features.community.desc': 'Discutez avec des amis et Rencontrez de nouveaux traders. Partagez des stratégies et Rejoignez des groupes thématiques. Apprenez des experts. Construit un réseau solide autour de votre croissance.',
    'features.masterclass.title': 'Centre d\'Apprentissage MasterClass',
    'features.masterclass.desc': 'Leçons de trading du débutant à l\'avancé. Analyse technique et fondamentale. Ateliers de gestion des risques. Webinaires en direct avec des experts. Défis pratiques et quiz.',
    
    // Dashboard
    'dashboard.title': 'Tableau de Trading',
    'dashboard.welcome': 'Bon retour',
    'dashboard.balance': 'Solde',
    'dashboard.profitloss': 'Profit/Perte',
    'dashboard.dailyloss': 'Perte Quotidienne',
    'dashboard.status': 'Statut',
    'dashboard.buy': 'Acheter',
    'dashboard.sell': 'Vendre',
    'dashboard.trade': 'Trader',
    'dashboard.quantity': 'Quantité',
    'dashboard.price': 'Prix',
    'dashboard.total': 'Total',
    
    // Common
    'common.loading': 'Chargement...',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.close': 'Fermer',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.all': 'Tout',
    
    // Landing Stats
    'stats.funded': 'Capital Financé',
    'stats.traders': 'Traders Actifs',
    'stats.success': 'Taux de Réussite',
    
    // Landing Features Bottom
    'feature.signals': 'Signaux de Trading IA',
    'feature.signals.desc': 'Signaux Achat/Vente/Stop alimentés par IA avancée',
    'feature.protection': 'Protection des Risques',
    'feature.protection.desc': 'Alertes en temps réel en cas de danger',
    'feature.execution': 'Exécution Instantanée',
    'feature.execution.desc': 'Tradez sur les marchés en direct avec des données en temps réel',
    
    // Features Section
    'features.heading': 'Pourquoi les Traders Choisissent TradeSense AI',
    'features.subheading': 'Tout ce dont vous avez besoin sur une seule plateforme.',
    'features.why.title': 'Avantages Clés',
    'features.why.1': 'Une plateforme unique pour le trading, l\'apprentissage et la communauté',
    'features.why.2': 'Signaux IA et alertes de risque',
    'features.why.3': 'Actualités + social + MasterClass dans une seule interface',
    'features.why.4': 'Idéal pour les débutants et les traders expérimentés',
    'features.why.5': 'Vous aide à prendre des décisions plus intelligentes, plus rapidement',
    'features.why.6': 'Obtenez un financement avec notre Trading Challenge',
    
    // Markets
    'market.crypto': 'Marché Crypto',
    'market.usstock': 'Marché Boursier US',
    'market.morocco': 'Marché Marocain',
    
    // Pricing
    'pricing.heading': 'Choisissez Votre Défi',
    'pricing.subheading': 'Payez une fois, prouvez vos compétences et obtenez un financement. Pas de frais récurrents.',
    'pricing.popular': 'Le Plus Populaire',
    'pricing.balance': 'Solde Virtuel',
    'pricing.startchallenge': 'Commencer le Défi {tier}',
    'pricing.rules.title': 'Règles du Défi',
    'pricing.rules.daily': 'Perte Quotidienne Max',
    'pricing.rules.daily.desc': 'Perdre plus de 5% en un jour = Échec',
    'pricing.rules.total': 'Perte Totale Max',
    'pricing.rules.total.desc': 'Drawdown total dépasse 10% = Échec',
    'pricing.rules.profit': 'Objectif de Profit',
    'pricing.rules.profit.desc': 'Atteindre 10% de profit = Financé!',
    
    // Tier features
    'tier.starter.feature1': 'Solde virtuel de 5 000 $',
    'tier.starter.feature2': 'Limite de perte quotidienne maximale de 5%',
    'tier.starter.feature3': 'Limite de perte totale maximale de 10%',
    'tier.starter.feature4': 'Objectif de profit de 10%',
    'tier.starter.feature5': 'Signaux IA de base',
    'tier.starter.feature6': 'Accès à la communauté',
    'tier.starter.feature7': 'Support par e-mail',
    
    'tier.pro.feature1': 'Solde virtuel de 15 000 $',
    'tier.pro.feature2': 'Limite de perte quotidienne maximale de 5%',
    'tier.pro.feature3': 'Limite de perte totale maximale de 10%',
    'tier.pro.feature4': 'Objectif de profit de 10%',
    'tier.pro.feature5': 'Signaux IA avancés',
    'tier.pro.feature6': 'Accès prioritaire à la communauté',
    'tier.pro.feature7': 'Accès MasterClass',
    'tier.pro.feature8': 'Support 24/7',
    
    'tier.elite.feature1': 'Solde virtuel de 50 000 $',
    'tier.elite.feature2': 'Limite de perte quotidienne maximale de 5%',
    'tier.elite.feature3': 'Limite de perte totale maximale de 10%',
    'tier.elite.feature4': 'Objectif de profit de 10%',
    'tier.elite.feature5': 'Signaux IA premium',
    'tier.elite.feature6': 'Accès VIP à la communauté',
    'tier.elite.feature7': 'Accès complet MasterClass',
    'tier.elite.feature8': 'Coach de trading personnel',
    'tier.elite.feature9': 'Support prioritaire',
  },
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.leaderboard': 'المتصدرين',
    'nav.news': 'الأخبار',
    'nav.community': 'المجتمع',
    'nav.masterclass': 'الدورات التدريبية',
    'nav.pricing': 'الأسعار',
    'nav.admin': 'لوحة المشرف',
    'nav.logout': 'تسجيل الخروج',
    'nav.signin': 'تسجيل الدخول',
    'nav.getstarted': 'ابدأ الآن',
    
    // Landing Page
    'landing.tagline': 'أول شركة تداول بمساعدة الذكاء الاصطناعي في أفريقيا',
    'landing.title1': 'تداول بذكاء مع',
    'landing.title2': 'TradeSense AI',
    'landing.subtitle': 'اجمع بين التحليل الفوري بالذكاء الاصطناعي وأدوات التداول الذكية والأخبار المباشرة والتعليم المتميز في نظام واحد قوي. احصل على التمويل وتداول بثقة.',
    'landing.startchallenge': 'ابدأ التحدي',
    'landing.exploremasterclass': 'استكشف الدورات',
    
    // Features
    'features.ai.title': 'تداول مدعوم بالذكاء الاصطناعي',
    'features.ai.desc': 'احصل على إشارات فورية للشراء/البيع/الإيقاف وخطط تداول شخصية وفلترة ذكية للمخاطر - كل ذلك مدعوم بالذكاء الاصطناعي المتقدم.',
    'features.news.title': 'مركز الأخبار المباشرة',
    'features.news.desc': 'ابق على اطلاع بالأخبار المالية الفورية والملخصات المولدة بالذكاء الاصطناعي وتنبيهات الأحداث الاقتصادية.',
    'features.community.title': 'منطقة المجتمع',
    'features.community.desc': 'تواصل مع المتداولين وشارك الاستراتيجيات وانضم إلى المجموعات وتعلم من الخبراء.',
    'features.masterclass.title': 'أكاديمية الدورات المتقدمة',
    'features.masterclass.desc': 'وصول لدورات من المبتدئين إلى المتقدمين وندوات مباشرة ومسارات تعلم بمساعدة الذكاء الاصطناعي.',
    
    // Dashboard
    'dashboard.title': 'لوحة التداول',
    'dashboard.welcome': 'مرحباً بعودتك',
    'dashboard.balance': 'الرصيد',
    'dashboard.profitloss': 'الربح/الخسارة',
    'dashboard.dailyloss': 'الخسارة اليومية',
    'dashboard.status': 'الحالة',
    'dashboard.buy': 'شراء',
    'dashboard.sell': 'بيع',
    'dashboard.trade': 'تداول',
    'dashboard.quantity': 'الكمية',
    'dashboard.price': 'السعر',
    'dashboard.total': 'المجموع',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.close': 'إغلاق',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.all': 'الكل',
    
    // Landing Stats
    'stats.funded': 'رأس المال الممول',
    'stats.traders': 'المتداولون النشطون',
    'stats.success': 'معدل النجاح',
    
    // Landing Features Bottom
    'feature.signals': 'إشارات التداول بالذكاء الاصطناعي',
    'feature.signals.desc': 'إشارات شراء/بيع/إيقاف مدعومة بالذكاء الاصطناعي المتقدم',
    'feature.protection': 'حماية المخاطر',
    'feature.protection.desc': 'تنبيهات فورية عند اقتراب الخطر',
    'feature.execution': 'التنفيذ الفوري',
    'feature.execution.desc': 'تداول في الأسواق المباشرة بالبيانات الفورية',
    
    // Features Section
    'features.heading': 'كل ما تحتاجه للنجاح',
    'features.subheading': 'منصة واحدة للتداول والتعلم والمجتمع. اتخذ قرارات أذكى وأسرع.',
    'features.why.title': 'لماذا يختار المتداولون TradeSense AI',
    'features.why.1': 'منصة واحدة للتداول والتعلم والمجتمع',
    'features.why.2': 'إشارات الذكاء الاصطناعي وتنبيهات المخاطر',
    'features.why.3': 'الأخبار + التواصل الاجتماعي + الدورات في واجهة واحدة',
    'features.why.4': 'مثالي للمبتدئين والمتداولين ذوي الخبرة',
    'features.why.5': 'يساعدك على اتخاذ قرارات أذكى بشكل أسرع',
    'features.why.6': 'احصل على التمويل من خلال تحدي التداول الخاص بنا',
    
    // Markets
    'market.crypto': 'سوق العملات المشفرة',
    'market.usstock': 'سوق الأسهم الأمريكية',
    'market.morocco': 'السوق المغربي',
    
    // Pricing
    'pricing.heading': 'اختر التحدي الخاص بك',
    'pricing.subheading': 'ادفع مرة واحدة، أثبت مهاراتك، واحصل على التمويل. بدون رسوم متكررة.',
    'pricing.popular': 'الأكثر شعبية',
    'pricing.balance': 'الرصيد الافتراضي',
    'pricing.startchallenge': 'ابدأ تحدي {tier}',
    'pricing.rules.title': 'قواعد التحدي',
    'pricing.rules.daily': 'أقصى خسارة يومية',
    'pricing.rules.daily.desc': 'خسارة أكثر من 5% في يوم واحد = فشل',
    'pricing.rules.total': 'أقصى خسارة إجمالية',
    'pricing.rules.total.desc': 'تجاوز الانخفاض الإجمالي 10% = فشل',
    'pricing.rules.profit': 'هدف الربح',
    'pricing.rules.profit.desc': 'الوصول إلى 10% ربح = ممول!',
    
    // Tier features
    'tier.starter.feature1': 'رصيد افتراضي 5,000 دولار',
    'tier.starter.feature2': 'حد أقصى للخسارة اليومية 5%',
    'tier.starter.feature3': 'حد أقصى للخسارة الإجمالية 10%',
    'tier.starter.feature4': 'هدف ربح 10%',
    'tier.starter.feature5': 'إشارات الذكاء الاصطناعي الأساسية',
    'tier.starter.feature6': 'الوصول إلى المجتمع',
    'tier.starter.feature7': 'دعم البريد الإلكتروني',
    
    'tier.pro.feature1': 'رصيد افتراضي 15,000 دولار',
    'tier.pro.feature2': 'حد أقصى للخسارة اليومية 5%',
    'tier.pro.feature3': 'حد أقصى للخسارة الإجمالية 10%',
    'tier.pro.feature4': 'هدف ربح 10%',
    'tier.pro.feature5': 'إشارات الذكاء الاصطناعي المتقدمة',
    'tier.pro.feature6': 'الوصول ذو الأولوية إلى المجتمع',
    'tier.pro.feature7': 'الوصول إلى الدورات المتقدمة',
    'tier.pro.feature8': 'دعم 24/7',
    
    'tier.elite.feature1': 'رصيد افتراضي 50,000 دولار',
    'tier.elite.feature2': 'حد أقصى للخسارة اليومية 5%',
    'tier.elite.feature3': 'حد أقصى للخسارة الإجمالية 10%',
    'tier.elite.feature4': 'هدف ربح 10%',
    'tier.elite.feature5': 'إشارات الذكاء الاصطناعي المتميزة',
    'tier.elite.feature6': 'الوصول VIP إلى المجتمع',
    'tier.elite.feature7': 'الوصول الكامل إلى الدورات المتقدمة',
    'tier.elite.feature8': 'مدرب تداول شخصي',
    'tier.elite.feature9': 'دعم ذو أولوية',
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    
    // Set document direction for RTL languages
    const root = window.document.documentElement;
    if (language === 'ar') {
      root.setAttribute('dir', 'rtl');
    } else {
      root.setAttribute('dir', 'ltr');
    }
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}