// Helper para mandar siempre el mismo formato de error definido en el
// contrato (seccion 5 del plan):
// { "error": { "codigo": "...", "mensaje": "..." } }
function enviarError(res, status, codigo, mensaje) {
  res.status(status).json({ error: { codigo, mensaje } });
}

module.exports = { enviarError };
