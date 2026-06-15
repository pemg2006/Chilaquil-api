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
    return enviarError(res, 501, 'NO_IMPLEMENTADO', 'POST /api/pedidos pendiente');
  }
  if (req.method === 'GET') {
    return enviarError(res, 501, 'NO_IMPLEMENTADO', 'GET /api/pedidos pendiente');
  }
  enviarError(res, 405, 'METODO_NO_PERMITIDO', 'Usa GET o POST');
};
