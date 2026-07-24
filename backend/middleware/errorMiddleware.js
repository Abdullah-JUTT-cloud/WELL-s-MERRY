// Catches requests to routes that don't exist
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Centralized error handler — every `throw new Error(...)` in controllers
// (wrapped by express-async-handler) ends up here as clean JSON.
export const errorHandler = (err, req, res, next) => {
  // If a controller set res.status(...) before throwing, keep it.
  // Otherwise, default to 500 (unless Express already flagged 200, which means
  // the error came from somewhere that never set a status).
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose bad ObjectId (e.g. malformed :id in a route param)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }

  // Mongoose duplicate key error (e.g. email already registered)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = `${field ? field.charAt(0).toUpperCase() + field.slice(1) : "Field"} already in use`;
  }

  // Mongoose validation error (schema `required`, `match`, etc.)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};