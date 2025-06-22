const jwt = require( 'jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido ou inválido.' });
  }

  const token = authHeader.split(' ')[1]; // Extrai o token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // Adiciona os dados decodificados à requisição
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

module.exports  = authMiddleware;