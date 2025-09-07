// Package imports
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// File imports
const connectDB = require('./config/db');

// Environment variables setup
dotenv.config();

// Connect to Database
connectDB();

// Initialize express app
const app = express();

// ==========================================================
// START: CORRECT CORS SETUP
// ==========================================================
const corsOptions = {
    origin: process.env.CORS_ORIGIN, // This reads the variable from Render
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
};

app.use(cors(corsOptions)); // Use the options here
// ==========================================================
// END: CORRECT CORS SETUP
// ==========================================================


// Middlewares
app.use(express.json()); // To accept JSON data in the body

// Define Routes
app.use('/api/admin', require('./routes/adminRoutes'));

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server port ${PORT} par chal raha hai`));