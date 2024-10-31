import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
    const [user, setUser] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        cpf_cnpj: ''
    });
    const [donations, setDonations] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const token = localStorage.getItem('token'); // Token armazenado após o login

    useEffect(() => {
        // Função para buscar os dados do usuário e suas doações
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/user/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUser(response.data.user);
                setDonations(response.data.donations);
            } catch (error) {
                setError('Erro ao buscar informações do usuário.');
            }
        };

        fetchUserData();
    }, [token]);

    // Função para salvar as mudanças no perfil
    const handleSaveProfile = async () => {
        try {
            const response = await axios.put('http://localhost:4000/api/user/profile', user, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSuccess('Informações atualizadas com sucesso!');
            setEditMode(false);
        } catch (error) {
            setError('Erro ao atualizar o perfil.');
        }
    };

    return (
        <div>
            <h2>Meu Perfil</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <div>
                <label>Nome Completo:</label>
                <input
                    type="text"
                    value={user.full_name}
                    disabled={!editMode}
                    onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                />
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={user.email}
                    disabled={!editMode}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
            </div>
            <div>
                <label>Telefone:</label>
                <input
                    type="text"
                    value={user.phone_number}
                    disabled={!editMode}
                    onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
                />
            </div>
            <div>
                <label>CPF/CNPJ:</label>
                <input
                    type="text"
                    value={user.cpf_cnpj}
                    disabled={true} // Campo CPF/CNPJ não pode ser editado
                />
            </div>
            <button onClick={() => setEditMode(!editMode)}>
                {editMode ? 'Cancelar' : 'Editar Perfil'}
            </button>
            {editMode && <button onClick={handleSaveProfile}>Salvar</button>}

            <h3>Minhas Doações</h3>
            <ul>
                {donations.map((donation, index) => (
                    <li key={index}>
                        <p>Campanha: {donation.campaign_title}</p>
                        <p>Valor Doado: R$ {donation.amount}</p>
                        <p>Data: {new Date(donation.date).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserProfile;
