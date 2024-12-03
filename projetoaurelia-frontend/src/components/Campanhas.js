import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Campanhas.css'; // Estilos específicos para o layout
import { useNavigate } from 'react-router-dom';

function Campanhas() {
  const [campaigns, setCampaigns] = useState([]); // Estado para campanhas
  const [filteredCampaigns, setFilteredCampaigns] = useState([]); // Campanhas filtradas
  const [selectedCategory, setSelectedCategory] = useState('Todos'); // Categoria selecionada

  // Categorias disponíveis para filtragem
  const categories = [
    'Todos',
    'Educação',
    'Emergenciais',
    'Empatia',
    'Esporte',
    'Geração de Renda',
    'Moradia',
    'Projetos Sociais',
    'Saúde',
  ];

  const navigate = useNavigate();

  // URL base do backend obtida da variável de ambiente
  const apiURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

  // Função para buscar campanhas do backend
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // Faz a requisição para a API para buscar as campanhas
        const response = await axios.get(`${apiURL}/api/campaigns/list`);
        const updatedCampaigns = response.data.map((campaign) => {
          // Calcula o status da campanha com base na data de término
          const currentDate = new Date();
          const endDate = new Date(campaign.end_date);
          campaign.status = currentDate > endDate ? 'Encerrada' : 'Ativa';
          return campaign;
        });
        setCampaigns(updatedCampaigns); // Atualiza o estado com as campanhas recebidas
        setFilteredCampaigns(updatedCampaigns); // Define as campanhas inicialmente filtradas
      } catch (error) {
        console.error('Erro ao listar campanhas:', error); // Loga erros no console
      }
    };

    fetchCampaigns(); // Chama a função ao carregar o componente
  }, [apiURL]); // Reexecuta se a URL base mudar

  // Função para filtrar campanhas por categoria
  const filterCampaigns = (category) => {
    setSelectedCategory(category);

    if (category === 'Todos') {
      setFilteredCampaigns(campaigns); // Mostra todas as campanhas
    } else {
      const filtered = campaigns.filter((campaign) => campaign.category === category);
      setFilteredCampaigns(filtered);
    }
  };

  // Função para calcular os dias restantes até o final da campanha
  const calculateRemainingDays = (endDate) => {
    const currentDate = new Date();
    const end = new Date(endDate);
    const remainingTime = end - currentDate;
    return Math.max(0, Math.floor(remainingTime / (1000 * 60 * 60 * 24)));
  };

  // Redireciona para a página de detalhes de uma campanha específica
  const handleCardClick = (campaignId) => {
    navigate(`/campaign/${campaignId}`);
  };

  return (
    <section className="chakra-container">
      {/* Título da página */}
      <h1 className="campaigns-title">Encontre todas as nossas campanhas</h1>

      {/* Seção de Categorias */}
      <section className="categories-container">
        <div className="categories-scroll">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`category-button ${selectedCategory === category ? 'active-category' : ''}`}
              onClick={() => filterCampaigns(category)} // Filtra campanhas ao clicar
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Grid com os cards das campanhas */}
      <ul className="campaigns-grid">
        {filteredCampaigns.map((campaign, index) => (
          <li key={index} className="campaign-card" onClick={() => handleCardClick(campaign.id)}>
            <article className="chakra-linkbox">
              <div className="campaign-content">
                {/* Imagem da campanha */}
                <img src={campaign.image_url} alt={campaign.title} className="campaign-image" />
                {/* Detalhes da campanha */}
                <div className="campaign-details">
                  <p className="campaign-category">{campaign.category}</p>
                  <a href={`/campaign/${campaign.id}`} className="campaign-title">
                    {campaign.title}
                  </a>

                  {/* Exibição de status e progresso */}
                  {campaign.status === 'Encerrada' ? (
                    <div className="campaign-closed">
                      <p>Encerrada em {new Date(campaign.end_date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  ) : (
                    <>
                      <div className="campaign-progress">
                        <span>{calculateRemainingDays(campaign.end_date)} dias restantes</span>
                        <span>{Math.floor((campaign.current_amount / campaign.goal) * 100)}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${(campaign.current_amount / campaign.goal) * 100}%` }}
                        ></div>
                      </div>
                    </>
                  )}

                  {/* Valores arrecadados */}
                  <div className="campaign-goal">
                    <p>R$ {parseFloat(campaign.current_amount).toLocaleString('pt-BR')}</p>
                    <p>Meta de R$ {parseFloat(campaign.goal).toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>

      {/* Seção de informações */}
      <section className="info-table-section" style={{ textAlign: 'center', margin: '5px 0' }}>
        <table style={{ width: '80%', margin: '0 auto', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '20px' }}>
                <div>
                  <img
                    src="https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/icone_conexao.png"
                    alt="Ícone de Conexão e Confiança"
                    style={{ width: '80px', height: '80px', marginBottom: '5px' }}
                  />
                  <h3 style={{ color: '#67171f', fontWeight: 'bold', fontSize: '16px' }}>Conexão e Confiança</h3>
                  <p>
                    Estabelecemos uma relação sólida e confiável com nossos beneficiários e doadores. Nosso compromisso
                    é assegurar que os valores arrecadados sejam destinados de maneira correta e responsável.
                  </p>
                </div>
              </td>
              <td style={{ padding: '20px' }}>
                <div>
                  <img
                    src="https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/icone_transparencia.png"
                    alt="Ícone de Transparência"
                    style={{ width: '80px', height: '80px', marginBottom: '5px' }}
                  />
                  <h3 style={{ color: '#67171f', fontWeight: 'bold', fontSize: '16px' }}>Transparência em Cada Etapa</h3>
                  <p>
                    O trabalho não termina com o fim das doações. Após o encerramento de cada campanha, realizamos
                    atualizações, apresentamos a prestação de contas e compartilhamos o desfecho da história, garantindo
                    clareza em todo o processo.
                  </p>
                </div>
              </td>
              <td style={{ padding: '20px' }}>
                <div>
                  <img
                    src="https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/icone_seguranca.png"
                    alt="Ícone de Segurança"
                    style={{ width: '80px', height: '80px', marginBottom: '5px' }}
                  />
                  <h3 style={{ color: '#67171f', fontWeight: 'bold', fontSize: '16px' }}>Segurança</h3>
                  <p>
                    A Aurelia não é uma plataforma aberta. Todas as histórias passam por um processo criterioso de
                    verificação e curadoria antes de se tornarem campanhas e serem publicadas, garantindo um ambiente
                    seguro e confiável para doações.
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Seção "Outras formas de apoiar" */}
      <section className="other-ways-to-support">
        <div className="content-wrapper">
          <div className="support-text">
            <h2>Outras formas de apoiar</h2>
            <h3 style={{ color: 'white' }}>Doe itens, seu tempo ou habilidades</h3>
          </div>
          <button className="support-button" onClick={() => navigate('/outras-formas-de-apoiar')}>
            Saiba como ajudar
          </button>
        </div>
      </section>
    </section>
  );
}

export default Campanhas;
