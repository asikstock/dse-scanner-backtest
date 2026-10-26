export type TabCategory = 'tier1_alpha' | 'tier2_momentum' | 'tier3_avoidance' | 'market_all';

export interface HorizonPerformance {
  net: number;     // Net return %
  excess: number;  // Excess return % over benchmark
  hit: number;     // Hit rate % (win rate)
  n?: number;      // Sample count
  tStat?: number;  // T-statistic
}

export interface BacktestMetrics {
  sampleCount: number;         // Total historical events evaluated
  winRate: number;             // Win rate %
  avgReturn: number;           // Average return %
  avgR: number;                // Average R-Multiple (Risk:Reward realized)
  excessAlpha: number;         // Excess return over DSE market baseline %
  profitFactor: number;        // Gross profit / gross loss
  maxDrawdown: number;         // Max drawdown %
  tpRate: number;              // Target reached %
  slRate: number;              // Stop-loss triggered %
  timeOutRate: number;         // Time exit % (e.g. 40 days)
  tStat: number;               // Statistical significance
  pValue: string;              // e.g. 'p < 0.001' or 'p = 0.04'
  statSignificance: 'Very High' | 'High' | 'Moderate' | 'Negative / Avoid';
  bestHorizon: string;         // e.g. '১০-২০ কার্যদিবস'
  horizons: {
    d1?: HorizonPerformance;
    d3?: HorizonPerformance;
    d5?: HorizonPerformance;
    d10: HorizonPerformance;
    d20: HorizonPerformance;
    d40: HorizonPerformance;
  };
  equityCurve: { trade: number; equity: number }[];
}

export interface ScannerTabConfig {
  id: string;
  key: string;
  label: string;
  icon: string;
  badge: string;
  title: string;
  desc: string;
  category: TabCategory;
  rank: number; // 1 = best
  isWinner?: boolean;
  verdictBn: string;
  verdictEn: string;
  strengthsBn: string[];
  risksBn: string[];
  actionRecommendationBn: string;
  backtest: BacktestMetrics;
  filterLogicSummary: string;
}

export interface DSEStock {
  c: string;        // Code / Symbol
  s: string;        // Sector
  p: string;        // Wyckoff Phase
  cl: number;       // LTP (Last traded price)
  ch: number;       // Change %
  v: number;        // Volume
  val: number;      // Turnover (Crore BDT)
  m20: number;      // SMA 20
  m50: number;      // SMA 50
  vr: number;       // Volume Ratio
  vr5?: number;     // 5-day Volume Ratio
  pbuy: number;     // Buyer pressure score (0-100)
  psell: number;    // Seller pressure score (0-100)
  pst: 'buy' | 'sell' | 'neutral'; // Pressure state
  ok: boolean;      // RRR >= 1:2 and entry valid
  en: number;       // Entry price
  sl: number;       // Stop loss price
  tg: number;       // Target price
  rr: number;       // Risk Reward Ratio
  lc?: boolean;     // Low cap
  pu?: number;      // Paid up capital (Crore BDT)
  pe?: number | null;
  gn?: string | null;
  idle?: number;
  lk?: string | null;
  fl?: string[];    // Flags like ['STEALTH', 'UTAD', etc.]
  wl?: boolean;     // Watchlist / stealth flag
  dev?: number | null; // Deviation % from 20-day baseline
  sp?: number[];    // Sparkline recent prices
}

export interface LiveMarketSummary {
  lastDate: string;
  updatedUtc: string;
  totalStocks: number;
  liquidStocks: number;
  setupCount: number;
  baseline: {
    h10: number;
    h20: number;
    h40: number;
  };
  totalHistoricalRows: number;
  backtestDateRange: string;
}

export interface SniperCandidate {
  stock: DSEStock;
  score: number;
  grade: 'A+' | 'A' | 'B';
  reasons: string[];
  entryPrice: number;
  stopLoss: number;
  target1: number;
  target2: number;
  rrr: number;
  velocityScore: number;
  holdingHorizon: string;
  deviation: number;
  isAtSupport: boolean;
  supportDesc: string;
  sparklinePrices: number[];
}

