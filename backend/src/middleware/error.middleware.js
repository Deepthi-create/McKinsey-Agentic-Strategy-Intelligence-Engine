export function notFound(req, res, next) {
  next(Object.assign(new Error(`Route not found: ${req.method} ${req.originalUrl}`), { status: 404 }));
}

export function errorHandler(err, _req, res, _next) {
  const status = err.status || err.statusCode || 500;
  if (err.retryAfterSeconds) res.setHeader("Retry-After", String(Math.ceil(err.retryAfterSeconds)));
  res.status(status).json({
    error: err.name || "ApplicationError",
    message: err.message || "Unexpected server error",
    details: err.details,
    retryAfterSeconds: err.retryAfterSeconds
  });
}
