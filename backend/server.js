const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
console.log("Loading environment variables...");
console.log("MONGO_URI:", process.env.MONGO_URI ? "Loaded" : "UNDEFINED");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Loaded" : "UNDEFINED");
console.log("AGORA_APP_ID:", process.env.AGORA_APP_ID ? "Loaded" : "UNDEFINED");
console.log("AGORA_APP_CERTIFICATE:", process.env.AGORA_APP_CERTIFICATE ? "Loaded" : "UNDEFINED");

connectDB();

const app = express();
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST"]
  }
});

// Initialize Socket Handler
require('./socket/socketHandler')(io);

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/invitations', require('./routes/invitationRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/agora', require('./routes/agoraRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));

app.get('/', (req, res) => {
  res.send('TeamFlow API is running');
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // KEEP-ALIVE MECHANISM
  // Prevent Render's free tier from sleeping by pinging self every 10 minutes
  const INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

  setInterval(() => {
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${PORT}`;
    console.log(`[Keep-Alive] Pinging ${backendUrl} to prevent sleep...`);

    // Use built-in node fetch (v18+) or http/https adapter if using older node.
    // Assuming Node 18+ which has global fetch, otherwise fallback to http
    fetch(backendUrl)
      .then(res => console.log(`[Keep-Alive] Ping successful: ${res.status} ${res.statusText}`))
      .catch(err => console.error(`[Keep-Alive] Ping failed: ${err.message}`));
  }, INTERVAL_MS);
});
