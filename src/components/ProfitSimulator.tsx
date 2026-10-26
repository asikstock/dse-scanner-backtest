import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Percent, 
  ShieldCheck, 
  Sparkles, 
  RotateCcw, 
  DollarSign,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { ScannerTabConfig } from '../types/scanner';

interface ProfitSimulatorProps {
  tabs: ScannerTabConfig[];
  defaultTabKey?: string;
  onSelectTab: (tab: ScannerTabConfig) => void;
}

export const ProfitSimulator: React.FC<ProfitSimulatorProps> = ({
  tabs,
  defaultTabKey = '__prime',
  onSelectTab
}) => {
  const [selectedKey, setSelectedKey] = useState<string>(defaultTabKey);
  const [capital, setCapital] = useState<number>(100000);
  const [riskPct, setRiskPct] = useState<number>(2.0); // 2% per trade
  const [totalTrades, setTotalTrades] = useState<number>(30);

  const currentTab = useMemo(() => {
    return tabs.find(t => t.key === selectedKey) || tabs[0];
  }, [tabs, selectedKey]);

  // Simulation calculations based on historical parameters
  const simulationResults = useMemo(() => {
    const winRate = currentTab.backtest.winRate / 100;
    const avgR = currentTab.backtest.avgR; // realized R multiple
    const costPerTrade = 0.004; // 0.4% DSE brokerage cost

    const riskAmount = capital * (riskPct / 100);
    const winReward = riskAmount * avgR * (1 - costPerTrade);
    const lossAmount = riskAmount * (1 + costPerTrade);

    // Expected Value per trade
    const expectedValue = (winRate * winReward) - ((1 - winRate) * lossAmount);
    const expectedReturnPctPerTrade = (expectedValue / capital) * 100;

    // Compound simulation
    let currentCapital = capital;
    const equityPath: { trade: number; equity: number }[] = [
      { trade: 0, equity: capital }
    ];

    const winsCount = Math.round(totalTrades * winRate);
    const lossCount = totalTrades - winsCount;

    // Deterministic geometric expectation progression
    for (let t = 1; t <= totalTrades; t++) {
      const stepRisk = currentCapital * (riskPct / 100);
      const stepExpectedGrowth = (winRate * stepRisk * avgR) - ((1 - winRate) * stepRisk);
      currentCapital += stepExpectedGrowth;
      equityPath.push({ trade: t, equity: Math.round(currentCapital) });
    }

    const totalProfit = currentCapital - capital;
    const totalReturnPct = (totalProfit / capital) * 100;

    return {
      finalCapital: Math.round(currentCapital),
      totalProfit: Math.round(totalProfit),
      totalReturnPct: Number(totalReturnPct.toFixed(1)),
      expectedValue: Math.round(expectedValue),
      expectedReturnPctPerTrade: Number(expectedReturnPctPerTrade.toFixed(2)),
      winsCount,
      lossCount,
      equityPath
    };
  }, [capital, riskPct, totalTrades, currentTab]);

  // SVG Chart calculation
  const svgWidth = 600;
  const svgHeight = 180;
  const maxEq = Math.max(...simulationResults.equityPath.map(p => p.equity), capital * 1.1);
  const minEq = Math.min(...simulationResults.equityPath.map(p => p.equity), capital * 0.9);
  const eqRange = maxEq - minEq || 1;

  const points = simulationResults.equityPath.map((pt, i) => {
    const x = (i / (simulationResults.equityPath.length - 1)) * svgWidth;
    const y = svgHeight - ((pt.equity - minEq) / eqRange) * (svgHeight - 40) - 20;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl mb-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-400" />
            <span>পোর্টফোলিও ট্রেড সিমুলেটর ও লাভ প্রজেকশন</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            আপনার পুঁজিতে স্ক্যানারের বিভিন্ন স্ট্র্যাটেজির ঐতিহাসিক সম্ভাব্যতা ও কম্পাউন্ডিং গ্রোথ হিসাব করুন
          </p>
        </div>

        <button
          onClick={() => {
            setCapital(100000);
            setRiskPct(2.0);
            setTotalTrades(30);
            setSelectedKey('__prime');
          }}
          className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>রিসেট ডিফল্ট</span>
        </button>
      </div>

      {/* Simulator Inputs & Strategy Selector */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
        {/* Strategy Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            ট্রেডিং কৌশল / স্ক্যানার ট্যাব:
          </label>
          <select
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-blue-500"
          >
            {tabs.map((t) => (
              <option key={t.key} value={t.key}>
                #{t.rank} {t.label} (R: +{t.backtest.avgR} R | Win: {t.backtest.winRate}%)
              </option>
            ))}
          </select>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {currentTab.badge}
          </span>
        </div>

        {/* Initial Capital */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            শুরু করার মোট পুঁজি (৳ BDT):
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-500 text-xs">৳</span>
            <input
              type="number"
              min="10000"
              step="10000"
              value={capital}
              onChange={(e) => setCapital(Math.max(1000, Number(e.target.value)))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-7 pr-3 py-2 text-xs font-mono font-bold text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-1 mt-1.5">
            {[50000, 100000, 500000].map((amt) => (
              <button
                key={amt}
                onClick={() => setCapital(amt)}
                className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                  capital === amt ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                ৳{(amt / 1000)}k
              </button>
            ))}
          </div>
        </div>

        {/* Risk Per Trade */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            প্রতি ট্রেডে গৃহীত সর্বোচ্চ ঝুঁকি (Risk %):
          </label>
          <div className="relative">
            <input
              type="number"
              min="0.5"
              max="10"
              step="0.5"
              value={riskPct}
              onChange={(e) => setRiskPct(Math.max(0.5, Number(e.target.value)))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-100 focus:outline-none focus:border-blue-500"
            />
            <span className="absolute right-3 top-2 text-slate-500 text-xs font-mono">%</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            ট্রেডপ্রতি স্টপ লস বাজেট: <strong>৳{Math.round(capital * (riskPct / 100)).toLocaleString()}</strong>
          </span>
        </div>

        {/* Trade Quantity */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            পরিকল্পিত ট্রেড সংখ্যা:
          </label>
          <input
            type="number"
            min="5"
            max="100"
            step="5"
            value={totalTrades}
            onChange={(e) => setTotalTrades(Math.max(5, Number(e.target.value)))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-100 focus:outline-none focus:border-blue-500"
          />
          <div className="flex items-center gap-1 mt-1.5">
            {[10, 20, 30, 50].map((t) => (
              <button
                key={t}
                onClick={() => setTotalTrades(t)}
                className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                  totalTrades === t ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}টি
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Simulation Result KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">প্রজেক্টেড মোট ক্যাপিটাল</span>
          <div className={`text-xl sm:text-2xl font-black font-mono ${
            simulationResults.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
          }`}>
            ৳{simulationResults.finalCapital.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            শুরু: ৳{capital.toLocaleString()}
          </span>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">মোট আনুমানিক মুনাফা</span>
          <div className={`text-xl sm:text-2xl font-black font-mono ${
            simulationResults.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {simulationResults.totalProfit >= 0 ? `+৳${simulationResults.totalProfit.toLocaleString()}` : `-৳${Math.abs(simulationResults.totalProfit).toLocaleString()}`}
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-400">
            {simulationResults.totalReturnPct >= 0 ? `+${simulationResults.totalReturnPct}%` : `${simulationResults.totalReturnPct}%`}
          </span>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">প্রত্যাশিত লাভ প্রতি ট্রেডে (EV)</span>
          <div className="text-xl sm:text-2xl font-black font-mono text-amber-400">
            {simulationResults.expectedValue >= 0 ? `+৳${simulationResults.expectedValue.toLocaleString()}` : `-৳${Math.abs(simulationResults.expectedValue).toLocaleString()}`}
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {simulationResults.expectedReturnPctPerTrade}% / ট্রেড
          </span>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">ট্রেড আউটকাম পরিসংখ্যান</span>
          <div className="text-xl sm:text-2xl font-black font-mono text-blue-400">
            {simulationResults.winsCount} জয় / {simulationResults.lossCount} ক্ষতি
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            উইন রেট: {currentTab.backtest.winRate}% (গড় R: {currentTab.backtest.avgR} R)
          </span>
        </div>
      </div>

      {/* SVG Growth Chart */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {totalTrades}টি ট্রেডে চক্রবৃদ্ধি পোর্টফোলিও অগ্রগতি (Simulated Growth Curve)
          </span>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            +{simulationResults.totalReturnPct}% প্রজেক্টেড গ্রোথ
          </span>
        </div>

        <div className="h-44 w-full relative pt-2">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <polygon
              points={`0,${svgHeight} ${points} ${svgWidth},${svgHeight}`}
              fill="url(#simGrad)"
            />
            <polyline
              fill="none"
              stroke={simulationResults.totalProfit >= 0 ? '#10b981' : '#ef4444'}
              strokeWidth="2.5"
              points={points}
            />
          </svg>
        </div>
      </div>

      {/* Simulator Takeaway */}
      <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          <strong className="text-white block mb-0.5 font-bold">
            গাণিতিক শিক্ষা: কেন ৪৮% উইন রেটেও এই স্ট্র্যাটেজি সর্বোচ্চ প্রফিটেবল?
          </strong>
          ডিএসইতে সাধারণ ট্রেডাররা ৭০-৮০% উইন রেটের বৃথা খোঁজ করে। কিন্তু প্রাইম স্ট্র্যাটেজিতে উইন রেট ৪৮.৫% হলেও
          প্রতি বিজয়ী ট্রেডে লাভ গড়ে <strong>+{currentTab.backtest.avgR} গুণ (R-Multiple)</strong>। এর ফলে ১০০টি ট্রেডের পর
          ৫১টি ট্রেডে স্টপ লস হলেও বাকি ৪৯টি ট্রেডের বিশাল মুনাফা দিয়ে পোর্টফোলিও ২ থেকে ৩ গুণ পর্যন্ত বৃদ্ধি পায়!
        </div>
      </div>
    </div>
  );
};
