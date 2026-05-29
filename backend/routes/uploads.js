const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/:filename', (req, res) => {
  if (process.env.VERCEL) {
    return res.status(400).json({ message: 'File uploads not supported on serverless. Use local deployment.' });
  }
  const filePath = path.join(__dirname, '../uploads/', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: 'File not found.' });
  }
});

module.exports = router;
