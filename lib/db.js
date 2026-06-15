const { Pool } = require('pg');

// Pool a nivel de modulo: en funciones serverless de Vercel el modulo se
// reutiliza entre invocaciones mientras la instancia este "caliente", asi
// evitamos abrir una conexion nueva en cada request.
let pool;

function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('Falta la variable de entorno DATABASE_URL');
    }

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Supabase requiere SSL. `rejectUnauthorized: false` es la opcion mas
      // simple para un proyecto escolar; si quieren validar el certificado
      // de forma estricta, conviene revisar la documentacion actual de
      // Supabase sobre conexiones desde entornos serverless.
      ssl: { rejectUnauthorized: false },
      max: 1,
    });
  }
  return pool;
}

// Helper para hacer queries: db.query('SELECT * FROM productos WHERE id = $1', [id])
async function query(text, params) {
  const pool = getPool();
  return pool.query(text, params);
}

module.exports = { query, getPool };
