import { getDatabasePool, sql } from '../../config/database.js';

const mapRow = (row) => row && ({
  id: row.QuoteId,
  userId: row.UserId,
  serviceType: row.ServiceType,
  propertyType: row.PropertyType,
  squareFootage: row.SquareFootage,
  equipmentBrand: row.EquipmentBrand,
  efficiencyRating: row.EfficiencyRating,
  estimatedCost: Number(row.EstimatedCost),
  status: row.Status,
  details: row.Details ? JSON.parse(row.Details) : null,
  createdAt: row.CreatedAt,
  updatedAt: row.UpdatedAt,
});

export const quotesRepository = {
  async findAllByUser(userId) {
    const pool = await getDatabasePool();
    const result = await pool.request()
      .input('userId', sql.Int, Number(userId))
      .query('SELECT * FROM dbo.Quotes WHERE UserId = @userId ORDER BY CreatedAt DESC');
    return result.recordset.map(mapRow);
  },

  async findById(id) {
    const pool = await getDatabasePool();
    const result = await pool.request()
      .input('id', sql.BigInt, Number(id))
      .query('SELECT * FROM dbo.Quotes WHERE QuoteId = @id');
    return mapRow(result.recordset[0]);
  },

  async create(userId, data) {
    const pool = await getDatabasePool();
    const result = await pool.request()
      .input('userId', sql.Int, Number(userId))
      .input('serviceType', sql.VarChar(40), data.serviceType)
      .input('propertyType', sql.VarChar(40), data.propertyType)
      .input('squareFootage', sql.Int, data.squareFootage)
      .input('equipmentBrand', sql.VarChar(80), data.equipmentBrand || null)
      .input('efficiencyRating', sql.VarChar(20), data.efficiencyRating || null)
      .input('estimatedCost', sql.Decimal(12, 2), data.estimatedCost)
      .input('details', sql.NVarChar(sql.MAX), JSON.stringify(data.details || {}))
      .query(`
        INSERT INTO dbo.Quotes (UserId, ServiceType, PropertyType, SquareFootage, EquipmentBrand, EfficiencyRating, EstimatedCost, Details, Status)
        OUTPUT INSERTED.QuoteId
        VALUES (@userId, @serviceType, @propertyType, @squareFootage, @equipmentBrand, @efficiencyRating, @estimatedCost, @details, 'Draft')
      `);
    return this.findById(result.recordset[0].QuoteId);
  },

  async updateStatus(id, status) {
    const pool = await getDatabasePool();
    const validStatuses = ['Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }
    await pool.request()
      .input('id', sql.BigInt, Number(id))
      .input('status', sql.VarChar(20), status)
      .query('UPDATE dbo.Quotes SET Status = @status, UpdatedAt = SYSUTCDATETIME() WHERE QuoteId = @id');
    return this.findById(id);
  },
};