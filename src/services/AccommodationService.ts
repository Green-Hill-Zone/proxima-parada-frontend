/* ===================================================================== */
/* SERVIÇO DE ACOMODAÇÕES - INTEGRAÇÃO COM BACKEND                     */
/* ===================================================================== */
/*
 * Este arquivo implementa a comunicação com a API de acomodações do backend.
 * Segue os princípios:
 * - KISS: Interface simples e direta
 * - DRY: Reutilização do padrão de outros serviços
 * - YAGNI: Apenas funcionalidades necessárias
 * - Backend First: Prioriza dados reais da API
 */

import axios from 'axios';

// Base URL da API
const API_BASE_URL = 'http://localhost:5079/api';

/* ===================================================================== */
/* INTERFACES E TIPOS                                                   */
/* ===================================================================== */

// Interface da acomodação (frontend) - alinhada com backend
export interface Accommodation {
  id: number;
  name: string;
  description: string;
  destination: {
    id: number;
    name: string;
    country: string;
    state?: string;
    city?: string;
    coordinates?: string;
  };
  roomType: {
    id: number;
    name: string;
    capacityAdults?: number;
    capacityChildren?: number;
    totalCapacity?: number;
  };
  starRating: number;
  pricePerNight: number;
  streetName: string;
  addressNumber: string;
  district: string;
  email: string;
  phone: string;
  checkInTime: string;
  checkOutTime: string;
  geoCoordinates?: string;
  createdAt: string;
  updatedAt?: string;
  travelPackagesCount?: number;
  images?: any[];
}

// Interface para filtros de busca
export interface AccommodationFilters {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  minStars?: number;
  maxStars?: number;
}

/* ===================================================================== */
/* FUNÇÕES DE BUSCA E LISTAGEM                                         */
/* ===================================================================== */

// Busca todas as acomodações disponíveis
export const getAllAccommodations = async (): Promise<Accommodation[]> => {
  try {
    console.log('🏨 Buscando todas as acomodações do backend...');
    const response = await axios.get(`${API_BASE_URL}/Accommodation`);
    
    // Mapear os dados do backend para o formato do frontend
    const backendData = response.data;
    let accommodations: Accommodation[] = [];
    
    if (backendData.$values) {
      // Se há $values, é um array serializado pelo .NET
      accommodations = backendData.$values.map(mapBackendToFrontend);
    } else if (Array.isArray(backendData)) {
      // Se é um array direto
      accommodations = backendData.map(mapBackendToFrontend);
    } else if (backendData.id) {
      // Se é um objeto único
      accommodations = [mapBackendToFrontend(backendData)];
    }
    
    console.log(`✅ ${accommodations.length} acomodações encontradas no backend`);
    return accommodations;
    
  } catch (error) {
    console.error('❌ Erro ao buscar acomodações do backend:', error);
    console.log('⚠️ Usando dados de fallback enquanto o backend não responde');
    return []; // Retorna array vazio em caso de erro (KISS)
  }
};

// Busca acomodação por ID
export const getAccommodationById = async (id: number): Promise<Accommodation | null> => {
  try {
    console.log(`🏨 Buscando acomodação ${id} no backend...`);
    const response = await axios.get(`${API_BASE_URL}/Accommodation/${id}`);
    
    if (response.data) {
      const accommodation = mapBackendToFrontend(response.data);
      console.log(`✅ Acomodação ${id} encontrada:`, accommodation.name);
      return accommodation;
    }
    
    return null;
    
  } catch (error) {
    console.error(`❌ Erro ao buscar acomodação ${id}:`, error);
    return null;
  }
};

// Busca acomodações com filtros (implementação simplificada)
export const searchAccommodations = async (filters: AccommodationFilters): Promise<Accommodation[]> => {
  try {
    console.log('🔍 Buscando acomodações com filtros:', filters);
    
    // Por enquanto, busca todas e filtra no frontend (YAGNI)
    // Depois pode implementar filtros no backend se necessário
    const allAccommodations = await getAllAccommodations();
    
    let filteredAccommodations = allAccommodations;
    
    // Filtro por destino
    if (filters.destination) {
      const searchTerm = filters.destination.toLowerCase();
      filteredAccommodations = filteredAccommodations.filter(acc => 
        acc.destination.name.toLowerCase().includes(searchTerm) ||
        acc.destination.city?.toLowerCase().includes(searchTerm) ||
        acc.destination.country.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filtro por preço
    if (filters.minPrice) {
      filteredAccommodations = filteredAccommodations.filter(acc => 
        acc.pricePerNight >= filters.minPrice!
      );
    }
    
    if (filters.maxPrice) {
      filteredAccommodations = filteredAccommodations.filter(acc => 
        acc.pricePerNight <= filters.maxPrice!
      );
    }
    
    // Filtro por estrelas
    if (filters.minStars) {
      filteredAccommodations = filteredAccommodations.filter(acc => 
        acc.starRating >= filters.minStars!
      );
    }
    
    if (filters.maxStars) {
      filteredAccommodations = filteredAccommodations.filter(acc => 
        acc.starRating <= filters.maxStars!
      );
    }
    
    console.log(`✅ ${filteredAccommodations.length} acomodações encontradas após filtros`);
    return filteredAccommodations;
    
  } catch (error) {
    console.error('❌ Erro na busca com filtros:', error);
    return [];
  }
};

/* ===================================================================== */
/* MAPEAMENTO DE DADOS                                                  */
/* ===================================================================== */

// Mapeia dados do backend para o formato do frontend
const mapBackendToFrontend = (backendData: any): Accommodation => {
  return {
    id: backendData.id,
    name: backendData.name || 'Hotel',
    description: backendData.description || '',
    destination: {
      id: backendData.destination?.id || 0,
      name: backendData.destination?.name || 'Destino',
      country: backendData.destination?.country || '',
      state: backendData.destination?.state,
      city: backendData.destination?.city,
      coordinates: backendData.destination?.coordinates
    },
    roomType: {
      id: backendData.roomType?.id || 0,
      name: backendData.roomType?.name || 'Quarto',
      capacityAdults: backendData.roomType?.capacityAdults,
      capacityChildren: backendData.roomType?.capacityChildren,
      totalCapacity: backendData.roomType?.totalCapacity
    },
    starRating: backendData.starRating || 3,
    pricePerNight: backendData.pricePerNight || 0,
    streetName: backendData.streetName || '',
    addressNumber: backendData.addressNumber || '',
    district: backendData.district || '',
    email: backendData.email || '',
    phone: backendData.phone || '',
    checkInTime: backendData.checkInTime || '14:00:00',
    checkOutTime: backendData.checkOutTime || '12:00:00',
    geoCoordinates: backendData.geoCoordinates,
    createdAt: backendData.createdAt,
    updatedAt: backendData.updatedAt,
    travelPackagesCount: backendData.travelPackagesCount || 0,
    images: backendData.images?.$values || []
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

// Calcula preço total para período
export const calculateTotalPrice = (
  pricePerNight: number, 
  checkIn?: string, 
  checkOut?: string
): number => {
  if (!checkIn || !checkOut) return pricePerNight;
  
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return pricePerNight * (diffDays || 1);
};

// Formata horário
export const formatTime = (timeString: string): string => {
  if (!timeString) return '';
  return timeString.substring(0, 5); // Remove os segundos (HH:MM)
};

// Gera emoji para estrelas
export const getStarIcon = (rating: number): string => {
  if (rating >= 5) return '🏆';
  if (rating >= 4) return '💎';
  if (rating >= 3) return '⭐';
  return '🏨';
};

// Formata classificação por estrelas (exemplo: "⭐⭐⭐⭐⭐ 5 estrelas")
export const getStarRating = (rating: number): string => {
  const stars = '⭐'.repeat(Math.max(0, Math.min(5, rating)));
  const starText = rating === 1 ? 'estrela' : 'estrelas';
  return `${stars} ${rating} ${starText}`;
};

/**
 * YAGNI: Busca acomodações por ID do destino
 * @param destinationId - ID do destino
 * @returns Promise com lista de acomodações do destino
 */
export const getAccommodationsByDestination = async (destinationId: number): Promise<Accommodation[]> => {
  try {
    console.log(`🔄 Buscando acomodações para destino ${destinationId}`);
    
    const response = await axios.get(`${API_BASE_URL}/accommodation/destination/${destinationId}`);
    
    console.log('📋 Acomodações do destino:', response.data);
    
    // DRY: Reutilizar mesma lógica de getAllAccommodations
    const backendData = response.data;
    let accommodations: Accommodation[] = [];

    if (backendData && backendData.$values && Array.isArray(backendData.$values)) {
      // Dados vêm com estrutura $values (padrão .NET)
      accommodations = backendData.$values.map(mapBackendToFrontend);
    } else if (Array.isArray(backendData)) {
      // Dados vêm como array direto
      accommodations = backendData.map(mapBackendToFrontend);
    } else if (backendData) {
      // Dado único
      accommodations = [mapBackendToFrontend(backendData)];
    }
    
    return accommodations;
    
  } catch (error) {
    console.error('❌ Erro ao buscar acomodações por destino:', error);
    
    if (axios.isAxiosError(error)) {
      throw new Error(`Erro do servidor: ${error.response?.status}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};
