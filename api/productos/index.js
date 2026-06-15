const { query } = require('../../lib/db');
const { enviarError } = require('../../lib/respuestas');


// GET /api/productos -> lista del menu (solo productos disponibles)
module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return enviarError(res, 405, 'METODO_NO_PERMITIDO', 'Usa GET');
  }

  try {
    const resultado = await query(
      `SELECT id, nombre, descripcion, precio, imagen, salsa
       FROM productos
       WHERE disponible = true
       ORDER BY id`
    );

    const productos = resultado.rows.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: Number(p.precio),
      imagen: p.imagen,
      salsa: p.salsa,
    }));

    res.status(200).json(productos);
  } catch (err) {
    console.error('Error en GET /api/productos:', err);
    enviarError(res, 500, 'ERROR_SERVIDOR', 'No se pudo obtener el menu');
  }
};
// TODO (#9 - Mauricio): GET /api/productos -> lista del menu
// Response 200: [{ id, nombre, descripcion, precio, imagen, salsa }]
// Depende de: #6 (tabla `productos`) y #7 (seed, a cargo de Aaron)

