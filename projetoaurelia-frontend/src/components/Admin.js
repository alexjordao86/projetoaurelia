import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

    const token = localStorage.getItem('token');

    useEffect(() => {
        // Função para listar as campanhas
        const fetchCampaigns = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/campaigns/list', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setCampaigns(response.data);
            } catch (err) {
                console.error('Erro ao listar campanhas:', err);
            }
        };

        fetchCampaigns();
    }, [token]);

    // Função para criar uma nova campanha
    const handleCreateCampaign = async () => {
        try {
            await axios.post('http://localhost:4000/api/campaigns/create', newCampaign, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Campanha criada com sucesso!');
            window.location.reload();  // Recarrega a lista de campanhas
        } catch (err) {
            console.error('Erro ao criar campanha:', err);
        }
    };

    // Função para excluir uma campanha
    const handleDeleteCampaign = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/campaigns/delete/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Campanha excluída com sucesso!');
            window.location.reload();  // Recarrega a lista de campanhas
        } catch (err) {
            console.error('Erro ao excluir campanha:', err);
        }
    };

    // Função para editar uma campanha
    const handleEditCampaign = async (id, updatedCampaign) => {
        try {
            await axios.put(`http://localhost:4000/api/campaigns/update/${id}`, updatedCampaign, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Campanha atualizada com sucesso!');
            window.location.reload();  // Recarrega a lista de campanhas
        } catch (err) {
            console.error('Erro ao atualizar campanha:', err);
        }
    };

    return (
        <div>
            <h2>Administração de Campanhas</h2>
            <div>
                <h3>Criar Nova Campanha</h3>
                <input
                    type="text"
                    placeholder="Categoria"
                    value={newCampaign.category}
                    onChange={(e) => setNewCampaign({ ...newCampaign, category: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Título"
                    value={newCampaign.title}
                    onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Descrição"
                    value={newCampaign.description}
                    onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
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

            <h3>Listagem de Campanhas</h3>
            <ul>
                {campaigns.map(campaign => (
                    <li key={campaign.id}>
                        <h4>{campaign.title}</h4>
                        <p>{campaign.description}</p>
                        <button onClick={() => handleDeleteCampaign(campaign.id)}>Excluir</button>
                        <button onClick={() => handleEditCampaign(campaign.id, campaign)}>Editar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Admin;
