/* ===================================================================== */
/* SERVIÇO DE RESERVAS - INTEGRAÇÃO COM BACKEND                        */
/* ===================================================================== */
/*
 * Este arquivo implementa a funcionalidade de reservas com dados reais
 * do backend. Segue os princípios:
 * - KISS: Interface simples e direta
 * - DRY: Reutilização do padrão de outros serviços
 * - YAGNI: Apenas funcionalidades necessárias
 * - Backend First: Prioriza dados reais da API
 */

import axios from 'axios';
import { getAllAccommodations, type Accommodation } from './AccommodationService';

const api = axios.create({
  baseURL: 'http://localhost:5079/api', // Backend .NET API
});

/* ===================================================================== */
/* INTERFACES E TIPOS                                                   */
/* ===================================================================== */

// Interface para reserva baseada nos dados reais do backend
export interface ReservationData {
  travelPackage: {
    id: number;
    title: string;
    description: string;
    price: number;
    destination: {
      id: number;
      name: string;
      country: string;
      state?: string;
      city?: string;
    };
    company: {
      id: number;
      name: string;
      cnpj: string;
    };
    availableDates: {
      id: number;
      departureDate: string;
      returnDate: string;
      maxCapacity: number;
      availableSpots: number;
    }[];
  };
  selectedFlight?: {
    id: number;
    origin: string;
    destination: string;
    departureDate: string;
    returnDate: string;
    price: number;
  };
  selectedAccommodation?: Accommodation;
  travelers: {
    id?: number;
    name: string;
    email: string;
    phone: string;
    documentType: string;
    documentNumber: string;
    birthDate: string;
  }[];
  totalPrice: number;
}

// Interface para buscar voos alternativos
export interface FlightOption {
  id: number;
  airline: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  price: number;
  duration: string;
}

/* ===================================================================== */
/* FUNÇÕES AUXILIARES                                                   */
/* ===================================================================== */

// Função para tratar a estrutura especial do .NET com $values
const extractValues = (data: any): any => {
  if (data && data.$values) {
    return data.$values;
  }
  return data;
};

// Função para mapear dados do backend para a interface de reserva
const mapBackendPackageToReservation = (backendData: any): ReservationData['travelPackage'] => {
  // Garantir que destination seja um objeto válido
  let destination = backendData.destination || backendData.Destination;
  if (!destination) {
    destination = {
      id: 0,
      name: 'Destino não informado',
      country: 'País não informado'
    };
  }

  // Garantir que company seja um objeto válido
  let company = backendData.company || backendData.Company;
  if (!company) {
    company = {
      id: 0,
      name: 'Empresa não informada',
      cnpj: 'CNPJ não informado'
    };
  }

  // Extrair e mapear available dates
  let availableDates = extractValues(backendData.availableDates || backendData.AvailableDates) || [];
  if (!Array.isArray(availableDates)) {
    availableDates = [];
  }

  return {
    id: backendData.id || backendData.Id || 0,
    title: backendData.title || backendData.Title || 'Pacote sem nome',
    description: backendData.description || backendData.Description || 'Sem descrição',
    price: backendData.price || backendData.Price || 0,
    destination: {
      id: destination.id || destination.Id || 0,
      name: destination.name || destination.Name || 'Destino não informado',
      country: destination.country || destination.Country || 'País não informado',
      state: destination.state || destination.State,
      city: destination.city || destination.City,
    },
    company: {
      id: company.id || company.Id || 0,
      name: company.name || company.Name || 'Empresa não informada',
      cnpj: company.cnpj || company.Cnpj || 'CNPJ não informado',
    },
    availableDates: availableDates.map((date: any) => ({
      id: date.id || date.Id || 0,
      departureDate: date.departureDate || date.DepartureDate || '',
      returnDate: date.returnDate || date.ReturnDate || '',
      maxCapacity: date.maxCapacity || date.MaxCapacity || 0,
      availableSpots: date.availableSpots || date.AvailableSpots || 0,
    })),
  };
};

/* ===================================================================== */
/* FUNÇÕES PRINCIPAIS                                                   */
/* ===================================================================== */

// Inicia uma reserva com dados do TravelPackage
export const initializeReservation = async (travelPackageId: number): Promise<ReservationData | null> => {
  try {
    console.log(`🎫 Iniciando reserva para pacote ${travelPackageId}...`);
    
    // Buscar dados completos do pacote diretamente do backend
    const response = await api.get(`/TravelPackage/${travelPackageId}`);
    
    if (!response.data) {
      console.error(`❌ Pacote ${travelPackageId} não encontrado`);
      return null;
    }
    
    // Mapear dados do backend para formato de reserva
    const travelPackageData = mapBackendPackageToReservation(response.data);
    
    const reservationData: ReservationData = {
      travelPackage: travelPackageData,
      travelers: [],
      totalPrice: travelPackageData.price
    };
    
    console.log('✅ Reserva inicializada:', reservationData.travelPackage.title);
    return reservationData;
    
  } catch (error) {
    console.error('❌ Erro ao inicializar reserva:', error);
    return null;
  }
};

// Busca voos alternativos para o destino
export const getAlternativeFlights = async (destinationId: number): Promise<FlightOption[]> => {
  try {
    console.log(`✈️ Buscando voos para destino ${destinationId}...`);
    
    // Por enquanto, buscar da API de voos (quando implementada)
    // const response = await axios.get(`${API_BASE_URL}/Flight?destinationId=${destinationId}`);
    
    // Mock data por enquanto (YAGNI - implementar quando API estiver pronta)
    const mockFlights: FlightOption[] = [
      {
        id: 1,
        airline: 'LATAM Airlines',
        origin: 'São Paulo (GRU)',
        destination: 'Paris (CDG)',
        departureDate: '2025-09-03T08:00:00',
        returnDate: '2025-09-10T22:00:00',
        price: 2800,
        duration: '11h 30m'
      },
      {
        id: 2,
        airline: 'Air France',
        origin: 'São Paulo (GRU)', 
        destination: 'Paris (CDG)',
        departureDate: '2025-09-03T14:00:00',
        returnDate: '2025-09-10T16:00:00',
        price: 3200,
        duration: '11h 45m'
      }
    ];
    
    console.log(`✅ ${mockFlights.length} voos encontrados`);
    return mockFlights;
    
  } catch (error) {
    console.error('❌ Erro ao buscar voos:', error);
    return [];
  }
};

// Busca acomodações alternativas para o destino
export const getAlternativeAccommodations = async (destinationId: number): Promise<Accommodation[]> => {
  try {
    console.log(`🏨 Buscando hotéis para destino ${destinationId}...`);
    
    // Buscar todas as acomodações e filtrar por destino
    const allAccommodations = await getAllAccommodations();
    const destinationAccommodations = allAccommodations.filter(
      acc => acc.destination.id === destinationId
    );
    
    console.log(`✅ ${destinationAccommodations.length} hotéis encontrados para o destino`);
    return destinationAccommodations;
    
  } catch (error) {
    console.error('❌ Erro ao buscar hotéis:', error);
    return [];
  }
};

// Atualiza voo selecionado na reserva
export const updateSelectedFlight = (
  reservationData: ReservationData, 
  flight: FlightOption
): ReservationData => {
  console.log(`✈️ Voo selecionado: ${flight.airline} - ${flight.price}`);
  
  return {
    ...reservationData,
    selectedFlight: {
      id: flight.id,
      origin: flight.origin,
      destination: flight.destination,
      departureDate: flight.departureDate,
      returnDate: flight.returnDate,
      price: flight.price
    },
    totalPrice: reservationData.travelPackage.price + flight.price + (reservationData.selectedAccommodation?.pricePerNight || 0)
  };
};

// Atualiza acomodação selecionada na reserva
export const updateSelectedAccommodation = (
  reservationData: ReservationData, 
  accommodation: Accommodation
): ReservationData => {
  console.log(`🏨 Hotel selecionado: ${accommodation.name} - ${accommodation.pricePerNight}/noite`);
  
  return {
    ...reservationData,
    selectedAccommodation: accommodation,
    totalPrice: reservationData.travelPackage.price + (reservationData.selectedFlight?.price || 0) + accommodation.pricePerNight
  };
};

/* ===================================================================== */
/* UTILITIES                                                           */
/* ===================================================================== */

// Formata preço para exibição
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

// Formata data e hora para exibição
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR');
};

// Calcula duração do voo
export const formatFlightDuration = (duration: string): string => {
  return duration;
};

/* ===================================================================== */
/* FUNCIONALIDADES DE CUSTOMIZAÇÃO - NOVAS                             */
/* ===================================================================== */

/**
 * YAGNI: Atualiza reserva com novo voo
 * @param reservationId - ID da reserva
 * @param newFlightId - ID do novo voo
 * @returns Promise com dados da reserva atualizada
 */
export const updateReservationFlight = async (reservationId: number, newFlightId: number): Promise<ReservationData | null> => {
  try {
    console.log(`🔄 Atualizando reserva ${reservationId} com voo ${newFlightId}`);
    
    const response = await api.put(`/reservation/${reservationId}/update-flight`, {
      flightId: newFlightId
    });
    
    // DRY: Usar mesmo padrão de mapeamento de initializeReservation
    const travelPackageData = mapBackendPackageToReservation(response.data);
    
    const reservationData: ReservationData = {
      travelPackage: travelPackageData,
      travelers: [],
      totalPrice: travelPackageData.price
    };
    
    return reservationData;
    
  } catch (error) {
    console.error('❌ Erro ao atualizar voo da reserva:', error);
    throw new Error('Falha ao atualizar voo da reserva');
  }
};

/**
 * YAGNI: Atualiza reserva com nova acomodação
 * @param reservationId - ID da reserva 
 * @param newHotelId - ID da nova acomodação
 * @returns Promise com dados da reserva atualizada
 */
export const updateReservationHotel = async (reservationId: number, newHotelId: number): Promise<ReservationData | null> => {
  try {
    console.log(`🔄 Atualizando reserva ${reservationId} com hotel ${newHotelId}`);
    
    const response = await api.put(`/reservation/${reservationId}/update-accommodation`, {
      accommodationId: newHotelId
    });
    
    // DRY: Usar mesmo padrão de mapeamento de initializeReservation
    const travelPackageData = mapBackendPackageToReservation(response.data);
    
    const reservationData: ReservationData = {
      travelPackage: travelPackageData,
      travelers: [],
      totalPrice: travelPackageData.price
    };
    
    return reservationData;
    
  } catch (error) {
    console.error('❌ Erro ao atualizar hotel da reserva:', error);
    throw new Error('Falha ao atualizar hotel da reserva');
  }
};

/**
 * KISS: Calcula novo preço com customizações
 * @param customization - Dados da customização
 * @returns Promise com novo preço total
 */
export const calculateNewPrice = async (customization: {
  travelPackageId: number;
  customFlightId?: number;
  customAccommodationId?: number;
  includesInsurance?: boolean;
  customFlightPrice?: number;
  customAccommodationPrice?: number;
}): Promise<number> => {
  try {
    console.log('💰 Calculando novo preço:', customization);
    
    // Buscar preço base do pacote
    const travelPackageResponse = await api.get(`/TravelPackage/${customization.travelPackageId}`);
    const basePrice = travelPackageResponse.data?.price || 0;
    console.log('💰 Preço base do pacote:', basePrice);
    
    let totalPrice = basePrice;
    let customizationCost = 0;
    
    // Se há acomodação customizada, calcular diferença de preço
    if (customization.customAccommodationId) {
      let accommodationPrice = 0;
      
      // Tentar buscar do backend primeiro
      try {
        const accommodationResponse = await api.get(`/Accommodation/${customization.customAccommodationId}`);
        accommodationPrice = accommodationResponse.data?.pricePerNight || 0;
        console.log('🏨 Preço da acomodação obtido do backend:', accommodationPrice);
      } catch (error) {
        // Se falhar, usar preço passado como parâmetro ou estimativa
        accommodationPrice = customization.customAccommodationPrice || (basePrice * 0.08); // 8% do preço base por noite
        console.log('🏨 Usando preço estimado da acomodação:', accommodationPrice);
      }
      
      // Assumir 5 noites como padrão
      const totalAccommodationPrice = accommodationPrice * 5;
      
      // A customização seria a diferença do preço do hotel vs um preço base estimado
      // Por simplicidade, vamos usar 30% do preço base como custo de hotel padrão
      const standardHotelCost = basePrice * 0.3;
      customizationCost += totalAccommodationPrice - standardHotelCost;
      
      console.log('🏨 Custo total da acomodação (5 noites):', totalAccommodationPrice);
      console.log('🏨 Custo padrão estimado:', standardHotelCost);
      console.log('🏨 Diferença de customização:', totalAccommodationPrice - standardHotelCost);
    }
    
    // Se há voo customizado, calcular diferença de preço
    if (customization.customFlightId) {
      let flightPrice = 0;
      
      // Tentar buscar do backend primeiro
      try {
        const flightResponse = await api.get(`/Flight/${customization.customFlightId}`);
        flightPrice = flightResponse.data?.price || 0;
        console.log('✈️ Preço do voo obtido do backend:', flightPrice);
      } catch (error) {
        // Se falhar, usar preço passado como parâmetro ou estimativa
        flightPrice = customization.customFlightPrice || (basePrice * 0.6); // 60% do preço base
        console.log('✈️ Usando preço estimado do voo:', flightPrice);
      }
      
      // A customização seria a diferença do preço do voo vs um preço base estimado
      // Por simplicidade, vamos usar 50% do preço base como custo de voo padrão
      const standardFlightCost = basePrice * 0.5;
      customizationCost += flightPrice - standardFlightCost;
      
      console.log('✈️ Preço do voo customizado:', flightPrice);
      console.log('✈️ Custo padrão estimado:', standardFlightCost);
      console.log('✈️ Diferença de customização:', flightPrice - standardFlightCost);
    }
    
    // Adicionar custo de seguro se solicitado
    if (customization.includesInsurance) {
      const insuranceCost = basePrice * 0.05; // 5% do preço base
      customizationCost += insuranceCost;
      console.log('🛡️ Custo do seguro:', insuranceCost);
    }
    
    totalPrice = basePrice + customizationCost;
    
    console.log('💰 Cálculo final:', {
      basePrice,
      customizationCost,
      totalPrice
    });
    
    return Math.max(totalPrice, 0); // Garantir que o preço não seja negativo
    
  } catch (error) {
    console.error('❌ Erro ao calcular novo preço:', error);
    
    // Fallback: tentar buscar apenas o preço base
    try {
      const travelPackageResponse = await api.get(`/TravelPackage/${customization.travelPackageId}`);
      return travelPackageResponse.data?.price || 0;
    } catch (fallbackError) {
      console.error('❌ Erro no fallback:', fallbackError);
      throw new Error('Falha ao calcular novo preço');
    }
  }
};
