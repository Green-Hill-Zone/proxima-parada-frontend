import axios from 'axios';

// URL base da API - mesma do UserService
const API_BASE_URL = 'https://localhost:7102/api';

// Interface para dados da viagem da API
export interface Travel {
  id: number;
  name: string;
  description: string;
  destination: string;
  startDate: string;
  endDate: string;
  price: number;
  maxPeople: number;
  availableSlots: number;
  imageUrl?: string;
  companyId: number;
}

// Interface para reserva
export interface Reservation {
  id: number;
  userId: number;
  travelId: number;
  numberOfPeople: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  travel?: Travel;
}

/**
 * Buscar dados de uma viagem por ID
 */
export const getTravelById = async (id: number): Promise<Travel> => {
  try {
    console.log(`🔄 Buscando viagem por ID: ${id}`);
    
    const response = await axios.get(
      `${API_BASE_URL}/Travel/${id}`
    );

    console.log('✅ Viagem encontrada:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Erro ao buscar viagem:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Viagem não encontrada');
      }
      throw new Error(`Erro do servidor: ${error.response?.status}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

/**
 * Buscar todas as viagens disponíveis
 */
export const getAllTravels = async (): Promise<Travel[]> => {
  try {
    console.log('🔄 Buscando todas as viagens...');
    
    const response = await axios.get(
      `${API_BASE_URL}/Travel`
    );

    console.log('✅ Viagens encontradas:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Erro ao buscar viagens:', error);
    
    if (axios.isAxiosError(error)) {
      throw new Error(`Erro do servidor: ${error.response?.status}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

/**
 * Buscar reserva por ID
 */
export const getReservationById = async (id: number): Promise<Reservation> => {
  try {
    console.log(`🔄 Buscando reserva por ID: ${id}`);
    
    const response = await axios.get(
      `${API_BASE_URL}/Reservation/${id}`
    );

    console.log('✅ Reserva encontrada:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Erro ao buscar reserva:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Reserva não encontrada');
      }
      throw new Error(`Erro do servidor: ${error.response?.status}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};
