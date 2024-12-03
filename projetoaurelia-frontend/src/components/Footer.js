// Importa as bibliotecas necessárias
import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaTwitter, FaTiktok } from 'react-icons/fa'; // Importa ícones das redes sociais
import './Footer.css'; // Importa o arquivo de estilos específico para o footer

function Footer() {
  return (
    <footer className="footer"> {/* Contêiner principal do footer */}
      <div className="footer-container"> {/* Limita o conteúdo a 80% da largura da página */}
        {/* Seção de Links */}
        <div className="footer-links">
          <Link to="/termos-de-uso">Termos de Uso</Link> {/* Link para Termos de Uso */}
          <Link to="/politica-de-privacidade">Política de Privacidade</Link> {/* Link para Política de Privacidade */}
          <Link to="/preferencias-de-cookies">Preferência de Cookies</Link> {/* Link para Preferências de Cookies */}
        </div>

        {/* Seção de Redes Sociais */}
        <div className="footer-social">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a> {/* Ícone do Instagram */}
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a> {/* Ícone do Facebook */}
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a> {/* Ícone do X (Twitter) */}
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"><FaTiktok /></a> {/* Ícone do TikTok */}
        </div>

        {/* Seção de Endereço e Contato */}
        <div className="footer-contact">
          <p>Endereço: Rua Exemplo, 123, Cidade - Estado</p> {/* Endereço */}
          <Link to="/fale-conosco">Fale Conosco</Link> {/* Link para página de contato */}
        </div>
      </div>
    </footer>
  );
}

// Exporta o componente Footer como padrão
export default Footer;
