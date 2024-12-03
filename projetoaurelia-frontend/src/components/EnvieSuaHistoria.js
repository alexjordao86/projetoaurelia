import React, { useState } from 'react'; // Importa React e useState para gerenciar o estado do formulário
import axios from 'axios'; // Importa axios para fazer requisições HTTP
import './EnvieSuaHistoria.css'; // Importa o arquivo CSS para estilização do componente

function EnvieSuaHistoria() {
  // Estado inicial para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    nome: '', // Nome da pessoa
    instituicao: '', // Nome da instituição
    documento: '', // CPF ou CNPJ
    email: '', // E-mail de contato
    telefone: '', // Telefone de contato
    endereco: '', // Endereço
    historia: '', // Descrição da história
    arquivos: [], // Arquivos anexados
  });

  // URL base do backend obtida da variável de ambiente
  const apiURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

  // Função para lidar com mudanças nos campos de texto do formulário
  const handleChange = (e) => {
    const { name, value } = e.target; // Extrai o nome e valor do campo
    setFormData({ ...formData, [name]: value }); // Atualiza o estado com o novo valor
  };

  // Função para lidar com mudanças nos campos de arquivo
  const handleFileChange = (e) => {
    setFormData({ ...formData, arquivos: e.target.files }); // Atualiza o estado com os arquivos selecionados
  };

  // Função para enviar os dados do formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão de envio do formulário

    const data = new FormData(); // Cria um objeto FormData para enviar dados multipart
    for (const key in formData) {
      if (key === 'arquivos') {
        // Adiciona cada arquivo ao FormData
        Array.from(formData[key]).forEach((file) => data.append('arquivos', file));
      } else {
        data.append(key, formData[key]); // Adiciona outros campos ao FormData
      }
    }

    try {
      // Faz a requisição POST para o backend
      const response = await axios.post(`${apiURL}/api/envio-historia`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }, // Define o cabeçalho correto para multipart
      });

      // Exibe mensagem de sucesso e reseta o formulário
      alert('História enviada com sucesso!');
      setFormData({
        nome: '',
        instituicao: '',
        documento: '',
        email: '',
        telefone: '',
        endereco: '',
        historia: '',
        arquivos: [],
      });
    } catch (error) {
      // Exibe mensagem de erro e loga no console
      console.error('Erro ao enviar história:', error);
      alert('Houve um erro. Tente novamente.');
    }
  };

  // Renderiza o formulário
  return (
    <div className="form-container">
      <h1>Envie Sua História</h1>
      <form onSubmit={handleSubmit} className="historia-form">
        <label>Nome da Pessoa:</label>
        <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />

        <label>Nome da Instituição:</label>
        <input type="text" name="instituicao" value={formData.instituicao} onChange={handleChange} required />

        <label>CPF ou CNPJ:</label>
        <input type="text" name="documento" value={formData.documento} onChange={handleChange} required />

        <label>E-mail:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Telefone:</label>
        <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} required />

        <label>Endereço:</label>
        <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} required />

        <label>
          História:
          <span className="tooltip">Inclua detalhes como o impacto e necessidade do projeto.</span>
        </label>
        <textarea name="historia" value={formData.historia} onChange={handleChange} required></textarea>

        <label>
          Anexar Fotos/Vídeos:
          <span className="tooltip">Máximo de 5 arquivos, até 10MB cada.</span>
        </label>
        <input
          type="file"
          name="arquivos"
          multiple
          accept=".jpg,.jpeg,.png,.mp4,.mov"
          onChange={handleFileChange}
        />

        <button type="submit">Enviar História</button>
      </form>
    </div>
  );
}

export default EnvieSuaHistoria; // Exporta o componente para ser usado em outras partes do projeto
