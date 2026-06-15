const { query } = require('../../lib/db');
const { enviarError } = require('../../lib/respuestas');

// TODO (#11 - Mauricio): GET /api/pedidos/:id -> detalle de un pedido
// Response 200: { id, producto: { id, nombre, imagen }, cantidad,
//                  proteinas: [{ id, nombre }], extras: [{ id, nombre }],
//                  direccionEntrega, total, creadoEn }
// El id llega en req.query.id
// Depende de: #6
// GET /api/pedidos/:id -> detalle completo de un pedido
module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return enviarError(res, 405, 'METODO_NO_PERMITIDO', 'Usa GET');
  }

  const { id } = req.query;
  if (!/^\d+$/.test(String(id))) {
    return enviarError(res, 400, 'ID_INVALIDO', 'El id debe ser un numero');
  }

  try {
    const pedidoResult = await query(
      `SELECT pedidos.id, pedidos.cantidad, pedidos.direccion_entrega,
              pedidos.total, pedidos.creado_en,
              productos.id AS producto_id, productos.nombre AS producto_nombre,
              productos.imagen AS producto_imagen
       FROM pedidos
       JOIN productos ON pedidos.producto_id = productos.id
       WHERE pedidos.id = $1`,
      [id]
    );

    if (pedidoResult.rows.length === 0) {
      return enviarError(res, 404, 'PEDIDO_NO_ENCONTRADO', 'El pedido no existe');
    }

    const p = pedidoResult.rows[0];

    const [proteinasResult, extrasResult] = await Promise.all([
      query(
        `SELECT proteinas.id, proteinas.nombre
         FROM pedido_proteinas
         JOIN proteinas ON pedido_proteinas.proteina_id = proteinas.id
         WHERE pedido_proteinas.pedido_id = $1`,
        [id]
      ),
      query(
        `SELECT extras.id, extras.nombre
         FROM pedido_extras
         JOIN extras ON pedido_extras.extra_id = extras.id
         WHERE pedido_extras.pedido_id = $1`,
        [id]
      ),
    ]);

    res.status(200).json({
      id: p.id,
      producto: {
        id: p.producto_id,
        nombre: p.producto_nombre,
        imagen: p.producto_imagen,
      },
      cantidad: p.cantidad,
      proteinas: proteinasResult.rows,
      extras: extrasResult.rows,
      direccionEntrega: p.direccion_entrega,
      total: Number(p.total),
      creadoEn: p.creado_en,
    });
  } catch (err) {
    console.error('Error en GET /api/pedidos/:id:', err);
    enviarError(res, 500, 'ERROR_SERVIDOR', 'No se pudo obtener el pedido');
  }
};
