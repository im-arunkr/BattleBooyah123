// Package imports
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // cors को import करें

// File imports
const connectDB = require('./config/db');

// Environment variables setup
dotenv.config();

// Connect to Database
connectDB();

// Initialize express app
const app = express();

// Middlewares
app.use(cors()); // <-- YAHAN CORS KO ENABLE KAREIN
app.use(express.json()); // To accept JSON data in the body

// Define Routes
app.use('/api/admin', require('./routes/adminRoutes'));

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server port ${PORT} par chal raha hai`));

