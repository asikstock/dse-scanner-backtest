import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  ArrowUpRight, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Sparkles,
  Layers,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { DSEStock, ScannerTabConfig } from '../types/scanner';

interface LiveStockScannerTabProps {
  stocks: DSEStock[];
  tabs: ScannerTabConfig[];
  activeTabKey: string;
  setActiveTabKey: (key: string) => void;
  onSelectTabInfo: (tab: ScannerTabConfig) => void;
}

export const LiveStockScannerTab: React.FC<LiveStockScannerTabProps> = ({
  stocks,
  tabs,
  activeTabKey,
  setActiveTabKey,
  onSelectTabInfo
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [onlyEntrySetups, setOnlyEntrySetups] = useState(false);

  // Available Sectors
  const sectors = useMemo(() => {
    const set = new Set(stocks.map(s => s.s).filter(Boolean));
    return Array.from(set).sort();
  }, [stocks]);

  // Tab filter evaluation
  const filteredStocks = useMemo(() => {
    return stocks.filter(s => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = s.c.toLowerCase().includes(q);
        const matchSector = s.s ? s.s.toLowerCase().includes(q) : false;
        if (!matchCode && !matchSector) return false;
      }

      // Sector
      if (selectedSector && s.s !== selectedSector) return false;

      // Only Entry Setups
      if (onlyEntrySetups && (!s.ok || s.pst !== 'buy')) return false;

      // Tab filter logic
      switch (activeTabKey) {
        case '__realistic_screened': {
          const isLiquid = s.val === undefined || s.val === null || s.val >= 0.5;
          const dev = s.dev !== undefined && s.dev !== null ? s.dev : 0;
          const isAtNormalBase = dev >= -5.5 && dev <= 4.5;
          const chg = s.ch || 0;
          const isCalmCandle = chg >= -2.5 && chg <= 3.8;
          const hasBuyerFlow = (s.pbuy || 0) >= 20 && (s.pbuy || 0) >= (s.psell || 0);
          const isValidPhase = s.p === 'Phase C' || s.p === 'Phase D' || s.p === 'Re-accumulation' || s.p === 'Phase B' || s.ok;
          const isNotDead = s.p !== 'Distribution' && s.p !== 'Markdown' && s.p !== 'Phase A' && s.pst !== 'sell' && !s.gn && !s.lk && (!s.idle || s.idle === 0);
          return isLiquid && isAtNormalBase && isCalmCandle && hasBuyerFlow && isValidPhase && isNotDead;
        }
        case '__prime':
          return (s.p === 'Phase C' || s.p === 'Phase D') && s.pst === 'buy' && !s.gn;
        case '__setup':
          return Boolean(s.ok && s.pst === 'buy');
        case '__booming': {
          const isLC = Boolean(s.lc || (s.pu !== null && s.pu !== undefined && s.pu <= 50));
          const isStealth = Boolean(s.wl || (s.fl && s.fl.some(f => f.includes('STEALTH') || f.includes('SC'))));
          const notNegative = s.p !== 'Distribution' && s.p !== 'Markdown' && s.p !== 'Phase A';
          const hasBuy = (s.pbuy || 0) >= (s.psell || 0) && (s.pbuy || 0) >= 20;
          const vrPlus = (s.vr != null && s.vr >= 0.5) || (s.vr5 != null && s.vr5 >= 1.0);
          return isLC && isStealth && notNegative && hasBuy && vrPlus && !s.gn && (!s.idle || s.idle === 0) && !s.lk;
        }
        case '__syndicate': {
          const isLC = Boolean(s.lc || (s.pu != null && s.pu <= 500));
          const notBadPhase = s.p !== 'Distribution' && s.p !== 'Markdown';
          const inEntryZone = s.cl >= (s.m20 || s.cl) * 0.92 && s.cl <= (s.m20 || s.cl) * 1.08;
          const hasBuy = (s.pbuy || 0) >= (s.psell || 0) && (s.pbuy || 0) >= 15;
          return isLC && notBadPhase && inEntryZone && hasBuy && !s.gn && (!s.idle || s.idle === 0) && !s.lk;
        }
        case '__rocket': {
          const isLC = Boolean(s.lc || (s.pu != null && s.pu <= 50));
          const vrPlus = (s.vr != null && s.vr >= 1.5);
          const hasStrongBuy = (s.pbuy || 0) > 65;
          return isLC && vrPlus && hasStrongBuy && !s.gn && !s.lk;
        }
        case 'Phase C':
          return s.p === 'Phase C';
        case 'Phase D':
          return s.p === 'Phase D';
        case 'Phase B':
          return s.p === 'Phase B';
        case 'Phase E':
          return s.p === 'Phase E';
        case '__pbuy':
          return s.pst === 'buy' && !s.gn;
        case '__psell':
          return s.pst === 'sell' && !s.gn;
        case '__climax_dump': {
          const isDist = s.p === 'Distribution';
          const hasTrap = Boolean(s.fl && s.fl.some(f => f.includes('UTAD') || f.includes('BC') || f.includes('SOW')));
          const isLateDump = Boolean(s.ch < -2 && (s.vr || 0) > 1.3);
          return isDist || hasTrap || isLateDump;
        }
        case '__all':
        default:
          return true;
      }
    });
  }, [stocks, searchQuery, selectedSector, onlyEntrySetups, activeTabKey]);

  const activeTabConfig = tabs.find(t => t.key === activeTabKey) || tabs[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              লাইভ স্টক রাডার: {activeTabConfig.label}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            আজকের বাজার সেশনে এই ট্যাবের শর্ত ও সিগন্যাল ম্যাচ করা মোট <strong className="text-emerald-400 font-mono">{filteredStocks.length}টি</strong> স্টক শনাক্ত হয়েছে
          </p>
        </div>

        <button
          onClick={() => onSelectTabInfo(activeTabConfig)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>এই ট্যাবের ব্যাকটেস্ট রিপোর্ট</span>
        </button>
      </div>

      {/* Tabs Selector Bar */}
      <div className="flex items-center gap-1.5 my-4 overflow-x-auto pb-1 no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTabKey(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTabKey === tab.key
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 mb-5">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="search"
              placeholder="কোড বা সেক্টর দিয়ে সার্চ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500 max-w-[160px]"
          >
            <option value="">সব সেক্টর ({sectors.length})</option>
            {sectors.map(sec => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={onlyEntrySetups}
            onChange={(e) => setOnlyEntrySetups(e.target.checked)}
            className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
          />
          <span>শুধুমাত্র এন্ট্রি-যোগ্য সেটআপ (RRR ≥ 1:2 & Buyer)</span>
        </label>
      </div>

      {/* Stocks Table */}
      {filteredStocks.length === 0 ? (
        <div className="p-12 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400">
          <p className="text-base font-semibold">আজকের সেশনে এই ফিল্টারে কোনো শেয়ার পাওয়া যায়নি</p>
          <p className="text-xs text-slate-500 mt-1">
            অন্য কোনো ট্যাব নির্বাচন করুন অথবা সেক্টর ফিল্টার রিসেট করুন।
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">স্টক কোড / সেক্টর</th>
                <th className="py-3 px-3 text-right">সর্বশেষ দর (LTP)</th>
                <th className="py-3 px-3 text-right">পরিবর্তন %</th>
                <th className="py-3 px-3">ওয়াইকফ ফেজ</th>
                <th className="py-3 px-3 text-right">বায়ার বনাম সেলার</th>
                <th className="py-3 px-3 text-right">ভলিউম রেশিও (VR)</th>
                <th className="py-3 px-3 text-right">এন্ট্রি জোন</th>
                <th className="py-3 px-3 text-right">স্টপ-লস</th>
                <th className="py-3 px-3 text-right">টার্গেট</th>
                <th className="py-3 px-3 text-right">সেটআপ RRR</th>
                <th className="py-3 px-3 text-center">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredStocks.map(stock => {
                const isBuyer = stock.pst === 'buy';
                const isSeller = stock.pst === 'sell';

                return (
                  <tr key={stock.c} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-sans">
                      <strong className="text-white text-sm block">{stock.c}</strong>
                      <span className="text-[11px] text-slate-400">{stock.s || '–'}</span>
                    </td>

                    <td className="py-2.5 px-3 text-right font-bold text-slate-100">
                      ৳{stock.cl}
                    </td>

                    <td className={`py-2.5 px-3 text-right font-bold ${
                      stock.ch > 0 ? 'text-emerald-400' : stock.ch < 0 ? 'text-red-400' : 'text-slate-400'
                    }`}>
                      {stock.ch > 0 ? `+${stock.ch.toFixed(2)}%` : `${stock.ch.toFixed(2)}%`}
                    </td>

                    <td className="py-2.5 px-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        stock.p === 'Phase C' ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30' :
                        stock.p === 'Phase D' ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30' :
                        stock.p === 'Phase E' ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30' :
                        stock.p === 'Distribution' ? 'bg-red-500/15 text-red-300 border border-red-500/30' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {stock.p}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <span className={isBuyer ? 'text-emerald-400 font-bold' : isSeller ? 'text-red-400 font-bold' : 'text-slate-400'}>
                        {stock.pbuy || 0}% / {stock.psell || 0}%
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right text-slate-300">
                      {stock.vr != null ? `${stock.vr.toFixed(2)}x` : '–'}
                    </td>

                    <td className="py-2.5 px-3 text-right text-slate-200">
                      ৳{stock.en || stock.cl}
                    </td>

                    <td className="py-2.5 px-3 text-right text-red-400">
                      ৳{stock.sl ? stock.sl.toFixed(2) : '–'}
                    </td>

                    <td className="py-2.5 px-3 text-right text-emerald-400">
                      ৳{stock.tg ? stock.tg.toFixed(2) : '–'}
                    </td>

                    <td className="py-2.5 px-3 text-right font-bold text-amber-400">
                      {stock.rr ? `১:${stock.rr.toFixed(1)}` : '–'}
                    </td>

                    <td className="py-2.5 px-3 text-center font-sans">
                      {stock.ok && stock.pst === 'buy' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          ভ্যালিড এন্ট্রি
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] text-slate-400 bg-slate-800">
                          ওয়াচলিস্ট
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
