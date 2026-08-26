// bring in the Mongoose toolbox
const mongoose = require('mongoose');

//define the blueprint for what a "user" document must contain
const userSchema = new mongoose.Schema({
  name: {
    type: String,      // must be text(example: "John Doe")
    required: true,    // cannot be left blank
  },
  email: {
    type: String,
    required: true,
    unique: true,       // no two users can share this same email
  },
  password: {
    type: String,
    required: true,     // this will hold the HASHED password, never the real one
  },
});

//  turn the blueprint into a real, usable Model named "User",
// and make it available to other files (like auth.js) that need it
module.exports = mongoose.model('User', userSchema);