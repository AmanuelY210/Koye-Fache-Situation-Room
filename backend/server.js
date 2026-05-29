require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const db = require('./config/database');
const seedDatabase = require('./config/seed');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }
});

app.set('io', io);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' }
});

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/electors', require('./routes/electors'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/uploads', require('./routes/uploads'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Live Electors API is running.' });
});

const buildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(buildPath));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(buildPath, 'index.html'));
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await db.query('SELECT 1');
    console.log('Database connected successfully');
    await seedDatabase();
  } catch (err) {
    console.error('Database connection failed:', err.message);
    console.log('Server will start but database features will be unavailable.');
    console.log('Please ensure MySQL is running and the database exists.');
    console.log('Run the SQL script: backend/config/schema.sql to set up the database.');
  }

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
