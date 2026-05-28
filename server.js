const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use('/api/users', require('./routes/api/userRoutes'));
app.use('/api/projects', require('./routes/api/projectRoutes'));
app.use('/api', require('./routes/api/taskRoutes'));

app.get('/', (req, res) => {
  res.send('Task Manager API Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});