const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Configuração inicial do ambiente
dotenv.config();

// Validação das variáveis de ambiente
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_NAME'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Variável de ambiente ausente: ${envVar}`);
  }
}

// Configuração do pool de conexões
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // Pode ser vazio para desenvolvimento
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00', // Para evitar problemas com fusos horários
  decimalNumbers: true, // Retorna números decimais como JavaScript Numbers
  charset: 'utf8mb4' // Suporte a caracteres especiais e emojis
});

// Teste de conexão ao iniciar
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexão com MySQL estabelecida com sucesso');
    connection.release();
  } catch (err) {
    console.error('❌ Falha na conexão com MySQL:', err.message);
    process.exit(1); // Encerra o aplicativo se não conseguir conectar
  }
})();

module.exports = pool;