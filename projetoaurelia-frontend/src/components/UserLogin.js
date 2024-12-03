// Importa React, hooks e dependências necessárias
import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import './UserLogin.css'; // Importa o arquivo CSS para estilização

function UserLogin() {
    // Define os estados locais
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Usa o contexto do usuário e navegação
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Define a origem para redirecionamento pós-login
    const from = location.state?.from?.pathname || '/';

    // Função para login do usuário
    const handleLogin = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
                email,
                password,
            });

            // Armazena o token JWT no localStorage
            localStorage.setItem('userToken', response.data.token);

            // Atualiza o estado do contexto do usuário
            setUser(response.data.user);

            // Redireciona o usuário para a página desejada
            navigate(from);
        } catch (err) {
            console.error('Erro ao fazer login:', err);
            setError('Email ou senha incorretos');
        }
    };

    // Função para envio do formulário
    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin();
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login de Usuário</h2>

                {/* Campo de entrada para email */}
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Digite seu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                {/* Campo de entrada para senha */}
                <div className="form-group">
                    <label>Senha</label>
                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="toggle-password"
                        >
                            {showPassword ? "Ocultar" : "Mostrar"}
                        </button>
                    </div>
                </div>

                {/* Botão de envio */}
                <button type="submit" className="submit-button">Entrar</button>

                {/* Mensagem de erro */}
                {error && <p className="error-message">{error}</p>}

                {/* Links para cadastro e recuperação de senha */}
                <div className="extra-links">
                    <p>
                        Não tem uma conta? <Link to="/register">Cadastre-se</Link>
                    </p>
                    <p>
                        <Link to="/forgot-password">Esqueci minha senha</Link>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default UserLogin;
