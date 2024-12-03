// Importa React e o hook useState para gerenciar o estado do componente
import React, { useState } from 'react';
// Importa o hook useNavigate do React Router para redirecionamento
import { useNavigate } from 'react-router-dom';
// Importa a biblioteca axios para realizar requisições HTTP
import axios from 'axios';


// Define o componente funcional LoginAdmin
function LoginAdmin() {
    // Define o estado para o campo de email, inicialmente vazio
    const [email, setEmail] = useState('');
    // Define o estado para o campo de senha, inicialmente vazio
    const [password, setPassword] = useState('');
    // Define o estado para mensagens de erro, inicialmente vazio
    const [error, setError] = useState('');
    // Obtém a função navigate do useNavigate para redirecionamento
    const navigate = useNavigate();
    
    // URL base do backend obtida da variável de ambiente
    const apiURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
    
    // Função para lidar com o login do administrador
    const handleLogin = async () => {
        try {
            // Realiza uma requisição POST para o backend enviando email e senha
            const response = await axios.post(`${apiURL}/api/admin/auth/login`, {
                email,
                password,
            });

            // Armazena o token JWT retornado pelo backend no localStorage
            localStorage.setItem('token', response.data.token);

            // Redireciona o administrador para o dashboard após login bem-sucedido
            navigate('/admin/dashboard');
        } catch (err) {
            // Loga qualquer erro que ocorra durante o processo de login
            console.error('Erro ao fazer login:', err);

            // Atualiza o estado de erro com uma mensagem amigável para o usuário
            setError('Email ou senha incorretos');
        }
    };

    // Retorna o layout do componente
    return (
        <div>
            {/* Cabeçalho indicando que esta é a página de login */}
            <h2>Login de Administrador</h2>

            {/* Campo de entrada para o email */}
            <input
                type="email" // Define o tipo do campo como email
                placeholder="Email" // Placeholder visível quando o campo está vazio
                value={email} // Liga o valor do campo ao estado email
                onChange={(e) => setEmail(e.target.value)} // Atualiza o estado email ao digitar
            />

            {/* Campo de entrada para a senha */}
            <input
                type="password" // Define o tipo do campo como senha
                placeholder="Senha" // Placeholder visível quando o campo está vazio
                value={password} // Liga o valor do campo ao estado password
                onChange={(e) => setPassword(e.target.value)} // Atualiza o estado password ao digitar
            />

            {/* Botão que chama a função handleLogin ao ser clicado */}
            <button onClick={handleLogin}>Login</button>

            {/* Exibe uma mensagem de erro em vermelho, se houver */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

// Exporta o componente LoginAdmin para ser usado em outras partes do aplicativo
export default LoginAdmin;
