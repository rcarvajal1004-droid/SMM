import { getDatabasePool, sql } from '../../config/database.js';

const mapRow = (row) => row && ({
  id: row.ServiceId,
  name: row.Name,
  category: row.Category,
  ratePer1000: Number(row.RatePerThousand),
  min: row.MinimumQuantity,
  max: row.MaximumQuantity,
  description: row.Description
});

export const servicesRepository = {
  async findAll() {
    const pool = await getDatabasePool();
    const result = await pool.request()
      .query('SELECT * FROM dbo.Services WHERE IsActive = 1 ORDER BY ServiceId');
    return result.recordset.map(mapRow);
  },

  async findById(id) {
    const pool = await getDatabasePool();
    const result = await pool.request()
      .input('id', sql.Int, Number(id))
      .query('SELECT * FROM dbo.Services WHERE ServiceId = @id AND IsActive = 1');
    return mapRow(result.recordset[0]);
  },

  async create(data) {
    const pool = await getDatabasePool();
    const result = await pool.request()
      .input('name', sql.NVarChar(160), data.name)
      .input('category', sql.NVarChar(80), data.category)
      .input('ratePerThousand', sql.Decimal(12, 4), data.ratePerThousand)
      .input('minimumQuantity', sql.Int, data.minimumQuantity)
      .input('maximumQuantity', sql.Int, data.maximumQuantity)
      .input('description', sql.NVarChar(500), data.description || null)
      .query(`
        INSERT INTO dbo.Services (Name, Category, RatePerThousand, MinimumQuantity, MaximumQuantity, Description)
        OUTPUT INSERTED.ServiceId
        VALUES (@name, @category, @ratePerThousand, @minimumQuantity, @maximumQuantity, @description)
      `);
    return this.findById(result.recordset[0].ServiceId);
  },

  async update(id, data) {
    const pool = await getDatabasePool();
    const sets = [];
    const inputs = { id: { type: sql.Int, value: id } };

    if (data.name !== undefined) { sets.push('Name = @name'); inputs.name = { type: sql.NVarChar(160), value: data.name }; }
    if (data.category !== undefined) { sets.push('Category = @category'); inputs.category = { type: sql.NVarChar(80), value: data.category }; }
    if (data.ratePerThousand !== undefined) { sets.push('RatePerThousand = @ratePerThousand'); inputs.ratePerThousand = { type: sql.Decimal(12, 4), value: data.ratePerThousand }; }
    if (data.minimumQuantity !== undefined) { sets.push('MinimumQuantity = @minimumQuantity'); inputs.minimumQuantity = { type: sql.Int, value: data.minimumQuantity }; }
    if (data.maximumQuantity !== undefined) { sets.push('MaximumQuantity = @maximumQuantity'); inputs.maximumQuantity = { type: sql.Int, value: data.maximumQuantity }; }
    if (data.description !== undefined) { sets.push('Description = @description'); inputs.description = { type: sql.NVarChar(500), value: data.description }; }

    if (!sets.length) return this.findById(id);

    sets.push('UpdatedAt = SYSUTCDATETIME()');

    const request = pool.request();
    for (const [key, val] of Object.entries(inputs)) {
      request.input(key, val.type, val.value);
    }
    await request.query(`UPDATE dbo.Services SET ${sets.join(', ')} WHERE ServiceId = @id`);
    return this.findById(id);
  },

  async delete(id) {
    const pool = await getDatabasePool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('UPDATE dbo.Services SET IsActive = 0 WHERE ServiceId = @id');
    return result.rowsAffected[0] > 0;
  }
};