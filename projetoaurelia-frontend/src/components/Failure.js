import React from 'react';
import './Failure.css'; // Arquivo CSS para estilização, caso necessário

function Failure() {
    return (
        <div className="failure-container">
            <h1 className="failure-title">Pagamento Falhou!</h1>
            <p className="failure-message">
                Houve um problema ao processar o pagamento. Por favor, tente novamente.
            </p>
            <button
                className="retry-button"
                onClick={() => window.location.href = '/'} // Redireciona o usuário para a página inicial
            >
                Voltar para Início
            </button>
        </div>
    );
}

export default Failure;
