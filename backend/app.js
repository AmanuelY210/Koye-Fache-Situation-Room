require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();

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

module.exports = app;
