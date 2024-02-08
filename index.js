// const mongoose = require('mongoose')
// const express = require('express')
// const app = express()
// app.use(express.json())
// userRoute = require('./routes/UserRoutes')

// // corss origin config
// const cors = require('cors')
// app.use(cors())

// const SERVER_PORT = process.env.PORT || 8000

// const DB_CONNECTION_STRING = "mongodb+srv://vudangdaiduong:Taikai1201@assignment1.ij06984.mongodb.net/labtest1?retryWrites=true&w=majority";

// mongoose.connect(DB_CONNECTION_STRING, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })

// app.route("/").get((req, res) => {
//     res.send("<h1>hello</h1>")
// })

// app.use(userRoute)

// app.listen(SERVER_PORT, () => {
//     console.log(`Server running at http://localhost:${SERVER_PORT}`)
// })


const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoute = require('./routes/UserRoutes'); // Ensure this path is correct

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Adjust according to your frontend's origin
    methods: ["GET", "POST"]
  }
});

const DB_CONNECTION_STRING = "mongodb+srv://vudangdaiduong:Taikai1201@assignment1.ij06984.mongodb.net/labtest1?retryWrites=true&w=majority";

mongoose.connect(DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use(cors());
app.use(express.json());
app.use(userRoute);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', ({ username, room }) => {
    socket.join(room);
    console.log(`${username} has joined room: ${room}`);
    // Broadcast to the room except the sender
    socket.to(room).emit('message', { user: 'admin', text: `${username} has joined the chat!` });
  });

  socket.on('sendMessage', (data) => {
    const { room, message, from_user } = data;
    // Emit message to the room
    io.to(room).emit('message', { user: from_user, text: message, date_sent: new Date() });

    // Save message to MongoDB here if needed
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    // Handle disconnection if needed, e.g., notify the room
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
