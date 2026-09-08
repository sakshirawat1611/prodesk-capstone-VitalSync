const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { z } = require('zod');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const suggestSchema = z.object({
  text: z.string().min(1),
});

router.post('/suggest', authMiddleware, async (req, res) => {
  try {
    const result = suggestSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    const { text } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });

    const prompt = `Rewrite the following text to sound more professional. Respond with ONLY the rewritten text, no explanation, no markdown: "${text}"`;

    const aiResult = await model.generateContent(prompt);
    const rewritten = aiResult.response.text();

    res.status(200).json({ rewritten });
  } catch (error) {
    res.status(500).json({ message: 'AI error', error: error.message });
  }
});

module.exports = router;