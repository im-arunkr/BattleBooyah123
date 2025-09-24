const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
  {
    // Kis user se related hai
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // 'User' model se link karein
    },
    userIdString: { // UserID ko string me bhi save karein, search me aasani ke liye
        type: String,
        required: true,
    },
    // Transaction ka prakar (type)
    type: {
      type: String,
      required: true,
      enum: ['credit', 'debit'], // Sirf ye do values ho sakti hain
    },
    // Kitne points ka transaction hua
    amount: {
      type: Number,
      required: true,
    },
    // Transaction ke baad user ka naya balance
    closingBalance: {
        type: Number,
        required: true,
    },
    // Transaction ka vivaran (description)
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // CreatedAt aur UpdatedAt timestamps
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
