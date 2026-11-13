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
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://library-app-a7q5.onrender.com']
}));
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

const PORT = process.env.PORT || 3000; // Use Render's PORT, fallback to 3000 locally
app.listen(PORT, '0.0.0.0', () => {   // Explicitly bind to 0.0.0.0
  console.log(`🚀 Server running on port ${PORT}`);
});