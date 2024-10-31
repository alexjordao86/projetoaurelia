import React, { useState } from 'react';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:4000/api/auth/login', {
                email,
                password
            });

            // Armazena o token JWT no localStorage
            localStorage.setItem('token', response.data.token);

            // Redireciona para a página de administração
            window.location.href = '/admin';
        } catch (err) {
            console.error('Erro ao fazer login:', err);
            setError('Email ou senha incorretos');
        }
    };

    return (
        <div>
            <h2>Login de Administrador</h2>
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
            <button onClick={handleLogin}>Login</button>
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    );
}

export default Login;
