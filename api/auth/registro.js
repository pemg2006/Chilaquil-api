const { query } = require('../../lib/db');
const { enviarError } = require('../../lib/respuestas');
const { hashearContrasena } = require('../../lib/auth');

// TODO (#8 - Mauricio): POST /api/auth/registro
// Request:  { nombre, nombreUsuario, contrasena, direccion }
// Response 201: { id, nombre, nombreUsuario, direccion }
// Depende de: #6 (tabla `usuarios`, a cargo de Aaron)
module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).end();
    
    const { nombre, nombreUsuario, contrasena, direccion } = req.body;
    if (!nombre || !nombreUsuario || !contrasena || !direccion) {
        return enviarError(res, 400, 'DATOS_INVALIDOS', 'Todos los campos son obligatorios');
    }

    try {
        const usuarioExistente = await query('SELECT id FROM usuarios WHERE nombre_usuario = $1', [nombreUsuario]);
        if (usuarioExistente.rows.length > 0) {
            return enviarError(res, 400, 'USUARIO_EXISTE', 'El nombre de usuario ya está en uso');
        }

        // Hasheamos la contraseña aquí
        const contrasenaSegura = await hashearContrasena(contrasena);

        // Guardamos 'contrasenaSegura' en lugar del texto plano
        const resultado = await query(
            `INSERT INTO usuarios (nombre, nombre_usuario, contrasena, direccion) 
             VALUES ($1, $2, $3, $4) 
             RETURNING id, nombre, nombre_usuario AS "nombreUsuario", direccion`,
            [nombre, nombreUsuario, contrasenaSegura, direccion]
        );

        return res.status(201).json(resultado.rows[0]);
    } catch (error) {
        return enviarError(res, 500, 'ERROR_SERVIDOR', 'No se pudo completar el registro');
    }
};