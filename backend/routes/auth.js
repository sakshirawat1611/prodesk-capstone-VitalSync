const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res) => {
  try {
    //grab what the user typed into the form
    const { name, email, password } = req.body;

    // check if this email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // scramble the password (salt + hash)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // build the new user record, using the SCRAMBLED password
    // role is always hardcoded to 'patient' here — doctors are pre-seeded
    // manually and never self-register through this route
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'patient',
    });

    //  save it to MongoDB
    await newUser.save();

    // tell the frontend it worked
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    // something broke — send a clean error instead of crashing
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    // grab what they typed
    const { email, password } = req.body;

    // find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // check if typed password matches the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // both checks passed — login works
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;