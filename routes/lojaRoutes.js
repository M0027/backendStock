const express = require( 'express');
const lojaController = require('../controllers/lojaController.js');
const authMiddleware = require( '../middlewares/authMiddleware.js')

const router = express.Router();

// Rota pública: cadastro de admin
router.post('/loja', lojaController.registrarLoja);
module.exports = router;