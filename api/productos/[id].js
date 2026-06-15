const { query } = require('../../lib/db')
const { enviarError } = require('../../lib/respuestas');

// TODO (#9 - Mauricio): GET /api/productos/:id -> detalle de un producto
// Response 200: { id, nombre, descripcion, precio, imagen, salsa,
//                  proteinas: [{ id, nombre }], extras: [{ id, nombre }] }
// El id llega en req.query.id
// Depende de: #6, #7
module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return enviarError(res, 405, 'METODO_NO_PERMITIDO', 'Usa GET');
  }

  const { id } = req.query;
  if (!/^\d+$/.test(String(id))) {
    return enviarError(res, 400, 'ID_INVALIDO', 'El id debe ser un numero');
  }

  try {
    const productoResult = await query(
      `SELECT id, nombre, descripcion, precio, imagen, salsa
       FROM productos
       WHERE id = $1 AND disponible = true`,
      [id]
    );

    if (productoResult.rows.length === 0) {
      return enviarError(res, 404, 'PRODUCTO_NO_ENCONTRADO', 'El producto no existe');
    }

    const [proteinasResult, extrasResult] = await Promise.all([
      query('SELECT id, nombre FROM proteinas ORDER BY id'),
      query('SELECT id, nombre FROM extras ORDER BY id'),
    ]);

    const p = productoResult.rows[0];
    res.status(200).json({
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: Number(p.precio),
      imagen: p.imagen,
      salsa: p.salsa,
      proteinas: proteinasResult.rows,
      extras: extrasResult.rows,
    });
  } catch (err) {
    console.error('Error en GET /api/productos/:id:', err);
    enviarError(res, 500, 'ERROR_SERVIDOR', 'No se pudo obtener el producto');
  }
};
