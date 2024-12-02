// Importa as dependências necessárias
const express = require('express');               // Framework para criação de rotas e APIs
const router = express.Router();                  // Cria uma nova instância de roteador
const { register, login } = require('../controllers/authController'); // Funções de registro e login
const jwt = require('jsonwebtoken');              // JWT para geração e verificação de tokens
const bcrypt = require('bcrypt');                 // Bcrypt para criptografar e comparar senhas
const db = require('../db');                      // Conexão com o banco de dados
const { sendPasswordResetEmail } = require('../utils/emailService'); // Serviço de email para enviar link de recuperação
const crypto = require('crypto');                 // Crypto para geração de tokens seguros para redefinição de senha

// Rota para registro de usuário
router.post('/register', register);               // Chama a função de registro quando a rota é acessada

// Rota para login de usuário
router.post('/login', login);                     // Chama a função de login quando a rota é acessada

// Rota para iniciar o processo de recuperação de senha
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;                   // Extrai o email da requisição

    try {
        // Verifica se o email está cadastrado no sistema
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) {                  // Caso o email não esteja cadastrado
            return res.status(404).json({ error: 'Email não encontrado' });
        }

        // Gera um token temporário de redefinição de senha (expira em 1 hora)
        const resetToken = crypto.randomBytes(32).toString('hex'); // Gera um token seguro de 32 bytes
        const hashedToken = await bcrypt.hash(resetToken, 10);     // Hasheia o token antes de salvar no banco
        const expirationTime = Date.now() + 3600000;               // Expira em 1 hora (3600000 ms)

        // Armazena o token e a data de expiração no banco de dados para o usuário
        await db.query('UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?', [hashedToken, expirationTime, email]);

        // Envia o email de recuperação com o link contendo o token
        const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;
        await sendPasswordResetEmail(email, resetLink);

        // Retorna uma resposta de sucesso
        res.json({ message: 'Email de recuperação enviado com sucesso' });
    } catch (error) {
        // Captura e exibe qualquer erro durante o processo de recuperação
        console.error('Erro ao enviar email de recuperação de senha:', error);
        res.status(500).json({ error: 'Erro ao iniciar a recuperação de senha' });
    }
});

// Rota para redefinição de senha
router.post('/reset-password', async (req, res) => {
    const { token, email, newPassword } = req.body; // Extrai o token, email e nova senha da requisição

    try {
        // Encontra o usuário pelo email fornecido
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) {                      // Caso o email não esteja cadastrado
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Verifica se o token é válido e se ainda está dentro do prazo de validade
        const isTokenValid = await bcrypt.compare(token, user[0].reset_password_token); // Compara o token com o hash
        if (!isTokenValid || Date.now() > user[0].reset_password_expires) {              // Se inválido ou expirado
            return res.status(400).json({ error: 'Token inválido ou expirado' });
        }

        // Atualiza a senha do usuário com a nova senha, criptografando-a antes de salvar
        const hashedPassword = await bcrypt.hash(newPassword, 10);                      // Criptografa a nova senha
        await db.query('UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE email = ?', [hashedPassword, email]);

        // Retorna uma mensagem de sucesso ao redefinir a senha
        res.json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
        // Captura e exibe qualquer erro durante o processo de redefinição
        console.error('Erro ao redefinir senha:', error);
        res.status(500).json({ error: 'Erro ao redefinir a senha' });
    }
});

module.exports = router; // Exporta o roteador com todas as rotas configuradas
