// Importa ferramentas de teste da biblioteca React Testing Library
import { render, screen } from '@testing-library/react';
// Importa o componente principal da aplicação
import App from './App';

// Teste básico para verificar se o componente App renderiza corretamente
test('verifica se o link "learn react" está presente na página', () => {
  // Renderiza o componente App no ambiente de teste
  render(<App />);
  
  // Procura um elemento de texto que contenha "learn react" (não sensível a maiúsculas/minúsculas)
  const linkElement = screen.getByText(/learn react/i);
  
  // Verifica se o elemento encontrado está no DOM
  expect(linkElement).toBeInTheDocument();
});
