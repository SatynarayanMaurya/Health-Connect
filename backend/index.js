


const express = require("express");
const http = require("http");
const db = require("./Config/database");
const routes = require("./Routes/routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const Message = require("./Models/message.model"); // Make sure this model exists and is exported

require("dotenv").config();
const app = express();
const port = process.env.PORT || 4000;

// 1. Create HTTP server manually
const server = http.createServer(app);

// 2. Initialize Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "https://health-connect-cyan.vercel.app",
    credentials: true,
  },
});

// 3. Connected user tracking
const connectedUsers = {};
const connectedUsers2 = {}

// 4. Socket.IO event handlers
io.on("connection", (socket) => {

  socket.on("join", (userId,role) => {
    connectedUsers[userId] = socket.id;
    connectedUsers2[userId] = role || "Unknown";
  });

  socket.on("chat:message", async ({ from, to, message }) => {
    try {
      const newMessage = new Message({ sender: from, receiver: to, message });
      await newMessage.save();

      if (connectedUsers[to]) {
        io.to(connectedUsers[to]).emit("chat:message", { from, message });
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });
  socket.on("admin:requestConnectedUsers", () => {
    socket.emit("admin:connectedUsers", connectedUsers2);
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of Object.entries(connectedUsers)) {
      if (socketId === socket.id) {
        delete connectedUsers[userId];
        break;
      }
    }
  });
});

// 5. Middlewares
db.databaseConnection();
app.use(cookieParser());
app.use(express.json());

app.use(cors({
  origin: "https://health-connect-cyan.vercel.app",
  credentials: true,
}));

app.use(routes);

app.get("/", (req, res) => {
  res.send(`<h1>Hii Everyone, Machine Test this side</h1>`);
});

// 6. Start server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
