const db = require('../config/database');

const logAudit = async (userId, action) => {
  try {
    await db.query('INSERT INTO audit_logs (user_id, action) VALUES (?, ?)', [userId, action]);
  } catch (err) {
    console.error('Audit log error:', err);
  }
};

module.exports = logAudit;
