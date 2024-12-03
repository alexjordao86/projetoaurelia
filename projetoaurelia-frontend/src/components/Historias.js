import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Historias.css'; // Arquivo de estilos

function Historias() {
  const [historias, setHistorias] = useState([]); // Estado para armazenar as histórias

  // URL base do backend obtida da variável de ambiente
  const apiURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';


  // Buscar histórias ao carregar a página
  useEffect(() => {
    const fetchHistorias = async () => {
      try {
        const response = await axios.get(`${apiURL}/api/historias`);
        setHistorias(response.data); // Atualiza o estado com os dados recebidos
      } catch (error) {
        console.error('Erro ao buscar histórias:', error);
      }
    };

    fetchHistorias();
  }, [apiURL]); // Reexecuta se a URL base mudar

  return (
    <div className="historias-container">
      <h1>Histórias Submetidas</h1>
      <div className="historias-grid">
        {historias.map((historia) => (
          <div className="historia-card" key={historia.id}>
            <h2>{historia.nome}</h2>
            <p><strong>Instituição:</strong> {historia.instituicao}</p>
            <p><strong>Email:</strong> {historia.email}</p>
            <p><strong>Telefone:</strong> {historia.telefone}</p>
            <p><strong>História:</strong> {historia.historia}</p>
            <div className="arquivos">
              <strong>Arquivos:</strong>
              {(() => {
                try {
                  const arquivos = JSON.parse(historia.arquivos);
                  return arquivos.map((arquivo, index) => (
                    <a
                      key={index}
                      href={`${apiURL}/uploads/${arquivo}`} // URL dinâmica para os arquivos
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {arquivo}
                    </a>
                  ));
                } catch (error) {
                  console.warn('Arquivos inválidos para história:', historia.id);
                  return <p>Não há arquivos disponíveis.</p>;
                }
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Historias;
