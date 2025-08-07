import axios from 'axios';

// URL base da API - mesma do UserService
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7102' || 'http://localhost:5079/api';

// Interfaces para os dados de pagamento
export interface PaymentRequest {
  userId: number;
  travelId: number;
  reservationId?: number;
  amount: number;
  fullName: string;
  email: string;
  cpf: string;
  paymentMethod: 'stripe' | 'credit_card' | 'pix';
  status?: 'pending' | 'completed' | 'failed';
}

export interface PaymentResponse {
  id: number;
  userId: number;
  travelId: number;
  reservationId?: number;
  amount: number;
  status: string;
  paymentMethod: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Criar um novo pagamento
 */
export const createPayment = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
  try {
    console.log('🔄 Enviando dados de pagamento para API:', paymentData);
    
    const response = await axios.post(
      `${API_BASE_URL}/api/Payment/create`,
      paymentData
    );

    console.log('✅ Pagamento criado com sucesso:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Erro ao criar pagamento:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new Error('Dados de pagamento inválidos');
      }
      if (error.response?.status === 404) {
        throw new Error('Viagem não encontrada');
      }
      throw new Error(`Erro do servidor: ${error.response?.status}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

/**
 * Buscar pagamentos do usuário
 */
export const getUserPayments = async (userId: number): Promise<PaymentResponse[]> => {
  try {
    console.log(`🔄 Buscando pagamentos do usuário: ${userId}`);
    
    const response = await axios.get(
      `${API_BASE_URL}/api/Payment/user/${userId}`
    );

    console.log('✅ Pagamentos encontrados:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Erro ao buscar pagamentos:', error);
    
    if (axios.isAxiosError(error)) {
      throw new Error(`Erro do servidor: ${error.response?.status}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

/**
 * Atualizar status do pagamento
 */
export const updatePaymentStatus = async (
  paymentId: number, 
  status: 'pending' | 'completed' | 'failed'
): Promise<PaymentResponse> => {
  try {
    console.log(`🔄 Atualizando status do pagamento ${paymentId} para: ${status}`);
    
    const response = await axios.put(
      `${API_BASE_URL}/api/Payment/${paymentId}/status`,
      { status }
    );

    console.log('✅ Status do pagamento atualizado:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Erro ao atualizar status do pagamento:', error);
    
    if (axios.isAxiosError(error)) {
      throw new Error(`Erro do servidor: ${error.response?.status}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

/**
 * Interface para resposta da sessão do Stripe
 */
export interface StripeSessionResponse {
  sessionId: string;
  checkoutUrl: string;
}

/**
 * Cria uma sessão de checkout no Stripe
 * @param reservationId ID da reserva
 * @param amount Valor total do pagamento
 * @returns Objeto com ID da sessão e URL de checkout
 */
export const createStripeCheckoutSession = async (
  reservationId: number,
  amount: number
): Promise<StripeSessionResponse> => {
  try {
    console.log(`🔄 Criando sessão do Stripe para reserva: ${reservationId} | Valor: ${amount}`);
    
    const response = await axios.post(
      `${API_BASE_URL}/api/Payment/stripe/create-session`,
      {
        reservationId,
        amount
      }
    );

    console.log('✅ Sessão do Stripe criada:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Erro ao criar sessão do Stripe:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new Error('Dados inválidos para criação da sessão');
      }
      if (error.response?.status === 404) {
        throw new Error('Reserva não encontrada');
      }
      throw new Error(`Erro do servidor: ${error.response?.status}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};
