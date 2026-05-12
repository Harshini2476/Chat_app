const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Error:", err);
  });

const messageSchema = new mongoose.Schema({
  username: String,
  text: String,
  time: String,
});

const Message = mongoose.model("Message", messageSchema);

let activeUsers = [];

io.on("connection", (socket) => {
  console.log("User Connected");

  socket.on("join", (username) => {
    socket.username = username;

    if (!activeUsers.includes(username)) {
      activeUsers.push(username);
    }

    io.emit("active_users", activeUsers);

    io.emit("receive_message", {
      username: "System",
      text: `${username} joined the chat`,
      time: new Date().toLocaleTimeString(),
    });
  });

  socket.on("send_message", async (data) => {
    
    const newMessage = new Message(data);
    await newMessage.save();

    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");

    if (socket.username) {
      activeUsers = activeUsers.filter(
        (user) => user !== socket.username
      );

      io.emit("active_users", activeUsers);

      io.emit("receive_message", {
        username: "System",
        text: `${socket.username} left the chat`,
        time: new Date().toLocaleTimeString(),
      });
    }
  });
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
