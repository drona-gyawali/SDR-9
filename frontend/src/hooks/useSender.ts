import { useEffect, useState } from "react";
import { socket } from "../utils/signal";
import usePeerConnection from "./usePeerConnection";

export default function useSender() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    socket.emit("create-room");

    const handleRoomCreated = (id: string) => {
      setRoomId(id);
      console.log("Room created", id);
    };

    const handlePeerJoined = () => {
      setStart(true);
      console.log("Peer joined room, you can start handshake now");
    };

    socket.on("room-created", handleRoomCreated);
    socket.on("peer-joined", handlePeerJoined);

    return () => {
      socket.off("room-created", handleRoomCreated);
      socket.off("peer-joined", handlePeerJoined);
    };
  }, []);

  const { connected, peer } = usePeerConnection(roomId, true);
  

  return {
    roomId,
    start,
    connected,
    peer,
  };
}
