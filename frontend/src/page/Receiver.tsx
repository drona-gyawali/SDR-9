import { useParams } from "react-router-dom";
import useReceiver from "../hooks/useReceiver"; 
import { Download, Users, Wifi, Star, Lock, FileText, AlertTriangle, ShieldCheck, ArrowDownToLine, Loader2, CheckCircle2 } from "lucide-react";
import { generateHumanCode, formatSize } from "../utils/file";

export default function Receiver() {
  const { roomId } = useParams<{ roomId: string }>();
  const receiverRoomId: string | null = roomId ? roomId : null;
  const { connected, receivedFiles, downloadFile } = useReceiver(receiverRoomId);
  const humanCode = generateHumanCode(roomId);
  
  if (!roomId) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#09090b] flex items-center justify-center p-4 transition-colors duration-300">
        <div className="bg-white dark:bg-zinc-900/50 p-8 rounded-[2.5rem] shadow-xl border border-red-100 dark:border-red-900/20 max-w-md w-full text-center backdrop-blur-sm">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100 dark:border-red-500/20">
                <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Invalid Link</h2>
            <p className="text-zinc-500 dark:text-zinc-500 mt-2 text-sm">No transfer code was provided. Please check the URL and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-indigo-500/30 transition-colors duration-300">
      {/* Top Navigation */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800/50 bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-zinc-800 dark:text-zinc-100">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white shadow-lg shadow-indigo-500/20">
              {/* <Lock size={20} /> */}
            </div>
<span className="text-zinc-100">
  Secure<span className="bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">Transfer</span>
</span>
          </div>
          <div className="flex items-center gap-3">
             <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest border transition-all ${
                 connected 
                 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                 : 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse'
             }`}>
                <Wifi size={14} />
                {connected ? "SECURE CONNECTION" : "ESTABLISHING..."}
             </div>
             
             <a href="https://github.com/drona-gyawali/SDR-9" className="hidden sm:flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 border border-transparent dark:border-zinc-700/50 px-4 py-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all">
               <Star size={16} className="text-yellow-500 fill-yellow-500" />
               Star
             </a>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar: Connection Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-zinc-900/50 rounded-[2.5rem] p-6 shadow-sm border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-sm">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4 flex items-center gap-2">
                    <Users size={14} /> Incoming Session
                </h3>
                
                <div className="space-y-4">
                    <div className="p-5 bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-center">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Session Code</span>
                        <div className="text-3xl font-mono font-black tracking-widest text-zinc-800 dark:text-indigo-400">
                            {humanCode}
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                        <ShieldCheck className="text-indigo-500 shrink-0" size={20} />
                        <div>
                            <p className="text-sm font-bold text-zinc-800 dark:text-indigo-300 leading-tight">Direct P2P Link</p>
                            <p className="text-[11px] text-zinc-500 dark:text-indigo-400/70 mt-1 leading-relaxed font-medium">Files move directly from sender to you. No cloud storage used.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-zinc-900 dark:bg-indigo-950/40 rounded-[2.5rem] text-white border border-transparent dark:border-indigo-500/20 shadow-xl relative overflow-hidden group">
                <ArrowDownToLine className="absolute -right-4 -bottom-4 text-white/5 w-24 h-24 group-hover:scale-110 transition-transform duration-700" />
                <h4 className="font-bold text-sm mb-2 uppercase tracking-wide">Receiver Tip</h4>
                <p className="text-zinc-400 text-xs leading-relaxed relative z-10">Keep this window active until downloads complete. Since this is P2P, closing the tab breaks the transfer.</p>
            </div>
          </div>

          {/* Main Content: File Inbox */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-zinc-900/50 rounded-[2.5rem] shadow-sm border border-zinc-200 dark:border-zinc-800/50 overflow-hidden min-h-[500px] backdrop-blur-sm">
                <div className="border-b border-zinc-100 dark:border-zinc-800/50 p-6 flex justify-between items-center bg-white dark:bg-transparent">
                   <div>
                    <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">Incoming Inbox</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-500">Manage and save your received files</p>
                   </div>
                   <div className="bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-transparent dark:border-zinc-700/30">
                    {receivedFiles.length} Items
                   </div>
                </div>

                <div className="p-6">
                    {receivedFiles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                            {connected ? (
                                <>
                                    <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800/50 rounded-[2rem] flex items-center justify-center mb-6 border border-zinc-100 dark:border-zinc-700/30">
                                        <Loader2 size={36} className="animate-spin text-indigo-500" strokeWidth={1.5} />
                                    </div>
                                    <h4 className="text-lg font-bold text-zinc-700 dark:text-zinc-200 tracking-tight">Awaiting Files</h4>
                                    <p className="text-zinc-500 dark:text-zinc-500 text-sm max-w-xs mt-2">The tunnel is open. Files will appear here automatically when the sender starts the transfer.</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800/50 rounded-[2rem] flex items-center justify-center mb-6 text-zinc-300 dark:text-zinc-700 border border-zinc-100 dark:border-zinc-700/30">
                                        <Wifi size={36} className="animate-pulse" />
                                    </div>
                                    <h4 className="text-lg font-bold text-zinc-700 dark:text-zinc-200 tracking-tight">Connecting Link</h4>
                                    <p className="text-zinc-500 dark:text-zinc-500 text-sm max-w-xs mt-2">Synchronizing with the sender's device. This usually takes just a few seconds.</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {receivedFiles.map((file) => (
                                <div key={file.id} className="group relative flex items-center justify-between p-4 bg-white dark:bg-zinc-950/30 border border-zinc-100 dark:border-zinc-800/60 rounded-[1.8rem] hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className={`p-3.5 rounded-2xl transition-all duration-500 ${
                                            file.status === 'complete' 
                                            ? 'bg-emerald-500/10 text-emerald-500' 
                                            : 'bg-zinc-100 dark:bg-zinc-800 text-indigo-500'
                                        }`}>
                                            {file.status === 'complete' ? <CheckCircle2 size={24} strokeWidth={2.5} /> : <FileText size={24} strokeWidth={1.5} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate tracking-tight">{file.fileName}</p>
                                            <div className="flex items-center gap-2 text-[11px] font-bold mt-0.5 uppercase tracking-tighter">
                                                <span className="text-zinc-400 dark:text-zinc-500">{formatSize(file.fileSize)}</span>
                                                <span className="text-zinc-200 dark:text-zinc-800">•</span>
                                                {file.status === 'receiving' && <span className="text-indigo-500 animate-pulse">Downloading...</span>}
                                                {file.status === 'complete' && <span className="text-emerald-500">Ready to Save</span>}
                                                {file.status === 'error' && <span className="text-red-500">Failed</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        {file.status === 'receiving' && (
                                            <div className="flex flex-col items-end gap-1.5">
                                                <span className="text-[10px] font-black text-indigo-500 tabular-nums">{Math.round(file.progress)}%</span>
                                                <div className="w-20 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-indigo-500 transition-all duration-300" 
                                                        style={{ width: `${file.progress}%` }} 
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <button 
                                            onClick={() => downloadFile(file)}
                                            disabled={file.status !== 'complete'} 
                                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg ${
                                                file.status === 'complete' 
                                                ? 'bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-500 shadow-emerald-500/20' 
                                                : 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-300 dark:text-zinc-700 cursor-not-allowed'
                                            }`}
                                        >
                                            <Download size={18} />
                                            {file.status === 'complete' ? 'Save' : 'Wait'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}