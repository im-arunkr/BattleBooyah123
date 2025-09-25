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
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const contestRoutes = require('./routes/contestRoutes');
const voteRoutes = require('./routes/voteRoutes');


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
app.use(helmet());       // Use helmet to set security headers

// CORS Setup
const allowedOrigins = [
    'http://localhost:3000',
    'https://battle-booyah123.vercel.app', // <-- YEH LINE ADD KI GAYI HAI
    process.env.CORS_ORIGIN
];
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
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
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/votes', voteRoutes);


// ==========================================================
// Production Deployment Setup
// ==========================================================
if (process.env.NODE_ENV === 'production') {
    const buildPath = path.join(__dirname, '/client/build');
    app.use(express.static(buildPath));

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(buildPath, 'index.html'))
    );
} else {
    app.get('/', (req, res) => {
        res.send('API is running... (Development Mode)');
    });
}

// ==========================================================
// Custom Error Handling
// ==========================================================
app.use(notFound);
app.use(errorHandler);

// ==========================================================
// Start Server
// ==========================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
));