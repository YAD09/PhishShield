
import React from 'react';
import { Shield, Zap, BookOpen, ArrowRight, ShieldCheck, UserCheck, Lock } from 'lucide-react';

interface HomeViewProps {
  onStart: () => void;
  onLearn: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onStart, onLearn }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-24 py-10 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="text-center space-y-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-200 rounded-full blur-[100px] opacity-20 -z-10" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-black uppercase tracking-widest animate-bounce">
          <Shield size={14} /> Powered by Gemini 3.0 Pro
        </div>
        
        <h1 className="text-6xl md:text-7xl font-black text-slate-800 tracking-tighter leading-[0.9]">
          Stop Scams <br />
          <span className="text-indigo-600 italic">Before</span> They Start.
        </h1>
        
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
          The world's first AI-powered shield designed for everyone. Detect phishing emails, suspicious links, and complex scams with human-readable explanations.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 group"
          >
            Start Scanning <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={onLearn}
            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            How it Works
          </button>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Zap className="text-amber-500" />}
          title="Instant Detection"
          desc="Real-time semantic and technical analysis of any text or URL to identify threats instantly."
        />
        <FeatureCard 
          icon={<BookOpen className="text-indigo-500" />}
          title="Scam Education"
          desc="We don't just block; we educate. Understand the 'Why' and 'How' behind every detected scam."
        />
        <FeatureCard 
          icon={<UserCheck className="text-emerald-500" />}
          title="Built for Everyone"
          desc="Non-technical language and intuitive design make high-end cybersecurity accessible to students and elderly."
        />
      </section>

      {/* Trust Banner */}
      <section className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 -mr-10 -mb-10">
          <Shield size={300} />
        </div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-black tracking-tight">Your Digital Security <br /> Is Our Priority.</h2>
            <p className="text-slate-400 font-medium">
              Every day, millions are targeted by increasingly sophisticated AI scams. PhishShield Pro uses advanced large language models to stay one step ahead of bad actors.
            </p>
            <div className="flex gap-8 py-4">
              <Stat label="Accuracy" value="99.2%" />
              <Stat label="Threats Scanned" value="1.2M+" />
              <Stat label="User Rating" value="4.9/5" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex gap-4">
              <div className="p-3 bg-indigo-500/20 rounded-2xl h-fit"><Lock className="text-indigo-400" /></div>
              <div>
                <h4 className="font-bold">Privacy First</h4>
                <p className="text-sm text-slate-400">Your data is processed in real-time and never stored on our servers.</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex gap-4">
              <div className="p-3 bg-emerald-500/20 rounded-2xl h-fit"><ShieldCheck className="text-emerald-400" /></div>
              <div>
                <h4 className="font-bold">Zero-Day Protection</h4>
                <p className="text-sm text-slate-400">Our models are updated hourly to detect the latest scam trends worldwide.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: any; title: string; desc: string }) => (
  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-4">
    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-2xl font-black text-white">{value}</div>
    <div className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">{label}</div>
  </div>
);

export default HomeView;
