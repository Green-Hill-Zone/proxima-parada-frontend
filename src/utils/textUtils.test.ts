/**
 * Testes da funcionalidade de normalização de texto
 * Este arquivo demonstra como a busca ignora acentos
 */

import { normalizeText, textContains, textContainsTerms, highlightSearchTerms } from '../utils/textUtils';

// Exemplos de teste que podem ser executados no console do navegador
console.log('=== TESTES DE NORMALIZAÇÃO DE TEXTO ===');

// Teste 1: Normalização básica
console.log('\n1. Normalização básica:');
console.log('normalizeText("São Paulo")', '→', normalizeText("São Paulo")); // "sao paulo"
console.log('normalizeText("Coração")', '→', normalizeText("Coração")); // "coracao"
console.log('normalizeText("Brasília")', '→', normalizeText("Brasília")); // "brasilia"
console.log('normalizeText("Pão de Açúcar")', '→', normalizeText("Pão de Açúcar")); // "pao de acucar"

// Teste 2: Busca com acentos
console.log('\n2. Busca ignorando acentos:');
console.log('textContains("São Paulo", "sao")', '→', textContains("São Paulo", "sao")); // true
console.log('textContains("São Paulo", "SAO")', '→', textContains("São Paulo", "SAO")); // true
console.log('textContains("Coração", "coracao")', '→', textContains("Coração", "coracao")); // true
console.log('textContains("Brasília", "brasilia")', '→', textContains("Brasília", "brasilia")); // true
console.log('textContains("Pão de Açúcar", "acucar")', '→', textContains("Pão de Açúcar", "acucar")); // true

// Teste 3: Busca reversa (termo com acento, texto sem)
console.log('\n3. Busca reversa:');
console.log('textContains("Sao Paulo", "são")', '→', textContains("Sao Paulo", "são")); // true
console.log('textContains("coracao", "coração")', '→', textContains("coracao", "coração")); // true

// Teste 4: Múltiplos termos
console.log('\n4. Múltiplos termos:');
console.log('textContainsTerms("São Paulo Brasil", ["são", "brasil"])', '→', 
  textContainsTerms("São Paulo Brasil", ["são", "brasil"])); // true

console.log('textContainsTerms("São Paulo Brasil", ["sao", "argentina"])', '→', 
  textContainsTerms("São Paulo Brasil", ["sao", "argentina"])); // true (pelo menos um)

console.log('textContainsTerms("São Paulo Brasil", ["sao", "argentina"], true)', '→', 
  textContainsTerms("São Paulo Brasil", ["sao", "argentina"], true)); // false (todos obrigatórios)

// Teste 5: Destaque de termos
console.log('\n5. Destaque de termos:');
console.log('highlightSearchTerms("São Paulo", "sao")', '→', 
  highlightSearchTerms("São Paulo", "sao"));

console.log('highlightSearchTerms("Coração do Brasil", "coracao")', '→', 
  highlightSearchTerms("Coração do Brasil", "coracao"));

// Exemplos práticos de uso em voos
console.log('\n=== EXEMPLOS PRÁTICOS ===');

// Simulação de dados de voos
const exemploVoos = [
  {
    flightNumber: 'TAM3456',
    airline: { name: 'TAM Linhas Aéreas' },
    origin: { name: 'São Paulo', country: 'Brasil' },
    destination: { name: 'João Pessoa', country: 'Brasil' }
  },
  {
    flightNumber: 'GOL7890',
    airline: { name: 'GOL Linhas Aéreas' },
    origin: { name: 'Brasília', country: 'Brasil' },
    destination: { name: 'Fortaleza', country: 'Brasil' }
  }
];

console.log('\nBusca por "sao" (sem acento):');
exemploVoos.forEach(voo => {
  const encontrado = textContains(voo.origin.name, "sao") || 
                    textContains(voo.destination.name, "sao");
  if (encontrado) {
    console.log(`✓ Voo ${voo.flightNumber}: ${voo.origin.name} → ${voo.destination.name}`);
  }
});

console.log('\nBusca por "brasilia" (sem acento):');
exemploVoos.forEach(voo => {
  const encontrado = textContains(voo.origin.name, "brasilia") || 
                    textContains(voo.destination.name, "brasilia");
  if (encontrado) {
    console.log(`✓ Voo ${voo.flightNumber}: ${voo.origin.name} → ${voo.destination.name}`);
  }
});

console.log('\nBusca por "joao" (sem acento):');
exemploVoos.forEach(voo => {
  const encontrado = textContains(voo.origin.name, "joao") || 
                    textContains(voo.destination.name, "joao");
  if (encontrado) {
    console.log(`✓ Voo ${voo.flightNumber}: ${voo.origin.name} → ${voo.destination.name}`);
  }
});

export {};
