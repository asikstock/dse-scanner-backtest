import React from 'react';
import { 
  BarChart3, 
  ExternalLink, 
  RefreshCw, 
  TrendingUp, 
  Calendar, 
  Database, 
  Sparkles,
  Printer,
  Crosshair
} from 'lucide-react';
import { LiveMarketSummary } from '../types/scanner';

interface HeaderProps {
  summary: LiveMarketSummary;
  isLiveLoading: boolean;
  onRefresh: () => void;
  activeView: 'dashboard' | 'sniper' | 'leaderboard' | 'simulator' | 'report' | 'live_stocks';
  setActiveView: (view: 'dashboard' | 'sniper' | 'leaderboard' | 'simulator' | 'report' | 'live_stocks') => void;
  onPrintReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  summary,
  isLiveLoading,
  onRefresh,
  activeView,
  setActiveView,
  onPrintReport
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/95 sticky top-0 z-40 backdrop-blur-md">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Brand info */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  DSE স্ক্যানার ব্যাকটেস্ট ও স্ট্র্যাটেজি রিপোর্ট
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ২০১৩–২০২৬ পূর্ণাঙ্গ ব্যাকটেস্ট
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2 mt-0.5">
                <span>ঢাকা স্টক এক্সচেঞ্জ (DSE) সিম্পল স্ক্যানারের সকল ট্যাবের অতীত সংকেতের গাণিতিক যাচাই</span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <a 
                  href="https://asikstock.github.io/simple-scaner-/docs/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1 font-mono text-xs"
                >
                  মূল স্ক্যানার <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>

          {/* Quick Stats & Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-300 flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                বাজার তারিখ: <strong className="text-slate-200">{summary.lastDate}</strong>
              </span>
              <span className="h-3 w-px bg-slate-800" />
              <span className="flex items-center gap-1.5 text-slate-400">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                টোটাল রো: <strong className="text-slate-200">৭,২৯,৯৮৬+</strong>
              </span>
            </div>

            <button
              onClick={onRefresh}
              disabled={isLiveLoading}
              title="লাইভ স্ক্যানার ডেটা রিফ্রেশ করুন"
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isLiveLoading ? 'animate-spin' : ''}`} />
              <span>{isLiveLoading ? 'সিঙ্ক হচ্ছে...' : 'লাইভ সিঙ্ক'}</span>
            </button>

            <button
              onClick={onPrintReport}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-blue-400" />
              <span>প্রিন্ট / সেভ</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-800/80 overflow-x-auto pb-0.5 no-scrollbar">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeView === 'dashboard'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>সেরা স্ট্র্যাটেজি ড্যাশবোর্ড</span>
          </button>

          <button
            onClick={() => setActiveView('sniper')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeView === 'sniper'
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-400'
                : 'text-indigo-300 hover:text-white hover:bg-slate-800 border border-indigo-500/40'
            }`}
          >
            <Crosshair className="w-4 h-4 text-emerald-400" />
            <span>🔬 কোয়ান্ট অডিট ও বাস্তবসম্মত ব্যাকটেস্ট</span>
          </button>

          <button
            onClick={() => setActiveView('leaderboard')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeView === 'leaderboard'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>ট্যাব পারফরম্যান্স টেবিল (Leaderboard)</span>
          </button>

          <button
            onClick={() => setActiveView('simulator')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeView === 'simulator'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>পোর্টফোলিও প্রফিট সিমুলেটর</span>
          </button>

          <button
            onClick={() => setActiveView('live_stocks')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeView === 'live_stocks'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-0.5" />
            <span>আজকের লাইভ স্টক রাডার ({summary.totalStocks}টি)</span>
          </button>

          <button
            onClick={() => setActiveView('report')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeView === 'report'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>পূর্ণাঙ্গ এক্সিকিউটিভ রিপোর্ট</span>
          </button>
        </div>
      </div>
    </header>
  );
};
