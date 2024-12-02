// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware'); // Middleware de autenticação
const db = require('../db'); // Conexão com o banco de dados

// Rota para buscar o perfil do usuário logado
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        // Consulta o banco de dados para buscar informações do usuário pelo ID
        const [userResult] = await db.query('SELECT full_name, email, phone_number, cpf_cnpj FROM users WHERE id = ?', [req.user.id]);

        // Consulta para buscar as doações do usuário pelo ID
        const [donationsResult] = await db.query('SELECT campaign_title, amount, date FROM transactions WHERE user_id = ?', [req.user.id]);

        // Verifica se o usuário foi encontrado
        if (!userResult.length) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const user = userResult[0]; // Dados do usuário
        const donations = donationsResult; // Lista de doações do usuário

        // Retorna o perfil do usuário e suas doações
        res.json({ user, donations });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar informações do perfil.' });
    }
});

// Rota para atualizar o perfil do usuário
router.put('/profile', authenticateToken, async (req, res) => {
    const { full_name, email, phone_number } = req.body;

    // Monta a query dinamicamente para atualizar os campos fornecidos
    const fieldsToUpdate = [];
    const values = [];

    if (full_name) {
        fieldsToUpdate.push("full_name = ?");
        values.push(full_name);
    }
    if (email) {
        fieldsToUpdate.push("email = ?");
        values.push(email);
    }
    if (phone_number) {
        fieldsToUpdate.push("phone_number = ?");
        values.push(phone_number);
    }

    values.push(req.user.id); // Adiciona o ID do usuário para a condição da query

    const query = `UPDATE users SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;

    try {
        await db.query(query, values);
        res.json({ message: 'Perfil atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar perfil.' });
    }
});

module.exports = router;
