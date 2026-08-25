import { getDatabasePool, sql } from '../../config/database.js';

const mapRow = (row) => row && ({
  id: row.PaymentId,
  userId: row.UserId,
  amount: Number(row.Amount),
  provider: row.Provider,
  providerReference: row.ProviderReference,
  status: row.Status,
  createdAt: row.CreatedAt,
  updatedAt: row.UpdatedAt,
});

export const paymentsRepository = {
  async findAllByUser(userId) {
    const pool = await getDatabasePool();
    const result = await pool.request()
      .input('userId', sql.Int, Number(userId))
      .query('SELECT * FROM dbo.Payments WHERE UserId = @userId ORDER BY CreatedAt DESC');
    return result.recordset.map(mapRow);
  },

  async findById(id) {
    const pool = await getDatabasePool();
    const result = await pool.request()
      .input('id', sql.BigInt, Number(id))
      .query('SELECT * FROM dbo.Payments WHERE PaymentId = @id');
    return mapRow(result.recordset[0]);
  },

  async create(userId, { amount, provider, providerReference }) {
    const pool = await getDatabasePool();
    const result = await pool.request()
      .input('userId', sql.Int, Number(userId))
      .input('amount', sql.Decimal(12, 4), amount)
      .input('provider', sql.VarChar(40), provider)
      .input('providerReference', sql.NVarChar(160), providerReference || null)
      .query(`
        INSERT INTO dbo.Payments (UserId, Amount, Provider, ProviderReference, Status)
        OUTPUT INSERTED.PaymentId
        VALUES (@userId, @amount, @provider, @providerReference, 'Pending')
      `);
    return this.findById(result.recordset[0].PaymentId);
  },

  async updateStatus(id, status) {
    const pool = await getDatabasePool();
    const validStatuses = ['Pending', 'Approved', 'Rejected', 'Refunded'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }
    await pool.request()
      .input('id', sql.BigInt, Number(id))
      .input('status', sql.VarChar(20), status)
      .query('UPDATE dbo.Payments SET Status = @status, UpdatedAt = SYSUTCDATETIME() WHERE PaymentId = @id');
    return this.findById(id);
  },
};