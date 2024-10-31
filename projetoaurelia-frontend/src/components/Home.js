import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
    const [campaigns, setCampaigns] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Busca campanhas do backend e limita a exibição a 6 campanhas
        const fetchCampaigns = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/campaigns/list');
                setCampaigns(response.data.slice(0, 6));  // Exibe apenas os primeiros 6 cards
            } catch (error) {
                console.error('Erro ao listar campanhas:', error);
            }
        };
        fetchCampaigns();
    }, []);

    const handleCardClick = (campaignId) => {
        navigate(`/campaign/${campaignId}`);
    };

    return (
        <div>
            {/* Removi a navbar aqui, já que ela está sendo gerada globalmente no App.js */}
            
            <h1>Bem-vindo à Página Inicial!</h1>

            {/* Seção dos Cards */}
            <section className="chakra-container">
                <ul className="campaigns-grid">
                    {campaigns.map((campaign, index) => (
                        <li key={index} className="campaign-card" onClick={() => handleCardClick(campaign.id)}>
                            <article className="chakra-linkbox">
                                <div className="campaign-content">
                                    <img src={campaign.image_url} alt={campaign.title} />
                                    <div className="campaign-details">
                                        <p className="campaign-category">{campaign.category}</p>
                                        <a href={`/campaign/${campaign.id}`} className="campaign-title">{campaign.title}</a>
                                        <div className="campaign-progress">
                                            <span>{calculateRemainingDays(campaign.end_date)} dias restantes</span>
                                            <span>{Math.floor((campaign.current_amount / campaign.goal) * 100)}%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${(campaign.current_amount / campaign.goal) * 100}%` }}></div>
                                        </div>
                                        <div className="campaign-goal">
                                            <p>R$ {campaign.current_amount.toLocaleString()}</p>
                                            <p>Meta de R$ {campaign.goal.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </li>
                    ))}
                </ul>

                {/* Botão Ver Mais */}
                <a className="view-more-button" href="/campanhas">
                    Ver mais
                    <span className="button-icon">
                        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true" height="14" width="14">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7-7 7M3 12h18"></path>
                        </svg>
                    </span>
                </a>
            </section>
        </div>
    );
}

// Função para calcular dias restantes
const calculateRemainingDays = (endDate) => {
    const currentDate = new Date();
    const end = new Date(endDate);
    const remainingTime = end - currentDate;
    return Math.max(0, Math.floor(remainingTime / (1000 * 60 * 60 * 24)));
};

export default Home;
