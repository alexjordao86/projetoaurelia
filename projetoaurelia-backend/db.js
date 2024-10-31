const mysql = require('mysql2');

// Cria uma conexão com o banco de dados usando o método pool (conexões múltiplas)
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',           // Substitua pelo seu usuário MySQL
    password: 'Miami@2011',  // Substitua pela sua senha MySQL
    database: 'projetoaurelia'  // Nome do banco de dados que você criou
});

// Exporta a conexão como uma Promise para facilitar o uso assíncrono
module.exports = pool.promise();
