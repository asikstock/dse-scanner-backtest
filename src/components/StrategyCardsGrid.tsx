import React from 'react';
import { 
  Trophy, 
  Sparkles, 
  ArrowUpRight, 
  TrendingUp, 
  Percent, 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  AlertTriangle,
  Flame,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import { ScannerTabConfig, TabCategory } from '../types/scanner';

interface StrategyCardsGridProps {
  tabs: ScannerTabConfig[];
  onSelectTab: (tab: ScannerTabConfig) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  liveMatchCounts: { [key: string]: number };
}

export const StrategyCardsGrid: React.FC<StrategyCardsGridProps> = ({
  tabs,
  onSelectTab,
  selectedCategory,
  setSelectedCategory,
  liveMatchCounts
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case '__prime':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case '__setup':
        return <Trophy className="w-5 h-5 text-emerald-400" />;
      case '__booming':
        return <Flame className="w-5 h-5 text-orange-400" />;
      case 'Phase C':
        return <TrendingUp className="w-5 h-5 text-teal-400" />;
      case '__syndicate':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case '__rocket':
        return <Flame className="w-5 h-5 text-rose-400" />;
      case '__pbuy':
        return <Activity className="w-5 h-5 text-emerald-400" />;
      case 'Phase D':
        return <Layers className="w-5 h-5 text-blue-400" />;
      case '__climax_dump':
        return <ShieldAlert className="w-5 h-5 text-red-400" />;
      default:
        return <Activity className="w-5 h-5 text-slate-400" />;
    }
  };

  const getBorderColor = (tab: ScannerTabConfig) => {
    if (tab.rank === 1) return 'border-amber-500/50 hover:border-amber-400 shadow-amber-500/10';
    if (tab.rank === 2) return 'border-emerald-500/40 hover:border-emerald-400 shadow-emerald-500/10';
    if (tab.rank === 3) return 'border-blue-500/40 hover:border-blue-400 shadow-blue-500/10';
    if (tab.category === 'tier3_avoidance') return 'border-red-500/30 hover:border-red-400 bg-red-950/10';
    return 'border-slate-800 hover:border-slate-700';
  };

  const filtered = tabs.filter(t => selectedCategory === 'all' || t.category === selectedCategory);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>কৌশল ভিত্তিক পারফরম্যান্স কার্ড</span>
            <span className="text-xs text-slate-400 font-normal">
              (যেকোনো কার্ডে ক্লিক করে ডিপ-ডাইভ অডিট রিপোর্ট দেখুন)
            </span>
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tab) => {
          const isWinner = tab.rank === 1;
          const liveCount = liveMatchCounts[tab.key] || 0;

          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab)}
              className={`bg-slate-900/90 rounded-2xl p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-lg relative group ${getBorderColor(
                tab
              )}`}
            >
              {/* Top Header inside card */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                      {getIcon(tab.id)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold">
                          #{tab.rank} র্যাংক
                        </span>
                        {isWinner && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            চ্যাম্পিয়ন
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors mt-0.5">
                        {tab.label}
                      </h4>
                    </div>
                  </div>

                  {/* Live match indicator */}
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      আজ: <strong className="text-emerald-400">{liveCount}টি</strong>
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {tab.desc}
                </p>

                {/* Key Numbers Grid */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 mb-3.5 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">গড় রিটার্ন R</span>
                    <span className={`text-base font-bold ${
                      tab.backtest.avgR >= 2.0 
                        ? 'text-amber-400' 
                        : tab.backtest.avgR > 1.2 
                        ? 'text-emerald-400' 
                        : tab.backtest.avgR >= 1.0 
                        ? 'text-slate-300' 
                        : 'text-red-400'
                    }`}>
                      {tab.backtest.avgR > 0 ? `+${tab.backtest.avgR.toFixed(2)}` : tab.backtest.avgR.toFixed(2)} R
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">উইন রেট</span>
                    <span className={`text-base font-bold ${
                      tab.backtest.winRate >= 45 
                        ? 'text-emerald-400' 
                        : tab.backtest.winRate >= 40 
                        ? 'text-blue-400' 
                        : 'text-slate-400'
                    }`}>
                      {tab.backtest.winRate.toFixed(1)}%
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">অতিরিক্ত আলফা</span>
                    <span className={`text-base font-bold ${
                      tab.backtest.excessAlpha > 0 
                        ? 'text-emerald-400' 
                        : 'text-red-400'
                    }`}>
                      {tab.backtest.excessAlpha > 0 ? `+${tab.backtest.excessAlpha.toFixed(2)}%` : `${tab.backtest.excessAlpha.toFixed(2)}%`}
                    </span>
                  </div>
                </div>

                {/* Mini Verdict */}
                <div className="text-[11.5px] text-slate-300 bg-slate-800/30 rounded-lg p-2.5 border border-slate-800/50 mb-3">
                  <span className="font-semibold text-slate-200">সারসংক্ষেপ: </span>
                  <span className="line-clamp-2">{tab.verdictBn}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px] font-mono">
                  {tab.backtest.sampleCount.toLocaleString()} টি হিস্টোরিক্যাল ট্রেড
                </span>

                <span className="text-blue-400 font-medium group-hover:text-blue-300 inline-flex items-center gap-1 transition-colors">
                  <span>পূর্ণ রিপোর্ট</span>
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
