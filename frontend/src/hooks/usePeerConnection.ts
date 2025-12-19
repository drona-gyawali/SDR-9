import { useRef, useState, useEffect } from "react";
import SimplePeer, { type Instance } from "simple-peer";
import { socket } from "../utils/signal";
import { SERVERS } from "../config/conf";

export default function usePeerConnection(
  roomId: string | null | undefined,
  initiator: boolean
) {
  const peerRef = useRef<Instance | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!roomId || peerRef.current) return;

    const peer = new SimplePeer({
      initiator,
      trickle: false,
      config: {
        iceServers: [
          { urls: SERVERS.google1 },
          { urls: SERVERS.google2 },
          { urls: SERVERS.cloudFlare},
          {
            urls: SERVERS.turnServer,
            username: SERVERS.turnUsername,
            credential: SERVERS.turnPassword,
          },
        ]
      }
    });
    peerRef.current = peer;

    peer.on("signal", data => {
      console.log("SIGNAL GENERATED", data.type);
      socket.emit("signal", { roomId, data });
    });

    peer.on("connect", () => {
      console.log("Peer connected");
      setConnected(true);
    });

    peer.on("error", err => console.error("Peer error:", err));

    const signalHandler = ({ data }: { data: any }) => {
      console.log("SIGNAL RECEIVED", data.type);
      peer.signal(data);
    };
    socket.on("signal", signalHandler);

    return () => {
      peer.destroy();
      peerRef.current = null;
      socket.off("signal", signalHandler);
    };
  }, [roomId, initiator]);

  return {
    peer: peerRef.current,
    connected,
  };
}
