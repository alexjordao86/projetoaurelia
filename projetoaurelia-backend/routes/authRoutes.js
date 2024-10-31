const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController'); // Importando as funções corretamente

// Rota para registro de usuário
router.post('/register', register);

// Rota para login de usuário
router.post('/login', login); // Certifique-se de que 'login' está corretamente importado

module.exports = router;
