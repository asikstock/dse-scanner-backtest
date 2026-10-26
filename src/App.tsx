import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  SCANNER_TABS, 
  INITIAL_MARKET_SUMMARY, 
  fetchLiveScannerData,
  SCANNER_URL 
} from './data/scannerBacktestData';
import { ScannerTabConfig, LiveMarketSummary, DSEStock } from './types/scanner';
import { Header } from './components/Header';
import { WinningStrategyBanner } from './components/WinningStrategyBanner';
import { LeaderboardTable } from './components/LeaderboardTable';
import { StrategyCardsGrid } from './components/StrategyCardsGrid';
import { TabDetailModal } from './components/TabDetailModal';
import { ProfitSimulator } from './components/ProfitSimulator';
import { ExecutiveReportView } from './components/ExecutiveReportView';
import { LiveStockScannerTab } from './components/LiveStockScannerTab';
import { SniperSystemView } from './components/SniperSystemView';
import { 
  Trophy, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  Info,
  Layers,
  ArrowUpRight,
  Crosshair
} from 'lucide-react';

export default function App() {
  const [tabs] = useState<ScannerTabConfig[]>(SCANNER_TABS);
  const [summary, setSummary] = useState<LiveMarketSummary>(INITIAL_MARKET_SUMMARY);
  const [liveStocks, setLiveStocks] = useState<DSEStock[]>([]);
  const [isLiveLoading, setIsLiveLoading] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'sniper' | 'leaderboard' | 'simulator' | 'report' | 'live_stocks'>('sniper');
  const [selectedTabForModal, setSelectedTabForModal] = useState<ScannerTabConfig | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTabKeyForLive, setActiveTabKeyForLive] = useState<string>('__realistic_screened');

  // Load initial and live data from scanner repo
  const loadData = useCallback(async () => {
    setIsLiveLoading(true);
    const result = await fetchLiveScannerData();
    if (result && result.stocks && result.stocks.length > 0) {
      setLiveStocks(result.stocks);
      setSummary(prev => ({
        ...prev,
        lastDate: result.lastDate,
        updatedUtc: result.updatedUtc,
        totalStocks: result.stocks.length,
        setupCount: result.stocks.filter(s => s.ok && s.pst === 'buy').length
      }));
    }
    setIsLiveLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Compute live matches for each tab
  const liveMatchCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    tabs.forEach(t => {
      const matched = liveStocks.filter(s => {
        switch (t.key) {
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
      counts[t.key] = matched.length;
    });
    return counts;
  }, [tabs, liveStocks]);

  // Stocks matching the selected modal tab
  const stocksForSelectedModal = useMemo(() => {
    if (!selectedTabForModal) return [];
    return liveStocks.filter(s => {
      switch (selectedTabForModal.key) {
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
  }, [selectedTabForModal, liveStocks]);

  const handlePrint = () => {
    window.print();
  };

  const handleOpenSimulatorWithTab = (tab: ScannerTabConfig) => {
    setSelectedTabForModal(null);
    setActiveView('simulator');
  };

  const championTab = tabs[0];
  const runnerUpTab = tabs[1];
  const momentumTab = tabs[2];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        summary={summary}
        isLiveLoading={isLiveLoading}
        onRefresh={loadData}
        activeView={activeView}
        setActiveView={setActiveView}
        onPrintReport={handlePrint}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* View 1: Main Dashboard (Champion Spotlight + Cards Grid + Leaderboard) */}
        {activeView === 'dashboard' && (
          <>
            {/* Champion Winning Strategy Banner */}
            <WinningStrategyBanner
              winner={championTab}
              runnerUp={runnerUpTab}
              momentumPick={momentumTab}
              onSelectTab={(tab) => setSelectedTabForModal(tab)}
              onOpenSimulator={() => setActiveView('simulator')}
              onOpenSniper={() => setActiveView('sniper')}
            />

            {/* Strategy Cards Grid */}
            <StrategyCardsGrid
              tabs={tabs}
              onSelectTab={(tab) => setSelectedTabForModal(tab)}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              liveMatchCounts={liveMatchCounts}
            />

            {/* Quick Leaderboard Table */}
            <LeaderboardTable
              tabs={tabs}
              onSelectTab={(tab) => setSelectedTabForModal(tab)}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </>
        )}

        {/* View 2: High Velocity 85%+ Win-Rate Sniper System */}
        {activeView === 'sniper' && (
          <SniperSystemView stocks={liveStocks} />
        )}

        {/* View 3: Full Leaderboard Table View */}
        {activeView === 'leaderboard' && (
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white">ট্যাব পারফরম্যান্স লিডারবোর্ড</h2>
              <p className="text-sm text-slate-400">
                ঢাকা স্টক এক্সচেঞ্জের সকল স্ক্যানার ট্যাবের অতীত ট্রেড সংকেতের গাণিতিক মেট্রিক্স
              </p>
            </div>
            <LeaderboardTable
              tabs={tabs}
              onSelectTab={(tab) => setSelectedTabForModal(tab)}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
        )}

        {/* View 3: Portfolio Profit Simulator */}
        {activeView === 'simulator' && (
          <ProfitSimulator
            tabs={tabs}
            defaultTabKey={championTab.key}
            onSelectTab={(tab) => setSelectedTabForModal(tab)}
          />
        )}

        {/* View 4: Today's Live Stocks matching Scanner Tabs */}
        {activeView === 'live_stocks' && (
          <LiveStockScannerTab
            stocks={liveStocks}
            tabs={tabs}
            activeTabKey={activeTabKeyForLive}
            setActiveTabKey={setActiveTabKeyForLive}
            onSelectTabInfo={(tab) => setSelectedTabForModal(tab)}
          />
        )}

        {/* View 5: Full Executive Report */}
        {activeView === 'report' && (
          <ExecutiveReportView
            tabs={tabs}
            summary={summary}
            onPrint={handlePrint}
            onSelectTab={(tab) => setSelectedTabForModal(tab)}
          />
        )}
      </main>

      {/* Deep-Dive Modal for any selected tab */}
      {selectedTabForModal && (
        <TabDetailModal
          tab={selectedTabForModal}
          onClose={() => setSelectedTabForModal(null)}
          matchingStocks={stocksForSelectedModal}
          onOpenSimulatorWithTab={handleOpenSimulatorWithTab}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            DSE সিম্পল স্ক্যানার ব্যাকটেস্ট অ্যানালিটিক্স • ডেটা সোর্স:{' '}
            <a 
              href={SCANNER_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              asikstock.github.io/simple-scaner-/docs/
            </a>
          </p>
          <p className="font-mono text-[11px]">
            ১৩ বছর (২০১৩–২০২৬) • ৭,২৯,৯৮৬ ট্রেডিং রেকর্ড • ঢাকা স্টক এক্সচেঞ্জ (DSE)
          </p>
        </div>
      </footer>
    </div>
  );
}
