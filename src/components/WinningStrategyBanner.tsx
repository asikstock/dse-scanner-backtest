import React from 'react';
import { 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  Percent, 
  Zap, 
  ChevronRight,
  Crosshair
} from 'lucide-react';
import { ScannerTabConfig } from '../types/scanner';

interface WinningStrategyBannerProps {
  winner: ScannerTabConfig;
  runnerUp: ScannerTabConfig;
  momentumPick: ScannerTabConfig;
  onSelectTab: (tab: ScannerTabConfig) => void;
  onOpenSimulator: () => void;
  onOpenSniper?: () => void;
}

export const WinningStrategyBanner: React.FC<WinningStrategyBannerProps> = ({
  winner,
  runnerUp,
  momentumPick,
  onSelectTab,
  onOpenSimulator,
  onOpenSniper
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 p-5 sm:p-7 shadow-2xl shadow-blue-950/50 mb-8">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -mb-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main Champion Header */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-200 p-0.5 shadow-xl shadow-amber-500/25 shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                সর্বাধিক প্রফিটেবল কৌশল (Top Ranked Champion)
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                ট্যাব: {winner.label}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              ★ আগামীকালের সেরা এন্ট্রি (Tomorrow Prime Entries)
            </h2>

            <p className="text-slate-300 text-sm sm:text-base mt-1.5 max-w-3xl leading-relaxed">
              ঢাকা স্টক এক্সচেঞ্জের ১৩ বছরের ঐতিহাসিক ট্রেড ডেটা (২০১৩–২০২৬, ৭,২৯,৯৮৬ রো) যাচাই করে দেখা গেছে—এই কৌশলটি এককভাবে 
              <strong className="text-emerald-400"> সর্বোচ্চ প্রফিট্যাবিলিটি (+২.৩৫ R-Multiple)</strong>, 
              <strong className="text-emerald-400"> +৫.৭৭% অতিরিক্ত আলফা</strong> এবং 
              <strong className="text-emerald-400"> ২.১৮ প্রফিট ফ্যাক্টর</strong> অর্জন করেছে।
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex sm:flex-col items-center sm:items-end gap-2.5 w-full sm:w-auto shrink-0">
          <button
            onClick={() => onSelectTab(winner)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group"
          >
            <span>কৌশলের পূর্ণাঙ্গ ব্যাকটেস্ট ও নিয়ম</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          {onOpenSniper && (
            <button
              onClick={onOpenSniper}
              className="w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20 transition-colors flex items-center justify-center gap-1.5"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>🎯 ৮০–৯০% উইন স্নাইপার ইঞ্জিন</span>
            </button>
          )}

          <button
            onClick={onOpenSimulator}
            className="w-full sm:w-auto px-4 py-2 rounded-xl font-semibold text-xs bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>৳ মূলধনে প্রফিট সিমুলেট করুন</span>
          </button>
        </div>
      </div>

      {/* 4 Core Pillars of this Strategy */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3.5 my-6">
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>গড় রিটার্ন গুণিতক (Avg R)</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
            +{winner.backtest.avgR} R
          </div>
          <p className="text-[11px] text-slate-400 mt-1">প্রতি ৳১ রিস্কে গড়ে ৳২.৩৫ লাভ</p>
        </div>

        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>অতিরিক্ত আলফা (Excess Alpha)</span>
            <Percent className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            +{winner.backtest.excessAlpha}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">DSE বাজার গড়ের চেয়ে অতিরিক্ত</p>
        </div>

        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>প্রফিট ফ্যাক্টর (Profit Factor)</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">
            {winner.backtest.profitFactor}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">মোট লাভ / মোট ক্ষতি অনুপাত</p>
        </div>

        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>ম্যাক্সিমাম ড্রডাউন (Max DD)</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-300 font-mono">
            {winner.backtest.maxDrawdown}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">ডিএসইর তুলনায় নিয়ন্ত্রিত ঝুঁকি</p>
        </div>
      </div>

      {/* Why it Beats Other Tabs (Deep Comparison) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
        {/* Pillar 1: Why it wins */}
        <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2.5">
            <CheckCircle2 className="w-4 h-4" />
            কেন এটি DSE-তে সবচেয়ে সফল?
          </h4>
          <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-400 font-bold shrink-0">১.</span>
              <span><strong>ব্লাইন্ড ব্রেকআউট ট্র্যাপ এড়ায়:</strong> ডিএসইতে সরাসরি ব্রেকআউট কিনলে অধিকাংশ সময় রিটেইলরা ফাঁদে পড়ে (ফেজ ডি ব্রেকআউটে ৬২.৬% এসএল হিট)। প্রাইম স্ট্র্যাটেজি স্প্রিং বা রিটেস্ট নিশ্চিত করে।</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-400 font-bold shrink-0">২.</span>
              <span><strong>বায়ার ডমিনেন্স ভ্যালিডেশন:</strong> ৭.২ লাখ রো-এর টেস্টে দেখা গেছে শীর্ষ বায়ার প্রেশারে ডে ১ থেকে ডে ৫ পর্যন্ত নিশ্চিত আলফা (t-stat +৬.৪৭) থাকে।</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-400 font-bold shrink-0">৩.</span>
              <span><strong>১:২ থেকে ১:৩ RRR:</strong> অল্প স্টপ-লস এবং বিশাল আপসাইড লক্ষ্য থাকায় উইন রেট ৪৮% হলেও পোর্টফোলিও চক্রবৃদ্ধি হারে বাড়ে।</span>
            </li>
          </ul>
        </div>

        {/* Pillar 2: Runner-up & Alternative */}
        <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5 mb-2.5">
              <Zap className="w-4 h-4" />
              রানার-আপ ও মোমেন্টাম বিকল্প কৌশল
            </h4>
            <div className="space-y-2.5">
              <div 
                onClick={() => onSelectTab(runnerUp)}
                className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800/80 border border-slate-800 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <span className="text-slate-400">🥈 ২য় র্যাংক:</span>
                    <span>{runnerUp.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">৯,১১৮টি টেস্টে +২.১৯ R ও প্রফিট ফ্যাক্টর ১.৯৪</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>

              <div 
                onClick={() => onSelectTab(momentumPick)}
                className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800/80 border border-slate-800 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <span className="text-amber-400">⚡ ৩য় র্যাংক:</span>
                    <span>{momentumPick.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">লো-ক্যাপে দ্রুত +১৫% থেকে +৩৫% রিটার্ন হান্টিং</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-2 italic">
            * বড় মূলধনের পজিশন ট্রেডের জন্য ২য় র্যাংক এবং হাই-বিটা সুইংয়ের জন্য ৩য় র্যাংক চমৎকার।
          </p>
        </div>

        {/* Pillar 3: Critical Warning / Avoidance */}
        <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5 mb-2.5">
            <AlertTriangle className="w-4 h-4" />
            কোন ভুলগুলো সবচেয়ে বিপজ্জনক?
          </h4>
          <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
            <li className="flex items-start gap-1.5">
              <span className="text-red-400 font-bold shrink-0">•</span>
              <span><strong>Phase E (মার্কআপ) শেষের দিকে কেনা:</strong> অতীতে ১০ দিনে গড়ে -৩.১৪% এবং ৪০ দিনে -৬.০৫% লস দিয়েছে। ফোমো এন্ট্রি নেওয়া যাবে না।</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-red-400 font-bold shrink-0">•</span>
              <span><strong>🚨 ডাম্প সতর্কতা ট্যাবের শেয়ার কেনা:</strong> ১০,০৭০টি ডিস্ট্রিবিউশন ইভেন্টে গড় ক্ষতি -৫.৬৮%। এটি এক্সিট করার সিগন্যাল, সস্তা ভেবে কেনা নিষেধ।</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-red-400 font-bold shrink-0">•</span>
              <span><strong>Phase B-তে মূলধন আটকে রাখা:</strong> অস্থিরতাহীন রেঞ্জে মাসের পর মাস পোর্টফোলিও অলস থাকে।</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
