const app = require('../backend/app');
const seedDatabase = require('../backend/config/seed');

let seeded = false;

const handler = async (req, res) => {
  if (!seeded) {
    seeded = true;
    try {
      const db = require('../backend/config/database');
      await db.query('SELECT 1');
      await seedDatabase();
    } catch (err) {
      console.error('Seed error:', err.message);
    }
  }
  app(req, res);
};

module.exports = handler;
