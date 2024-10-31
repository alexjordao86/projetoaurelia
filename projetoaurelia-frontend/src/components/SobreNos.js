import React from 'react';
import './SobreNos.css'; // Arquivo CSS específico para a estilização da página

function SobreNos() {
    return (
        <div className="sobre-nos">
            {/* Seção 1: Título e imagem de fundo */}
            <div className="css-rfn5jw">
                <div className="chakra-container css-1032stv">
                    <h1 className="chakra-heading css-1t2km83">
                        Queremos<br /> mudar o final<br /> das histórias
                    </h1>
                </div>
                <picture aria-hidden="true" className="css-gc4kvq">
                    <source media="(max-width: 769px)" srcSet="https://d3lujmlpk1c85b.cloudfront.net/static/images/happy-old-woman-md.jpg" />
                    <img src="https://d3lujmlpk1c85b.cloudfront.net/static/images/happy-old-woman-2xl.jpg" alt="Foto de uma senhora" loading="lazy" className="chakra-image" />
                </picture>
            </div>

            {/* Seção 2: Descrição da Plataforma */}
<div className="css-1s9b6is">
    <div className="chakra-container css-atj1h6">
        <div className="css-r6z5ec">
            <p className="chakra-text">A Voaa é a plataforma de vaquinhas online do Razões para Acreditar, o maior veículo de conteúdo positivo do país.</p>
            <p className="chakra-text">Tudo começou com a história do Capoeira, um guardador de carros do Rio de Janeiro que ficou conhecido após ajudar uma senhora a atravessar a rua.</p>
            <p className="chakra-text">A campanha arrecadou mais de R$ 169mil e abriu caminho para inúmeras outras histórias, nascendo assim a Voaa.</p>
        </div>
        <div className="css-1cc8x7i">
            <img src="https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/logo_aurelia.png" alt="Logo da Aurelia" className="chakra-image" />
        </div>
    </div>
</div>

            {/* Seção 3: Funcionamento da Plataforma */}
            <div className="css-rfn5jw">
                <div className="chakra-container css-ebsobf">
                    <h2 className="chakra-heading css-1v99fuf">Como funciona <br /> nosso trabalho</h2>
                </div>
                <div aria-hidden="true" className="css-fzgvgj">
                    <img src="https://d3lujmlpk1c85b.cloudfront.net/static/images/mica-helo-fabi-xl.jpg" alt="Funcionamento" loading="lazy" className="chakra-image" />
                </div>
            </div>

            {/* Seção 4: Processo de criação das campanhas */}
<div className="css-0">
    <div className="chakra-container css-1xzfefe">
        <p className="chakra-text">Existem vários processos até a nossa campanha ser lançada, fazemos tudo com muito cuidado e carinho para que a história chegue até você certinha, como deve ser:</p>
        
        {/* Grid com ícones e texto */}
        <div className="process-grid">
    {[
        { icon: "https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/1_iconechegadahistoria.png", label: "Chegada da história" },
        { icon: "https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/2_iconecuradoriaeverificacao.png", label: "Curadoria e verificação" },
        { icon: "https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/3_iconechecagemdedocumentos.png", label: "Checagem de documentos e aprovação da história" },
        { icon: "https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/4_iconeassinaturadocontrato.png", label: "Assinatura do contrato" },
        { icon: "https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/5_iconeestrategiadelancamento.png", label: "Elaboração da estratégia de lançamento" },
        { icon: "https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/6_iconeproducaodeconteudo.png", label: "Produção de conteúdo" },
        { icon: "https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/7_iconetransferenciadovalor.png", label: "Encerramento e transferência" },
        { icon: "https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/8_iconeprestacaodecontas.png", label: "Prestação de contas" }
    ].map((item, index) => (
        <div className="grid-item" key={index}>
            <img src={item.icon} alt={`Ícone ${item.label}`} className="icon-image" />
            <h3 className="chakra-heading css-1uh4f88">
                {index + 1}. {item.label}
            </h3>
        </div>
    ))}
</div>
    </div>
</div>

            {/* Seção 5: Verificação e Segurança Jurídica */}
            <div className="css-ye6ryw">
                <div className="css-1q04xm5">
                    <img src="https://d3lujmlpk1c85b.cloudfront.net/static/images/equipe-voaa.jpg" alt="Equipe de verificação" loading="lazy" className="chakra-image" />
                </div>
                <div className="css-vknw87">
                    <div className="css-1e670zy">
                        <h3 className="chakra-heading css-1v9wg9p">Verificação das histórias</h3>
                        <p className="chakra-text">A Voaa realiza uma curadoria e verificação rigorosa para garantir que a história seja real e necessária.</p>
                        <h3 className="chakra-heading css-2dsbs1">Segurança Jurídica</h3>
                        <p className="chakra-text">Após a aprovação, um contrato é assinado com o beneficiário para garantir a transparência e legalidade do processo.</p>
                    </div>
                </div>
            </div>

            {/* Seção 6: Comunicação e Equipe */}
            <div className="css-1555sv">
                <div className="css-b509cj">
                    <div className="css-1a8fcng">
                        <h3 className="chakra-heading css-15m3kch">Comunicação</h3>
                        <p className="chakra-text">Nosso time de comunicação conta as histórias de forma humanizada, simples e respeitosa.</p>
                        <p className="chakra-text">Nosso objetivo é amplificar as histórias e engajar cada vez mais pessoas.</p>
                    </div>
                </div>
                <div className="css-1q04xm5">
                    <img src="https://d3lujmlpk1c85b.cloudfront.net/static/images/jose-pintor.jpg" alt="Foto de José Pintor" loading="lazy" className="chakra-image" />
                </div>
            </div>

            {/* Seção 7: Desfecho das campanhas */}
            <div className="css-12qt9kl">
            <div aria-hidden="true" className="css-fzgvgj">
                    <img src="https://d3lujmlpk1c85b.cloudfront.net/static/images/mica-helo-fabi-xl.jpg" alt="Funcionamento" loading="lazy" className="chakra-image" />
                </div>
                <div className="chakra-container css-t3p0h8">
                    <div className="css-1f0gpk5">
                        <h3 className="chakra-heading css-1v9wg9p">Desfecho das vaquinhas</h3>
                        <p className="chakra-text">Acompanhamos o uso do valor doado para garantir que seja destinado ao objetivo proposto.</p>
                        <p className="chakra-text">A prestação de contas é feita ao final de cada campanha para manter a transparência com os doadores.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SobreNos;
