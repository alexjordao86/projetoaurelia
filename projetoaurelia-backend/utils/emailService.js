// utils/emailService.js

const nodemailer = require('nodemailer');  // Certifique-se de instalar o nodemailer com: npm install nodemailer

// Configuração do transporte de email
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Altere para o serviço de email desejado
    auth: {
        user: process.env.EMAIL_USER,  // Adicione este email ao seu .env
        pass: process.env.EMAIL_PASS   // Adicione esta senha ao seu .env
    }
});

// Função para enviar email
async function sendEmail(to, subject, text) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email enviado com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar email:', error);
    }
}

module.exports = { sendEmail };
