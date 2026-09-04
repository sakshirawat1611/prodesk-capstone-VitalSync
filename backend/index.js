// bring in the tools
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authMiddleware = require('./middleware/authMiddleware');
require('dotenv').config(); // read secrets from .env
const appointmentRoutes = require('./routes/appointments');


const authRoutes = require('./routes/auth'); // get auth routes

const app = express(); // create the server

app.use(cors()); // allow React to talk to thiss server
app.use(express.json()); // understand json data sent to us

app.use('/api/auth', authRoutes); // send /api/auth/* requests to auth.js
app.use('/api/appointments', appointmentRoutes);
app.get('/api/profile', authMiddleware, async (req, res) => {
  const User = require('./models/User');
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
});

//connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

//start listening for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));