const mongoose = require('mongoose');

const adminSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // --- NEW FIELDS ADDED ---
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'] // Basic email validation
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
    },
    // --- END OF NEW FIELDS ---
    role: {
      type: String,
      default: 'admin',
    },
    // Fields for password reset
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Admin', adminSchema);
