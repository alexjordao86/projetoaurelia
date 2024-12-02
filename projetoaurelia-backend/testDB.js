const db = require('./db'); // Importa a configuração do banco de dados

(async () => {
    try {
        const [rows] = await db.query('SHOW TABLES'); // Consulta para listar tabelas
        console.log('Tabelas no banco de dados:', rows); // Exibe as tabelas
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error); // Trata erros
    }
})();
