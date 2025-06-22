// controllers/lojaController.js
const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.registrarLoja = async (req, res) => {
  const { nome_loja, email, senha } = req.body;

  try {
    const hash = await bcrypt.hash(senha, 10);

    await db.query(
      'INSERT INTO lojas (nome_loja, email, senha) VALUES (?, ?, ?)',
      [nome_loja, email, hash]
    );

    res.status(201).json({ msg: 'Loja registrada com sucesso. Aproveite seus 3 dias grátis!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao registrar loja' });
  }
};
