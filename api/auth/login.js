const { enviarError } = require('../../lib/respuestas');

// TODO (#8 - Mauricio): POST /api/auth/login
// Request:  { nombreUsuario, contrasena }
// Response 200: { id, nombre, nombreUsuario, direccion }
// Si las credenciales no son validas: 401 con codigo CREDENCIALES_INVALIDAS
// Depende de: #6 (tabla `usuarios`, a cargo de Aaron)
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return enviarError(res, 405, 'METODO_NO_PERMITIDO', 'Usa POST');
  }
  enviarError(res, 501, 'NO_IMPLEMENTADO', 'POST /api/auth/login pendiente');
};
