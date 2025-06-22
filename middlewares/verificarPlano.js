const jwt = require('jsonwebtoken');

 const verificarPlano = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ msg: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];
  //  console.log('JWT_SECRET:', authHeader);
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(token)
      
    const { loja_id, status_pagamento, data_cadastro } = decoded;

    // Calcular dias desde o cadastro
    const diasPassados = Math.floor(
      (new Date() - new Date(data_cadastro)) / (1000 * 60 * 60 * 24)
    );

    // Verificar se a loja ainda está dentro dos 3 dias grátis
    if (!status_pagamento && diasPassados > 3) {
      return res.status(403).json({
        msg: 'Seu período gratuito terminou. Faça o pagamento para continuar.'
      });
    }
    // Anexar dados da loja à requisição
    req.loja_id = loja_id;
    req.status_pagamento = status_pagamento;
    next();
  } catch (err) {
    console.error(err)
    return res.status(403).json({ msg: 'Token inválido ou expirado' });
  }
};

module.exports = verificarPlano;
