const db = require('../config/database');
const logAudit = require('../middleware/audit');
const fs = require('fs');
const path = require('path');

exports.getSettings = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM settings WHERE id = 1');
    if (rows.length === 0) {
      return res.json({
        logo: null,
        header_text: 'LIVE ELECTORS COUNT',
        subtitle_text: 'Total Electors',
        footer_text: 'Developed By Amanuel ICT Solution',
        footer_enabled: 1,
        header_font_size: '48px',
        header_font_style: 'Arial',
        header_color: '#ffffff',
        background_color: '#1a1a2e',
        text_color: '#ffffff',
        card_color: '#16213e',
        button_style: 'rounded',
        font_family: 'Arial',
        layout: 'modern',
        counter_size: '120px',
        counter_color: '#e94560',
        screen_background: '#0f3460',
        theme: 'dark'
      });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    const allowedFields = [
      'header_text', 'subtitle_text', 'footer_text', 'footer_enabled',
      'header_font_size', 'header_font_style', 'header_color',
      'background_color', 'text_color', 'card_color', 'button_style',
      'font_family', 'layout', 'counter_size', 'counter_color',
      'screen_background', 'theme'
    ];

    let query = 'UPDATE settings SET ';
    let params = [];
    let updates_list = [];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updates_list.push(`${field} = ?`);
        params.push(updates[field]);
      }
    }

    if (updates_list.length === 0 && !req.file) {
      return res.status(400).json({ message: 'No fields to update.' });
    }

    if (updates_list.length > 0) {
      query += updates_list.join(', ') + ' WHERE id = 1';
      await db.query(query, params);
    }

    await logAudit(req.user.id, 'Updated settings');

    res.json({ message: 'Settings updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const logoPath = req.file.filename;

    const [existing] = await db.query('SELECT logo FROM settings WHERE id = 1');
    if (existing.length > 0 && existing[0].logo) {
      const oldPath = path.join(__dirname, '../uploads/', existing[0].logo);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await db.query('UPDATE settings SET logo = ? WHERE id = 1', [logoPath]);
    await logAudit(req.user.id, 'Uploaded logo');

    res.json({ message: 'Logo uploaded successfully.', logo: logoPath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.removeLogo = async (req, res) => {
  try {
    const [existing] = await db.query('SELECT logo FROM settings WHERE id = 1');
    if (existing.length > 0 && existing[0].logo) {
      const oldPath = path.join(__dirname, '../uploads/', existing[0].logo);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    await db.query('UPDATE settings SET logo = NULL WHERE id = 1');
    await logAudit(req.user.id, 'Removed logo');
    res.json({ message: 'Logo removed successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    let query = `SELECT a.*, u.full_name as user_name 
                 FROM audit_logs a 
                 LEFT JOIN users u ON a.user_id = u.id 
                 ORDER BY a.created_at DESC LIMIT 100`;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};
