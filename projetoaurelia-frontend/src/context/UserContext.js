// src/context/UserContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Cria o contexto do usuário para gerenciar o estado global de autenticação
export const UserContext = createContext();

// Componente provedor de contexto para compartilhar o estado do usuário com todos os componentes
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Estado para armazenar os dados do usuário autenticado
    const [loading, setLoading] = useState(true); // Estado para monitorar o carregamento inicial

    useEffect(() => {
        // Função para buscar os dados do usuário usando o token armazenado
        const fetchUser = async () => {
            const token = localStorage.getItem('userToken'); // Obtém o token JWT do localStorage

            // Verifica se o token existe antes de fazer a requisição
            if (token) {
                try {
                    // Faz uma requisição para obter os dados do usuário autenticado
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/profile`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    // Atualiza o estado com as informações do usuário retornadas da API
                    setUser(response.data.user);
                } catch (error) {
                    console.error('Erro ao buscar informações do usuário:', error);

                    // Remove o token inválido do localStorage e redefine o estado do usuário
                    localStorage.removeItem('userToken');
                    setUser(null);
                }
            }
            setLoading(false); // Define o carregamento como concluído
        };

        fetchUser(); // Chama a função para buscar os dados do usuário quando o componente é montado
    }, []);

    // Retorna um loader ou nulo enquanto os dados estão sendo carregados
    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        // Provedor do UserContext que compartilha o estado `user` e a função `setUser`
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
