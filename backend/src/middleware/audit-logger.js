import { getDatabasePool, sql } from '../config/database.js';

export async function auditLog(req, res, next) {
  const start = Date.now();
  const originalSend = res.send;

  res.send = function (body) {
    const duration = Date.now() - start;
    const userId = req.user?.id || null;
    const action = `${req.method} ${req.path}`;
    const statusCode = res.statusCode;
    const requestId = req.requestId;

    if (req.path === '/health' || req.path.startsWith('/api/v1/auth/refresh') || req.path.startsWith('/api/auth/refresh')) {
      return originalSend.call(this, body);
    }

    setImmediate(async () => {
      try {
        const pool = await getDatabasePool();
        await pool.request()
          .input('userId', sql.Int, userId)
          .input('action', sql.VarChar(80), action)
          .input('entityName', sql.VarChar(80), req.path.split('/')[3] || null)
          .input('entityId', sql.NVarChar(80), req.params.id || null)
          .input('details', sql.NVarChar(sql.MAX), JSON.stringify({
            method: req.method,
            path: req.path,
            statusCode,
            duration,
            query: req.query,
            bodyKeys: req.body ? Object.keys(req.body) : [],
          }))
          .input('requestId', sql.VarChar(80), requestId)
          .query(`
            INSERT INTO dbo.AuditLogs (UserId, Action, EntityName, EntityId, Details, RequestId)
            VALUES (@userId, @action, @entityName, @entityId, @details, @requestId)
          `);
      } catch {
      }
    });

    return originalSend.call(this, body);
  };

  next();
}