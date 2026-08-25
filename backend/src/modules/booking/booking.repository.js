import { getDatabasePool, sql } from '../../config/database.js';

const mapRow = (row) => row && ({
  id: row.BookingId,
  userId: row.UserId,
  serviceType: row.ServiceType,
  address: row.Address,
  preferredDate: row.PreferredDate,
  preferredTime: row.PreferredTime,
  status: row.Status,
  notes: row.Notes,
  createdAt: row.CreatedAt,
  updatedAt: row.UpdatedAt,
});

export const bookingRepository = {
  async findAllByUser(userId) {
    const pool = await getDatabasePool();
    const result = await pool.request()
      .input('userId', sql.Int, Number(userId))
      .query('SELECT * FROM dbo.Bookings WHERE UserId = @userId ORDER BY CreatedAt DESC');
    return result.recordset.map(mapRow);
  },

  async findById(id) {
    const pool = await getDatabasePool();
    const result = await pool.request()
      .input('id', sql.BigInt, Number(id))
      .query('SELECT * FROM dbo.Bookings WHERE BookingId = @id');
    return mapRow(result.recordset[0]);
  },

  async create(userId, data) {
    const pool = await getDatabasePool();
    const result = await pool.request()
      .input('userId', sql.Int, Number(userId))
      .input('serviceType', sql.VarChar(40), data.serviceType)
      .input('address', sql.NVarChar(500), data.address)
      .input('preferredDate', sql.Date, data.preferredDate)
      .input('preferredTime', sql.VarChar(10), data.preferredTime)
      .input('notes', sql.NVarChar(1000), data.notes || null)
      .query(`
        INSERT INTO dbo.Bookings (UserId, ServiceType, Address, PreferredDate, PreferredTime, Notes, Status)
        OUTPUT INSERTED.BookingId
        VALUES (@userId, @serviceType, @address, @preferredDate, @preferredTime, @notes, 'Pending')
      `);
    return this.findById(result.recordset[0].BookingId);
  },

  async updateStatus(id, status) {
    const pool = await getDatabasePool();
    const validStatuses = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }
    await pool.request()
      .input('id', sql.BigInt, Number(id))
      .input('status', sql.VarChar(20), status)
      .query('UPDATE dbo.Bookings SET Status = @status, UpdatedAt = SYSUTCDATETIME() WHERE BookingId = @id');
    return this.findById(id);
  },

  async cancel(id) {
    return this.updateStatus(id, 'Cancelled');
  },
};