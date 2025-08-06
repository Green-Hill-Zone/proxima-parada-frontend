/* ===================================================================== */
/* SERVIÇO DE TIPOS DE QUARTOS - INTEGRAÇÃO COM BACKEND                 */
/* ===================================================================== */
/*
 * Este arquivo implementa a comunicação com a API de tipos de quartos do backend.
 * Segue os princípios:
 * - KISS: Interface simples e direta
 * - DRY: Reutilização do padrão de outros serviços
 * - YAGNI: Apenas funcionalidades necessárias
 */

import axios from 'axios';

// Base URL da API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5079/api';

/* ===================================================================== */
/* INTERFACES E TIPOS                                                   */
/* ===================================================================== */

// Interface do tipo de quarto (frontend)
export interface RoomType {
  id: number;
  name: string;
  capacityAdults?: number;
  capacityChildren?: number;
  priceMultiplier: number;
  totalCapacity: number;
  accommodationsCount: number;
  createdAt: string;
  updatedAt?: string;
}

// Interface para criar um novo tipo de quarto
export interface RoomTypeCreateRequest {
  name: string;
  capacityAdults?: number;
  capacityChildren?: number;
  priceMultiplier?: number; // Multiplicador de preço (1.0 = base, 2.0 = dobro)
}

/* ===================================================================== */
/* FUNÇÕES DO SERVIÇO                                                   */
/* ===================================================================== */

/**
 * Busca todos os tipos de quartos disponíveis
 * @returns Promise com lista de tipos de quartos
 */
export const getAllRoomTypes = async (): Promise<RoomType[]> => {
  try {
    console.log('🔄 Buscando todos os tipos de quartos...');
    
    const response = await axios.get(`${API_BASE_URL}/RoomType`);
    
    console.log('📋 Resposta do backend:', response.data);
    
    let roomTypes: RoomType[] = [];
    const backendData = response.data;
    
    // Trata diferentes formatos de resposta do backend
    if (backendData && backendData.$values && Array.isArray(backendData.$values)) {
      // Formato .NET com $values
      roomTypes = backendData.$values.map(mapBackendToFrontend);
    } else if (Array.isArray(backendData)) {
      // Formato de array simples
      roomTypes = backendData.map(mapBackendToFrontend);
    } else if (backendData && backendData.id) {
      // Único objeto
      roomTypes = [mapBackendToFrontend(backendData)];
    }
    
    console.log(`✅ ${roomTypes.length} tipos de quartos encontrados`);
    return roomTypes;
    
  } catch (error) {
    console.error('❌ Erro ao buscar tipos de quartos:', error);
    return [];
  }
};

/**
 * Busca tipo de quarto por ID
 * @param id - ID do tipo de quarto
 * @returns Promise com o tipo de quarto
 */
export const getRoomTypeById = async (id: number): Promise<RoomType | null> => {
  try {
    console.log(`🔄 Buscando tipo de quarto ID: ${id}`);
    
    const response = await axios.get(`${API_BASE_URL}/RoomType/${id}`);
    
    console.log('📋 Tipo de quarto encontrado:', response.data);
    
    if (response.data) {
      return mapBackendToFrontend(response.data);
    }
    
    return null;
    
  } catch (error) {
    console.error(`❌ Erro ao buscar tipo de quarto ${id}:`, error);
    return null;
  }
};

/**
 * Cria um novo tipo de quarto
 * @param roomTypeData - Dados do tipo de quarto
 * @returns Promise com o tipo de quarto criado
 */
export const createRoomType = async (roomTypeData: RoomTypeCreateRequest): Promise<RoomType | null> => {
  try {
    console.log('🔄 Criando novo tipo de quarto:', roomTypeData);
    
    const response = await axios.post(`${API_BASE_URL}/RoomType`, roomTypeData);
    
    console.log('📋 Tipo de quarto criado:', response.data);
    
    if (response.data) {
      return mapBackendToFrontend(response.data);
    }
    
    return null;
    
  } catch (error) {
    console.error('❌ Erro ao criar tipo de quarto:', error);
    
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Erro desconhecido do servidor';
      throw new Error(`Erro ao criar tipo de quarto: ${errorMessage}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

/**
 * Atualiza um tipo de quarto existente
 * @param id - ID do tipo de quarto
 * @param roomTypeData - Novos dados do tipo de quarto
 * @returns Promise com o tipo de quarto atualizado
 */
export const updateRoomType = async (id: number, roomTypeData: RoomTypeCreateRequest): Promise<RoomType | null> => {
  try {
    console.log(`🔄 Atualizando tipo de quarto ${id}:`, roomTypeData);
    
    const response = await axios.put(`${API_BASE_URL}/RoomType/${id}`, roomTypeData);
    
    console.log('📋 Tipo de quarto atualizado:', response.data);
    
    if (response.data) {
      return mapBackendToFrontend(response.data);
    }
    
    return null;
    
  } catch (error) {
    console.error(`❌ Erro ao atualizar tipo de quarto ${id}:`, error);
    
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Erro desconhecido do servidor';
      throw new Error(`Erro ao atualizar tipo de quarto: ${errorMessage}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

/**
 * Remove um tipo de quarto
 * @param id - ID do tipo de quarto a ser removido
 * @returns Promise com booleano indicando sucesso
 */
export const deleteRoomType = async (id: number): Promise<boolean> => {
  try {
    console.log(`🔄 Removendo tipo de quarto ${id}`);
    
    await axios.delete(`${API_BASE_URL}/RoomType/${id}`);
    
    console.log(`✅ Tipo de quarto ${id} removido com sucesso`);
    return true;
    
  } catch (error) {
    console.error(`❌ Erro ao remover tipo de quarto ${id}:`, error);
    
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Erro desconhecido do servidor';
      throw new Error(`Erro ao remover tipo de quarto: ${errorMessage}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

/* ===================================================================== */
/* FUNÇÕES AUXILIARES                                                   */
/* ===================================================================== */

/**
 * Mapeia os dados do backend para o formato do frontend
 */
const mapBackendToFrontend = (backendData: any): RoomType => {
  return {
    id: backendData.id,
    name: backendData.name || 'Tipo de quarto',
    capacityAdults: backendData.capacityAdults || 0,
    capacityChildren: backendData.capacityChildren || 0,
    priceMultiplier: backendData.priceMultiplier || 1.0,
    totalCapacity: backendData.totalCapacity || 0,
    accommodationsCount: backendData.accommodationsCount || 0,
    createdAt: backendData.createdAt,
    updatedAt: backendData.updatedAt
  };
};
