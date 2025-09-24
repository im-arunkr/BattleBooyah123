const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
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
    password: {
        type: String,
        required: true,
    },
    points: {
      type: Number,
      required: true,
      default: 0,
    },
    role: {
      type: String,
      default: 'user',
    },
    // Keep the password reset fields if you are using them
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);