const jwt = require('jsonwebtoken');

// Middleware para verificar o token JWT
function authenticateToken(req, res, next) {
    // O token geralmente é enviado no header 'Authorization'
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  // Remove o prefixo 'Bearer '

    if (!token) {
        // Se o token não for fornecido, retorna o status 401 (não autorizado) com uma mensagem clara
        return res.status(401).json({ error: 'Token não fornecido. Acesso não autorizado.' });
    }

    // Verifica se o token é válido
    jwt.verify(token, 'secretaurelia', (err, user) => {
        if (err) {
            // Se o token for inválido ou expirado, retorna o status 403 (proibido) com mensagem
            return res.status(403).json({ error: 'Token inválido ou expirado.' });
        }

        // Se o token for válido, salva o usuário no objeto `req` e continua para a próxima função
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
