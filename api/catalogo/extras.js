const { enviarError } = require('../../lib/respuestas');

// TODO (#10 - Aaron): GET /api/catalogo/extras
// Response 200: [{ id, nombre }]
// Depende de: #6, #7
module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return enviarError(res, 405, 'METODO_NO_PERMITIDO', 'Usa GET');
  }
  enviarError(res, 501, 'NO_IMPLEMENTADO', 'GET /api/catalogo/extras pendiente');
};
