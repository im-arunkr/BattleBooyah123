// middleware/errorMiddleware.js

// Handles requests to routes that do not exist (404)
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// A general error handler that catches all errors
const errorHandler = (err, req, res, next) => {
  // Sometimes an error might come with a 200 status code, we default to 500 in that case
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    // Show the error stack only if we are not in production for security reasons
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };