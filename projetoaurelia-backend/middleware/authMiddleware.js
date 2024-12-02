// Carrega as variáveis de ambiente do arquivo .env para uso no projeto
require('dotenv').config();             
const jwt = require('jsonwebtoken');     // Importa o JWT para verificar tokens de autenticação

// Middleware para verificar o token JWT
function authenticateToken(req, res, next) {
    // O token é enviado geralmente no cabeçalho 'Authorization' da requisição
    const authHeader = req.headers['authorization'];
    // Extrai o token removendo o prefixo 'Bearer', se estiver presente
    const token = authHeader && authHeader.split(' ')[1];

    // Verifica se o token foi fornecido
    if (!token) {
        // Se o token não for fornecido, retorna o status 401 (não autorizado) com uma mensagem clara
        return res.status(401).json({ error: 'Token não fornecido. Acesso não autorizado.' });
    }

    // Verifica se o token é válido usando a chave secreta definida no arquivo .env
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // Se o token for inválido ou expirado, retorna o status 403 (proibido) com mensagem de erro
            return res.status(403).json({ error: 'Token inválido ou expirado.' });
        }

        // Se o token for válido, salva as informações decodificadas do usuário no objeto req
        req.user = user;  // user contém os dados do payload, incluindo id, email, etc.

        // Passa o controle para a próxima função ou rota
        next();
    });
}

module.exports = authenticateToken; // Exporta o middleware para ser utilizado em rotas protegidas