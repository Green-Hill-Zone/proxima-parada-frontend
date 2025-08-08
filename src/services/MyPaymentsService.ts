/* ===================================================================== */
/* MY PAYMENTS SERVICE - CLEAN ARCHITECTURE                            */
/* ===================================================================== */
/*
 * Implementação seguindo os princípios:
 * - Clean Architecture: Separação clara de responsabilidades
 * - KISS: Interface simples para consulta de pagamentos
 * - DRY: Reutilização de configurações da API
 * - YAGNI: Apenas funcionalidades necessárias
 */

import axios from 'axios';

// ✅ Configuração centralizada - DRY (mesma do CheckoutService)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5079/api',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  timeout: 30000,
});

/* ===================================================================== */
/* INTERFACES - ALINHADAS COM BACKEND                                  */
/* ===================================================================== */

// ✅ Interface para um pagamento individual
export interface PaymentInfo {
  id: number;
  reservationId: number;
  reservationNumber: string;
  amount: number;
  status: string;
  paymentMethod: string;
  stripeSessionId?: string;
  paymentIntentId?: string;
  travelPackageTitle: string;
  customerEmail: string;
  customerName: string;
  createdAt: string;
  updatedAt: string;
  errorMessage?: string;
}

// ✅ Interface para resposta completa de pagamentos
export interface MyPaymentsResponse {
  payments: PaymentInfo[];
  totalPayments: number;
  totalAmount: number;
  customerEmail: string;
  dateRange: {
    from: string;
    to: string;
  };
}

/* ===================================================================== */
/* MY PAYMENTS SERVICE CLASS                                            */
/* ===================================================================== */

export class MyPaymentsService {
  /**
   * ✅ Buscar todos os pagamentos de um usuário
   * GET /api/payment/my-payments/{email}
   */
  static async getMyPayments(customerEmail: string): Promise<MyPaymentsResponse> {
    try {
      console.log(`🔍 Buscando pagamentos para: ${customerEmail}`);
      
      const response = await api.get(`/api/payment/my-payments/${encodeURIComponent(customerEmail)}`);
      
      console.log('✅ Pagamentos obtidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar pagamentos:', error);
      throw error;
    }
  }

  /**
   * ✅ Filtrar pagamentos por status
   */
  static filterPaymentsByStatus(payments: MyPaymentsResponse, status?: string): MyPaymentsResponse {
    if (!status) return payments;
    
    const filteredPayments = payments.payments.filter(payment => payment.status === status);
    
    return {
      ...payments,
      payments: filteredPayments,
      totalPayments: filteredPayments.length,
      totalAmount: filteredPayments.reduce((sum, payment) => sum + payment.amount, 0)
    };
  }

  /**
   * ✅ Buscar pagamento específico por ID
   */
  static async getPaymentById(paymentId: number): Promise<PaymentInfo> {
    try {
      console.log(`🔍 Buscando pagamento ID: ${paymentId}`);
      
      const response = await api.get(`/api/payment/${paymentId}`);
      
      console.log('✅ Pagamento obtido:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao buscar pagamento ${paymentId}:`, error);
      throw error;
    }
  }

  /**
   * ✅ Buscar status de pagamento por Stripe Session ID
   */
  static async getPaymentBySessionId(
    sessionId: string, 
    userEmail?: string
  ): Promise<PaymentInfo> {
    try {
      console.log(`🔍 Buscando pagamento por session ID: ${sessionId}`);
      
      const response = await api.get(`/api/payment/status/${sessionId}`);
      
      console.log('✅ Pagamento obtido por session ID:', response.data);
      
      // ✅ Garantir que customerEmail esteja preenchido
      const paymentInfo = response.data;
      if (!paymentInfo.customerEmail && userEmail) {
        paymentInfo.customerEmail = userEmail;
      }
      
      return paymentInfo;
    } catch (error) {
      console.error(`❌ Erro ao buscar pagamento por session ID ${sessionId}:`, error);
      throw error;
    }
  }
}

/* ===================================================================== */
/* HELPER FUNCTIONS - DRY PRINCIPLE                                     */
/* ===================================================================== */

/**
 * ✅ Formata status de pagamento para exibição
 */
export const formatPaymentStatus = (status: string): { text: string; variant: string } => {
  const statusMap: Record<string, { text: string; variant: string }> = {
    'pending': { text: 'Pendente', variant: 'warning' },
    'processing': { text: 'Processando', variant: 'info' },
    'completed': { text: 'Concluído', variant: 'success' },
    'failed': { text: 'Falhou', variant: 'danger' },
    'cancelled': { text: 'Cancelado', variant: 'secondary' },
    'refunded': { text: 'Reembolsado', variant: 'primary' }
  };

  return statusMap[status.toLowerCase()] || { text: status, variant: 'secondary' };
};

/**
 * ✅ Formata método de pagamento para exibição
 */
export const formatPaymentMethod = (method: string): string => {
  const methodMap: Record<string, string> = {
    'stripe': 'Cartão de Crédito (Stripe)',
    'pix': 'PIX',
    'boleto': 'Boleto Bancário',
    'card': 'Cartão de Crédito'
  };

  return methodMap[method.toLowerCase()] || method;
};

/**
 * ✅ Formata data para exibição brasileira
 */
export const formatPaymentDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

/**
 * ✅ Formata valor monetário para exibição
 */
export const formatPaymentAmount = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount / 100); // Convert from cents
};

export default MyPaymentsService;
