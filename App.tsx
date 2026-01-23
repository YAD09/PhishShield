
import React, { useState, useEffect } from 'react';
import { Shield, LayoutDashboard, BrainCircuit, Home, Trophy, HeartPulse, History } from 'lucide-react';
import AnalysisView from './components/AnalysisView';
import HistorySidebar from './components/HistorySidebar';
import InfoSection from './components/InfoSection';
import HomeView from './components/HomeView';
import HelpView from './components/HelpView';
import { HistoryItem, ScamCategory } from './types';

// Fixing TS error: Cannot find name 'chrome'
declare const chrome: any;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard' | 'about' | 'help'>('home');
  const [learnedCategories, setLearnedCategories] = useState<Set<ScamCategory>>(new Set());
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load data from Chrome Storage on Mount
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['history', 'learnedCategories', 'pendingScan'], (result) => {
        if (result.history) setHistory(result.history);
        if (result.learnedCategories) setLearnedCategories(new Set(result.learnedCategories));
        
        // If there's a pending scan from a right-click context menu
        if (result.pendingScan) {
          setActiveTab('dashboard');
          // Clear pending scan after picking it up
          chrome.storage.local.remove('pendingScan');
        }
      });
    }
  }, []);

  // Sync data to Chrome Storage when it changes
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ 
        history, 
        learnedCategories: Array.from(learnedCategories) 
      });
    }
  }, [history, learnedCategories]);

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
    <div className="flex min-h-screen bg-slate-50 w-[400px] sm:w-full max-w-[1280px] mx-auto overflow-x-hidden">
      {/* Sidebar Navigation - Optimized for Extension Popup */}
      <nav className="fixed inset-y-0 left-0 w-16 bg-white border-r border-slate-200 flex flex-col items-center py-6 z-30 shadow-sm">
        <div className="mb-8">
          <div 
            onClick={() => setActiveTab('home')}
            className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100 text-white hover:scale-105 transition-transform cursor-pointer"
          >
            <Shield size={20} />
          </div>
        </div>
        
        <div className="flex flex-col gap-6 flex-1">
          <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home size={20} />} label="Home" />
          <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={20} />} label="Scan" />
          <NavButton active={activeTab === 'help'} onClick={() => setActiveTab('help')} icon={<HeartPulse size={20} />} label="Help" />
          <NavButton active={activeTab === 'about'} onClick={() => setActiveTab('about')} icon={<BrainCircuit size={20} />} label="XAI" />
        </div>

        <div className="mt-auto pb-4 flex flex-col items-center gap-4">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2.5 rounded-xl transition-all ${showHistory ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <History size={20} />
          </button>
          <div className="flex flex-col items-center gap-1 group cursor-help relative">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Trophy size={16} />
            </div>
            <span className="text-[9px] font-black text-indigo-600">{learnedCategories.size}</span>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 ml-16 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white/70 backdrop-blur-md sticky top-0 border-b border-slate-200 px-6 flex items-center justify-between z-20">
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-black text-slate-800 tracking-tighter">PHISHSHIELD <span className="text-indigo-600 text-[10px]">EXT</span></h1>
            </div>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">AI Protection Active</p>
          </div>
          <div className="flex items-center gap-2">
             <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black text-emerald-700 uppercase">Live</span>
             </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          {renderContent()}
        </div>
      </main>

      {/* History Overlay for Popup Context */}
      {showHistory && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-in fade-in" onClick={() => setShowHistory(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
            <HistorySidebar history={history} />
          </div>
        </div>
      )}
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) => (
  <button
    onClick={onClick}
    className={`group relative flex flex-col items-center gap-1 transition-all`}
  >
    <div className={`p-2.5 rounded-xl transition-all ${
      active ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
    }`}>
      {icon}
    </div>
    <span className={`text-[8px] font-black uppercase tracking-tighter ${active ? 'text-indigo-600' : 'text-slate-400'}`}>
      {label}
    </span>
    {active && <div className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full -translate-x-3 shadow-lg" />}
  </button>
);

export default App;
