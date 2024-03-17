const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Store the username for each client
const username = {};

// Track whether a user has clicked the button
const clickedUsers = new Set();

// Queue to track users
const queue = [];

io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle 'setname' event
  socket.on("setname", (data) => {
    username[socket.id] = data.name;
    console.log(`User ${data.name} connected`);
  });

  // Handle 'click' event
  socket.on("click", () => {
    const user = username[socket.id];
    if (!user) {
      console.log("Error: User's name not set");
      return;
    }

    // Check if the user has already clicked
    if (clickedUsers.has(user)) {
      console.log(`${user} has already clicked`);
      return;
    }

    // Mark the user as clicked
    clickedUsers.add(user);

    // Add user to the queue
    queue.push(user);

    // Emit the updated queue to all clients
    io.emit("updateQueue", queue);

    console.log(`${user} clicked`);
  });

  // Handle 'removeFromQueue' event
  socket.on("removeFromQueue", () => {
    if (queue.length > 0) {
      const removedUser = queue.shift();
      io.emit("updateQueue", queue);
      console.log(`Removed ${removedUser} from the queue`);
    }
    if (queue.length === 0) {
      clickedUsers.clear();
      io.emit("resetQueue");
      console.log("Auto Reset");
    }
  });

  socket.on("lejaEvent", () => {
    io.emit("lejaPlay");
  });

  // Handle 'resetQueue' event
  socket.on("resetQueue", () => {
    // Check if the reset request comes from clicks.html
    const referer = socket.handshake.headers.referer;
    if (referer && referer.includes("queue.html")) {
      // Reset clicked users and queue
      clickedUsers.clear();
      queue.length = 0;
      io.emit("updateQueue", queue);
      console.log("Queue reset");
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    const user = username[socket.id];
    if (user) {
      console.log(`User ${user} disconnected`);
      delete username[socket.id];
    } else {
      console.log("User disconnected");
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Serve setname.html for setting usernames
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "setname.html"));
});

// Serve click.html for clicking the button
app.get("/click.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "click.html"));
});

// Serve click.html for clicking the button
app.get("/queue.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "queue.html"));
});
