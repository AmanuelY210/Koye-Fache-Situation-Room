const db = require('../config/database');
const logAudit = require('../middleware/audit');

exports.createSubmission = async (req, res) => {
  try {
    const { elector_number, description } = req.body;
    const num = parseInt(elector_number);
    if (!elector_number || isNaN(num) || num <= 0) {
      return res.status(400).json({ message: 'A valid positive elector number is required.' });
    }

    const attachment = req.file ? req.file.filename : null;
    const [result] = await db.query(
      'INSERT INTO electors_submissions (user_id, elector_number, description, attachment) VALUES (?, ?, ?, ?)',
      [req.user.id, num, description || null, attachment]
    );

    await logAudit(req.user.id, `Submitted electors count: ${elector_number}`);

    res.status(201).json({ message: 'Submission created successfully.', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getMySubmissions = async (req, res) => {
  try {
    const { search, start_date, end_date, status } = req.query;
    let query = 'SELECT * FROM electors_submissions WHERE user_id = ?';
    let params = [req.user.id];

    if (search) {
      query += ' AND (description LIKE ? OR elector_number LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (start_date) {
      query += ' AND created_at >= ?';
      params.push(start_date);
    }
    if (end_date) {
      query += ' AND created_at <= ?';
      params.push(end_date + ' 23:59:59');
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getMyStats = async (req, res) => {
  try {
    const [total] = await db.query('SELECT COUNT(*) as count FROM electors_submissions WHERE user_id = ?', [req.user.id]);
    const [approved] = await db.query("SELECT COUNT(*) as count FROM electors_submissions WHERE user_id = ? AND status = 'approved'", [req.user.id]);
    const [pending] = await db.query("SELECT COUNT(*) as count FROM electors_submissions WHERE user_id = ? AND status = 'pending'", [req.user.id]);
    const [rejected] = await db.query("SELECT COUNT(*) as count FROM electors_submissions WHERE user_id = ? AND status = 'rejected'", [req.user.id]);
    const [totalApprovedElectors] = await db.query("SELECT COALESCE(SUM(elector_number), 0) as total FROM electors_submissions WHERE user_id = ? AND status = 'approved'", [req.user.id]);

    res.json({
      totalSubmissions: total[0].count,
      approvedSubmissions: approved[0].count,
      pendingSubmissions: pending[0].count,
      rejectedSubmissions: rejected[0].count,
      totalApprovedElectors: totalApprovedElectors[0].total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getAllSubmissions = async (req, res) => {
  try {
    const { search, start_date, end_date, status } = req.query;
    let query = `SELECT s.*, u.full_name as user_name, u.username, a.full_name as approved_by_name 
                 FROM electors_submissions s 
                 LEFT JOIN users u ON s.user_id = u.id 
                 LEFT JOIN users a ON s.approved_by = a.id 
                 WHERE 1=1`;
    let params = [];

    if (search) {
      query += ' AND (s.description LIKE ? OR s.elector_number LIKE ? OR u.full_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (start_date) {
      query += ' AND s.created_at >= ?';
      params.push(start_date);
    }
    if (end_date) {
      query += ' AND s.created_at <= ?';
      params.push(end_date + ' 23:59:59');
    }
    if (status) {
      query += ' AND s.status = ?';
      params.push(status);
    }

    query += ' ORDER BY s.created_at DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.approveSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(
      "UPDATE electors_submissions SET status = 'approved', approved_by = ?, approved_date = NOW() WHERE id = ?",
      [req.user.id, id]
    );

    const [sub] = await db.query('SELECT elector_number FROM electors_submissions WHERE id = ?', [id]);

    await logAudit(req.user.id, `Approved submission ID: ${id}`);

    const [total] = await db.query("SELECT COALESCE(SUM(elector_number), 0) as total FROM electors_submissions WHERE status = 'approved'");

    req.app.get('io').emit('counter-update', { totalApprovedElectors: total[0].total });

    res.json({ message: 'Submission approved successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.rejectSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(
      "UPDATE electors_submissions SET status = 'rejected', approved_by = ?, approved_date = NOW() WHERE id = ?",
      [req.user.id, id]
    );
    await logAudit(req.user.id, `Rejected submission ID: ${id}`);
    res.json({ message: 'Submission rejected.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { elector_number, description } = req.body;
    const num = parseInt(elector_number);
    if (!elector_number || isNaN(num) || num <= 0) {
      return res.status(400).json({ message: 'A valid positive elector number is required.' });
    }
    await db.query('UPDATE electors_submissions SET elector_number = ?, description = ? WHERE id = ?', [num, description, id]);
    await logAudit(req.user.id, `Updated submission ID: ${id}`);
    res.json({ message: 'Submission updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM electors_submissions WHERE id = ?', [id]);
    await logAudit(req.user.id, `Deleted submission ID: ${id}`);
    res.json({ message: 'Submission deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getTotalApprovedElectors = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT COALESCE(SUM(elector_number), 0) as total FROM electors_submissions WHERE status = 'approved'");
    res.json({ totalApprovedElectors: rows[0].total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getSubmissionsByDateRange = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    let query = `SELECT s.*, u.full_name as user_name, a.full_name as approved_by_name FROM electors_submissions s 
                 LEFT JOIN users u ON s.user_id = u.id 
                 LEFT JOIN users a ON s.approved_by = a.id WHERE 1=1`;
    let params = [];

    if (start_date) {
      query += ' AND s.created_at >= ?';
      params.push(start_date);
    }
    if (end_date) {
      query += ' AND s.created_at <= ?';
      params.push(end_date + ' 23:59:59');
    }

    query += ' ORDER BY s.created_at DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};
