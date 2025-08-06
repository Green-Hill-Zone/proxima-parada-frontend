/* ===================================================================== */
/* SERVIÇO DE COMPANHIAS AÉREAS - INTEGRAÇÃO COM BACKEND               */
/* ===================================================================== */
/*
 * Este arquivo implementa a comunicação com a API de companhias aéreas do backend.
 * Segue os princípios:
 * - KISS: Interface simples e direta
 * - DRY: Reutilização do padrão de outros serviços
 * - YAGNI: Apenas funcionalidades necessárias
 */

import axios from 'axios';

// Base URL da API - obtida das variáveis de ambiente
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5079/api';

/* ===================================================================== */
/* INTERFACES E TIPOS                                                   */
/* ===================================================================== */

// Interface da companhia aérea (frontend)
export interface Airline {
  id: number;
  name: string;
  code: string;
  createdAt: string;
  updatedAt?: string;
}

// Interface para criação de companhia aérea
export interface AirlineCreateRequest {
  name: string;
  code: string;
}

/* ===================================================================== */
/* FUNÇÕES DO SERVIÇO                                                   */
/* ===================================================================== */

/**
 * Busca todas as companhias aéreas disponíveis
 * @returns Promise com lista de companhias aéreas
 */
export const getAllAirlines = async (): Promise<Airline[]> => {
  try {
    console.log('🔄 Buscando todas as companhias aéreas...');
    
    const response = await axios.get(`${API_BASE_URL}/Airline`);
    
    console.log('📋 Resposta do backend:', response.data);
    
    let airlineList: Airline[];
    
    // Verifica se a resposta tem o formato ReferenceHandler.Preserve
    if (response.data && typeof response.data === 'object' && '$values' in response.data) {
      airlineList = response.data.$values;
      console.log(`✅ Companhias aéreas carregadas (ReferenceHandler): Total: ${airlineList.length}`);
    } else if (Array.isArray(response.data)) {
      airlineList = response.data;
      console.log(`✅ Companhias aéreas carregadas (Array): Total: ${airlineList.length}`);
    } else {
      console.error('❌ Formato de resposta inesperado:', response.data);
      throw new Error('Formato de resposta do servidor inválido');
    }
    
    // Se não há companhias no backend, retorna dados de demonstração
    if (airlineList.length === 0) {
      console.log('📝 Nenhuma companhia aérea encontrada no backend, usando dados de demonstração');
      return getMockAirlines();
    }
    
    return airlineList;
    
  } catch (error) {
    console.error('❌ Erro ao buscar companhias aéreas:', error);
    
    // Em caso de erro, retorna dados de demonstração
    console.log('📝 Erro na API, usando dados de demonstração');
    return getMockAirlines();
  }
};

/**
 * Busca companhia aérea por ID
 * @param id - ID da companhia aérea
 * @returns Promise com dados da companhia aérea
 */
export const getAirlineById = async (id: number): Promise<Airline> => {
  try {
    console.log(`🔄 Buscando companhia aérea ID: ${id}`);
    
    const response = await axios.get(`${API_BASE_URL}/Airline/${id}`);
    
    console.log('📋 Companhia aérea encontrada:', response.data);
    
    return response.data as Airline;
    
  } catch (error) {
    console.error('❌ Erro ao buscar companhia aérea:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Companhia aérea não encontrada');
      }
      throw new Error(`Erro do servidor: ${error.response?.status}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

/**
 * Cria uma nova companhia aérea
 * @param airlineData - Dados da companhia aérea a ser criada
 * @returns Promise com a companhia aérea criada
 */
export const createAirline = async (airlineData: AirlineCreateRequest): Promise<Airline> => {
  try {
    console.log('🔄 Criando nova companhia aérea:', airlineData);
    
    const response = await axios.post(`${API_BASE_URL}/Airline`, airlineData);
    
    console.log('📥 Resposta do servidor:', response.data);
    
    return response.data as Airline;
    
  } catch (error) {
    console.error('❌ Erro ao criar companhia aérea:', error);
    
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || 'Erro desconhecido do servidor';
      throw new Error(`Erro ao criar companhia aérea: ${errorMessage}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

/**
 * Atualiza uma companhia aérea existente
 * @param id - ID da companhia aérea a ser atualizada
 * @param airlineData - Novos dados da companhia aérea
 * @returns Promise com a companhia aérea atualizada
 */
export const updateAirline = async (id: number, airlineData: AirlineCreateRequest): Promise<Airline> => {
  try {
    console.log(`🔄 Atualizando companhia aérea ID ${id}:`, airlineData);
    
    const response = await axios.put(`${API_BASE_URL}/Airline/${id}`, airlineData);
    
    console.log('📥 Resposta do servidor:', response.data);
    
    return response.data as Airline;
    
  } catch (error) {
    console.error(`❌ Erro ao atualizar companhia aérea ${id}:`, error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Companhia aérea não encontrada');
      }
      const errorMessage = error.response?.data || 'Erro desconhecido do servidor';
      throw new Error(`Erro ao atualizar companhia aérea: ${errorMessage}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

/**
 * Remove uma companhia aérea do sistema
 * @param id - ID da companhia aérea a ser removida
 * @returns Promise com booleano indicando sucesso
 */
export const deleteAirline = async (id: number): Promise<boolean> => {
  try {
    console.log(`🗑️ Removendo companhia aérea ID ${id}`);
    
    await axios.delete(`${API_BASE_URL}/Airline/${id}`);
    
    console.log(`✅ Companhia aérea ${id} removida com sucesso`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Erro ao remover companhia aérea ${id}:`, error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Companhia aérea não encontrada');
      }
      throw new Error(`Erro do servidor: ${error.response?.status}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

/* ===================================================================== */
/* DADOS DE DEMONSTRAÇÃO                                               */
/* ===================================================================== */

/**
 * Retorna dados de demonstração para companhias aéreas
 * @returns Lista de companhias aéreas fictícias para demonstração
 */
const getMockAirlines = (): Airline[] => {
  const today = new Date().toISOString();
  
  return [
    {
      id: 1,
      name: "LATAM Airlines",
      code: "LA",
      createdAt: today,
      updatedAt: today
    },
    {
      id: 2,
      name: "GOL Linhas Aéreas",
      code: "G3",
      createdAt: today,
      updatedAt: today
    },
    {
      id: 3,
      name: "Azul Linhas Aéreas",
      code: "AD",
      createdAt: today,
      updatedAt: today
    },
    {
      id: 4,
      name: "Emirates",
      code: "EK",
      createdAt: today,
      updatedAt: today
    },
    {
      id: 5,
      name: "American Airlines",
      code: "AA",
      createdAt: today,
      updatedAt: today
    }
  ];
};
