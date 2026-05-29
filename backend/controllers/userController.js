const db = require('../config/database');
const logAudit = require('../middleware/audit');

exports.getUsers = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = 'SELECT id, full_name, username, email, phone, election_location, role, status, created_at FROM users';
    let params = [];
    let conditions = [];
    if (search) {
      conditions.push('(full_name LIKE ? OR username LIKE ? OR email LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getPendingUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, full_name, username, email, phone, created_at FROM users WHERE status = ? AND role = ?',
      ['pending', 'user']
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE users SET status = ? WHERE id = ?', ['approved', id]);
    await logAudit(req.user.id, `Approved user ID: ${id}`);
    res.json({ message: 'User approved successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.rejectUser = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    await logAudit(req.user.id, `Rejected/Deleted user ID: ${id}`);
    res.json({ message: 'User rejected and removed.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.suspendUser = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE users SET status = ? WHERE id = ?', ['suspended', id]);
    await logAudit(req.user.id, `Suspended user ID: ${id}`);
    res.json({ message: 'User suspended successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.activateUser = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE users SET status = ? WHERE id = ?', ['approved', id]);
    await logAudit(req.user.id, `Activated user ID: ${id}`);
    res.json({ message: 'User activated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, phone, election_location } = req.body;
    await db.query('UPDATE users SET full_name = ?, email = ?, phone = ?, election_location = ? WHERE id = ?', [full_name, email, phone, election_location || null, id]);
    await logAudit(req.user.id, `Updated user ID: ${id}`);
    res.json({ message: 'User updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    await logAudit(req.user.id, `Deleted user ID: ${id}`);
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers] = await db.query('SELECT COUNT(*) as count FROM users');
    const [pendingUsers] = await db.query("SELECT COUNT(*) as count FROM users WHERE status = 'pending'");
    const [approvedUsers] = await db.query("SELECT COUNT(*) as count FROM users WHERE status = 'approved'");
    const [suspendedUsers] = await db.query("SELECT COUNT(*) as count FROM users WHERE status = 'suspended'");
    const [totalSubmissions] = await db.query('SELECT COUNT(*) as count FROM electors_submissions');
    const [pendingSubmissions] = await db.query("SELECT COUNT(*) as count FROM electors_submissions WHERE status = 'pending'");
    const [approvedSubmissions] = await db.query("SELECT COUNT(*) as count FROM electors_submissions WHERE status = 'approved'");
    const [rejectedSubmissions] = await db.query("SELECT COUNT(*) as count FROM electors_submissions WHERE status = 'rejected'");
    const [totalApprovedElectors] = await db.query("SELECT COALESCE(SUM(elector_number), 0) as total FROM electors_submissions WHERE status = 'approved'");

    res.json({
      totalUsers: totalUsers[0].count,
      pendingUsers: pendingUsers[0].count,
      approvedUsers: approvedUsers[0].count,
      suspendedUsers: suspendedUsers[0].count,
      totalSubmissions: totalSubmissions[0].count,
      pendingSubmissions: pendingSubmissions[0].count,
      approvedSubmissions: approvedSubmissions[0].count,
      rejectedSubmissions: rejectedSubmissions[0].count,
      totalApprovedElectors: totalApprovedElectors[0].total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};
