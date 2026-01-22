
import React, { useState, useEffect } from 'react';
import { Shield, LayoutDashboard, BrainCircuit, Home, Trophy, BookOpen, HeartPulse } from 'lucide-react';
import AnalysisView from './components/AnalysisView';
import HistorySidebar from './components/HistorySidebar';
import InfoSection from './components/InfoSection';
import HomeView from './components/HomeView';
import HelpView from './components/HelpView';
import { HistoryItem, ScamCategory } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard' | 'about' | 'help'>('home');
  const [learnedCategories, setLearnedCategories] = useState<Set<ScamCategory>>(new Set());
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: '1',
      input: 'SBI ALERT: Your account will be temporarily blocked due to PAN not updated. Click here to update: http://sbi-pan-verify.in',
      type: 'text',
      timestamp: new Date(),
      result: {
        status: 'Scam',
        category: 'OTP / Account Takeover Scam',
        score: 98,
        explanation: 'High urgency phishing attempt impersonating a bank.',
        flags: [
          { category: 'Semantic', reason: 'High pressure tactics', severity: 'High' },
          { category: 'Financial', reason: 'Banking impersonation', severity: 'High' }
        ],
        metadata: { urgencyLevel: 'Critical', isFinancialThreat: true, isImpersonation: true }
      }
    }
  ]);

  const addHistory = (item: HistoryItem) => {
    setHistory(prev => [item, ...prev]);
  };

  const markLearned = (category: ScamCategory) => {
    setLearnedCategories(prev => new Set([...Array.from(prev), category]));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView onStart={() => setActiveTab('dashboard')} onLearn={() => setActiveTab('about')} />;
      case 'dashboard':
        return (
          <AnalysisView 
            onNewHistory={addHistory} 
            learnedCategories={learnedCategories} 
            onMarkLearned={markLearned}
          />
        );
      case 'about':
        return <InfoSection />;
      case 'help':
        return <HelpView />;
      default:
        return <HomeView onStart={() => setActiveTab('dashboard')} onLearn={() => setActiveTab('about')} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Navigation */}
      <nav className="fixed inset-y-0 left-0 w-20 md:w-24 bg-white border-r border-slate-200 flex flex-col items-center py-8 z-30 shadow-sm">
        <div className="mb-12">
          <div 
            onClick={() => setActiveTab('home')}
            className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 text-white hover:scale-110 transition-transform cursor-pointer"
          >
            <Shield size={28} />
          </div>
        </div>
        
        <div className="flex flex-col gap-8 flex-1">
          <NavButton 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')}
            icon={<Home size={24} />}
            label="Home"
          />
          <NavButton 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
            icon={<LayoutDashboard size={24} />}
            label="Scanner"
          />
           <NavButton 
            active={activeTab === 'help'} 
            onClick={() => setActiveTab('help')}
            icon={<HeartPulse size={24} />}
            label="Help"
          />
          <NavButton 
            active={activeTab === 'about'} 
            onClick={() => setActiveTab('about')}
            icon={<BrainCircuit size={24} />}
            label="Logic"
          />
        </div>

        {/* Learning Stats Mini Widget */}
        <div className="mt-auto pb-8 flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-1 group cursor-help relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <Trophy size={20} />
            </div>
            <span className="text-[10px] font-black text-indigo-600">{learnedCategories.size}</span>
            <div className="absolute left-full ml-4 w-40 p-3 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Immunity Score</p>
               <p className="text-xs font-bold text-slate-700">You've mastered {learnedCategories.size} scam types!</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 ml-20 md:ml-24 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white/70 backdrop-blur-md sticky top-0 border-b border-slate-200 px-8 flex items-center justify-between z-20">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-800 tracking-tighter">PHISHSHIELD <span className="text-indigo-600">PRO</span></h1>
              <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase">Social Impact Ed</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Education-First Threat Intelligence</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Global Watch Active</span>
             </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 p-4 md:p-10">
          {renderContent()}
        </div>

        {/* Footer info for hackathon branding */}
        <footer className="p-8 text-center text-slate-400 text-xs border-t border-slate-100 bg-white/50">
          © 2026 PhishShield AI • Hackathon MVP • Built for Real-World Resilience
        </footer>
      </main>

      {/* History Sidebar */}
      <HistorySidebar history={history} />
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) => (
  <button
    onClick={onClick}
    className={`group relative flex flex-col items-center gap-2 transition-all`}
  >
    <div className={`p-3 rounded-2xl transition-all ${
      active ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
    }`}>
      {icon}
    </div>
    <span className={`text-[10px] font-black uppercase tracking-tighter ${active ? 'text-indigo-600' : 'text-slate-400'}`}>
      {label}
    </span>
    {active && <div className="absolute left-0 w-1.5 h-8 bg-indigo-600 rounded-r-full -translate-x-3 shadow-lg shadow-indigo-100" />}
  </button>
);

export default App;
