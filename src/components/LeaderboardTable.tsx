import React, { useState } from 'react';
import { 
  ArrowUpDown, 
  ChevronRight, 
  Sparkles, 
  ShieldAlert, 
  HelpCircle,
  Filter,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Zap,
  Target,
  Trophy
} from 'lucide-react';
import { ScannerTabConfig, TabCategory } from '../types/scanner';

interface LeaderboardTableProps {
  tabs: ScannerTabConfig[];
  onSelectTab: (tab: ScannerTabConfig) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

type SortField = 'rank' | 'winRate' | 'avgR' | 'avgReturn' | 'excessAlpha' | 'profitFactor' | 'sampleCount';

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  tabs,
  onSelectTab,
  selectedCategory,
  setSelectedCategory
}) => {
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === 'rank'); // Rank ascending by default, others descending
    }
  };

  const filteredTabs = tabs
    .filter(tab => {
      if (selectedCategory === 'all') return true;
      return tab.category === selectedCategory;
    })
    .filter(tab => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        tab.label.toLowerCase().includes(q) ||
        tab.title.toLowerCase().includes(q) ||
        tab.desc.toLowerCase().includes(q) ||
        tab.filterLogicSummary.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let valA: number;
      let valB: number;

      switch (sortField) {
        case 'rank':
          valA = a.rank;
          valB = b.rank;
          break;
        case 'winRate':
          valA = a.backtest.winRate;
          valB = b.backtest.winRate;
          break;
        case 'avgR':
          valA = a.backtest.avgR;
          valB = b.backtest.avgR;
          break;
        case 'avgReturn':
          valA = a.backtest.avgReturn;
          valB = b.backtest.avgReturn;
          break;
        case 'excessAlpha':
          valA = a.backtest.excessAlpha;
          valB = b.backtest.excessAlpha;
          break;
        case 'profitFactor':
          valA = a.backtest.profitFactor;
          valB = b.backtest.profitFactor;
          break;
        case 'sampleCount':
          valA = a.backtest.sampleCount;
          valB = b.backtest.sampleCount;
          break;
        default:
          valA = a.rank;
          valB = b.rank;
      }

      return sortAsc ? valA - valB : valB - valA;
    });

  const getCategoryBadge = (category: TabCategory) => {
    switch (category) {
      case 'tier1_alpha':
        return (
          <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Tier 1: হাই আলফা
          </span>
        );
      case 'tier2_momentum':
        return (
          <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
            Tier 2: মোমেন্টাম
          </span>
        );
      case 'tier3_avoidance':
        return (
          <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
            Tier 3: সতর্কবার্তা / এক্সিট
          </span>
        );
      case 'market_all':
        return (
          <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-slate-500/15 text-slate-400 border border-slate-500/30">
            মার্কেট বেঞ্চমার্ক
          </span>
        );
    }
  };

  const getActionBadge = (rank: number, category: TabCategory) => {
    if (rank === 1) {
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
          <Trophy className="w-3.5 h-3.5" />
          শীর্ষ এন্ট্রি
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          স্ট্রং বাই
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1">
          <Flame className="w-3.5 h-3.5" />
          সুইং এন্ট্রি
        </span>
      );
    }
    if (category === 'tier3_avoidance') {
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          নো-বাই / এক্সিট
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
        কন্ডিশনাল
      </span>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl mb-8">
      {/* Table Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>স্ক্যানার ট্যাব পারফরম্যান্স লিডারবোর্ড</span>
            <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-300 rounded-full border border-slate-700 font-mono">
              {filteredTabs.length}টি স্ট্র্যাটেজি
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            সকল ট্যাবের অতীত ট্রেড সংকেতের উইন-রেট, আর-মাল্টিপল, অতিরিক্ত রিটার্ন ও নির্ভরযোগ্যতা
          </p>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              সব ({tabs.length})
            </button>
            <button
              onClick={() => setSelectedCategory('tier1_alpha')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                selectedCategory === 'tier1_alpha'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              উচ্চ মুনাফা (Tier 1)
            </button>
            <button
              onClick={() => setSelectedCategory('tier2_momentum')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                selectedCategory === 'tier2_momentum'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-blue-400'
              }`}
            >
              মোমেন্টাম (Tier 2)
            </button>
            <button
              onClick={() => setSelectedCategory('tier3_avoidance')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                selectedCategory === 'tier3_avoidance'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-red-400'
              }`}
            >
              সতর্কবার্তা (Tier 3)
            </button>
          </div>

          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ট্যাব বা শর্ত খুঁজুন..."
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 w-36 sm:w-44"
          />
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto mt-4 -mx-5 px-5">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold select-none bg-slate-950/40">
              <th 
                onClick={() => handleSort('rank')}
                className="py-3 px-3 cursor-pointer hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>র্যাংক</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </th>

              <th className="py-3 px-3">
                <span>ট্যাব / কৌশল</span>
              </th>

              <th className="py-3 px-3">
                <span>ক্যাটাগরি</span>
              </th>

              <th 
                onClick={() => handleSort('sampleCount')}
                className="py-3 px-3 text-right cursor-pointer hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>টেস্ট সংখ্যা</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </th>

              <th 
                onClick={() => handleSort('winRate')}
                className="py-3 px-3 cursor-pointer hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>উইন রেট (Win %)</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </th>

              <th 
                onClick={() => handleSort('avgR')}
                className="py-3 px-3 text-right cursor-pointer hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>গড় রিটার্ন (Avg R)</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </th>

              <th 
                onClick={() => handleSort('excessAlpha')}
                className="py-3 px-3 text-right cursor-pointer hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>অতিরিক্ত আলফা</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </th>

              <th 
                onClick={() => handleSort('profitFactor')}
                className="py-3 px-3 text-right cursor-pointer hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>প্রফিট ফ্যাক্টর</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </th>

              <th className="py-3 px-3 text-center">
                <span>ম্যাক্স ড্রডাউন</span>
              </th>

              <th className="py-3 px-3 text-center">
                <span>অ্যাকশন নির্দেশ</span>
              </th>

              <th className="py-3 px-3 text-right">
                <span>অ্যাকশন</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredTabs.map((tab) => {
              const isWin = tab.rank === 1;
              const isPositiveR = tab.backtest.avgR > 1.0;
              const isNegativeAlpha = tab.backtest.excessAlpha < 0;

              return (
                <tr
                  key={tab.id}
                  onClick={() => onSelectTab(tab)}
                  className={`hover:bg-slate-800/40 cursor-pointer transition-colors group ${
                    isWin ? 'bg-blue-950/20 font-semibold' : ''
                  }`}
                >
                  {/* Rank */}
                  <td className="py-3 px-3 font-bold text-center w-12">
                    {tab.rank === 1 ? (
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs mx-auto shadow-sm shadow-amber-500/40">
                        1
                      </span>
                    ) : tab.rank === 2 ? (
                      <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-950 flex items-center justify-center font-black text-xs mx-auto">
                        2
                      </span>
                    ) : tab.rank === 3 ? (
                      <span className="w-6 h-6 rounded-full bg-amber-700 text-amber-100 flex items-center justify-center font-black text-xs mx-auto">
                        3
                      </span>
                    ) : (
                      <span className="text-slate-500">#{tab.rank}</span>
                    )}
                  </td>

                  {/* Label */}
                  <td className="py-3 px-3 font-sans">
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                        <span>{tab.label}</span>
                        {isWin && (
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono truncate max-w-xs">
                      {tab.filterLogicSummary}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3 font-sans">
                    {getCategoryBadge(tab.category)}
                  </td>

                  {/* Sample count */}
                  <td className="py-3 px-3 text-right text-slate-400 font-mono">
                    {tab.backtest.sampleCount.toLocaleString()} টি
                  </td>

                  {/* Win rate */}
                  <td className="py-3 px-3 font-mono">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${
                        tab.backtest.winRate >= 45 
                          ? 'text-emerald-400' 
                          : tab.backtest.winRate >= 40 
                          ? 'text-blue-400' 
                          : 'text-slate-400'
                      }`}>
                        {tab.backtest.winRate.toFixed(1)}%
                      </span>
                      <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden hidden sm:block">
                        <div 
                          className={`h-full rounded-full ${
                            tab.backtest.winRate >= 45 
                              ? 'bg-emerald-500' 
                              : tab.backtest.winRate >= 40 
                              ? 'bg-blue-500' 
                              : 'bg-slate-500'
                          }`}
                          style={{ width: `${Math.min(100, tab.backtest.winRate * 1.8)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Avg R */}
                  <td className="py-3 px-3 text-right font-mono font-bold">
                    <span className={
                      tab.backtest.avgR >= 2.0 
                        ? 'text-amber-400' 
                        : tab.backtest.avgR > 1.2 
                        ? 'text-emerald-400' 
                        : tab.backtest.avgR >= 1.0 
                        ? 'text-slate-300' 
                        : 'text-red-400'
                    }>
                      {tab.backtest.avgR > 0 ? `+${tab.backtest.avgR.toFixed(2)}` : tab.backtest.avgR.toFixed(2)} R
                    </span>
                  </td>

                  {/* Excess Alpha */}
                  <td className="py-3 px-3 text-right font-mono font-bold">
                    <span className={
                      tab.backtest.excessAlpha > 3.0 
                        ? 'text-emerald-400' 
                        : tab.backtest.excessAlpha > 0 
                        ? 'text-blue-400' 
                        : 'text-red-400'
                    }>
                      {tab.backtest.excessAlpha > 0 ? `+${tab.backtest.excessAlpha.toFixed(2)}%` : `${tab.backtest.excessAlpha.toFixed(2)}%`}
                    </span>
                  </td>

                  {/* Profit Factor */}
                  <td className="py-3 px-3 text-right font-mono">
                    <span className={`font-semibold ${
                      tab.backtest.profitFactor >= 2.0 
                        ? 'text-amber-400' 
                        : tab.backtest.profitFactor >= 1.5 
                        ? 'text-emerald-400' 
                        : tab.backtest.profitFactor >= 1.0 
                        ? 'text-slate-300' 
                        : 'text-red-400'
                    }`}>
                      {tab.backtest.profitFactor.toFixed(2)}
                    </span>
                  </td>

                  {/* Max Drawdown */}
                  <td className="py-3 px-3 text-center font-mono text-slate-400">
                    <span className={tab.backtest.maxDrawdown < -12 ? 'text-red-400 font-semibold' : ''}>
                      {tab.backtest.maxDrawdown}%
                    </span>
                  </td>

                  {/* Action Badge */}
                  <td className="py-3 px-3 text-center font-sans">
                    {getActionBadge(tab.rank, tab.category)}
                  </td>

                  {/* Detail link */}
                  <td className="py-3 px-3 text-right font-sans">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTab(tab);
                      }}
                      className="px-2.5 py-1 text-xs rounded-md bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1"
                    >
                      <span>রিপোর্ট</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer Insight */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-slate-500" />
          <span>* <strong>Avg R (Risk-Multiple):</strong> প্রতি ১ ইউনিট গৃহীত ঝুঁকির বিপরীতে উপার্জিত মুনাফার অনুপাত (যেমন +২.৩৫ R মানে ৳১ ঝুঁকির বিপরীতে ৳২.৩৫ লাভ)।</span>
        </div>
        <div className="text-slate-500 font-mono text-[11px]">
          উৎস: backtest.json (৭.২ লাখ ট্রেড বার ও ৪৬৩ কোম্পানি)
        </div>
      </div>
    </div>
  );
};
