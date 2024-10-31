import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function UserLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:4000/api/auth/login', {
                email,
                password,
            });

            // Armazena o token JWT no localStorage
            localStorage.setItem('userToken', response.data.token);

            // Redireciona para a página de campanhas ou outra página após o login
            navigate('/campanhas');
        } catch (err) {
            console.error('Erro ao fazer login:', err);
            setError('Email ou senha incorretos');
        }
    };

    return (
        <div>
            <h2>Login de Usuário</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Entrar</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <p>
                Não tem uma conta? <Link to="/register">Cadastre-se aqui</Link>
            </p>
        </div>
    );
}

export default UserLogin;
