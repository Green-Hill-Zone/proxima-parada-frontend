/* ===================================================================== */
/* CHECKOUT SERVICE LIMPO - ALINHADO COM BACKEND TESTADO               */
/* ===================================================================== */
/*
 * Implementação seguindo os princípios:
 * - Clean Architecture: Separação clara de responsabilidades
 * - KISS: Interface simples alinhada com backend
 * - DRY: Reutilização de configurações
 * - YAGNI: Apenas funcionalidades necessárias e testadas
 * - Shadow Properties: Compatível com EF Core do backend
 */

import axios from 'axios';

// ✅ Configuração centralizada - DRY
const api = axios.create({
  baseURL: 'http://localhost:5079/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

/* ===================================================================== */
/* INTERFACES - ALINHADAS COM BACKEND DTOs TESTADOS                    */
/* ===================================================================== */

// ✅ Types para o frontend (UI)
export type PaymentMethod = 'card' | 'pix' | 'boleto';

export interface TravelData {
  name: string;
  date: string;
  price: number;
  people: number;
  packageId: number;
}

// ✅ Request para criar sessão Stripe (alinhado com CreateCheckoutSessionDto)
export interface CreateStripeSessionRequest {
  packageId: number;
  customerName: string;
  customerEmail: string;
  quantity: number;
  customPrice?: number;
  packageName?: string;
}

// ✅ Response da criação de sessão (alinhado com CheckoutSessionResponseDto)
export interface StripeSessionResponse {
  sessionId: string;
  checkoutUrl: string;
  totalAmount: number;
  packageName: string;
  quantity: number;
  reservationNumber?: string;
}

// ✅ Request para confirmação (alinhado com ConfirmPaymentDto)
export interface ConfirmPaymentRequest {
  sessionId: string;
}

// ✅ Response da confirmação (alinhado com PaymentConfirmationDto)
export interface PaymentConfirmationResponse {
  isSuccessful: boolean;
  status: string;
  amount: number;
  paymentIntentId: string;
  reservationId?: number;
  reservationStatus?: string;
  customerEmail?: string;
  errorMessage?: string;
}

// ✅ Métodos de pagamento disponíveis
export interface PaymentMethodsResponse {
  availableMethods: Array<{
    type: number;
    name: string;
    description: string;
    simulationTime: string;
  }>;
  isSimulation: boolean;
  simulationNote: string;
}

/* ===================================================================== */
/* CHECKOUT SERVICE CLASS - CLEAN ARCHITECTURE                         */
/* ===================================================================== */

export class CheckoutService {
  
  /**
   * ✅ Obtém métodos de pagamento disponíveis - TESTADO
   */
  static async getPaymentMethods(): Promise<PaymentMethodsResponse> {
    try {
      console.log('🔍 Buscando métodos de pagamento...');
      
      const response = await api.get<PaymentMethodsResponse>('/checkout/payment-methods');
      
      console.log('✅ Métodos obtidos:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Erro ao buscar métodos:', error);
      throw new Error('Erro ao buscar métodos de pagamento');
    }
  }

  /**
   * ✅ Cria sessão Stripe - TESTADO E FUNCIONANDO
   */
  static async createStripeSession(request: CreateStripeSessionRequest): Promise<StripeSessionResponse> {
    try {
      console.log('🚀 Criando sessão Stripe:', request);
      
      const response = await api.post<StripeSessionResponse>('/checkout/create-stripe-session', request);
      
      console.log('✅ Sessão criada:', response.data);
      
      return {
        sessionId: response.data.sessionId,
        checkoutUrl: response.data.checkoutUrl,
        totalAmount: response.data.totalAmount,
        packageName: response.data.packageName,
        quantity: response.data.quantity,
        reservationNumber: response.data.reservationNumber
      };
      
    } catch (error) {
      console.error('❌ Erro ao criar sessão:', error);
      throw new Error('Erro ao criar sessão de checkout');
    }
  }

  /**
   * ✅ Confirma pagamento - TESTADO E FUNCIONANDO
   */
  static async confirmPayment(request: ConfirmPaymentRequest): Promise<PaymentConfirmationResponse> {
    try {
      console.log('🔍 Confirmando pagamento:', request);
      
      const response = await api.post<PaymentConfirmationResponse>('/checkout/confirm-payment', request);
      
      console.log('✅ Pagamento confirmado:', response.data);
      
      return {
        isSuccessful: response.data.isSuccessful,
        status: response.data.status,
        amount: response.data.amount,
        paymentIntentId: response.data.paymentIntentId,
        reservationId: response.data.reservationId,
        reservationStatus: response.data.reservationStatus,
        customerEmail: response.data.customerEmail,
        errorMessage: response.data.errorMessage
      };
      
    } catch (error) {
      console.error('❌ Erro ao confirmar:', error);
      throw new Error('Erro ao confirmar pagamento');
    }
  }

  /**
   * ✅ Busca status do pagamento - TESTADO E FUNCIONANDO
   */
  static async getPaymentStatus(sessionId: string): Promise<PaymentConfirmationResponse> {
    try {
      console.log('🔍 Buscando status:', sessionId);
      
      const response = await api.get<PaymentConfirmationResponse>(`/checkout/payment-status/${sessionId}`);
      
      console.log('✅ Status obtido:', response.data);
      
      return {
        isSuccessful: response.data.isSuccessful,
        status: response.data.status,
        amount: response.data.amount,
        paymentIntentId: response.data.paymentIntentId,
        reservationId: response.data.reservationId,
        customerEmail: response.data.customerEmail,
        errorMessage: response.data.errorMessage
      };
      
    } catch (error) {
      console.error('❌ Erro ao buscar status:', error);
      throw new Error('Erro ao buscar status do pagamento');
    }
  }

  /**
   * ✅ Redireciona para checkout Stripe
   */
  static redirectToStripeCheckout(checkoutUrl: string): void {
    console.log('🔄 Redirecionando para Stripe...');
    window.location.href = checkoutUrl;
  }

  /**
   * ✅ Extrai session ID da URL
   */
  static extractSessionIdFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('session_id');
  }

  /**
   * ✅ Verifica se está na página de sucesso/cancelamento
   */
  static isSuccessPage(): boolean {
    return window.location.pathname.includes('/payment/success');
  }

  static isCancelPage(): boolean {
    return window.location.pathname.includes('/payment/cancel');
  }
}

/* ===================================================================== */
/* HELPER FUNCTIONS - DRY PRINCIPLE                                     */
/* ===================================================================== */

/**
 * ✅ Formata valor em reais
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * ✅ Gera dados de exemplo para testes - TESTADOS
 */
export const createMockCheckoutRequest = (packageId: number = 1): CreateStripeSessionRequest => ({
  packageId,
  customerName: 'João Silva',
  customerEmail: 'joao.silva@teste.com',
  quantity: 2,
  customPrice: 1500.00,
  packageName: 'Pacote Teste Frontend'
});

export default CheckoutService;
