const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    // Admin ke liye username aur password
    username: {
      type: String,
      required: false, // Players ke liye zaroori nahi
      unique: true,
      sparse: true // [FIX] Yeh MongoDB ko batata hai ki null values ko unique index se bahar rakho
    },
    password: {
      type: String,
      required: function() { return this.role === 'admin'; } // Sirf admin ke liye zaroori
    },
    // Player ke liye UserID aur Mobile Number
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      default: 'user',
    },
    points: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);

