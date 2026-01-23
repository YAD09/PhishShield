
import React, { useState, useEffect } from 'react';
import { analyzeContent } from '../services/geminiService';
import { AnalysisResult, HistoryItem, ScamCategory } from '../types';
import { ShieldAlert, ShieldCheck, AlertTriangle, Loader2, Link, FileText, Zap, Database, Lightbulb, CheckCircle2, Trophy, Eye, HelpCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Fixing TS error: Cannot find name 'chrome'
declare const chrome: any;

interface AnalysisViewProps {
  onNewHistory: (item: HistoryItem) => void;
  learnedCategories: Set<ScamCategory>;
  onMarkLearned: (category: ScamCategory) => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ onNewHistory, learnedCategories, onMarkLearned }) => {
  const [input, setInput] = useState('');
  const [type, setType] = useState<'text' | 'url'>('text');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Check for pending scans from context menu
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['pendingScan', 'pendingType'], (result) => {
        if (result.pendingScan) {
          setInput(result.pendingScan);
          if (result.pendingType) setType(result.pendingType);
          chrome.storage.local.remove(['pendingScan', 'pendingType']);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (result && result.category !== 'None' && result.category !== 'General' && !learnedCategories.has(result.category)) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 5000);
      onMarkLearned(result.category);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const analysis = await analyzeContent(input, type);
      setResult(analysis);
      onNewHistory({
        id: Math.random().toString(36).substr(2, 9),
        input,
        type,
        result: analysis,
        timestamp: new Date(),
      });
    } catch (err) {
      alert("Analysis error. Ensure Gemini is active.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (score: number) => {
    if (score <= 30) return 'text-emerald-500 bg-emerald-50 border-emerald-200';
    if (score <= 70) return 'text-amber-500 bg-amber-50 border-amber-200';
    return 'text-rose-500 bg-rose-50 border-rose-200';
  };

  const getStatusIcon = (score: number) => {
    if (score <= 30) return <ShieldCheck className="text-emerald-500" size={24} />;
    if (score <= 70) return <AlertTriangle className="text-amber-500" size={24} />;
    return <ShieldAlert className="text-rose-500" size={24} />;
  };

  return (
    <div className="max-w-full space-y-6 animate-in fade-in duration-500 relative">
      
      {showCelebration && (
        <div className="fixed top-18 right-4 z-50 animate-in slide-in-from-right-10">
          <div className="bg-indigo-600 text-white p-3 rounded-xl shadow-2xl flex items-center gap-3 border border-indigo-400">
            <Trophy className="text-yellow-400" size={16} />
            <p className="text-[10px] font-bold">New Category Mastered!</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Database className="text-indigo-600" size={18} /> Lab
          </h2>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button onClick={() => setType('text')} className={`p-1.5 rounded-md transition-all ${type === 'text' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-slate-500'}`}>
              <FileText size={14} />
            </button>
            <button onClick={() => setType('url')} className={`p-1.5 rounded-md transition-all ${type === 'url' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-slate-500'}`}>
              <Link size={14} />
            </button>
          </div>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={type === 'text' ? "Paste message content..." : "Paste link..."}
          className="w-full h-24 p-3 rounded-xl border border-slate-200 focus:border-indigo-400 outline-none transition-all resize-none text-xs bg-slate-50/30"
        />

        <button
          onClick={handleAnalyze}
          disabled={loading || !input.trim()}
          className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md group"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
          <span className="text-sm">Scan Now</span>
        </button>
      </div>

      {result && (
        <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
          <div className={`rounded-2xl border p-5 ${getStatusColor(result.score)}`}>
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-white rounded-xl shadow-sm">{getStatusIcon(result.score)}</div>
               <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">{result.status}</h3>
                  <p className="text-[10px] font-bold opacity-70">Risk Score: {result.score}%</p>
               </div>
            </div>
            
            <div className="bg-white/90 p-4 rounded-xl space-y-3">
              <p className="text-xs text-slate-700 font-semibold leading-relaxed">{result.explanation}</p>
              {result.education?.redFlags && (
                <div className="flex flex-wrap gap-1.5">
                  {result.education.redFlags.map((flag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[9px] font-bold rounded-md border border-rose-100">
                      "{flag}"
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {result.education && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="bg-indigo-600 p-3 flex items-center gap-2 text-white">
                  <Lightbulb size={16} className="text-yellow-300" />
                  <span className="text-[10px] font-black uppercase">Immunity Lesson</span>
               </div>
               <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase">The Trick</p>
                    <p className="text-xs text-slate-800 font-bold">{result.education.scamDescription}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-emerald-600 uppercase">Action Plan</p>
                    <ul className="space-y-1">
                      {result.education.safetyTips.slice(0, 2).map((tip, i) => (
                        <li key={i} className="text-[10px] text-slate-600 font-medium flex gap-2">
                          <span className="text-emerald-500 font-black">•</span> {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisView;
