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
  // Otherwise fall back to whatever the error itself declares (body-parser
  // sets 400 on malformed JSON, http-errors carries its own status) and only
  // then to 500. Without the err.status branch a syntax error in the request
  // body — the client's mistake — was reported as a server error.
  let statusCode =
    res.statusCode === 200 ? err.status || err.statusCode || 500 : res.statusCode;
  let message = err.message;

  // Multer's upload errors (oversized receipt, too many review images) are
  // client mistakes too, and they arrive with no status at all.
  if (err.name === "MulterError") {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "That file is too large. Please upload an image under 5MB.";
    } else {
      message = err.message || "There was a problem with the uploaded file.";
    }
  }

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