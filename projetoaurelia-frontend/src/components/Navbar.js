import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Arquivo de estilos específico para a navegação

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Home</Link> {/* Botão Home */}
      </div>
      <ul className="navbar-menu">
        <li>
          <Link to="/campanhas">Campanhas</Link> {/* Botão Campanhas */}
        </li>
        <li>
          <Link to="/entrar">Entrar</Link> {/* Botão Entrar */}
        </li>
        <li>
          <Link to="/login">Admin</Link> {/* Botão Login Admin */}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
