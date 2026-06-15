const { enviarError } = require('../../lib/respuestas');

// TODO (#9 - Mauricio): GET /api/productos -> lista del menu
// Response 200: [{ id, nombre, descripcion, precio, imagen, salsa }]
// Depende de: #6 (tabla `productos`) y #7 (seed, a cargo de Aaron)
module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return enviarError(res, 405, 'METODO_NO_PERMITIDO', 'Usa GET');
  }
  enviarError(res, 501, 'NO_IMPLEMENTADO', 'GET /api/productos pendiente');
};
