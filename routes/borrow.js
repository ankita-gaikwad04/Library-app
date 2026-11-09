const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Issue a book
router.post('/issue', async (req, res) => {
  const { book_id, member_id } = req.body;
  try {
    // 1. Check if book is available
    const book = await pool.query('SELECT quantity FROM books WHERE book_id = $1', [book_id]);
    if (book.rows[0].quantity <= 0) return res.status(400).json({ error: 'Out of stock' });

    // 2. Add to issued_books (Set return date to 14 days from now)
    const issue = await pool.query(
      "INSERT INTO issued_books (book_id, member_id, return_date) VALUES ($1, $2, CURRENT_DATE + INTERVAL '14 days') RETURNING *",
      [book_id, member_id]
    );

    // 3. Reduce book quantity
    await pool.query('UPDATE books SET quantity = quantity - 1 WHERE book_id = $1', [book_id]);

    res.status(201).json({ message: 'Issued successfully', data: issue.rows[0] });
  } catch (err) { 
    console.error(err);
    res.status(500).json({ error: 'Server error' }); 
  }
});

// Get all ACTIVE issues (For the Dashboard & Issue Tab)
router.get('/active', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.issue_id, i.return_date, b.book_name, m.name as member_name 
      FROM issued_books i
      JOIN books b ON i.book_id = b.book_id
      JOIN members m ON i.member_id = m.member_id
      WHERE i.return_date >= CURRENT_DATE
    `);
    res.json(result.rows);
  } catch (err) { 
    console.error(err);
    res.status(500).json({ error: 'Server error' }); 
  }
});

// Return a book
router.post('/return/:issue_id', async (req, res) => {
  const { issue_id } = req.params;
  try {
    // 1. Get the issue record
    const issue = await pool.query('SELECT book_id FROM issued_books WHERE issue_id = $1', [issue_id]);
    
    // 2. Update return_date to today
    await pool.query('UPDATE issued_books SET return_date = CURRENT_DATE WHERE issue_id = $1', [issue_id]);

    // 3. Increase book quantity
    await pool.query('UPDATE books SET quantity = quantity + 1 WHERE book_id = $1', [issue.rows[0].book_id]);

    res.json({ message: 'Returned successfully' });
  } catch (err) { 
    console.error(err);
    res.status(500).json({ error: 'Server error' }); 
  }
});
// --- USER: Request a book ---
router.post('/request', async (req, res) => {
  const { book_id, member_id } = req.body;
  try {
    await pool.query(
      'INSERT INTO book_requests (book_id, member_id) VALUES ($1, $2)',
      [book_id, member_id]
    );
    res.json({ message: 'Request sent to admin' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// --- ADMIN: Get all pending requests ---
router.get('/requests', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.request_id, b.book_name, m.name as member_name, m.member_id, r.book_id
      FROM book_requests r
      JOIN books b ON r.book_id = b.book_id
      JOIN members m ON r.member_id = m.member_id
      WHERE r.status = 'pending'
    `);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// --- ADMIN: Approve/Reject request ---
router.post('/request/:id', async (req, res) => {
  const { id } = req.params;
  const { action, book_id, member_id } = req.body; // action = 'approve' or 'reject'

  try {
    if (action === 'approve') {
      // 1. Issue the book
      await pool.query(
        "INSERT INTO issued_books (book_id, member_id, return_date) VALUES ($1, $2, CURRENT_DATE + INTERVAL '14 days')",
        [book_id, member_id]
      );
      // 2. Reduce stock
      await pool.query('UPDATE books SET quantity = quantity - 1 WHERE book_id = $1', [book_id]);
      // 3. Mark request as approved
      await pool.query("UPDATE book_requests SET status = 'approved' WHERE request_id = $1", [id]);
    } else {
      // Reject just updates the status
      await pool.query("UPDATE book_requests SET status = 'rejected' WHERE request_id = $1", [id]);
    }
    res.json({ message: 'Request handled' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});
// --- USER: Get my requests and their status ---
router.get('/my-requests/:member_id', async (req, res) => {
  const { member_id } = req.params;
  try {
    const result = await pool.query(`
      SELECT r.request_id, b.book_name, r.status, r.request_date
      FROM book_requests r
      JOIN books b ON r.book_id = b.book_id
      WHERE r.member_id = $1
      ORDER BY r.request_id DESC
    `, [member_id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});
module.exports = router;