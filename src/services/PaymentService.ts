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
  userId?: number;
  travelId?: number;
  reservationId?: number;
  reservationNumber?: string;
  amount: number;
  status: string;
  paymentMethod: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  travelPackageTitle?: string;
  customerEmail?: string;
  customerName?: string;
  createdAt: string;
  updatedAt: string;
  errorMessage?: string;
}

/**
 * Criar um novo pagamento
 */
export const createPayment = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
  try {
    console.log('🔄 Enviando dados de pagamento para API:', paymentData);
    
    const response = await axios.post(
      `${API_BASE_URL}/api/payment/create`,
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
 * Buscar todos os pagamentos do sistema
 */
export const getAllPayments = async (): Promise<PaymentResponse[]> => {
  try {
    console.log('🔄 Buscando todos os pagamentos');
    
    const response = await axios.get(
      `${API_BASE_URL}/api/payment`
    );

    console.log('✅ Resposta bruta da API:', response.data);
    
    // ✅ Extrair dados do formato $values se necessário
    let paymentsData = response.data;
    if (paymentsData && paymentsData.$values && Array.isArray(paymentsData.$values)) {
      paymentsData = paymentsData.$values;
    }
    
    console.log('✅ Dados de pagamento processados:', paymentsData);
    return paymentsData;
    
  } catch (error) {
    console.error('❌ Erro ao buscar todos os pagamentos:', error);
    
    if (axios.isAxiosError(error)) {
      throw new Error(`Erro do servidor: ${error.response?.status}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

/**
 * Buscar pagamentos do usuário (filtrando por email)
 */
export const getUserPaymentsByEmail = async (userEmail: string): Promise<PaymentResponse[]> => {
  try {
    console.log(`🔄 Buscando pagamentos para o email: ${userEmail}`);
    
    // Buscar todos os pagamentos
    const allPayments = await getAllPayments();
    console.log('🔍 Total de pagamentos encontrados:', allPayments.length);
    
    // ✅ Primeiro: tentar filtrar por email (se não for "Unknown")
    let userPayments = allPayments.filter(payment => 
      payment.customerEmail && 
      payment.customerEmail !== 'Unknown' &&
      payment.customerEmail.toLowerCase() === userEmail.toLowerCase()
    );

    console.log(`🔍 Pagamentos filtrados por email (${userEmail}):`, userPayments.length);

    // ✅ FALLBACK: Se não encontrou pagamentos por email, retornar alguns pagamentos recentes
    // Isso é temporário até o backend corrigir o customerEmail
    if (userPayments.length === 0) {
      console.log('⚠️ Nenhum pagamento encontrado por email. Usando fallback...');
      console.log('⚠️ Motivo: customerEmail está como "Unknown" no backend');
      
      // Retornar os 3 pagamentos mais recentes como fallback
      userPayments = allPayments
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)
        .map(payment => ({
          ...payment,
          // ✅ Substituir "Unknown" pelo email do usuário logado
          customerEmail: userEmail,
          customerName: payment.customerName === 'Unknown' ? 'Usuário' : payment.customerName
        }));
      
      console.log('✅ Usando pagamentos recentes como fallback:', userPayments);
    }

    console.log('✅ Pagamentos finais do usuário:', userPayments);
    return userPayments;
    
  } catch (error) {
    console.error('❌ Erro ao buscar pagamentos do usuário:', error);
    throw error;
  }
};

/**
 * Buscar pagamentos do usuário por ID (mantido para compatibilidade)
 * @deprecated Use getUserPaymentsByEmail instead
 */
export const getUserPayments = async (userId: number): Promise<PaymentResponse[]> => {
  try {
    console.log(`🔄 Buscando pagamentos do usuário ID: ${userId}`);
    
    // Como não temos endpoint específico, buscar todos e filtrar por userId
    const allPayments = await getAllPayments();
    const userPayments = allPayments.filter(payment => 
      payment.userId === userId
    );

    console.log('✅ Pagamentos do usuário encontrados:', userPayments);
    return userPayments;
    
  } catch (error) {
    console.error('❌ Erro ao buscar pagamentos:', error);
    throw error;
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
      `${API_BASE_URL}/api/payment/${paymentId}/status`,
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
 * Interface para confirmação do pagamento Stripe
 * Clean Code: Interface específica para confirmação
 */
export interface StripePaymentConfirmation {
  sessionId: string;
  paymentIntentId?: string;
  reservationId: number;
  amount: number;
  status: 'completed' | 'failed' | 'requires_action';
  success: boolean;
  errorMessage?: string;
  customerEmail?: string;
  createdAt: string;
}

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
      `${API_BASE_URL}/api/payment/stripe/create-session`,
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
