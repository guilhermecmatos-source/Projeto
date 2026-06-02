import mysql from 'mysql2/promise';
import { env } from './env';

let pool: mysql.Pool | null = null;

export async function getPool(): Promise<mysql.Pool | null> {
  if (env.useMockData) return null;

  if (!pool) {
    try {
      pool = mysql.createPool({
        host: env.db.host,
        port: env.db.port,
        user: env.db.user,
        password: env.db.password,
        database: env.db.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
      await pool.query('SELECT 1');
    } catch {
      console.warn('[Fleet AI] MySQL indisponível — usando dados mock');
      return null;
    }
  }
  return pool;
}

export async function query<T>(sql: string, params?: (string | number | boolean | null)[]): Promise<T[]> {
  const p = await getPool();
  if (!p) return [];
  const [rows] = await p.execute(sql, params);
  return rows as T[];
}
