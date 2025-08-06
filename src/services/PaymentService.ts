/* =============================================================================
 * SERVIÇO DE PAGAMENTO - INTEGRAÇÃO COM BACKEND
 * =============================================================================
 *
 * Este serviço gerencia as interações com a API de pagamento do backend,
 * incluindo criação de sessões de pagamento, consulta de status e callbacks.
 * Integra com o serviço de reservas para completar o fluxo de reserva.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7102/api', // Backend .NET API
});

/* =============================================================================
 * INTERFACES E TIPOS
 * =============================================================================
 */

// Interface para solicitação de pagamento
export interface PaymentRequest {
  reservationId: number;
  amount: number;
  paymentMethod: string;
  cardholderName?: string;
  cardNumber?: string;
  cardExpiryMonth?: string;
  cardExpiryYear?: string;
  cardCvc?: string;
}

// Interface para resposta da API com dados de pagamento
export interface PaymentResponse {
  id: number;
  reservationId: number;
  amount: number;
  status: string;
  paymentMethod: string;
  paymentDate: string;
  confirmationCode?: string;
  stripeSessionId?: string;
  stripeCheckoutUrl?: string;
}

/* =============================================================================
 * FUNÇÕES PRINCIPAIS
 * =============================================================================
 */

/**
 * Cria uma sessão de pagamento para uma reserva
 * @param paymentData - Dados do pagamento
 * @returns Promise com os dados da sessão de pagamento
 */
export const createPaymentSession = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
  try {
    console.log('🔄 Criando sessão de pagamento para reserva:', paymentData.reservationId);
    
    const response = await api.post('/Payment', paymentData);
    
    console.log('✅ Sessão de pagamento criada com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao criar sessão de pagamento:', error);
    throw new Error('Falha ao criar sessão de pagamento');
  }
};

/**
 * Verifica o status de um pagamento
 * @param paymentId - ID do pagamento
 * @returns Promise com os dados atualizados do pagamento
 */
export const getPaymentStatus = async (paymentId: number): Promise<PaymentResponse> => {
  try {
    console.log(`🔄 Verificando status do pagamento ${paymentId}`);
    
    const response = await api.get(`/Payment/${paymentId}`);
    
    console.log(`✅ Status do pagamento ${paymentId}:`, response.data.status);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao verificar status do pagamento:', error);
    throw new Error('Falha ao verificar status do pagamento');
  }
};

/**
 * Cria uma sessão de pagamento com Stripe e retorna a URL de checkout
 * @param reservationId - ID da reserva
 * @param amount - Valor do pagamento
 * @returns Promise com os dados da sessão do Stripe
 */
export const createStripeCheckoutSession = async (
  reservationId: number, 
  amount: number
): Promise<{sessionId: string, checkoutUrl: string}> => {
  try {
    console.log(`🔄 Criando sessão Stripe para reserva ${reservationId}`);
    
    // MODO DE DESENVOLVIMENTO: Usar mock para teste sem backend
    // Em produção, descomentar o código abaixo e remover o mock
    
    // const response = await api.post('/Payment/stripe/create-session', {
    //   reservationId,
    //   amount
    // });
    
    // console.log('✅ Sessão Stripe criada com sucesso:', response.data);
    // return {
    //   sessionId: response.data.sessionId,
    //   checkoutUrl: response.data.checkoutUrl
    // };
    
    // Mock para teste sem backend (REMOVER EM PRODUÇÃO)
    await new Promise(resolve => setTimeout(resolve, 800)); // Simular delay de rede
    const mockSessionId = `stripe_session_${Date.now()}`;
    const mockCheckoutUrl = `/payment/confirmation?session_id=${mockSessionId}&success=true`;
    
    console.log('✅ [MOCK] Sessão Stripe criada com sucesso:', {
      sessionId: mockSessionId,
      checkoutUrl: mockCheckoutUrl
    });
    
    return {
      sessionId: mockSessionId,
      checkoutUrl: mockCheckoutUrl
    };
  } catch (error) {
    console.error('❌ Erro ao criar sessão Stripe:', error);
    throw new Error('Falha ao criar sessão de pagamento com Stripe');
  }
};

/**
 * Confirma um pagamento recebido
 * @param paymentId - ID do pagamento
 * @returns Promise com os dados do pagamento confirmado
 */
export const confirmPayment = async (paymentId: number): Promise<PaymentResponse> => {
  try {
    console.log(`🔄 Confirmando pagamento ${paymentId}`);
    
    const response = await api.patch(`/Payment/${paymentId}/confirm`);
    
    console.log('✅ Pagamento confirmado com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao confirmar pagamento:', error);
    throw new Error('Falha ao confirmar pagamento');
  }
};

/**
 * Cancela um pagamento pendente
 * @param paymentId - ID do pagamento
 * @returns Promise com os dados do pagamento cancelado
 */
export const cancelPayment = async (paymentId: number): Promise<PaymentResponse> => {
  try {
    console.log(`🔄 Cancelando pagamento ${paymentId}`);
    
    const response = await api.patch(`/Payment/${paymentId}/cancel`);
    
    console.log('✅ Pagamento cancelado com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao cancelar pagamento:', error);
    throw new Error('Falha ao cancelar pagamento');
  }
};
