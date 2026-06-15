require('dotenv').config();
const { query } = require('../lib/db');

async function seed() {
  console.log('Iniciando carga de datos semilla...');

  try {
    // 1. Insertar Proteínas
    await query(`
      INSERT INTO proteinas (nombre) VALUES
      ('Pollo deshebrado'),
      ('Huevo estrellado'),
      ('Bistec')
    `);
    console.log('✅ Proteínas cargadas');

    // 2. Insertar Extras
    await query(`
      INSERT INTO extras (nombre) VALUES
      ('Crema'),
      ('Queso panela'),
      ('Cebolla morada'),
      ('Aguacate')
    `);
    console.log('✅ Extras cargados');

    // 3. Insertar Menú de Productos
    await query(`
      INSERT INTO productos (nombre, descripcion, precio, imagen, salsa) VALUES
      ('Chilaquiles Rojos Tradicionales', 'Totopos crujientes bañados en salsa roja de chile guajillo.', 65.00, 'chilaquiles_rojos', 'roja'),
      ('Chilaquiles Verdes', 'Totopos crujientes bañados en salsa verde de tomatillo con un toque de habanero.', 65.00, 'chilaquiles_verdes', 'verde')
    `);
    console.log('✅ Menú de productos cargado');

    console.log('🎉 Carga de datos finalizada exitosamente.');
  } catch (error) {
    console.error('❌ Error al insertar los datos:', error);
    throw error; // Lanza el error para que el catch global lo atrape
  }
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fallo en el script de seed:', err);
    process.exit(1);
  });