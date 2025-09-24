const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // .env file se MONGO_URI variable ko yahan access kar rahe hain
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB se सफलतापूर्वक connect ho gaya`);
  } catch (error) {
    console.error(`Database connection me error: ${error.message}`);
    // Agar database se connect nahi hua to server ko band kar do
    process.exit(1);
  }
};

module.exports = connectDB;

