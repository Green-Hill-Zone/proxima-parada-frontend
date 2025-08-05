/**
 * Utilitários para normalização de texto e busca
 */

/**
 * Remove acentos e caracteres especiais para busca mais flexível
 * @param text - Texto para normalizar
 * @returns Texto sem acentos e em minúsculas
 */
export const normalizeText = (text: string): string => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .normalize('NFD') // Decompõe caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
    .replace(/[^\w\s]/g, '') // Remove caracteres especiais exceto espaços
    .trim();
};

/**
 * Verifica se um texto contém um termo de busca (ignora acentos)
 * @param text - Texto onde buscar
 * @param searchTerm - Termo a ser procurado
 * @returns true se o termo foi encontrado
 */
export const textContains = (text: string, searchTerm: string): boolean => {
  if (!text || !searchTerm) return false;
  
  const normalizedText = normalizeText(text);
  const normalizedSearch = normalizeText(searchTerm);
  
  return normalizedText.includes(normalizedSearch);
};

/**
 * Busca múltiplos termos em um texto (ignora acentos)
 * @param text - Texto onde buscar
 * @param searchTerms - Array de termos a serem procurados
 * @param matchAll - Se true, todos os termos devem estar presentes. Se false, pelo menos um termo deve estar presente
 * @returns true se a condição de busca foi atendida
 */
export const textContainsTerms = (
  text: string, 
  searchTerms: string[], 
  matchAll: boolean = false
): boolean => {
  if (!text || !searchTerms.length) return false;
  
  const normalizedText = normalizeText(text);
  const normalizedTerms = searchTerms.map(term => normalizeText(term)).filter(term => term);
  
  if (!normalizedTerms.length) return false;
  
  if (matchAll) {
    return normalizedTerms.every(term => normalizedText.includes(term));
  } else {
    return normalizedTerms.some(term => normalizedText.includes(term));
  }
};

/**
 * Destaca termos de busca em um texto (para exibição)
 * @param text - Texto original
 * @param searchTerm - Termo a ser destacado
 * @param highlightClass - Classe CSS para destaque (opcional)
 * @returns Texto com termos destacados em HTML
 */
export const highlightSearchTerms = (
  text: string, 
  searchTerm: string, 
  highlightClass: string = 'search-highlight'
): string => {
  if (!text || !searchTerm) return text;
  
  // Cria uma regex que ignora acentos
  const normalizedSearch = normalizeText(searchTerm);
  if (!normalizedSearch) return text;
  
  // Função para encontrar posições considerando acentos
  const findMatches = (str: string): Array<{start: number, end: number, match: string}> => {
    const matches: Array<{start: number, end: number, match: string}> = [];
    const normalizedStr = normalizeText(str);
    
    let lastIndex = 0;
    let match;
    
    while ((match = normalizedStr.indexOf(normalizedSearch, lastIndex)) !== -1) {
      // Encontra a posição correspondente no texto original
      let originalStart = 0;
      let normalizedCount = 0;
      
      for (let i = 0; i < str.length; i++) {
        if (normalizedCount === match) {
          originalStart = i;
          break;
        }
        if (normalizeText(str[i])) {
          normalizedCount++;
        }
      }
      
      // Encontra o fim da correspondência
      let originalEnd = originalStart;
      let matchedChars = 0;
      
      for (let i = originalStart; i < str.length && matchedChars < normalizedSearch.length; i++) {
        const normalizedChar = normalizeText(str[i]);
        if (normalizedChar) {
          matchedChars++;
        }
        originalEnd = i + 1;
      }
      
      matches.push({
        start: originalStart,
        end: originalEnd,
        match: str.substring(originalStart, originalEnd)
      });
      
      lastIndex = match + normalizedSearch.length;
    }
    
    return matches;
  };
  
  const matches = findMatches(text);
  
  if (matches.length === 0) return text;
  
  // Constrói o texto com destaques
  let result = '';
  let lastEnd = 0;
  
  matches.forEach(match => {
    result += text.substring(lastEnd, match.start);
    result += `<span class="${highlightClass}">${match.match}</span>`;
    lastEnd = match.end;
  });
  
  result += text.substring(lastEnd);
  
  return result;
};

/**
 * Exemplos de uso:
 * 
 * normalizeText("São Paulo") // "sao paulo"
 * normalizeText("Coração") // "coracao"
 * 
 * textContains("São Paulo", "sao") // true
 * textContains("São Paulo", "paulo") // true
 * textContains("Coração", "coracao") // true
 * 
 * textContainsTerms("São Paulo Brasil", ["sao", "brasil"]) // true
 * textContainsTerms("São Paulo Brasil", ["sao", "argentina"]) // true (pelo menos um)
 * textContainsTerms("São Paulo Brasil", ["sao", "argentina"], true) // false (todos)
 * 
 * highlightSearchTerms("São Paulo", "sao") // "<<span class="search-highlight">São</span> Paulo"
 */
