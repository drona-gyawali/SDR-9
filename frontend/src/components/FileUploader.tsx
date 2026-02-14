import { useState, useCallback, useRef, useEffect } from "react";
import { UploadCloud, X, Send, FileText, CheckCircle, AlertTriangle, Clock, Loader2 } from 'lucide-react';
import { formatSize, generateId } from "../utils/file";
import { CHUNK_SIZE, MAX_QUEUE_SIZE } from "../config/constant";
import type { FileTransfer } from "../types/global";

export default function FileUploader({ peer }: { peer: any }) {
  const [fileQueue, setFileQueue] = useState<FileTransfer[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const activeFileId = useRef<string | null>(null);
  const waitingAck = useRef<string | null>(null);
  const fileQueueRef = useRef<FileTransfer[]>([]);

  useEffect(() => {
    fileQueueRef.current = fileQueue;
  }, [fileQueue]);

  const updateFileStatus = useCallback((id: string, updates: Partial<FileTransfer>) => {
    setFileQueue(prevQueue =>
      prevQueue.map(f => (f.id === id ? { ...f, ...updates } : f))
    );
  }, []);

  const sendChunk = useCallback((chunk: ArrayBuffer) => {
    if (!peer || peer.destroyed) return false;
    try {
      peer.send(chunk);
      return true;
    } catch (err) {
      return false;
    }
  }, [peer]);

  const startSendingChunks = useCallback((id: string) => {
    const fileTransfer = fileQueueRef.current.find(f => f.id === id);
    if (!fileTransfer) return;

    const file = fileTransfer.file;
    let offset = 0;

    const readAndSend = (currentOffset: number) => {
      if (activeFileId.current !== id || !peer || peer.destroyed) {
        updateFileStatus(id, { status: 'error', errorMessage: 'Interrupted' });
        activeFileId.current = null;
        return;
      }

      if (currentOffset >= file.size) {
        try {
          peer.send(JSON.stringify({ type: "transfer-done", data: { id } }));
        } catch (err) {}
        updateFileStatus(id, { status: 'complete', progress: 100 });

        setFileQueue(prevQueue => {
          const nextPendingFile = prevQueue.find(f => f.status === 'pending');
          activeFileId.current = null;
          if (nextPendingFile) setTimeout(() => startFileTransfer(nextPendingFile), 100);
          return prevQueue;
        });
        return;
      }

      const endOffset = Math.min(currentOffset + CHUNK_SIZE, file.size);
      const reader = new FileReader();

      reader.onload = (e) => {
        const chunk = e.target?.result as ArrayBuffer;
        if (!chunk || !sendChunk(chunk)) {
          updateFileStatus(id, { status: 'error', errorMessage: 'Transfer failed' });
          activeFileId.current = null;
          return;
        }
        const newProgress = Math.min(100, ((currentOffset + chunk.byteLength) / file.size) * 100);
        updateFileStatus(id, { progress: newProgress });
        setTimeout(() => readAndSend(currentOffset + chunk.byteLength), 0);
      };
      reader.readAsArrayBuffer(file.slice(currentOffset, endOffset));
    };
    readAndSend(offset);
  }, [peer, sendChunk, updateFileStatus]);

  const startFileTransfer = useCallback((fileTransfer: FileTransfer) => {
    if (activeFileId.current && activeFileId.current !== fileTransfer.id) return;
    if (!peer || peer.destroyed) {
      updateFileStatus(fileTransfer.id, { status: 'error', errorMessage: 'Disconnected' });
      return;
    }

    activeFileId.current = fileTransfer.id;
    updateFileStatus(fileTransfer.id, { status: 'transferring', progress: 0 });

    try {
      peer.send(JSON.stringify({
        type: "metadata",
        data: { id: fileTransfer.id, fileName: fileTransfer.file.name, fileSize: fileTransfer.file.size, chunkSize: CHUNK_SIZE }
      }));
      waitingAck.current = fileTransfer.id;
    } catch (err) {
      updateFileStatus(fileTransfer.id, { status: 'error', errorMessage: 'Failed' });
      activeFileId.current = null;
    }
  }, [peer, updateFileStatus]);

  useEffect(() => {
    if (!peer) return;
    const handleData = (data: any) => {
      let text = "";
      if (data instanceof Uint8Array) text = new TextDecoder().decode(data);
      else if (typeof data === "string") text = data;
      else if (data instanceof ArrayBuffer) text = new TextDecoder().decode(new Uint8Array(data));

      try {
        const message = JSON.parse(text);
        if (message.type === 'metadata-ack' && message.data.id === waitingAck.current) {
          const ackId = message.data.id;
          waitingAck.current = null;
          setTimeout(() => {
            if (activeFileId.current === ackId) startSendingChunks(ackId);
          }, 150);
        }
      } catch (err) {}
    };
    peer.on('data', handleData);
    return () => peer.off('data', handleData);
  }, [peer, startSendingChunks]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const remainingSlots = MAX_QUEUE_SIZE - fileQueue.length;
    const newFiles = Array.from(files).slice(0, remainingSlots);
    if (newFiles.length === 0 && files.length > 0) {
      setUploadError(`Max ${MAX_QUEUE_SIZE} files reached`);
      return;
    }
    setUploadError(null);
    const newFileTransfers = newFiles.map(file => ({
      id: generateId(), file, progress: 0, status: 'pending' as const,
    }));
    setFileQueue(prev => [...prev, ...newFileTransfers]);
  };

  const isAnyTransferring = fileQueue.some(f => f.status === 'transferring');
  const filesPending = fileQueue.some(f => f.status === 'pending');
  const canAddMoreFiles = fileQueue.length < MAX_QUEUE_SIZE;

  return (
    <div className="p-6 space-y-8 bg-transparent">
      {/* Premium Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => canAddMoreFiles && document.getElementById('file-upload-input')?.click()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-[2.5rem] transition-all duration-500 p-12 text-center
          ${isDragging 
            ? 'bg-indigo-500/5 border-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.1)]' 
            : 'bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50'}`}
      >
        <input type="file" multiple onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }} id="file-upload-input" className="hidden" />
        
        <div className="flex flex-col items-center">
          <div className={`mb-6 p-6 rounded-[2rem] transition-all duration-700 transform group-hover:scale-105 group-hover:-translate-y-1 ${
            isDragging 
            ? 'bg-indigo-600 text-white' 
            : 'bg-white dark:bg-zinc-900 text-indigo-500 dark:text-indigo-400 shadow-2xl dark:shadow-none border border-zinc-100 dark:border-zinc-800'
          }`}>
            <UploadCloud size={44} strokeWidth={1.5} />
          </div>
          <h4 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">Drop your files here</h4>
          <p className="text-zinc-500 dark:text-zinc-500 text-sm mt-2 max-w-xs mx-auto">
            Drag and drop or <span className="text-indigo-500 font-semibold hover:underline">browse</span>
          </p>
          <div className="mt-6 flex items-center gap-2 px-3 py-1 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full">
            <span className="text-[10px] uppercase tracking-tighter text-zinc-500 dark:text-zinc-400 font-bold">
              Queue: {fileQueue.length} / {MAX_QUEUE_SIZE} 
            </span>
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 text-red-500 rounded-2xl text-xs font-bold border border-red-500/20 animate-in fade-in slide-in-from-top-2">
          <AlertTriangle size={18} /> {uploadError}
        </div>
      )}

      {/* Queue List */}
      {fileQueue.length > 0 && (
        <div className="animate-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between mb-6 px-2">
            <div>
              <h3 className="font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2 text-lg tracking-tight">
                Queue
              </h3>
              <p className="text-xs text-zinc-500 font-medium">Ready for P2P delivery</p>
            </div>
            
            <button
              onClick={() => !isAnyTransferring && filesPending && startFileTransfer(fileQueue.find(f => f.status === 'pending')!)}
              disabled={isAnyTransferring || !filesPending}
              className="group cursor-pointer relative flex items-center gap-2 px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl text-sm cursor-pointer font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
            >
              {isAnyTransferring ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
              {isAnyTransferring ? 'Syncing...' : 'Start Transfer'}
            </button>
          </div>

          <div className="space-y-3">
            {fileQueue.map((item) => (
              <div 
                key={item.id} 
                className="group relative flex items-center justify-between p-4 bg-white dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/60 rounded-3xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-3 rounded-2xl transition-all duration-500 ${
                    item.status === 'complete' 
                    ? 'bg-emerald-500/10 text-emerald-500' 
                    : item.status === 'transferring'
                    ? 'bg-indigo-500/10 text-indigo-500'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600'
                  }`}>
                    <FileText size={22} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate tracking-tight">{item.file.name}</p>
                    <div className="flex items-center gap-2 text-[11px] font-bold mt-0.5">
                      <span className="text-zinc-400 dark:text-zinc-500">{formatSize(item.file.size)}</span>
                      <span className="text-zinc-300 dark:text-zinc-800">•</span>
                      <span className={`uppercase tracking-tighter ${
                        item.status === 'complete' ? 'text-emerald-500' : 
                        item.status === 'transferring' ? 'text-indigo-500' : 'text-zinc-500'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {item.status === 'transferring' && (
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-[10px] font-black text-indigo-500 tabular-nums">{Math.round(item.progress)}%</span>
                      <div className="w-20 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 transition-all duration-300 ease-out" 
                          style={{ width: `${item.progress}%` }} 
                        />
                      </div>
                    </div>
                  )}
                  
                  {item.status === 'complete' && <CheckCircle size={20} className="text-emerald-500" strokeWidth={2.5} />}
                  {item.status === 'pending' && <Clock size={18} className="text-zinc-300 dark:text-zinc-700" />}
                  
                  <button
                    onClick={() => item.status !== 'transferring' && setFileQueue(prev => prev.filter(f => f.id !== item.id))}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      item.status === 'transferring' 
                      ? 'opacity-0 scale-50 pointer-events-none' 
                      : 'hover:bg-red-500/10 text-zinc-300 dark:text-zinc-700 hover:text-red-500'
                    }`}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}