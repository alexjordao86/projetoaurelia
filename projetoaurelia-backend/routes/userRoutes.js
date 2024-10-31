const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const db = require('../db');

// Rota para buscar perfil do usuário
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const [user] = await db.query('SELECT full_name, email, phone_number, cpf_cnpj FROM users WHERE id = ?', [req.user.id]);
        const [donations] = await db.query('SELECT campaign_title, amount, date FROM transactions WHERE user_id = ?', [req.user.id]);

        res.json({ user: user[0], donations });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar informações do perfil.' });
    }
});

// Rota para atualizar perfil do usuário
router.put('/profile', authenticateToken, async (req, res) => {
    const { full_name, email, phone_number } = req.body;

    try {
        await db.query('UPDATE users SET full_name = ?, email = ?, phone_number = ? WHERE id = ?', [full_name, email, phone_number, req.user.id]);
        res.json({ message: 'Perfil atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar perfil.' });
    }
});

module.exports = router;
