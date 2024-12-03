import React from 'react';
import RegisterForm from './RegisterForm';
import './RegisterPage.css'; // Estilos específicos para a página de cadastro

const RegisterPage = () => {
    return (
        <div className="register-page-container">
            {/* Cabeçalho da página */}
            <header className="register-header">
                <h1>Bem-vindo ao Cadastro</h1>
                <p>
                    Cadastre-se para participar da nossa plataforma e ajudar a transformar vidas.
                </p>
            </header>
            
            {/* Componente de formulário de cadastro */}
            <main>
                <RegisterForm />
            </main>
        </div>
    );
};

export default RegisterPage;
