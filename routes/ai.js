require('dotenv').config();

const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 1. AI Book Summary
router.post('/summarize', async (req, res) => {
  const { title, author } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash', // <--- UPDATED MODEL
      contents: `Write a short, 2-sentence summary of the book "${title}" by ${author}. Be engaging.`,
    });
    res.json({ summary: response.text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// 2. AI Smart Search
router.post('/search', async (req, res) => {
  const { query } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash', // <--- UPDATED MODEL
      contents: `Extract the key search keywords from this sentence: "${query}". Only reply with the keywords separated by spaces. Do not include any other text.`,
    });
    res.json({ keywords: response.text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;