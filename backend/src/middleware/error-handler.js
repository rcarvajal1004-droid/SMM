export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
};

export function notFound(req, res) {
  res.status(404).json({
    error: 'Not found',
    code: ERROR_CODES.NOT_FOUND,
    requestId: req.requestId,
  });
}

export function errorHandler(error, req, res, _next) {
  console.error(`[${req.requestId}]`, error);
  const status = Number.isInteger(error.statusCode) ? error.statusCode : 500;

  let code = ERROR_CODES.INTERNAL_ERROR;
  if (status === 400) code = ERROR_CODES.VALIDATION_ERROR;
  else if (status === 401) code = ERROR_CODES.UNAUTHORIZED;
  else if (status === 403) code = ERROR_CODES.FORBIDDEN;
  else if (status === 404) code = ERROR_CODES.NOT_FOUND;
  else if (status === 409) code = ERROR_CODES.CONFLICT;
  else if (status === 429) code = ERROR_CODES.RATE_LIMITED;

  if (error.message === 'Insufficient balance') {
    code = ERROR_CODES.INSUFFICIENT_BALANCE;
  }

  res.status(status).json({
    error: status >= 500 ? 'Internal server error' : error.message,
    code,
    requestId: req.requestId,
  });
}