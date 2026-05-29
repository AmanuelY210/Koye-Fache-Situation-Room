const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const logAudit = require('../middleware/audit');

exports.register = async (req, res) => {
  try {
    const { full_name, username, email, phone, election_location, password } = req.body;
    if (!full_name || !username || !email || !password) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    const [existing] = await db.query('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (full_name, username, email, phone, election_location, password, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [full_name, username, email, phone || null, election_location || null, hashedPassword, 'user', 'pending']
    );

    await logAudit(result.insertId, 'User registered - pending approval');

    res.status(201).json({ message: 'Registration successful. Your account is pending approval.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = rows[0];
    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'Your account has been suspended.' });
    }
    if (user.status === 'pending') {
      return res.status(403).json({ message: 'Your account is pending approval.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    await logAudit(user.id, 'User logged in');

    res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        election_location: user.election_location,
        role: user.role,
        status: user.status
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getMe = async (req, res) => {
  res.json(req.user);
};
