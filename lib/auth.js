// TODO (#8 - Mauricio): validacion de credenciales para
// /api/auth/registro y /api/auth/login.
//
// Aqui puede ir, por ejemplo, una funcion para verificar usuario/contrasena
// contra la tabla `usuarios` y, si el equipo decide usar hash (ver
// Supuesto #6 del plan), las funciones para hashear y comparar contrasenas.

const bcrypt = require('bcrypt');

/**
 * Toma la contraseña en texto plano y la convierte en un hash seguro.
 * Se usa en el registro antes de guardar en la base de datos.
 */
async function hashearContrasena(contrasena) {
    const saltRounds = 10; // Nivel de seguridad estándar
    return await bcrypt.hash(contrasena, saltRounds);
}

/**
 * Compara una contraseña en texto plano (la que manda el usuario al loguearse)
 * con el hash guardado en la base de datos.
 */
async function compararContrasena(contrasena, contrasenaHasheada) {
    return await bcrypt.compare(contrasena, contrasenaHasheada);
}

module.exports = {
    hashearContrasena,
    compararContrasena
};