const express = require('express');  
const router = express.Router();  
const axios = require('axios');  
const db = require('../db');  

// Rota para processar pagamentos via Mercado Pago
router.post('/donate', async (req, res) => {
    // Desestruturando os dados enviados no corpo da requisição
    const { title, description, price, quantity, campaignId } = req.body;  // Incluímos o campaignId para identificação

    try {
        // Busca a campanha no banco de dados com base no ID da campanha
        const [campaign] = await db.query('SELECT * FROM campaigns WHERE id = ?', [campaignId]);

        if (campaign.length === 0) {
            return res.status(404).json({ error: 'Campanha não encontrada' });
        }

        // Criando a preferência de pagamento, que contém as informações sobre o item
        let preference = {
            items: [
                {
                    title: title,  // Título da campanha
                    description: description,  // Descrição da campanha
                    unit_price: Number(price),  // Preço do item
                    quantity: Number(quantity)  // Quantidade (normalmente 1 para doações)
                }
            ],
            // URLs para onde o usuário será redirecionado após o pagamento
            back_urls: {
                success: "http://localhost:4000/api/payment/success",  // URL de sucesso
                failure: "http://localhost:4000/api/payment/failure",  // URL de falha
                pending: "http://localhost:4000/api/payment/pending"   // URL de pendência
            },
            auto_return: "approved"  // Retorno automático ao site após aprovação
        };

        // Fazendo uma requisição POST para a API do Mercado Pago para criar a preferência
        const response = await axios.post('https://api.mercadopago.com/checkout/preferences', preference, {
            headers: {
                'Authorization': `Bearer APP_USR-1436644650565354-100910-74491b83e530823fc38f8fe891c94ccc-30877279`  // Access Token do Mercado Pago
            }
        });

        // Retorna o ID da preferência e o link para redirecionar o usuário para o pagamento
        res.status(200).json({
            id: response.data.id,  // ID da preferência de pagamento
            init_point: response.data.init_point  // URL para redirecionar o usuário ao checkout do Mercado Pago
        });
    } catch (error) {
        // Loga o erro detalhado caso ocorra um problema ao criar a preferência de pagamento
        console.error('Erro ao criar a preferência de pagamento:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Erro ao processar o pagamento' });
    }
});

// Rota para lidar com o sucesso da transação
router.get('/success', async (req, res) => {
    console.log('Dados recebidos na rota /success:', req.query);  // Log dos dados recebidos na rota de sucesso
    const { payment_id, status, merchant_order_id } = req.query;  // Atualizado para merchant_order_id

    try {
        // Salva os detalhes da transação no banco de dados
        await db.query('INSERT INTO transactions (payment_id, status, merchant_order_id) VALUES (?, ?, ?)', [
            payment_id, status, merchant_order_id
        ]);
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
    
    const { payment_id, status, merchant_order_id } = req.query;  // Atualizado para merchant_order_id

    try {
        // Opcionalmente, você pode salvar a transação como pendente no banco de dados
        await db.query('INSERT INTO transactions (payment_id, status, merchant_order_id) VALUES (?, ?, ?)', [
            payment_id, status, merchant_order_id
        ]);

        res.send('Pagamento pendente registrado.');
    } catch (error) {
        console.error('Erro ao registrar o pagamento pendente:', error);
        res.status(500).send('Erro ao registrar o pagamento pendente.');
    }
});

// Implementando o Webhook para receber notificações do Mercado Pago
router.post('/webhook', async (req, res) => {
    const { action, data } = req.body;
    console.log('Webhook recebido:', req.body);  // Loga a notificação recebida

    try {
        if (action === 'payment.updated') {
            const paymentId = data.id;

            // Faz uma requisição à API do Mercado Pago para obter detalhes do pagamento
            const paymentInfo = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                headers: {
                    'Authorization': `Bearer APP_USR-1436644650565354-100910-74491b83e530823fc38f8fe891c94ccc-30877279`  // Access Token do Mercado Pago
                }
            });

            const status = paymentInfo.data.status;  // Status do pagamento (ex: "approved", "rejected", etc.)
            
            // Atualiza o status da transação no banco de dados
            await db.query('UPDATE transactions SET status = ? WHERE payment_id = ?', [status, paymentId]);

            res.status(200).send('Status de pagamento atualizado com sucesso.');
        } else {
            res.status(400).send('Ação do Webhook não suportada.');
        }
    } catch (error) {
        console.error('Erro ao processar o Webhook do Mercado Pago:', error);
        res.status(500).send('Erro ao processar o Webhook.');
    }
});

module.exports = router;
