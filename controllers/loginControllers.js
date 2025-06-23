const jwt = require('jsonwebtoken');
const db = require('../config/db')
const bcrypt = require('bcryptjs')

exports.loginLoja = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const { rows } = await db.query('SELECT * FROM lojas WHERE email = $1', [email]);

    if (rows.length === 0) {
      // Nenhum resultado encontrado
      return null; // ou throw new Error('Loja não encontrada')
    }

    const loja = rows[0];

    if (rows.length === 0) return res.status(404).json({ msg: 'Loja não encontrada' });

    const match = await bcrypt.compare(senha, loja.senha);
    if (!match) return res.status(401).json({ msg: 'Senha incorreta' });

    const token = jwt.sign(
      {
        loja_id: loja.id,
        loja_nome: loja.nome_loja,
        status_pagamento: loja.status_pagamento,
        data_cadastro: loja.data_cadastro
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, nome_loja: loja.nome_loja, id: loja.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao fazer login' });
  }
};
