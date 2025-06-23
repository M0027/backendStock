const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false, // OBRIGATÓRIO para Render
    require: true
  },
  connectionTimeoutMillis: 5000 // Timeout aumentado
});

// Teste de conexão imediata
pool.query('SELECT NOW()')
  .then(() => console.log('✅ Conexão com PostgreSQL verificada!'))
  .catch(err => {
    console.error('❌ Falha na conexão:', err.message);
    process.exit(1); // Encerra o processo se falhar
  });

module.exports = pool;