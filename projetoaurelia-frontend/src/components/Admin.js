import './Admin.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Quill from 'react-quill'; // Biblioteca para editor de texto
import 'react-quill/dist/quill.snow.css'; // Estilos padrão do Quill

function Admin() {
    const [campaigns, setCampaigns] = useState([]);
    const [newCampaign, setNewCampaign] = useState({
        category: '',
        title: '',
        description: '',
        goal: '',
        start_date: '',
        end_date: '',
        image_url: ''
    });

    // Recupera o token armazenado localmente (autenticação)
    const token = localStorage.getItem('token');

    // URL base do backend configurada via variável de ambiente
    const apiURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

    // Busca todas as campanhas ao carregar o componente
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await axios.get(`${apiURL}/api/campaigns/list`, {
                    headers: { Authorization: `Bearer ${token}` } // Inclui o token no cabeçalho
                });
                setCampaigns(response.data); // Atualiza o estado com as campanhas obtidas
            } catch (err) {
                console.error('Erro ao listar campanhas:', err);
            }
        };

        fetchCampaigns(); // Chama a função ao montar o componente
    }, [token, apiURL]);

    // Cria uma nova campanha
    const handleCreateCampaign = async () => {
        // Verifica se todos os campos foram preenchidos
        if (
            !newCampaign.category ||
            !newCampaign.title ||
            !newCampaign.description ||
            !newCampaign.goal ||
            !newCampaign.start_date ||
            !newCampaign.end_date ||
            !newCampaign.image_url
        ) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const response = await axios.post(`${apiURL}/api/campaigns/create`, newCampaign, {
                headers: { Authorization: `Bearer ${token}` } // Token de autenticação
            });
            alert('Campanha criada com sucesso!');
            // Adiciona a nova campanha à lista de campanhas existentes
            setCampaigns([...campaigns, response.data]);
            // Reseta o formulário de nova campanha
            setNewCampaign({
                category: '',
                title: '',
                description: '',
                goal: '',
                start_date: '',
                end_date: '',
                image_url: ''
            });
        } catch (err) {
            console.error('Erro ao criar campanha:', err);
        }
    };

    // Exclui uma campanha existente
    const handleDeleteCampaign = async (id) => {
        const confirmDelete = window.confirm('Tem certeza de que deseja excluir esta campanha?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`${apiURL}/api/campaigns/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Campanha excluída com sucesso!');
            // Remove a campanha excluída do estado
            setCampaigns(campaigns.filter((campaign) => campaign.id !== id));
        } catch (err) {
            console.error('Erro ao excluir campanha:', err);
        }
    };

    // Edita uma campanha existente
    const handleEditCampaign = async (id, updatedCampaign) => {
        const confirmEdit = window.confirm('Tem certeza de que deseja editar esta campanha?');
        if (!confirmEdit) return;

        try {
            await axios.put(`${apiURL}/api/campaigns/update/${id}`, updatedCampaign, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Campanha atualizada com sucesso!');
            // Atualiza a lista de campanhas no estado com os novos dados
            setCampaigns(
                campaigns.map((campaign) =>
                    campaign.id === id ? { ...campaign, ...updatedCampaign } : campaign
                )
            );
        } catch (err) {
            console.error('Erro ao atualizar campanha:', err);
        }
    };

    return (
        <div className="admin-container">
            <h2>Administração de Campanhas</h2>

            <div>
                <h3>Criar Nova Campanha</h3>
                <div className="new-campaign-form">
                    {/* Formulário para criar uma nova campanha */}
                    <select
                        value={newCampaign.category}
                        onChange={(e) => setNewCampaign({ ...newCampaign, category: e.target.value })}
                    >
                        <option value="">Selecione uma Categoria</option>
                        <option value="Educação">Educação</option>
                        <option value="Emergenciais">Emergenciais</option>
                        <option value="Empatia">Empatia</option>
                        <option value="Esporte">Esporte</option>
                        <option value="Geração de Renda">Geração de Renda</option>
                        <option value="Moradia">Moradia</option>
                        <option value="Projetos Sociais">Projetos Sociais</option>
                        <option value="Saúde">Saúde</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Título"
                        value={newCampaign.title}
                        onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                    />
                    <Quill
                        theme="snow"
                        value={newCampaign.description}
                        onChange={(value) => setNewCampaign({ ...newCampaign, description: value })}
                    />
                    <input
                        type="number"
                        placeholder="Meta"
                        value={newCampaign.goal}
                        onChange={(e) => setNewCampaign({ ...newCampaign, goal: e.target.value })}
                    />
                    <input
                        type="date"
                        placeholder="Data de Início"
                        value={newCampaign.start_date}
                        onChange={(e) => setNewCampaign({ ...newCampaign, start_date: e.target.value })}
                    />
                    <input
                        type="date"
                        placeholder="Data de Fim"
                        value={newCampaign.end_date}
                        onChange={(e) => setNewCampaign({ ...newCampaign, end_date: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="URL da Imagem"
                        value={newCampaign.image_url}
                        onChange={(e) => setNewCampaign({ ...newCampaign, image_url: e.target.value })}
                    />
                    <button onClick={handleCreateCampaign}>Criar Campanha</button>
                </div>
            </div>

            <h3>Listagem de Campanhas</h3>
            <ul className="campaign-list">
                {campaigns.map((campaign) => (
                    <li key={campaign.id}>
                        <h4>{campaign.title}</h4>
                        <p dangerouslySetInnerHTML={{ __html: campaign.description }} />
                        <button onClick={() => handleDeleteCampaign(campaign.id)}>Excluir</button>
                        <button
                            onClick={() =>
                                handleEditCampaign(campaign.id, {
                                    ...campaign,
                                    title: prompt('Novo título:', campaign.title) || campaign.title
                                })
                            }
                        >
                            Editar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Admin;
