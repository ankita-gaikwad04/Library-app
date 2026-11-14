const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { pipeline } = require('@huggingface/transformers'); // <-- USING HUGGINGFACE

let extractor = null;

// GET all books
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books ORDER BY book_id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST a new book
router.post('/', async (req, res) => {
  try {
    const { book_name, author, quantity } = req.body;

    const newBook = await pool.query(
      `INSERT INTO books (book_name, author, quantity) 
       VALUES ($1, $2, $3) RETURNING *`,
      [book_name, author, quantity]
    );

    res.status(201).json(newBook.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE a book by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleteBook = await pool.query(
      'DELETE FROM books WHERE book_id = $1 RETURNING *', 
      [id]
    );

    if (deleteBook.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE a book by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { book_name, author, quantity } = req.body;

    const updateBook = await pool.query(
      `UPDATE books 
       SET book_name = $1, author = $2, quantity = $3 
       WHERE book_id = $4 RETURNING *`,
      [book_name, author, quantity, id]
    );

    if (updateBook.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ message: 'Book updated successfully', data: updateBook.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// RAG Search Route
router.post('/rag-search', async (req, res) => {
  const { query } = req.body;
  try {
    // Load model if not already loaded
    if (!extractor) {
      console.log("⏳ Loading AI model...");
      extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      console.log("✅ AI Model Loaded");
    }

    // 1. Convert the user's question into a vector
    const output = await extractor(query, { pooling: 'mean', normalize: true });
    const queryEmbedding = `[${Array.from(output.data).join(',')}]`;

    // 2. Search the database using cosine distance (<=>)
    const result = await pool.query(
      `SELECT book_id, book_name, author, description, quantity,
              (embedding <=> $1) AS distance
       FROM books
       WHERE embedding IS NOT NULL
       ORDER BY distance ASC
       LIMIT 3`,
      [queryEmbedding]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("RAG Error:", err);
    res.status(500).json({ error: 'RAG search failed' });
  }
});

module.exports = router;