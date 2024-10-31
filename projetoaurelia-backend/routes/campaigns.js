const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware'); // Middleware de autenticação
const db = require('../db'); // Conexão com o banco de dados

// Função para formatar a data corretamente para o MySQL
function formatDateForMySQL(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];  // Retorna no formato 'YYYY-MM-DD'
}

// Rota protegida para criação de campanhas (requer autenticação)
router.post('/create', authenticateToken, async (req, res) => {
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

// Rota para listar todas as campanhas (não requer autenticação)
router.get('/list', async (req, res) => {
    try {
        // Consulta o banco de dados para obter todas as campanhas
        const [campaigns] = await db.query('SELECT * FROM campaigns');
        res.json(campaigns);  // Retorna as campanhas em formato JSON
    } catch (error) {
        console.error('Erro ao listar as campanhas:', error);
        res.status(500).json({ error: 'Erro ao listar as campanhas' });
    }
});

// Rota protegida para atualizar uma campanha existente (requer autenticação)
router.put('/update/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { category, title, description, goal, start_date, end_date, image_url } = req.body;

    try {
        // Formatar as datas antes de atualizar no banco de dados
        const formattedStartDate = formatDateForMySQL(start_date);
        const formattedEndDate = formatDateForMySQL(end_date);

        // Atualiza a campanha no banco de dados com base no ID fornecido
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

// Rota protegida para remover uma campanha existente (requer autenticação)
router.delete('/delete/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        // Exclui a campanha do banco de dados com base no ID fornecido
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

// Rota dinâmica para exibir uma campanha específica (não requer autenticação)
router.get('/:id', async (req, res) => {
    const { id } = req.params;  // Obtém o ID da campanha a partir da URL
    
    try {
        // Consulta o banco de dados para obter os detalhes da campanha
        const [campaign] = await db.query('SELECT * FROM campaigns WHERE id = ?', [id]);
        
        if (campaign.length === 0) {
            return res.status(404).send('Campanha não encontrada');
        }

        // Retorna os dados da campanha em formato JSON
        res.json(campaign[0]);
    } catch (error) {
        console.error('Erro ao buscar campanha:', error);
        res.status(500).json({ error: 'Erro ao buscar campanha' });
    }
});

module.exports = router;
