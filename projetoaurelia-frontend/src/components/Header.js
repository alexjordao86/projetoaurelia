// Importa as bibliotecas e o contexto necessário
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; // Importa o UserContext para acessar o estado de autenticação
import './Navbar.css'; // Importa o arquivo de estilos específico para a navegação

function Header() {
  // Usa o UserContext para obter informações sobre o usuário autenticado
  const { user } = useContext(UserContext);

  return (
    <header> {/* Header principal que envolve a navbar */}
      <nav className="navbar"> {/* Navbar principal */}
        {/* Contêiner interno da navbar para limitar a largura a 80% da página */}
        <div className="navbar-container">
          {/* Logo alinhada à esquerda */}
          <div className="navbar-logo">
            <Link to="/">
              <img
                src="https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/logo_principal_aurelia+-+co%CC%81pia.png"
                alt="Logo Aurelia"
                className="logo-image" // Classe para a logo
              />
            </Link>
          </div>

          {/* Menu de navegação, alinhado à direita */}
          <ul className="navbar-menu">
            {/* Link para a página Home */}
            <li>
              <Link to="/">Home</Link> {/* Botão Home */}
            </li>
            {/* Link para a página de Campanhas */}
            <li>
              <Link to="/campanhas">Campanhas</Link> {/* Botão Campanhas */}
            </li>
            {/* Link para a página Sobre Nós */}
            <li>
              <Link to="/sobre-nos">Sobre Nós</Link> {/* Botão Sobre Nós */}
            </li>
            {/* Verifica se o usuário está logado */}
            {user ? (
              <li className="dropdown">
                <span className="user-icon">👤</span> {/* Ícone do usuário */}
                <span>Minha Conta</span>
                <div className="dropdown-content">
                  <Link to="/perfil">Perfil</Link> {/* Link para o perfil do usuário */}
                  <Link to="/minhas-doacoes">Minhas Doações</Link> {/* Link para as doações do usuário */}
                </div>
              </li>
            ) : (
              <li>
                <Link to="/login">Entrar</Link> {/* Botão Entrar */}
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}

// Exporta o componente Header como padrão
export default Header;
