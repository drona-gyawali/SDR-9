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
    <div className="p-6 space-y-8 bg-transparent transition-colors duration-300">
      {/* Professional Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => canAddMoreFiles && document.getElementById('file-upload-input')?.click()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-[2rem] transition-all duration-300 p-12 text-center
          ${isDragging 
            ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500 shadow-2xl shadow-indigo-500/10' 
            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/60'}`}
      >
        <input type="file" multiple onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }} id="file-upload-input" className="hidden" />
        
        <div className="flex flex-col items-center">
          <div className={`mb-6 p-5 rounded-[1.5rem] transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3 ${
            isDragging 
            ? 'bg-indigo-600 text-white' 
            : 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xl border border-slate-100 dark:border-slate-700'
          }`}>
            <UploadCloud size={40} />
          </div>
          <h4 className="text-xl font-bold text-slate-800 dark:text-white">Upload Assets</h4>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-xs mx-auto">
            Drag and drop your files here or <span className="text-indigo-600 dark:text-indigo-400 font-semibold underline underline-offset-4">browse files</span>.
          </p>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-6 font-bold">
            Queue: {fileQueue.length} / {MAX_QUEUE_SIZE} 
          </p>
        </div>
      </div>

      {uploadError && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl text-xs font-bold border border-red-100 dark:border-red-500/20 animate-in fade-in zoom-in-95">
          <AlertTriangle size={18} /> {uploadError}
        </div>
      )}

      {/* Queue List */}
      {fileQueue.length > 0 && (
        <div className="animate-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between mb-6 px-2">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-lg">
                Transfer Queue
              </h3>
              <p className="text-xs text-slate-400 font-medium">{fileQueue.length} items ready for encryption</p>
            </div>
            
            <button
              onClick={() => !isAnyTransferring && filesPending && startFileTransfer(fileQueue.find(f => f.status === 'pending')!)}
              disabled={isAnyTransferring || !filesPending}
              className="group flex items-center gap-2 px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
            >
              {isAnyTransferring ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
              {isAnyTransferring ? 'Syncing...' : 'Initiate Sync'}
            </button>
          </div>

          <div className="space-y-4">
            {fileQueue.map((item) => (
              <div 
                key={item.id} 
                className="group relative flex items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none"
              >
                <div className="flex items-center gap-5 flex-1">
                  <div className={`p-3 rounded-2xl transition-colors ${
                    item.status === 'complete' 
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                    : item.status === 'transferring'
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                  }`}>
                    <FileText size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{item.file.name}</p>
                    <div className="flex items-center gap-2 text-[11px] font-bold mt-1">
                      <span className="text-slate-400 dark:text-slate-500 tracking-tight">{formatSize(item.file.size)}</span>
                      <span className="text-slate-200 dark:text-slate-700">•</span>
                      <span className={`uppercase tracking-widest ${
                        item.status === 'complete' ? 'text-emerald-500' : 
                        item.status === 'transferring' ? 'text-indigo-500 animate-pulse' : 'text-slate-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {item.status === 'transferring' && (
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400">{Math.round(item.progress)}%</span>
                      <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-500 ease-out" 
                          style={{ width: `${item.progress}%` }} 
                        />
                      </div>
                    </div>
                  )}
                  
                  {item.status === 'complete' && <CheckCircle size={22} className="text-emerald-500" />}
                  {item.status === 'pending' && <Clock size={20} className="text-slate-300 dark:text-slate-600" />}
                  
                  <button
                    onClick={() => item.status !== 'transferring' && setFileQueue(prev => prev.filter(f => f.id !== item.id))}
                    className={`p-2 rounded-xl transition-all ${
                      item.status === 'transferring' 
                      ? 'opacity-20 cursor-not-allowed' 
                      : 'hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400'
                    }`}
                  >
                    <X size={20} />
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