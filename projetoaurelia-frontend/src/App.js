// Importa as bibliotecas e ferramentas necessárias
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';

// Importa os componentes do aplicativo
import Header from './components/Header';
import Footer from './components/Footer';
import Doar from './components/Doar';
import Success from './components/Success';
import Failure from './components/Failure';
import Pending from './components/Pending';
import LoginAdmin from './components/LoginAdmin';
import Admin from './components/Admin';
import Home from './components/Home';
import CampaignPage from './components/CampaignPage';
import Campanhas from './components/Campanhas';
import RegisterPage from './components/RegisterPage';
import UserLogin from './components/UserLogin';
import SobreNos from './components/SobreNos';
import EnvieSuaHistoria from './components/EnvieSuaHistoria';
import Historias from './components/Historias';
import PrivateRoute from './components/PrivateRoute';
import UserProfile from './components/UserProfile';
import OutrasFormasDeApoiar from './components/OutrasFormasDeApoiar';
import './App.css';

// Define o componente principal App
function App() {
    return (
        <UserProvider>
            <Router>
                <Header />

                <Routes>
                    {/* Rota para a página inicial */}
                    <Route path="/" element={<Home />} />

                    {/* Rotas relacionadas a doações */}
                    <Route path="/doar" element={<Doar />} />
                    <Route path="/success" element={<Success />} />
                    <Route path="/failure" element={<Failure />} />
                    <Route path="/pending" element={<Pending />} />

                    {/* Rota para login de usuários externos */}
                    <Route path="/login" element={<UserLogin />} />

                    {/* Rota para login do administrador */}
                    <Route path="/admin" element={<LoginAdmin />} />

                    {/* Rota protegida para o dashboard do administrador */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <PrivateRoute>
                                <Admin />
                            </PrivateRoute>
                        }
                    />

                    {/* Rota para página individual de uma campanha */}
                    <Route path="/campaign/:id" element={<CampaignPage />} />

                    {/* Rota para a página de listagem de campanhas */}
                    <Route path="/campanhas" element={<Campanhas />} />

                    {/* Rota para a página de cadastro de usuários */}
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Rota para a página Sobre Nós */}
                    <Route path="/sobre-nos" element={<SobreNos />} />

                    {/* Rota para o formulário de envio de histórias */}
                    <Route path="/envie-sua-historia" element={<EnvieSuaHistoria />} />

                    {/* Rota para a página de histórias enviadas */}
                    <Route path="/historias" element={<Historias />} />

                    {/* Rota para a página "Outras Formas de Apoiar" */}
                    <Route path="/outras-formas-de-apoiar" element={<OutrasFormasDeApoiar />} />

                    {/* Rota protegida para o perfil do usuário */}
                    <Route
                        path="/perfil"
                        element={
                            <PrivateRoute>
                                <UserProfile />
                            </PrivateRoute>
                        }
                    />
                </Routes>

                <Footer />
            </Router>
        </UserProvider>
    );
}

export default App;
