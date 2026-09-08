require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authMiddleware = require('./middleware/authMiddleware');
const appointmentRoutes = require('./routes/appointments');
const paymentRoutes = require('./routes/payments');
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per window
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
});

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth/login', limiter);
app.use('/api/ai/suggest', aiLimiter);
app.use('/api/payments', paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/ai', aiRoutes);
app.get('/api/profile', authMiddleware, async (req, res) => {
  const User = require('./models/User');
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));