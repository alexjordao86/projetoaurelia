import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Campanhas.css';  // Estilos específicos para o layout
import { useNavigate } from 'react-router-dom';

function Campanhas() {
  const [campaigns, setCampaigns] = useState([]); // Estado para armazenar as campanhas
  const [categories] = useState([
    'Todos', 'Educação', 'Emergenciais', 'Empatia', 'Esporte', 'Geração de Renda', 'Moradia', 'Projetos Sociais', 'Saúde'
  ]);
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    // Função para buscar campanhas do backend
    const fetchCampaigns = async () => {
      try {
        // Fazendo a requisição GET sem autenticação
        const response = await axios.get('http://localhost:4000/api/campaigns/list');
        setCampaigns(response.data); // Atualiza o estado com as campanhas recebidas
      } catch (error) {
        console.error('Erro ao listar campanhas:', error);
      }
    };
    fetchCampaigns(); // Chama a função ao montar o componente
  }, []);

  // Função para redirecionar para a página da campanha específica ao clicar no card
  const handleCardClick = (campaignId) => {
    navigate(`/campaign/${campaignId}`);
  };

  return (
    <section className="chakra-container">
      {/* Barra de rolagem horizontal para categorias */}
      <div className="categories-scroll">
        <div className="scroll-arrow scroll-left">
          <button aria-label="Scroll Left" className="scroll-button">
            <svg stroke="currentColor" fill="currentColor" viewBox="0 0 24 24" height="1em" width="1em">
              <path d="M13.293 6.293L7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path>
            </svg>
          </button>
        </div>
        <div className="scroll-container">
          {categories.map((category, index) => (
            <div key={index} className="scroll-item">
              <div className="category-item">
                <span>{category}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="scroll-arrow scroll-right">
          <button aria-label="Scroll Right" className="scroll-button">
            <svg stroke="currentColor" fill="currentColor" viewBox="0 0 24 24" height="1em" width="1em">
              <path d="M10.707 17.707L16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Grid com os cards das campanhas */}
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
    </section>
  );
}

// Função para calcular dias restantes
const calculateRemainingDays = (endDate) => {
  const currentDate = new Date();
  const end = new Date(endDate);
  const remainingTime = end - currentDate;
  return Math.max(0, Math.floor(remainingTime / (1000 * 60 * 60 * 24)));
};

export default Campanhas;
