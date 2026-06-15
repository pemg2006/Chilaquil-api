const { enviarError } = require('../../lib/respuestas');

// TODO (#8 - Mauricio): POST /api/auth/registro
// Request:  { nombre, nombreUsuario, contrasena, direccion }
// Response 201: { id, nombre, nombreUsuario, direccion }
// Depende de: #6 (tabla `usuarios`, a cargo de Aaron)
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return enviarError(res, 405, 'METODO_NO_PERMITIDO', 'Usa POST');
  }
  enviarError(res, 501, 'NO_IMPLEMENTADO', 'POST /api/auth/registro pendiente');
};
