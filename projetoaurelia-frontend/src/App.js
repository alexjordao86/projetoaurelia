import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Doar from './components/Doar';  // Componente de doação
import Success from './components/Success';  // Componente de sucesso
import Failure from './components/Failure';  // Componente de falha
import Pending from './components/Pending';  // Componente de pendência
import Login from './components/Login';  // Componente de Login do Administrador
import Admin from './components/Admin';  // Componente da área de Administração
import Home from './components/Home';  // Componente Home
import CampaignPage from './components/CampaignPage';  // Componente de página da campanha
import Campanhas from './components/Campanhas';  // Componente para listar campanhas
import RegisterPage from './components/RegisterPage';  // Componente da página de cadastro
import UserLogin from './components/UserLogin';  // Componente de login de usuários externos
import SobreNos from './components/SobreNos';  // Componente da página Sobre Nós
import './App.css';  // Estilos globais

function App() {
    return (
        <Router>
            {/* Navbar com os botões Home, Campanhas, Sobre Nós, Entrar e Login Admin */}
            <nav className="navbar">
                <ul className="nav-menu">
                    {/* Link para a página Home */}
                    <li className="nav-item">
                        <Link to="/">Home</Link>
                    </li>
                    {/* Link para a página Campanhas */}
                    <li className="nav-item">
                        <Link to="/campanhas">Campanhas</Link>
                    </li>
                    {/* Link para a página Sobre Nós */}
                    <li className="nav-item">
                        <Link to="/sobre-nos">Sobre Nós</Link>
                    </li>
                    {/* Link para a página Entrar (Login de usuários) */}
                    <li className="nav-item">
                        <Link to="/entrar">Entrar</Link>
                    </li>
                    {/* Link para a página de login do administrador */}
                    <li className="nav-item">
                        <Link to="/login">Login Admin</Link>
                    </li>
                </ul>
            </nav>

            {/* Definindo as rotas para os componentes */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/doar" element={<Doar />} />
                <Route path="/success" element={<Success />} />
                <Route path="/failure" element={<Failure />} />
                <Route path="/pending" element={<Pending />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/campaign/:id" element={<CampaignPage />} />
                <Route path="/campanhas" element={<Campanhas />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/entrar" element={<UserLogin />} />
                <Route path="/sobre-nos" element={<SobreNos />} /> {/* Rota para a página Sobre Nós */}
            </Routes>
        </Router>
    );
}

export default App;
