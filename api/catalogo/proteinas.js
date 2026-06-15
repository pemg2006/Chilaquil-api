const { query } = require('../../lib/db');
const { enviarError } = require('../../lib/respuestas');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return enviarError(res, 405, 'METODO_NO_PERMITIDO', 'Usa GET');
  }

  try {
    const { rows } = await query('SELECT id, nombre FROM proteinas ORDER BY id ASC');
    
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener proteínas:', error);
    return enviarError(res, 500, 'DB_ERROR', 'Error interno al consultar el catálogo de proteínas');
  }
};