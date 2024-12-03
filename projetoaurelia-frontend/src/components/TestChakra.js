import React from 'react'; // Importa o React
import { ChakraProvider, Box, Heading, Button, Text, VStack } from '@chakra-ui/react'; // Importa componentes do Chakra UI

function TestChakra() {
  return (
    <ChakraProvider>
      {/* Contêiner principal */}
      <Box bg="teal.500" w="100%" minH="100vh" p={4} color="white" display="flex" justifyContent="center" alignItems="center">
        <VStack spacing={4} textAlign="center">
          {/* Título principal */}
          <Heading>Chakra UI está funcionando!</Heading>
          {/* Subtítulo descritivo */}
          <Text fontSize="lg">
            Parabéns! Sua configuração do Chakra UI está funcionando perfeitamente.
          </Text>
          {/* Botão de teste */}
          <Button colorScheme="blue" size="lg" onClick={() => alert('Chakra UI funcionando!')}>
            Clique para testar
          </Button>
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default TestChakra;
