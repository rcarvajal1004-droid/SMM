export function validateOrder(req, res, next) {
  const { serviceId, serviceName, link, quantity, charge } = req.body || {};
  const errors = [];

  if (!Number.isInteger(serviceId) || serviceId <= 0) errors.push('serviceId must be a positive integer');
  if (typeof serviceName !== 'string' || serviceName.trim().length < 2) errors.push('serviceName is required');
  try {
    const parsedUrl = new URL(link);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) errors.push('link must use http or https');
  } catch {
    errors.push('link must be a valid URL');
  }
  if (!Number.isInteger(quantity) || quantity <= 0) errors.push('quantity must be a positive integer');
  if (typeof charge !== 'number' || !Number.isFinite(charge) || charge < 0) errors.push('charge must be a valid non-negative number');

  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors, requestId: req.requestId });
  next();
}

export function validateBalance(req, res, next) {
  const amount = Number(req.body?.amount);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 100000) {
    return res.status(400).json({ error: 'amount must be between 0 and 100000', requestId: req.requestId });
  }
  req.body.amount = amount;
  next();
}