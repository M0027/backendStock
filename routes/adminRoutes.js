const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Login do admin
router.post('/', (req, res) => {
  const { email, senha } = req.body;

  if (email === process.env.ADMIN_EMAIL && senha === process.env.ADMIN_SENHA) {
    const token = jwt.sign({ tipo: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token });
  }

  return res.status(401).json({ msg: 'Credenciais inválidas' });
});

// Middleware para verificar admin
function verificarAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Token necessário' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.tipo !== 'admin') return res.status(403).json({ msg: 'Acesso negado' });

    next();
  } catch (err) {
    return res.status(403).json({ msg: 'Token inválido' });
  }
}

// Rota para listar lojas
router.get('/', verificarAdmin, async (req, res) => {
  try {
    const [lojas] = await db.query('SELECT id, nome_loja, email, data_cadastro, status_pagamento FROM lojas');
    const lojasComDias = lojas.map((loja) => {
      const dias = Math.floor((new Date() - new Date(loja.data_cadastro)) / (1000 * 60 * 60 * 24));
      return { ...loja, dias_desde_cadastro: dias };
    });

    res.json(lojasComDias);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar lojas' });
  }
});

// Ativar pagamento
router.put('/ativar/:id', verificarAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('UPDATE lojas SET status_pagamento = true WHERE id = ?', [id]);
    res.json({ msg: 'Loja ativada com sucesso!' });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao ativar loja' });
  }
});


// Desativar pagamento
router.put('/desativar/:id', verificarAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('UPDATE lojas SET status_pagamento = false WHERE id = ?', [id]);
    res.json({ msg: 'Loja desativada com sucesso!' });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao ativar loja' });
  }
});

module.exports = router;
