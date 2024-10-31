const express = require('express');  // Importa o framework Express
const db = require('./db');          // Importa a conexão com o banco de dados MySQL
const authRoutes = require('./routes/authRoutes');  // Importa as rotas de autenticação
const paymentRoutes = require('./routes/payment');  // Importa as rotas de pagamento
const campaignsRoutes = require('./routes/campaigns');  // Importa as rotas de campanhas
const cors = require('cors');        // Importa o middleware CORS
const authenticateToken = require('./middleware/authMiddleware');  // Importa o middleware de autenticação

const app = express();               // Cria uma instância da aplicação Express
const port = process.env.PORT || 4000;  // Define a porta em que o servidor vai rodar (4000 por padrão)

app.use(cors());  // Adiciona suporte ao CORS
app.use(express.json());  // Middleware que permite ao Express processar requisições com o corpo no formato JSON

// Middleware para logar todas as requisições recebidas (método e URL)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);  // Loga o método HTTP e a URL da requisição
    next();  // Passa para o próximo middleware ou rota
});

// Rota de teste para verificar a conexão com o banco de dados
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        res.json({ solution: rows[0].solution });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao conectar ao banco de dados' });
    }
});

// Rota de teste simples para verificar se o servidor está funcionando
app.get('/test', (req, res) => {
    res.send('Rota de teste funcionando!');
});

// Usa as rotas de autenticação definidas no arquivo 'authRoutes.js'
app.use('/api/auth', authRoutes);

// Usa as rotas de pagamento com o prefixo '/api'
app.use('/api', paymentRoutes);

// Usa as rotas de campanhas com o prefixo '/api/campaigns' sem autenticação
app.use('/api/campaigns', campaignsRoutes);

// Aplica autenticação apenas às rotas que necessitam de proteção
const secureCampaignRoutes = require('./routes/secureCampaigns'); // Novo módulo para rotas protegidas de campanhas
app.use('/api/secure-campaigns', authenticateToken, secureCampaignRoutes);

// Inicia o servidor e o faz escutar na porta definida
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
