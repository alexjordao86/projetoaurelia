import React from 'react';
import './Success.css'; // Importa o arquivo CSS para estilização

function Success() {
    return (
        <div className="success-container">
            <h1 className="success-title">Pagamento realizado com sucesso!</h1>
            <p className="success-message">Obrigado pela sua contribuição. Sua doação foi registrada com sucesso e fará a diferença!</p>
            <button
                className="back-home-button"
                onClick={() => window.location.href = '/'}
            >
                Voltar para a página inicial
            </button>
        </div>
    );
}

export default Success;
