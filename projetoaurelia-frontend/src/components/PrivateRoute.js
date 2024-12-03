import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Importa jwtDecode como uma exportação nomeada

// Função para validar o token JWT
const isTokenValid = (token) => {
    try {
        const decoded = jwtDecode(token); // Decodifica o token
        return decoded.exp * 1000 > Date.now(); // Verifica se o token não está expirado
    } catch (error) {
        return false; // Retorna falso se o token for inválido ou se houver erro
    }
};

const PrivateRoute = ({ children }) => {
    // Recupera o token JWT do localStorage
    const token = localStorage.getItem('token');

    // Valida o token
    const isAuthenticated = token && isTokenValid(token);

    // Se o token for válido, permite o acesso; caso contrário, redireciona para a página de login
    return isAuthenticated ? children : <Navigate to="/admin" replace />;
};

export default PrivateRoute;
