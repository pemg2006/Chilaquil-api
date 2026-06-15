// TODO (#7 - Aaron): script de carga inicial (productos, proteinas, extras).
// Se ejecuta una sola vez, manualmente: `npm run seed`
// Usa lib/db.js para conectarse e insertar los datos semilla descritos en
// la seccion 3 del plan.

require('dotenv').config();
const { query } = require('../lib/db');

async function seed() {
  // TODO: INSERT INTO productos (...) VALUES (...)
  // TODO: INSERT INTO proteinas (...) VALUES (...)
  // TODO: INSERT INTO extras (...) VALUES (...)
  console.log('TODO: cargar datos semilla');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
