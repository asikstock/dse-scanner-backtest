import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  TrendingUp, 
  Percent, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Target, 
  HelpCircle,
  ExternalLink,
  Zap,
  BarChart2
} from 'lucide-react';
import { ScannerTabConfig, DSEStock } from '../types/scanner';

interface TabDetailModalProps {
  tab: ScannerTabConfig | null;
  onClose: () => void;
  matchingStocks: DSEStock[];
  onOpenSimulatorWithTab: (tab: ScannerTabConfig) => void;
}

export const TabDetailModal: React.FC<TabDetailModalProps> = ({
  tab,
  onClose,
  matchingStocks,
  onOpenSimulatorWithTab
}) => {
  if (!tab) return null;

  const [activeTabSubView, setActiveTabSubView] = useState<'metrics' | 'horizons' | 'stocks'>('metrics');

  const { backtest } = tab;

  // Generate SVG points for Equity Curve
  const maxEq = Math.max(...backtest.equityCurve.map(p => p.equity));
  const minEq = Math.min(...backtest.equityCurve.map(p => p.equity));
  const eqRange = maxEq - minEq || 1;
  const svgWidth = 500;
  const svgHeight = 160;

  const points = backtest.equityCurve.map((pt, i) => {
    const x = (i / (backtest.equityCurve.length - 1)) * svgWidth;
    const y = svgHeight - ((pt.equity - minEq) / eqRange) * (svgHeight - 30) - 15;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-md bg-blue-600/20 text-blue-400 border border-blue-500/30">
                র্যাংক #{tab.rank}
              </span>
              {tab.rank === 1 && (
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  সর্বাধিক লাভজনক কৌশল
                </span>
              )}
              <span className="text-xs text-slate-400">
                ট্যাব: <strong className="text-slate-200">{tab.label}</strong>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {tab.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {tab.desc}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-slate-800 bg-slate-900/80 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTabSubView('metrics')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTabSubView === 'metrics'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>মূল ব্যাকটেস্ট মেট্রিক্স ও ইকুইটি কার্ভ</span>
          </button>

          <button
            onClick={() => setActiveTabSubView('horizons')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTabSubView === 'horizons'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>টাইমহরাইজন পারফরম্যান্স (১-৪০ দিন)</span>
          </button>

          <button
            onClick={() => setActiveTabSubView('stocks')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTabSubView === 'stocks'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>আজকের সক্রিয় লাইভ স্টক ({matchingStocks.length}টি)</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-slate-300 text-xs sm:text-sm">
          {activeTabSubView === 'metrics' && (
            <>
              {/* Filter Logic Formula Box */}
              <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 font-mono text-xs">
                <span className="text-slate-500 uppercase font-sans text-[11px] block mb-1">
                  স্ক্যানারের ফিল্টারিং সমীকরণ (Filter Formula):
                </span>
                <code className="text-blue-400 font-semibold">{tab.filterLogicSummary}</code>
              </div>

              {/* 6 Key Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 font-mono">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-sans block">গড় রিটার্ন (Avg R)</span>
                  <span className={`text-lg sm:text-xl font-bold ${
                    backtest.avgR >= 2.0 ? 'text-amber-400' : backtest.avgR > 1.0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {backtest.avgR > 0 ? `+${backtest.avgR.toFixed(2)}` : backtest.avgR.toFixed(2)} R
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-sans block">উইন রেট (Win %)</span>
                  <span className={`text-lg sm:text-xl font-bold ${
                    backtest.winRate >= 45 ? 'text-emerald-400' : 'text-slate-200'
                  }`}>
                    {backtest.winRate.toFixed(1)}%
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-sans block">অতিরিক্ত আলফা</span>
                  <span className={`text-lg sm:text-xl font-bold ${
                    backtest.excessAlpha > 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {backtest.excessAlpha > 0 ? `+${backtest.excessAlpha.toFixed(2)}%` : `${backtest.excessAlpha.toFixed(2)}%`}
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-sans block">প্রফিট ফ্যাক্টর</span>
                  <span className={`text-lg sm:text-xl font-bold ${
                    backtest.profitFactor >= 1.5 ? 'text-blue-400' : 'text-slate-300'
                  }`}>
                    {backtest.profitFactor.toFixed(2)}
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-sans block">ম্যাক্স ড্রডাউন</span>
                  <span className="text-lg sm:text-xl font-bold text-slate-300">
                    {backtest.maxDrawdown}%
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-sans block">স্ট্যাট মান (t-stat)</span>
                  <span className="text-lg sm:text-xl font-bold text-indigo-400">
                    {backtest.tStat > 0 ? `+${backtest.tStat.toFixed(2)}` : backtest.tStat.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Trade Outcome Breakdown (TP vs SL vs Timeout) */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
                  <span>ট্রেড ফলাফল বিভাজন (Historical Exit Distribution)</span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    মোট টেস্টকৃত ট্রেড: {backtest.sampleCount.toLocaleString()}টি
                  </span>
                </h4>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      টার্গেট হিট (TP Hit %):
                    </span>
                    <strong className="text-emerald-400">{backtest.tpRate.toFixed(1)}%</strong>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${backtest.tpRate}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono pt-1">
                    <span className="text-red-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      স্টপ-লস ট্রিগার (SL Hit %):
                    </span>
                    <strong className="text-red-400">{backtest.slRate.toFixed(1)}%</strong>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${backtest.slRate}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono pt-1">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      টাইম-আউট বা মার্কেট এক্সিট (%):
                    </span>
                    <strong className="text-slate-300">{backtest.timeOutRate.toFixed(1)}%</strong>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-slate-500 h-2 rounded-full" style={{ width: `${backtest.timeOutRate}%` }} />
                  </div>
                </div>
              </div>

              {/* Simulated Equity Curve Visualization */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      ঐতিহাসিক ইকুইটি গ্রোথ সিমুলেশন (৳১,০০,০০০ মূলধন দিয়ে শুরু)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      অতীতে এই ট্যাবের সংকেত অনুযায়ী সুশৃঙ্খল ট্রেড করলে পোর্টফোলিও অগ্রগতি
                    </p>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-xs text-slate-500">শেষ ইকুইটি: </span>
                    <strong className="text-emerald-400 text-sm">
                      ৳{backtest.equityCurve[backtest.equityCurve.length - 1].equity.toLocaleString()}
                    </strong>
                  </div>
                </div>

                <div className="h-40 w-full relative pt-2">
                  <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id={`grad-${tab.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Area */}
                    <polygon
                      points={`0,${svgHeight} ${points} ${svgWidth},${svgHeight}`}
                      fill={`url(#grad-${tab.id})`}
                    />
                    {/* Line */}
                    <polyline
                      fill="none"
                      stroke={backtest.avgR > 1.0 ? '#10b981' : '#ef4444'}
                      strokeWidth="2.5"
                      points={points}
                    />
                  </svg>
                </div>
              </div>

              {/* Verdict & Trade Rules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    মূল শক্তি ও সফলতার কারণ
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {tab.strengthsBn.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold shrink-0">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    সতর্কতা ও সীমাবদ্ধতা
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {tab.risksBn.map((r, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-red-400 font-bold shrink-0">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Plan */}
              <div className="bg-blue-950/20 border border-blue-500/30 rounded-xl p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-1">
                  💡 এক্সিকিউশন অ্যাকশন প্ল্যান (Action Recommendation):
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {tab.actionRecommendationBn}
                </p>
              </div>
            </>
          )}

          {activeTabSubView === 'horizons' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-2">
                  বিভিন্ন হোল্ডিং মেয়াদে অতীত রিটার্ন বিশ্লেষণ (Holding Period Returns)
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  একটি শেয়ার কেনার পর কত দিন হোল্ড করলে সর্বোচ্চ আলফা অর্জিত হয় তা নিচের ঐতিহাসিক ডেটা থেকে স্পষ্ট:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400 font-semibold block">১০ কার্যদিবস (10-Day Hold)</span>
                    <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
                      {backtest.horizons.d10.net > 0 ? `+${backtest.horizons.d10.net.toFixed(2)}%` : `${backtest.horizons.d10.net.toFixed(2)}%`}
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      অতিরিক্ত আলফা: {backtest.horizons.d10.excess > 0 ? `+${backtest.horizons.d10.excess.toFixed(2)}%` : `${backtest.horizons.d10.excess.toFixed(2)}%`}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400 font-semibold block">২০ কার্যদিবস (20-Day Hold)</span>
                    <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
                      {backtest.horizons.d20.net > 0 ? `+${backtest.horizons.d20.net.toFixed(2)}%` : `${backtest.horizons.d20.net.toFixed(2)}%`}
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      অতিরিক্ত আলফা: {backtest.horizons.d20.excess > 0 ? `+${backtest.horizons.d20.excess.toFixed(2)}%` : `${backtest.horizons.d20.excess.toFixed(2)}%`}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400 font-semibold block">৪০ কার্যদিবস (40-Day Hold)</span>
                    <div className="text-lg font-bold font-mono text-blue-400 mt-1">
                      {backtest.horizons.d40.net > 0 ? `+${backtest.horizons.d40.net.toFixed(2)}%` : `${backtest.horizons.d40.net.toFixed(2)}%`}
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      অতিরিক্ত আলফা: {backtest.horizons.d40.excess > 0 ? `+${backtest.horizons.d40.excess.toFixed(2)}%` : `${backtest.horizons.d40.excess.toFixed(2)}%`}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-slate-900/60 rounded-lg text-xs text-slate-300">
                  <strong className="text-amber-400">অপটিমাল হোল্ডিং পিরিয়ড: </strong>
                  <span>{tab.backtest.bestHorizon}। অতিরিক্ত দীর্ঘমেয়াদে অন্ধভাবে ধরে না রেখে লক্ষ্যমাত্রায় পৌঁছালে লাভ লক করা শ্রেয়।</span>
                </div>
              </div>
            </div>
          )}

          {activeTabSubView === 'stocks' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>আজকের বাজারে এই কৌশলের সংকেতপ্রাপ্ত শেয়ারসমূহ</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 text-xs font-mono">
                    {matchingStocks.length}টি শেয়ার
                  </span>
                </h4>
              </div>

              {matchingStocks.length === 0 ? (
                <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400">
                  <p className="text-sm">আজকের বাজার ক্লোজিং ডেটাতে এই নির্দিষ্ট ট্যাবের শতভাগ শর্ত পূরণ করা কোনো ফ্রেশ শেয়ার নেই।</p>
                  <p className="text-xs text-slate-500 mt-1">
                    কড়া ফিল্টারিং থাকার কারণে অযাচিত বা ঝুঁকিপূর্ণ স্টকে প্রবেশ রোধ হয়।
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left font-mono">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3 font-sans">স্টক কোড / সেক্টর</th>
                        <th className="py-2.5 px-3 text-right">দর (LTP)</th>
                        <th className="py-2.5 px-3 text-right">পরিবর্তন %</th>
                        <th className="py-2.5 px-3 font-sans">ওয়াইকফ ফেজ</th>
                        <th className="py-2.5 px-3 text-right">এন্ট্রি</th>
                        <th className="py-2.5 px-3 text-right">স্টপ-লস</th>
                        <th className="py-2.5 px-3 text-right">টার্গেট</th>
                        <th className="py-2.5 px-3 text-right">RRR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {matchingStocks.map((stock) => (
                        <tr key={stock.c} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 font-sans">
                            <strong className="text-white block">{stock.c}</strong>
                            <span className="text-[10px] text-slate-400">{stock.s}</span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-200">
                            ৳{stock.cl}
                          </td>
                          <td className={`py-2.5 px-3 text-right font-bold ${
                            stock.ch > 0 ? 'text-emerald-400' : stock.ch < 0 ? 'text-red-400' : 'text-slate-400'
                          }`}>
                            {stock.ch > 0 ? `+${stock.ch}%` : `${stock.ch}%`}
                          </td>
                          <td className="py-2.5 px-3 font-sans">
                            <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-blue-300">
                              {stock.p}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-300">
                            ৳{stock.en || stock.cl}
                          </td>
                          <td className="py-2.5 px-3 text-right text-red-400">
                            ৳{stock.sl || '–'}
                          </td>
                          <td className="py-2.5 px-3 text-right text-emerald-400">
                            ৳{stock.tg || '–'}
                          </td>
                          <td className="py-2.5 px-3 text-right text-amber-400 font-bold">
                            ১:{stock.rr || '–'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3 flex-wrap">
          <button
            onClick={() => onOpenSimulatorWithTab(tab)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>এই কৌশল দিয়ে পোর্টফোলিও লাভ সিমুলেট করুন</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
