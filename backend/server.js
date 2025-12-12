const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', require('./routes/userRoutes'));

app.get('/', (req, res) => {
  res.send('TeamFlow API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
