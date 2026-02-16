import { useParams } from "react-router-dom";
import useReceiver from "../hooks/useReceiver";
import { Download, Wifi, FileText, AlertTriangle, Loader2, CheckCircle2, Package } from "lucide-react";
import { generateHumanCode, formatSize } from "../utils/file";
import Navbar from "../components/Navbar";

export default function Receiver() {
    const { roomId } = useParams<{ roomId: string }>();
    const { connected, receivedFiles, downloadFile } = useReceiver(roomId || null);
    const humanCode = generateHumanCode(roomId);

    const completedFiles = receivedFiles.filter(f => f.status === 'complete');
    const isReceiving = receivedFiles.some(f => f.status === 'receiving');

    const handleDownloadAll = () => {
        completedFiles.forEach((file, index) => {
            setTimeout(() => downloadFile(file), index * 500);
        });
    };

    if (!roomId) return <InvalidLinkView />;

    return (
        <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">
            {/* Nav */}
            
            <Navbar>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black border ${connected ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse'}`}>
                    <Wifi size={18} /> {connected ? "LIVE" : "WAITING"}
                </div>
            </Navbar>

            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* Session Header Card */}
                <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 p-6 rounded-4xl mb-6 flex flex-col items-center text-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Room Code</span>
                    <h1 className="text-4xl font-mono font-black text-indigo-600 dark:text-indigo-400 tracking-widest">{humanCode}</h1>
                </div>

                {/* File Inbox */}
                <div className="bg-white dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden min-h-100">
                    <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                        <h2 className="font-bold text-lg">Files ({receivedFiles.length})</h2>
                        {completedFiles.length > 1 && (
                            <button 
                                onClick={handleDownloadAll}
                                className="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors"
                            >
                                Download All
                            </button>
                        )}
                    </div>

                    <div className="p-4 space-y-2">
                        {receivedFiles.length === 0 ? (
                            <EmptyState connected={connected} />
                        ) : (
                            receivedFiles.map((file) => (
                                <div key={file.id} className="flex items-center gap-3 p-3 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-2xl border border-transparent dark:border-zinc-800/50">
                                    <div className={`p-2 rounded-xl ${file.status === 'complete' ? 'bg-emerald-500/10 text-emerald-500' : 'text-indigo-500'}`}>
                                        {file.status === 'complete' ? <CheckCircle2 size={20} /> : <FileText size={20} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate">{file.fileName}</p>
                                        <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter">
                                            {formatSize(file.fileSize)} • {file.status}
                                        </p>
                                    </div>
                                    {file.status === 'receiving' && (
                                        <span className="text-[10px] font-black text-indigo-500 tabular-nums">{Math.round(file.progress)}%</span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {receivedFiles.length > 0 && (
                        <div className="p-6 bg-zinc-50/80 dark:bg-zinc-800/20 border-t border-zinc-100 dark:border-zinc-800">
                            <button
                                onClick={handleDownloadAll}
                                disabled={completedFiles.length === 0}
                                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] ${
                                    completedFiles.length > 0 
                                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' 
                                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                                }`}
                            >
                                {isReceiving ? (
                                    <><Loader2 size={20} className="animate-spin" /> Receiving Files...</>
                                ) : completedFiles.length > 0 ? (
                                    <><Download size={20} /> Save {completedFiles.length} {completedFiles.length === 1 ? 'File' : 'Files'}</>
                                ) : (
                                    <><Package size={20} /> Waiting for files</>
                                )}
                            </button>
                            <p className="text-center text-[10px] text-zinc-400 mt-4 font-bold uppercase tracking-widest">
                                {connected ? "Connection Secure" : "Connecting..."}
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}


interface EmptyStateProps {
  connected: boolean;
}

function EmptyState({ connected }: EmptyStateProps ) {
    return (
        <div className="py-20 flex flex-col items-center text-center px-6">
            <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mb-4 border border-zinc-100 dark:border-zinc-700/50">
                {connected ? <Loader2 className="animate-spin text-indigo-500" /> : <Wifi className="animate-pulse text-zinc-400" />}
            </div>
            <h3 className="font-bold text-zinc-700 dark:text-zinc-200">
                {connected ? "Ready for Transfer" : "Waiting for Friend"}
            </h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-50">
                {connected ? "Files sent by your friend will appear here." : "Make sure your friend is online with the same room code."}
            </p>
        </div>
    );
}

function InvalidLinkView() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="text-center">
                <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
                <h2 className="text-xl font-black">Link Expired</h2>
                <p className="text-zinc-500 text-sm mt-1">Please ask for a new transfer code.</p>
            </div>
        </div>
    );
}