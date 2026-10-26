import fs from 'fs';
import path from 'path';

interface DailyBar {
  date: string;
  code: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  turnover: number;
}

interface StockSeries {
  code: string;
  bars: DailyBar[];
}

interface SectorMap {
  [code: string]: string;
}

// 1. Load sectors
function loadSectors(csvPath: string): SectorMap {
  const map: SectorMap = {};
  if (!fs.existsSync(csvPath)) return map;
  const lines = fs.readFileSync(csvPath, 'utf8').trim().split('\n');
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length >= 2) {
      map[parts[0].trim()] = parts[1].trim();
    }
  }
  return map;
}

// 2. Load all historical CSVs
function loadAllData(historyDir: string): { seriesMap: Map<string, DailyBar[]>; dates: string[] } {
  const files = fs.readdirSync(historyDir).filter(f => f.endsWith('.csv')).sort();
  console.log(`Loading ${files.length} CSV files from ${historyDir}...`);
  
  const seriesMap = new Map<string, DailyBar[]>();
  const dateSet = new Set<string>();

  for (const file of files) {
    const fullPath = path.join(historyDir, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.trim().split('\n');
    
    // Header check
    const header = lines[0].split(',');
    const dateIdx = header.findIndex(h => h.includes('DATE'));
    const codeIdx = header.findIndex(h => h.includes('CODE'));
    const openIdx = header.findIndex(h => h.includes('OPEN'));
    const highIdx = header.findIndex(h => h.includes('HIGH'));
    const lowIdx = header.findIndex(h => h.includes('LOW'));
    const closeIdx = header.findIndex(h => h.includes('CLOSE'));
    const volIdx = header.findIndex(h => h.includes('VOL'));

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;
      const cols = line.split(',');
      if (cols.length < 7) continue;

      const date = cols[dateIdx]?.trim();
      const code = cols[codeIdx]?.trim();
      const open = parseFloat(cols[openIdx]);
      const high = parseFloat(cols[highIdx]);
      const low = parseFloat(cols[lowIdx]);
      const close = parseFloat(cols[closeIdx]);
      const volume = parseFloat(cols[volIdx]);

      if (!date || !code || isNaN(close) || close <= 0) continue;

      const bar: DailyBar = {
        date,
        code,
        open: isNaN(open) || open <= 0 ? close : open,
        high: isNaN(high) || high <= 0 ? close : high,
        low: isNaN(low) || low <= 0 ? close : low,
        close,
        volume: isNaN(volume) ? 0 : volume,
        turnover: close * (isNaN(volume) ? 0 : volume)
      };

      dateSet.add(date);
      let list = seriesMap.get(code);
      if (!list) {
        list = [];
        seriesMap.set(code, list);
      }
      list.push(bar);
    }
  }

  // Sort each series by date
  for (const [code, list] of seriesMap.entries()) {
    list.sort((a, b) => a.date.localeCompare(b.date));
  }

  const dates = Array.from(dateSet).sort();
  console.log(`Loaded ${seriesMap.size} unique stock symbols across ${dates.length} trading days (${dates[0]} to ${dates[dates.length - 1]}).`);
  return { seriesMap, dates };
}

interface TradeExecution {
  code: string;
  sector: string;
  signalDate: string;
  entryDate: string;
  exitDate: string;
  entryPrice: number;
  exitPrice: number;
  returnPctRaw: number;
  returnPctNet: number;
  pnlBDT: number;
  holdingDays: number;
  exitReason: 'tp1_then_tp2' | 'tp1_then_breakeven' | 'tp1_then_stop' | 'sl' | 'time_stop' | 'circuit_delayed_sl';
  period: 'in_sample' | 'out_sample';
  costPaidPct: number;
  shares: number;
  capitalInvested: number;
}

interface BacktestConfig {
  name: string;
  enforceT2: boolean;
  entryExecution: 'next_open_plus_slippage' | 'same_day_close';
  roundTripCostPct: number;
  tickSlippageBDT: number;
  circuitFloorCheck: boolean;
  minDailyTurnoverBDT: number;
  timeStopDays: number;
  positionSizing: 'flawed_33pct' | 'realistic_risk_2pct';
  maxConcurrentPositions: number;
  sectorCapPct: number;
  tp1Pct: number;
  tp1SellFraction: number;
  tp2Pct: number;
  slPct: number;
}

function runEngine(
  seriesMap: Map<string, DailyBar[]>,
  sectors: SectorMap,
  cfg: BacktestConfig
) {
  // We need index lookup for each stock bar
  // Precompute 20-day SMA, 20-day avg turnover
  const indicators = new Map<string, {
    sma20: number[];
    avgTurnover20: number[];
  }>();

  for (const [code, bars] of seriesMap.entries()) {
    const sma20: number[] = new Array(bars.length);
    const avgTurnover20: number[] = new Array(bars.length);
    let sumClose = 0;
    let sumTurn = 0;

    for (let i = 0; i < bars.length; i++) {
      sumClose += bars[i].close;
      sumTurn += bars[i].turnover;

      if (i >= 20) {
        sumClose -= bars[i - 20].close;
        sumTurn -= bars[i - 20].turnover;
        sma20[i] = sumClose / 20;
        avgTurnover20[i] = sumTurn / 20;
      } else {
        sma20[i] = sumClose / (i + 1);
        avgTurnover20[i] = sumTurn / (i + 1);
      }
    }

    indicators.set(code, { sma20, avgTurnover20 });
  }

  // Simulation State
  let portfolioCash = 1000000; // 10 Lakh starting capital
  let portfolioEquity = 1000000;
  const closedTrades: TradeExecution[] = [];

  interface ActivePosition {
    code: string;
    sector: string;
    signalDate: string;
    entryDate: string;
    entryDayIdx: number;
    shares: number;
    sharesRemaining: number;
    entryPriceEffective: number;
    capitalInvested: number;
    tp1Price: number;
    tp2Price: number;
    slPrice: number;
    tp1Hit: boolean;
    period: 'in_sample' | 'out_sample';
  }

  let openPositions: ActivePosition[] = [];

  // Group all bars by date for portfolio simulation
  const dateMap = new Map<string, Map<string, { bar: DailyBar; barIdx: number }>>();
  for (const [code, bars] of seriesMap.entries()) {
    for (let i = 0; i < bars.length; i++) {
      const b = bars[i];
      let dayMap = dateMap.get(b.date);
      if (!dayMap) {
        dayMap = new Map();
        dateMap.set(b.date, dayMap);
      }
      dayMap.set(code, { bar: b, barIdx: i });
    }
  }

  const allDates = Array.from(dateMap.keys()).sort();

  for (let d = 0; d < allDates.length; d++) {
    const today = allDates[d];
    const dayBars = dateMap.get(today)!;
    const period = today <= '2020-12-31' ? 'in_sample' : 'out_sample';

    // 1. Process Open Positions First (Check exits on today's bar)
    const remainingPositions: ActivePosition[] = [];

    for (const pos of openPositions) {
      const stockInfo = dayBars.get(pos.code);
      if (!stockInfo) {
        // Stock did not trade today (holiday, suspension, etc.)
        remainingPositions.push(pos);
        continue;
      }

      const bar = stockInfo.bar;
      const barIdx = stockInfo.barIdx;
      const daysSinceEntry = barIdx - pos.entryDayIdx;

      // Check T+2 settlement rule
      // If enforceT2 is true, shares CANNOT be sold if daysSinceEntry < 2 (settlement cycle in DSE)
      const canSellToday = !cfg.enforceT2 || daysSinceEntry >= 2;

      // Check Lower Circuit / Floor Price Freeze
      // If stock opened at low and dropped >= 9.5% from previous close or volume is tiny, buyers = 0
      const isLockedDown = cfg.circuitFloorCheck && (
        (bar.open <= bar.low && (bar.close - bar.open) / bar.open <= -0.09) ||
        (bar.volume <= 100 && bar.close < pos.slPrice)
      );

      let closed = false;

      if (canSellToday) {
        // Check TP1
        if (!pos.tp1Hit && bar.high >= pos.tp1Price) {
          // Sell fraction (e.g. 40%) at TP1 price
          pos.tp1Hit = true;
          const sellShares = Math.floor(pos.shares * cfg.tp1SellFraction);
          const tp1ExitPrice = pos.tp1Price;
          
          // Cost on this portion
          const grossProceeds = sellShares * tp1ExitPrice;
          const cost = grossProceeds * (cfg.roundTripCostPct / 2) + sellShares * (cfg.tickSlippageBDT / 2);
          const netProceeds = grossProceeds - cost;
          
          portfolioCash += netProceeds;
          pos.sharesRemaining -= sellShares;

          // In flawed model, code assumes rest is sold at breakeven (+0.8%)
          if (cfg.name.includes('Flawed')) {
            const remShares = pos.sharesRemaining;
            const bePrice = pos.entryPriceEffective * 1.008;
            const remProceeds = remShares * bePrice;
            const remCost = remProceeds * (cfg.roundTripCostPct / 2);
            portfolioCash += (remProceeds - remCost);

            const totalProceeds = netProceeds + (remProceeds - remCost);
            const rawRet = ((totalProceeds / pos.capitalInvested) - 1) * 100;

            closedTrades.push({
              code: pos.code,
              sector: pos.sector,
              signalDate: pos.signalDate,
              entryDate: pos.entryDate,
              exitDate: today,
              entryPrice: pos.entryPriceEffective,
              exitPrice: (tp1ExitPrice * sellShares + bePrice * remShares) / pos.shares,
              returnPctRaw: rawRet,
              returnPctNet: rawRet,
              pnlBDT: totalProceeds - pos.capitalInvested,
              holdingDays: daysSinceEntry,
              exitReason: 'tp1_then_breakeven',
              period: pos.period,
              costPaidPct: cfg.roundTripCostPct * 100,
              shares: pos.shares,
              capitalInvested: pos.capitalInvested
            });

            closed = true;
          } else {
            // Realistic model: Move stop of remaining shares to Breakeven (+0.8%)
            pos.slPrice = pos.entryPriceEffective * 1.008;
          }
        }

        if (!closed) {
          // Check Stop Loss
          if (bar.low <= pos.slPrice) {
            if (isLockedDown) {
              // Circuit lock! Cannot sell today! Trader is trapped!
              // Keep holding until unfreezes
            } else {
              // Executed at SL price minus 1 tick slippage
              const exitP = Math.max(0.1, pos.slPrice - cfg.tickSlippageBDT);
              const grossProceeds = pos.sharesRemaining * exitP;
              const cost = grossProceeds * (cfg.roundTripCostPct / 2);
              const netProceeds = grossProceeds - cost;
              portfolioCash += netProceeds;

              // Calculate overall trade PnL
              const totalRet = ((portfolioCash - (portfolioCash - netProceeds)) / pos.capitalInvested);
              const pnl = (pos.tp1Hit ? (pos.shares - pos.sharesRemaining) * pos.tp1Price : 0) + netProceeds - pos.capitalInvested;
              const netPct = (pnl / pos.capitalInvested) * 100;

              closedTrades.push({
                code: pos.code,
                sector: pos.sector,
                signalDate: pos.signalDate,
                entryDate: pos.entryDate,
                exitDate: today,
                entryPrice: pos.entryPriceEffective,
                exitPrice: exitP,
                returnPctRaw: netPct + (cfg.roundTripCostPct * 100),
                returnPctNet: netPct,
                pnlBDT: pnl,
                holdingDays: daysSinceEntry,
                exitReason: pos.tp1Hit ? 'tp1_then_stop' : 'sl',
                period: pos.period,
                costPaidPct: cfg.roundTripCostPct * 100,
                shares: pos.shares,
                capitalInvested: pos.capitalInvested
              });
              closed = true;
            }
          } else if (pos.tp1Hit && bar.high >= pos.tp2Price) {
            // Hit Target 2!
            const exitP = pos.tp2Price - cfg.tickSlippageBDT;
            const grossProceeds = pos.sharesRemaining * exitP;
            const cost = grossProceeds * (cfg.roundTripCostPct / 2);
            const netProceeds = grossProceeds - cost;
            portfolioCash += netProceeds;

            const pnl = (pos.shares - pos.sharesRemaining) * pos.tp1Price + netProceeds - pos.capitalInvested;
            const netPct = (pnl / pos.capitalInvested) * 100;

            closedTrades.push({
              code: pos.code,
              sector: pos.sector,
              signalDate: pos.signalDate,
              entryDate: pos.entryDate,
              exitDate: today,
              entryPrice: pos.entryPriceEffective,
              exitPrice: exitP,
              returnPctRaw: netPct + (cfg.roundTripCostPct * 100),
              returnPctNet: netPct,
              pnlBDT: pnl,
              holdingDays: daysSinceEntry,
              exitReason: 'tp1_then_tp2',
              period: pos.period,
              costPaidPct: cfg.roundTripCostPct * 100,
              shares: pos.shares,
              capitalInvested: pos.capitalInvested
            });
            closed = true;
          } else if (daysSinceEntry >= cfg.timeStopDays) {
            // Time Stop! Exit at today's close
            if (!isLockedDown) {
              const exitP = Math.max(0.1, bar.close - cfg.tickSlippageBDT);
              const grossProceeds = pos.sharesRemaining * exitP;
              const cost = grossProceeds * (cfg.roundTripCostPct / 2);
              const netProceeds = grossProceeds - cost;
              portfolioCash += netProceeds;

              const pnl = (pos.tp1Hit ? (pos.shares - pos.sharesRemaining) * pos.tp1Price : 0) + netProceeds - pos.capitalInvested;
              const netPct = (pnl / pos.capitalInvested) * 100;

              closedTrades.push({
                code: pos.code,
                sector: pos.sector,
                signalDate: pos.signalDate,
                entryDate: pos.entryDate,
                exitDate: today,
                entryPrice: pos.entryPriceEffective,
                exitPrice: exitP,
                returnPctRaw: netPct + (cfg.roundTripCostPct * 100),
                returnPctNet: netPct,
                pnlBDT: pnl,
                holdingDays: daysSinceEntry,
                exitReason: 'time_stop',
                period: pos.period,
                costPaidPct: cfg.roundTripCostPct * 100,
                shares: pos.shares,
                capitalInvested: pos.capitalInvested
              });
              closed = true;
            }
          }
        }
      }

      if (!closed) {
        remainingPositions.push(pos);
      }
    }

    openPositions = remainingPositions;

    // 2. Scan for New Signals Generated Today
    // (To enter tomorrow morning at Next Open)
    if (d < allDates.length - 1) {
      const nextDate = allDates[d + 1];
      const nextDayBars = dateMap.get(nextDate)!;

      // Collect candidate signals from today's closing prices
      interface CandidateSignal {
        code: string;
        sector: string;
        signalPrice: number;
        dev: number;
        chg: number;
        turnover20: number;
      }

      const signalsToday: CandidateSignal[] = [];

      for (const [code, { bar, barIdx }] of dayBars.entries()) {
        const ind = indicators.get(code);
        if (!ind || barIdx < 20) continue;

        const sma = ind.sma20[barIdx];
        const turn20 = ind.avgTurnover20[barIdx];

        // Liquidity Filter
        if (turn20 < cfg.minDailyTurnoverBDT) continue;

        // Price deviation from 20-day SMA (-5% to +5%)
        const dev = ((bar.close - sma) / sma) * 100;
        if (dev < -5.0 || dev > 5.0) continue;

        // Day's price change (-2.5% to +3.8%)
        const prevBar = seriesMap.get(code)![barIdx - 1];
        if (!prevBar) continue;
        const chg = ((bar.close - prevBar.close) / prevBar.close) * 100;
        if (chg < -2.5 || chg > 3.8) continue;

        const sector = sectors[code] || 'Others';
        signalsToday.push({
          code,
          sector,
          signalPrice: bar.close,
          dev,
          chg,
          turnover20: turn20
        });
      }

      // Sort by closest to support (lowest deviation) & highest turnover
      signalsToday.sort((a, b) => a.dev - b.dev);

      // Check how many open slots available in portfolio
      const availableSlots = cfg.maxConcurrentPositions - openPositions.length;
      if (availableSlots > 0 && signalsToday.length > 0) {
        for (const sig of signalsToday) {
          if (openPositions.length >= cfg.maxConcurrentPositions) break;
          // Check if already holding this code
          if (openPositions.some(p => p.code === sig.code)) continue;

          // Check Sector Cap
          const currentSectorCount = openPositions.filter(p => p.sector === sig.sector).length;
          const sectorShare = (currentSectorCount + 1) / cfg.maxConcurrentPositions;
          if (sectorShare > cfg.sectorCapPct) continue;

          // Next day bar
          const nextStockInfo = nextDayBars.get(sig.code);
          if (!nextStockInfo) continue; // did not trade next day

          const nextBar = nextStockInfo.bar;
          const nextBarIdx = nextStockInfo.barIdx;

          let entryPrice = nextBar.open;
          if (cfg.entryExecution === 'same_day_close') {
            entryPrice = sig.signalPrice;
          } else {
            // Next open + 1 tick slippage
            entryPrice = nextBar.open + cfg.tickSlippageBDT;
          }

          if (entryPrice <= 0) continue;

          // Position sizing
          let positionCapital = 0;
          if (cfg.positionSizing === 'flawed_33pct') {
            positionCapital = Math.min(portfolioCash, portfolioEquity * 0.33);
          } else {
            // Risk 1.5% of total equity, with 7.5% stop loss
            // Position size = (Equity * 0.015) / 0.075 = Equity * 0.20 (max 20% per position)
            const riskAmount = portfolioEquity * 0.015;
            const stopDistPct = cfg.slPct;
            positionCapital = Math.min(portfolioCash, Math.min(portfolioEquity * 0.20, riskAmount / stopDistPct));
          }

          if (positionCapital < 10000) continue; // Minimum 10,000 BDT position

          // Transaction cost on entry
          const entryCost = positionCapital * (cfg.roundTripCostPct / 2);
          const actualInvested = positionCapital - entryCost;
          const shares = Math.floor(actualInvested / entryPrice);
          if (shares <= 0) continue;

          const totalCostSpent = shares * entryPrice + entryCost;
          portfolioCash -= totalCostSpent;

          const tp1Price = entryPrice * (1 + cfg.tp1Pct);
          const tp2Price = entryPrice * (1 + cfg.tp2Pct);
          const slPrice = entryPrice * (1 - cfg.slPct);

          openPositions.push({
            code: sig.code,
            sector: sig.sector,
            signalDate: today,
            entryDate: nextDate,
            entryDayIdx: nextBarIdx,
            shares,
            sharesRemaining: shares,
            entryPriceEffective: entryPrice,
            capitalInvested: totalCostSpent,
            tp1Price,
            tp2Price,
            slPrice,
            tp1Hit: false,
            period: nextDate <= '2020-12-31' ? 'in_sample' : 'out_sample'
          });
        }
      }
    }

    // Update Mark-to-Market Equity
    let investedVal = 0;
    for (const pos of openPositions) {
      const stockInfo = dayBars.get(pos.code);
      const curPrice = stockInfo ? stockInfo.bar.close : pos.entryPriceEffective;
      investedVal += pos.sharesRemaining * curPrice;
    }
    portfolioEquity = portfolioCash + investedVal;
  }

  // Calculate Comprehensive Metrics
  function calcStats(trades: TradeExecution[]) {
    if (trades.length === 0) {
      return {
        totalTrades: 0,
        winRate: 0,
        profitFactor: 0,
        expectancyPct: 0,
        avgWinPct: 0,
        avgLossPct: 0,
        maxDrawdownPct: 0,
        cagrPct: 0,
        sharpeRatio: 0,
        sortinoRatio: 0,
        avgHoldingDays: 0,
        tp1ThenTp2Rate: 0,
        tp1ThenBERate: 0,
        slRate: 0,
        timeStopRate: 0
      };
    }

    const wins = trades.filter(t => t.returnPctNet > 0);
    const losses = trades.filter(t => t.returnPctNet <= 0);

    const winRate = (wins.length / trades.length) * 100;
    const grossGains = wins.reduce((sum, t) => sum + t.pnlBDT, 0);
    const grossLosses = Math.abs(losses.reduce((sum, t) => sum + t.pnlBDT, 0));
    const profitFactor = grossLosses > 0 ? grossGains / grossLosses : grossGains > 0 ? 99 : 0;

    const avgWinPct = wins.length > 0 ? wins.reduce((sum, t) => sum + t.returnPctNet, 0) / wins.length : 0;
    const avgLossPct = losses.length > 0 ? losses.reduce((sum, t) => sum + t.returnPctNet, 0) / losses.length : 0;
    const expectancyPct = trades.reduce((sum, t) => sum + t.returnPctNet, 0) / trades.length;
    const avgHoldingDays = trades.reduce((sum, t) => sum + t.holdingDays, 0) / trades.length;

    // Drawdown and Sharpe
    let peak = 1000000;
    let currentEq = 1000000;
    let maxDD = 0;
    const rets: number[] = [];

    for (const t of trades) {
      currentEq += t.pnlBDT;
      if (currentEq > peak) peak = currentEq;
      const dd = ((currentEq - peak) / peak) * 100;
      if (dd < maxDD) maxDD = dd;
      rets.push(t.returnPctNet);
    }

    const meanRet = expectancyPct;
    const stdRet = Math.sqrt(rets.reduce((s, r) => s + Math.pow(r - meanRet, 2), 0) / rets.length) || 1;
    const downRets = rets.filter(r => r < 0);
    const downStd = downRets.length > 0 ? Math.sqrt(downRets.reduce((s, r) => s + Math.pow(r, 2), 0) / downRets.length) : 1;

    const sharpe = (meanRet / stdRet) * Math.sqrt(252 / avgHoldingDays);
    const sortino = (meanRet / downStd) * Math.sqrt(252 / avgHoldingDays);

    const firstDate = new Date(trades[0].entryDate).getTime();
    const lastDate = new Date(trades[trades.length - 1].exitDate).getTime();
    const years = Math.max(0.5, (lastDate - firstDate) / (1000 * 3600 * 24 * 365.25));
    const totalGrowth = currentEq / 1000000;
    const cagr = totalGrowth > 0 ? (Math.pow(totalGrowth, 1 / years) - 1) * 100 : -100;

    const tp1ThenTp2 = (trades.filter(t => t.exitReason === 'tp1_then_tp2').length / trades.length) * 100;
    const tp1ThenBE = (trades.filter(t => t.exitReason === 'tp1_then_breakeven').length / trades.length) * 100;
    const sl = (trades.filter(t => t.exitReason === 'sl' || t.exitReason === 'tp1_then_stop').length / trades.length) * 100;
    const timeStop = (trades.filter(t => t.exitReason === 'time_stop').length / trades.length) * 100;

    return {
      totalTrades: trades.length,
      winRate: Number(winRate.toFixed(2)),
      profitFactor: Number(profitFactor.toFixed(2)),
      expectancyPct: Number(expectancyPct.toFixed(2)),
      avgWinPct: Number(avgWinPct.toFixed(2)),
      avgLossPct: Number(avgLossPct.toFixed(2)),
      maxDrawdownPct: Number(maxDD.toFixed(2)),
      cagrPct: Number(cagr.toFixed(2)),
      sharpeRatio: Number(sharpe.toFixed(2)),
      sortinoRatio: Number(sortino.toFixed(2)),
      avgHoldingDays: Number(avgHoldingDays.toFixed(1)),
      tp1ThenTp2Rate: Number(tp1ThenTp2.toFixed(1)),
      tp1ThenBERate: Number(tp1ThenBE.toFixed(1)),
      slRate: Number(sl.toFixed(1)),
      timeStopRate: Number(timeStop.toFixed(1))
    };
  }

  // Yearly Breakdown
  const yearlyMap = new Map<string, TradeExecution[]>();
  for (const t of closedTrades) {
    const y = t.exitDate.substring(0, 4);
    let list = yearlyMap.get(y);
    if (!list) {
      list = [];
      yearlyMap.set(y, list);
    }
    list.push(t);
  }

  const yearlyStats: { [year: string]: any } = {};
  for (const [year, list] of yearlyMap.entries()) {
    yearlyStats[year] = calcStats(list);
  }

  // Sector Breakdown
  const sectorMapGroup = new Map<string, TradeExecution[]>();
  for (const t of closedTrades) {
    let list = sectorMapGroup.get(t.sector);
    if (!list) {
      list = [];
      sectorMapGroup.set(t.sector, list);
    }
    list.push(t);
  }

  const sectorStats: { [sector: string]: any } = {};
  for (const [sector, list] of sectorMapGroup.entries()) {
    if (list.length >= 10) {
      sectorStats[sector] = calcStats(list);
    }
  }

  const inSampleTrades = closedTrades.filter(t => t.period === 'in_sample');
  const outSampleTrades = closedTrades.filter(t => t.period === 'out_sample');

  return {
    config: cfg.name,
    allStats: calcStats(closedTrades),
    inSampleStats: calcStats(inSampleTrades),
    outSampleStats: calcStats(outSampleTrades),
    yearlyStats,
    sectorStats,
    sampleTrades: closedTrades.slice(0, 30)
  };
}

// MAIN EXECUTION
function main() {
  const historyDir = '/tmp/simple-scaner-/history';
  const sectorsPath = '/tmp/simple-scaner-/docs/data/sectors.csv';

  const sectors = loadSectors(sectorsPath);
  const { seriesMap, dates } = loadAllData(historyDir);

  // 1. RUN OLD FLAWED STRATEGY (The "93.8% Zero-Loss" claim model)
  console.log('\n--- RUNNING MODEL 1: OLD FLAWED MODEL (No T+2, 0 Slippage, 33% capital per trade) ---');
  const flawedResults = runEngine(seriesMap, sectors, {
    name: 'Old Flawed Model (Fantasy Assumptions)',
    enforceT2: false,
    entryExecution: 'same_day_close',
    roundTripCostPct: 0.005, // 0.5% only
    tickSlippageBDT: 0.0,
    circuitFloorCheck: false,
    minDailyTurnoverBDT: 0, // No liquidity filter
    timeStopDays: 40,
    positionSizing: 'flawed_33pct',
    maxConcurrentPositions: 3,
    sectorCapPct: 1.0, // No sector cap
    tp1Pct: 0.038, // +3.8%
    tp1SellFraction: 0.40,
    tp2Pct: 0.20,
    slPct: 0.075
  });

  // 2. RUN REALISTIC DSE BACKTEST ENGINE
  console.log('\n--- RUNNING MODEL 2: REALISTIC DSE INSTITUTIONAL ENGINE ---');
  const realisticResults = runEngine(seriesMap, sectors, {
    name: 'Realistic DSE Institutional Engine (T+2, Costs, Slippage, Floor Rules)',
    enforceT2: true,
    entryExecution: 'next_open_plus_slippage',
    roundTripCostPct: 0.005, // 0.5% brokerage
    tickSlippageBDT: 0.10, // 0.10 BDT tick slippage on entry & exit
    circuitFloorCheck: true, // Non-fills on lower circuit / floor price
    minDailyTurnoverBDT: 5000000, // 50 Lakh BDT daily turnover
    timeStopDays: 15, // 15 trading days time stop
    positionSizing: 'realistic_risk_2pct',
    maxConcurrentPositions: 6,
    sectorCapPct: 0.30, // 30% max sector allocation
    tp1Pct: 0.045, // +4.5%
    tp1SellFraction: 0.50,
    tp2Pct: 0.18,
    slPct: 0.065
  });

  const combinedOutput = {
    generatedAt: new Date().toISOString(),
    flawedResults,
    realisticResults
  };

  const outputPath = path.join(process.cwd(), 'src/data/realisticAuditResults.json');
  fs.writeFileSync(outputPath, JSON.stringify(combinedOutput, null, 2));
  console.log(`\nSuccessfully generated realistic audit report to ${outputPath}!`);

  console.log('\n================ AUDIT SUMMARY ================');
  console.log('Model 1 (Flawed Theory):');
  console.log(`- Win Rate: ${flawedResults.allStats.winRate}%`);
  console.log(`- Profit Factor: ${flawedResults.allStats.profitFactor}`);
  console.log(`- Expectancy: ${flawedResults.allStats.expectancyPct}%`);
  console.log(`- Max Drawdown: ${flawedResults.allStats.maxDrawdownPct}%`);
  console.log(`- Total Trades: ${flawedResults.allStats.totalTrades}`);

  console.log('\nModel 2 (Realistic DSE Reality):');
  console.log(`- Win Rate: ${realisticResults.allStats.winRate}% (Out-of-sample: ${realisticResults.outSampleStats.winRate}%)`);
  console.log(`- Profit Factor: ${realisticResults.allStats.profitFactor} (Out-of-sample: ${realisticResults.outSampleStats.profitFactor})`);
  console.log(`- Expectancy: ${realisticResults.allStats.expectancyPct}%`);
  console.log(`- Max Drawdown: ${realisticResults.allStats.maxDrawdownPct}%`);
  console.log(`- Total Trades: ${realisticResults.allStats.totalTrades}`);
  console.log(`- In-Sample (2013-2020) CAGR: ${realisticResults.inSampleStats.cagrPct}%`);
  console.log(`- Out-of-Sample (2021-2024) CAGR: ${realisticResults.outSampleStats.cagrPct}%`);
}

main();
