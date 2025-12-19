import { io, Socket } from "socket.io-client"
import { BACKEND_PORT } from "../config/conf"


export const socket: Socket = io(String(BACKEND_PORT))
