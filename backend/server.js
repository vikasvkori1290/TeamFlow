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
});
