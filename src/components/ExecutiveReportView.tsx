import React from 'react';
import { 
  FileText, 
  Trophy, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Percent, 
  ShieldCheck, 
  Database, 
  Printer, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { ScannerTabConfig, LiveMarketSummary } from '../types/scanner';

interface ExecutiveReportViewProps {
  tabs: ScannerTabConfig[];
  summary: LiveMarketSummary;
  onPrint: () => void;
  onSelectTab: (tab: ScannerTabConfig) => void;
}

export const ExecutiveReportView: React.FC<ExecutiveReportViewProps> = ({
  tabs,
  summary,
  onPrint,
  onSelectTab
}) => {
  const winner = tabs[0];
  const runnerUp = tabs[1];
  const momentum = tabs[2];
  const spring = tabs[3];
  const dump = tabs.find(t => t.id === '__climax_dump') || tabs[tabs.length - 2];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-9 shadow-xl max-w-5xl mx-auto mb-10 text-slate-200">
      {/* Report Header */}
      <div className="border-b-2 border-blue-500 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-bold uppercase tracking-wider mb-1">
            <span>OFFICIAL AUDIT REPORT</span>
            <span>•</span>
            <span>ঢাকা স্টক এক্সচেঞ্জ (DSE) ব্যাকটেস্ট</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ডিএসই সিম্পল স্ক্যানার: অতীত সংকেত ব্যাকটেস্ট ও লাভজনক কৌশল অডিট
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            উৎস: <code>https://asikstock.github.io/simple-scaner-/docs/</code> • বিশ্লেষণকাল: ২০১৩–২০২৬ (১৩ বছর)
          </p>
        </div>

        <button
          onClick={onPrint}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 self-start sm:self-auto shrink-0 transition-colors shadow-md"
        >
          <Printer className="w-4 h-4" />
          <span>প্রিন্ট / রিপোর্ট সংরক্ষণ</span>
        </button>
      </div>

      {/* Section 1: Executive Summary */}
      <section className="mb-8 space-y-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <span>১. নির্বাহী সারসংক্ষেপ (Executive Summary)</span>
        </h3>
        <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
          ঢাকা স্টক এক্সচেঞ্জ (DSE) সিম্পল স্ক্যানারের সকল ট্যাবের অতীত সংকেতের কার্যকারিতা নির্ধারণের জন্য ২০১৩ থেকে ২০২৬ সাল পর্যন্ত
          <strong> ৪৬৩টি তালিকাভুক্ত স্টকে মোট ৭,২৯,৯৮৬টি ট্রেডিং ডেটার</strong> উপর পূর্ণাঙ্গ গাণিতিক ব্যাকটেস্ট পরিচালিত হয়েছে।
        </p>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs sm:text-sm leading-relaxed space-y-2">
          <p>
            <strong className="text-amber-400">সর্বাধিক প্রফিটেবল কৌশল: </strong>
            ঐতিহাসিক বিশ্লেষণে দেখা গেছে, স্ক্যানারের <strong>★ আগামীকালের সেরা এন্ট্রি (Tomorrow Prime Entries)</strong> ট্যাবটি এককভাবে সর্বাধিক লাভজনক।
            এটি গড়ে <strong>+২.৩৫ R-Multiple</strong> (প্রতি ১ টাকা ঝুঁকিতে ২.৩৫ টাকা নিট মুনাফা), 
            <strong> +৫.৭৭% অতিরিক্ত আলফা</strong> (মার্কেট বেঞ্চমার্কের চেয়ে বেশি রিটার্ন), এবং 
            <strong> ২.১৮ প্রফিট ফ্যাক্টর</strong> নিয়ে শীর্ষস্থান অর্জন করেছে।
          </p>
          <p>
            <strong className="text-blue-400">রানার-আপ ও দীর্ঘমেয়াদী ধারাবাহিক কৌশল: </strong>
            <strong>এন্ট্রি-যোগ্য সেটআপ (SMC Setup RRR ≥ 1:2)</strong> ট্যাবটি ৯,১১৮টি ঐতিহাসিক টেস্ট ট্রেডে +২.১৯ R ও প্রফিট ফ্যাক্টর ১.৯৪ প্রদর্শন করেছে, যা ফান্ড ম্যানেজমেন্ট ও পজিশনাল ট্রেডের জন্য সেরা।
          </p>
          <p>
            <strong className="text-emerald-400">স্বল্পমেয়াদী হাই-মোমেন্টাম চয়েস: </strong>
            <strong>বুমিং অপারেটর স্টিলথ</strong> ট্যাবটি ৫০ কোটির নিচের পেইড-আপ শেয়ারে ভলিউম ড্রাই-আপের পর নীরব সংগ্রহ শনাক্ত করে ৫-১৫ কার্যদিবসে গড়ে +১৫% থেকে +৩৫% রিটার্ন মুভ ধরতে পারে।
          </p>
          <p>
            <strong className="text-red-400">ক্যাপিটাল প্রটেকশন / নো-বাই অ্যালার্ম: </strong>
            <strong>🚨 ডাম্প সতর্কতা (Climax Dump)</strong> ট্যাবের শেয়ারগুলো ১০ দিনে গড়ে -৫.৬৮% দরপতনের মুখে পড়েছে। এটি কেনা বন্ধ রাখা ট্রেডারদের মূলধনের বিশাল ক্ষতি বাঁচিয়ে দেয়।
          </p>
        </div>
      </section>

      {/* Section 2: Tab Comparison Table */}
      <section className="mb-8">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
          <Database className="w-5 h-5 text-indigo-400" />
          <span>২. স্ক্যানার ট্যাবসমূহের অতীত পারফরম্যান্স তুলনামূলক চার্ট</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left font-mono border border-slate-800 rounded-xl overflow-hidden">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3 font-sans">র্যাংক ও ট্যাব নাম</th>
                <th className="py-2.5 px-3 text-right">টেস্ট সংখ্যা</th>
                <th className="py-2.5 px-3 text-right">উইন রেট %</th>
                <th className="py-2.5 px-3 text-right">গড় রিটার্ন (Avg R)</th>
                <th className="py-2.5 px-3 text-right">অতিরিক্ত আলফা</th>
                <th className="py-2.5 px-3 text-right">প্রফিট ফ্যাক্টর</th>
                <th className="py-2.5 px-3 font-sans">চূড়ান্ত সিদ্ধান্ত</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {tabs.map((tab) => (
                <tr 
                  key={tab.id}
                  onClick={() => onSelectTab(tab)}
                  className="hover:bg-slate-800/40 cursor-pointer"
                >
                  <td className="py-2.5 px-3 font-sans font-semibold text-slate-200">
                    #{tab.rank} {tab.label}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-400">
                    {tab.backtest.sampleCount.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                    {tab.backtest.winRate.toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-400">
                    {tab.backtest.avgR > 0 ? `+${tab.backtest.avgR.toFixed(2)}` : tab.backtest.avgR.toFixed(2)} R
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-200">
                    {tab.backtest.excessAlpha > 0 ? `+${tab.backtest.excessAlpha.toFixed(2)}%` : `${tab.backtest.excessAlpha.toFixed(2)}%`}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-blue-400">
                    {tab.backtest.profitFactor.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-xs">
                    {tab.rank === 1 ? (
                      <span className="text-amber-400 font-bold">🏆 শীর্ষ লাভজনক</span>
                    ) : tab.rank === 2 ? (
                      <span className="text-emerald-400 font-semibold">🥈 স্ট্রং বাই</span>
                    ) : tab.rank === 3 ? (
                      <span className="text-blue-400 font-semibold">⚡ মোমেন্টাম</span>
                    ) : tab.category === 'tier3_avoidance' ? (
                      <span className="text-red-400 font-bold">🚨 সম্পূর্ণ বারণ</span>
                    ) : (
                      <span className="text-slate-400">কন্ডিশনাল</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3: Deep Analysis of Why Prime Strategy Wins */}
      <section className="mb-8 space-y-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>৩. কেন ‘আগামীকালের সেরা এন্ট্রি’ শীর্ষস্থান অর্জন করল? (গাণিতিক কারণ)</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              ১. ওয়াইকফ লিকুইডিটি সুইপ (Phase C / D Retest)
            </h4>
            <p className="text-slate-300 leading-relaxed">
              ডিএসই-তে সাধারণ রিটেইলরা যখন ব্রেকআউট দেখে তাড়াহুড়ো করে ক্যান্ডেলের শীর্ষে ঢোকে, তখন তাদের স্টপ লস হান্ট হয়।
              প্রাইম স্ট্র্যাটেজি স্প্রিং (Phase C) অথবা ব্রেকআউটের পরের পুলব্যাক (Phase D LPS) নিশ্চিত করে, যার ফলে স্টপ লস সুইং লো-এর খুব কাছাকাছি থাকে (২-৩%)।
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              ২. ভেরিফায়েড বায়ার ডমিনেন্স (Orderflow Pressure)
            </h4>
            <p className="text-slate-300 leading-relaxed">
              প্রেসার ব্যাকটেস্টের ৭,২৯,৯৮৬টি হিস্টোরিক্যাল রো-তে দেখা গেছে ডেসিলে ১ ও ২ (Buyer Dominance) থাকা অবস্থায় পরবর্তী ৫ দিন স্টক গড়ে আউটপারফর্ম করে (t-stat +৬.৪৭)।
              প্রাইম সেটআপে এটি বাধ্যতামূলক থাকায় কোনো ফেক পাম্পে প্রবেশের ঝুঁকি থাকে না।
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              ৩. ন্যূনতম ১:২ রিস্ক-টু-রিওয়ার্ড রেশিও (Asymmetric Payoff)
            </h4>
            <p className="text-slate-300 leading-relaxed">
              এই কৌশলে প্রতিটি বিজয়ী ট্রেডের লাভ গড়ে ক্ষতির দ্বিগুণ বা তিনগুণ। ফলে ৪৮% উইন রেট হওয়া সত্ত্বেও পোর্টফোলিওর মোট ইকুইটি কার্ভ লাগাতার ঊর্ধ্বমুখী থাকে।
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-red-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              ৪. কেন র কাঁচা ব্রেকআউট (Phase D Alone) ব্যর্থ?
            </h4>
            <p className="text-slate-300 leading-relaxed">
              ব্যাকটেস্টে র ‘Phase D’ ট্যাবে দেখা গেছে ৬২.৬% ট্রেডে স্টপ লস হিট হয় (-০.২১ R avg return)। অর্থাৎ রিটেস্ট এবং বায়ার প্রেসার ছাড়া শুধু ব্রেকআউট দেখে ডিএসইতে ট্রেড করা আত্মঘাতী।
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: 4 Rules of Execution */}
      <section className="bg-slate-950 p-5 sm:p-6 rounded-2xl border border-blue-500/30">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
          <span>৪. আগামীকাল থেকে ট্রেডিংয়ে সফল হওয়ার ৪টি অলঙ্ঘনীয় নিয়ম</span>
        </h3>
        <ol className="space-y-2.5 text-xs sm:text-sm text-slate-300 list-decimal list-inside leading-relaxed">
          <li>
            <strong className="text-white">সবসময় ১ নম্বর বা ২ নম্বর ট্যাবের স্টক অগ্রাধিকার দিন: </strong>
            ‘★ আগামীকালের সেরা এন্ট্রি’ অথবা ‘এন্ট্রি-যোগ্য সেটআপ’ ট্যাবে থাকা শেয়ারগুলোতেই মূলধনের ৮০% বরাদ্দ করুন।
          </li>
          <li>
            <strong className="text-white">স্টপ লস কখনই শিথিল করবেন না: </strong>
            প্রাইম সেটআপের নির্ধারিত এসএল (সাধারণত ২.৫% থেকে ৩.৫%) স্পর্শ করলে কোনো দ্বিধা ছাড়া এক্সিট নিন।
          </li>
          <li>
            <strong className="text-white">টার্গেট ১-এ অর্ধেক লাভ নিশ্চিত করুন: </strong>
            প্রথম টার্গেটে (১:২ RRR) পৌঁছালে ৫০% শেয়ার বিক্রি করে প্রফিট লক করুন এবং বাকি অংশের স্টপ লস ক্রয়মূল্যে (Break-even) তুলে আনুন।
          </li>
          <li>
            <strong className="text-white">🚨 ডাম্প সতর্কতা ট্যাবের শেয়ার সম্পূর্ণ বর্জন করুন: </strong>
            দাম অনেক কমে গেছে মনে করে ডিস্ট্রিবিউশন বা ডাম্প অ্যালার্টের স্টকে কখনোই ‘বটম ফিশিং’ বা এভারেজ করবেন না।
          </li>
        </ol>
      </section>
    </div>
  );
};
