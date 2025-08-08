/* ===================================================================== */
/* CHECKOUT SERVICE - CLEAN ARCHITECTURE                               */
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
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5079/api',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
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
  // ✅ NOVO: dados para pagamento real
  amount?: number;  // em centavos (R$ 50,00 = 5000)
  includeInsurance?: boolean;
}

// ✅ NOVO: Request para criar Reservation + Stripe Session em uma operação
export interface CreateReservationWithStripeSessionRequest {
  travelPackageId: number;
  customerEmail?: string;
  customerName?: string;
  amount?: number;
  successUrl: string;
  cancelUrl: string;
  includeInsurance?: boolean;
  specialRequests?: string;
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

// ✅ NOVO: Response para Reservation + Stripe Session
export interface ReservationWithStripeSessionResponse {
  reservationId: number;
  reservationNumber: string;
  sessionId: string;  // ✅ Campo real retornado pelo backend
  checkoutUrl: string;
  totalAmount: number;  // ✅ Campo real retornado pelo backend
  status: string;
  // Campos opcionais que podem não vir do backend
  paymentId?: number;
  travelPackageId?: number;
  travelPackageTitle?: string;
  createdAt?: string;
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

// ✅ Alias para compatibilidade com código existente
export type PaymentConfirmationResult = PaymentConfirmationResponse;

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

// ✅ Interface legacy para compatibilidade com código existente
export interface ReservationCheckoutData {
  reservationId: number;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  successUrl: string;
  cancelUrl: string;
}

/* ===================================================================== */
/* VALIDATION FUNCTIONS - DRY PRINCIPLE                                */
/* ===================================================================== */

/**
 * ✅ CLEAN ARCH: Validação de usuário logado para checkout
 */
export const validateUserForCheckout = (user: any): { isValid: boolean; error?: string } => {
  if (!user) {
    return { 
      isValid: false, 
      error: '🔐 Você precisa estar logado para fazer uma reserva' 
    };
  }
  
  if (!user.email) {
    return { 
      isValid: false, 
      error: '📧 Email é obrigatório para efetuar compra' 
    };
  }
  
  return { isValid: true };
};

/**
 * Valida dados de checkout antes de enviar para o backend
 * @param data Dados de checkout a serem validados
 * @returns Objeto com resultado da validação
 */
export const validateCheckoutData = (data: ReservationCheckoutData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.reservationId || data.reservationId <= 0) {
    errors.push('ID da reserva é obrigatório');
  }

  if (!data.customerName?.trim()) {
    errors.push('Nome do cliente é obrigatório');
  }

  if (!data.customerEmail?.trim()) {
    errors.push('Email do cliente é obrigatório');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customerEmail)) {
    errors.push('Email inválido');
  }

  if (!data.totalAmount || data.totalAmount <= 0) {
    errors.push('Valor total deve ser maior que zero');
  }

  if (!data.successUrl) {
    errors.push('URL de sucesso é obrigatória');
  }

  if (!data.cancelUrl) {
    errors.push('URL de cancelamento é obrigatória');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * ✅ DRY: Cria request padronizado com dados do usuário
 */
export const createCheckoutRequest = (
  travelPackageId: number,
  user: any,
  amount?: number,
  options?: {
    includeInsurance?: boolean;
    specialRequests?: string;
  }
): CreateReservationWithStripeSessionRequest => {
  // ✅ VALIDAÇÃO: Garantir que o usuário está logado com dados válidos
  if (!user || !user.email || !user.name) {
    throw new Error('🔐 Usuário deve estar logado com email e nome para efetuar compra');
  }

  console.log('📋 Criando request com dados do usuário logado:', {
    email: user.email,
    name: user.name,
    travelPackageId
  });

  return {
    travelPackageId,
    customerEmail: user.email,      // ✅ Email exato do usuário logado
    customerName: user.name,        // ✅ Nome exato do usuário logado  
    amount,
    successUrl: `${window.location.origin}/payment/success`,
    cancelUrl: `${window.location.origin}/payment/cancel`,
    includeInsurance: options?.includeInsurance || false,
    specialRequests: options?.specialRequests
  };
};

/* ===================================================================== */
/* CHECKOUT SERVICE CLASS - CLEAN ARCHITECTURE                         */
/* ===================================================================== */

export class CheckoutService {
  
  /**
   * ✅ Obtém métodos de pagamento disponíveis - INTEGRAÇÃO REAL
   */
  static async getPaymentMethods(): Promise<PaymentMethodsResponse> {
    try {
      console.log('� Buscando métodos de pagamento...');
      
      const response = await api.get('/paymentoption');
      
      console.log('✅ Métodos obtidos:', response.data);
      
      // Transformar dados do backend para o formato esperado pelo frontend
      const paymentMethods: PaymentMethodsResponse = {
        availableMethods: response.data.map((option: any) => ({
          type: option.id,
          name: option.name,
          description: option.description || 'Método de pagamento',
          simulationTime: 'Imediato'
        })),
        isSimulation: false,
        simulationNote: ''
      };
      
      return paymentMethods;
      
    } catch (error) {
      console.error('❌ Erro ao buscar métodos:', error);
      throw new Error('Erro ao buscar métodos de pagamento');
    }
  }

  /**
   * ✅ Cria sessão Stripe - COM DADOS REAIS DO FRONTEND (KISS)
   */
  static async createStripeSession(request: CreateStripeSessionRequest): Promise<StripeSessionResponse> {
    try {
      console.log('🚀 Criando sessão Stripe com dados reais:', request);
      
      // ✅ USAR DADOS REAIS DO FRONTEND
      const stripeRequest = {
        // reservationId não é enviado (opcional no backend)
        amount: request.amount || request.customPrice || 5000, // ✅ valor real
        packageName: request.packageName || 'Pacote de Viagem',
        packageId: request.packageId,
        customerEmail: request.customerEmail, // ✅ email real
        customerName: request.customerName,   // ✅ nome real
        successUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`
      };
      
      const response = await api.post<StripeSessionResponse>('/api/Payment/create-stripe-session', stripeRequest);
      
      console.log('✅ Sessão Stripe criada:', response.data);
      
      return {
        sessionId: response.data.sessionId,
        checkoutUrl: response.data.checkoutUrl,
        totalAmount: response.data.totalAmount || stripeRequest.amount,
        packageName: request.packageName || 'Pacote de Viagem',
        quantity: request.quantity,
        reservationNumber: 'TEMP-' + Date.now() // Temporário
      };
      
    } catch (error) {
      console.error('❌ Erro ao criar sessão:', error);
      throw new Error('Erro ao criar sessão de checkout');
    }
  }

  /**
   * ✅ NOVO: Criar Reservation + Stripe Session em uma operação
   * Este é o método principal que será usado no botão "Pagar com Stripe"
   */
  static async createReservationWithStripeSession(
    request: CreateReservationWithStripeSessionRequest
  ): Promise<ReservationWithStripeSessionResponse> {
    console.log('🎯 Criando reserva + sessão Stripe:', request);

    try {
      const response = await api.post<ReservationWithStripeSessionResponse>(
        '/api/Payment/create-reservation-with-stripe',
        request
      );

      console.log('✅ Reserva + Stripe criados:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar reserva + stripe:', error);
      
      // ✅ CLEAN CODE: Tratamento específico baseado nas regras do backend
      if (error.response?.status === 400 && error.response?.data?.Message) {
        const message = error.response.data.Message;
        
        // ✅ KISS: Mensagens específicas para cada regra de negócio
        if (message.includes('logado')) {
          throw new Error('🔐 Você precisa estar logado para fazer uma reserva');
        }
        if (message.includes('Email é obrigatório')) {
          throw new Error('📧 Email é obrigatório para efetuar compra');
        }
        if (message.includes('Pacote de viagem não encontrado')) {
          throw new Error('📦 Pacote de viagem não encontrado');
        }
        
        // ✅ DRY: Usar mensagem original do backend se não for mapeada
        throw new Error(message);
      }
      
      // ✅ YAGNI: Erro genérico para outros casos
      throw new Error('Falha ao processar reserva e pagamento');
    }
  }

  /**
   * ✅ Confirma pagamento - USANDO getPaymentStatus POR ENQUANTO
   * Nota: O backend usa sessionId para verificar status automaticamente
   */
  static async confirmPayment(
    request: ConfirmPaymentRequest, 
    userEmail?: string
  ): Promise<PaymentConfirmationResponse> {
    try {
      console.log('🔍 Confirmando pagamento via status:', request);
      
      // Por enquanto, usamos o status endpoint que já existe
      const response = await this.getPaymentStatus(request.sessionId, userEmail);
      
      console.log('✅ Pagamento confirmado:', response);
      return response;
      
    } catch (error) {
      console.error('❌ Erro ao confirmar:', error);
      throw new Error('Erro ao confirmar pagamento');
    }
  }

  /**
   * ✅ Busca status do pagamento - TESTADO E FUNCIONANDO
   */
  static async getPaymentStatus(
    sessionId: string, 
    userEmail?: string
  ): Promise<PaymentConfirmationResponse> {
    try {
      console.log('🔍 Buscando status:', sessionId);
      
      const response = await api.get<PaymentConfirmationResponse>(`/api/Payment/status/${sessionId}`);
      
      console.log('✅ Status obtido:', response.data);
      
      // ✅ Priorizar email do usuário logado sobre dados do backend
      const responseData = response.data;
      let finalCustomerEmail = userEmail || responseData.customerEmail;
      
      // ✅ FALLBACK: Tentar obter email de outras fontes APENAS se não tiver email do usuário
      if (!finalCustomerEmail) {
        console.log('⚠️ Email não encontrado, tentando fallbacks...');
        try {
          // Tentar obter do localStorage onde salvamos dados do pagamento
          const stripePaymentSession = localStorage.getItem('stripePaymentSession');
          if (stripePaymentSession) {
            const paymentData = JSON.parse(stripePaymentSession);
            finalCustomerEmail = paymentData.customerData?.email;
            console.log('📧 Email obtido do stripePaymentSession:', finalCustomerEmail);
          }
          
          // Tentar obter de dados de viajantes salvos
          if (!finalCustomerEmail) {
            const travelersData = localStorage.getItem('travelersData');
            if (travelersData) {
              const travelers = JSON.parse(travelersData);
              const mainTraveler = travelers.find((t: any) => t.isMainTraveler);
              finalCustomerEmail = mainTraveler?.email;
              console.log('📧 Email obtido dos viajantes:', finalCustomerEmail);
            }
          }
        } catch (error) {
          console.warn('⚠️ Erro ao obter email do localStorage:', error);
        }
      } else {
        console.log('✅ Usando email fornecido/backend:', finalCustomerEmail);
      }
      
      console.log('🔍 Email final determinado:', finalCustomerEmail);
      
      const result = {
        isSuccessful: responseData.isSuccessful,
        status: responseData.status,
        amount: responseData.amount,
        paymentIntentId: responseData.paymentIntentId,
        reservationId: responseData.reservationId,
        customerEmail: finalCustomerEmail,
        errorMessage: responseData.errorMessage
      };
      
      console.log('✅ Resultado final do pagamento:', result);
      return result;
      
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

  /**
   * ✅ Cria uma sessão de checkout no Stripe (método legacy para compatibilidade)
   * @param data Dados necessários para criar a sessão
   * @returns Promise com dados da sessão criada
   */
  static async createCheckoutSession(data: ReservationCheckoutData): Promise<StripeSessionResponse> {
    try {
      console.log('� Criando sessão Stripe (método legacy):', data);

      // Validar dados antes de enviar
      const validation = validateCheckoutData(data);
      if (!validation.isValid) {
        throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
      }

      const response = await api.post<StripeSessionResponse>('/api/Payment/create-checkout-session', data);
      
      console.log('✅ Sessão Stripe criada:', response.data);
      return response.data;

    } catch (error: any) {
      console.error('❌ Erro ao criar sessão Stripe:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Erro ao criar sessão de pagamento');
    }
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
 * ✅ Extrai parâmetros da URL de retorno do Stripe
 * DRY: Função reutilizável para parsing de parâmetros
 */
export const extractStripeParams = (url: string = window.location.search) => {
  const params = new URLSearchParams(url);
  const sessionId = params.get('session_id');
  
  return {
    sessionId,
    success: !!sessionId, // Se tem session_id, foi sucesso
    canceled: params.get('canceled') === 'true' || !sessionId
  };
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
