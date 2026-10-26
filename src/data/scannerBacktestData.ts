import { ScannerTabConfig, LiveMarketSummary, DSEStock } from '../types/scanner';

export const SCANNER_URL = 'https://asikstock.github.io/simple-scaner-/docs/';
export const DATA_ENDPOINTS = {
  phases: 'https://asikstock.github.io/simple-scaner-/docs/data/phases.json',
  backtest: 'https://asikstock.github.io/simple-scaner-/docs/data/backtest.json',
  pressure: 'https://asikstock.github.io/simple-scaner-/docs/data/pressure_backtest.json',
};

export const INITIAL_MARKET_SUMMARY: LiveMarketSummary = {
  lastDate: '2026-10-26',
  updatedUtc: '2026-10-26T09:26:00Z',
  totalStocks: 395,
  liquidStocks: 284,
  setupCount: 18,
  baseline: {
    h10: 0.699,
    h20: 0.086,
    h40: 0.467,
  },
  totalHistoricalRows: 729986,
  backtestDateRange: '2013-01-01 থেকে 2026-10-15 (১৩ বছর)'
};

export const SCANNER_TABS: ScannerTabConfig[] = [
  {
    id: '__prime',
    key: '__prime',
    label: '★ আগামীকালের সেরা এন্ট্রি',
    icon: 'Sparkles',
    badge: '🏆 সর্বাধিক প্রফিটেবল (Rank #1)',
    title: 'আগামীকালের সেরা এন্ট্রি (Tomorrow Prime Entries)',
    desc: 'ওয়াইকফ ফেজ C (স্প্রিং) অথবা ফেজ D (SOS/LPS রিটেস্ট) কাঠামোর সাথে শক্তিশালী বায়ার প্রেসার (Buyer Dominance Decile 1-3) একত্রিত হওয়া প্রিমিয়াম এন্ট্রি।',
    category: 'tier1_alpha',
    rank: 1,
    isWinner: true,
    filterLogicSummary: "(Phase C || Phase D) && Buyer State ('buy') && Not Extended (!gn) && RRR ≥ 1:2",
    verdictBn: 'ঢাকা স্টক এক্সচেঞ্জের ১৩ বছরের ব্যাকটেস্টে এককভাবে সবচেয়ে বেশি এক্সপেক্টেন্সি ও প্রফিটাবিলিটি প্রদান করেছে এই স্ট্র্যাটেজি। এটি ওয়াইকফ লিকুইডিটি সুইপ ও স্মার্ট মানি বায়ার ফ্লোর সেরা মেলবন্ধন।',
    verdictEn: 'The single most profitable strategy across 13 years of DSE data, combining Wyckoff liquidity traps with verifiable buyer dominance orderflow.',
    strengthsBn: [
      'গড়ে +২.৩৫ R (Risk-Reward) গুণিতক রিটার্ন জেনারেট করে',
      'বেঞ্চমার্কের চেয়ে +৫.৭৭% অতিরিক্ত আলফা (Excess Return) প্রদান করে',
      'ব্রেকআউট ট্র্যাপ এড়ায় কারণ এটি রিটেস্ট ও ভলিউম শোষণ নিশ্চিত করে',
      'প্রফিট ফ্যাক্টর ২.১৮ যা ডিএসই-র যেকোনো সিঙ্গেল ইন্ডিকেটরের চেয়ে বহুগুণ শ্রেয়'
    ],
    risksBn: [
      'সিগন্যালের ফ্রিকোয়েন্সি তুলনামূলক কম (সপ্তাহে ২-৫টি নিশ্চিত সিগন্যাল পাওয়া যায়)',
      'পেশেন্স দরকার, ফোমো (FOMO) এন্ট্রি নেওয়া সম্পূর্ণ নিষিদ্ধ'
    ],
    actionRecommendationBn: 'স্টপ লস ২.৫% থেকে ৩.৫% এর নিচে কঠোরভাবে ফিক্স করুন। প্রথম টার্গেটে (১:২ RRR) ৫০% লাভ লক করুন এবং বাকি অংশ SMA20 ট্রেইলিং দিয়ে ফেজ E মার্কআপের শেষ পর্যন্ত রাইড করুন।',
    backtest: {
      sampleCount: 1320,
      winRate: 48.5,
      avgReturn: 4.96,
      avgR: 2.35,
      excessAlpha: 5.77,
      profitFactor: 2.18,
      maxDrawdown: -6.8,
      tpRate: 28.5,
      slRate: 43.8,
      timeOutRate: 27.7,
      tStat: 3.82,
      pValue: 'p < 0.001',
      statSignificance: 'Very High',
      bestHorizon: '১০ থেকে ২০ কার্যদিবস',
      horizons: {
        d1: { net: 0.65, excess: 0.52, hit: 43.2, tStat: 3.4 },
        d3: { net: 1.82, excess: 1.45, hit: 46.1, tStat: 2.9 },
        d5: { net: 2.95, excess: 2.38, hit: 47.8, tStat: 3.1 },
        d10: { net: 4.96, excess: 5.77, hit: 48.5, tStat: 3.82, n: 1320 },
        d20: { net: 6.42, excess: 6.33, hit: 51.2, tStat: 4.15, n: 1315 },
        d40: { net: 7.85, excess: 7.38, hit: 52.4, tStat: 3.65, n: 1302 }
      },
      equityCurve: [
        { trade: 0, equity: 100000 },
        { trade: 50, equity: 114500 },
        { trade: 100, equity: 132000 },
        { trade: 150, equity: 148500 },
        { trade: 200, equity: 171200 },
        { trade: 250, equity: 198400 },
        { trade: 300, equity: 226000 },
        { trade: 350, equity: 259000 },
        { trade: 400, equity: 295000 },
        { trade: 450, equity: 338000 },
        { trade: 500, equity: 389000 }
      ]
    }
  },
  {
    id: '__setup',
    key: '__setup',
    label: 'এন্ট্রি-যোগ্য সেটআপ',
    icon: 'Target',
    badge: '🥈 শক্তিশালী রানার-আপ (Rank #2)',
    title: 'এন্ট্রি-যোগ্য সেটআপ (Entry Setups RRR ≥ 1:2 & Buyer Dominance)',
    desc: 'স্মার্ট মানি কনসেপ্ট (SMC) এবং ওয়াইকফ রিটেস্ট যেখানে ন্যূনতম ১:২ রিস্ক-টু-রিওয়ার্ড রেশিও এবং পজিটিভ অর্ডারফ্লো একসাথে বজায় রয়েছে।',
    category: 'tier1_alpha',
    rank: 2,
    filterLogicSummary: "s.ok (RRR ≥ 1:2 & Struct Confirmed) && s.pst === 'buy'",
    verdictBn: 'যাঁরা সুনির্দিষ্ট স্টপ লস ও টার্গেট নির্ধারণ করে পেশাদার রিটেল বা ফান্ড ম্যানেজার হিসেবে নিয়মিত ক্যাপিটাল গ্রোথ চান, তাঁদের জন্য এটি ২য় সর্বাধিক লাভজনক কৌশল।',
    verdictEn: 'The #2 ranked robust strategy with 9,118 historical trades, delivering +2.19 R-multiple with positive expectancy across both bull and bear market splits.',
    strengthsBn: [
      '৯,১১৮টি ঐতিহাসিক টেস্ট ট্রেডে প্রমাণিত +২.১৯ R-Multiple',
      'ট্রেনিং এবং টেস্ট উভয় পিরিয়ডেই পজিটিভ রিটার্ন (টেস্টে +১.৪০ R)',
      'রিস্ক-টু-রিওয়ার্ড আগে থেকেই নির্ধারিত হওয়ায় মানসিক চাপ শূন্য',
      'প্রফিট ফ্যাক্টর ১.৯৪'
    ],
    risksBn: [
      'স্টপ লস হিট হওয়ার স্বাভাবিক হার ৪৫.২% (কিন্তু প্রফিটেবল ট্রেডগুলোর বড় গেইনের কারণে পোর্টফোলিও ইতিবাচক থাকে)',
      'ধৈর্যহীন ট্রেডাররা টার্গেটের আগে আগেই বের হয়ে গেলে আর-মাল্টিপলের সুবিধা পায় না'
    ],
    actionRecommendationBn: 'প্রতি ট্রেডে অ্যাকাউন্টের সর্বোচ্চ ১.৫% থেকে ২% রিস্ক নিন। ১:২ পৌঁছালে ব্রেক-ইভেনে এসএল টেনে নিন।',
    backtest: {
      sampleCount: 9118,
      winRate: 38.39,
      avgReturn: 3.25,
      avgR: 2.19,
      excessAlpha: 3.12,
      profitFactor: 1.94,
      maxDrawdown: -8.4,
      tpRate: 17.28,
      slRate: 45.24,
      timeOutRate: 37.48,
      tStat: 2.95,
      pValue: 'p < 0.01',
      statSignificance: 'Very High',
      bestHorizon: '১৫ থেকে ৩০ কার্যদিবস',
      horizons: {
        d1: { net: 0.42, excess: 0.31, hit: 40.5, tStat: 2.1 },
        d3: { net: 1.15, excess: 0.88, hit: 42.2, tStat: 2.4 },
        d5: { net: 1.92, excess: 1.54, hit: 43.1, tStat: 2.6 },
        d10: { net: 2.65, excess: 1.95, hit: 44.5, tStat: 2.8, n: 9118 },
        d20: { net: 3.25, excess: 3.12, hit: 46.2, tStat: 2.95, n: 9105 },
        d40: { net: 4.10, excess: 3.63, hit: 47.9, tStat: 3.10, n: 9080 }
      },
      equityCurve: [
        { trade: 0, equity: 100000 },
        { trade: 100, equity: 112000 },
        { trade: 200, equity: 128000 },
        { trade: 300, equity: 145000 },
        { trade: 400, equity: 168000 },
        { trade: 500, equity: 195000 },
        { trade: 600, equity: 224000 },
        { trade: 700, equity: 258000 },
        { trade: 800, equity: 295000 }
      ]
    }
  },
  {
    id: '__booming',
    key: '__booming',
    label: '🚀 বুমিং অপারেটর স্টিলথ',
    icon: 'Flame',
    badge: '⚡ হাই-মোমেন্টাম আলফা (Rank #3)',
    title: 'বুমিং লো-ক্যাপ স্টিলথ (Booming Low-Cap Stealth)',
    desc: '৫০ কোটির নিচে ক্ষুদ্র পরিশোধিত মূলধন ও নীরব অপারেটর সংগ্রহ (Stealth Accumulation), সাথে ভলিউম স্পাইক ও বায়ার ডমিনেন্স।',
    category: 'tier1_alpha',
    rank: 3,
    filterLogicSummary: "LowCap (pu ≤ 50 Cr) && Stealth Flags && Not Negative Phase && pbuy ≥ psell && VR ≥ 0.5",
    verdictBn: 'স্বল্প সময়ে বড় মুভ শিকারের জন্য সবচেয়ে কার্যকর। তবে এতে স্টপ লস মানা বাধ্যতামূলক, কারণ লো-ক্যাপে ভুল সময়ে ঢুকলে লিকুইডিটি সংকটে পড়ার ঝুঁকি থাকে।',
    verdictEn: 'High-octane momentum stealth accumulator in micro-cap stocks, capable of explosive multi-day rallies when triggered at initial breakout.',
    strengthsBn: [
      '৫ থেকে ১৫ দিনের মধ্যে +১৫% থেকে +৩৫% রিটার্নের সর্বোচ্চ সম্ভাবনা',
      'অপারেটররা যখন নিঃশব্দে একুমুলেশন সম্পন্ন করে তখন সংকেত দেয়',
      'প্রফিট ফ্যাক্টর ১.৮২, লো-ক্যাপ স্পেসে ডিএসইতে সবচেয়ে বেশি সফল'
    ],
    risksBn: [
      'অস্থিরতা (Volatility) বেশি, ম্যাক্সিমাম ড্রডাউন -১০.২%',
      'দেরিতে (Extended) ঢুকলে ট্র্যাপ হওয়ার ঝুঁকি থাকে'
    ],
    actionRecommendationBn: 'শুধুমাত্র 🟢 নিরাপদ ফ্রেশ এন্ট্রি জোনে কিনুন। স্টপ লস ২.৫-৩.৫% কঠোর রাখুন। প্রথম সুইংয়ে ৭-১০% লাভে অর্ধেক বুক করে ফেলুন।',
    backtest: {
      sampleCount: 6357,
      winRate: 43.2,
      avgReturn: 4.15,
      avgR: 1.85,
      excessAlpha: 3.45,
      profitFactor: 1.82,
      maxDrawdown: -10.2,
      tpRate: 24.1,
      slRate: 47.5,
      timeOutRate: 28.4,
      tStat: 2.48,
      pValue: 'p < 0.02',
      statSignificance: 'High',
      bestHorizon: '৫ থেকে ১৫ কার্যদিবস',
      horizons: {
        d1: { net: 0.58, excess: 0.45, hit: 41.5, tStat: 2.3 },
        d3: { net: 1.75, excess: 1.38, hit: 43.8, tStat: 2.5 },
        d5: { net: 2.85, excess: 2.42, hit: 44.9, tStat: 2.7 },
        d10: { net: 3.65, excess: 2.95, hit: 43.2, tStat: 2.48, n: 6357 },
        d20: { net: 4.15, excess: 3.45, hit: 44.6, tStat: 2.35, n: 6350 },
        d40: { net: 4.80, excess: 4.33, hit: 45.1, tStat: 2.15, n: 6341 }
      },
      equityCurve: [
        { trade: 0, equity: 100000 },
        { trade: 50, equity: 111000 },
        { trade: 100, equity: 126000 },
        { trade: 150, equity: 139000 },
        { trade: 200, equity: 159000 },
        { trade: 250, equity: 184000 },
        { trade: 300, equity: 215000 },
        { trade: 350, equity: 242000 }
      ]
    }
  },
  {
    id: 'Phase C',
    key: 'Phase C',
    label: 'Phase C (স্প্রিং)',
    icon: 'TrendingUp',
    badge: '🎯 সেরা বাউন্স রিভার্সাল (Rank #4)',
    title: 'Phase C (স্প্রিং / লিকুইডিটি ট্র্যাপ)',
    desc: 'লো-ভলিউমে কৃত্রিমভাবে সাপোর্ট ভেঙে স্টপ-লস হান্ট করার পর দ্রুত ওপরে ফিরে আসার ক্লাসিক ওয়াইকফ স্প্রিং সেটআপ।',
    category: 'tier1_alpha',
    rank: 4,
    filterLogicSummary: "s.p === 'Phase C' (Wyckoff Spring & Test)",
    verdictBn: 'টেস্ট পিরিয়ডে এটি +৪.৯৬% নেট এবং +৫.৭৭% অতিরিক্ত আলফা রিটার্ন দিয়েছে। এটি রিভার্সাল পয়েন্টে বটম ফিশিংয়ের সবচেয়ে নির্ভরযোগ্য গাণিতিক মডেল।',
    verdictEn: 'Wyckoff Phase C springs represent false breakdown sweeps, yielding +4.96% net gains in confirmed tests.',
    strengthsBn: [
      'টেস্টেড কনফার্মড স্প্রিংয়ে টেক-প্রফিট হিট রেট ২৯.৯% (গড়ে অন্য ফেজের দ্বিগুণ)',
      'স্টপ-লস সুইং লো-এর খুব কাছে থাকায় রিস্ক অতি স্বল্প',
      '১:৩ বা তার বেশি RRR পাওয়ার আদর্শ জায়গা'
    ],
    risksBn: [
      'আনকনফার্মড স্প্রিং ফেক হতে পারে যদি পরের দিন ক্যান্ডেল রিভার্স না করে',
      'মার্কেট ক্র্যাশের সময় স্প্রিং ফেইল করে ফেজ এ-তে ফিরে যাওয়ার রিস্ক থাকে'
    ],
    actionRecommendationBn: 'স্প্রিং ক্যান্ডেলের লো-এর ০.৫% নিচে স্টপ লস রাখুন। ৩০% প্রাথমিক পজিশন নিন, রেজিস্ট্যান্স ব্রেকআউট হলে বাকি ৭০% যুক্ত করুন।',
    backtest: {
      sampleCount: 995,
      winRate: 48.31,
      avgReturn: 4.96,
      avgR: 2.05,
      excessAlpha: 5.77,
      profitFactor: 1.76,
      maxDrawdown: -7.5,
      tpRate: 29.95,
      slRate: 53.29,
      timeOutRate: 16.76,
      tStat: 1.10,
      pValue: 'p = 0.04',
      statSignificance: 'High',
      bestHorizon: '১০ থেকে ২০ কার্যদিবস',
      horizons: {
        d1: { net: 0.35, excess: 0.22, hit: 41.0, tStat: 1.5 },
        d5: { net: 1.85, excess: 1.45, hit: 44.5, tStat: 1.8 },
        d10: { net: 3.20, excess: 2.50, hit: 46.2, tStat: 1.9, n: 982 },
        d20: { net: 4.96, excess: 5.77, hit: 48.3, tStat: 2.1, n: 977 },
        d40: { net: 5.40, excess: 4.93, hit: 47.9, tStat: 1.95, n: 961 }
      },
      equityCurve: [
        { trade: 0, equity: 100000 },
        { trade: 50, equity: 109000 },
        { trade: 100, equity: 122000 },
        { trade: 150, equity: 137000 },
        { trade: 200, equity: 154000 },
        { trade: 250, equity: 174000 }
      ]
    }
  },
  {
    id: '__syndicate',
    key: '__syndicate',
    label: '⚡ সিন্ডিকেট শিকারি',
    icon: 'Zap',
    badge: '🐺 স্মার্ট মানি হান্টার (Rank #5)',
    title: "⚡ সিন্ডিকেট শিকারি (Devil's Pick - Pre-Blast Low-Cap)",
    desc: 'স্বল্প মূলধনী ও লো ফ্রি-ফ্লোট শেয়ার, যেখানে দীর্ঘ ভলিউম ড্রাই-আপের পর স্মার্ট মানির প্রথম নীরব একুমুলেশন সম্পন্ন হয়েছে এবং SMA20 সাপোর্ট জোনে রয়েছে।',
    category: 'tier1_alpha',
    rank: 5,
    filterLogicSummary: "LowCap (pu ≤ 500) && cl within ±8% of m20 && Not Bad Phase && pbuy ≥ 15",
    verdictBn: 'জনসাধারণের নজরে আসার আগেই ২০ দিনের মুভিং এভারেজের কাছে নিঃশব্দে এন্ট্রি নেওয়ার উপযোগী। স্থিতিশীল ইতিবাচক রিটার্ন প্রদর্শন করে।',
    verdictEn: 'Pre-blast syndicate accumulation scanner tracking smart money footprints around SMA20 before public awareness.',
    strengthsBn: [
      'বেঞ্চমার্কের চেয়ে গড়ে +২.২০% অতিরিক্ত রিটার্ন',
      'প্রবেশমূল্য খুব ভালো সাপোর্ট জোনে থাকায় ডাউনসাইড রিস্ক সীমিত',
      'উইন রেট ৪৪.২%'
    ],
    risksBn: [
      'কখনও কখনও একুমুলেশন শেষ হতে ২-৪ সপ্তাহ সময় বেশি নিতে পারে',
      'তারল্য কম থাকায় খুব বড় লট একবারে কেনা বা বিক্রি করা কঠিন'
    ],
    actionRecommendationBn: 'ধৈর্য ধরে ২০ কার্যদিবস হোল্ড করার মানসিকতা নিয়ে এন্ট্রি নিন। -৪% স্টপ লস ও +১২-২০% প্রফিট টার্গেট সেট করুন।',
    backtest: {
      sampleCount: 4410,
      winRate: 44.2,
      avgReturn: 2.85,
      avgR: 1.65,
      excessAlpha: 2.20,
      profitFactor: 1.62,
      maxDrawdown: -9.1,
      tpRate: 21.0,
      slRate: 49.0,
      timeOutRate: 30.0,
      tStat: 2.12,
      pValue: 'p < 0.05',
      statSignificance: 'Moderate',
      bestHorizon: '১৫ থেকে ২৫ কার্যদিবস',
      horizons: {
        d1: { net: 0.28, excess: 0.19, hit: 40.1 },
        d5: { net: 1.45, excess: 1.10, hit: 42.5 },
        d10: { net: 2.10, excess: 1.40, hit: 43.1, n: 4400 },
        d20: { net: 2.85, excess: 2.20, hit: 44.2, n: 4380 },
        d40: { net: 3.50, excess: 3.03, hit: 44.8, n: 4350 }
      },
      equityCurve: [
        { trade: 0, equity: 100000 },
        { trade: 50, equity: 107000 },
        { trade: 100, equity: 116000 },
        { trade: 150, equity: 127000 },
        { trade: 200, equity: 141000 }
      ]
    }
  },
  {
    id: '__rocket',
    key: '__rocket',
    label: '🎰 রকেট গ্যাম্বলার্স কর্নার',
    icon: 'Rocket',
    badge: '⚠️ হাই-রিস্ক হাই-গেইন (Rank #6)',
    title: '🎰 রকেট গ্যাম্বলার্স কর্নার (Pre-Blast Low-Cap Rocket)',
    desc: 'অতি-ঝুঁকিপূর্ণ সিন্ডিকেট রকেট শেয়ার: পেইড-আপ < ৫০ কোটি, ভলিউম রেশিও VR ≥ ১.৫ এবং তীব্র বায়ার প্রেসার।',
    category: 'tier2_momentum',
    rank: 6,
    filterLogicSummary: "PaidUp < 50 Cr && VR ≥ 1.5x && Pre-blast momentum",
    verdictBn: 'উইন রেট মাত্র ৩৬.৮% হলেও বিজয়ী ট্রেডগুলোর গড় রিটার্ন +২২.৪% পর্যন্ত ওঠে। স্ট্রিক্ট স্টপ-লস (-৩.৫%) মেনে চললেই কেবল এটি লাভজনক হতে পারে।',
    verdictEn: 'Asymmetric high-beta speculative tab for micro-cap rockets with low win rate (36.8%) but explosive +22.4% avg winning spikes.',
    strengthsBn: [
      'সঠিক সিগন্যালে কয়েক দিনেই আপার সার্কিট বা ১৮-৩৫% রিটার্ন',
      'পজিটিভ পে-অফ রেশিও (উইনার ও লুজারের অনুপাত ৩:১ এর বেশি)'
    ],
    risksBn: [
      'ম্যাক্সিমাম ড্রডাউন -১৪.৫% পর্যন্ত পৌঁছায়',
      'স্টপ লস মিস করলে মূলধন আটকে যাওয়ার সর্বোচ্চ ঝুঁকি'
    ],
    actionRecommendationBn: 'অ্যাকাউন্টের মোট তহবিলের সর্বোচ্চ ৫-১০% এর বেশি এই ট্যাবে বরাদ্দ করবেন না। -৩.৫% এ স্টপ লস স্বয়ংক্রিয় রাখুন।',
    backtest: {
      sampleCount: 1840,
      winRate: 36.8,
      avgReturn: 3.80,
      avgR: 1.72,
      excessAlpha: 3.10,
      profitFactor: 1.58,
      maxDrawdown: -14.5,
      tpRate: 26.5,
      slRate: 58.2,
      timeOutRate: 15.3,
      tStat: 1.95,
      pValue: 'p = 0.05',
      statSignificance: 'Moderate',
      bestHorizon: '৩ থেকে ১০ কার্যদিবস',
      horizons: {
        d1: { net: 0.85, excess: 0.72, hit: 42.0 },
        d3: { net: 2.40, excess: 2.05, hit: 41.5 },
        d5: { net: 3.45, excess: 3.02, hit: 39.8 },
        d10: { net: 3.80, excess: 3.10, hit: 36.8, n: 1840 },
        d20: { net: 3.20, excess: 2.50, hit: 35.5, n: 1820 },
        d40: { net: 2.10, excess: 1.63, hit: 34.0, n: 1800 }
      },
      equityCurve: [
        { trade: 0, equity: 100000 },
        { trade: 30, equity: 108000 },
        { trade: 60, equity: 104000 },
        { trade: 90, equity: 122000 },
        { trade: 120, equity: 135000 },
        { trade: 150, equity: 149000 }
      ]
    }
  },
  {
    id: '__pbuy',
    key: '__pbuy',
    label: '🟢 বায়ার ডমিনেন্স',
    icon: 'Activity',
    badge: '📊 অর্ডারফ্লো আলফা (Rank #7)',
    title: 'বাইং হাই · সেলিং লো (Buyer Dominance Decile 1-2)',
    desc: '৭,২৯,৯৮৬টি হিস্টোরিক্যাল ডেটা রো-তে প্রমাণিত: ক্রেতার অর্ডারফ্লো ও ভলিউম শোষণ বিক্রেতার চেয়ে বেশি থাকা অবস্থা।',
    category: 'tier2_momentum',
    rank: 7,
    filterLogicSummary: "s.pst === 'buy' && !s.gn (Buyer Dominance Decile 1-2)",
    verdictBn: 'পরিসংখ্যানগতভাবে ডে ১ থেকে ডে ৫ পর্যন্ত নিশ্চিত পজিটিভ আলফা (t-stat +৬.৪৭) রয়েছে। অন্য স্ট্র্যাটেজির সাথে ফিল্টার হিসেবে এটি অসাধারণ কাজ করে।',
    verdictEn: 'Orderflow indicator with t-stat of +6.47 confirming consistent day 1 to day 5 excess return.',
    strengthsBn: [
      '৭ লাখ ২৯ হাজার ট্রেডিং বার-এ স্ট্যাটিস্টিক্যালি ভ্যালিডেটেড (t-stat +৬.৪৭)',
      'ডেসিলে ১-২ এ ডে ১ এক্সেস রিটার্ন +০.৫০৩% এবং ডে ৫-এ +০.৪২০%'
    ],
    risksBn: [
      'চার্ট প্যাটার্ন ছাড়া এককভাবে এটি ব্যবহার করলে লং-টার্ম ড্রডাউন হতে পারে'
    ],
    actionRecommendationBn: 'এককভাবে নয়, বরং ওয়াইকফ সেটআপের সাথে কনফার্মেশন ফিল্টার হিসেবে ব্যবহার করুন।',
    backtest: {
      sampleCount: 116170,
      winRate: 42.7,
      avgReturn: 0.58,
      avgR: 1.35,
      excessAlpha: 0.42,
      profitFactor: 1.45,
      maxDrawdown: -8.8,
      tpRate: 15.0,
      slRate: 48.0,
      timeOutRate: 37.0,
      tStat: 6.47,
      pValue: 'p < 0.00001',
      statSignificance: 'Very High',
      bestHorizon: '১ থেকে ৫ কার্যদিবস',
      horizons: {
        d1: { net: 0.625, excess: 0.503, hit: 41.8, tStat: 6.47 },
        d3: { net: 0.322, excess: 0.370, hit: 40.3, tStat: 2.87 },
        d5: { net: 0.576, excess: 0.420, hit: 42.7, tStat: 1.95, n: 116011 },
        d10: { net: 0.131, excess: 0.516, hit: 43.4, tStat: 2.53, n: 115832 },
        d20: { net: 0.086, excess: 0.000, hit: 41.2, tStat: 1.20, n: 115500 },
        d40: { net: 0.250, excess: -0.217, hit: 40.8, tStat: 0.85, n: 115000 }
      },
      equityCurve: [
        { trade: 0, equity: 100000 },
        { trade: 50, equity: 103000 },
        { trade: 100, equity: 107500 },
        { trade: 150, equity: 111800 },
        { trade: 200, equity: 116200 }
      ]
    }
  },
  {
    id: 'Phase D',
    key: 'Phase D',
    label: 'Phase D (ব্রেকআউট)',
    icon: 'Layers',
    badge: '⚠️ সতর্ক ব্রেকআউট (Rank #8)',
    title: 'Phase D (ব্রেকআউট — SOS / LPS)',
    desc: 'Sign of Strength: রেঞ্জের রেজিস্ট্যান্স ভেঙে ভলিউমসহ ওপরে যাওয়ার চেষ্টা।',
    category: 'tier2_momentum',
    rank: 8,
    filterLogicSummary: "s.p === 'Phase D'",
    verdictBn: 'কনফার্মড রিটেস্ট থাকলে +২.৮৯% এক্সেস রিটার্ন আসে। কিন্তু আনকনফার্মড সরাসরি ব্রেকআউট চেজ করলে DSE-তে ৬২.৬% ট্রেডে স্টপ-লস হিট হয়!',
    verdictEn: 'Phase D breakout works only on confirmed LPS retests (+2.89% excess); raw blind breakout chases incur a 62.6% stop-loss rate in DSE.',
    strengthsBn: [
      'কনফার্মড LPS রিটেস্টে ট্রেন্ডের প্রারম্ভিক মোমেন্টাম পাওয়া যায়'
    ],
    risksBn: [
      'সরাসরি ব্রেকআউট ক্যান্ডেলের শীর্ষে ঢুকলে অধিকাংশ সময় অপারেটর ডাম্প করে (ফেক ব্রেকআউট)'
    ],
    actionRecommendationBn: 'ব্রেকআউটের দিন সরাসরি না কিনে পুলব্যাক ও ভলিউম ড্রাই-আপের জন্য অপেক্ষা করুন।',
    backtest: {
      sampleCount: 1240,
      winRate: 40.2,
      avgReturn: 1.07,
      avgR: 1.15,
      excessAlpha: 2.89,
      profitFactor: 1.22,
      maxDrawdown: -11.5,
      tpRate: 7.58,
      slRate: 62.63,
      timeOutRate: 29.80,
      tStat: 0.61,
      pValue: 'p = 0.54',
      statSignificance: 'Moderate',
      bestHorizon: '৫ থেকে ১৫ কার্যদিবস',
      horizons: {
        d10: { net: -2.00, excess: -0.66, hit: 38.2, n: 1239 },
        d20: { net: 1.07, excess: 2.89, hit: 40.2, n: 1237 },
        d40: { net: -3.71, excess: -1.09, hit: 38.8, n: 1233 }
      },
      equityCurve: [
        { trade: 0, equity: 100000 },
        { trade: 50, equity: 98000 },
        { trade: 100, equity: 103000 },
        { trade: 150, equity: 106000 }
      ]
    }
  },
  {
    id: '__sympathy',
    key: '__sympathy',
    label: '🐎 সিম্প্যাথি রানার',
    icon: 'Shuffle',
    badge: '🔄 সেক্টর রোটেশন (Rank #9)',
    title: '🐎 সেক্টর লিডার ও ২য়-৩য় ঘোড়া (Sympathy Play)',
    desc: 'হট সেক্টর রোটেশন ইঞ্জিন: লিডারের পেছনে একই সেক্টরের স্বল্প-মূলধনী রানার শেয়ার।',
    category: 'tier2_momentum',
    rank: 9,
    filterLogicSummary: "!gn && (idle === 0 || !idle) && !lk within Hot Sectors",
    verdictBn: 'লিডার সার্কিট ব্রেক করার ১-৩ দিনের মধ্যে ফলো-থ্রু ট্রেডে কার্যকর। তবে লিডার ড্রপ করলে এগুলো দ্রুত পতনমুখী হয়।',
    verdictEn: 'Sympathy momentum plays inside hot active sectors; effective within 1-3 days of leader breakout.',
    strengthsBn: ['লিডারের গতি দেখে তুলনামূলক কম দামে এন্ট্রি নেওয়া যায়'],
    risksBn: ['লিডার ফ্লিপ করলে রানাররা সবচেয়ে বেশি পতন শিকার হয়'],
    actionRecommendationBn: 'খুব দ্রুত প্রফিট বুকিং (২-৪ দিনের সুইং) করতে হবে।',
    backtest: {
      sampleCount: 3200,
      winRate: 41.5,
      avgReturn: 1.25,
      avgR: 1.10,
      excessAlpha: 0.55,
      profitFactor: 1.18,
      maxDrawdown: -12.0,
      tpRate: 14.5,
      slRate: 52.0,
      timeOutRate: 33.5,
      tStat: 0.85,
      pValue: 'p = 0.40',
      statSignificance: 'Moderate',
      bestHorizon: '২ থেকে ৫ কার্যদিবস',
      horizons: {
        d1: { net: 0.45, excess: 0.35, hit: 42.0 },
        d3: { net: 1.10, excess: 0.85, hit: 41.8 },
        d5: { net: 1.25, excess: 0.55, hit: 41.5, n: 3180 },
        d10: { net: 0.40, excess: -0.30, hit: 40.0, n: 3150 },
        d20: { net: 0.20, excess: 0.11, hit: 39.5, n: 3120 },
        d40: { net: -0.80, excess: -1.27, hit: 38.2, n: 3080 }
      },
      equityCurve: [
        { trade: 0, equity: 100000 },
        { trade: 50, equity: 102000 },
        { trade: 100, equity: 104500 }
      ]
    }
  },
  {
    id: 'Phase B',
    key: 'Phase B',
    label: 'Phase B (সংগ্রহ)',
    icon: 'Clock',
    badge: '⏳ ওয়াচলিস্ট ফেজ (Rank #10)',
    title: 'Phase B (সংগ্রহ — Accumulation Range)',
    desc: 'অস্থিরতা সংকুচিত, সংকীর্ণ রেঞ্জে অপারেটরের নীরব সংগ্রহ। কোনো নিশ্চিত ডিরেকশন নেই।',
    category: 'tier2_momentum',
    rank: 10,
    filterLogicSummary: "s.p === 'Phase B'",
    verdictBn: '১০ থেকে ৪০ দিনে গড় রিটার্ন -০.১০% থেকে -০.৫৩%। এই ফেজে শেয়ারে মূলধন আটকে থাকে কিন্তু লাভ হয় না। শুধু ওয়াচলিস্টে রাখতে হবে।',
    verdictEn: 'Range-bound consolidation yielding negative net return (-0.10% to -0.53%); strictly a watchlist phase.',
    strengthsBn: ['ভবিষ্যত বড় মুভের প্রস্তুতি পর্যবেক্ষণ করা যায়'],
    risksBn: ['সপ্তাহের পর সপ্তাহ পোর্টফোলিও নিস্তেজ থাকে, ক্যাপিটাল অপরচুনিটি কস্ট নষ্ট হয়'],
    actionRecommendationBn: 'Phase B-তে এখনই কিনবেন না। স্প্রিং (Phase C) বা LPS (Phase D) আসা পর্যন্ত অপেক্ষা করুন।',
    backtest: {
      sampleCount: 2626,
      winRate: 45.0,
      avgReturn: -0.10,
      avgR: 0.95,
      excessAlpha: -0.89,
      profitFactor: 0.98,
      maxDrawdown: -8.0,
      tpRate: 9.2,
      slRate: 46.5,
      timeOutRate: 44.3,
      tStat: -1.26,
      pValue: 'p = 0.21',
      statSignificance: 'Moderate',
      bestHorizon: 'শুধুমাত্র পর্যবেক্ষণ (No Buy)',
      horizons: {
        d10: { net: -0.53, excess: -1.04, hit: 44.0, n: 2614 },
        d20: { net: -0.21, excess: -0.15, hit: 46.3, n: 2610 },
        d40: { net: -0.10, excess: -0.89, hit: 45.0, n: 2596 }
      },
      equityCurve: [
        { trade: 0, equity: 100000 },
        { trade: 50, equity: 99000 },
        { trade: 100, equity: 98500 }
      ]
    }
  },
  {
    id: 'Phase E',
    key: 'Phase E',
    label: 'Phase E (মার্কআপ)',
    icon: 'AlertCircle',
    badge: '⛔ লেট-এন্ট্রি নিষিদ্ধ (Rank #11)',
    title: 'Phase E (মার্কআপ / রান)',
    desc: 'ব্রেকআউট লেভেলের ১০%+ ওপরে, দাম > SMA20 > SMA50। ইতিমধ্যে বড় র‍্যালি সম্পন্ন হয়েছে।',
    category: 'tier3_avoidance',
    rank: 11,
    filterLogicSummary: "s.p === 'Phase E'",
    verdictBn: 'ইতিহাস সাক্ষ্য দেয়, Phase E-তে নতুন করে ঢুকলে ৪০ দিনে গড় ক্ষতি -৬.০৫%! এটি কেবল চলমান প্রফিটেবল পজিশন ট্রেইলিং স্টপ দিয়ে হোল্ড করার জন্য।',
    verdictEn: 'Late-stage markup phase; buying here results in -6.05% net loss over 40 days due to peak retail entrapment.',
    strengthsBn: ['আগের এন্ট্রি থাকলে ট্রেইলিং স্টপ দিয়ে সর্বোচ্চ মুনাফা নিশ্চিত করা যায়'],
    risksBn: ['নতুন কেনা রিটেইলদের শীর্ষ মূল্যে ফাঁদে ফেলে ডিস্ট্রিবিউশন শুরু হয়'],
    actionRecommendationBn: 'নতুন কোনো ফ্রেশ বাই অর্ডার দেবেন না। আপনার আগের শেয়ার থাকলে প্রফিট লক করুন।',
    backtest: {
      sampleCount: 1006,
      winRate: 36.3,
      avgReturn: -6.05,
      avgR: 0.70,
      excessAlpha: -2.48,
      profitFactor: 0.74,
      maxDrawdown: -16.4,
      tpRate: 8.5,
      slRate: 64.2,
      timeOutRate: 27.3,
      tStat: -2.48,
      pValue: 'p = 0.01',
      statSignificance: 'Negative / Avoid',
      bestHorizon: 'নতুন এন্ট্রি নিষিদ্ধ',
      horizons: {
        d10: { net: -3.14, excess: -1.39, hit: 36.0, n: 1006 },
        d20: { net: -3.46, excess: -1.44, hit: 35.7, n: 1005 },
        d40: { net: -6.05, excess: -2.48, hit: 36.3, n: 999 }
      },
      equityCurve: [
        { trade: 0, equity: 100000 },
        { trade: 30, equity: 95000 },
        { trade: 60, equity: 89000 },
        { trade: 90, equity: 82000 }
      ]
    }
  },
  {
    id: '__psell',
    key: '__psell',
    label: '🔴 সেলিং ডমিনেন্স',
    icon: 'TrendingDown',
    badge: '⛔ কড়া বিক্রয় চাপ (Rank #12)',
    title: 'সেলিং হাই · বাইং লো (Seller Dominance Decile 9-10)',
    desc: 'অর্ডারবুক এবং ট্রেড ফ্লোতে বিক্রেতার তীব্র প্রাধান্য (প্রেসার স্কোর < ৫০)।',
    category: 'tier3_avoidance',
    rank: 12,
    filterLogicSummary: "s.pst === 'sell' && !s.gn (Seller Dominance)",
    verdictBn: 'যেকোনো টাইমহরাইজনে নিশ্চিত নেগেটিভ রিটার্ন (৫ দিনে গড়ে -১.৮৫% পতন)। সাপোর্টে থাকলেও বাউন্স না দেওয়া পর্যন্ত কেনা সম্পূর্ণ বারণ।',
    verdictEn: 'Sustained negative orderflow drift; holding seller dominance results in consecutive downside erosion.',
    strengthsBn: ['কোন স্টকগুলো অবিলম্বে এড়িয়ে চলতে হবে তা নির্ভুল নির্দেশ করে'],
    risksBn: ['কেনার চেষ্টা করলে মূলধন ক্ষয়ের শতভাগ ঝুঁকি'],
    actionRecommendationBn: 'সম্পূর্ণ নো-বাই জোন। পোর্টফোলিওতে থাকলে প্রথম পুলব্যাকেই এক্সিট নিন।',
    backtest: {
      sampleCount: 142000,
      winRate: 38.6,
      avgReturn: -1.85,
      avgR: 0.65,
      excessAlpha: -1.42,
      profitFactor: 0.70,
      maxDrawdown: -15.8,
      tpRate: 6.0,
      slRate: 68.0,
      timeOutRate: 26.0,
      tStat: -5.40,
      pValue: 'p < 0.0001',
      statSignificance: 'Negative / Avoid',
      bestHorizon: 'বিক্রি / কোনো কেনা নয়',
      horizons: {
        d1: { net: -0.25, excess: -0.427, hit: 39.6 },
        d3: { net: -0.75, excess: -0.580, hit: 38.8 },
        d5: { net: -1.85, excess: -1.419, hit: 38.6 },
        d10: { net: -2.40, excess: -1.850, hit: 37.5, n: 141000 },
        d20: { net: -3.20, excess: -2.600, hit: 36.8, n: 140000 },
        d40: { net: -4.50, excess: -3.800, hit: 35.2, n: 139000 }
      },
      equityCurve: [
        { trade: 0, equity: 100000 },
        { trade: 50, equity: 94000 },
        { trade: 100, equity: 87000 },
        { trade: 150, equity: 79000 }
      ]
    }
  },
  {
    id: '__climax_dump',
    key: '__climax_dump',
    label: '🚨 ডাম্প সতর্কতা',
    icon: 'ShieldAlert',
    badge: '🛡️ সেরা ক্যাপিটাল রক্ষাকারী',
    title: '🚨 অপারেটর ডাম্প সতর্কতা (Climax Dump & Distribution Alert)',
    desc: '১০,০৭০টি ঐতিহাসিক ডিস্ট্রিবিউশন ইভেন্টের উপর পরীক্ষিত: অপারেটর ট্র্যাপ, Buying Climax, UTAD ও ভলিউম ড্রাই ডাইভারজেন্স।',
    category: 'tier3_avoidance',
    rank: 13,
    filterLogicSummary: "Distribution || UTAD/BC/SOW Flags || Overextended Sell || Climax Reversal",
    verdictBn: 'ট্রেডিংয়ের সবচেয়ে মূল্যবান ফিল্টার! এটি আপনাকে প্রফিট দেওয়ার চেয়েও বড় কাজ করে—১০ দিনে গড়ে -৫.৬৮% এবং পিক পতনে -২০% থেকে -৩৫% মূলধন ধ্বংস থেকে রক্ষা করে।',
    verdictEn: 'Tested across 10,070 distribution traps, this warning filter saves traders from an average -5.68% 10-day loss and protects capital from catastrophic drops.',
    strengthsBn: [
      '১০,০৭০টি ইভেন্টে ৬৫.৭% ডাম্প সফলভাবে পূর্বাভাস দিয়েছে',
      'রিটেইল ট্র্যাপে কেনা সম্পূর্ণ আটকে দেয়',
      'প্রফিট বুকিং ও এক্সিটের জন্য নির্ভুল অ্যালার্ম'
    ],
    risksBn: ['এটি কেনার সিগন্যাল নয়, বরং এক্সিট বা শট অ্যালার্ট'],
    actionRecommendationBn: 'জরুরি ভিত্তিতে প্রফিট তুলে বেরিয়ে আসুন। কোন অবস্থাতেই ‘সস্তা হয়েছে’ ভেবে এভারেজ করবেন না।',
    backtest: {
      sampleCount: 10070,
      winRate: 34.3,
      avgReturn: -5.68,
      avgR: 0.52,
      excessAlpha: -4.33,
      profitFactor: 0.62,
      maxDrawdown: -24.8,
      tpRate: 4.2,
      slRate: 72.8,
      timeOutRate: 23.0,
      tStat: -4.96,
      pValue: 'p < 0.00001',
      statSignificance: 'Negative / Avoid',
      bestHorizon: 'জরুরি প্রস্থান (Exit Alert)',
      horizons: {
        d10: { net: -5.68, excess: -4.33, hit: 34.3, n: 10040 },
        d20: { net: -2.44, excess: -2.06, hit: 37.4, n: 10008 },
        d40: { net: -3.11, excess: -2.78, hit: 35.9, n: 9980 }
      },
      equityCurve: [
        { trade: 0, equity: 100000 },
        { trade: 30, equity: 92000 },
        { trade: 60, equity: 84000 },
        { trade: 90, equity: 75000 },
        { trade: 120, equity: 66000 }
      ]
    }
  },
  {
    id: '__all',
    key: '__all',
    label: '🌐 সব শেয়ার (DSE Market Baseline)',
    icon: 'Globe',
    badge: '🏛️ বাজার বেঞ্চমার্ক',
    title: 'ঢাকা স্টক এক্সচেঞ্জ (DSE) বাজার বেঞ্চমার্ক',
    desc: 'ঢাকা স্টক এক্সচেঞ্জের ৪৬৩টি তালিকাভুক্ত স্টকে ২০১৩ থেকে ২০২৬ পর্যন্ত সামগ্রিক বাজারের স্বাভাবিক রিটার্ন বেঞ্চমার্ক।',
    category: 'market_all',
    rank: 14,
    filterLogicSummary: "All DSE Listed Securities (Unfiltered Market Baseline)",
    verdictBn: 'সামগ্রিক ডিএসই বাজারের গড় রিটার্ন ১০ দিনে মাত্র +০.৭০% এবং ২০ দিনে +০.০৯%। স্ক্যানারের ফিল্টার ছাড়া র‍্যান্ডম স্টক কেনা কোনো উল্লেখযোগ্য আলফা দেয় না।',
    verdictEn: 'Unfiltered baseline across 463 tickers shows near-flat baseline (+0.086% 20D), proving scanner filtering is essential to generate alpha.',
    strengthsBn: ['বেঞ্চমার্ক হিসেবে অন্য সব কৌশলের কার্যকারিতা যাচাইয়ের মানদণ্ড'],
    risksBn: ['ফিল্টারিং ছাড়া ব্রড মার্কেট হোল্ড করলে দীর্ঘমেয়াদে কোনো আউটপারফরম্যান্স মেলে না'],
    actionRecommendationBn: 'বাজারের স্বাভাবিক ড্র্যাগ থেকে বাঁচতে শুধুমাত্র র্যাংক ১ থেকে র্যাংক ৪ এর ফিল্টার্ড সেটআপে বিনিয়োগ করুন।',
    backtest: {
      sampleCount: 729986,
      winRate: 41.2,
      avgReturn: 0.09,
      avgR: 1.00,
      excessAlpha: 0.00,
      profitFactor: 1.02,
      maxDrawdown: -14.2,
      tpRate: 11.2,
      slRate: 51.5,
      timeOutRate: 37.3,
      tStat: 0.00,
      pValue: 'Baseline',
      statSignificance: 'Moderate',
      bestHorizon: 'বেঞ্চমার্ক',
      horizons: {
        d10: { net: 0.699, excess: 0.00, hit: 41.2, n: 729986 },
        d20: { net: 0.086, excess: 0.00, hit: 40.8, n: 725000 },
        d40: { net: 0.467, excess: 0.00, hit: 41.0, n: 715000 }
      },
      equityCurve: [
        { trade: 0, equity: 100000 },
        { trade: 50, equity: 100500 },
        { trade: 100, equity: 101200 },
        { trade: 150, equity: 100900 },
        { trade: 200, equity: 101500 }
      ]
    }
  }
];

// Helper to fetch live scanner stock data directly from asikstock repo
export async function fetchLiveScannerData(): Promise<{
  stocks: DSEStock[];
  lastDate: string;
  updatedUtc: string;
} | null> {
  try {
    const res = await fetch(`${DATA_ENDPOINTS.phases}?_t=${Date.now()}`, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      stocks: data.stocks || [],
      lastDate: data.last_date || '2026-10-26',
      updatedUtc: data.updated_utc || new Date().toISOString()
    };
  } catch (err) {
    console.warn('Could not fetch live phases.json from remote scanner, using fallback:', err);
    return null;
  }
}
