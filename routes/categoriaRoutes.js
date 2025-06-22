const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

router.get('/', categoriaController.listar);
router.post('/', categoriaController.criar);
router.delete('/:id', categoriaController.deletar);

module.exports = router;
