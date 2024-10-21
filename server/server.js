const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the Vue.js app
app.use(express.static("dist")); // Ensure you have the Vue app built and in a 'dist' folder

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("signal", (data) => {
    // Forward the signaling data to the target peer
    socket.to(data.to).emit("signal", {
      signal: data.signal,
      from: socket.id,
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
