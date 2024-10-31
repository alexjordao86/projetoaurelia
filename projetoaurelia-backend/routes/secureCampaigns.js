const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware'); // Middleware de autenticação
const db = require('../db'); // Conexão com o banco de dados

// Rota protegida para criação de campanhas (requer autenticação)
router.post('/create', async (req, res) => {
    const { category, title, description, goal, start_date, end_date, image_url } = req.body;

    try {
        // Formatar as datas antes de inserir no banco de dados
        const formattedStartDate = formatDateForMySQL(start_date);
        const formattedEndDate = formatDateForMySQL(end_date);

        // Inserir a nova campanha no banco de dados
        await db.query(
            `INSERT INTO campaigns (category, title, description, goal, start_date, end_date, image_url, current_amount) 
             VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,  // current_amount inicializado com 0
            [category, title, description, goal, formattedStartDate, formattedEndDate, image_url]
        );

        res.status(201).json({
            message: 'Campanha criada com sucesso!',
            data: {
                category,
                title,
                description,
                goal,
                start_date: formattedStartDate,
                end_date: formattedEndDate,
                image_url,
                current_amount: 0
            }
        });
    } catch (error) {
        console.error('Erro ao salvar a campanha no banco de dados:', error);
        res.status(500).json({ error: 'Erro ao salvar a campanha' });
    }
});

// Rota protegida para atualizar uma campanha existente
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { category, title, description, goal, start_date, end_date, image_url } = req.body;

    try {
        const formattedStartDate = formatDateForMySQL(start_date);
        const formattedEndDate = formatDateForMySQL(end_date);

        await db.query(
            `UPDATE campaigns 
             SET category = ?, title = ?, description = ?, goal = ?, start_date = ?, end_date = ?, image_url = ? 
             WHERE id = ?`,
            [category, title, description, goal, formattedStartDate, formattedEndDate, image_url, id]
        );

        res.status(200).json({ message: 'Campanha atualizada com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar a campanha:', error);
        res.status(500).json({ error: 'Erro ao atualizar a campanha' });
    }
});

// Rota protegida para remover uma campanha existente
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('DELETE FROM campaigns WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Campanha não encontrada' });
        }

        res.status(200).json({ message: 'Campanha removida com sucesso!' });
    } catch (error) {
        console.error('Erro ao remover a campanha:', error);
        res.status(500).json({ error: 'Erro ao remover a campanha' });
    }
});

module.exports = router;
