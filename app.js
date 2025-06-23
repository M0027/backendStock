const express = require( 'express');
const cors = require( 'cors');
const dotenv = require( 'dotenv');
const produtoRoutes = require( './routes/produtoRoutes.js');
const errorMiddleware = require( './middlewares/errorMiddleware.js');
const loginRoutes = require( './routes/loginRoutes.js');
const categoriaRoutes = require('./routes/categoriaRoutes');
const vendaRoutes = require('./routes/vendaRoutes.js');
const lojaRoutes = require('./routes/lojaRoutes.js')
const verificarPlano = require('./middlewares/verificarPlano.js')
const adminRoutes = require('./routes/adminRoutes.js')
dotenv.config();
const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/cadastro', lojaRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/produtos',verificarPlano, produtoRoutes);
app.use('/api/categorias',verificarPlano, categoriaRoutes);
app.use('/api/vendas', verificarPlano, vendaRoutes);

// admin rotas
app.use('/api/admin/login', adminRoutes);
app.use('/api/admin/lojas', adminRoutes);
app.use('/api/admin/loja/', adminRoutes);




// Middleware de erro (deve ser o último)
app.use(errorMiddleware);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));