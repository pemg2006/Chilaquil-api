const { query } = require('../../lib/db');
const { enviarError } = require('../../lib/respuestas');
const { compararContrasena } = require('../../lib/auth');

// TODO (#8 - Mauricio): POST /api/auth/login
// Request:  { nombreUsuario, contrasena }
// Response 200: { id, nombre, nombreUsuario, direccion }
// Si las credenciales no son validas: 401 con codigo CREDENCIALES_INVALIDAS
// Depende de: #6 (tabla `usuarios`, a cargo de Aaron)
module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).end();

    const { nombreUsuario, contrasena } = req.body;
    if (!nombreUsuario || !contrasena) {
        return enviarError(res, 400, 'DATOS_INVALIDOS', 'Usuario y contraseña son requeridos');
    }

    try {
        // 1. Buscamos al usuario únicamente por su username para traer su hash
        const resultado = await query(
            'SELECT id, nombre, nombre_usuario AS "nombreUsuario", contrasena, direccion FROM usuarios WHERE nombre_usuario = $1',
            [nombreUsuario]
        );

        if (resultado.rows.length === 0) {
            return enviarError(res, 401, 'CREDENCIALES_INVALIDAS', 'Usuario o contraseña incorrectos');
        }

        const usuario = resultado.rows[0];

        // 2. Comparamos la contraseña recibida con el hash de la BD
        const esValida = await compararContrasena(contrasena, usuario.contrasena);
        
        if (!esValida) {
            return enviarError(res, 401, 'CREDENCIALES_INVALIDAS', 'Usuario o contraseña incorrectos');
        }
        
        // 3. Limpiamos el objeto (quitar el hash) antes de responder por seguridad
        delete usuario.contrasena;

        return res.status(200).json(usuario);
    } catch (error) {
        return enviarError(res, 500, 'ERROR_SERVIDOR', 'Error interno al intentar iniciar sesión');
    }
};