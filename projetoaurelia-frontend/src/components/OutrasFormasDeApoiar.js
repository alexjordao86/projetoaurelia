import React from 'react';
import './OutrasFormasDeApoiar.css'; // Arquivo CSS para estilização do componente

const OutrasFormasDeApoiar = () => {
  return (
    <div className="support-container">
      <h1 className="support-title">Outras Formas de Apoiar</h1>
      <p className="support-intro">
        Descubra como você pode ajudar de outras maneiras. Seja doando itens essenciais, se voluntariando, ou oferecendo serviços que
        possam transformar vidas.
      </p>

      {/* Seção de opções de apoio */}
      <div className="support-options">
        {/* Doação de itens */}
        <div className="support-card">
          <img
            src="https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/doacao_itens.png"
            alt="Doação de itens"
            className="support-image"
          />
          <h2>Doe Itens</h2>
          <p>
            Contribua com roupas, alimentos, livros e outros itens essenciais. Entre em contato para saber como enviar sua doação.
          </p>
        </div>

        {/* Trabalho voluntário */}
        <div className="support-card">
          <img
            src="https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/voluntariado.png"
            alt="Voluntariado"
            className="support-image"
          />
          <h2>Seja Voluntário</h2>
          <p>
            Doe seu tempo e habilidades para apoiar projetos sociais. Juntos podemos fazer a diferença na vida de muitas pessoas.
          </p>
        </div>

        {/* Serviços profissionais */}
        <div className="support-card">
          <img
            src="https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/servicos_profissionais.png"
            alt="Serviços profissionais"
            className="support-image"
          />
          <h2>Ofereça Serviços</h2>
          <p>
            Utilize sua experiência profissional para ajudar organizações e pessoas que precisam. Sua contribuição pode transformar vidas.
          </p>
        </div>
      </div>

      {/* Seção de contato */}
      <div className="support-contact">
        <h3>Entre em contato para mais informações</h3>
        <p>Email: <a href="mailto:contato@aurelia.com.br">contato@aurelia.com.br</a></p>
        <p>Telefone: (11) 99999-9999</p>
      </div>
    </div>
  );
};

export default OutrasFormasDeApoiar;
