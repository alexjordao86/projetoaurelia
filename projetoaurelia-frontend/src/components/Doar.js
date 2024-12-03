import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Doar() {
    const { campaignId } = useParams(); // Obtém o ID da campanha a partir da URL
    const [campaign, setCampaign] = useState(null); // Estado para armazenar os dados da campanha
    const [price, setPrice] = useState(0); // Estado para o valor da doação
    const [quantity, setQuantity] = useState(1); // Estado para a quantidade (normalmente 1 para doações)

    // URL base do backend obtida da variável de ambiente
    const apiURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

    // Função para buscar os dados da campanha com base no ID
    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                // Faz a requisição GET para buscar os dados da campanha
                const response = await axios.get(`${apiURL}/api/campaigns/${campaignId}`);
                setCampaign(response.data); // Armazena os dados da campanha no estado
            } catch (error) {
                console.error('Erro ao buscar a campanha:', error); // Loga erros no console
            }
        };
        fetchCampaign();
    }, [campaignId, apiURL]); // Reexecuta se o ID da campanha ou a URL base mudar

    // Função para processar a doação
    const handleDonate = async () => {
        console.log('Função handleDonate foi chamada'); // Log para verificar se a função foi chamada

        try {
            // Faz a requisição POST para o backend, enviando os dados da campanha e do pagamento
            const response = await axios.post(`${apiURL}/api/donate`, {
                title: campaign.title, // Usa o título da campanha
                description: campaign.description, // Usa a descrição da campanha
                price, // Usa o valor inserido pelo usuário
                quantity, // Quantidade, normalmente 1 para doações
                campaignId // Envia o ID da campanha para identificar o pagamento
            });

            // Redireciona o usuário para a página de pagamento do Mercado Pago
            window.location.href = response.data.init_point;
        } catch (error) {
            console.error('Erro ao processar a doação:', error); // Loga qualquer erro que ocorra
        }
    };

    // Renderização enquanto os dados da campanha são carregados
    if (!campaign) {
        return <div>Carregando...</div>;
    }

    return (
        <div>
            <h2>Faça uma Doação para a Campanha: {campaign.title}</h2> {/* Exibe o título da campanha */}
            <p>{campaign.description}</p> {/* Exibe a descrição da campanha */}

            {/* Campo para o usuário inserir o valor da doação */}
            <input
                type="number"
                placeholder="Valor"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))} // Atualiza o estado com o valor inserido
            />

            {/* Botão para processar a doação */}
            <button onClick={handleDonate}>Doe Agora</button>
        </div>
    );
}

export default Doar;
