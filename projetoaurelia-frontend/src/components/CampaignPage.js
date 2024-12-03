// Importa as dependências necessárias
import React, { useEffect, useState } from 'react'; // Hooks para gerenciar estado e efeitos colaterais
import { useParams } from 'react-router-dom'; // Hook para acessar parâmetros da URL
import axios from 'axios'; // Biblioteca para fazer requisições HTTP
import './CampaignPage.css'; // Importa o arquivo CSS específico para este componente
import { NumericFormat } from 'react-number-format'; // Biblioteca para formatar valores numéricos

// Componente funcional CampaignPage
function CampaignPage() {
    const { id } = useParams(); // Obtém o ID da campanha da URL
    const [campaign, setCampaign] = useState(null); // Estado para armazenar os dados da campanha
    const [donors, setDonors] = useState([]); // Estado para armazenar a lista de doadores
    const [showFormModal, setShowFormModal] = useState(false); // Controle do modal de formulário de doação
    const [showPaymentModal, setShowPaymentModal] = useState(false); // Controle do modal de pagamento
    const [initPoint, setInitPoint] = useState(''); // URL do Mercado Pago para o pagamento
    const [price, setPrice] = useState(0); // Valor da doação
    const [formType, setFormType] = useState('fisica'); // Tipo de doador (física ou jurídica)
    const [formData, setFormData] = useState({ // Dados do formulário de doação
        nome: '',
        email: '',
        cpfCnpj: '',
        telefone: ''
    });

    // URL base do backend obtida da variável de ambiente
    const apiURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';


    // useEffect para buscar dados da campanha e dos doadores ao carregar o componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Requisição para buscar dados da campanha
                const campaignResponse = await axios.get(`${apiURL}/api/campaigns/${id}`);
                setCampaign(campaignResponse.data);

                // Requisição para buscar a lista de doadores
                const donorsResponse = await axios.get(`${apiURL}/api/campaigns/${id}/donors`);
                setDonors(Array.isArray(donorsResponse.data) ? donorsResponse.data : []);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };

        fetchData();
    }, [id, apiURL]);

    // Função para abrir o modal de doação
    const handleDonate = () => {
        if (campaign?.status === 'Encerrada') {
            alert('Esta campanha está encerrada.');
            return;
        }
        setShowFormModal(true);
    };

    // Função para processar a doação
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (price <= 0) {
            alert('Por favor, insira um valor válido para doação.');
            return;
        }

        try {
            // Requisição para o backend com os dados da doação
            const response = await axios.post(`${apiURL}/api/payment/donate`, {
                title: campaign.title,
                description: campaign.description,
                price,
                quantity: 1,
                campaignId: id
            });

            setInitPoint(response.data.init_point); // Salva a URL do Mercado Pago
            setShowFormModal(false); // Fecha o modal de formulário
            setShowPaymentModal(true); // Exibe o modal de pagamento
        } catch (error) {
            console.error('Erro ao processar a doação:', error);
        }
    };

    // Função para alterar o tipo de formulário (física/jurídica)
    const handleFormTypeChange = (e) => {
        setFormType(e.target.value);
        setFormData({
            ...formData,
            nome: '',
            cpfCnpj: ''
        });
    };

    // Função para lidar com mudanças nos campos do formulário
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Exibe mensagem de carregamento enquanto os dados da campanha são buscados
    if (!campaign) {
        return <div>Carregando...</div>;
    }

    // Renderiza a interface da página
    return (
        <div className="campaign-page-container">
            {/* Título, imagem e descrição da campanha */}
            <h1>{campaign.title}</h1>
            <img src={campaign.image_url} alt={campaign.title} className="campaign-image" />
            <p>{campaign.description}</p>

            {/* Meta e valor arrecadado */}
            <p>Meta: R$ {parseFloat(campaign.goal).toLocaleString('pt-BR')}</p>
            <p>Arrecadado: R$ {parseFloat(campaign.current_amount).toLocaleString('pt-BR')}</p>

            {/* Verifica se a campanha está encerrada */}
            {campaign.status === 'Encerrada' ? (
                <div className="campaign-closed">
                    <p>Campanha encerrada em {new Date(campaign.end_date).toLocaleDateString('pt-BR')}</p>
                    <p>O resgate do valor deverá acontecer dentro de 40 dias contados após o encerramento.</p>
                </div>
            ) : (
                <button onClick={handleDonate}>Doe Agora</button>
            )}

            {/* Exibe novidades */}
            <div className="campaign-news">
                <h2>Novidades</h2>
                {campaign.news && campaign.news.length > 0 ? (
                    campaign.news.map((newsItem, index) => (
                        <p key={index}>{newsItem}</p>
                    ))
                ) : (
                    <p>Sem novidades até o momento.</p>
                )}
            </div>

            {/* Lista de doadores */}
            <div className="campaign-donors">
                <h2>Doadores</h2>
                <p>Total de doadores: {donors.length}</p>
                <ul>
                    {donors.map((donor, index) => (
                        <li key={index}>
                            <strong>{donor.anonymous ? 'Anônimo' : donor.donor_name}</strong>: R$ {parseFloat(donor.amount).toLocaleString('pt-BR')} em {new Date(donor.donated_at).toLocaleDateString('pt-BR')}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Modal para o formulário de doação */}
            {showFormModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Faça sua Doação</h2>
                        <form onSubmit={handleSubmit}>
                            <label>
                                <input
                                    type="radio"
                                    value="fisica"
                                    checked={formType === 'fisica'}
                                    onChange={handleFormTypeChange}
                                />
                                Pessoa Física
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="juridica"
                                    checked={formType === 'juridica'}
                                    onChange={handleFormTypeChange}
                                />
                                Pessoa Jurídica
                            </label>

                            <label>{formType === 'fisica' ? 'Nome Completo' : 'Razão Social'}</label>
                            <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleInputChange}
                                required
                            />

                            <label>{formType === 'fisica' ? 'CPF' : 'CNPJ'}</label>
                            <input
                                type="text"
                                name="cpfCnpj"
                                value={formData.cpfCnpj}
                                onChange={handleInputChange}
                                required
                            />

                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />

                            <label>Telefone</label>
                            <input
                                type="tel"
                                name="telefone"
                                value={formData.telefone}
                                onChange={handleInputChange}
                                required
                            />

                            <label>Valor da Doação</label>
                            <NumericFormat
                                value={price}
                                thousandSeparator="."
                                decimalSeparator=","
                                prefix="R$ "
                                onValueChange={(values) => setPrice(values.floatValue)}
                                allowNegative={false}
                                placeholder="Digite o valor"
                                required
                            />

                            <button type="submit">Continuar</button>
                        </form>
                        <button
                            className="back-button"
                            onClick={() => setShowFormModal(false)}
                        >
                            Voltar
                        </button>
                    </div>
                </div>
            )}

            {/* Modal para o pagamento com Mercado Pago */}
            {showPaymentModal && (
                <div className="modal">
                    <div className="modal-content payment-modal">
                        <iframe
                            src={initPoint}
                            title="Mercado Pago"
                            width="100%"
                            height="500px"
                            frameBorder="0"
                            className="payment-iframe"
                        />
                        <button className="close-button" onClick={() => setShowPaymentModal(false)}>
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CampaignPage;
