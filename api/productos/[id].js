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
  enviarError(res, 501, 'NO_IMPLEMENTADO', `GET /api/productos/${req.query.id} pendiente`);
};
