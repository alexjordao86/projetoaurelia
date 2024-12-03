import React from 'react'; // Importa o React para construir o componente
import './SobreNos.css'; // Importa o arquivo CSS específico para estilização da página

function SobreNos() {
    return (
        <div className="sobre-nos"> {/* Contêiner principal para a página "Sobre Nós" */}

            {/* Seção 1: Título e imagem de fundo */}
            <div className="title-section">
                <div className="title-container bg-red">
                    <h1 className="main-title">
                        Queremos Construir Pontes<br /> para um Futuro Melhor
                    </h1>
                </div>
                <picture className="background-image" aria-hidden="true">
                    <source media="(max-width: 769px)" srcSet="https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/sobre_nos_imagem_1.jpg" />
                    <img 
                        src="https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/sobre_nos_imagem_1.jpg" 
                        alt="Foto de mulheres" 
                        loading="lazy" 
                        className="responsive-image" 
                    />
                </picture>
            </div>

            {/* Seção 2: Descrição da Plataforma */}
            <div className="description-section">
                <div className="text-container">
                    <p className="description-text">
                        O Projeto Aurelia é uma plataforma de financiamento coletivo criada para fortalecer iniciativas que apoiam mulheres. Nosso objetivo é conectar apoiadores a campanhas que promovem impacto positivo em áreas como educação, saúde e empreendedorismo, oferecendo uma ferramenta acessível para ONGs, empresas e projetos voltados ao desenvolvimento feminino.
                    </p>
                    <p className="description-text">
                        Com um ambiente seguro e transparente, garantimos a verificação cuidadosa de cada campanha, assegurando que as doações cheguem a quem realmente precisa. Trabalhamos para dar visibilidade a causas genuínas e inspiradoras, fortalecendo a rede de apoio feminino e promovendo equidade e empoderamento por meio de parcerias estratégicas.
                    </p>
                </div>
            </div>

            {/* Seção 3: Funcionamento da Plataforma */}
            <div className="how-it-works-section">
                <div className="section-title-container bg-red">
                    <h2 className="section-title">Como funciona <br /> nosso trabalho</h2>
                </div>
                <div className="function-image-container">
                    <img 
                        src="https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/artesanatoImage.jpg" 
                        alt="Funcionamento" 
                        loading="lazy" 
                        className="responsive-image" 
                    />
                </div>
            </div>

            {/* Seção 4: Processo de criação das campanhas */}
            <div className="campaign-process-section">
                <div className="process-content-container">
                    <p className="description-text">
                        Existem vários processos até a nossa campanha ser lançada. Fazemos tudo com muito cuidado e carinho para que a história chegue até você certinha, como deve ser:
                    </p>
                    <div className="process-grid">
                        {[
                            { icon: "1_iconechegadahistoria.png", label: "Chegada da história" },
                            { icon: "2_iconecuradoriaeverificacao.png", label: "Curadoria e verificação" },
                            { icon: "3_iconechecagemdedocumentos.png", label: "Checagem de documentos e aprovação da história" },
                            { icon: "4_iconeassinaturadocontrato.png", label: "Assinatura do contrato" },
                            { icon: "5_iconeestrategiadelancamento.png", label: "Elaboração da estratégia de lançamento" },
                            { icon: "6_iconeproducaodeconteudo.png", label: "Produção de conteúdo" },
                            { icon: "7_iconetransferenciadovalor.png", label: "Encerramento e transferência" },
                            { icon: "8_iconeprestacaodecontas.png", label: "Prestação de contas" },
                        ].map((item, index) => (
                            <div className="grid-item" key={index}>
                                <img 
                                    src={`https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/${item.icon}`} 
                                    alt={`Ícone ${item.label}`} 
                                    className="icon-image" 
                                />
                                <p className="process-step-title">
                                    {index + 1}. {item.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Seção 5: Verificação e Segurança Jurídica */}
            <div className="verification-section">
                <div className="verification-image-container">
                    <img 
                        src="https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/dignidade.jpg" 
                        alt="Equipe de verificação" 
                        loading="lazy" 
                        className="responsive-image" 
                    />
                </div>
                <div className="verification-content-container bg-red">
                    <h3 className="section-subtitle">Verificação das histórias</h3>
                    <p className="description-text">Realizamos uma curadoria e verificação rigorosa para garantir que a história seja real e necessária.</p>
                    <h3 className="section-subtitle">Segurança Jurídica</h3>
                    <p className="description-text">Após a aprovação, um contrato é assinado com o beneficiário para garantir a transparência e legalidade do processo.</p>
                </div>
            </div>

            {/* Seção 6: Comunicação e Equipe */}
            <div className="communication-section bg-white">
                <div className="communication-content-container">
                    <h3 className="section-subtitle">Comunicação</h3>
                    <p className="description-text">Nosso time de comunicação conta as histórias de forma humanizada, simples e respeitosa.</p>
                    <p className="description-text">Nosso objetivo é amplificar as histórias e engajar cada vez mais pessoas.</p>
                </div>
                <div className="communication-image-container">
                    <img 
                        src="https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/educacaoImage.jpg" 
                        alt="Equipe de comunicação" 
                        loading="lazy" 
                        className="responsive-image" 
                    />
                </div>
            </div>

            {/* Seção 7: Desfecho das campanhas */}
            <div className="campaign-conclusion-section">
                <div className="conclusion-image-container">
                    <img 
                        src="https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/meninas_cozinhando.jpg" 
                        alt="Desfecho" 
                        loading="lazy" 
                        className="responsive-image" 
                    />
                </div>
                <div className="conclusion-content-container bg-red">
                    <h3 className="section-subtitle">Desfecho das campanhas</h3>
                    <p className="description-text">Acompanhamos o uso do valor doado para garantir que seja destinado ao objetivo proposto.</p>
                    <p className="description-text">A prestação de contas é feita ao final de cada campanha para manter a transparência com os doadores.</p>
                </div>
            </div>
        </div>
    );
}

export default SobreNos;
