const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
console.log("Loading environment variables...");
console.log("MONGO_URI:", process.env.MONGO_URI ? "Loaded" : "UNDEFINED");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Loaded" : "UNDEFINED");

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/invitations', require('./routes/invitationRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

app.get('/', (req, res) => {
  res.send('TeamFlow API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
