const mysql = require('mysql2');

// Cria uma conexão com o banco de dados usando o método pool (conexões múltiplas)
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Miami@2011',
    database: process.env.DB_NAME || 'projetoaurelia',
});

// Exporta a conexão como uma Promise para facilitar o uso assíncrono
module.exports = pool.promise();
