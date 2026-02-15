import { Server } from 'socket.io';
import http from 'http';
import { randomUUID } from 'crypto';
import { conf, origin } from '../config/conf';
import { Socket } from 'socket.io';

interface RoomData {
  peers: Set<string>;
  pendingSignals: any[];
}

class SocketManager {
  private io: Server | null = null;
  private rooms: Map<string, RoomData> = new Map();

  public Init(httpServer: http.Server) {
    this.io = new Server(httpServer, {
      cors: { origin: conf.node_env === 'dev' ? '*' : origin },
    });

    console.log('Server running, waiting for connections...');

    this.io.on('connection', (socket) => {
      console.log(`Connection established: ${socket.id}`);
      this.registerHandlers(socket);
    });
  }

  private registerHandlers(socket: Socket) {
    socket.on('disconnect', (reason: any) => {
      console.log(`User disconnected: ${socket.id} reason: ${reason}`);
      this.rooms.forEach((room, roomId) => {
        if (room.peers.has(socket.id)) room.peers.delete(socket.id);
        if (room.peers.size === 0) {
          this.rooms.delete(roomId);
        }
      });
    });

    socket.on('create-room', () => {
      const roomId = randomUUID();
      socket.join(roomId);

      this.rooms.set(roomId, {
        peers: new Set([socket.id]),
        pendingSignals: [],
      });

      socket.emit('room-created', roomId);
      console.log(`Room created: ${roomId}`);
    });

    socket.on('join-room', (roomId: string) => {
      if (!roomId || typeof roomId !== 'string') {
        socket.emit('error', 'Invalid roomId');
      }

      if (roomId.length > 100) {
        socket.emit('error', 'Room Id too long');
      }
      if (!this.rooms.has(roomId)) {
        socket.emit('error', 'Room Not Found');
        console.log(`Room not found: ${roomId}`);
        return;
      }

      const room = this.rooms.get(roomId)!;
      socket.join(roomId);
      room.peers.add(socket.id);

      console.log(`Peer joined room: ${socket.id} room: ${roomId}`);
      socket.to(roomId).emit('peer-joined', socket.id);

      room.pendingSignals.forEach((signal) => {
        socket.emit('signal', signal);
      });
      room.pendingSignals = [];
    });

    socket.on('signal', ({ roomId, data }: { roomId: string; data: any }) => {
      if (!roomId || typeof roomId != 'string') return;
      if (!data) return;
      const room = this.rooms.get(roomId);
      if (!room) return;

      const otherPeers = Array.from(room.peers).filter(
        (id) => id !== socket.id
      );

      if (otherPeers.length === 0) {
        room.pendingSignals.push({ data });
        console.log('Signal buffered for room:', roomId);
      } else {
        otherPeers.forEach((peerId) => {
          this.io!.to(peerId).emit('signal', { data });
        });
        console.log('Signal relayed in room:', roomId, 'to peers:', otherPeers);
      }
    });
  }
}

export default new SocketManager();
