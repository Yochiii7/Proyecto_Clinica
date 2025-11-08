import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

export const sequelize = new Sequelize(
  'proyecto_clinica',
  'root',
  '',
  {
    host: 'localhost',
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: console.log,
    port: 3306 
  }
);

export const conectarDB = async () => {
  try {
    console.log('🟡 Intentando conectar a la BD...');
    console.log('📋 Configuración:', {
      database: 'proyecto_clinica',
      host: 'localhost',
      port: 3306,
      user: 'root'
    });
    
    await sequelize.authenticate();
    console.log('✅ Conexión a la BD establecida correctamente');
    return true;
  } catch (error) {
    console.error('❌ ERROR DETALLADO de conexión a la BD:');
    console.error('   - Mensaje:', error.message);
    console.error('   - Código:', error.code);
    console.error('   - Número de error:', error.errno);
    console.error('   - SQL State:', error.sqlState);
    
    return false;
  }
};