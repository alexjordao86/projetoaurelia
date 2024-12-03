// Importa React e ReactDOM para renderizar a aplicação
import React from 'react';
import ReactDOM from 'react-dom/client';

// Importa o arquivo de estilos globais
import './index.css';

// Importa o componente principal do aplicativo
import App from './App';

// Importa ferramentas para medir o desempenho da aplicação
import reportWebVitals from './reportWebVitals';

// Cria a raiz onde a aplicação será renderizada
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza a aplicação dentro de React.StrictMode, que ajuda a identificar problemas potenciais
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Função para medir o desempenho do aplicativo
// Substitua `console.log` por uma função personalizada ou envie os dados para um endpoint de análise
reportWebVitals(console.log);
