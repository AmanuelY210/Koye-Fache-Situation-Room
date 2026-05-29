const bcrypt = require('bcryptjs');
const db = require('./database');

const seedDatabase = async () => {
  try {
    const [rows] = await db.query('SELECT id FROM users WHERE username = ?', ['admin']);
    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.query(
        'INSERT INTO users (full_name, username, email, phone, password, role, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['Super Admin', 'admin', 'admin@example.com', '1234567890', hashedPassword, 'super_admin', 'approved']
      );
      console.log('Default admin account created (admin / admin123)');
    }

    const [settings] = await db.query('SELECT id FROM settings WHERE id = 1');
    if (settings.length === 0) {
      await db.query(
        'INSERT INTO settings (id, header_text, subtitle_text, footer_text, theme, background_color, text_color, card_color, header_color, header_font_size, counter_color, screen_background, countdown_enabled, countdown_title, countdown_target_date, phone1, phone2) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, DATE_ADD(NOW(), INTERVAL 30 DAY), ?, ?)',
        ['KOYE FACHE PROSPERITY PARTY', 'LIVE ELECTORS COUNT', 'Developed By Amanuel ICT Solution', 'light', '#ffffff', '#1a1a2e', '#f8f9fa', '#e94560', '42px', '#e94560', '#ffffff', 'Days Left', '09-84-19-40-54', '09-40-96-77-77']
      );
    } else {
      await db.query(
        'UPDATE settings SET header_text = ?, subtitle_text = ?, footer_text = ?, theme = ?, background_color = ?, text_color = ?, card_color = ?, header_color = ?, counter_color = ?, screen_background = ?, countdown_title = ?, phone1 = ?, phone2 = ? WHERE id = 1',
        ['KOYE FACHE PROSPERITY PARTY', 'LIVE ELECTORS COUNT', 'Developed By Amanuel ICT Solution', 'light', '#ffffff', '#1a1a2e', '#f8f9fa', '#e94560', '#e94560', '#ffffff', 'Days Left', '09-84-19-40-54', '09-40-96-77-77']
      );
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

module.exports = seedDatabase;
