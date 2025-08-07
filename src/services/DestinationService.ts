/* ===================================================================== */
/* SERVIÇO DE DESTINOS - INTEGRAÇÃO COM BACKEND                       */
/* ===================================================================== */
/*
 * Este arquivo implementa a comunicação com a API de destinos do backend.
 * Segue os princípios:
 * - KISS: Interface simples e direta
 * - DRY: Reutilização do padrão de outros serviços
 * - YAGNI: Apenas funcionalidades necessárias
 */

import axios from 'axios';

// Base URL da API - obtida das variáveis de ambiente
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7102' || 'http://localhost:5079/api';

/* ===================================================================== */
/* INTERFACES E TIPOS                                                   */
/* ===================================================================== */

// Interface do destino (frontend)
export interface Destination {
  id: number;
  name: string;
  country: string;
  state?: string;
  city?: string;
  coordinates?: string;
  createdAt: string;
  updatedAt?: string;
  travelPackagesCount?: number;
  flightsCount?: number;
  accommodationsCount?: number;
}

// Interface para criação de destino
export interface DestinationCreateRequest {
  name: string;
  country: string;
  state?: string;
  city?: string;
  coordinates?: string;
}

/* ===================================================================== */
/* FUNÇÕES DO SERVIÇO                                                   */
/* ===================================================================== */

/**
 * Busca todos os destinos disponíveis
 * @returns Promise com lista de destinos
 */
export const getAllDestinations = async (): Promise<Destination[]> => {
  try {
    console.log('🔄 Buscando todos os destinos...');
    
    const response = await axios.get(`${API_BASE_URL}/api/Destination`);
    
    console.log('📋 Resposta do backend:', response.data);
    
    let destinationList: Destination[];
    
    // Verifica se a resposta tem o formato ReferenceHandler.Preserve
    if (response.data && typeof response.data === 'object' && '$values' in response.data) {
      destinationList = response.data.$values;
      console.log(`✅ Destinos carregados (ReferenceHandler): Total: ${destinationList.length}`);
    } else if (Array.isArray(response.data)) {
      destinationList = response.data;
      console.log(`✅ Destinos carregados (Array): Total: ${destinationList.length}`);
    } else {
      console.error('❌ Formato de resposta inesperado:', response.data);
      throw new Error('Formato de resposta do servidor inválido');
    }
    
    // Se não há destinos no backend, retorna dados de demonstração
    if (destinationList.length === 0) {
      console.log('📝 Nenhum destino encontrado no backend, usando dados de demonstração');
      return getMockDestinations();
    }
    
    return destinationList;
    
  } catch (error) {
    console.error('❌ Erro ao buscar destinos:', error);
    
    // Em caso de erro, retorna dados de demonstração
    console.log('📝 Erro na API, usando dados de demonstração');
    return getMockDestinations();
  }
};

/**
 * Busca destinos populares
 * @param limit - Número máximo de destinos a retornar
 * @returns Promise com lista de destinos populares
 */
export const getPopularDestinations = async (limit: number = 10): Promise<Destination[]> => {
  try {
    console.log(`🔄 Buscando destinos populares (limite: ${limit})...`);
    
    const response = await axios.get(`${API_BASE_URL}/api/Destination/popular?limit=${limit}`);
    
    console.log('📋 Resposta do backend:', response.data);
    
    let destinationList: Destination[];
    
    if (response.data && typeof response.data === 'object' && '$values' in response.data) {
      destinationList = response.data.$values;
    } else if (Array.isArray(response.data)) {
      destinationList = response.data;
    } else {
      console.error('❌ Formato de resposta inesperado:', response.data);
      throw new Error('Formato de resposta do servidor inválido');
    }
    
    return destinationList;
    
  } catch (error) {
    console.error('❌ Erro ao buscar destinos populares:', error);
    
    // Em caso de erro, retorna dados de demonstração limitados
    const mockDestinations = getMockDestinations();
    return mockDestinations.slice(0, limit);
  }
};

/**
 * Busca destino por ID
 * @param id - ID do destino
 * @returns Promise com dados do destino
 */
export const getDestinationById = async (id: number): Promise<Destination> => {
  try {
    console.log(`🔄 Buscando destino ID: ${id}`);
    
    const response = await axios.get(`${API_BASE_URL}/api/Destination/${id}`);
    
    console.log('📋 Destino encontrado:', response.data);
    
    return response.data as Destination;
    
  } catch (error) {
    console.error('❌ Erro ao buscar destino:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Destino não encontrado');
      }
      throw new Error(`Erro do servidor: ${error.response?.status}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

/**
 * Cria um novo destino
 * @param destinationData - Dados do destino a ser criado
 * @returns Promise com o destino criado
 */
export const createDestination = async (destinationData: DestinationCreateRequest): Promise<Destination> => {
  try {
    console.log('🔄 Criando novo destino:', destinationData);
    
    const response = await axios.post(`${API_BASE_URL}/api/Destination`, destinationData);
    
    console.log('📥 Resposta do servidor:', response.data);
    
    return response.data as Destination;
    
  } catch (error) {
    console.error('❌ Erro ao criar destino:', error);
    
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || 'Erro desconhecido do servidor';
      throw new Error(`Erro ao criar destino: ${errorMessage}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

/**
 * Atualiza um destino existente
 * @param id - ID do destino a ser atualizado
 * @param destinationData - Novos dados do destino
 * @returns Promise com o destino atualizado
 */
export const updateDestination = async (id: number, destinationData: DestinationCreateRequest): Promise<Destination> => {
  try {
    console.log(`🔄 Atualizando destino ID ${id}:`, destinationData);
    
    const response = await axios.put(`${API_BASE_URL}/api/Destination/${id}`, destinationData);
    
    console.log('📥 Resposta do servidor:', response.data);
    
    return response.data as Destination;
    
  } catch (error) {
    console.error(`❌ Erro ao atualizar destino ${id}:`, error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Destino não encontrado');
      }
      const errorMessage = error.response?.data || 'Erro desconhecido do servidor';
      throw new Error(`Erro ao atualizar destino: ${errorMessage}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

/**
 * Remove um destino do sistema
 * @param id - ID do destino a ser removido
 * @returns Promise com booleano indicando sucesso
 */
export const deleteDestination = async (id: number): Promise<boolean> => {
  try {
    console.log(`🗑️ Removendo destino ID ${id}`);
    
    await axios.delete(`${API_BASE_URL}/api/Destination/${id}`);
    
    console.log(`✅ Destino ${id} removido com sucesso`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Erro ao remover destino ${id}:`, error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Destino não encontrado');
      }
      throw new Error(`Erro do servidor: ${error.response?.status}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

/**
 * Formata endereço completo do destino
 * @param destination - Objeto do destino 
 * @returns String formatada com cidade, estado e país
 */
export const formatDestinationAddress = (destination: Destination): string => {
  const parts = [];
  
  if (destination.city) parts.push(destination.city);
  if (destination.state) parts.push(destination.state);
  if (destination.country) parts.push(destination.country);
  
  return parts.join(', ');
};

/* ===================================================================== */
/* DADOS DE DEMONSTRAÇÃO                                               */
/* ===================================================================== */

/**
 * Retorna dados de demonstração para destinos
 * @returns Lista de destinos fictícios para demonstração
 */
const getMockDestinations = (): Destination[] => {
  const today = new Date().toISOString();
  
  return [
    {
      id: 1,
      name: "São Paulo",
      country: "Brasil",
      state: "SP",
      city: "São Paulo",
      coordinates: "-23.5505,-46.6333",
      createdAt: today,
      updatedAt: today,
      travelPackagesCount: 15,
      flightsCount: 120,
      accommodationsCount: 250
    },
    {
      id: 2,
      name: "Rio de Janeiro",
      country: "Brasil",
      state: "RJ",
      city: "Rio de Janeiro",
      coordinates: "-22.9068,-43.1729",
      createdAt: today,
      updatedAt: today,
      travelPackagesCount: 20,
      flightsCount: 110,
      accommodationsCount: 300
    },
    {
      id: 3,
      name: "Salvador",
      country: "Brasil",
      state: "BA",
      city: "Salvador",
      coordinates: "-12.9714,-38.5014",
      createdAt: today,
      updatedAt: today,
      travelPackagesCount: 12,
      flightsCount: 80,
      accommodationsCount: 150
    },
    {
      id: 4,
      name: "Fortaleza",
      country: "Brasil",
      state: "CE",
      city: "Fortaleza",
      coordinates: "-3.7172,-38.5433",
      createdAt: today,
      updatedAt: today,
      travelPackagesCount: 10,
      flightsCount: 60,
      accommodationsCount: 120
    },
    {
      id: 5,
      name: "Recife",
      country: "Brasil",
      state: "PE",
      city: "Recife",
      coordinates: "-8.0476,-34.8770",
      createdAt: today,
      updatedAt: today,
      travelPackagesCount: 8,
      flightsCount: 50,
      accommodationsCount: 100
    },
    {
      id: 6,
      name: "Brasília",
      country: "Brasil",
      state: "DF",
      city: "Brasília",
      coordinates: "-15.7998,-47.8645",
      createdAt: today,
      updatedAt: today,
      travelPackagesCount: 7,
      flightsCount: 90,
      accommodationsCount: 80
    },
    {
      id: 7,
      name: "Porto Alegre",
      country: "Brasil",
      state: "RS",
      city: "Porto Alegre",
      coordinates: "-30.0277,-51.2287",
      createdAt: today,
      updatedAt: today,
      travelPackagesCount: 5,
      flightsCount: 40,
      accommodationsCount: 60
    },
    {
      id: 8,
      name: "Curitiba",
      country: "Brasil",
      state: "PR",
      city: "Curitiba",
      coordinates: "-25.4297,-49.2719",
      createdAt: today,
      updatedAt: today,
      travelPackagesCount: 6,
      flightsCount: 45,
      accommodationsCount: 70
    },
    {
      id: 9,
      name: "Belo Horizonte",
      country: "Brasil",
      state: "MG",
      city: "Belo Horizonte",
      coordinates: "-19.9173,-43.9346",
      createdAt: today,
      updatedAt: today,
      travelPackagesCount: 9,
      flightsCount: 55,
      accommodationsCount: 90
    },
    {
      id: 10,
      name: "Manaus",
      country: "Brasil",
      state: "AM",
      city: "Manaus",
      coordinates: "-3.1190,-60.0217",
      createdAt: today,
      updatedAt: today,
      travelPackagesCount: 4,
      flightsCount: 30,
      accommodationsCount: 40
    }
  ];
};
