/* ===================================================================== */
/* SERVIÇO DE VIAJANTES - INTEGRAÇÃO COM BACKEND                        */
/* ===================================================================== */
/*
 * Este arquivo implementa a funcionalidade de gestão de viajantes
 * conectando-se à API do backend. Segue os princípios:
 * - KISS: Interface simples e direta
 * - DRY: Reutilização do padrão de outros serviços
 * - YAGNI: Apenas funcionalidades necessárias
 * - Backend First: Prioriza dados reais da API
 */

import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7102' || 'http://localhost:5079';

const api = axios.create({
  baseURL: API_BASE_URL, // Backend .NET API
});

/* ===================================================================== */
/* INTERFACES E TIPOS                                                   */
/* ===================================================================== */

// Interface para solicitação de criação de viajante
export interface TravelerCreateRequest {
  name: string;
  document: string;
  birthDate: string;
  isMainBuyer: boolean;
  documentType: string;
  issuingCountryName: string;
  issuingStateName?: string;
  documentIssuedAt: string;
}

// Interface para resposta da API com viajante
export interface TravelerResponse {
  id: number;
  name: string;
  document: string;
  birthDate: string;
  isMainBuyer: boolean;
  documentType: string;
  issuingCountryName: string;
  issuingStateName?: string;
  documentIssuedAt: string;
  reservationNumber?: string;
  hasReservation: boolean;
  createdAt: string;
  updatedAt?: string;
}

/* ===================================================================== */
/* FUNÇÕES PRINCIPAIS                                                   */
/* ===================================================================== */

/**
 * Cria um novo viajante no sistema
 * @param travelerData - Dados do viajante a ser criado
 * @returns Promise com os dados do viajante criado
 */
export const createTraveler = async (travelerData: TravelerCreateRequest): Promise<TravelerResponse> => {
  try {
    console.log('🔄 Criando viajante:', travelerData.name);
    
    const response = await api.post('/api/Traveler', travelerData);
    
    console.log('✅ Viajante criado com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao criar viajante:', error);
    throw new Error('Falha ao criar viajante');
  }
};

/**
 * Associa um viajante a uma reserva existente
 * @param travelerId - ID do viajante
 * @param reservationId - ID da reserva
 * @returns Promise com os dados do viajante atualizado
 */
export const associateTravelerToReservation = async (travelerId: number, reservationId: number): Promise<TravelerResponse> => {
  try {
    console.log(`🔄 Associando viajante ${travelerId} à reserva ${reservationId}`);
    
    const response = await api.patch(`/api/Traveler/${travelerId}/reservation/${reservationId}`);
    
    console.log('✅ Viajante associado com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao associar viajante à reserva:', error);
    throw new Error('Falha ao associar viajante à reserva');
  }
};

/**
 * Busca todos os viajantes associados a uma reserva
 * @param reservationId - ID da reserva
 * @returns Promise com a lista de viajantes da reserva
 */
export const getTravelersByReservation = async (reservationId: number): Promise<TravelerResponse[]> => {
  try {
    console.log(`🔄 Buscando viajantes da reserva ${reservationId}`);
    
    const response = await api.get(`/api/Traveler/reservation/${reservationId}`);
    
    console.log(`✅ ${response.data.length} viajantes encontrados`);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar viajantes da reserva:', error);
    throw new Error('Falha ao buscar viajantes da reserva');
  }
};

/**
 * Cria múltiplos viajantes e os associa a uma reserva
 * @param travelers - Lista de dados dos viajantes
 * @param reservationId - ID da reserva
 * @returns Promise com a lista de viajantes criados e associados
 */
export const createAndAssociateTravelers = async (
  travelers: TravelerCreateRequest[], 
  reservationId: number
): Promise<TravelerResponse[]> => {
  try {
    // ✅ Validar se travelers não é undefined ou null
    if (!travelers || !Array.isArray(travelers)) {
      console.warn('⚠️ Lista de viajantes inválida ou vazia:', travelers);
      return [];
    }

    console.log(`🔄 Criando e associando ${travelers.length} viajantes à reserva ${reservationId}`);
    
    // Se não há viajantes, retornar lista vazia
    if (travelers.length === 0) {
      console.log('ℹ️ Nenhum viajante para processar');
      return [];
    }
    
    // Criar os viajantes em sequência
    const createdTravelers: TravelerResponse[] = [];
    
    for (const travelerData of travelers) {
      // 1. Criar o viajante
      const traveler = await createTraveler(travelerData);
      
      // 2. Associar à reserva
      const associatedTraveler = await associateTravelerToReservation(traveler.id, reservationId);
      
      createdTravelers.push(associatedTraveler);
    }
    
    console.log(`✅ ${createdTravelers.length} viajantes criados e associados com sucesso`);
    return createdTravelers;
  } catch (error) {
    console.error('❌ Erro ao criar e associar viajantes:', error);
    throw new Error('Falha ao criar e associar viajantes à reserva');
  }
};
