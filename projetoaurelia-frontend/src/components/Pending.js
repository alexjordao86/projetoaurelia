import React from 'react';
import './Pending.css'; // Arquivo CSS para estilização da página

function Pending() {
    return (
        <div className="pending-container">
            <div className="pending-content">
                <h1>Pagamento Pendente!</h1>
                <p>
                    Seu pagamento está sendo processado. Por favor, aguarde enquanto aguardamos a confirmação do
                    provedor de pagamento. Você será notificado assim que o status for atualizado.
                </p>
                <img
                    src="https://imagens-campanhas-aurelia.s3.us-east-1.amazonaws.com/imagens-plataforma/payment_pending.png"
                    alt="Pagamento Pendente"
                    className="pending-image"
                />
                <p>Obrigado por contribuir! 💜</p>
            </div>
        </div>
    );
}

export default Pending;
