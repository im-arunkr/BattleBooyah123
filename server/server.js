// server.js

// Package imports
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet'); // For security headers
const morgan = require('morgan'); // For request logging
const path = require('path'); // Core Node.js module

// File imports
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// ==========================================================
// Initial Setup
// ==========================================================
dotenv.config();
connectDB();
const app = express();

// ==========================================================
// Core Middlewares
// ==========================================================
app.use(express.json()); // To accept JSON data in the body
app.use(helmet());       // Use helmet to set security headers

// CORS Setup (your existing setup is great)
const allowedOrigins = [
    'http://localhost:3000',
    process.env.CORS_ORIGIN
];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
};
app.use(cors(corsOptions));

// Use morgan for logging only in development mode
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// ==========================================================
// API Routes
// ==========================================================

// A simple root route to check if the API is running
app.get('/api', (req, res) => {
  res.send('API is running successfully.');
});

// Your application's routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/contests', require('./routes/contestRoutes'));


// ==========================================================
// Production Deployment Setup
// ==========================================================
// This section will serve the frontend's static files (the 'build' folder)
// when the application is in production mode.
if (process.env.NODE_ENV === 'production') {
    // This assumes your frontend is in a 'client' folder. Adjust if necessary.
    const buildPath = path.join(__dirname, '/client/build');
    app.use(express.static(buildPath));

    // For any route that is not an API route, send the frontend's index.html
    app.get('*', (req, res) =>
        res.sendFile(path.resolve(buildPath, 'index.html'))
    );
} else {
    // A simple root route for development
    app.get('/', (req, res) => {
        res.send('API is running... (Development Mode)');
    });
}

// ==========================================================
// Custom Error Handling
// ==========================================================
// These must be the LAST app.use() calls
app.use(notFound);
app.use(errorHandler);

// ==========================================================
// Start Server
// ==========================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
));