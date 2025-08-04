/**
 * Utilitários para manipulação de datas e cálculos relacionados
 */

/**
 * Calcula o número de diárias entre duas datas
 * @param checkIn Data de entrada (string ISO ou Date)
 * @param checkOut Data de saída (string ISO ou Date)
 * @returns Número de diárias (sempre >= 1)
 */
export const calculateNights = (checkIn: string | Date, checkOut: string | Date): number => {
  try {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    
    // Verifica se as datas são válidas
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return 1; // Fallback para 1 diária
    }
    
    // Calcula a diferença em milissegundos
    const diffInMs = endDate.getTime() - startDate.getTime();
    
    // Converte para dias
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    
    // Garante que seja pelo menos 1 diária
    return Math.max(1, diffInDays);
  } catch (error) {
    console.warn('Erro ao calcular diárias:', error);
    return 1; // Fallback para 1 diária
  }
};

/**
 * Formata datas para exibição no formato brasileiro
 * @param date Data para formatar
 * @returns String formatada (ex: "28 jul")
 */
export const formatDisplayDate = (date: string | Date): string => {
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
  } catch (error) {
    console.warn('Erro ao formatar data:', error);
    return '';
  }
};

/**
 * Formata o dia da semana para exibição
 * @param date Data para formatar
 * @returns String do dia da semana (ex: "segunda-feira")
 */
export const formatWeekday = (date: string | Date): string => {
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    return dateObj.toLocaleDateString('pt-BR', {
      weekday: 'long'
    });
  } catch (error) {
    console.warn('Erro ao formatar dia da semana:', error);
    return '';
  }
};
