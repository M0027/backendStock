const express = require( 'express');
const loginController = require('../controllers/loginControllers.js');
const authMiddleware = require( '../middlewares/authMiddleware.js')

const router = express.Router();

// Rota pública: cadastro de admin
router.post('/', loginController.loginLoja);

module.exports = router;