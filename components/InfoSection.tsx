
import React from 'react';
import { Target, Cpu, BrainCircuit, ShieldCheck, List, Lightbulb, Activity, MapPin, GitBranch, Layers, MessageSquare, Tag, HeartHandshake } from 'lucide-react';

const InfoSection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-12 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">System Architecture</h2>
        <p className="text-slate-500 max-w-xl mx-auto">A unified multi-input pipeline designed for real-time threat detection and explainability.</p>
      </div>

      {/* Unified Pipeline Diagram */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Layers size={120} />
        </div>
        <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-indigo-600">
          <GitBranch size={24} /> Unified Processing Pipeline
        </h3>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
          <PipelineNode icon={<MessageSquare />} label="Multi-Input" sub="SMS / Email / URL" />
          <PipelineArrow />
          <PipelineNode icon={<Activity />} label="Classifier" sub="Intent Detection" color="bg-indigo-600 text-white" />
          <PipelineArrow />
          <PipelineNode icon={<Cpu />} label="Engine" sub="Specialized Logic" />
          <PipelineArrow />
          <PipelineNode icon={<ShieldCheck />} label="XAI Verdict" sub="Scoring + Explain" color="bg-emerald-500 text-white" />
        </div>

        <div className="grid grid-cols-1 md:flex md:justify-center gap-8 mt-12 pt-8 border-t border-slate-100">
           <div className="max-w-md w-full">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Tag size={14} /> Scam Taxonomy (Multi-Class)
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-bold uppercase tracking-tighter">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-600">Job Scam</div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-600">Payment Fraud</div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-600">Fake Shopping</div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-600">Reward / Lottery</div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-600">OTP / Account</div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-600">General Phishing</div>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
        <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
           <HeartHandshake className="text-emerald-500" /> Awareness & Social Impact
        </h3>
        <p className="text-slate-600 text-sm font-medium mb-6">Detection is only half the battle. Our mission is to educate non-technical users to build long-term digital resilience.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white p-5 rounded-2xl border border-emerald-100">
              <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2">Pre-emptive Education</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Instead of a block screen, we explain *why* something is dangerous, empowering the user for the next attempt.</p>
           </div>
           <div className="bg-white p-5 rounded-2xl border border-emerald-100">
              <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2">Vulnerable Groups</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Language is tuned for students and non-tech users, removing complex cybersecurity jargon.</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-600">
            <List size={24} /> Detection Rulebook
          </h3>
          <div className="space-y-4">
            <RuleItem category="Semantic" title="Pressure Tactics" desc="Detects 'Act Now', '24 Hours Left', 'Immediate Action' keywords." />
            <RuleItem category="Technical" title="Homograph Attacks" desc="Identifies look-alike characters (e.g., 'paypaI' vs 'paypal')." />
            <RuleItem category="Financial" title="Unsolicited Rewards" desc="Flags 'Winner', 'Gift Card', 'Lottery' with link prompts." />
            <RuleItem category="Social" title="Authority Bias" desc="Recognizes impersonation of Tax Dept, Police, or CEO." />
          </div>
        </div>

        <div className="bg-indigo-900 text-white p-8 rounded-3xl shadow-xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-300">
             <Activity size={24} /> Scoring Engine Logic
          </h3>
          <div className="space-y-6">
            <div className="bg-indigo-950/50 p-4 rounded-xl border border-indigo-800/50">
               <p className="text-xs font-bold text-indigo-400 uppercase mb-2">Weight Distribution</p>
               <div className="flex gap-2">
                  <div className="h-2 bg-indigo-500 rounded-full" style={{width: '40%'}} title="Semantic 40%"></div>
                  <div className="h-2 bg-blue-500 rounded-full" style={{width: '30%'}} title="Technical 30%"></div>
                  <div className="h-2 bg-emerald-500 rounded-full" style={{width: '30%'}} title="Financial 30%"></div>
               </div>
               <p className="text-[10px] text-indigo-200/60 mt-2 italic">Formula: (Sem * 0.4) + (Tech * 0.3) + (Fin * 0.3)</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
               <ThresholdBadge label="Safe" range="0-30" color="bg-emerald-500" />
               <ThresholdBadge label="Suspect" range="31-70" color="bg-amber-500" />
               <ThresholdBadge label="Scam" range="71-100" color="bg-rose-500" />
            </div>
          </div>
          <div className="mt-8 space-y-2 text-[11px] text-indigo-100/70">
            <p>• Multi-layered validation (Semantic + Technical)</p>
            <p>• Intent-based heuristic rather than static blocklists</p>
            <p>• Dynamic confidence normalization (0-100 scale)</p>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 rounded-3xl p-8 border border-indigo-100">
        <h3 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
          <MapPin className="text-indigo-500" /> India-Specific Intelligence
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-4">
              <IndiaContext label="UPI Fraud" pattern="VPA, QR Code requests, Payment Redirects" />
              <IndiaContext label="KYC Update" pattern="PAN/Aadhar requirements, Bank Block alerts" />
           </div>
           <div className="space-y-4">
              <IndiaContext label="Fake Jobs" pattern="Work-from-home, Telegram tasks, Daily earnings" />
              <IndiaContext label="Lottery/KBC" pattern="Big prize rewards, Registration fee scams" />
           </div>
        </div>
      </div>
    </div>
  );
};

const PipelineNode = ({ icon, label, sub, color = "bg-white text-indigo-600" }: { icon: any; label: string; sub: string; color?: string }) => (
  <div className="flex flex-col items-center gap-3 z-10">
    <div className={`p-5 rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center ${color}`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div className="text-center">
      <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">{label}</p>
      <p className="text-[10px] text-slate-400 font-bold">{sub}</p>
    </div>
  </div>
);

const PipelineArrow = () => (
  <div className="hidden md:block text-slate-200 mb-10">
    <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
      <path d="M0 6H38M38 6L33 1M38 6L33 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const IndiaContext = ({ label, pattern }: { label: string; pattern: string }) => (
  <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm">
    <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">{label}</h4>
    <p className="text-sm text-slate-700 font-medium">{pattern}</p>
  </div>
);

const ThresholdBadge = ({ label, range, color }: { label: string, range: string, color: string }) => (
  <div className="bg-white/10 p-2 rounded-lg text-center border border-white/5">
     <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${color}`}></div>
     <p className="text-[10px] font-bold text-white uppercase">{label}</p>
     <p className="text-[8px] text-indigo-300">{range}</p>
  </div>
);

const RuleItem = ({ category, title, desc }: { category: string; title: string; desc: string }) => (
  <div className="border-b border-slate-100 pb-3 last:border-0">
    <div className="flex items-center gap-2 mb-1">
      <span className="text-[10px] font-black uppercase text-indigo-400 tracking-tighter">{category}</span>
      <h4 className="text-sm font-bold text-slate-800">{title}</h4>
    </div>
    <p className="text-xs text-slate-500 leading-snug">{desc}</p>
  </div>
);

export default InfoSection;
