const express = require('express');          // Importa o framework Express
const router = express.Router();             // Cria um roteador para gerenciar as rotas
const axios = require('axios');              // Importa o Axios para fazer requisições HTTP
const db = require('../db');                 // Importa a conexão com o banco de dados

// Rota para processar pagamentos via Mercado Pago
router.post('/donate', async (req, res) => {
    // Desestrutura os dados enviados no corpo da requisição
    const { title, description, price, quantity, campaignId } = req.body;

    console.log('Iniciando processo de doação'); 
    console.log('Dados recebidos:', { title, description, price, quantity, campaignId });

    try {
        // Busca a campanha no banco de dados com base no ID da campanha
        const [campaign] = await db.query('SELECT * FROM campaigns WHERE id = ?', [campaignId]);
        if (campaign.length === 0) {
            console.log('Campanha não encontrada'); 
            return res.status(404).json({ error: 'Campanha não encontrada' });
        }

        // Criação da preferência de pagamento com dados do item
        let preference = {
            items: [
                {
                    title: title,
                    description: description,
                    unit_price: Number(price),
                    quantity: Number(quantity)
                }
            ],
            back_urls: {
                success: "http://localhost:4000/api/payment/success",
                failure: "http://localhost:4000/api/payment/failure",
                pending: "http://localhost:4000/api/payment/pending"
            },
            auto_return: "approved",
            external_reference: JSON.stringify({ campaignId, amount: price * quantity })
        };

        // Requisição para a API do Mercado Pago para criar a preferência
        const response = await axios.post('https://api.mercadopago.com/checkout/preferences', preference, {
            headers: {
                'Authorization': `Bearer APP_USR-1436644650565354-100910-74491b83e530823fc38f8fe891c94ccc-30877279`
            }
        });

        console.log('Preferência de pagamento criada com sucesso:', response.data); 

        // Retorna o ID da preferência e a URL para pagamento
        res.status(200).json({
            id: response.data.id,
            init_point: response.data.init_point
        });
    } catch (error) {
        console.error('Erro ao criar a preferência de pagamento:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Erro ao processar o pagamento' });
    }
});

// Rota para lidar com o sucesso da transação
router.get('/success', async (req, res) => {
    console.log('Dados recebidos na rota /success:', req.query);
    const { payment_id, status, merchant_order_id, external_reference } = req.query;

    // Extração dos dados do campo external_reference
    const { campaignId, amount } = JSON.parse(external_reference || '{}');

    // Verifica se todos os dados necessários estão presentes
    if (!payment_id || !status || !merchant_order_id || !campaignId || !amount) {
        console.error('Dados insuficientes na rota /success:', req.query);
        return res.status(400).send('Dados insuficientes para salvar a transação.');
    }

    try {
        // Salva os detalhes da transação no banco de dados
        await db.query(
            'INSERT INTO transactions (payment_id, status, merchant_order_id, campaign_id, amount) VALUES (?, ?, ?, ?, ?)',
            [payment_id, status, merchant_order_id, campaignId, amount]
        );
        console.log('Transação salva no banco de dados.');
        res.send('Pagamento realizado com sucesso e salvo no banco de dados!');
    } catch (error) {
        console.error('Erro ao salvar a transação no banco de dados:', error);
        res.status(500).send('Erro ao salvar a transação.');
    }
});

// Rota para lidar com falha de pagamento
router.get('/failure', (req, res) => {
    console.log('Pagamento falhou:', req.query); 
    res.send('Pagamento falhou. Por favor, tente novamente.');
});

// Rota para lidar com pagamento pendente
router.get('/pending', async (req, res) => {
    console.log('Pagamento pendente:', req.query); 
    const { payment_id, status, merchant_order_id, external_reference } = req.query;

    const { campaignId, amount } = JSON.parse(external_reference || '{}');

    if (!payment_id || !status || !merchant_order_id || !campaignId || !amount) {
        console.error('Dados insuficientes para registrar pagamento pendente:', req.query);
        return res.status(400).send('Dados insuficientes para registrar o pagamento pendente.');
    }

    try {
        // Salva a transação pendente no banco de dados
        await db.query(
            'INSERT INTO transactions (payment_id, status, merchant_order_id, campaign_id, amount) VALUES (?, ?, ?, ?, ?)',
            [payment_id, status, merchant_order_id, campaignId, amount]
        );
        console.log('Pagamento pendente registrado no banco de dados.');
        res.send('Pagamento pendente registrado.');
    } catch (error) {
        console.error('Erro ao registrar o pagamento pendente:', error);
        res.status(500).send('Erro ao registrar o pagamento pendente.');
    }
});

// Implementando o Webhook para receber notificações do Mercado Pago
router.post('/webhook', async (req, res) => {
    const { action, data } = req.body;
    console.log('Webhook recebido:', req.body); 

    try {
        if (action === 'payment.updated') {
            const paymentId = data.id;

            // Requisição para obter detalhes do pagamento na API do Mercado Pago
            const paymentInfo = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                headers: {
                    'Authorization': `Bearer APP_USR-1436644650565354-100910-74491b83e530823fc38f8fe891c94ccc-30877279`
                }
            });

            const status = paymentInfo.data.status;

            // Atualiza o status da transação no banco de dados
            await db.query('UPDATE transactions SET status = ? WHERE payment_id = ?', [status, paymentId]);
            console.log('Status de pagamento atualizado no banco de dados.');
            res.status(200).send('Status de pagamento atualizado com sucesso.');
        } else {
            console.log('Ação de webhook não suportada:', action); 
            res.status(400).send('Ação do Webhook não suportada.');
        }
    } catch (error) {
        console.error('Erro ao processar o Webhook do Mercado Pago:', error); 
        res.status(500).send('Erro ao processar o Webhook.');
    }
});

module.exports = router; // Exporta o roteador para uso no servidor principal
