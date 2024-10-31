import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CampaignPage.css';  // Importa o CSS para estilização do modal
import { NumericFormat } from 'react-number-format';  // Para formatar o valor de doação

function CampaignPage() {
    const { id } = useParams();  // Obtém o ID da campanha da URL
    const [campaign, setCampaign] = useState(null);  // Estado para armazenar os dados da campanha
    const [showFormModal, setShowFormModal] = useState(false);  // Estado para controlar o modal do formulário
    const [showPaymentModal, setShowPaymentModal] = useState(false);  // Estado para controlar o modal de pagamento
    const [initPoint, setInitPoint] = useState('');  // Armazena o init_point do Mercado Pago
    const [price, setPrice] = useState(0);  // Estado para o valor de doação
    const [formType, setFormType] = useState('fisica');  // Pessoa física ou jurídica
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        cpfCnpj: '',
        telefone: ''
    });

    // useEffect que será chamado quando o componente for montado
    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/campaigns/${id}`);
                setCampaign(response.data);  // Atualiza o estado com os dados da campanha
            } catch (error) {
                console.error('Erro ao buscar a campanha:', error);
            }
        };
        fetchCampaign();
    }, [id]);

    // Função para abrir o formulário de doação
    const handleDonate = () => {
        setShowFormModal(true);  // Exibe o modal do formulário de doação
    };

    // Função para processar a doação e abrir o pagamento do Mercado Pago
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (price <= 0) {
            alert('Por favor, insira um valor válido para doação.');
            return;
        }

        try {
            // Requisição POST para o backend, com os dados de pagamento
            const response = await axios.post('http://localhost:4000/api/donate', {
                title: campaign.title,
                description: campaign.description,
                price,  // Valor informado pelo usuário
                quantity: 1,
                campaignId: id  // ID da campanha
            });

            setInitPoint(response.data.init_point);  // Salva o init_point do Mercado Pago
            setShowFormModal(false);  // Fecha o modal do formulário
            setShowPaymentModal(true);  // Exibe o modal de pagamento
        } catch (error) {
            console.error('Erro ao processar a doação:', error);
        }
    };

    // Função para lidar com a mudança no formulário (física/jurídica)
    const handleFormTypeChange = (e) => {
        setFormType(e.target.value);  // Atualiza o tipo de pessoa (física/jurídica)
        setFormData({
            ...formData,
            nome: '',  // Limpa o nome/razão social
            cpfCnpj: ''  // Limpa o CPF/CNPJ
        });
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value  // Atualiza os dados do formulário
        });
    };

    if (!campaign) {
        return <div>Carregando...</div>;  // Exibe enquanto os dados da campanha carregam
    }

    return (
        <div className="campaign-page-container">  {/* Aplicação das novas regras de layout */}
            <h1>{campaign.title}</h1>
            <img src={campaign.image_url} alt={campaign.title} className="campaign-image" />
            <p>{campaign.description}</p>
            <p>Meta: R$ {campaign.goal.toLocaleString()}</p>
            <p>Arrecadado: R$ {campaign.current_amount.toLocaleString()}</p>
            <button onClick={handleDonate}>Doe Agora</button>

            {/* Modal para o formulário de doação */}
            {showFormModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Faça sua Doação</h2>

                        <form onSubmit={handleSubmit}>
                            {/* Tipo de doador */}
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

                            {/* Nome completo ou Razão Social */}
                            <label>{formType === 'fisica' ? 'Nome Completo' : 'Razão Social'}</label>
                            <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleInputChange}
                                required
                            />

                            {/* CPF ou CNPJ */}
                            <label>{formType === 'fisica' ? 'CPF' : 'CNPJ'}</label>
                            <input
                                type="text"
                                name="cpfCnpj"
                                value={formData.cpfCnpj}
                                onChange={handleInputChange}
                                required
                            />

                            {/* E-mail */}
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />

                            {/* Telefone */}
                            <label>Telefone</label>
                            <input
                                type="tel"
                                name="telefone"
                                value={formData.telefone}
                                onChange={handleInputChange}
                                required
                            />

                            {/* Valor da doação em formato de moeda brasileira */}
                            <label>Valor da Doação</label>
                            <NumericFormat
                                value={price}
                                thousandSeparator="."
                                decimalSeparator=","
                                prefix="R$ "
                                onValueChange={(values) => setPrice(values.floatValue)}  // Atualiza o valor real digitado
                                allowNegative={false}
                                placeholder="Digite o valor"
                                required
                            />

                            {/* Termos de uso */}
                            <p>Ao prosseguir eu declaro que aceito os Termos de uso e Política de Privacidade</p>

                            <button type="submit">Continuar</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal para o pagamento com Mercado Pago */}
            {showPaymentModal && (
                <div className="modal">
                    <div className="modal-content">
                        <iframe
                            src={initPoint}
                            title="Mercado Pago"
                            width="100%"
                            height="600px"
                            frameBorder="0"
                        />
                        <button className="close-button" onClick={() => setShowPaymentModal(false)}>Fechar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CampaignPage;
