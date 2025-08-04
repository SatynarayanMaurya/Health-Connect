// src/socket.js
import { io } from "socket.io-client";

// Replace with your backend Socket.IO server URL
const SOCKET_URL = "http://localhost:4000";

const socket = io(SOCKET_URL, {
  transports: ["websocket"], // Ensures faster communication
  autoConnect: true,
});

export default socket;
