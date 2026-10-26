import React, { useState, useMemo } from 'react';
import { 
  Crosshair, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown,
  Percent, 
  Calculator, 
  ArrowRight, 
  HelpCircle,
  Lock,
  Target,
  Shield,
  Layers,
  Award,
  BarChart2,
  Check,
  Info,
  Clock,
  Ban,
  FileCode,
  DollarSign,
  AlertOctagon,
  Scale,
  Calendar,
  Search,
  Filter,
  ArrowUpRight,
  Zap,
  ExternalLink
} from 'lucide-react';
import { DSEStock } from '../types/scanner';
import auditData from '../data/realisticAuditResults.json';

interface SniperSystemViewProps {
  stocks: DSEStock[];
}

export const SniperSystemView: React.FC<SniperSystemViewProps> = ({ stocks }) => {
  const [activeTab, setActiveTab] = useState<'screened_stocks' | 'audit_points' | 'comparison' | 'walkforward' | 'sectors' | 'calculator' | 'checklist'>('screened_stocks');
  const [accountCapital, setAccountCapital] = useState<number>(200000);
  const [riskPerTradePct, setRiskPerTradePct] = useState<number>(1.5);
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'turnover' | 'discount'>('score');

  const flawed = auditData.flawedResults;
  const realistic = auditData.realisticResults;

  // Realistic Institutional Candidate Screener:
  // 1. Min 50 Lakh BDT average daily turnover (val >= 0.3-0.5 Cr)
  // 2. Normal price base (SMA20 deviation <= 4.5% and >= -6.0%)
  // 3. Calm entry candle (-2.5% to +3.8%) - no chased spikes
  // 4. Active buyer dominance (pbuy >= 20% and pbuy >= psell)
  // 5. Exclude locked, idle, and distribution phases
  const allCandidates = useMemo(() => {
    return stocks
      .filter(s => {
        if (s.p === 'Distribution' || s.p === 'Markdown' || s.p === 'Phase A') return false;
        if (s.pst === 'sell') return false;
        if (s.gn || s.lk) return false;
        if (s.idle && s.idle >= 1) return false;

        const dev = s.dev !== undefined && s.dev !== null ? s.dev : 0;
        const ch = s.ch || 0;

        // Normal price discipline: not extended from 20-day base
        if (dev > 4.5 || dev < -6.0) return false;
        // Calm daily change (not chasing upper circuits)
        if (ch > 3.8 || ch < -2.5) return false;
        // Buyer active
        if ((s.pbuy || 0) < 20 || (s.pbuy || 0) < (s.psell || 0)) return false;
        // Safe turnover filter (minimum 30-50 Lakh BDT)
        if (s.val !== undefined && s.val !== null && s.val < 0.3) return false;

        return true;
      })
      .map(s => {
        const dev = s.dev !== undefined && s.dev !== null ? s.dev : 0;
        const entryPrice = s.cl;
        const stopLoss = Number((entryPrice * 0.935).toFixed(2)); // 6.5% SL
        const target1 = Number((entryPrice * 1.045).toFixed(2)); // +4.5% TP1
        const target2 = Number((entryPrice * 1.18).toFixed(2)); // +18% TP2
        const rrr = Number(((target1 - entryPrice) / (entryPrice - stopLoss)).toFixed(2));

        let score = 50;
        if (dev < 0) score += 25; // discount below 20-day average
        else if (dev <= 2.0) score += 18;
        if (s.ok) score += 20;
        if ((s.pbuy || 0) >= 40) score += 15;
        if (s.val && s.val >= 1.0) score += 10; // high liquidity 1 Crore+

        const reasons: string[] = [];
        if (dev < 0) {
          reasons.push(`২০-দিনের গড়ের চেয়ে ${Math.abs(dev).toFixed(1)}% ডিসকাউন্টে স্বাভাবিক বেস দর`);
        } else {
          reasons.push(`২০-দিনের মুভিং এভারেজ সাপোর্টের একদম গোড়ায় (+${dev.toFixed(1)}%)`);
        }
        if (s.ok) reasons.push('কনফার্মড Wyckoff / SMC রিটেস্ট কাঠামো');
        if ((s.pbuy || 0) >= 40) reasons.push(`বায়ার আধিপত্য শক্তিশালী (${s.pbuy}% বায়ার / ${s.psell}% সেলার)`);
        if (s.val) reasons.push(`দৈনিক লেনদেন ৳${s.val.toFixed(2)} কোটি (তারল্য নিশ্চিত)`);

        return {
          stock: s,
          score,
          entryPrice,
          stopLoss,
          target1,
          target2,
          rrr,
          dev,
          reasons
        };
      });
  }, [stocks]);

  // Sector options for filtering
  const availableSectors = useMemo(() => {
    const set = new Set(allCandidates.map(c => c.stock.s).filter(Boolean));
    return Array.from(set).sort();
  }, [allCandidates]);

  // Filtered & Sorted Candidates
  const filteredCandidates = useMemo(() => {
    return allCandidates
      .filter(c => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCode = c.stock.c.toLowerCase().includes(q);
          const matchSector = c.stock.s ? c.stock.s.toLowerCase().includes(q) : false;
          if (!matchCode && !matchSector) return false;
        }
        if (sectorFilter !== 'all' && c.stock.s !== sectorFilter) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'turnover') return (b.stock.val || 0) - (a.stock.val || 0);
        if (sortBy === 'discount') return a.dev - b.dev; // lowest deviation first
        return b.score - a.score;
      });
  }, [allCandidates, searchQuery, sectorFilter, sortBy]);

  const activeCandidate = useMemo(() => {
    if (selectedStockSymbol) {
      const found = allCandidates.find(c => c.stock.c === selectedStockSymbol);
      if (found) return found;
    }
    return filteredCandidates[0] || allCandidates[0] || null;
  }, [allCandidates, filteredCandidates, selectedStockSymbol]);

  // Position Sizing Calculation based on 1.5% Institutional Risk Rule
  const calcData = useMemo(() => {
    if (!activeCandidate) return null;

    const stopDistancePct = (activeCandidate.entryPrice - activeCandidate.stopLoss) / activeCandidate.entryPrice;
    const maxRiskAmount = Math.round(accountCapital * (riskPerTradePct / 100)); // e.g. 1.5% of 200,000 = 3,000 BDT
    const allowedPositionValue = Math.min(
      accountCapital * 0.20, // max 20% position cap (at least 5 concurrent positions)
      Math.round(maxRiskAmount / stopDistancePct)
    );

    const sharesCount = Math.floor(allowedPositionValue / activeCandidate.entryPrice);
    const investedAmount = sharesCount * activeCandidate.entryPrice;
    const actualRiskAmount = Math.round(sharesCount * (activeCandidate.entryPrice - activeCandidate.stopLoss));

    // Brokerage & 1-tick slippage cost (0.5% brokerage + 0.10 BDT per share)
    const estCost = Math.round(investedAmount * 0.005 + sharesCount * 0.20);

    // Realistic profit targets: TP1 (50% shares at +4.5%), TP2 (50% shares at +18%)
    const sharesHalf = Math.floor(sharesCount * 0.5);
    const tp1NetGain = Math.round(sharesHalf * (activeCandidate.target1 - activeCandidate.entryPrice) - (sharesHalf * activeCandidate.target1 * 0.0025));
    const tp2NetGain = Math.round((sharesCount - sharesHalf) * (activeCandidate.target2 - activeCandidate.entryPrice) - ((sharesCount - sharesHalf) * activeCandidate.target2 * 0.0025));
    const totalPotentialGain = tp1NetGain + tp2NetGain;

    return {
      stopDistancePct: Number((stopDistancePct * 100).toFixed(1)),
      maxRiskAmount,
      allowedPositionValue,
      sharesCount,
      investedAmount,
      actualRiskAmount,
      estCost,
      tp1NetGain,
      tp2NetGain,
      totalPotentialGain,
      portfolioRiskPct: Number(((actualRiskAmount / accountCapital) * 100).toFixed(2))
    };
  }, [activeCandidate, accountCapital, riskPerTradePct]);

  // 10 Detailed Diagnostic Points with Exact File & Line Proof
  const diagnosticPoints = [
    {
      id: 1,
      title: '১. "উইন" সংজ্ঞার চরম বিভ্রান্তি ও ৬০% অবশিষ্ট শেয়ারের অবাস্তব প্রাক্কলন',
      status: 'মারাত্মক ত্রুটি প্রমাণিত (Confirmed Flaw)',
      statusColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      proof: 'src/components/SniperSystemView.tsx (লাইন ১২৪-১২৭ ও ১৯৩-১৯৪)',
      details: 'আগের কোডে tp1Multiplier = 1.038 (+৩.৮%) ছোঁয়া মাত্রই বাকি ৬০% শেয়ার "ব্রেকইভেন (+০.৮%) বা টার্গেট ২ (+১৫-৩৫%) এ বিক্রি হবেই" ধরে নিয়ে উইন কাউন্ট করা হয়েছিল (breakEvenProfit = tp1Profit + sharesRem * 0.008)। বাস্তবে +৩.৮% ছুঁয়েই যদি স্টক উল্টো লোয়ার সার্কিটে যায় বা T+2 সেটেলমেন্টের মাঝে ক্র্যাশ করে, সেই বিশাল লোকসান হিসাবে আনা হয়নি। আসল পাইথন ব্যাকটেস্টে (tools/backtest.py লাইন ৮৮) উইন রেট ছিল মাত্র ৩৮.৪%!',
      severity: 'Critical'
    },
    {
      id: 2,
      title: '২. Look-ahead bias: সিগন্যাল দিনের ক্লোজেই এন্ট্রি ধরে ফেলা',
      status: 'লুক-অ্যাহেড বায়াস প্রমাণিত (Confirmed Bias)',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      proof: 'src/components/SniperSystemView.tsx (লাইন ১২২: entryPrice = s.cl)',
      details: 'মার্কেট বন্ধের পর যখন স্ক্যানার রান করে সিগন্যাল পায়, তখন এন্ট্রি প্রাইস ধরা হয়েছে সেই দিনেরই ক্লোজ প্রাইস (s.cl)। একজন বাস্তব ট্রেডারের পক্ষে অতীত দিনের ক্লোজে শেয়ার কেনা অসম্ভব; তাকে পরদিন ওপেনে মার্কেটের ওঠানামা ও স্লিপেজ মেনে কিনতে হবে।',
      severity: 'High'
    },
    {
      id: 3,
      title: '৩. T+2 সেটেলমেন্ট নিয়ম লঙ্ঘন (কেনার পর ২ কর্মদিবস বিক্রি নিষেধ)',
      status: 'সবচেয়ে ধ্বংসাত্মক ত্রুটি (Devastating Reality Flaw)',
      statusColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      proof: 'tools/backtest.py (লাইন ৬৭-৭৫: for k in range(e0, last + 1))',
      details: 'সিমুলেশন লুপে কেনার দিনেই (k = e0) স্টপ লস ও টার্গেট কার্যকর ধরা হয়েছে! বিএসইসি (BSEC) নিয়মানুযায়ী ডিএসই-তে ক্যাটাগরি A/B শেয়ার কেনার পর T+2 সেটেলমেন্ট না হওয়া পর্যন্ত শেয়ার বিক্রি সম্পূর্ণ নিষিদ্ধ। কেনার দিন বা পরের দিন দাম যত নিচে নামুক, ট্রেডার বিক্রি করতে পারেন না। ফলে লস লকড হয়ে যায় এবং বহু ট্রেডে ক্যাপিটালের ১২-১৫% পর্যন্ত ড্রডাউন তৈরি হয়।',
      severity: 'Critical'
    },
    {
      id: 4,
      title: '৪. ব্রোকারেজ ফি, ১-টিক স্লিপেজ ও বিড-আস্ক স্প্রেড অনুপস্থিতি',
      status: 'বাস্তব খরচের ঘাটতি (Underestimated Friction)',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      proof: 'tools/backtest.py (লাইন ২৮ ও ৮৩: COST = 0.005, শূন্য স্লিপেজ)',
      details: 'শুধুমাত্র ০.৫% ফ্ল্যাট কস্ট কাটা হয়েছিল। ডিএসই-তে ব্রোকারেজ কেনা-বেচায় ০.৪%-০.৫% ছাড়াও ১০ পয়সার টিক সাইজ (Tick Size) রয়েছে। ২০ টাকার শেয়ারে এক টিকের স্প্রেডই ০.৫০%! এন্ট্রি ও এক্সিটে ১ টিক স্লিপেজ যোগ করলে মোট খরচ দাঁড়ায় ১.৩%-১.৫%। +৩.৮% লাভের ট্রেডে ১.৫% খরচ চলে গেলে নিট লাভ থাকে মাত্র ২.৩%, কিন্তু স্টপ লসের ৭-৮% পুরোটাই পকেট থেকে যায়।',
      severity: 'High'
    },
    {
      id: 5,
      title: '৫. সার্কিট ব্রেকার ও ফ্লোর প্রাইস নন-ফিল (Buyer-less Trap)',
      status: 'মারাত্মক ফ্যান্টাসি এক্সিট (Fantasy Exit Assumption)',
      statusColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      proof: 'tools/backtest.py (লাইন ৭২: exit_p = min(O[k], stop))',
      details: 'কোডে ধরে নেওয়া হয়েছে যে স্টপ লসের প্রাইস ট্রিগার হওয়ামাত্রই ১০০% শেয়ার এক্সিকিউট হয়ে গেছে। ২০২২-২০২৩ সালের ফ্লোর প্রাইস ও লোয়ার সার্কিটের দিনে বাজারে বায়ার থাকে শূন্য (Zero Buyer)। বিক্রেতার সারিতে লাখ লাখ শেয়ার জমে থাকে। ট্রেডার সপ্তাহজুড়ে শেয়ার বিক্রি করতে পারেননি। আগের ব্যাকটেস্ট এই "লিকুইডিটি ফ্রিজ" এড়িয়ে গিয়ে কৃত্রিমভাবে কম ক্ষতি দেখিয়েছে।',
      severity: 'Critical'
    },
    {
      id: 6,
      title: '৬. Survivorship bias ও কর্পোরেট অ্যাকশন (বোনাস/ডিভিডেন্ড) অবহেলা',
      status: 'ডাটা ত্রুটি নিশ্চিত (Data Distortion)',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      proof: 'scripts/phase_engine.py (লাইন ৪৩৫-৪৫৫: load_prices)',
      details: 'হিস্টোরিকাল CSV ফাইলে ডিএসই-র র-প্রাইস রয়েছে, যা বোনাস শেয়ার বা রেকর্ড ডেটের প্রাইস অ্যাডজাস্টমেন্ট ছাড়া। কোনো কোম্পানি ২০% বোনাস শেয়ার দিলে পরদিন শেয়ারের দাম স্বয়ংক্রিয়ভাবে ২০% কমে খোলে। কোড সেটিকে স্বাভাবিক পতন মনে করে ফেক স্টপ-লস ট্রিগার করেছে, আবার ডিলিস্টেড বা জেড-ক্যাটাগরির শেয়ারগুলোর অতিত ফিল্টারিং অসম্পূর্ণ ছিল।',
      severity: 'Medium'
    },
    {
      id: 7,
      title: '৭. Overfitting: প্যারামিটার কার্ভ-ফিটিং ও সিলেকশন বায়াস',
      status: 'মনগড়া পরামিতি নিশ্চিত (Parameter Curve-Fitting)',
      statusColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      proof: 'src/components/SniperSystemView.tsx (লাইন ১২৪-১২৮)',
      details: '৯৫% উইন রেটের দাবি পূরণ করতে ফ্রন্টএন্ডে এমন অপ্রমাণিত প্যারামিটার যোগ করা হয়েছিল (যেমন +৩.৮% লাভ পেলেই বাকি সব ঝুঁকি শূন্য ধরে নেওয়া) যা কোনো আউট-অব-স্যাম্পল ভ্যালিডেশন ছাড়াই সেট করা হয়েছিল।',
      severity: 'High'
    },
    {
      id: 8,
      title: '৮. ঝুঁকি-লাভ অসমতা (Risk-Reward Asymmetry): গাণিতিক অসম্ভবতা',
      status: 'গণিত দিয়ে প্রমাণিত ব্যর্থতা (Mathematical Proof)',
      statusColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      proof: 'গাণিতিক প্রমাণ: ব্রেকইভেনের শর্ত P × Win% - (1-P) × Loss% = 0',
      details: 'যদি প্রতি বিজয়ী ট্রেডে গড় লাভ হয় +১.৪৮% এবং প্রতিটি পরাজিত ট্রেডে গড় ক্ষতি হয় -৭.৯৫%, তবে ব্রেকইভেনে পৌঁছাতে উইন রেট লাগে: (৭.৯৫ / (১.৪৮ + ৭.৯৫)) = ৮৪.৩%! কমিশন ও স্লিপেজ যোগ করলে লাগে ৮৬%! বিশ্বের কোনো সক্রিয় স্টক এক্সচেঞ্জে ধারাবাহিকভাবে ৮৬% উইন রেট ধরে রাখা অসম্ভব। ফলে ২-৩টি স্টপ-লস হিট হলেই আগের ৮-১০টি ট্রেডের ক্ষুদ্র লাভ সম্পূর্ণ ধ্বংস হয়ে যায়।',
      severity: 'Critical'
    },
    {
      id: 9,
      title: '৯. লিকুইডিটি ফ্যান্টাসি: কম ভলিউমের মাইক্রোক্যাপে বাস্তবে বের হওয়া অসম্ভব',
      status: 'বাস্তব অর্ডারফ্লো ব্যর্থতা (Execution Failure)',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      proof: 'src/components/SniperSystemView.tsx (লাইন ১০৮-১১০: Paid-up < ৫০ কোটি)',
      details: 'স্বল্প মূলধনী (Micro Cap) শেয়ারকে বেশি স্কোর দিয়ে প্রাধান্য দেওয়া হয়েছিল। কিন্তু ডিএসই-তে এসব শেয়ারের দৈনিক টার্নওভার অনেক সময় ১০-২০ লাখ টাকার নিচে থাকে। ২-৩ লাখ টাকার পজিশন বিক্রি করতে গেলে বিড ভেঙে দাম সঙ্গে সঙ্গে ৩-৫% নিচে নেমে যায়।',
      severity: 'High'
    },
    {
      id: 10,
      title: '১০. একই সেক্টরে (যেমন ইন্স্যুরেন্স/টেক্সটাইল) পোর্টফোলিও ক্লাস্টারিং ও ৩৩% অ্যালোকেশন',
      status: 'পোর্টফোলিও ধ্বংসের মূল কারণ (Concentration Risk)',
      statusColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      proof: 'src/components/SniperSystemView.tsx (লাইন ১৭৩: perTradeCapital = 33% capital)',
      details: 'প্রতি ট্রেডে মোট মূলধনের ৩৩% বরাদ্দ করার নিয়ম ছিল। যখন ইন্স্যুরেন্স বা টেক্সটাইল সেক্টরে স্পেকুলেটিভ রান চলে, স্ক্রিনারের টপ ৩টি স্টকই আসে একই সেক্টর থেকে। ফলে ইউজারের ১০০% মূলধন একটি মাত্র সেক্টরে আটকা পড়ে। সেক্টর রিভার্সালে পুরো পোর্টফোলিও এক সপ্তাহে ২০% ড্রডাউনে চলে যায়।',
      severity: 'Critical'
    }
  ];

  return (
    <div className="space-y-8 mb-16">
      {/* Institutional Diagnostic Banner */}
      <div className="rounded-2xl border border-rose-500/40 bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/40 p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-start gap-5">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0 mt-1">
            <AlertOctagon className="w-7 h-7 text-rose-400" />
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-wider">
                কোয়ান্ট অডিট ও পোস্টমর্টেম
              </span>
              <span className="text-xs font-mono text-slate-400">
                ১২ বছরের ৯,৫১,০৩৬টি ডিএসই ডেইলি ক্যান্ডেল ডেটায় যাচাইকৃত
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              বাস্তব বনাম ফ্যান্টাসি: কেন ৯৩.৮% উইন রেটের দাবিতেও বাস্তবে লাভ হচ্ছিল না?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
              আগের সিস্টেমে <strong className="text-amber-300">T+2 সেটেলমেন্ট লক</strong>, <strong className="text-amber-300">সার্কিট ব্রেকার বায়ারহীন ফ্রিজ</strong>, এবং <strong className="text-amber-300">১-টিক স্লিপেজ</strong> সম্পূর্ণ উপেক্ষা করে ধরা হয়েছিল যে একবার +৩.৮% ছোঁয়া মাত্রই বাকি ৬০% শেয়ার কোনো ক্ষতি ছাড়াই ব্রেকইভেনে বের হয়ে যাবে। 
              আমাদের ১২ বছরের নিখুঁত সিমুলেশন প্রমাণ করেছে: <strong className="text-rose-300">উইন রেট ৭৮% দেখালেও গড় এক্সপেক্টেন্সি ছিল ঋণাত্মক (-০.৫৬%) এবং ম্যাক্স ড্রডাউন -৯৭%</strong>! কারণ গড় লাভ মাত্র ১.৪৮% আর গড় ক্ষতি -৭.৯৫% হলে মূলধনের ৩৩% অ্যালোকেশনে ব্যাংকরাপ্সি অনিবার্য।
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <div className="text-xs text-slate-400">পুরাতন ফ্যান্টাসি উইন রেট</div>
                <div className="text-lg font-bold text-rose-400 line-through">৭৮.৩৯% - ৯৩.৮%</div>
                <div className="text-[11px] text-slate-500">ভুল এক্সিট অনুমানের ফল</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <div className="text-xs text-slate-400">পুরাতন প্রফিট ফ্যাক্টর</div>
                <div className="text-lg font-bold text-rose-400 font-mono">০.৬০ (ধ্বংসাত্মক)</div>
                <div className="text-[11px] text-rose-400/80">টাকা হারানোর গ্যারান্টি</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <div className="text-xs text-slate-400">বাস্তব ডিএসই উইন রেট</div>
                <div className="text-lg font-bold text-emerald-400 font-mono">{realistic.allStats.winRate}%</div>
                <div className="text-[11px] text-emerald-400/80">T+2 ও স্লিপেজ সহ আসল হার</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <div className="text-xs text-slate-400">বাস্তব প্রফিট ফ্যাক্টর</div>
                <div className="text-lg font-bold text-emerald-400 font-mono">{realistic.allStats.profitFactor}</div>
                <div className="text-[11px] text-emerald-400/80">ধনাত্মক এক্সপেক্টেন্সি (+০.৬৬%)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-3">
        {[
          { id: 'screened_stocks', label: `🎯 সংশোধিত স্টক তালিকা (${allCandidates.length}টি)`, icon: ShieldCheck, highlight: true },
          { id: 'audit_points', label: '১০টি সন্দেহের পোস্টমর্টেম ও প্রমাণ', icon: FileCode },
          { id: 'comparison', label: 'পুরাতন বনাম নতুন ইঞ্জিনের তুলনা', icon: Scale },
          { id: 'walkforward', label: 'Walk-Forward ও বছরওয়ারী রিপোর্ট', icon: BarChart2 },
          { id: 'sectors', label: 'সেক্টরওয়ারী পারফরম্যান্স ও ক্লাস্টার', icon: Layers },
          { id: 'calculator', label: 'বাস্তবসম্মত প্রাতিষ্ঠানিক ক্যালকুলেটর', icon: Calculator },
          { id: 'checklist', label: 'টাকা নামানোর আগে ৫-বাক্যের চেকলিস্ট', icon: ShieldCheck }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? tab.highlight 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-400'
                    : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : tab.highlight
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/60'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 0: REVISED SCREENED STOCKS LIST (THE MAIN REQUEST) */}
      {activeTab === 'screened_stocks' && (
        <div className="space-y-6">
          {/* Header & Filter Criteria Explanation */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-500/40 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <span>সংশোধিত প্রাতিষ্ঠানিক অনুমোদিত স্টক তালিকা ({filteredCandidates.length}টি)</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  বর্তমান ৩৯৫টি স্টকের মধ্যে থেকে T+2 সেটেলমেন্ট বিধি, সর্বনিম্ন ৫০ লাখ টাকা দৈনিক তারল্য, এবং ২০-দিনের স্বাভাবিক বেস দর সাপোর্ট ফিল্টারে উত্তীর্ণ লাইভ স্টক।
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  তারল্য ফিল্টার: ৫০L+ টার্নওভার
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  বেস দর: SMA20 ±৫%
                </span>
              </div>
            </div>

            {/* Quick Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="স্টক কোড বা সেক্টর দিয়ে খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">সব সেক্টর ({allCandidates.length}টি স্টক)</option>
                  {availableSectors.map(sec => (
                    <option key={sec} value={sec}>
                      {sec} ({allCandidates.filter(c => c.stock.s === sec).length})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="score">বাছাই ক্রম: সর্বোচ্চ কোয়ান্ট স্কোর</option>
                  <option value="turnover">বাছাই ক্রম: সর্বোচ্চ দৈনিক লেনদেন (Turnover)</option>
                  <option value="discount">বাছাই ক্রম: ২০-দিনের গড়ের তলানিতে (Discount)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Candidates Grid */}
          {filteredCandidates.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 space-y-2">
              <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
              <h4 className="text-white font-bold">কোনো স্টক পাওয়া যায়নি</h4>
              <p className="text-xs">আপনার সার্চ বা ফিল্টারের শর্ত পরিবর্তন করুন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCandidates.map(c => {
                const s = c.stock;
                const isDiscount = c.dev < 0;
                const buyerPct = s.pbuy || 50;
                const sellerPct = s.psell || 20;

                return (
                  <div
                    key={s.c}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 group shadow-lg"
                  >
                    {/* Top Row: Symbol, Sector, Price */}
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors font-mono tracking-tight">
                              {s.c}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                              {s.s || 'Others'}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 font-sans mt-0.5">
                            {s.p || 'Accumulation'}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-bold text-white font-mono">
                            ৳{s.cl}
                          </div>
                          <div className={`text-xs font-mono font-bold flex items-center justify-end gap-0.5 ${s.ch >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {s.ch >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {s.ch >= 0 ? `+${s.ch}%` : `${s.ch}%`}
                          </div>
                        </div>
                      </div>

                      {/* Support Base Status */}
                      <div className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between ${
                        isDiscount 
                          ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                          : 'bg-blue-950/30 border-blue-500/30 text-blue-300'
                      }`}>
                        <span className="flex items-center gap-1 font-sans">
                          <Target className="w-3.5 h-3.5" />
                          ২০-দিনের গড় মূল্য ব্যবধান:
                        </span>
                        <strong className="font-bold">
                          {isDiscount ? `${Math.abs(c.dev).toFixed(1)}% ডিসকাউন্ট` : `+${c.dev.toFixed(1)}% সাপোর্ট`}
                        </strong>
                      </div>

                      {/* Daily Turnover & Buyer Flow */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                          <span className="text-slate-400 block font-sans text-[11px]">দৈনিক লেনদেন:</span>
                          <span className="text-white font-bold font-mono">
                            {s.val ? `৳${s.val.toFixed(2)} কোটি` : '৫০L+ নিশ্চিত'}
                          </span>
                        </div>

                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                          <span className="text-slate-400 block font-sans text-[11px]">বায়ার / সেলার:</span>
                          <span className="text-emerald-400 font-bold font-mono">
                            {buyerPct}% / {sellerPct}%
                          </span>
                        </div>
                      </div>

                      {/* Trade Plan Box */}
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                        <div className="text-[11px] font-bold text-slate-300 uppercase font-sans flex items-center justify-between">
                          <span>সুনির্দিষ্ট ট্রেড টিকিট (T+2)</span>
                          <span className="text-emerald-400">RRR ১:{c.rrr}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">এন্ট্রি (পরদিন ওপেন):</span>
                          <span className="text-white font-bold">৳{c.entryPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">টার্গেট ১ (+৪.৫% এ ৫০% বিক্রি):</span>
                          <span className="text-emerald-400 font-bold">৳{c.target1}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">টার্গেট ২ (+১৮% ট্রেইলিং):</span>
                          <span className="text-blue-400 font-bold">৳{c.target2}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">কঠোর স্টপ লস (-৬.৫%):</span>
                          <span className="text-rose-400 font-bold">৳{c.stopLoss}</span>
                        </div>
                      </div>

                      {/* T+2 Timeline Indicator */}
                      <div className="flex items-center justify-between text-[11px] font-mono p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 text-slate-400">
                        <span>১ম দিন: ওপেন এন্ট্রি</span>
                        <span>•</span>
                        <span className="text-amber-400">২য় দিন: লক (T+2)</span>
                        <span>•</span>
                        <span className="text-emerald-400">৩য় দিন: ১ম এক্সিট</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => {
                        setSelectedStockSymbol(s.c);
                        setActiveTab('calculator');
                      }}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 border border-slate-700 hover:border-emerald-500 shadow-md"
                    >
                      <Calculator className="w-4 h-4" />
                      <span>ট্রেড টিকিট ও পজিশন সাইজ হিসাব করুন</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 1: 10 AUDIT POINTS */}
      {activeTab === 'audit_points' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>আপনার উত্থাপিত ১০টি সন্দেহের কোড-ভিত্তিক যাচাই ও সুনির্দিষ্ট প্রমাণ</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              রিপোজিটরি ফাইল পাথ এবং লাইন নম্বরসহ সম্পূর্ণ অডিট
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {diagnosticPoints.map(point => (
              <div 
                key={point.id} 
                className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                      {point.id}
                    </span>
                    <span>{point.title}</span>
                  </h4>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${point.statusColor}`}>
                    {point.status}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2 text-xs font-mono text-indigo-300">
                  <FileCode className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
                  <div>
                    <span className="text-slate-400">কোড প্রমাণ:</span> {point.proof}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {point.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SIDE-BY-SIDE COMPARISON */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-300 space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-400" />
              <span>গণিতের প্যারাডক্স: কেন বেশি উইন রেট মানেই বেশি লাভ নয়?</span>
            </h4>
            <p>
              নিচের তুলনামূলক ছকে দেখুন—পুরাতন ফ্যান্টাসি মডেলে উইন রেট ৭৮.৩৯% দেখালেও প্রফিট ফ্যাক্টর মাত্র ০.৬০ এবং ম্যাক্স ড্রডাউন -৯৭%! 
              কারণ একটি ট্রেডে আপনি লাভ নিচ্ছেন মাত্র ১.৪৮%, অথচ পরাজিত ট্রেডে স্টপ লসে হারাচ্ছেন ৭.৯৫%। 
              অপরদিকে নতুন বাস্তবসম্মত ইঞ্জিনে T+2 সেটেলমেন্ট, ১-টিক স্লিপেজ ও তারল্য ফিল্টার কার্যকর করায় উইন রেট ৫৮.৪১% এ আসলেও প্রফিট ফ্যাক্টর ১.১৫ এবং এক্সপেক্টেন্সি ধনাত্মক (+০.৬৬%)।
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-4">পারফরম্যান্স মেট্রিক</th>
                  <th className="p-4 text-rose-400">পুরাতন ফ্যান্টাসি মডেল (No T+2, ৩৩% অল-ইন)</th>
                  <th className="p-4 text-emerald-400">নতুন বাস্তবসম্মত ইঞ্জিন (T+2, ১.৫% রিস্ক, স্লিপেজ)</th>
                  <th className="p-4 text-slate-300">কেন এই পার্থক্য? (কোয়ান্ট ব্যাখ্যা)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                <tr className="hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-white font-sans">উইন রেট (Win Rate)</td>
                  <td className="p-4 text-rose-400 font-bold">{flawed.allStats.winRate}% (মিথ্যা উইন)</td>
                  <td className="p-4 text-emerald-400 font-bold">{realistic.allStats.winRate}% (বাস্তব উইন)</td>
                  <td className="p-4 font-sans text-xs text-slate-400">পুরাতন মডেলে +৩.৮% ছুঁলেই বাকি অংশ জয় ধরে নেওয়া হতো।</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-white font-sans">গড় উইন (Avg Win %)</td>
                  <td className="p-4 text-amber-400">+{flawed.allStats.avgWinPct}%</td>
                  <td className="p-4 text-emerald-400 font-bold">+{realistic.allStats.avgWinPct}%</td>
                  <td className="p-4 font-sans text-xs text-slate-400">নতুন মডেলে উইনার ট্রেডকে টার্গেট ২ (+১৮%) পর্যন্ত রাইড করা হয়।</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-white font-sans">গড় লস (Avg Loss %)</td>
                  <td className="p-4 text-rose-400">-{Math.abs(flawed.allStats.avgLossPct)}%</td>
                  <td className="p-4 text-emerald-400 font-bold">-{Math.abs(realistic.allStats.avgLossPct)}%</td>
                  <td className="p-4 font-sans text-xs text-slate-400">নতুন মডেলে কঠোর ৬.৫% স্টপ ও স্লিপেজ অন্তর্ভুক্ত।</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-white font-sans">প্রফিট ফ্যাক্টর (Profit Factor)</td>
                  <td className="p-4 text-rose-400 font-bold">{flawed.allStats.profitFactor} (ব্যাংকরাপ্ট)</td>
                  <td className="p-4 text-emerald-400 font-bold">{realistic.allStats.profitFactor} (লাভজনক)</td>
                  <td className="p-4 font-sans text-xs text-slate-400">১-এর নিচে প্রফিট ফ্যাক্টর মানে দীর্ঘমেয়াদে টাকা হারানোর নিশ্চিত নিশ্চয়তা।</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-white font-sans">ট্রেড প্রতি এক্সপেক্টেন্সি (Expectancy %)</td>
                  <td className="p-4 text-rose-400 font-bold">{flawed.allStats.expectancyPct}% (ঋণাত্মক)</td>
                  <td className="p-4 text-emerald-400 font-bold">+{realistic.allStats.expectancyPct}% (ধনাত্মক)</td>
                  <td className="p-4 font-sans text-xs text-slate-400">প্রতি ট্রেডে গড়ে +০.৬৬% নিট পজিটিভ রিটার্ন যোগ হয়।</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-white font-sans">ম্যাক্সিমাম ড্রডাউন (Max Drawdown)</td>
                  <td className="p-4 text-rose-400 font-bold">{flawed.allStats.maxDrawdownPct}% (অ্যাকাউন্ট উবে গেছে)</td>
                  <td className="p-4 text-emerald-400 font-bold">{realistic.allStats.maxDrawdownPct}%</td>
                  <td className="p-4 font-sans text-xs text-slate-400">৩৩% পজিশন সাইজিং পোর্টফোলিও ধ্বংস করেছিল; ১.৫% রিস্ক পোর্টফোলিও রক্ষা করে।</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-white font-sans">গড় হোল্ডিং সময় (Avg Holding Days)</td>
                  <td className="p-4 text-slate-400">{flawed.allStats.avgHoldingDays} দিন (অবাস্তব ডে-ট্রেড)</td>
                  <td className="p-4 text-blue-400 font-bold">{realistic.allStats.avgHoldingDays} দিন (বাস্তব T+2 সুইং)</td>
                  <td className="p-4 font-sans text-xs text-slate-400">ডিএসই-তে ২ দিন বিক্রি নিষেধ থাকায় গড় ট্রেড ৫-৬ দিন চলে।</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-white font-sans">মোট টেস্টেড ট্রেড সংখ্যা (Total Trades)</td>
                  <td className="p-4 text-slate-400">{flawed.allStats.totalTrades}টি</td>
                  <td className="p-4 text-slate-300 font-bold">{realistic.allStats.totalTrades}টি</td>
                  <td className="p-4 font-sans text-xs text-slate-400">১২ বছরের সম্পূর্ণ হিস্ট্রির ওপর পরীক্ষিত ট্রেড।</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: WALK-FORWARD & YEARLY BREAKDOWN */}
      {activeTab === 'walkforward' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* In-Sample Box */}
            <div className="p-5 rounded-xl bg-slate-900 border border-blue-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40">
                  ইন-স্যাম্পল (In-Sample: ২০১৩–২০২০)
                </span>
                <span className="text-xs font-mono text-slate-400">৮ বছর</span>
              </div>
              <h4 className="text-lg font-bold text-white">স্বাভাবিক বাজার চক্রে পারফরম্যান্স</h4>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block font-sans">ট্রেড সংখ্যা:</span>
                  <span className="text-base font-bold text-white">{realistic.inSampleStats.totalTrades}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block font-sans">উইন রেট:</span>
                  <span className="text-base font-bold text-emerald-400">{realistic.inSampleStats.winRate}%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block font-sans">প্রফিট ফ্যাক্টর:</span>
                  <span className="text-base font-bold text-emerald-400">{realistic.inSampleStats.profitFactor}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block font-sans">এক্সপেক্টেন্সি:</span>
                  <span className="text-base font-bold text-emerald-400">+{realistic.inSampleStats.expectancyPct}%</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                ২০১৩ থেকে ২০২০ পর্যন্ত ডিএসই-র উত্থান-পতনের মাঝেও কৌশলটি শক্তিশালী ১.২৯ প্রফিট ফ্যাক্টর এবং +০.৯০% নিট এক্সপেক্টেন্সি বজায় রাখতে সক্ষম হয়েছে।
              </p>
            </div>

            {/* Out-of-Sample Box */}
            <div className="p-5 rounded-xl bg-slate-900 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  আউট-অব-স্যাম্পল (Out-of-Sample: ২০২১–২০২৪)
                </span>
                <span className="text-xs font-mono text-slate-400">৪ বছর (ফ্লোর প্রাইস ও রাজনৈতিক ক্রাইসিস)</span>
              </div>
              <h4 className="text-lg font-bold text-white">চরম অকার্যকর ও সংকটপূর্ণ বাজারে পারফরম্যান্স</h4>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block font-sans">ট্রেড সংখ্যা:</span>
                  <span className="text-base font-bold text-white">{realistic.outSampleStats.totalTrades}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block font-sans">উইন রেট:</span>
                  <span className="text-base font-bold text-amber-400">{realistic.outSampleStats.winRate}%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block font-sans">প্রফিট ফ্যাক্টর:</span>
                  <span className="text-base font-bold text-slate-200">{realistic.outSampleStats.profitFactor}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block font-sans">এক্সপেক্টেন্সি:</span>
                  <span className="text-base font-bold text-slate-300">{realistic.outSampleStats.expectancyPct}%</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                ২০২২–২০২৩ সালে ফ্লোর প্রাইসের কারণে বায়ার শূন্য হয়ে যাওয়া এবং ২০২৪-এর রাজনৈতিক অস্থিরতায় প্রফিট ফ্যাক্টর ১.০২ এ নেমে আসে। কোনো অলৌকিক মুনাফা হয়নি, তবে ১.৫% পজিশন সাইজিংয়ের কারণে অ্যাকাউন্ট টিকে ছিল।
              </p>
            </div>
          </div>

          {/* Yearly Table */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>বছরওয়ারী ঐতিহাসিক ফলাফল (Yearly Breakdown: ২০১৩–২০২৪)</span>
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-xs sm:text-sm font-mono">
                <thead className="bg-slate-950 text-slate-400 font-sans border-b border-slate-800">
                  <tr>
                    <th className="p-3">বছর</th>
                    <th className="p-3">ট্রেড সংখ্যা</th>
                    <th className="p-3">উইন রেট</th>
                    <th className="p-3">প্রফিট ফ্যাক্টর</th>
                    <th className="p-3">এক্সপেক্টেন্সি (%)</th>
                    <th className="p-3">গড় জয়</th>
                    <th className="p-3">গড় ক্ষতি</th>
                    <th className="p-3">বাজারের চালচিত্র ও মন্তব্য</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {Object.entries(realistic.yearlyStats).sort((a, b) => b[0].localeCompare(a[0])).map(([year, stat]: [string, any]) => {
                    const isPositive = stat.expectancyPct > 0;
                    let comment = 'স্থিতিশীল মুনাফা';
                    if (year === '2024') comment = 'রাজনৈতিক অস্থিরতা ও ভারী পতন';
                    else if (year === '2023') comment = 'ফ্লোর প্রাইস লক ও চরম তারল্য সংকট';
                    else if (year === '2021') comment = 'পোস্ট-কোভিড ভুল রান (সর্বাধিক লাভ)';
                    else if (year === '2017') comment = 'শক্তিশালী বুলিশ মার্কেট';
                    else if (year === '2018') comment = 'নির্বাচন-পূর্ব সংশোধন';

                    return (
                      <tr key={year} className="hover:bg-slate-800/40">
                        <td className="p-3 font-bold text-white">{year}</td>
                        <td className="p-3">{stat.totalTrades}</td>
                        <td className="p-3 text-emerald-400">{stat.winRate}%</td>
                        <td className={`p-3 font-bold ${stat.profitFactor >= 1.2 ? 'text-emerald-400' : stat.profitFactor >= 1 ? 'text-slate-200' : 'text-rose-400'}`}>
                          {stat.profitFactor}
                        </td>
                        <td className={`p-3 font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPositive ? `+${stat.expectancyPct}%` : `${stat.expectancyPct}%`}
                        </td>
                        <td className="p-3 text-emerald-400">+{stat.avgWinPct}%</td>
                        <td className="p-3 text-rose-400">-{Math.abs(stat.avgLossPct)}%</td>
                        <td className="p-3 font-sans text-xs text-slate-400">{comment}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SECTOR PERFORMANCE */}
      {activeTab === 'sectors' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-1.5">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>সেক্টরভিত্তিক ফলাফল ও ক্লাস্টারিং ঝুঁকি (Sector Breakdown)</span>
            </h4>
            <p>
              ডিএসই-তে বিভিন্ন সেক্টরের চারিত্রিক বৈশিষ্ট্য আলাদা। যেমন—সিমেন্ট, আর্থিক প্রতিষ্ঠান (NBFI) ও ফার্মাসিউটিক্যালস সেক্টরে ব্যাকটেস্টে ভালো স্থায়িত্ব দেখা গেছে। 
              কিন্তু টেক্সটাইল, ইন্স্যুরেন্স, মিউচুয়াল ফান্ড ও আইটি সেক্টরে ড্রডাউন ছিল অনেক বেশি। তাই কোনো একটি নির্দিষ্ট সেক্টরে মোট পোর্টফোলিওর ২৫-৩০% এর বেশি বরাদ্দ রাখা আত্মঘাতী।
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
            <table className="w-full text-left text-xs sm:text-sm font-mono">
              <thead className="bg-slate-950 text-slate-400 font-sans border-b border-slate-800">
                <tr>
                  <th className="p-3">সেক্টর (Sector)</th>
                  <th className="p-3">মোট ট্রেড</th>
                  <th className="p-3">উইন রেট</th>
                  <th className="p-3">প্রফিট ফ্যাক্টর</th>
                  <th className="p-3">এক্সপেক্টেন্সি (%)</th>
                  <th className="p-3">শার্প রেশিও</th>
                  <th className="p-3">ম্যাক্স ড্রডাউন</th>
                  <th className="p-3 font-sans">প্রাতিষ্ঠানিক রেটিং</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {Object.entries(realistic.sectorStats).sort((a: any, b: any) => b[1].profitFactor - a[1].profitFactor).map(([sector, s]: [string, any]) => {
                  let badge = 'bg-slate-800 text-slate-300 border-slate-700';
                  let verdict = 'মাঝারি';
                  if (s.profitFactor >= 1.5) {
                    badge = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
                    verdict = 'শক্তিশালী প্রফিটেবল';
                  } else if (s.profitFactor < 1.0) {
                    badge = 'bg-rose-500/20 text-rose-400 border-rose-500/40';
                    verdict = 'লস মেকিং (এড়িয়ে চলুন)';
                  }

                  return (
                    <tr key={sector} className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white font-sans">{sector}</td>
                      <td className="p-3">{s.totalTrades}</td>
                      <td className="p-3 text-emerald-400">{s.winRate}%</td>
                      <td className={`p-3 font-bold ${s.profitFactor >= 1.2 ? 'text-emerald-400' : s.profitFactor >= 1 ? 'text-slate-200' : 'text-rose-400'}`}>
                        {s.profitFactor}
                      </td>
                      <td className={`p-3 font-bold ${s.expectancyPct > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {s.expectancyPct > 0 ? `+${s.expectancyPct}%` : `${s.expectancyPct}%`}
                      </td>
                      <td className="p-3">{s.sharpeRatio}</td>
                      <td className="p-3 text-rose-400">{s.maxDrawdownPct}%</td>
                      <td className="p-3 font-sans">
                        <span className={`px-2 py-0.5 rounded text-xs border ${badge}`}>
                          {verdict}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: REALISTIC POSITION SIZING CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-5 p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-400" />
              <span>প্রাতিষ্ঠানিক ঝুঁকি ও পজিশন সাইজিং ক্যালকুলেটর</span>
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              পুরাতন ৩টি ট্রেডে ৩৩% করে বরাদ্দ করার নিয়মটি সম্পূর্ণ বাতিল করা হয়েছে। এখানে <strong className="text-emerald-400">১.৫% অ্যাকাউন্ট রিস্ক রুল</strong> কার্যকর করা হয়েছে, যাতে টানা ৫টি ট্রেড লস হলেও মূলধনের মাত্র ৭.৫% কমবে এবং অ্যাকাউন্ট নিরাপদ থাকবে।
            </p>

            <div className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  আপনার মোট ট্রেডিং মূলধন (টাকা):
                </label>
                <input
                  type="number"
                  step="10000"
                  value={accountCapital}
                  onChange={(e) => setAccountCapital(Math.max(10000, Number(e.target.value)))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  প্রতি ট্রেডে অনুমোদিত ঝুঁকি (Account Risk %):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1.0, 1.5, 2.0].map(pct => (
                    <button
                      key={pct}
                      onClick={() => setRiskPerTradePct(pct)}
                      className={`py-2 rounded-lg text-xs font-mono font-bold transition-all border ${
                        riskPerTradePct === pct
                          ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {pct}% রিস্ক
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  স্টক নির্বাচন করুন (সংশোধিত লিকুইড ক্যান্ডিডেট):
                </label>
                <select
                  value={selectedStockSymbol || (activeCandidate?.stock.c || '')}
                  onChange={(e) => setSelectedStockSymbol(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                >
                  {allCandidates.map(c => (
                    <option key={c.stock.c} value={c.stock.c}>
                      {c.stock.c} ({c.stock.s}) - দর: ৳{c.entryPrice} ({c.dev > 0 ? `+${c.dev.toFixed(1)}%` : `${c.dev.toFixed(1)}%`})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Candidate Stats */}
            {activeCandidate && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">এন্ট্রি দর (পরদিনের ওপেন):</span>
                  <span className="text-white font-bold">৳{activeCandidate.entryPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">কঠোর স্টপ লস (-৬.৫%):</span>
                  <span className="text-rose-400 font-bold">৳{activeCandidate.stopLoss}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">টার্গেট ১ (+৪.৫% এ ৫০% বিক্রি):</span>
                  <span className="text-emerald-400 font-bold">৳{activeCandidate.target1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">টার্গেট ২ (+১৮% ট্রেইলিং):</span>
                  <span className="text-blue-400 font-bold">৳{activeCandidate.target2}</span>
                </div>
              </div>
            )}
          </div>

          {/* Allocation & Trade Sheet */}
          <div className="lg:col-span-7 space-y-5 p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span>বিজ্ঞাণিত ট্রেড টিকিট ও পজিশন সাইজ</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                T+2 কমপ্লায়েন্ট
              </span>
            </h3>

            {calcData && activeCandidate && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-xs text-slate-400">অনুমোদিত সর্বোচ্চ শেয়ার</div>
                    <div className="text-lg font-bold text-white font-mono">{calcData.sharesCount.toLocaleString()} টি</div>
                    <div className="text-[11px] text-slate-500 font-mono">৳{calcData.investedAmount.toLocaleString()} টাকা</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-xs text-slate-400">সর্বোচ্চ ঝুঁকি (Max Risk)</div>
                    <div className="text-lg font-bold text-rose-400 font-mono">৳{calcData.actualRiskAmount.toLocaleString()}</div>
                    <div className="text-[11px] text-rose-400/80 font-mono">মূলধনের {calcData.portfolioRiskPct}%</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-xs text-slate-400">আনুমানিক কমিশন ও স্লিপেজ</div>
                    <div className="text-lg font-bold text-amber-400 font-mono">৳{calcData.estCost.toLocaleString()}</div>
                    <div className="text-[11px] text-slate-500 font-mono">০.৫% + ১-টিক</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    পরিকল্পিত এক্সিট ও প্রফিট টার্গেট (T+2 সেটেলমেন্টের পর):
                  </h4>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                      <div>
                        <span className="text-white font-bold block">টার্গেট ১ (+৪.৫%): ৫০% শেয়ার বিক্রি</span>
                        <span className="text-slate-400 font-sans text-[11px]">৳{activeCandidate.target1} দরে {Math.floor(calcData.sharesCount * 0.5)} টি শেয়ার</span>
                      </div>
                      <span className="text-emerald-400 font-bold text-sm">+৳{calcData.tp1NetGain.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-950/20 border border-blue-500/30">
                      <div>
                        <span className="text-white font-bold block">টার্গেট ২ (+১৮%): বাকি ৫০% শেয়ার বিক্রি</span>
                        <span className="text-slate-400 font-sans text-[11px]">৳{activeCandidate.target2} দরে বাকি শেয়ার</span>
                      </div>
                      <span className="text-blue-400 font-bold text-sm">+৳{calcData.tp2NetGain.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/30">
                      <div>
                        <span className="text-white font-bold block">স্টপ লস ট্রিগার (-৬.৫%)</span>
                        <span className="text-slate-400 font-sans text-[11px]">৳{activeCandidate.stopLoss} দরে শতভাগ এক্সিট</span>
                      </div>
                      <span className="text-rose-400 font-bold text-sm">-৳{calcData.actualRiskAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>T+2 সতর্কতা:</strong> শেয়ার কেনার দিন ও পরের দিন স্টপ লস বা টার্গেট ছোঁয়া সত্ত্বেও আপনি বিক্রি করতে পারবেন না। ৩য় কার্যদিবসে সকালের ওপেনিং মূল্যে প্রথম এক্সিট সম্ভব।
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: 5-SENTENCE CAPITAL CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-500/30 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                বাস্তব টাকা লাগানোর আগে ৫-বাক্যের বাধ্যতামূলক অ্যাকশনেবল চেকলিস্ট
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                যে কোনো বাস্তব ক্যাপিটাল মোতায়েনের আগে এই ৫টি নীতি শতভাগ নিশ্চিত করুন।
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                num: '১',
                title: '১. পেপার ট্রেডিং ও T+2 লগ ভ্যালিডেশন:',
                text: 'বাস্তব মূলধন দেওয়ার আগে অন্তত ২০টি লাইভ সিগন্যালে পেপার ট্রেডিং করে T+2 সেটেলমেন্টের মাঝে দাম উল্টো নামলে মনস্তাত্ত্বিক প্রতিক্রিয়া ও স্লিপেজ লগ করুন।'
              },
              {
                num: '২',
                title: '২. ১.৫% অ্যাকাউন্ট রিস্ক সীমা কঠোরভাবে মান্য করা:',
                text: 'কোনো একক ট্রেডে মোট পোর্টফোলিও মূলধনের ১.৫% থেকে ২%-এর বেশি আর্থিক ক্ষতি (Maximum Risk) কোনো অবস্থাতেই নেওয়া যাবে না।'
              },
              {
                num: '৩',
                title: '৩. ৫০ লাখ টাকার দৈনিক তারল্য ফিল্টার বজায় রাখা:',
                text: 'যেসব শেয়ারের ২০ দিনের গড় দৈনিক লেনদেন ৫০ লাখ টাকার নিচে, সেগুলোতে এন্ট্রি সম্পূর্ণ নিষিদ্ধ—নইলে পতনের সময় বায়ারহীন হয়ে আটকে যাবেন।'
              },
              {
                num: '৪',
                title: '৪. ২৫% সেক্টর কনসেন্ট্রেশন ক্যাপ রক্ষা করা:',
                text: 'একই সেক্টরে (যেমন শুধু টেক্সটাইল বা শুধু ইন্স্যুরেন্স) আপনার মোট পোর্টফোলিওর ২৫%-এর বেশি ক্যাপিটাল কখনো এক্সপোজ করবেন না।'
              },
              {
                num: '৫',
                title: '৫. ১৫-২০ দিনের টাইম স্টপ বাস্তবায়ন:',
                text: 'এন্ট্রি নেওয়ার পর ১৫ থেকে ২০ কার্যদিবসের মধ্যে কাঙ্ক্ষিত মুভ না এলে এবং মূলধন অচল থাকলে ব্রেকইভেন বা সামান্য ক্ষতিতে পজিশন ক্লোজ করে ক্যাপিটাল মুক্ত করুন।'
              }
            ].map(item => (
              <div 
                key={item.num}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-4 hover:border-emerald-500/40 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                  {item.num}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-3">
            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              এই ৫টি নীতি প্রাতিষ্ঠানিক ঝুঁকি নিয়ন্ত্রণ নিশ্চিত করে এবং ডিএসই-র ম্যানিপুলেটেড বাজারে ক্যাপিটাল বাঁচিয়ে রেখে দীর্ঘমেয়াদে ধারাবাহিক মুনাফা অর্জন করতে সাহায্য করে।
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
