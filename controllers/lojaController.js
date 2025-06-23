// controllers/lojaController.js
const bcrypt = require('bcryptjs');
const db = require('../config/db');

  exports.registrarLoja = async (req, res) => {
  const { nome_loja, email, senha } = req.body;

  // Validação básica dos dados de entrada
  if (!nome_loja || !email || !senha) {
    return res.status(400).json({ 
      success: false,
      msg: 'Todos os campos são obrigatórios' 
    });
  }

  try {
    const hash = await bcrypt.hash(senha, 10);
    const periodoTeste = 3; // Dias gratuitos

    // Usando RETURNING para obter os dados inseridos
    const { rows } = await db.query(
      `INSERT INTO lojas 
       (nome_loja, email, senha, status_pagamento, data_cadastro, data_expiracao) 
       VALUES ($1, $2, $3, false, NOW(), NOW()) 
       RETURNING id, nome_loja, email, data_cadastro, data_expiracao`,
      [nome_loja, email, hash]
    );

    // Verificação de e-mail duplicado (código de erro 23505 = unique_violation)
    // if (err.code === '23505') {
    //   return res.status(409).json({ 
    //     success: false,
    //     msg: 'E-mail já cadastrado' 
    //   });
    // }

    // Calculando data de expiração do trial
    const dataExpiracao = new Date();
    dataExpiracao.setDate(dataExpiracao.getDate() + periodoTeste);

    res.status(201).json({ 
      success: true,
      msg: 'Loja registrada com sucesso. Aproveite seus 3 dias grátis!',
      data: {
        loja: rows[0],
        trial_expira_em: dataExpiracao.toISOString().split('T')[0] // Formato YYYY-MM-DD
      }
    });

  } catch (err) {
    console.error('Erro no registro:', err);

    // Tratamento específico para erros do PostgreSQL
    if (err.code === '23505') { // Violação de constraint única
      return res.status(409).json({ 
        success: false,
        msg: 'E-mail já está em uso por outra loja' 
      });
    }

    res.status(500).json({ 
      success: false,
      msg: 'Erro interno no servidor ao registrar loja',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};