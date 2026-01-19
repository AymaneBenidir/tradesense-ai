import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, LayoutDashboard, Trophy, Newspaper, 
  Users, GraduationCap, Menu, X, LogOut, User,
  CreditCard, Settings, Shield
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeProvider, useTheme } from '../components/ThemeProvider';
import { LanguageProvider, useLanguage } from '../components/LanguageProvider';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSwitcher from '../components/LanguageSwitcher';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, page: 'Dashboard', key: 'nav.dashboard' },
  { name: 'Leaderboard', icon: Trophy, page: 'Leaderboard', key: 'nav.leaderboard' },
  { name: 'News', icon: Newspaper, page: 'News', key: 'nav.news' },
  { name: 'Community', icon: Users, page: 'Community', key: 'nav.community' },
  { name: 'MasterClass', icon: GraduationCap, page: 'MasterClass', key: 'nav.masterclass' },
];

function LayoutContent({ children, currentPageName }) {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (e) {
      setUser(null);
    }
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  const isLandingPage = currentPageName === 'Landing';

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Landing page header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800/50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to={createPageUrl('Landing')} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">TradeSense AI</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium">
                Features
              </a>
              <Link 
                to={createPageUrl('Pricing')}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium"
              >
                Pricing
              </Link>
              <a href="#about" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium">
                About
              </a>
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                      <Avatar className="w-8 h-8 mr-2">
                        <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                          {user.full_name?.[0] || user.email?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      {user.full_name || 'Trader'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl('Dashboard')} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <LayoutDashboard className="w-4 h-4" /> {t('nav.dashboard')}
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl('Admin')} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <Shield className="w-4 h-4" /> {t('nav.admin')}
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-400">
                      <LogOut className="w-4 h-4 mr-2" /> {t('nav.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    onClick={() => base44.auth.redirectToLogin()}
                  >
                    {t('nav.signin')}
                  </Button>
                  <Link to={createPageUrl('Pricing')}>
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                      {t('nav.getstarted')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>
        <main className="pt-[72px]">
          {children}
        </main>
      </div>
    );
  }

  // App layout for authenticated pages
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col fixed h-full">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <Link to={createPageUrl('Landing')} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">TradeSense</span>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = currentPageName === item.page;
              return (
                <li key={item.page}>
                  <Link
                    to={createPageUrl(item.page)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {t(item.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {user && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-3">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                        {user.full_name?.[0] || user.email?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.full_name || 'Trader'}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                  {user.role === 'admin' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl('Admin')} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <Shield className="w-4 h-4" /> {t('nav.admin')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="text-red-400">
                    <LogOut className="w-4 h-4 mr-2" /> {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between p-4">
          <Link to={createPageUrl('Landing')} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">TradeSense</span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LanguageSwitcher />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-900 dark:text-white"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="p-4 border-t border-slate-200 dark:border-slate-800">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.page}>
                  <Link
                    to={createPageUrl(item.page)}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  >
                    <item.icon className="w-5 h-5" />
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <LayoutContent children={children} currentPageName={currentPageName} />
      </LanguageProvider>
    </ThemeProvider>
  );
}