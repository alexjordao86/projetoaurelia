// Importa as bibliotecas React, axios, e o contexto necessário
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import './UserProfile.css'; // Certifique-se de criar ou ajustar o arquivo CSS para estilização

// Define o componente funcional UserProfile
const UserProfile = () => {
    // Obtém o usuário do contexto (se autenticado)
    const { user: contextUser } = useContext(UserContext);

    // Estado local para armazenar os dados do usuário
    const [user, setUser] = useState({
        full_name: contextUser?.nome || '',
        email: contextUser?.email || '',
        phone_number: '',
        cpf_cnpj: ''
    });

    // Estado para armazenar a lista de doações do usuário
    const [donations, setDonations] = useState([]);

    // Estado para alternar entre modo de edição e visualização
    const [editMode, setEditMode] = useState(false);

    // Estados para mensagens de erro e sucesso
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Recupera o token JWT armazenado no localStorage após o login
    const token = localStorage.getItem('userToken');

    // useEffect para buscar os dados do usuário e suas doações ao montar o componente
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Faz uma requisição GET para obter os dados do perfil e as doações
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Atualiza o estado com os dados do perfil do usuário
                setUser(response.data.user);

                // Atualiza o estado com as doações do usuário
                setDonations(response.data.donations || []);
            } catch (error) {
                // Define uma mensagem de erro caso ocorra uma falha na requisição
                console.error('Erro ao buscar informações do usuário:', error);
                setError('Não foi possível carregar as informações do usuário.');
            }
        };

        fetchUserData(); // Chama a função ao montar o componente
    }, [token]);

    // Função para salvar as alterações no perfil do usuário
    const handleSaveProfile = async () => {
        try {
            // Faz uma requisição PUT para atualizar o perfil do usuário
            await axios.put(`${process.env.REACT_APP_API_URL}/user/profile`, user, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Define uma mensagem de sucesso
            setSuccess('Informações atualizadas com sucesso!');
            setError(''); // Limpa erros anteriores
            setEditMode(false); // Sai do modo de edição
        } catch (error) {
            console.error('Erro ao atualizar o perfil:', error);
            setError('Erro ao atualizar o perfil. Tente novamente.');
        }
    };

    return (
        <div className="profile-container">
            <h2>Meu Perfil</h2>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <div className="profile-section">
                <label>Nome Completo:</label>
                <input
                    type="text"
                    value={user.full_name}
                    disabled={!editMode}
                    onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                />
            </div>

            <div className="profile-section">
                <label>Email:</label>
                <input
                    type="email"
                    value={user.email}
                    disabled={!editMode}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
            </div>

            <div className="profile-section">
                <label>Telefone:</label>
                <input
                    type="text"
                    value={user.phone_number}
                    disabled={!editMode}
                    onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
                />
            </div>

            <div className="profile-section">
                <label>CPF/CNPJ:</label>
                <input
                    type="text"
                    value={user.cpf_cnpj}
                    disabled
                />
            </div>

            <div className="profile-actions">
                <button onClick={() => setEditMode(!editMode)}>
                    {editMode ? 'Cancelar' : 'Editar Perfil'}
                </button>
                {editMode && <button onClick={handleSaveProfile}>Salvar</button>}
            </div>

            <h3>Minhas Doações</h3>
            <ul className="donations-list">
                {donations.length > 0 ? (
                    donations.map((donation, index) => (
                        <li key={index} className="donation-item">
                            <p><strong>Campanha:</strong> {donation.campaign_title}</p>
                            <p><strong>Valor Doado:</strong> R$ {parseFloat(donation.amount).toLocaleString('pt-BR')}</p>
                            <p><strong>Data:</strong> {new Date(donation.date).toLocaleDateString('pt-BR')}</p>
                        </li>
                    ))
                ) : (
                    <p>Você ainda não realizou doações.</p>
                )}
            </ul>
        </div>
    );
};

export default UserProfile;
