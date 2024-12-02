const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

exports.register = async (req, res) => {
    const { cpf_cnpj, full_name, phone_number, email, password } = req.body;

    // Verifica se todos os campos obrigatórios estão presentes
    if (!cpf_cnpj || !full_name || !email || !password) {
        return res.status(400).json({ error: 'Por favor, preencha todos os campos obrigatórios.' });
    }

    try {
        // Criptografando a senha antes de armazenar
        const hashedPassword = await bcrypt.hash(password, 10);

        // Inserindo o usuário no banco de dados
        const query = `
            INSERT INTO users (cpf_cnpj, full_name, phone_number, email, password_hash) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [cpf_cnpj, full_name, phone_number || null, email, hashedPassword];
        await db.query(query, values);

        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao registrar o usuário' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Por favor, forneça email e senha.' });
    }

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const user = rows[0];

        // Verifica se a senha está correta
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Senha inválida.' });
        }

        // Gera um token JWT para o usuário
        const token = jwt.sign({ id: user.id, email: user.email }, 'seu_secret_key', { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login realizado com sucesso',
            token,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                cpf_cnpj: user.cpf_cnpj,
                phone_number: user.phone_number
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
};
