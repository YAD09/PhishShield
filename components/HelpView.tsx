
import React, { useState, useEffect } from 'react';
import { findNearbyHelp } from '../services/geminiService';
import { HelpCenter } from '../types';
import { MapPin, Phone, ExternalLink, ShieldAlert, Loader2, Navigation, HeartHandshake } from 'lucide-react';

const HelpView: React.FC = () => {
  const [centers, setCenters] = useState<HelpCenter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocationAndFindHelp = () => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const results = await findNearbyHelp(position.coords.latitude, position.coords.longitude);
          setCenters(results);
        } catch (err) {
          setError("Failed to fetch help centers. Please try again.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("Permission denied. We need your location to find nearby stations.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="bg-indigo-900 text-white rounded-[3rem] p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 p-10">
          <HeartHandshake size={200} />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest text-indigo-200">
            <ShieldAlert size={14} /> Emergency Response
          </div>
          <h2 className="text-4xl font-black tracking-tight">Report a Cyber Crime</h2>
          <p className="text-indigo-100/70 max-w-xl text-lg font-medium leading-relaxed">
            Victim of a scam? Don't panic. The first step is reporting it to the authorities. We help you find the nearest Cyber Cell in seconds.
          </p>
          <button 
            onClick={getLocationAndFindHelp}
            disabled={loading}
            className="mt-6 px-8 py-4 bg-white text-indigo-900 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-50 transition-all shadow-xl disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <MapPin />}
            Find Nearby Help Centers
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-3xl text-rose-600 flex items-center gap-4 animate-in slide-in-from-top-4">
          <ShieldAlert />
          <p className="font-bold">{error}</p>
        </div>
      )}

      {centers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {centers.map((center, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Navigation size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{center.name}</h3>
                <p className="text-xs text-slate-500 font-medium mb-4">{center.address}</p>
              </div>
              
              <div className="space-y-3">
                <a 
                  href={center.mapUri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-colors"
                >
                  <ExternalLink size={14} /> Get Directions
                </a>
                <p className="text-[10px] text-center text-slate-400 font-bold uppercase">Official Verified Result</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8">
        <div className="shrink-0 p-6 bg-white rounded-full shadow-sm">
          <Phone className="text-indigo-600" size={40} />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <h4 className="text-xl font-bold text-slate-800">National Cyber Crime Helpline (India)</h4>
          <p className="text-slate-500 font-medium italic">Dial 1930 to report financial frauds immediately. Time is critical for bank account freezing.</p>
          <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-700">Available 24/7</span>
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-700">Multilingual</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpView;
