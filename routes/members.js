const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all members
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM members ORDER BY member_id ASC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// Add a member
router.post('/', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const newMember = await pool.query(
      'INSERT INTO members (name, email, phone) VALUES ($1, $2, $3) RETURNING *',
      [name, email, phone]
    );
    res.status(201).json(newMember.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});
// --- LOGIN: Find a member by email ---
router.post('/login', async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query('SELECT * FROM members WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found. Please register first.' });
    }
    
    // Return the member details (like an ID card)
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;