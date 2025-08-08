import axios from 'axios';

// URL base da API - mesma configuração dos outros serviços
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5079';

/* ===================================================================== */
/* INTERFACES - CLEAN ARCHITECTURE                                      */
/* ===================================================================== */

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

/* ===================================================================== */
/* STRIPE CONFIRMATION SERVICE - SINGLE RESPONSIBILITY                  */
/* ===================================================================== */

/**
 * Confirma o pagamento via session ID do Stripe
 * Princípio DRY: Reutiliza padrão de tratamento de erro
 * @param sessionId ID da sessão retornada pelo Stripe
 * @returns Promise com resultado da confirmação
 */
export const confirmStripePayment = async (sessionId: string): Promise<StripePaymentConfirmation> => {
  try {
    console.log(`🔄 Confirmando pagamento para sessão: ${sessionId}`);
    
    const response = await axios.post(
      `${API_BASE_URL}/api/Payment/stripe/confirm`,
      { sessionId }
    );

    console.log('✅ Pagamento confirmado:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Erro ao confirmar pagamento:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new Error('Session ID inválido ou expirado');
      }
      if (error.response?.status === 404) {
        throw new Error('Sessão de pagamento não encontrada');
      }
      if (error.response?.status === 409) {
        throw new Error('Pagamento já foi processado anteriormente');
      }
      throw new Error(`Erro do servidor: ${error.response?.status}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

/**
 * Verifica o status de uma sessão de pagamento
 * KISS: Função simples para verificação de status
 * @param sessionId ID da sessão do Stripe
 * @returns Promise com status da sessão
 */
export const getPaymentSessionStatus = async (sessionId: string): Promise<{
  status: 'open' | 'complete' | 'expired';
  paymentStatus: 'paid' | 'unpaid' | 'no_payment_required';
}> => {
  try {
    console.log(`🔄 Verificando status da sessão: ${sessionId}`);
    
    const response = await axios.get(
      `${API_BASE_URL}/api/Payment/stripe/session/${sessionId}/status`
    );

    console.log('✅ Status verificado:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Sessão não encontrada');
      }
      throw new Error(`Erro do servidor: ${error.response?.status}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};
