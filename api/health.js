const { query } = require('../lib/db');
const { enviarError } = require('../lib/respuestas');

// Endpoint de diagnostico (NO es parte del contrato de la seccion 5).
// Sirve para confirmar que el despliegue en Vercel y la conexion a la
// base de datos funcionan, incluso antes de que existan las tablas reales.
module.exports = async (req, res) => {
  try {
    const resultado = await query('SELECT NOW() AS hora');
    res.status(200).json({ ok: true, hora: resultado.rows[0].hora });
  } catch (err) {
    enviarError(res, 500, 'ERROR_SERVIDOR', 'No se pudo conectar a la base de datos');
  }
};
