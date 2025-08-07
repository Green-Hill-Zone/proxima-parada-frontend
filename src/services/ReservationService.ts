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
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7102' || 'http://localhost:5079/api', // Backend .NET API
});

// URL base da API correta para reservas (baseada no UserService)
const API_BASE_URL = 'https://localhost:7102';

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

/* ===================================================================== */
/* FUNÇÕES PARA BUSCAR RESERVAS DO USUÁRIO - MINHAS VIAGENS           */
/* ===================================================================== */

// Importar tipos necessários
import type { TravelPackage } from '../contexts/types';

// Interface da reserva conforme retornada pelo backend
interface BackendReservation {
  id: number;
  customer: {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
    document?: string;
    companyId?: number;
  };
  travelPackage: {
    id: number;
    title: string;
    description: string;
    price: number;
    departureDate?: string;
    returnDate?: string;
    destination: {
      id: number;
      name?: string;
      country?: string;
      state?: string;
      city?: string;
      coordinates?: string;
    };
    company: any;
    images: { $values: any[] };
    availableDates: { $values: any[] };
    flights: { $values: any[] };
    paymentOptions: { $values: any[] };
    accommodations: { $values: any[] };
    createdAt: string;
    updatedAt?: string;
  };
  availableDate: {
    id: number;
    travelPackageId: number;
    travelPackageTitle?: string;
    departureDate: string;
    returnDate: string;
    maxCapacity?: number;
    reservationsCount: number;
    availableSpots: number;
    createdAt: string;
    updatedAt?: string;
  };
  outboundFlight?: {
    id: number;
    flightNumber: string;
    departureDateTime: string;
    arrivalDateTime: string;
    airline: any;
    originDestination: any;
    finalDestination: any;
    cabinClass?: string;
    seatClass?: string;
    price?: number;
    availableSeats?: number;
  };
  returnFlight?: {
    id: number;
    flightNumber: string;
    departureDateTime: string;
    arrivalDateTime: string;
    airline: any;
    originDestination: any;
    finalDestination: any;
    cabinClass?: string;
    seatClass?: string;
    price?: number;
    availableSeats?: number;
  };
  accommodation?: {
    id: number;
    name: string;
    description?: string;
    streetName?: string;
    phone?: string;
    email?: string;
    checkInTime?: string;
    checkOutTime?: string;
    starRating?: number;
    pricePerNight?: number;
    district?: string;
    addressNumber?: string;
    geoCoordinates?: string;
  };
  reservationNumber: string;
  status: string;
  includesInsurance: boolean;
  insurancePrice?: number;
  termsAcceptedAt?: string;
  payment?: {
    id: number;
    amount: number;
    status?: string;
    provider?: string;
    externalTransactionId?: string;
    installments?: number;
    createdAt?: string;
    paidAt?: string;
  };
  travelers: {
    $values: Array<{
      id: number;
      name: string;
      document: string;
      birthDate?: string;
      age?: number;
      isMainBuyer: boolean;
      documentType?: string;
      issuingCountryName?: string;
      issuingStateName?: string;
      documentIssuedAt?: string;
    }>;
  };
}

/**
 * Mapeia uma reserva do backend para o formato TravelPackage do frontend
 */
const mapReservationToTravelPackage = (reservation: BackendReservation): TravelPackage => {
  // Calcula a duração em dias
  const startDate = new Date(reservation.availableDate.departureDate);
  const endDate = new Date(reservation.availableDate.returnDate);
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

  // Formata as datas para DD/MM/AAAA
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Determina o status baseado na data e status da reserva
  const getStatus = (): 'completed' | 'upcoming' | 'cancelled' => {
    if (reservation.status === 'cancelled') return 'cancelled';
    
    const today = new Date();
    const endDate = new Date(reservation.availableDate.returnDate);
    
    if (endDate < today) return 'completed';
    return 'upcoming';
  };

  // Determina a categoria baseada no destino (simplificado)
  const getCategory = (title: string): string => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('praia') || titleLower.includes('rio')) return 'Praia';
    if (titleLower.includes('montanha') || titleLower.includes('serra')) return 'Montanha';
    if (titleLower.includes('cidade') || titleLower.includes('urbano')) return 'Cidade';
    if (titleLower.includes('cultural') || titleLower.includes('histórico')) return 'Cultural';
    if (titleLower.includes('natureza') || titleLower.includes('eco')) return 'Natureza';
    return 'Turismo';
  };

  // Monta a lista do que está incluso
  const includes: string[] = [];
  if (reservation.outboundFlight) includes.push('Voo de ida');
  if (reservation.returnFlight) includes.push('Voo de volta');
  if (reservation.accommodation) includes.push('Hospedagem');
  if (reservation.includesInsurance) includes.push('Seguro viagem');
  
  // Adiciona itens padrão baseados no tipo de pacote
  includes.push('Traslados');
  includes.push('Café da manhã');

  // URL da imagem (placeholder baseado na categoria)
  const getCategoryImage = (category: string): string => {
    const imageMap: { [key: string]: string } = {
      'Praia': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop',
      'Montanha': 'https://images.unsplash.com/photo-1464822759844-d150ad6c1a75?w=400&h=250&fit=crop',
      'Cidade': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=250&fit=crop',
      'Cultural': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=250&fit=crop',
      'Natureza': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop',
      'Turismo': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop'
    };
    return imageMap[category] || imageMap['Turismo'];
  };

  const category = getCategory(reservation.travelPackage.title);
  const status = getStatus();

  // Função para formatar o destino a partir do objeto Destination
  const getDestination = (): string => {
    const dest = reservation.travelPackage.destination;
    
    console.log('🌍 Dados do destino recebidos:', dest);
    console.log('🌍 TravelPackage completo:', reservation.travelPackage);
    
    if (!dest) {
      console.log('⚠️ Objeto destination é null/undefined');
      return 'Destino não informado';
    }
    
    // Constrói o destino no formato: "Nome, Cidade, Estado" ou "Nome, País"
    const parts: string[] = [];
    
    if (dest.name) {
      parts.push(dest.name);
      console.log('✅ Nome encontrado:', dest.name);
    }
    
    if (dest.city) {
      parts.push(dest.city);
      console.log('✅ Cidade encontrada:', dest.city);
    }
    
    if (dest.state) {
      parts.push(dest.state);
      console.log('✅ Estado encontrado:', dest.state);
    } else if (dest.country) {
      parts.push(dest.country);
      console.log('✅ País encontrado:', dest.country);
    }
    
    const finalDestination = parts.length > 0 ? parts.join(', ') : 'Destino não informado';
    console.log('🏁 Destino final formatado:', finalDestination);
    
    return finalDestination;
  };

  // Calcula o preço usando múltiplas fontes (prioridade: payment amount > travel package price)
  const getPrice = (): number => {
    // 1ª prioridade: valor pago na reserva (mais preciso)
    if (reservation.payment?.amount && reservation.payment.amount > 0) {
      return reservation.payment.amount;
    }
    
    // 2ª prioridade: preço base do pacote
    if (reservation.travelPackage?.price && reservation.travelPackage.price > 0) {
      return reservation.travelPackage.price;
    }
    
    // 3ª prioridade: calcular baseado em componentes individuais
    let estimatedPrice = 0;
    
    // Adiciona preço da acomodação (estimativa: 5 noites)
    if (reservation.accommodation?.pricePerNight) {
      estimatedPrice += reservation.accommodation.pricePerNight * 5;
    }
    
    // Adiciona preço dos voos
    if (reservation.outboundFlight?.price) {
      estimatedPrice += reservation.outboundFlight.price;
    }
    if (reservation.returnFlight?.price) {
      estimatedPrice += reservation.returnFlight.price;
    }
    
    // Adiciona preço do seguro
    if (reservation.includesInsurance && reservation.insurancePrice) {
      estimatedPrice += reservation.insurancePrice;
    }
    
    return estimatedPrice > 0 ? estimatedPrice : 0;
  };

  return {
    id: reservation.id.toString(),
    title: reservation.travelPackage.title,
    destination: getDestination(),
    startDate: formatDate(reservation.availableDate.departureDate),
    endDate: formatDate(reservation.availableDate.returnDate),
    duration,
    price: getPrice(),
    status,
    imageUrl: getCategoryImage(category),
    description: reservation.travelPackage.description || 'Viagem incrível te espera!',
    includes,
    category,
    // Adiciona avaliação se a viagem foi concluída (simulado)
    rating: status === 'completed' ? Math.floor(Math.random() * 2) + 4 : undefined, // 4 ou 5 estrelas
    review: status === 'completed' ? 'Viagem incrível! Recomendo muito.' : undefined
  };
};

/**
 * Busca todas as reservas do sistema
 * @returns Promise com lista de todas as reservas
 */
export const getAllReservations = async (): Promise<BackendReservation[]> => {
  try {
    console.log('🔄 Buscando todas as reservas...');
    
    const response = await axios.get(`${API_BASE_URL}/Reservation`);

    console.log('📋 Resposta bruta do backend (reservas):', response.data);

    // O backend .NET retorna no formato ReferenceHandler.Preserve: {"$id":"1","$values":[...]}
    let reservationsList: BackendReservation[];
    
    if (response.data && typeof response.data === 'object' && '$values' in response.data) {
      // Formato ReferenceHandler.Preserve
      reservationsList = response.data.$values;
      console.log(`✅ Lista de reservas (ReferenceHandler): Total: ${reservationsList.length}`);
    } else if (Array.isArray(response.data)) {
      // Formato array direto
      reservationsList = response.data;
      console.log(`✅ Lista de reservas (Array): Total: ${reservationsList.length}`);
    } else {
      console.error('❌ Formato de resposta inesperado:', response.data);
      throw new Error('Formato de resposta do servidor inválido');
    }
    
    return reservationsList;
    
  } catch (error) {
    console.error('❌ Erro ao buscar reservas:', error);
    
    if (axios.isAxiosError(error)) {
      throw new Error(`Erro do servidor: ${error.response?.status}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

/**
 * Busca reservas de um usuário específico por email
 * @param userEmail - Email do usuário
 * @returns Promise com lista de viagens do usuário
 */
export const getUserReservations = async (userEmail: string): Promise<TravelPackage[]> => {
  try {
    console.log(`🔄 Buscando reservas do usuário: ${userEmail}`);
    
    // Busca todas as reservas
    const allReservations = await getAllReservations();
    
    // Filtra reservas do usuário específico
    const userReservations = allReservations.filter(
      reservation => reservation.customer.email === userEmail
    );
    
    console.log(`✅ Encontradas ${userReservations.length} reservas para o usuário ${userEmail}`);
    
    // Mapeia reservas para formato TravelPackage
    const travelPackages = userReservations.map(mapReservationToTravelPackage);
    
    // Ordena por data mais recente primeiro
    travelPackages.sort((a, b) => {
      const dateA = new Date(a.startDate.split('/').reverse().join('-'));
      const dateB = new Date(b.startDate.split('/').reverse().join('-'));
      return dateB.getTime() - dateA.getTime();
    });
    
    return travelPackages;
    
  } catch (error) {
    console.error('❌ Erro ao buscar reservas do usuário:', error);
    throw error;
  }
};

/**
 * Busca reservas de um usuário específico por ID
 * @param userId - ID do usuário (número)
 * @returns Promise com lista de viagens do usuário
 */
export const getUserReservationsById = async (userId: number): Promise<TravelPackage[]> => {
  try {
    console.log(`🔄 Buscando reservas do usuário ID: ${userId}`);
    
    // Busca todas as reservas
    const allReservations = await getAllReservations();
    
    // Filtra reservas do usuário específico
    const userReservations = allReservations.filter(
      reservation => reservation.customer.id === userId
    );
    
    console.log(`✅ Encontradas ${userReservations.length} reservas para o usuário ID ${userId}`);
    
    // Mapeia reservas para formato TravelPackage
    const travelPackages = userReservations.map(mapReservationToTravelPackage);
    
    // Ordena por data mais recente primeiro
    travelPackages.sort((a, b) => {
      const dateA = new Date(a.startDate.split('/').reverse().join('-'));
      const dateB = new Date(b.startDate.split('/').reverse().join('-'));
      return dateB.getTime() - dateA.getTime();
    });
    
    return travelPackages;
    
  } catch (error) {
    console.error('❌ Erro ao buscar reservas do usuário por ID:', error);
    throw error;
  }
};
