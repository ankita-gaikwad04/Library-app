require('dotenv').config();
const { pipeline } = require('@huggingface/transformers');
const pool = require('../config/db');

async function generateEmbeddings() {
  console.log("⏳ Loading local AI model (this may take a minute)...");
  
  // Load the model (all-MiniLM-L6-v2 is small, fast, and outputs 384 dimensions)
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  console.log("✅ Model loaded!");

  try {
    // Get books that don't have embeddings yet
    const res = await pool.query('SELECT book_id, book_name, author, description FROM books WHERE embedding IS NULL');
    const books = res.rows;

    if (books.length === 0) {
      console.log("All books already have embeddings!");
      process.exit();
    }

    for (const book of books) {
      // Combine book info into one searchable string
      const textToEmbed = `Title: ${book.book_name}. Author: ${book.author}. Description: ${book.description || 'No description'}`;
      
      // Generate the vector
      const output = await extractor(textToEmbed, { pooling: 'mean', normalize: true });
      const embedding = Array.from(output.data); // Convert to standard array

      // Save to Supabase (format as a string for the vector type)
      await pool.query(
        'UPDATE books SET embedding = $1 WHERE book_id = $2',
        [`[${embedding.join(',')}]`, book.book_id]
      );

      console.log(`✨ Embedded: ${book.book_name}`);
    }

    console.log("🎉 All books processed successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

generateEmbeddings();