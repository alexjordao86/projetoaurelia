import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = () => {
    // Estados para armazenar os valores dos campos do formulário
    const [formData, setFormData] = useState({
        cpf_cnpj: '',
        full_name: '',
        phone_number: '',
        email: '',
        password: '',
        confirmPassword: '',
        termsAccepted: false
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Função para lidar com as mudanças nos campos do formulário
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    // Função para lidar com o envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        // Validações básicas antes de enviar o formulário
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('As senhas não coincidem.');
            return;
        }

        if (!formData.termsAccepted) {
            setErrorMessage('Você precisa aceitar os termos de uso.');
            return;
        }

        try {
            // Faz uma requisição POST para registrar o usuário
            const response = await axios.post('http://localhost:4000/api/auth/register', {
                cpf_cnpj: formData.cpf_cnpj,
                full_name: formData.full_name,
                phone_number: formData.phone_number,
                email: formData.email,
                password: formData.password,
            });

            setSuccessMessage('Cadastro realizado com sucesso!');
            // Redirecionar ou limpar o formulário após o sucesso

        } catch (error) {
            console.error('Erro ao registrar:', error);
            setErrorMessage('Ocorreu um erro ao registrar o usuário.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Cadastro</h2>
            <input
                type="text"
                name="cpf_cnpj"
                placeholder="CPF ou CNPJ"
                value={formData.cpf_cnpj}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="full_name"
                placeholder="Nome Completo ou Razão Social"
                value={formData.full_name}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="phone_number"
                placeholder="Telefone"
                value={formData.phone_number}
                onChange={handleChange}
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Senha"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar Senha"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
            />
            <label>
                <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                />
                Aceito os Termos de Uso e a Política de Privacidade
            </label>
            <button type="submit">Criar Conta</button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </form>
    );
};

export default RegisterForm;
