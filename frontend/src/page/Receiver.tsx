import { useParams } from "react-router-dom";
import useReceiver from "../hooks/useReceiver"; 
import { Download, Users, Wifi, Star, Lock, FileText, AlertTriangle, ShieldCheck, ArrowDownToLine, Loader2, CheckCircle2 } from "lucide-react";
import { generateHumanCode } from "../utils/file";
import { formatSize } from "../utils/file";


export default function Receiver() {
  const { roomId } = useParams<{ roomId: string }>();
  const receiverRoomId: string | null = roomId ? roomId : null;
  const { connected, receivedFiles, downloadFile } = useReceiver(receiverRoomId);
  const humanCode = generateHumanCode(roomId);
  
  if (!roomId) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-red-100 dark:border-red-900/30 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Invalid Link</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">No transfer code was provided. Please check the URL and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 transition-colors duration-300">
      {/* Top Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-800 dark:text-white">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <Lock size={20} />
            </div>
            <span>Secure<span className="text-indigo-600">Transfer</span></span>
          </div>
          <div className="flex items-center gap-3">
             <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest border transition-all ${
                 connected 
                 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' 
                 : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20 animate-pulse'
             }`}>
                <Wifi size={14} />
                {connected ? "SECURE CONNECTION" : "ESTABLISHING..."}
             </div>
             

             <a href="#" className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
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
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
                    <Users size={14} /> Incoming Session
                </h3>
                
                <div className="space-y-4">
                    <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Session Code</span>
                        <div className="text-3xl font-mono font-black tracking-widest text-slate-800 dark:text-indigo-400">
                            {humanCode}
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-2xl border border-indigo-100 dark:border-indigo-500/10">
                        <ShieldCheck className="text-indigo-600 dark:text-indigo-400 shrink-0" size={20} />
                        <div>
                            <p className="text-sm font-bold text-indigo-900 dark:text-indigo-300 leading-tight">Direct P2P Link</p>
                            <p className="text-[11px] text-indigo-700 dark:text-indigo-400/70 mt-1 leading-relaxed">Files move directly from sender to you. No cloud storage used.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-slate-900 dark:bg-indigo-950 rounded-[2rem] text-white shadow-xl shadow-slate-200 dark:shadow-none relative overflow-hidden group">
                <ArrowDownToLine className="absolute -right-4 -bottom-4 text-white/10 w-24 h-24 group-hover:scale-110 transition-transform duration-500" />
                <h4 className="font-bold text-sm mb-2 uppercase tracking-wide">Receiver Tip</h4>
                <p className="text-slate-400 text-xs leading-relaxed relative z-10">Keep this window active until downloads complete. Since this is P2P, closing the tab breaks the transfer.</p>
            </div>
          </div>

          {/* Main Content: File Inbox */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[500px]">
                <div className="border-b border-slate-100 dark:border-slate-800 p-6 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                   <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Incoming Inbox</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage and save your received files</p>
                   </div>
                   <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-tighter">
                    {receivedFiles.length} Total
                   </div>
                </div>

                <div className="p-6">
                    {receivedFiles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                            {connected ? (
                                <>
                                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] flex items-center justify-center mb-6">
                                        <Loader2 size={36} className="animate-spin text-indigo-500" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-700 dark:text-slate-200">Awaiting Files</h4>
                                    <p className="text-slate-400 dark:text-slate-500 text-sm max-w-xs mt-2">The tunnel is open. Files will appear here automatically when the sender starts the transfer.</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] flex items-center justify-center mb-6 text-slate-300 dark:text-slate-600">
                                        <Wifi size={36} className="animate-pulse" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-700 dark:text-slate-200">Connecting Link</h4>
                                    <p className="text-slate-400 dark:text-slate-500 text-sm max-w-xs mt-2">Synchronizing with the sender's device. This usually takes just a few seconds.</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {receivedFiles.map((file) => (
                                <div key={file.id} className="group relative flex items-center justify-between p-5 bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all hover:shadow-lg dark:hover:shadow-none">
                                    <div className="flex items-center gap-5 flex-1">
                                        <div className={`p-3.5 rounded-2xl transition-colors ${
                                            file.status === 'complete' 
                                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                            : 'bg-slate-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                                        }`}>
                                            {file.status === 'complete' ? <CheckCircle2 size={24} /> : <FileText size={24} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{file.fileName}</p>
                                            <div className="flex items-center gap-2 text-[11px] font-bold mt-1 uppercase tracking-tight">
                                                <span className="text-slate-400 dark:text-slate-500">{formatSize(file.fileSize)}</span>
                                                <span className="text-slate-200 dark:text-slate-700">•</span>
                                                {file.status === 'receiving' && <span className="text-indigo-600 dark:text-indigo-400 animate-pulse">Downloading...</span>}
                                                {file.status === 'complete' && <span className="text-emerald-500">Decrypted & Ready</span>}
                                                {file.status === 'error' && <span className="text-red-500">Failed</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        {file.status === 'receiving' && (
                                            <div className="flex flex-col items-end gap-2">
                                                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400">{Math.round(file.progress)}%</span>
                                                <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300" 
                                                        style={{ width: `${file.progress}%` }} 
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <button 
                                            onClick={() => downloadFile(file)}
                                            disabled={file.status !== 'complete'} 
                                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-md ${
                                                file.status === 'complete' 
                                                ? 'bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600 shadow-emerald-100 dark:shadow-none' 
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed shadow-none'
                                            }`}
                                        >
                                            <Download size={18} />
                                            {file.status === 'complete' ? 'Save File' : 'Waiting'}
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