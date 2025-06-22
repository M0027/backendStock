// routes/vendaRoutes.js
const express = require('express');
const router = express.Router();
const { criarVenda, listarVendas ,deletarVenda} = require('../controllers/vendaController');

router.post('/', criarVenda);
router.get('/', listarVendas);
router.delete('/:id', deletarVenda);


module.exports = router;
