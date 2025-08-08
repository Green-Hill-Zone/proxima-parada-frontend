import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CheckoutService, extractStripeParams, type PaymentConfirmationResult } from '../../services/CheckoutService';
import { createAndAssociateTravelers, type TravelerCreateRequest } from '../../services/TravelerService';
import { useAuth } from '../../hooks/useAuth';
import './PaymentSuccess.css';

/* ===================================================================== */
/* INTERFACES - CLEAN CODE                                             */
/* ===================================================================== */

interface PaymentSuccessState {
  status: 'loading' | 'confirming' | 'saving-travelers' | 'completed' | 'error';
  message: string;
  paymentData?: PaymentConfirmationResult;
  errorDetails?: string;
}

/* ===================================================================== */
/* COMPONENT - SINGLE RESPONSIBILITY                                    */
/* ===================================================================== */

/**
 * Componente responsável por exibir o sucesso do pagamento
 * Princípios: SRP, Clean Architecture, KISS
 */
const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ Obter dados do usuário logado
  
  // ✅ Debug: Log para verificar se o usuário está disponível
  useEffect(() => {
    console.log('🔍 PaymentSuccess - Dados do usuário no contexto:', {
      user,
      userEmail: user?.email,
      userName: user?.name,
      userId: user?.id
    });
  }, [user]);
  
  // Estado unificado seguindo Clean Code
  const [state, setState] = useState<PaymentSuccessState>({
    status: 'loading',
    message: 'Verificando seu pagamento...'
  });

  // Processar confirmação de pagamento quando componente carregar
  useEffect(() => {
    processPaymentSuccess();
  }, []);

  /**
   * ✅ Obtém email do usuário de múltiplas fontes com prioridade
   * 1. Usuário logado no contexto
   * 2. Dados salvos durante o pagamento
   * 3. Dados dos viajantes principais
   * 4. localStorage do auth
   */
  const getUserEmailFromMultipleSources = (): string | undefined => {
    // 1. Primeira prioridade: usuário do contexto
    if (user?.email) {
      console.log('✅ Email obtido do contexto de auth:', user.email);
      return user.email;
    }

    try {
      // 2. Segunda prioridade: dados salvos durante o pagamento
      const stripePaymentSession = localStorage.getItem('stripePaymentSession');
      if (stripePaymentSession) {
        const paymentData = JSON.parse(stripePaymentSession);
        if (paymentData.customerData?.email) {
          console.log('✅ Email obtido dos dados do pagamento:', paymentData.customerData.email);
          return paymentData.customerData.email;
        }
      }

      // 3. Terceira prioridade: dados dos viajantes principais
      const travelersData = localStorage.getItem('travelersData');
      if (travelersData) {
        const travelers = JSON.parse(travelersData);
        const mainTraveler = travelers.find((t: any) => t.isMainTraveler);
        if (mainTraveler?.email) {
          console.log('✅ Email obtido dos dados de viajantes:', mainTraveler.email);
          return mainTraveler.email;
        }
      }

      // 4. Quarta prioridade: dados de auth salvos
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        if (userData.email) {
          console.log('✅ Email obtido do localStorage auth:', userData.email);
          return userData.email;
        }
      }

    } catch (error) {
      console.warn('⚠️ Erro ao obter email do localStorage:', error);
    }

    console.warn('⚠️ Não foi possível obter email do usuário de nenhuma fonte');
    return undefined;
  };

  /**
   * Processa o fluxo completo de confirmação de pagamento
   * Clean Architecture: Orquestra as operações sem implementar detalhes
   */
  const processPaymentSuccess = async () => {
    try {
      // ✅ DEBUG: Verificar dados do usuário logado
      console.log('🔍 Usuário logado:', user);
      console.log('🔍 Email do usuário logado:', user?.email);
      
      // Extrair parâmetros da URL
      const { sessionId, success } = extractStripeParams();
      
      if (!sessionId || !success) {
        throw new Error('Parâmetros de pagamento inválidos');
      }

      // Atualizar status: confirmando pagamento
      setState(prev => ({
        ...prev,
        status: 'confirming',
        message: 'Confirmando seu pagamento...'
      }));

      // Confirmar pagamento com o backend
      // ✅ Tentar obter email do usuário de várias fontes
      const userEmail = getUserEmailFromMultipleSources();
      console.log('🔍 Email final para confirmação:', userEmail);
      
      const paymentResult = await CheckoutService.confirmPayment({ sessionId }, userEmail);
      
      if (!paymentResult.isSuccessful) {
        throw new Error(paymentResult.errorMessage || 'Falha na confirmação do pagamento');
      }

      // Atualizar estado com dados do pagamento
      setState(prev => ({
        ...prev,
        status: 'saving-travelers',
        message: 'Pagamento confirmado! Registrando dados dos viajantes...',
        paymentData: paymentResult
      }));

      // Processar viajantes pendentes (se existirem)
      if (paymentResult.reservationId) {
        await processPendingTravelers(paymentResult.reservationId);
      }

      // Sucesso completo
      setState(prev => ({
        ...prev,
        status: 'completed',
        message: 'Reserva confirmada com sucesso! Sua viagem está garantida.'
      }));

      // Limpar dados temporários
      cleanupTempData();

    } catch (error) {
      console.error('❌ Erro no processamento do pagamento:', error);
      
      setState({
        status: 'error',
        message: 'Ocorreu um erro ao processar seu pagamento',
        errorDetails: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  /**
   * Processa viajantes pendentes após confirmação do pagamento
   * KISS: Função específica com responsabilidade única
   */
  const processPendingTravelers = async (reservationId: number) => {
    try {
      const pendingTravelersData = localStorage.getItem('pendingTravelers');
      console.log('🔍 Dados de viajantes no localStorage:', pendingTravelersData);
      
      if (pendingTravelersData) {
        const parsedData = JSON.parse(pendingTravelersData);
        console.log('🔍 Dados parseados:', parsedData);
        
        // ✅ Verificar se os dados estão no formato correto
        let travelers: TravelerCreateRequest[];
        
        if (Array.isArray(parsedData)) {
          travelers = parsedData;
        } else if (parsedData.travelers && Array.isArray(parsedData.travelers)) {
          travelers = parsedData.travelers;
        } else {
          console.warn('⚠️ Formato de dados de viajantes inválido:', parsedData);
          return;
        }
        
        console.log('🔍 Lista de viajantes a processar:', travelers);
        
        // Criar e associar viajantes à reserva
        await createAndAssociateTravelers(travelers, reservationId);
        
        console.log('✅ Viajantes registrados com sucesso');
      } else {
        console.log('ℹ️ Nenhum dado de viajantes pendente encontrado');
      }
    } catch (error) {
      console.error('⚠️ Erro ao registrar viajantes:', error);
      // Não falha o fluxo principal - pagamento já foi confirmado
      setState(prev => ({
        ...prev,
        message: 'Pagamento confirmado! Houve um problema ao registrar alguns dados, mas sua reserva está garantida.'
      }));
    }
  };

  /**
   * Limpa dados temporários do localStorage
   * DRY: Função reutilizável para limpeza
   */
  const cleanupTempData = () => {
    localStorage.removeItem('pendingTravelers');
    localStorage.removeItem('pendingPayment');
    localStorage.removeItem('reservationData');
  };

  /**
   * Navega para uma rota específica
   * KISS: Função simples de navegação
   */
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  /**
   * Renderiza o conteúdo baseado no status atual
   * Clean Code: Separação clara de responsabilidades de rendering
   */
  const renderContent = () => {
    const { status, message, paymentData, errorDetails } = state;

    if (status === 'error') {
      return (
        <>
          <div className="error-icon mb-4">
            <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '4rem' }}></i>
          </div>
          <h2 className="text-warning mb-3">Atenção</h2>
          <Alert variant="warning" className="text-start">
            <Alert.Heading>O que aconteceu?</Alert.Heading>
            <p>{message}</p>
            {errorDetails && (
              <hr />
            )}
            {errorDetails && <small className="text-muted">{errorDetails}</small>}
          </Alert>
          <div className="action-buttons">
            <Button 
              variant="primary" 
              onClick={() => handleNavigation('/my-payments')}
              className="me-3"
            >
              Verificar Pagamentos
            </Button>
            <Button 
              variant="outline-secondary"
              onClick={() => handleNavigation('/')}
            >
              Voltar ao Início
            </Button>
          </div>
        </>
      );
    }

    if (status === 'completed') {
      return (
        <>
          <div className="success-icon mb-4">
            <i className="fas fa-check-circle text-success" style={{ fontSize: '5rem' }}></i>
          </div>
          <h1 className="text-success mb-3">Pagamento Confirmado!</h1>
          <p className="lead mb-4">{message}</p>
          
          {paymentData && (
            <div className="payment-details mb-4">
              <Card className="border-success">
                <Card.Header className="bg-success text-white">
                  <h6 className="mb-0">Detalhes da Transação</h6>
                </Card.Header>
                <Card.Body>
                  <div className="row">
                    <div className="col-sm-6">
                      <strong>Valor:</strong> R$ {paymentData.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="col-sm-6">
                      <strong>Reserva:</strong> #{paymentData.reservationId}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}

          <div className="action-buttons">
            <Button 
              variant="success" 
              size="lg"
              onClick={() => handleNavigation('/my-travels')}
              className="me-3"
            >
              Ver Minhas Viagens
            </Button>
            <Button 
              variant="outline-primary"
              onClick={() => handleNavigation('/')}
            >
              Explorar Mais Destinos
            </Button>
          </div>
        </>
      );
    }

    // Status de loading/processing
    return (
      <>
        <Spinner animation="border" variant="primary" className="mb-4" style={{ width: '3rem', height: '3rem' }} />
        <h2 className="mb-3">
          {status === 'confirming' && 'Confirmando Pagamento'}
          {status === 'saving-travelers' && 'Finalizando Reserva'}
          {status === 'loading' && 'Verificando Pagamento'}
        </h2>
        <p className="lead text-muted">{message}</p>
        <div className="progress mt-4" style={{ height: '8px' }}>
          <div 
            className="progress-bar progress-bar-striped progress-bar-animated" 
            style={{ width: status === 'saving-travelers' ? '75%' : '50%' }}
          ></div>
        </div>
      </>
    );
  };

  return (
    <div className="payment-success-page">
      <Container className="py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <Card className="payment-success-card shadow-lg border-0">
              <Card.Body className="text-center p-5">
                {renderContent()}
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PaymentSuccess;
