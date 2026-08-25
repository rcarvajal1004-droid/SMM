import { getDatabasePool, sql } from '../../config/database.js';

const mapRow = (row) => row && ({
  id: row.OrderId,
  userId: row.UserId,
  serviceId: row.ServiceId,
  serviceName: row.ServiceName,
  link: row.TargetUrl,
  quantity: row.Quantity,
  charge: Number(row.Charge),
  status: row.Status,
  createdAt: row.CreatedAt
});

export const ordersRepository = {
  async findAll(userId) {
    const pool = await getDatabasePool();
    const result = await pool.request()
      .input('userId', sql.Int, Number(userId))
      .query(`
        SELECT o.OrderId, o.UserId, o.ServiceId, s.Name AS ServiceName,
               o.TargetUrl, o.Quantity, o.Charge, o.Status, o.CreatedAt
        FROM dbo.Orders o
        INNER JOIN dbo.Services s ON s.ServiceId = o.ServiceId
        WHERE o.UserId = @userId
        ORDER BY o.CreatedAt DESC
      `);
    return result.recordset.map(mapRow);
  },

  async findById(orderId) {
    const pool = await getDatabasePool();
    const result = await pool.request()
      .input('id', sql.BigInt, Number(orderId))
      .query(`
        SELECT o.OrderId, o.UserId, o.ServiceId, s.Name AS ServiceName,
               o.TargetUrl, o.Quantity, o.Charge, o.Status, o.CreatedAt
        FROM dbo.Orders o
        INNER JOIN dbo.Services s ON s.ServiceId = o.ServiceId
        WHERE o.OrderId = @id
      `);
    return mapRow(result.recordset[0]);
  },

  async create(userId, { serviceId, link, quantity, charge }) {
    const pool = await getDatabasePool();
    const result = await pool.request()
      .input('userId', sql.Int, Number(userId))
      .input('serviceId', sql.Int, Number(serviceId))
      .input('link', sql.NVarChar(2048), link)
      .input('quantity', sql.Int, Number(quantity))
      .input('charge', sql.Decimal(12, 4), charge)
      .query(`
        INSERT INTO dbo.Orders (UserId, ServiceId, TargetUrl, Quantity, Charge, Status)
        OUTPUT INSERTED.OrderId
        VALUES (@userId, @serviceId, @link, @quantity, @charge, 'Pending')
      `);
    const orderId = result.recordset[0].OrderId;

    const withService = await pool.request()
      .input('id', sql.BigInt, orderId)
      .query(`
        SELECT o.OrderId, o.UserId, o.ServiceId, s.Name AS ServiceName,
               o.TargetUrl, o.Quantity, o.Charge, o.Status, o.CreatedAt
        FROM dbo.Orders o
        INNER JOIN dbo.Services s ON s.ServiceId = o.ServiceId
        WHERE o.OrderId = @id
      `);
    return mapRow(withService.recordset[0]);
  },

  async updateStatus(orderId, status) {
    const pool = await getDatabasePool();
    const validStatuses = ['Pending', 'In progress', 'Completed', 'Canceled', 'Failed'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }
    await pool.request()
      .input('id', sql.BigInt, Number(orderId))
      .input('status', sql.VarChar(20), status)
      .query('UPDATE dbo.Orders SET Status = @status, UpdatedAt = SYSUTCDATETIME() WHERE OrderId = @id');
  }
};