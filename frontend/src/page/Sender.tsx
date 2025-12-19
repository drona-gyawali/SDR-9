import { useState } from "react";
import useSender from "../hooks/useSender";
import FileUploader from "../components/FileUploader"; 
import { Copy, Link, Wifi, Star, Lock, ShieldCheck, Check } from 'lucide-react';
import { generateHumanCode } from "../utils/file";
import SendEmail from "../components/SendEmail";

export function Sender() {
  const { roomId, connected, peer } = useSender();
  const [copied, setCopied] = useState(false);
  
  const shareLink = roomId ? `${window.location.origin}/receiver/${roomId}` : "";
  const humanCode = generateHumanCode(roomId);

  const copyToClipboard = async () => {
    if (shareLink) {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-800 dark:text-white">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><Lock size={20} /></div>
            <span>Secure<span className="text-indigo-600">Transfer</span></span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://github.com/drona-gyawali/SDR-9" className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
              <Star size={16} className="text-yellow-500 fill-yellow-500" /> Star
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                Status
              </h2>
              <div className="space-y-4">
                <div className={`flex items-center gap-3 p-3 rounded-2xl border ${connected ? 'bg-emerald-50/50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20' : 'bg-amber-50/50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20'}`}>
                  <Wifi size={20} className={connected ? 'text-emerald-600' : 'text-amber-600'} />
                  <div>
                    <p className="text-sm font-bold">{connected ? "Live Connection" : "Waiting..."}</p>
                    <p className="text-[11px] opacity-70">P2P Encryption Active</p>
                  </div>
                </div>
                {roomId && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Room Code</span>
                    <div className="text-3xl font-mono font-black tracking-[0.2em] text-indigo-600 dark:text-indigo-400">{humanCode}</div>
                  </div>
                )}
              </div>
            </div>

            {roomId && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><Link size={16} className="text-indigo-600" /> Share Link</h3>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl p-1.5 border border-slate-100 dark:border-slate-700">
                  <input className="bg-transparent border-none text-xs w-full px-2 focus:ring-0 text-slate-600 dark:text-slate-400" value={shareLink} readOnly />
                  <button onClick={copyToClipboard} className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            )}
            <SendEmail link={shareLink}/>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[550px]">
              <div className="border-b border-slate-100 dark:border-slate-800 p-6 flex justify-between items-center">
                 <div>
                  <h2 className="text-xl font-bold tracking-tight">File Hub</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Direct peer transfer</p>
                 </div>
                 <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-2">
                  <ShieldCheck size={18} /> <span className="text-xs font-bold uppercase">Secure</span>
                 </div>
              </div>
              <FileUploader peer={peer} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}