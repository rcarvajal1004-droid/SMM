import { getDatabasePool, sql } from '../../config/database.js';

const mapRow = (row) => row && ({
  id: row.UserId,
  username: row.Username,
  email: row.Email,
  passwordHash: row.PasswordHash,
  apiKeyHash: row.ApiKeyHash,
  balance: Number(row.Balance || 0)
});

const SELECT_USER = `
  SELECT u.UserId, u.Username, u.Email, u.PasswordHash, u.ApiKeyHash,
         ISNULL((SELECT SUM(Amount) FROM dbo.BalanceTransactions bt
                 WHERE bt.UserId = u.UserId AND bt.TransactionType IN ('Credit','Refund')), 0)
       - ISNULL((SELECT SUM(Amount) FROM dbo.BalanceTransactions bt
                 WHERE bt.UserId = u.UserId AND bt.TransactionType = 'Debit'), 0) AS Balance
  FROM dbo.Users u
`;

export const userRepository = {
  async findAll() {
    const pool = await getDatabasePool();
    const result = await pool.request().query(SELECT_USER);
    return result.recordset.map(mapRow);
  },

  async findById(id) {
    const pool = await getDatabasePool();
    const result = await pool.request()
      .input('id', sql.Int, Number(id))
      .query(`${SELECT_USER} WHERE u.UserId = @id`);
    return mapRow(result.recordset[0]);
  },

  async findByUsernameOrEmail(identifier) {
    const pool = await getDatabasePool();
    const result = await pool.request()
      .input('id', sql.NVarChar(254), identifier)
      .query(`${SELECT_USER} WHERE u.Username = @id OR u.Email = @id`);
    return mapRow(result.recordset[0]);
  },

  async create({ username, email, passwordHash }) {
    const pool = await getDatabasePool();
    const result = await pool.request()
      .input('username', sql.NVarChar(80), username)
      .input('email', sql.NVarChar(254), email)
      .input('passwordHash', sql.NVarChar(255), passwordHash)
      .query(`
        INSERT INTO dbo.Users (Username, Email, PasswordHash)
        OUTPUT INSERTED.UserId
        VALUES (@username, @email, @passwordHash)
      `);
    return this.findById(result.recordset[0].UserId);
  },

  async updatePassword(userId, passwordHash) {
    const pool = await getDatabasePool();
    await pool.request()
      .input('userId', sql.Int, Number(userId))
      .input('passwordHash', sql.NVarChar(255), passwordHash)
      .query('UPDATE dbo.Users SET PasswordHash = @passwordHash, UpdatedAt = SYSUTCDATETIME() WHERE UserId = @userId');
  },

  async addBalanceTransaction(userId, amount, type, reference) {
    const pool = await getDatabasePool();
    await pool.request()
      .input('userId', sql.Int, Number(userId))
      .input('amount', sql.Decimal(12, 4), amount)
      .input('type', sql.VarChar(20), type)
      .input('reference', sql.NVarChar(120), reference || null)
      .query(`
        INSERT INTO dbo.BalanceTransactions (UserId, Amount, TransactionType, Reference)
        VALUES (@userId, @amount, @type, @reference)
      `);
  },

  /** Registra débito y retorna el nuevo saldo. Transaccional. */
  async debitAndGetBalance(userId, amount, reference) {
    const pool = await getDatabasePool();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
      await transaction.request()
        .input('userId', sql.Int, Number(userId))
        .input('amount', sql.Decimal(12, 4), amount)
        .input('type', sql.VarChar(20), 'Debit')
        .input('reference', sql.NVarChar(120), reference || null)
        .query(`
          INSERT INTO dbo.BalanceTransactions (UserId, Amount, TransactionType, Reference)
          VALUES (@userId, @amount, @type, @reference)
        `);

      const balanceResult = await transaction.request()
        .input('uid', sql.Int, Number(userId))
        .query(`
          SELECT ISNULL((SELECT SUM(Amount) FROM dbo.BalanceTransactions
                         WHERE UserId = @uid AND TransactionType IN ('Credit','Refund')), 0)
                - ISNULL((SELECT SUM(Amount) FROM dbo.BalanceTransactions
                         WHERE UserId = @uid AND TransactionType = 'Debit'), 0) AS Balance
        `);
      await transaction.commit();
      return Number(balanceResult.recordset[0].Balance);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};