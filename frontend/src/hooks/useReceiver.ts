import { useEffect, useState, useRef, useCallback } from "react";
import usePeerConnection from "./usePeerConnection";
import { socket } from "../utils/signal";
import type { ReceivedFile } from "../types/global";

export default function useReceiver(roomId: string | null) {
  const { connected, peer } = usePeerConnection(roomId, false);
  const [receivedFiles, setReceivedFiles] = useState<ReceivedFile[]>([]);
  const chunkMap = useRef<Map<string, Uint8Array[]>>(new Map());
  const fileInfoMap = useRef<Map<string, { fileSize: number, received: number }>>(new Map());

  const updateFileStatus = useCallback(
    (id: string, updates: Partial<ReceivedFile>) => {
      setReceivedFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
      );
    },
    []
  );

  useEffect(() => {
    if (!peer) return;

    console.log("Receiver: Setting up data handler - peer is ready");

    const handleData = (data: any) => {
      console.log("Receiver got data type:", typeof data, 
        data instanceof ArrayBuffer, 
        data instanceof Uint8Array,
        data);

      if (data instanceof ArrayBuffer) {
        console.log("Receiver got ArrayBuffer:", data.byteLength, "bytes");
        handleBinaryData(data);
        return;
      }
      
      if (data instanceof Uint8Array) {
        console.log("Receiver got Uint8Array:", data.length, "bytes");
        
        try {
          const text = new TextDecoder().decode(data);
          console.log("📨 Decoded Uint8Array as text:", text.substring(0, 100));
          
          try {
            const msg = JSON.parse(text);
            handleMessage(msg);
            return;
          } catch (jsonError) {
            console.log("Could not parse as JSON, treating as binary data");
          }
        } catch (decodeError) {
          console.log("Could not decode as text, treating as binary data");
        }
        
        handleBinaryData((data.buffer || data) as ArrayBuffer);
        return;
      }
      
      // Handle string data
      if (typeof data === "string") {
        console.log("Receiver got string:", data.substring(0, 100));
        try {
          const msg = JSON.parse(data);
          handleMessage(msg);
        } catch (error) {
          console.error("Failed to parse string message:", error);
        }
        return;
      }
      
      console.warn("Unknown data type received:", typeof data, data);
    };

    const handleBinaryData = (arrayBuffer: ArrayBuffer) => {
      const entries = Array.from(fileInfoMap.current.entries());
      if (entries.length === 0) {
        console.warn("Received binary data without active file transfer");
        return;
      }
      
      const [currentId, fileInfo] = entries[0];
      
      const chunks = chunkMap.current.get(currentId) || [];
      const uint8Array = new Uint8Array(arrayBuffer);
      chunks.push(uint8Array);
      chunkMap.current.set(currentId, chunks);
      
      fileInfo.received += arrayBuffer.byteLength;
      fileInfoMap.current.set(currentId, fileInfo);
      
      const progress = Math.min(100, Math.round((fileInfo.received / fileInfo.fileSize) * 100));
      console.log(`Progress for ${currentId}: ${progress}% (${fileInfo.received}/${fileInfo.fileSize})`);
      updateFileStatus(currentId, { progress });
    };

    const handleMessage = (msg: any) => {
      console.log("Parsed message:", msg);

      if (msg.type === "metadata") {
        const { id, fileName, fileSize } = msg.data;
        console.log(`Starting to receive file: ${fileName} (${fileSize} bytes)`);
        
        setReceivedFiles((prev) => [
          ...prev,
          {
            id,
            fileName,
            fileSize,
            progress: 0,
            status: "receiving",
            blob: null,
          },
        ]);
        
        chunkMap.current.set(id, []);
        fileInfoMap.current.set(id, { fileSize, received: 0 });
        
        
        console.log(`Sending metadata-ack for ${id}`);
        if (peer.connected) {
          const ackMessage = JSON.stringify({ 
            type: "metadata-ack", 
            data: { id } 
          });
          console.log("Sending ACK:", ackMessage);
          peer.send(ackMessage);
        }
      }

      if (msg.type === "transfer-done") {
        const id = msg.data.id;
        console.log(` Transfer done for ${id}`);
        
        const chunks = chunkMap.current.get(id);
        const fileInfo = fileInfoMap.current.get(id);
        
        if (chunks && chunks.length > 0 && fileInfo) {
          try {
            const totalBytes = fileInfo.received;
            const combined = new Uint8Array(totalBytes);
            let offset = 0;
            
            for (const chunk of chunks) {
              combined.set(chunk, offset);
              offset += chunk.byteLength;
            }
            
            const blob = new Blob([combined]);
            console.log(` File assembled: ${id}, size: ${blob.size} bytes`);
            updateFileStatus(id, {
              status: "complete",
              progress: 100,
              blob,
            });
          } catch (error) {
            console.error(" Error creating blob:", error);
            updateFileStatus(id, {
              status: "error",
              errorMessage: "Failed to assemble file",
            });
          }
        } else {
          console.error(" No chunks or file info for", id);
          updateFileStatus(id, {
            status: "error",
            errorMessage: "No data received",
          });
        }
        
        chunkMap.current.delete(id);
        fileInfoMap.current.delete(id);
      }
    };

    
    peer.off("data", handleData);
    
    peer.on("data", handleData);
    
    return () => {
      peer.off("data", handleData);
    };
  }, [peer, updateFileStatus]);

  useEffect(() => {
    if (roomId) {
      console.log(`Joining room: ${roomId}`);
      socket.emit("join-room", roomId);
    }
  }, [roomId]);

  const downloadFile = useCallback((file: ReceivedFile) => {
    if (!file.blob) return;
    
    const url = URL.createObjectURL(file.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  return { connected, receivedFiles, downloadFile };
}