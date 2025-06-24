const pool = require( '../config/db')
const bcrypt = require( 'bcryptjs');
const jwt = require( 'jsonwebtoken');

class Admin {
  // Cadastrar admin (com senha criptografada)
  static async cadastrar(nome, email, senha) {
    const senhaHash = await bcrypt.hash(senha, 10); // 10 = salt rounds
    const {rows:result} = await pool.query(
      'INSERT INTO administradores (nome, email, senha_hash) VALUES ($1, $2, $3)',
      [nome, email, senhaHash]
    );
    return result[0].id;
  }

  // Login: verifica e-mail e senha, retorna token JWT
  static async login(email, senha) {
    const {rows: admin} = await pool.query('SELECT * FROM administradores WHERE email = $1', [email]);
    const resul = admin[0];

    if (!resul || !(await bcrypt.compare(senha, resul.senha_hash))) {
      throw new Error('E-mail ou senha incorretos');
    }

    // Gera token JWT válido por 1h
    const token = jwt.sign(
      { id: resul.id, email: resul.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { token, resul: { id: resul.id, nome: resul.nome, email: resul.email } };
  }
}

module.exports = Admin;