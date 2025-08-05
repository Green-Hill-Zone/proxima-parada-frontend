/* ===================================================================== */
/* SERVIÇO DE VOOS - INTEGRAÇÃO COM BACKEND                            */
/* ===================================================================== */
/*
 * Este arquivo implementa a comunicação com a API de voos do backend.
 * Segue os princípios:
 * - KISS: Interface simples e direta
 * - DRY: Reutilização do padrão de outros serviços
 * - YAGNI: Apenas funcionalidades necessárias
 */

import axios from 'axios';
import { normalizeText } from '../utils/textUtils';

// Base URL da API
const API_BASE_URL = 'https://localhost:7102/api';

/* ===================================================================== */
/* INTERFACES E TIPOS                                                   */
/* ===================================================================== */

// Interface do voo (frontend)
export interface Flight {
  id: number;
  flightNumber: string;
  airline: {
    id: number;
    name: string;
    iataCode: string;
  };
  originDestination: {
    id: number;
    name: string;
    country: string;
    state?: string;
    city?: string;
  };
  finalDestination: {
    id: number;
    name: string;
    country: string;
    state?: string;
    city?: string;
  };
  departureDateTime: string;
  arrivalDateTime: string;
  cabinClass: string;
  seatClass: string;
  price: number;
  availableSeats: number;
  createdAt: string;
  updatedAt?: string;
}

// Interface do voo como vem do backend
interface BackendFlight {
  id: number;
  flightNumber: string;
  airline: {
    id: number;
    name: string;
    code: string;
  };
  originDestination: {
    id: number;
    name: string;
    country: string;
    state?: string;
    city?: string;
  };
  finalDestination: {
    id: number;
    name: string;
    country: string;
    state?: string;
    city?: string;
  };
  departureDateTime: string;
  arrivalDateTime: string;
  cabinClass: string;
  seatClass: string | null;
  price: number | null;
  availableSeats: number | null;
  createdAt: string;
  updatedAt?: string;
}

// Interface para busca de voos
export interface FlightSearchParams {
  originId?: number;
  destinationId?: number;
  airlineId?: number;
  departureDate?: string;
  returnDate?: string;
  cabinClass?: string;
  seatClass?: string;
  isInternational?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

/* ===================================================================== */
/* FUNÇÕES DO SERVIÇO                                                   */
/* ===================================================================== */

/**
 * Determina se um voo é internacional
 * @param flight - Dados do voo
 * @returns true se o voo for internacional
 */
export const isFlightInternational = (flight: Flight): boolean => {
  const originCountry = normalizeText(flight.originDestination.country || '');
  const destinationCountry = normalizeText(flight.finalDestination.country || '');
  
  return originCountry !== destinationCountry;
};

/**
 * Normaliza nomes de classes de voo para busca
 * @param className - Nome da classe
 * @returns Array de possíveis nomes normalizados
 */
export const normalizeFlightClass = (className: string): string[] => {
  const normalized = normalizeText(className);
  const variations: string[] = [normalized];
  
  // Mapeamento de variações comuns
  const classMap: Record<string, string[]> = {
    'economy': ['economy', 'economica', 'economico', 'eco', 'tourist', 'turistica'],
    'business': ['business', 'executiva', 'executivo', 'biz'],
    'first': ['first', 'primeira', 'first class', 'primeira classe'],
    'premium': ['premium', 'premium economy', 'premium eco'],
    'standard': ['standard', 'padrao', 'basico', 'normal']
  };
  
  // Encontra variações para a classe
  for (const [, values] of Object.entries(classMap)) {
    if (values.some(v => normalized.includes(v))) {
      variations.push(...values);
      break;
    }
  }
  
  return [...new Set(variations)]; // Remove duplicatas
};

/**
 * Verifica se uma classe de voo corresponde ao filtro
 * @param flightClass - Classe do voo
 * @param searchClass - Classe procurada
 * @returns true se corresponder
 */
export const matchesFlightClass = (flightClass: string, searchClass: string): boolean => {
  if (!flightClass || !searchClass) return false;
  
  const flightClassVariations = normalizeFlightClass(flightClass);
  const searchClassVariations = normalizeFlightClass(searchClass);
  
  return flightClassVariations.some(fv => 
    searchClassVariations.some(sv => fv.includes(sv) || sv.includes(fv))
  );
};

/**
 * Mapeia os dados do backend para o formato esperado pelo frontend
 * @param backendFlight - Dados do voo como vem do backend
 * @returns Voo no formato do frontend
 */
const mapBackendFlightToFrontend = (backendFlight: BackendFlight): Flight => {
  return {
    id: backendFlight.id,
    flightNumber: backendFlight.flightNumber || 'N/A',
    airline: {
      id: backendFlight.airline.id,
      name: backendFlight.airline.name || 'Companhia Desconhecida',
      iataCode: backendFlight.airline.code || 'XX' // Mapeia code para iataCode
    },
    originDestination: {
      id: backendFlight.originDestination.id,
      name: backendFlight.originDestination.name || 'Origem Desconhecida',
      country: backendFlight.originDestination.country || 'País Desconhecido',
      state: backendFlight.originDestination.state,
      city: backendFlight.originDestination.city
    },
    finalDestination: {
      id: backendFlight.finalDestination.id,
      name: backendFlight.finalDestination.name || 'Destino Desconhecido',
      country: backendFlight.finalDestination.country || 'País Desconhecido',
      state: backendFlight.finalDestination.state,
      city: backendFlight.finalDestination.city
    },
    departureDateTime: backendFlight.departureDateTime,
    arrivalDateTime: backendFlight.arrivalDateTime,
    cabinClass: backendFlight.cabinClass || 'Econômica',
    seatClass: backendFlight.seatClass || 'Standard', // Valor padrão se null
    price: backendFlight.price ?? 1500, // YAGNI: Preço padrão realista se null
    availableSeats: backendFlight.availableSeats || 50, // Valor padrão se null
    createdAt: backendFlight.createdAt,
    updatedAt: backendFlight.updatedAt
  };
};

/**
 * Busca todos os voos disponíveis
 * @returns Promise com lista de voos
 */
export const getAllFlights = async (): Promise<Flight[]> => {
  try {
    console.log('🔄 Buscando todos os voos...');
    
    const response = await axios.get(`${API_BASE_URL}/Flight`);
    
    console.log('📋 Resposta do backend:', response.data);
    
    let backendFlightsList: BackendFlight[];
    
    // Verifica se a resposta tem o formato ReferenceHandler.Preserve
    if (response.data && typeof response.data === 'object' && '$values' in response.data) {
      backendFlightsList = response.data.$values;
      console.log(`✅ Voos carregados (ReferenceHandler): Total: ${backendFlightsList.length}`);
    } else if (Array.isArray(response.data)) {
      backendFlightsList = response.data;
      console.log(`✅ Voos carregados (Array): Total: ${backendFlightsList.length}`);
    } else {
      console.error('❌ Formato de resposta inesperado:', response.data);
      throw new Error('Formato de resposta do servidor inválido');
    }
    
    // Se não há voos no backend, retorna dados de demonstração
    if (backendFlightsList.length === 0) {
      console.log('📝 Nenhum voo encontrado no backend, usando dados de demonstração');
      return getMockFlights();
    }
    
    // Mapeia os dados do backend para o formato do frontend
    const frontendFlights = backendFlightsList.map(mapBackendFlightToFrontend);
    console.log(`🔄 Voos mapeados para o frontend: ${frontendFlights.length}`);
    
    return frontendFlights;
    
  } catch (error) {
    console.error('❌ Erro ao buscar voos:', error);
    
    // Em caso de erro, retorna dados de demonstração
    console.log('📝 Erro na API, usando dados de demonstração');
    return getMockFlights();
  }
};

/**
 * Busca voo por ID
 * @param id - ID do voo
 * @returns Promise com dados do voo
 */
export const getFlightById = async (id: number): Promise<Flight> => {
  try {
    console.log(`🔄 Buscando voo ID: ${id}`);
    
    const response = await axios.get(`${API_BASE_URL}/Flight/${id}`);
    
    console.log('📋 Voo encontrado:', response.data);
    
    // Mapeia o voo do backend para o formato do frontend
    const frontendFlight = mapBackendFlightToFrontend(response.data as BackendFlight);
    
    return frontendFlight;
    
  } catch (error) {
    console.error('❌ Erro ao buscar voo:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Voo não encontrado');
      }
      throw new Error(`Erro do servidor: ${error.response?.status}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

/**
 * Busca voos por origem e destino
 * @param originId - ID da origem
 * @param destinationId - ID do destino
 * @returns Promise com lista de voos
 */
export const getFlightsByRoute = async (originId: number, destinationId: number): Promise<Flight[]> => {
  try {
    console.log(`🔄 Buscando voos de ${originId} para ${destinationId}`);
    
    const response = await axios.get(`${API_BASE_URL}/Flight/route/${originId}/${destinationId}`);
    
    console.log('📋 Voos da rota:', response.data);
    
    // KISS: Lidar com estrutura do .NET que retorna {$id, $values}
    let backendFlights: any[] = [];
    if (Array.isArray(response.data)) {
      backendFlights = response.data;
    } else if (response.data && response.data.$values && Array.isArray(response.data.$values)) {
      backendFlights = response.data.$values;
      console.log('📋 Voos extraídos do $values:', backendFlights.length);
    }
    
    // Mapeia os dados do backend para o formato do frontend
    const frontendFlights = backendFlights.map(mapBackendFlightToFrontend);
    
    return frontendFlights;
    
  } catch (error) {
    console.error('❌ Erro ao buscar voos por rota:', error);
    
    if (axios.isAxiosError(error)) {
      throw new Error(`Erro do servidor: ${error.response?.status}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

/**
 * Busca voos por companhia aérea
 * @param airlineId - ID da companhia aérea
 * @returns Promise com lista de voos
 */
export const getFlightsByAirline = async (airlineId: number): Promise<Flight[]> => {
  try {
    console.log(`🔄 Buscando voos da companhia ${airlineId}`);
    
    const response = await axios.get(`${API_BASE_URL}/Flight/airline/${airlineId}`);
    
    console.log('📋 Voos da companhia:', response.data);
    
    const backendFlights = Array.isArray(response.data) ? response.data : [];
    
    // Mapeia os dados do backend para o formato do frontend
    const frontendFlights = backendFlights.map(mapBackendFlightToFrontend);
    
    return frontendFlights;
    
  } catch (error) {
    console.error('❌ Erro ao buscar voos por companhia:', error);
    
    if (axios.isAxiosError(error)) {
      throw new Error(`Erro do servidor: ${error.response?.status}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

/**
 * Busca voos com filtros avançados
 * @param params - Parâmetros de busca
 * @returns Promise com lista de voos filtrados
 */
export const searchFlights = async (params: FlightSearchParams): Promise<Flight[]> => {
  try {
    console.log('🔍 Buscando voos com filtros:', params);
    
    // Por enquanto, busca todos os voos e filtra no frontend (KISS)
    const allFlights = await getAllFlights();
    
    let filteredFlights = allFlights;
    
    // Filtro por origem
    if (params.originId) {
      filteredFlights = filteredFlights.filter(flight => 
        flight.originDestination.id === params.originId
      );
    }
    
    // Filtro por destino
    if (params.destinationId) {
      filteredFlights = filteredFlights.filter(flight => 
        flight.finalDestination.id === params.destinationId
      );
    }
    
    // Filtro por companhia aérea
    if (params.airlineId) {
      filteredFlights = filteredFlights.filter(flight => 
        flight.airline.id === params.airlineId
      );
    }
    
    // Filtro por data de partida
    if (params.departureDate) {
      const searchDate = new Date(params.departureDate);
      filteredFlights = filteredFlights.filter(flight => {
        const flightDate = new Date(flight.departureDateTime);
        return flightDate.toDateString() === searchDate.toDateString();
      });
    }
    
    // Filtro por classe da cabine
    if (params.cabinClass) {
      filteredFlights = filteredFlights.filter(flight => 
        matchesFlightClass(flight.cabinClass, params.cabinClass!)
      );
    }
    
    // Filtro por classe do assento
    if (params.seatClass) {
      filteredFlights = filteredFlights.filter(flight => 
        matchesFlightClass(flight.seatClass || '', params.seatClass!)
      );
    }
    
    // Filtro por tipo de voo (nacional/internacional)
    if (params.isInternational !== undefined) {
      filteredFlights = filteredFlights.filter(flight => 
        isFlightInternational(flight) === params.isInternational
      );
    }
    
    // Filtro por preço mínimo
    if (params.minPrice !== undefined) {
      filteredFlights = filteredFlights.filter(flight => 
        (flight.price || 0) >= params.minPrice!
      );
    }
    
    // Filtro por preço máximo
    if (params.maxPrice !== undefined) {
      filteredFlights = filteredFlights.filter(flight => 
        (flight.price || 0) <= params.maxPrice!
      );
    }
    
    console.log(`✅ ${filteredFlights.length} voos encontrados após filtros`);
    return filteredFlights;
    
  } catch (error) {
    console.error('❌ Erro na busca de voos:', error);
    throw error;
  }
};

/**
 * Busca voos por texto livre (nome da cidade, companhia, etc.)
 * @param searchTerm - Termo de busca
 * @returns Promise com lista de voos que correspondem ao termo
 */
export const searchFlightsByText = async (searchTerm: string): Promise<Flight[]> => {
  try {
    console.log(`🔍 Buscando voos por texto: "${searchTerm}"`);
    
    if (!searchTerm.trim()) {
      return await getAllFlights();
    }
    
    const allFlights = await getAllFlights();
    const searchNormalized = normalizeText(searchTerm);
    
    const filteredFlights = allFlights.filter(flight => {
      // Busca no número do voo
      const flightNumber = normalizeText(flight.flightNumber);
      
      // Busca na companhia aérea
      const airlineName = normalizeText(flight.airline.name);
      const airlineCode = normalizeText(flight.airline.iataCode);
      
      // Busca na origem
      const originName = normalizeText(flight.originDestination.name);
      const originCountry = normalizeText(flight.originDestination.country);
      const originCity = normalizeText(flight.originDestination.city || '');
      
      // Busca no destino
      const destinationName = normalizeText(flight.finalDestination.name);
      const destinationCountry = normalizeText(flight.finalDestination.country);
      const destinationCity = normalizeText(flight.finalDestination.city || '');
      
      // Busca por classe com variações
      const classMatches = matchesFlightClass(flight.cabinClass, searchTerm) ||
                          matchesFlightClass(flight.seatClass || '', searchTerm);
      
      // Busca por tipo de voo (nacional/internacional)
      const typeMatches = (() => {
        const isInternational = isFlightInternational(flight);
        const searchLower = searchNormalized;
        
        if (isInternational) {
          return searchLower.includes('internacional') || 
                 searchLower.includes('international') ||
                 searchLower.includes('inter');
        } else {
          return searchLower.includes('nacional') || 
                 searchLower.includes('domestic') ||
                 searchLower.includes('domestico');
        }
      })();
      
      return flightNumber.includes(searchNormalized) ||
             airlineName.includes(searchNormalized) ||
             airlineCode.includes(searchNormalized) ||
             originName.includes(searchNormalized) ||
             originCountry.includes(searchNormalized) ||
             originCity.includes(searchNormalized) ||
             destinationName.includes(searchNormalized) ||
             destinationCountry.includes(searchNormalized) ||
             destinationCity.includes(searchNormalized) ||
             classMatches ||
             typeMatches;
    });
    
    console.log(`✅ ${filteredFlights.length} voos encontrados para "${searchTerm}"`);
    return filteredFlights;
    
  } catch (error) {
    console.error('❌ Erro na busca por texto:', error);
    throw error;
  }
};

/**
 * Formata duração do voo para exibição
 * @param departure - Data/hora de partida
 * @param arrival - Data/hora de chegada
 * @returns Duração formatada (ex: "2h 30m")
 */
export const calculateFlightDuration = (departure: string, arrival: string): string => {
  try {
    const departureDate = new Date(departure);
    const arrivalDate = new Date(arrival);
    
    const durationMs = arrivalDate.getTime() - departureDate.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  } catch (error) {
    return 'N/A';
  }
};

/**
 * Formata preço para exibição em reais
 * @param price - Preço numérico
 * @returns Preço formatado (ex: "R$ 1.250,00")
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

/**
 * Formata data/hora para exibição
 * @param dateTime - Data/hora ISO
 * @returns Data/hora formatada (ex: "15/08 - 14:30")
 */
export const formatDateTime = (dateTime: string): string => {
  try {
    const date = new Date(dateTime);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month} - ${hours}:${minutes}`;
  } catch (error) {
    return 'N/A';
  }
};

/* ===================================================================== */
/* DADOS DE DEMONSTRAÇÃO                                               */
/* ===================================================================== */

/**
 * Retorna dados de demonstração para voos
 * @returns Lista de voos fictícios para demonstração
 */
const getMockFlights = (): Flight[] => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return [
    {
      id: 1,
      flightNumber: "LA3090",
      airline: {
        id: 1,
        name: "LATAM Airlines",
        iataCode: "LA"
      },
      originDestination: {
        id: 1,
        name: "São Paulo",
        country: "Brasil",
        state: "SP",
        city: "São Paulo"
      },
      finalDestination: {
        id: 2,
        name: "Rio de Janeiro",
        country: "Brasil",
        state: "RJ",
        city: "Rio de Janeiro"
      },
      departureDateTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 8, 30).toISOString(),
      arrivalDateTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 10, 45).toISOString(),
      cabinClass: "Econômica",
      seatClass: "Standard",
      price: 350.00,
      availableSeats: 45,
      createdAt: today.toISOString(),
      updatedAt: today.toISOString()
    },
    {
      id: 2,
      flightNumber: "G34521",
      airline: {
        id: 2,
        name: "GOL Linhas Aéreas",
        iataCode: "G3"
      },
      originDestination: {
        id: 2,
        name: "Rio de Janeiro",
        country: "Brasil",
        state: "RJ",
        city: "Rio de Janeiro"
      },
      finalDestination: {
        id: 3,
        name: "Salvador",
        country: "Brasil",
        state: "BA",
        city: "Salvador"
      },
      departureDateTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 14, 15).toISOString(),
      arrivalDateTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 16, 50).toISOString(),
      cabinClass: "Econômica",
      seatClass: "Standard",
      price: 420.00,
      availableSeats: 23,
      createdAt: today.toISOString(),
      updatedAt: today.toISOString()
    },
    {
      id: 3,
      flightNumber: "AD4102",
      airline: {
        id: 3,
        name: "Azul Linhas Aéreas",
        iataCode: "AD"
      },
      originDestination: {
        id: 1,
        name: "São Paulo",
        country: "Brasil",
        state: "SP",
        city: "São Paulo"
      },
      finalDestination: {
        id: 4,
        name: "Fortaleza",
        country: "Brasil",
        state: "CE",
        city: "Fortaleza"
      },
      departureDateTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 19, 20).toISOString(),
      arrivalDateTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 22, 35).toISOString(),
      cabinClass: "Executiva",
      seatClass: "Premium",
      price: 850.00,
      availableSeats: 12,
      createdAt: today.toISOString(),
      updatedAt: today.toISOString()
    },
    {
      id: 4,
      flightNumber: "LA8045",
      airline: {
        id: 1,
        name: "LATAM Airlines",
        iataCode: "LA"
      },
      originDestination: {
        id: 3,
        name: "Salvador",
        country: "Brasil",
        state: "BA",
        city: "Salvador"
      },
      finalDestination: {
        id: 5,
        name: "Recife",
        country: "Brasil",
        state: "PE",
        city: "Recife"
      },
      departureDateTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 11, 0).toISOString(),
      arrivalDateTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 12, 25).toISOString(),
      cabinClass: "Econômica",
      seatClass: "Standard",
      price: 280.00,
      availableSeats: 67,
      createdAt: today.toISOString(),
      updatedAt: today.toISOString()
    },
    {
      id: 5,
      flightNumber: "G37891",
      airline: {
        id: 2,
        name: "GOL Linhas Aéreas",
        iataCode: "G3"
      },
      originDestination: {
        id: 4,
        name: "Fortaleza",
        country: "Brasil",
        state: "CE",
        city: "Fortaleza"
      },
      finalDestination: {
        id: 1,
        name: "São Paulo",
        country: "Brasil",
        state: "SP",
        city: "São Paulo"
      },
      departureDateTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 6, 45).toISOString(),
      arrivalDateTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 9, 55).toISOString(),
      cabinClass: "Econômica",
      seatClass: "Standard",
      price: 620.00,
      availableSeats: 0, // Voo esgotado para demonstrar estado
      createdAt: today.toISOString(),
      updatedAt: today.toISOString()
    },
    {
      id: 6,
      flightNumber: "AD2567",
      airline: {
        id: 3,
        name: "Azul Linhas Aéreas",
        iataCode: "AD"
      },
      originDestination: {
        id: 2,
        name: "Rio de Janeiro",
        country: "Brasil",
        state: "RJ",
        city: "Rio de Janeiro"
      },
      finalDestination: {
        id: 6,
        name: "Brasília",
        country: "Brasil",
        state: "DF",
        city: "Brasília"
      },
      departureDateTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 16, 30).toISOString(),
      arrivalDateTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 18, 10).toISOString(),
      cabinClass: "Executiva",
      seatClass: "Premium",
      price: 950.00,
      availableSeats: 8,
      createdAt: today.toISOString(),
      updatedAt: today.toISOString()
    }
  ];
};
