export function requestLogger(req, res, next) {
  const startedAt = Date.now();
  res.on('finish', () => {
    console.log(JSON.stringify({
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - startedAt
    }));
  });
  next();
}
