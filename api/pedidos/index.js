const { query, getPool } = require('../../lib/db');
const { enviarError } = require('../../lib/respuestas');

// TODO (#11 - Mauricio):
//  POST /api/pedidos -> crear pedido
//    Request:  { usuarioId, productoId, cantidad, proteinaIds, extraIds, direccionEntrega }
//    Response 201: { id, total, estado, creadoEn }
//  GET /api/pedidos?usuarioId=1 -> historial del usuario
//    Response 200: [{ id, productoNombre, cantidad, total, creadoEn }]
// Depende de: #6 (tablas pedidos, pedido_proteinas, pedido_extras)
module.exports = async (req, res) => {
  if (req.method === 'POST') {
    return crearPedido(req, res);
  }
  if (req.method === 'GET') {
    return obtenerHistorial(req, res);
  }
  enviarError(res, 405, 'METODO_NO_PERMITIDO', 'Usa GET o POST');
};

// POST /api/pedidos -> crea un pedido (producto + proteinas + extras elegidos)
async function crearPedido(req, res) {
  const {
    usuarioId,
    productoId,
    cantidad,
    proteinaIds = [],
    extraIds = [],
    direccionEntrega,
  } = req.body || {};

  if (!usuarioId || !productoId || !cantidad || !direccionEntrega) {
    return enviarError(
      res,
      400,
      'DATOS_INVALIDOS',
      'Faltan campos requeridos: usuarioId, productoId, cantidad, direccionEntrega'
    );
  }
  if (!Number.isInteger(cantidad) || cantidad < 1) {
    return enviarError(res, 400, 'DATOS_INVALIDOS', 'cantidad debe ser un entero mayor o igual a 1');
  }
  if (!Array.isArray(proteinaIds) || !Array.isArray(extraIds)) {
    return enviarError(res, 400, 'DATOS_INVALIDOS', 'proteinaIds y extraIds deben ser arreglos');
  }

  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // El precio lo decide el servidor (no se confia en lo que mande el cliente).
    // Proteinas y extras son gratis (Supuesto #1), no afectan el total.
    const productoResult = await client.query(
      'SELECT precio FROM productos WHERE id = $1 AND disponible = true',
      [productoId]
    );
    if (productoResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return enviarError(res, 404, 'PRODUCTO_NO_ENCONTRADO', 'El producto no existe');
    }

    const precio = Number(productoResult.rows[0].precio);
    const total = precio * cantidad;

    const pedidoResult = await client.query(
      `INSERT INTO pedidos (usuario_id, producto_id, cantidad, direccion_entrega, total, estado)
       VALUES ($1, $2, $3, $4, $5, 'recibido')
       RETURNING id, total, estado, creado_en`,
      [usuarioId, productoId, cantidad, direccionEntrega, total]
    );
    const pedido = pedidoResult.rows[0];

    for (const proteinaId of proteinaIds) {
      await client.query(
        'INSERT INTO pedido_proteinas (pedido_id, proteina_id) VALUES ($1, $2)',
        [pedido.id, proteinaId]
      );
    }

    for (const extraId of extraIds) {
      await client.query(
        'INSERT INTO pedido_extras (pedido_id, extra_id) VALUES ($1, $2)',
        [pedido.id, extraId]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      id: pedido.id,
      total: Number(pedido.total),
      estado: pedido.estado,
      creadoEn: pedido.creado_en,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error en POST /api/pedidos:', err);

    // 23503 = foreign_key_violation (codigo estandar de Postgres):
    // usuarioId, proteinaIds o extraIds contienen un id que no existe.
    if (err.code === '23503') {
      return enviarError(
        res,
        400,
        'DATOS_INVALIDOS',
        'usuarioId, proteinaIds o extraIds contienen un id que no existe'
      );
    }
    enviarError(res, 500, 'ERROR_SERVIDOR', 'No se pudo crear el pedido');
  } finally {
    client.release();
  }
}

// GET /api/pedidos?usuarioId=1 -> historial de pedidos de un usuario
async function obtenerHistorial(req, res) {
  const { usuarioId } = req.query;

  if (!usuarioId) {
    return enviarError(res, 400, 'DATOS_INVALIDOS', 'Falta el parametro usuarioId');
  }
  if (!/^\d+$/.test(String(usuarioId))) {
    return enviarError(res, 400, 'ID_INVALIDO', 'usuarioId debe ser un numero');
  }

  try {
    const resultado = await query(
      `SELECT pedidos.id, productos.nombre AS producto_nombre, pedidos.cantidad,
              pedidos.total, pedidos.creado_en
       FROM pedidos
       JOIN productos ON pedidos.producto_id = productos.id
       WHERE pedidos.usuario_id = $1
       ORDER BY pedidos.creado_en DESC`,
      [usuarioId]
    );

    const pedidos = resultado.rows.map((p) => ({
      id: p.id,
      productoNombre: p.producto_nombre,
      cantidad: p.cantidad,
      total: Number(p.total),
      creadoEn: p.creado_en,
    }));

    res.status(200).json(pedidos);
  } catch (err) {
    console.error('Error en GET /api/pedidos:', err);
    enviarError(res, 500, 'ERROR_SERVIDOR', 'No se pudo obtener el historial');
  }
}
