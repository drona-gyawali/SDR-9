import { useState } from "react";
import useSender from "../hooks/useSender";
import FileUploader from "../components/FileUploader";
import { Copy, Link, Wifi, Star, ShieldCheck, Check, Clock } from 'lucide-react';
import { generateHumanCode } from "../utils/file";
import SendEmail from "../components/SendEmail";
import Navbar from "../components/Navbar";

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
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300 selection:bg-indigo-500/30">
      <Navbar>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/drona-gyawali/SDR-9"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 border border-transparent dark:border-zinc-700/50 px-4 py-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all active:scale-95"
          >
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="hidden sm:inline">Star</span>
          </a>
        </div>
      </Navbar>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card: Status */}
            <div className="bg-white dark:bg-zinc-900/50 rounded-3xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-sm">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-amber-500'}`} />
                Status
              </h2>
              <div className="space-y-4">
                <div className={`flex items-center gap-3 p-3 rounded-2xl border ${connected ? 'bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/20' : 'bg-amber-50/50 dark:bg-amber-500/5 border-amber-100 dark:border-amber-500/20'}`}>
                  <Wifi size={20} className={connected ? 'text-emerald-500' : 'text-amber-500'} />
                  <div>
                    <p className="text-sm font-bold">{connected ? "Live Connection" : "Waiting..."}</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-500">P2P Encryption Active</p>
                  </div>
                </div>
                {roomId && (
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-center">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Room Code</span>
                    <div className="text-3xl font-mono font-black tracking-[0.2em] text-indigo-600 dark:text-indigo-500">{humanCode}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Card: Share Link */}
            {roomId && (
              <div className="bg-white dark:bg-zinc-900/50 rounded-3xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800/50">
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                  <Link size={16} className="text-indigo-500" /> Share Link
                </h3>
                <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950 rounded-xl p-1.5 border border-zinc-100 dark:border-zinc-800">
                  <input className="bg-transparent font-bold border-none text-xs w-full px-2 focus:ring-0 text-zinc-600 dark:text-zinc-400" value={shareLink} readOnly />
                  <button onClick={copyToClipboard} className={`px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-lg ${copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20'}`}>
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            )}
            <SendEmail link={shareLink} />
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-zinc-900/50 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800/50 overflow-hidden min-h-137.5 backdrop-blur-sm">
              <div className="border-b border-zinc-100 dark:border-zinc-800/50 p-6 flex justify-between items-center bg-white dark:bg-transparent">
                <div>
                  <h2 className="text-xl font-bold tracking-tight dark:text-zinc-100">File Hub</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-500">Direct peer transfer</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-2">
                  <ShieldCheck size={18} /> <span className="text-xs font-bold uppercase tracking-tighter">Secure</span>
                </div>
              </div>
              {connected ? (
                <FileUploader peer={peer} />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-in fade-in duration-700">
                  <div className="w-20 h-20 mb-6 flex items-center justify-center bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-3xl">
                    <Clock size={40} strokeWidth={1.5} className="animate-pulse" />
                  </div>

                  <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 mb-2">
                    Waiting for your friend
                  </h2>

                  <p className="text-zinc-500 dark:text-zinc-400 text-base max-w-65 leading-relaxed">
                    You can upload files as soon as your friend is <b>online</b>.
                  </p>

                  <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800/50 rounded-full">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" />
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                      Connection Pending
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}