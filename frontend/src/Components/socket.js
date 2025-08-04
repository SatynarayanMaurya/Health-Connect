// src/socket.js
import { io } from "socket.io-client";

// Replace with your backend Socket.IO server URL
const SOCKET_URL = "https://health-connect-u164.onrender.com";

const socket = io(SOCKET_URL, {
  transports: ["websocket"], // Ensures faster communication
  autoConnect: true,
});

export default socket;
