
import React from 'react';
import { HistoryItem } from '../types';
import { Clock, ShieldAlert, ShieldCheck, AlertTriangle, Tag } from 'lucide-react';

interface HistorySidebarProps {
  history: HistoryItem[];
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history }) => {
  return (
    <div className="bg-white h-full border-l border-slate-200 p-6 overflow-y-auto w-80 shrink-0 hidden xl:block">
      <div className="flex items-center gap-2 mb-8">
        <Clock className="text-indigo-600" size={20} />
        <h3 className="text-lg font-bold text-slate-800">Scan History</h3>
      </div>
      
      {history.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-sm text-slate-400 italic">No scans performed yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-all group cursor-pointer bg-slate-50/30">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-xl ${
                  item.result.status === 'Safe' ? 'bg-emerald-50 text-emerald-500' :
                  item.result.status === 'Suspicious' ? 'bg-amber-50 text-amber-500' :
                  'bg-rose-50 text-rose-500 border border-rose-100'
                }`}>
                  {item.result.status === 'Safe' && <ShieldCheck size={18} />}
                  {item.result.status === 'Suspicious' && <AlertTriangle size={18} />}
                  {item.result.status === 'Scam' && <ShieldAlert size={18} />}
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-700 line-clamp-2 leading-relaxed mb-3">
                {item.input}
              </p>
              {item.result.category !== 'None' && (
                <div className="flex items-center gap-1 text-[9px] font-black text-indigo-400 uppercase mb-3">
                  <Tag size={10} /> {item.result.category}
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.type}</span>
                <span className="text-[10px] font-black text-indigo-600 uppercase">Risk: {item.result.score}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorySidebar;
