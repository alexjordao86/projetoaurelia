import React, { useState, useEffect } from 'react'; // Importa o React e os hooks useState e useEffect
import axios from 'axios'; // Importa o axios para realizar requisições HTTP
import { useNavigate } from 'react-router-dom'; // Importa o hook useNavigate para navegação
import './Home.css'; // Importa o arquivo de estilo específico para a Home

function Home() {
    const [campaigns, setCampaigns] = useState([]); // Estado para armazenar as campanhas exibidas na página
    const [filteredCampaigns, setFilteredCampaigns] = useState([]); // Estado para armazenar campanhas filtradas
    const [selectedCategory, setSelectedCategory] = useState('Todos'); // Estado para rastrear a categoria selecionada
    const [categories] = useState([
        'Todos', 'Educação', 'Emergenciais', 'Empatia', 'Esporte', 'Geração de Renda', 'Moradia', 'Projetos Sociais', 'Saúde'
    ]); // Lista fixa de categorias para a barra de rolagem
    const navigate = useNavigate(); // Hook para redirecionamento entre páginas
    
    // URL base do backend obtida da variável de ambiente
    const apiURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
    
    // Hook useEffect para buscar campanhas ao carregar a página
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                // Requisição para buscar a lista de campanhas do backend
                const response = await axios.get(`${apiURL}/api/campaigns/list`);
                setCampaigns(response.data); // Armazena todas as campanhas no estado
                setFilteredCampaigns(response.data.slice(0, 6)); // Define as 6 primeiras campanhas como padrão
            } catch (error) {
                console.error('Erro ao listar campanhas:', error); // Loga erros no console
            }
        };

        fetchCampaigns(); // Chama a função de busca
    }, [apiURL]); // Reexecuta se a URL base mudar


    // Função para filtrar campanhas por categoria
    const filterCampaigns = (category) => {
        setSelectedCategory(category); // Atualiza a categoria selecionada
        if (category === 'Todos') {
            setFilteredCampaigns(campaigns.slice(0, 6)); // Mostra as 6 primeiras campanhas se "Todos" for selecionado
        } else {
            const filtered = campaigns.filter((campaign) => campaign.category === category); // Filtra campanhas pela categoria
            setFilteredCampaigns(filtered);
        }
    };

    // Função para navegar para a página de detalhes de uma campanha
    const handleCardClick = (campaignId) => {
        navigate(`/campaign/${campaignId}`); // Redireciona para a página da campanha específica
    };

    return (
        <div className="home-page"> {/* Container principal da página Home */}
            {/* Banner de Boas-vindas */}
            <section className="welcome-banner"></section>

            {/* Seção de Introdução */}
            <section className="about-section">
                <div className="content-wrapper">
                    <div className="text-content">
                        <h2>Uma plataforma de financiamento coletivo dedicada a fortalecer projetos</h2>
                        <h2>que apoiam as mulheres e promovem impacto positivo.</h2>
                    </div>
                    <button className="learn-more-button" onClick={() => navigate('/sobre-nos')}>
                        Saiba Mais
                    </button>
                </div>
            </section>

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
                                <img src={campaign.image_url} alt={campaign.title} /> {/* Imagem da campanha */}
                                <div className="campaign-details">
                                    <p className="campaign-category">{campaign.category}</p> {/* Categoria da campanha */}
                                    <a href={`/campaign/${campaign.id}`} className="campaign-title">{campaign.title}</a> {/* Título da campanha */}
                                    <div className="campaign-progress">
                                        <span>{calculateRemainingDays(campaign.end_date)} dias restantes</span> {/* Dias restantes */}
                                        <span>{Math.floor((campaign.current_amount / campaign.goal) * 100)}%</span> {/* Progresso em porcentagem */}
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${(campaign.current_amount / campaign.goal) * 100}%` }}></div> {/* Barra de progresso */}
                                    </div>
                                    <div className="campaign-goal">
                                        <p>R$ {campaign.current_amount.toLocaleString()}</p> {/* Valor arrecadado */}
                                        <p>Meta de R$ {campaign.goal.toLocaleString()}</p> {/* Meta da campanha */}
                                    </div>
                                </div>
                            </div>
                        </article>
                    </li>
                ))}
            </ul>

            <div className="view-more-container">
    <a className="view-more-button" href="/campanhas">
        Ver Mais
        <span className="button-icon">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true" height="14" width="14">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7-7 7M3 12h18"></path>
            </svg>
        </span>
    </a>
</div>

            {/* Nova seção da tabela */}
<section className="info-table-section" style={{ textAlign: 'center', margin: '5px 0' }}>
    <table style={{ width: '80%', margin: '0 auto', borderCollapse: 'collapse' }}>
        <tbody>
            <tr>
                {/* Coluna 1 */}
                <td style={{ padding: '20px' }}>
                    <div>
                        {/*  ícone Conexão */}
                        <img
                            src="https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/icone_conexao.png"
                            alt="Ícone de Conexão e Confiança"
                            style={{ width: '80px', height: '80px', marginBottom: '5px' }}
                        />
                        <h3 style={{ color: '#67171f', fontWeight: 'bold', fontSize: '16px' }}>Conexão e Confiança</h3>
                        <p>Estabelecemos uma relação sólida e confiável com nossos beneficiários e doadores. Nosso compromisso é assegurar que os valores arrecadados sejam destinados de maneira correta e responsável.</p>
                    </div>
                </td>
                {/* Coluna 2 */}
                <td style={{ padding: '20px' }}>
                    <div>
                        {/* ícone Transparência */}
                        <img
                            src="https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/icone_transparencia.png"
                            alt="Ícone de Transparência"
                            style={{ width: '80px', height: '80px', marginBottom: '5px' }}
                        />
                        <h3 style={{ color: '#67171f', fontWeight: 'bold', fontSize: '16px' }}>Transparência em Cada Etapa</h3>
                        <p>O trabalho não termina com o fim das doações. Após o encerramento de cada campanha, realizamos atualizações, apresentamos a prestação de contas e compartilhamos o desfecho da história, garantindo clareza em todo o processo.</p>
                    </div>
                </td>
                {/* Coluna 3 */}
                <td style={{ padding: '20px' }}>
                    <div>
                        {/* ícone Segurança */}
                        <img
                            src="https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/icone_seguranca.png"
                            alt="Ícone de Segurança"
                            style={{ width: '80px', height: '80px', marginBottom: '5px' }}
                        />
                        <h3 style={{ color: '#67171f', fontWeight: 'bold', fontSize: '16px' }}>Segurança</h3>
                        <p>A Aurelia não é uma plataforma aberta. Todas as histórias passam por um processo criterioso de verificação e curadoria antes de se tornarem campanhas e serem publicadas, garantindo um ambiente seguro e confiável para doações.</p>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</section>
            {/* Seção "Conte sua história" */}
            <section className="tell-your-story">
                {/* Contêiner interno para centralizar e limitar o conteúdo */}
                    <div className="content-wrapper">
                        <div className="story-text">
                        <h2>Conte sua história</h2>
                        <h3>Ela pode virar uma campanha</h3>
                    </div>
                        <button className="story-button" onClick={() => navigate('/envie-sua-historia')}>
                        Envie sua história
                        </button>
                    </div>
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

export default Home; // Exporta o componente Home para uso em outras partes do aplicativo
