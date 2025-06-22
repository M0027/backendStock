const pool = require( '../config/db.js')
const bcrypt = require( 'bcryptjs');
const jwt = require( 'jsonwebtoken');

class Admin {
  // Cadastrar admin (com senha criptografada)
  static async cadastrar(nome, email, senha) {
    const senhaHash = await bcrypt.hash(senha, 10); // 10 = salt rounds
    const [result] = await pool.query(
      'INSERT INTO administradores (nome, email, senha_hash) VALUES (?, ?, ?)',
      [nome, email, senhaHash]
    );
    return result.insertId;
  }

  // Login: verifica e-mail e senha, retorna token JWT
  static async login(email, senha) {
    const [rows] = await pool.query('SELECT * FROM administradores WHERE email = ?', [email]);
    const admin = rows[0];

    if (!admin || !(await bcrypt.compare(senha, admin.senha_hash))) {
      throw new Error('E-mail ou senha incorretos');
    }

    // Gera token JWT válido por 1h
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { token, admin: { id: admin.id, nome: admin.nome, email: admin.email } };
  }
}

module.exports = Admin;