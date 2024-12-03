// Importa as bibliotecas e o contexto necessário
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; // Importa o UserContext para acessar o estado de autenticação
import './Navbar.css'; // Importa o arquivo de estilos específico para a navegação

function Navbar() {
  // Usa o UserContext para obter informações sobre o usuário autenticado
  const { user } = useContext(UserContext);

  return (
    <nav className="navbar"> {/* Navbar principal */}
      {/* Contêiner interno da navbar para limitar a largura */}
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
            <Link to="/">Home</Link>
          </li>
          {/* Link para a página de Campanhas */}
          <li>
            <Link to="/campanhas">Campanhas</Link>
          </li>
          {/* Link para a página Sobre Nós */}
          <li>
            <Link to="/sobre-nos">Sobre Nós</Link>
          </li>
          {/* Verifica se o usuário está logado */}
          {user ? (
            <li className="dropdown">
              {/* Ícone do usuário e menu suspenso */}
              <div className="dropdown-trigger">
                <span className="user-icon">👤</span>
                <span>Minha Conta</span>
              </div>
              <div className="dropdown-menu">
                <Link to="/perfil">Perfil</Link> {/* Link para o perfil do usuário */}
                <Link to="/minhas-doacoes">Minhas Doações</Link> {/* Link para as doações */}
                <button
                  onClick={() => {
                    localStorage.removeItem('token'); // Remove o token ao deslogar
                    window.location.reload(); // Recarrega a página para atualizar o estado
                  }}
                  className="logout-button"
                >
                  Sair
                </button>
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
  );
}

// Exporta o componente Navbar como padrão
export default Navbar;
