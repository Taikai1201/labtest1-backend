const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoute = require('./routes/UserRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // or specify your client's origin for security
    methods: ["GET", "POST"],
  },
});

const DB_CONNECTION_STRING = "your_mongodb_connection_string_here";
mongoose.connect(DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use(userRoute);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', ({ username, room }) => {
    socket.join(room);
    console.log(`${username} joined ${room}`);
    // Broadcast when a user connects
    socket.broadcast.to(room).emit('message', { user: 'admin', text: `${username} has joined!` });
  });

  socket.on('sendMessage', ({ message, room, from_user }) => {
    io.to(room).emit('message', { user: from_user, text: message });
    // Here, you can also save the message to MongoDB
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    // Broadcast when a user disconnects if needed
  });
});

const SERVER_PORT = process.env.PORT || 8000;
server.listen(SERVER_PORT, () => console.log(`Server running on port ${SERVER_PORT}`));
