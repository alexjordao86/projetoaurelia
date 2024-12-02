const express = require('express'); // Importa o framework Express
const router = express.Router(); // Cria um roteador para gerenciar as rotas
const authenticateToken = require('../middleware/authMiddleware'); // Middleware para autenticação via JWT
const db = require('../db'); // Importa a conexão com o banco de dados

// Lista de categorias permitidas para campanhas
const CATEGORIES = ['Educação', 'Emergenciais', 'Empatia', 'Esporte', 'Geração de Renda', 'Moradia', 'Projetos Sociais', 'Saúde'];

// Função utilitária para formatar datas no formato compatível com MySQL (YYYY-MM-DD)
function formatDateForMySQL(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

// Rota para criar campanhas
router.post('/create', authenticateToken, async (req, res) => {
    // Extrai os dados necessários do corpo da requisição
    const { category, title, description, goal, start_date, end_date, image_url } = req.body;

    try {
        // Verifica se a categoria fornecida é válida
        if (!CATEGORIES.includes(category)) {
            return res.status(400).json({ error: 'Categoria inválida!' });
        }

        // Formata as datas de início e término para o formato MySQL
        const formattedStartDate = formatDateForMySQL(start_date);
        const formattedEndDate = formatDateForMySQL(end_date);

        // Insere a nova campanha no banco de dados
        const result = await db.query(
            `INSERT INTO campaigns (category, title, description, goal, start_date, end_date, image_url, current_amount) 
             VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
            [category, title, description, goal, formattedStartDate, formattedEndDate, image_url]
        );

        // Retorna uma resposta de sucesso com o ID da nova campanha
        res.status(201).json({ message: 'Campanha criada com sucesso!', campaignId: result.insertId });
    } catch (error) {
        console.error('Erro ao criar campanha:', error); // Loga o erro no console
        res.status(500).json({ error: 'Erro ao criar campanha' }); // Retorna erro genérico ao cliente
    }
});

// Rota para listar todas as campanhas, ordenadas por mais recentes
router.get('/list', async (req, res) => {
    try {
        const [campaigns] = await db.query('SELECT * FROM campaigns ORDER BY created_at DESC'); // Busca campanhas
        res.json(campaigns); // Retorna a lista de campanhas como resposta
    } catch (error) {
        console.error('Erro ao listar campanhas:', error); // Loga o erro no console
        res.status(500).json({ error: 'Erro ao listar campanhas' }); // Retorna erro genérico ao cliente
    }
});

// Rota para listar as novidades associadas a uma campanha específica
router.get('/:id/updates', async (req, res) => {
    const { id } = req.params; // Extrai o ID da campanha dos parâmetros da rota

    try {
        const [updates] = await db.query(
            'SELECT * FROM campaign_updates WHERE campaign_id = ? ORDER BY created_at DESC',
            [id]
        ); // Busca as novidades
        res.json(updates); // Retorna a lista de novidades
    } catch (error) {
        console.error('Erro ao listar novidades:', error); // Loga o erro no console
        res.status(500).json({ error: 'Erro ao listar novidades' }); // Retorna erro genérico ao cliente
    }
});

// Rota para adicionar uma novidade a uma campanha
router.post('/:id/updates', authenticateToken, async (req, res) => {
    const { id } = req.params; // Extrai o ID da campanha dos parâmetros da rota
    const { update_text } = req.body; // Extrai o texto da novidade do corpo da requisição

    try {
        await db.query(
            `INSERT INTO campaign_updates (campaign_id, update_text) 
             VALUES (?, ?)`,
            [id, update_text]
        ); // Insere a novidade no banco de dados
        res.status(201).json({ message: 'Novidade adicionada com sucesso!' }); // Retorna sucesso
    } catch (error) {
        console.error('Erro ao adicionar novidade:', error); // Loga o erro no console
        res.status(500).json({ error: 'Erro ao adicionar novidade' }); // Retorna erro genérico ao cliente
    }
});

// Rota para editar campanhas existentes
router.put('/update/:id', authenticateToken, async (req, res) => {
    const { id } = req.params; // Extrai o ID da campanha dos parâmetros da rota
    const { category, title, description, goal, start_date, end_date, image_url } = req.body; // Extrai os dados da requisição

    try {
        // Verifica se a categoria fornecida é válida
        if (!CATEGORIES.includes(category)) {
            return res.status(400).json({ error: 'Categoria inválida!' });
        }

        // Formata as datas para o formato MySQL
        const formattedStartDate = formatDateForMySQL(start_date);
        const formattedEndDate = formatDateForMySQL(end_date);

        // Atualiza a campanha no banco de dados
        await db.query(
            `UPDATE campaigns 
             SET category = ?, title = ?, description = ?, goal = ?, start_date = ?, end_date = ?, image_url = ?
             WHERE id = ?`,
            [category, title, description, goal, formattedStartDate, formattedEndDate, image_url, id]
        );

        res.status(200).json({ message: 'Campanha atualizada com sucesso!' }); // Retorna sucesso
    } catch (error) {
        console.error('Erro ao atualizar campanha:', error); // Loga o erro no console
        res.status(500).json({ error: 'Erro ao atualizar campanha' }); // Retorna erro genérico ao cliente
    }
});

// Rota para buscar os detalhes de uma campanha específica
router.get('/:id', async (req, res) => {
    const { id } = req.params; // Extrai o ID da campanha dos parâmetros da rota

    try {
        const [campaign] = await db.query('SELECT * FROM campaigns WHERE id = ?', [id]); // Busca a campanha

        // Verifica se a campanha foi encontrada
        if (campaign.length === 0) {
            return res.status(404).send('Campanha não encontrada'); // Retorna erro 404 se não encontrada
        }

        // Atualiza o status da campanha se o prazo estiver encerrado
        const currentDate = new Date();
        const endDate = new Date(campaign[0].end_date);

        if (currentDate > endDate) {
            campaign[0].status = 'Encerrada';
        }

        res.json(campaign[0]); // Retorna os detalhes da campanha
    } catch (error) {
        console.error('Erro ao buscar campanha:', error); // Loga o erro no console
        res.status(500).json({ error: 'Erro ao buscar campanha' }); // Retorna erro genérico ao cliente
    }
});

module.exports = router; // Exporta as rotas para uso no app principal
