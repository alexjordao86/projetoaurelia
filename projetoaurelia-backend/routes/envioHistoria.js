const express = require('express'); // Importa o módulo Express para criar o roteador
const multer = require('multer'); // Importa o multer para lidar com uploads de arquivos
const path = require('path'); // Importa o módulo path para manipular caminhos de arquivos
const fs = require('fs'); // Importa o módulo fs para manipulação do sistema de arquivos
const mysql = require('mysql2/promise'); // Importa mysql2 para executar consultas no banco de dados
const nodemailer = require('nodemailer'); // Importa o Nodemailer para envio de e-mails
const router = express.Router(); // Cria uma instância do roteador

// Configuração do banco de dados
const db = mysql.createPool({
  host: 'localhost', // Endereço do servidor de banco de dados
  user: 'root', // Nome de usuário do banco de dados
  password: 'Miami@2011', // Senha do banco de dados
  database: 'projetoaurelia', // Nome do banco de dados
});

// Verifica e cria o diretório 'uploads/' se ele não existir
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Cria o diretório de forma recursiva
  console.log(`Diretório '${uploadDir}' criado com sucesso.`);
}

// Função para sanitizar nomes de arquivos
const sanitizeFilename = (filename) => {
  return filename
    .normalize('NFD') // Remove acentuação
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Substitui caracteres especiais por "_"
    .replace(/_+/g, '_') // Substitui múltiplos "_" por um único
    .toLowerCase(); // Converte para minúsculas
};

// Configuração do armazenamento de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Define o diretório onde os arquivos serão armazenados
  },
  filename: (req, file, cb) => {
    const sanitizedFilename = sanitizeFilename(file.originalname); // Sanitiza o nome do arquivo
    cb(null, `${Date.now()}-${sanitizedFilename}`); // Define o nome do arquivo com timestamp
  },
});

// Configuração do filtro de arquivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4']; // Tipos de arquivos permitidos
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Aceita o arquivo se for do tipo permitido
  } else {
    cb(new Error('Formato de arquivo não suportado!')); // Rejeita o arquivo se o tipo não for permitido
  }
};

// Configuração do middleware multer
const upload = multer({
  storage: storage, // Define o armazenamento configurado
  fileFilter: fileFilter, // Aplica o filtro para aceitar apenas tipos permitidos
  limits: { fileSize: 10 * 1024 * 1024 }, // Limita o tamanho dos arquivos para 10 MB
});

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Serviço de e-mail usado (Gmail)
  auth: {
    user: 'lettertoalexsilva@gmail.com', // Seu e-mail
    pass: 'npee iqjr ttha xuyg', // Senha de aplicativo gerada no Gmail
  },
});

// Rota para envio de histórias
router.post('/api/envio-historia', upload.array('arquivos', 5), async (req, res) => {
  try {
    const { nome, instituicao, documento, email, telefone, endereco, historia } = req.body;

    // Mapeia os nomes dos arquivos enviados e garante que é JSON válido
    let arquivos = [];
    if (req.files && req.files.length > 0) {
      arquivos = req.files.map((file) => file.filename);
    }
    const arquivosJson = JSON.stringify(arquivos); // Garante que será salvo como JSON válido

    // Consulta SQL para inserir os dados no banco de dados
    const query = `
      INSERT INTO historias 
      (nome, instituicao, documento, email, telefone, endereco, historia, arquivos) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [nome, instituicao, documento, email, telefone, endereco, historia, arquivosJson];

    // Executa a consulta SQL
    await db.execute(query, values);

    // Configuração do e-mail para notificar o administrador
    const mailOptions = {
      from: 'lettertoalexsilva@gmail.com', // Remetente
      to: 'lettertoalexsilva@gmail.com', // Destinatário
      subject: 'Nova História Submetida', // Assunto do e-mail
      html: `
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Instituição:</strong> ${instituicao}</p>
        <p><strong>Documento:</strong> ${documento}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${telefone}</p>
        <p><strong>Endereço:</strong> ${endereco}</p>
        <p><strong>História:</strong> ${historia}</p>
      `,
    };

    // Envia o e-mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erro ao enviar e-mail:', error);
      } else {
        console.log('E-mail enviado:', info.response);
      }
    });

    res.status(201).json({ message: 'História enviada com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar a história:', error);
    res.status(500).json({ error: 'Erro ao salvar a história.' });
  }
});

// Rota para listar todas as histórias
router.get('/api/historias', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM historias ORDER BY data_envio DESC');
    res.status(200).json(rows); // Retorna as histórias em formato JSON
  } catch (error) {
    console.error('Erro ao buscar histórias:', error);
    res.status(500).json({ error: 'Erro ao buscar histórias.' });
  }
});

module.exports = router;
