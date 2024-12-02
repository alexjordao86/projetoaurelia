console.log('Roteador admin carregado!'); // Mensagem para confirmar que o arquivo foi carregado

require('dotenv').config();             // Carrega as variáveis de ambiente do arquivo .env
const express = require('express');      // Importa o framework Express
const bcrypt = require('bcryptjs');      // Importa o bcrypt para hash de senhas
const jwt = require('jsonwebtoken');     // Importa o JWT para gerar tokens de autenticação
const db = require('../db');             // Importa a conexão com o banco de dados
const router = express.Router();         // Cria um roteador para gerenciar as rotas

// Rota de registro de administradores
router.post('/register', async (req, res) => {
    console.log('Requisição recebida em /register'); // Loga que a rota foi chamada
    const { email, password } = req.body;            // Extrai email e senha do corpo da requisição

    console.log('Dados recebidos:', { email, password }); // Loga os dados recebidos para verificar se estão corretos

    try {
        // Verifica se o administrador já existe no banco de dados
        const [existingAdmin] = await db.query('SELECT * FROM admin WHERE email = ?', [email]);
        if (existingAdmin.length > 0) {
            console.log('Administrador já existe');   // Loga caso o administrador já esteja registrado
            return res.status(400).json({ error: 'Administrador já existe' });
        }

        // Gera um hash da senha usando bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insere o administrador no banco de dados com o email e a senha hasheada
        await db.query('INSERT INTO admin (email, password) VALUES (?, ?)', [email, hashedPassword]);

        console.log('Administrador registrado com sucesso');  // Loga que o administrador foi registrado com sucesso
        res.status(201).json({ message: 'Administrador registrado com sucesso' });
    } catch (error) {
        // Caso ocorra algum erro durante o processo, loga o erro e retorna uma resposta de erro
        console.error('Erro ao registrar o administrador:', error);
        res.status(500).json({ error: 'Erro ao registrar o administrador' });
    }
});

// Rota de login de administradores
// Define uma rota POST para o endpoint '/login'
router.post('/login', async (req, res) => {
    // Extrai os campos 'email' e 'password' do corpo da requisição
    const { email, password } = req.body;

    try {
        // Consulta o banco de dados para verificar se existe um administrador com o email fornecido
        const [admin] = await db.query('SELECT * FROM admin WHERE email = ?', [email]);

        // Se nenhum administrador for encontrado, retorna uma resposta com status 400 e mensagem de erro
        if (admin.length === 0) {
            return res.status(400).json({ error: 'Credenciais inválidas' });
        }

        // Compara a senha fornecida com a senha armazenada no banco de dados usando bcrypt
        const isPasswordValid = await bcrypt.compare(password, admin[0].password);

        // Se a senha estiver incorreta, retorna uma resposta com status 400 e mensagem de erro
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Credenciais inválidas' });
        }

        // Gera um token JWT usando o ID do administrador e a chave secreta definida no arquivo .env
        // O token expira em 1 hora
        const token = jwt.sign({ id: admin[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Retorna o token gerado como resposta
        res.json({ token });
    } catch (error) {
        // Em caso de erro durante o processo, retorna uma resposta com status 500 e uma mensagem de erro genérica
        res.status(500).json({ error: 'Erro no login' });
    }
});

module.exports = router;  // Exporta as rotas para serem usadas no arquivo principal do servidor
