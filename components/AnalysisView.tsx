
import React, { useState, useEffect } from 'react';
import { analyzeContent } from '../services/geminiService';
import { AnalysisResult, HistoryItem, ScamCategory } from '../types';
import { ShieldAlert, ShieldCheck, AlertTriangle, Loader2, Link, FileText, ChevronRight, Zap, DollarSign, Globe, Users, Database, Tag, Lightbulb, Info, CheckCircle2, Trophy, Eye, HelpCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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
      alert("Analysis error. Ensure API Key is configured.");
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
    if (score <= 30) return <ShieldCheck className="text-emerald-500" size={32} />;
    if (score <= 70) return <AlertTriangle className="text-amber-500" size={32} />;
    return <ShieldAlert className="text-rose-500" size={32} />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 relative">
      
      {/* Progression Celebration Toast */}
      {showCelebration && (
        <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-10 fade-in duration-500">
          <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-indigo-400">
            <div className="p-2 bg-indigo-500 rounded-lg">
              <Trophy className="text-yellow-400" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest">Mastery Earned!</p>
              <p className="text-sm font-bold">You've learned to spot: {result?.category}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Database className="text-indigo-600" size={24} /> Detection Lab
            </h2>
            <p className="text-slate-500 text-sm italic font-medium">Scan suspicious content & build your immunity</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button onClick={() => setType('text')} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${type === 'text' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-slate-500'}`}>
              <FileText size={18} /> Message Scan
            </button>
            <button onClick={() => setType('url')} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${type === 'url' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-slate-500'}`}>
              <Link size={18} /> URL Inspector
            </button>
          </div>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={type === 'text' ? "Paste email/SMS content here..." : "Paste website link here..."}
          className="w-full h-40 p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all resize-none text-slate-700 bg-slate-50/50"
        />

        <button
          onClick={handleAnalyze}
          disabled={loading || !input.trim()}
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100 group"
        >
          {loading ? <><Loader2 className="animate-spin" /> Scanning Pattern...</> : <><ShieldCheck className="group-hover:scale-110 transition-transform" /> Start Analysis</>}
        </button>
      </div>

      {result && (
        <div className={`space-y-6 animate-in slide-in-from-bottom-4 duration-500`}>
          {/* Main Verdict Card */}
          <div className={`rounded-3xl border-2 p-8 transition-colors ${getStatusColor(result.score)}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-white shadow-sm">
                      {getStatusIcon(result.score)}
                    </div>
                    <div>
                      <h3 className="text-3xl font-black uppercase tracking-tighter">{result.status} Result</h3>
                      <p className="font-semibold opacity-70">Unified Risk Probability: {result.score}%</p>
                    </div>
                  </div>
                  {result.category !== 'None' && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200">
                      <Zap size={14} className="text-yellow-400" /> {result.category}
                    </div>
                  )}
                </div>

                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="font-black text-slate-400 mb-2 uppercase text-[10px] tracking-widest italic flex items-center gap-2">
                    <HelpCircle size={12} /> The Analysis
                  </h4>
                  <p className="text-slate-700 leading-relaxed font-semibold text-lg mb-6">{result.explanation}</p>
                  
                  {result.education?.redFlags && result.education.redFlags.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-black text-rose-400 mb-3 uppercase text-[10px] tracking-widest flex items-center gap-2">
                        <Eye size={12} /> Red Flags Found
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.education.redFlags.map((flag, i) => (
                          <span key={i} className="px-3 py-1 bg-rose-50 text-rose-600 text-xs font-black rounded-lg border border-rose-100 italic">
                            "{flag}"
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-white/60 p-6 rounded-2xl border border-slate-100 flex-1">
                   <h4 className="text-center text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Threat Score</h4>
                   <div className="relative w-full h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[{v: result.score}, {v: 100-result.score}]}
                            innerRadius={40}
                            outerRadius={55}
                            paddingAngle={5}
                            dataKey="v"
                            startAngle={180} endAngle={0}
                          >
                            <Cell fill={result.score > 70 ? '#f43f5e' : result.score > 30 ? '#f59e0b' : '#10b981'} />
                            <Cell fill="#f1f5f9" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
                        <span className="text-2xl font-black text-slate-800">{result.score}%</span>
                      </div>
                   </div>
                   <div className="space-y-2 mt-4">
                      <MetadataMini label="Urgency" value={result.metadata.urgencyLevel} color="text-amber-600" />
                      <MetadataMini label="Impersonation" value={result.metadata.isImpersonation ? 'Yes' : 'No'} color={result.metadata.isImpersonation ? 'text-rose-600' : 'text-emerald-600'} />
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Educational "Immunity Module" */}
          {(result.status === 'Scam' || result.status === 'Suspicious') && result.education && (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden animate-in slide-in-from-bottom-8 duration-700 delay-200">
              <div className="bg-indigo-600 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-white">
                  <Lightbulb size={24} className="text-yellow-300 fill-yellow-300" />
                  <h3 className="font-black text-xl uppercase tracking-tighter">Cyber-Immunity Module</h3>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-200 uppercase tracking-widest">
                  <Trophy size={14} /> Level Up Awareness
                </div>
              </div>
              
              <div className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 relative">
                       <div className="absolute -top-3 left-6 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">The Trick</div>
                       <p className="text-slate-700 font-bold text-lg leading-relaxed">{result.education.scamDescription}</p>
                    </div>

                    <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 relative">
                       <div className="absolute -top-3 left-6 px-3 py-1 bg-white border border-emerald-200 rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-widest">The Truth</div>
                       <p className="text-slate-800 font-bold text-sm leading-relaxed italic">{result.education.dangerReason}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                      <CheckCircle2 size={16} /> Action Plan (Stay Safe)
                    </h4>
                    <div className="grid gap-3">
                      {result.education.safetyTips.map((tip, idx) => (
                        <div key={idx} className="flex gap-4 items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:translate-x-1 transition-transform group">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 text-xs font-black group-hover:scale-110 transition-transform">{idx + 1}</div>
                          <p className="text-sm text-slate-800 font-bold leading-snug">{tip}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-4">
                       <Users size={20} className="text-indigo-400" />
                       <p className="text-[10px] font-bold text-indigo-600 uppercase leading-snug">Share this knowledge with your friends & family to protect them.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MetadataMini = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter">
    <span className="text-slate-400">{label}</span>
    <span className={color}>{value}</span>
  </div>
);

export default AnalysisView;
