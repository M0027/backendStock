const express = require( 'express');
const produtoController = require('../controllers/produtoController.js');
const authMiddleware = require( '../middlewares/authMiddleware.js');

const router = express.Router();

// Rotas protegidas por JWT
router.get('/', produtoController.listar);
router.post('/', produtoController.criar);
router.put('/:id', produtoController.actualizar)
router.delete('/:id', produtoController.deletar);
module.exports = router;