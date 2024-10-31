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
router.post('/login', async (req, res) => {
    const { email, password } = req.body;  // Extrai email e senha do corpo da requisição

    try {
        // Verifica se o administrador existe no banco de dados
        const [admin] = await db.query('SELECT * FROM admin WHERE email = ?', [email]);
        if (admin.length === 0) {
            return res.status(400).json({ error: 'Credenciais inválidas' });  // Retorna erro se o administrador não existir
        }

        // Compara a senha fornecida com a senha armazenada no banco de dados
        const isPasswordValid = await bcrypt.compare(password, admin[0].password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Credenciais inválidas' });  // Retorna erro se as senhas não coincidirem
        }

        // Gera um token JWT com o ID do administrador
        const token = jwt.sign({ id: admin[0].id }, 'seu_secret_key', { expiresIn: '1h' });

        res.json({ token });  // Retorna o token de autenticação
    } catch (error) {
        // Caso ocorra algum erro durante o processo, loga o erro e retorna uma resposta de erro
        res.status(500).json({ error: 'Erro no login' });
    }
});

module.exports = router;  // Exporta as rotas para serem usadas no arquivo principal do servidor
