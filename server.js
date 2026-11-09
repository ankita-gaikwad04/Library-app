require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');


// Import routes
const bookRoutes = require('./routes/books');
const memberRoutes = require('./routes/members'); 
const borrowRoutes = require('./routes/borrow'); 
const aiRoutes = require('./routes/ai');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Mount Routes (THIS IS WHAT YOU WERE MISSING)
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);   // <--- ADDED
app.use('/api/borrow', borrowRoutes); 
app.use('/api/ai', aiRoutes);   // <--- ADDED

// Base route to serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});