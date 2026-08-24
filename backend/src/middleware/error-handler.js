export function notFound(req, res) {
  res.status(404).json({
    error: 'Not found',
    requestId: req.requestId
  });
}

export function errorHandler(error, req, res, _next) {
  console.error(`[${req.requestId}]`, error);
  const status = Number.isInteger(error.statusCode) ? error.statusCode : 500;
  res.status(status).json({
    error: status >= 500 ? 'Internal server error' : error.message,
    requestId: req.requestId
  });
}