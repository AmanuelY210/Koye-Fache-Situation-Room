require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const db = require('./config/database');
const seedDatabase = require('./config/seed');
const app = require('./app');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }
});

app.set('io', io);

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
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (0.0.0.0)`);
  });
};

startServer();
