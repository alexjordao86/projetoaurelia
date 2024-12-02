// Importações necessárias para o servidor
const express = require('express'); // Framework Express para facilitar a criação de servidores web
const cors = require('cors'); // Middleware CORS para permitir requisições de origens diferentes
const db = require('./db'); // Conexão com o banco de dados MySQL
const authenticateToken = require('./middleware/authMiddleware'); // Middleware para autenticação de rotas protegidas

// Importa os módulos de rotas
const adminAuthRoutes = require('./routes/auth'); // Rotas de autenticação para administradores
const userAuthRoutes = require('./routes/authRoutes'); // Rotas de autenticação para usuários regulares
const paymentRoutes = require('./routes/payment'); // Rotas relacionadas a pagamentos
const campaignsRoutes = require('./routes/campaigns'); // Rotas de campanhas públicas
const secureCampaignRoutes = require('./routes/secureCampaigns'); // Rotas protegidas que requerem autenticação
const userRoutes = require('./routes/userRoutes'); // Rotas de perfil de usuário
const envioHistoriaRoutes = require('./routes/envioHistoria'); // Rotas para envio de histórias

// Inicializa o aplicativo Express
const app = express();

// Configuração da porta do servidor
const port = process.env.PORT || 4000; // Define a porta do servidor (4000 como padrão)

// Middleware para ativar CORS
app.use(cors({
    origin: '*', // Permite requisições de qualquer origem
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
}));

// Middleware para parsing de JSON no corpo das requisições
app.use(express.json());

// Middleware para registrar as requisições no console
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // Passa para o próximo middleware ou rota
});

// Configuração para servir arquivos estáticos da pasta 'uploads/'
app.use('/uploads', express.static('uploads')); // Permite acesso direto aos arquivos em 'uploads/'

// Rota de teste para verificar a conexão com o banco de dados
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        res.json({ solution: rows[0].solution }); // Retorna o resultado da consulta
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        res.status(500).json({ error: 'Erro ao conectar ao banco de dados' });
    }
});

// Rota de teste para verificar se o servidor está funcionando
app.get('/test', (req, res) => {
    res.send('Rota de teste funcionando!');
});

// Define as rotas com os respectivos prefixos
app.use('/api/admin/auth', adminAuthRoutes); // Rotas de autenticação para administradores
app.use('/api/auth', userAuthRoutes); // Rotas de autenticação para usuários regulares
app.use('/api/payment', paymentRoutes); // Rotas relacionadas a pagamentos
app.use('/api/campaigns', campaignsRoutes); // Rotas de campanhas públicas
app.use('/api/secure-campaigns', authenticateToken, secureCampaignRoutes); // Rotas protegidas de campanhas
app.use('/api/user', userRoutes); // Rotas de perfil de usuário
app.use(envioHistoriaRoutes); // Rotas para envio de histórias

// Middleware para tratar erros relacionados ao CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Permite requisições de qualquer origem
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Permite métodos HTTP
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Permite cabeçalhos
    next();
});

// Middleware para tratar requisições OPTIONS prévias do navegador
app.options('*', cors());

// Inicializa o servidor e escuta na porta configurada
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
