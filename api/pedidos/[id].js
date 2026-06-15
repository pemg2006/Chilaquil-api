const { enviarError } = require('../../lib/respuestas');

// TODO (#11 - Mauricio): GET /api/pedidos/:id -> detalle de un pedido
// Response 200: { id, producto: { id, nombre, imagen }, cantidad,
//                  proteinas: [{ id, nombre }], extras: [{ id, nombre }],
//                  direccionEntrega, total, creadoEn }
// El id llega en req.query.id
// Depende de: #6
module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return enviarError(res, 405, 'METODO_NO_PERMITIDO', 'Usa GET');
  }
  enviarError(res, 501, 'NO_IMPLEMENTADO', `GET /api/pedidos/${req.query.id} pendiente`);
};
