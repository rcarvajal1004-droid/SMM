import sql from 'mssql';
import { env } from './env.js';

let poolPromise;

function buildConfig() {
  const server = env.database.instance
    ? `${env.database.server}\\${env.database.instance}`
    : env.database.server;

  const config = {
    server,
    database: env.database.name,
    port: env.database.port,
    options: {
      encrypt: env.database.encrypt,
      trustServerCertificate: env.database.trustServerCertificate,
      enableArithAbort: true
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
  };

  if (env.database.trustedConnection) {
    // Autenticación de Windows (requiere msnodesqlv8 - solo Windows/local)
    config.options.driver = 'msnodesqlv8';
    config.options.trustedConnection = true;
  } else {
    // Autenticación SQL (recomendada para Docker/Linux)
    config.user = env.database.user;
    config.password = env.database.password;
  }

  return config;
}

export function getDatabasePool() {
  if (!poolPromise) {
    poolPromise = sql.connect(buildConfig()).catch((error) => {
      poolPromise = undefined;
      throw error;
    });
  }
  return poolPromise;
}

export async function closeDatabasePool() {
  if (!poolPromise) return;
  const pool = await poolPromise;
  poolPromise = undefined;
  await pool.close();
}

export { sql };