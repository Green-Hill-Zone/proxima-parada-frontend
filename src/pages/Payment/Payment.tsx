// Importações necessárias
import { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Form, Row, Alert, Badge, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPayment } from '../../services/PaymentService';
import { 
  CheckoutService, 
  type ReservationCheckoutData, 
  validateCheckoutData,
  validateUserForCheckout,
  createCheckoutRequest,
  type ReservationWithStripeSessionResponse
} from '../../services/CheckoutService';
import { useAuth } from '../../hooks/useAuth';
import { usePageTitle, PAGE_TITLES } from '../../hooks';
import { FaArrowLeft, FaUsers, FaUser } from 'react-icons/fa';
import './Payment.css';
import { useReservation } from '../Reservation/context/ReservationContext';

// Interface para dados do viajante
interface TravelerData {
  id: string;
  fullName: string;
  cpf: string;
  birthDate: string;
  email: string;
  phone: string;
  gender: 'M' | 'F' | 'O' | '';
  passportNumber?: string;
  passportExpiry?: string;
  isMainTraveler: boolean;
}

// Interface para dados do pagamento (simplificada para Stripe)
interface PaymentData {
  fullName: string;
  email: string;
  cpf: string;
}

// Interface para dados da viagem recebidos via state
interface TravelData {
  name: string;
  date: string;
  price: number;
  people: number;
  travelId?: number;
  reservationId?: number;
  totalAmount?: number;
}

// Componente Payment - Tela de Pagamento
const Payment = () => {
  // Define o título da página
  usePageTitle(PAGE_TITLES.PAYMENT);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Dados da viagem recebidos via state
  const { reservationData } = useReservation();
  
  // Dados da viagem e viajantes recebidos via state
  const travelData: TravelData = location.state?.travelData || {
    name: reservationData?.travelPackage.title || "Paris - França",
    date: reservationData?.travelPackage.availableDates[0]?.departureDate || "15/08/2025 - 22/08/2025",
    price: reservationData?.travelPackage.price || 3500.00,
    people: reservationData?.travelers.length || 2,
    totalAmount: reservationData?.totalPrice || 7000.00
  };

  // Carregar dados dos viajantes do localStorage
  const [travelersData, setTravelersData] = useState<TravelerData[]>([]);
  
  useEffect(() => {
    const savedTravelersData = localStorage.getItem('travelersData');
    if (savedTravelersData) {
      try {
        const parsedData = JSON.parse(savedTravelersData);
        setTravelersData(parsedData);
        
        // Preencher dados do pagamento com o viajante principal
        const mainTraveler = parsedData.find((t: TravelerData) => t.isMainTraveler);
        if (mainTraveler) {
          setPaymentData({
            fullName: mainTraveler.fullName,
            email: mainTraveler.email,
            cpf: mainTraveler.cpf
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados dos viajantes:', error);
      }
    }
  }, []);

  /* ===================================================================== */
  /* STRIPE PAYMENT HANDLING - MAIN FUNCTIONALITY                        */
  /* ===================================================================== */

  /**
   * ✅ NOVO: Função principal para lidar com pagamento Stripe
   * Baseada na implementação da pasta FRONT
   */
  const handleStripePayment = async () => {
    // ✅ CLEAN ARCH: 1. Validar usuário logado PRIMEIRO
    const userValidation = validateUserForCheckout(user);
    if (!userValidation.isValid) {
      setError(userValidation.error || 'Erro de validação');
      
      // ✅ KISS: Redirecionar para login se não estiver logado
      if (!user) {
        setTimeout(() => navigate('/login', { 
          state: { returnTo: location.pathname } 
        }), 2000);
      }
      return;
    }

    // 2. Validar dados do pagamento
    if (!paymentData.fullName.trim() || !paymentData.email.trim() || !paymentData.cpf.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // 3. Obter ID do pacote de viagem
    const travelPackageId = getTravelPackageId();
    if (!travelPackageId) {
      setError('ID do pacote de viagem não encontrado');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess('Criando sessão de pagamento...');

    try {
      // ✅ DRY: 4. Usar helper para criar request padronizado
      const request = createCheckoutRequest(
        travelPackageId,
        user,
        travelData.totalAmount ? travelData.totalAmount * 100 : undefined // converter para centavos
      );

      console.log('📋 Dados da requisição Stripe:', request);

      // 5. Criar sessão Stripe (endpoint testado)
      const response = await CheckoutService.createReservationWithStripeSession(request);
      
      setSuccess(`Sessão criada! Reserva: ${response.reservationNumber}`);

      // 6. Salvar dados localmente antes de redirecionar
      savePaymentDataForLater(response);

      // 7. Redirecionar para Stripe Checkout
      setTimeout(() => {
        CheckoutService.redirectToStripeCheckout(response.checkoutUrl);
      }, 1500);

    } catch (error: any) {
      console.error('❌ Erro ao processar pagamento Stripe:', error);
      setError(error.message || 'Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * ✅ HELPER: Obter ID do pacote de viagem de diferentes fontes
   * DRY: Centraliza lógica de obtenção do ID
   */
  const getTravelPackageId = (): number => {
    // Primeiro, tentar do contexto de reserva
    if (reservationData?.travelPackage?.id) {
      return reservationData.travelPackage.id;
    }
    
    // Segundo, tentar dos dados da viagem
    if (travelData.travelId) {
      return travelData.travelId;
    }
    
    // Fallback para teste (deve ser removido em produção)
    console.warn('⚠️ ID do pacote não encontrado, usando fallback');
    return 1;
  };

  /**
   * ✅ HELPER: Salvar dados do pagamento para recuperação posterior
   * CLEAN CODE: Função específica para persistência
   */
  /**
   * ✅ HELPER: Salvar dados do pagamento para recuperação posterior
   * CLEAN CODE: Função específica para persistência
   */
  const savePaymentDataForLater = (response: ReservationWithStripeSessionResponse) => {
    const paymentSession = {
      reservationId: response.reservationId,
      reservationNumber: response.reservationNumber,
      sessionId: response.stripeSessionId,
      amount: response.amount,
      customerData: paymentData,
      travelData,
      timestamp: Date.now()
    };
    
    localStorage.setItem('stripePaymentSession', JSON.stringify(paymentSession));
    console.log('💾 Dados do pagamento salvos localmente');
  };

  /**
   * ✅ LEGACY: Função de pagamento original (manter para compatibilidade)
   */
  const handlePayment = async () => {
    // Validação de dados
    if (!paymentData.fullName.trim() || !paymentData.email.trim() || !paymentData.cpf.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const reservationId = getReservationId();
    if (!reservationId) {
      setError('ID da reserva não encontrado');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Criar dados de checkout para o método legacy
      const checkoutData: ReservationCheckoutData = {
        reservationId,
        customerName: paymentData.fullName,
        customerEmail: paymentData.email,
        totalAmount: travelData.totalAmount || travelData.price * travelData.people,
        successUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
      };

      // Validar dados de checkout
      const validation = validateCheckoutData(checkoutData);
      if (!validation.isValid) {
        setError(`Dados inválidos: ${validation.errors.join(', ')}`);
        return;
      }

      // Criar sessão de checkout no Stripe
      const response = await CheckoutService.createCheckoutSession(checkoutData);
      
      console.log('✅ Sessão criada:', response);
      
      // Salvar dados da sessão
      localStorage.setItem('paymentSession', JSON.stringify({
        sessionId: response.sessionId,
        customerData: paymentData,
        travelData,
        timestamp: Date.now()
      }));

      // Redirecionar para o checkout do Stripe
      window.location.href = response.checkoutUrl;

    } catch (error: any) {
      console.error('❌ Erro no pagamento:', error);
      setError(error.message || 'Erro ao processar pagamento');
    } finally {
      setIsProcessing(false);
    }
  };
    if (reservationData && reservationData.travelPackage.id) {
      return reservationData.travelPackage.id;
    }

    // Segundo, tentar do localStorage de viajantes pendentes
    const pendingTravelersString = localStorage.getItem('pendingTravelers');
    if (pendingTravelersString) {
      const pendingTravelersData = JSON.parse(pendingTravelersString);
      if (pendingTravelersData.reservationId) {
        return pendingTravelersData.reservationId;
      }
    }

    // Terceiro, tentar do travelData
    if (travelData.travelId) {
      return travelData.travelId;
    }

    // Fallback: gerar ID temporário para desenvolvimento
    console.warn('⚠️ ID de reserva não encontrado, usando fallback');
    return Date.now(); // Temporary fallback
  };

  /**
   * Salva dados do pagamento para recuperação posterior
   * Clean Code: Função com responsabilidade específica
   */
  const savePaymentDataForLater = (checkoutData: ReservationCheckoutData, sessionId: string) => {
    // Recuperar dados de viajantes pendentes
    const pendingTravelersString = localStorage.getItem('pendingTravelers');
    const pendingTravelers = pendingTravelersString ? JSON.parse(pendingTravelersString) : null;

    const paymentDataToSave = {
      travelData,
      paymentData,
      checkoutData,
      amount: totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
      paymentId: `pay_${Date.now()}`,
      stripeSessionId: sessionId,
      reservationId: checkoutData.reservationId,
      pendingTravelers: pendingTravelers ? pendingTravelers.travelers || pendingTravelers : []
    };

    localStorage.setItem('pendingPayment', JSON.stringify(paymentDataToSave));
    console.log('💾 Dados do pagamento salvos para recuperação posterior');
  };

  /* ===================================================================== */
  /* PAYMENT PROCESSING & STATES                                          */
  /* ===================================================================== */

  // Estados do formulário (simplificado para Stripe)
  const [paymentData, setPaymentData] = useState<PaymentData>({
    fullName: '',
    email: '',
    cpf: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<PaymentData>>({});
  const [editingPaymentInfo, setEditingPaymentInfo] = useState(false);

  // ✅ NOVOS Estados para integração Stripe
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /* ===================================================================== */
  /* HELPER FUNCTIONS - CLEAN CODE & DRY                                  */
  /* ===================================================================== */

  /**
   * Obtém o ID da reserva de diferentes fontes
   * DRY: Centraliza lógica de obtenção do ID
   */
  const getReservationId = (): number => {
    // Primeiro, tentar do contexto de reserva
    if (reservationData && reservationData.travelPackage.id) {
      return reservationData.travelPackage.id;
    }

    // Segundo, tentar do localStorage de viajantes pendentes
    const pendingTravelersString = localStorage.getItem('pendingTravelers');
    if (pendingTravelersString) {
      const pendingTravelersData = JSON.parse(pendingTravelersString);
      if (pendingTravelersData.reservationId) {
        return pendingTravelersData.reservationId;
      }
    }

    // Terceiro, tentar do travelData
    if (travelData.travelId) {
      return travelData.travelId;
    }

    // Fallback: gerar ID temporário para desenvolvimento
    console.warn('⚠️ ID de reserva não encontrado, usando fallback');
    return Date.now(); // Temporary fallback
  };

  // Função para formatar CPF
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  // Função para lidar com mudanças nos inputs
  const handleInputChange = (field: keyof PaymentData, value: string) => {
    let formattedValue = value;

    // Aplicar formatação específica apenas para CPF
    if (field === 'cpf') {
      formattedValue = formatCPF(value);
    }

    setPaymentData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validação dos campos (simplificada para Stripe)
  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentData> = {};

    if (!paymentData.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }

    if (!paymentData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(paymentData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!paymentData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (paymentData.cpf.replace(/\D/g, '').length !== 11) {
      newErrors.cpf = 'CPF deve ter 11 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para processar o pagamento usando o novo CheckoutService
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user) {
      alert('Usuário não autenticado. Faça login para prosseguir.');
      navigate('/login');
      return;
    }

    if (!travelData.travelId) {
      alert('ID do pacote de viagem não encontrado.');
      return;
    }

    setIsLoading(true);

    try {
      // Preparar dados para checkout usando o padrão Clean Architecture
      const checkoutData: ReservationCheckoutData = {
        reservationId: getReservationId(), // Helper para obter ID da reserva
        amount: totalAmount,
        customerEmail: paymentData.email,
        customerName: paymentData.fullName,
        description: `Pagamento para ${travelData.name} - ${travelData.people} pessoa(s)`
      };

      // Validar dados antes do processamento (KISS)
      if (!validateCheckoutData(checkoutData)) {
        throw new Error('Dados de checkout inválidos');
      }

      console.log('🔄 Iniciando processo de checkout...', checkoutData);

      // Criar sessão de checkout usando o CheckoutService
      const stripeSession = await CheckoutService.createCheckoutSession(checkoutData);

      // Salvar dados temporários para recuperação pós-pagamento (Shadow Properties)
      savePaymentDataForLater(checkoutData, stripeSession.sessionId);

      // Redirecionar para o Stripe (Delegation Pattern)
      console.log('✅ Redirecionando para Stripe Checkout...');
      CheckoutService.redirectToCheckout(stripeSession.checkoutUrl);

    } catch (error: any) {
      console.error('❌ Erro no processo de checkout:', error);
      setShowSuccess(false);
      alert(error?.message || 'Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular total (usar totalAmount se disponível, senão calcular)
  const totalAmount = travelData.totalAmount || (travelData.price * travelData.people);

  // Função para voltar à página anterior
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <main className="payment-main">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              {/* Título da página */}
              <div className="payment-header">
                <Button 
                  variant="outline-secondary" 
                  onClick={handleGoBack}
                  className="mb-3 d-flex align-items-center gap-2"
                >
                  <FaArrowLeft /> Voltar
                </Button>
                <h1>Finalizar Pagamento</h1>
                <p className="lead">Complete os dados para confirmar sua viagem</p>
              </div>

              {/* Alert de sucesso */}
              {showSuccess && (
                <Alert variant="info" className="payment-success-alert">
                  <Alert.Heading>🔄 Redirecionando para pagamento...</Alert.Heading>
                  <p>Você será redirecionado para concluir o pagamento de forma segura.</p>
                </Alert>
              )}

              <Row>
                {/* Resumo do Pedido */}
                <Col lg={4} className="mb-4">
                  <Card className="payment-summary-card">
                    <Card.Header>
                      <h5 className="mb-0">Resumo do Pedido</h5>
                    </Card.Header>
                    <Card.Body>
                      <div className="payment-summary-item">
                        <strong>Destino:</strong>
                        <span>{travelData.name}</span>
                      </div>
                      
                      <div className="payment-summary-item">
                        <strong>Período:</strong>
                        <span>{travelData.date}</span>
                      </div>
                      
                      <div className="payment-summary-item">
                        <strong>Pessoas:</strong>
                        <span>{travelData.people} {travelData.people === 1 ? 'pessoa' : 'pessoas'}</span>
                      </div>
                      
                      <div className="payment-summary-item">
                        <strong>Valor por pessoa:</strong>
                        <span>R$ {travelData.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>

                      <div className="payment-summary-total">
                        <strong>Total:</strong>
                        <strong>R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                      </div>
                    </Card.Body>
                  </Card>

                  {/* Card com dados dos viajantes */}
                  {travelersData.length > 0 && (
                    <Card className="payment-summary-card mt-3">
                      <Card.Header className="d-flex align-items-center gap-2">
                        <FaUsers />
                        <h6 className="mb-0">Viajantes</h6>
                      </Card.Header>
                      <Card.Body className="p-2">
                        {travelersData.map((traveler, index) => (
                          <div key={traveler.id} className="d-flex align-items-center gap-2 p-2 border-bottom">
                            <div className="flex-shrink-0">
                              {traveler.isMainTraveler ? <FaUser className="text-primary" /> : <FaUsers className="text-secondary" />}
                            </div>
                            <div className="flex-grow-1">
                              <div className="fw-semibold small">{traveler.fullName}</div>
                              <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                {traveler.isMainTraveler ? 'Principal' : `Viajante ${index + 1}`}
                              </div>
                            </div>
                            <Badge bg={traveler.isMainTraveler ? 'primary' : 'secondary'} className="small">
                              {new Date().getFullYear() - new Date(traveler.birthDate).getFullYear() < 18 ? 'Menor' : 'Adulto'}
                            </Badge>
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
                  )}
                </Col>

                {/* Formulário de Pagamento */}
                <Col lg={8}>
                  <Card className="payment-form-card">
                    <Card.Header>
                      <h5 className="mb-0">Dados do Pagamento</h5>
                    </Card.Header>
                    <Card.Body>
                      <Form onSubmit={(e) => { e.preventDefault(); handleStripePayment(); }}>
                        
                        {/* ✅ Alertas de Sucesso e Erro */}
                        {error && (
                          <Alert variant="danger" className="mb-3">
                            <strong>❌ Erro:</strong> {error}
                          </Alert>
                        )}
                        
                        {success && (
                          <Alert variant="success" className="mb-3">
                            <strong>✅ Sucesso:</strong> {success}
                          </Alert>
                        )}
                        {/* Dados Pessoais */}
                        <div className="payment-section">
                          <h6 className="payment-section-title d-flex justify-content-between align-items-center">
                            <span>Dados Pessoais</span>
                            {travelersData.length > 0 && (
                              <Button 
                                variant="link" 
                                size="sm" 
                                className="p-0 text-decoration-none"
                                onClick={() => setEditingPaymentInfo(!editingPaymentInfo)}
                              >
                                {editingPaymentInfo ? 'Cancelar edição' : 'Editar'}
                              </Button>
                            )}
                          </h6>
                          
                          {!editingPaymentInfo && travelersData.length > 0 ? (
                            <div className="border rounded p-3 mb-3">
                              <p className="mb-1"><strong>Nome:</strong> {paymentData.fullName}</p>
                              <p className="mb-1"><strong>E-mail:</strong> {paymentData.email}</p>
                              <p className="mb-0"><strong>CPF:</strong> {paymentData.cpf}</p>
                              <div className="mt-2">
                                <Badge bg="success">✓ Dados importados do viajante principal</Badge>
                              </div>
                            </div>
                          ) : (
                            <>
                              <Row>
                                <Col md={6} className="mb-3">
                                  <Form.Group>
                                    <Form.Label>Nome Completo *</Form.Label>
                                    <Form.Control
                                      type="text"
                                      value={paymentData.fullName}
                                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                                      isInvalid={!!errors.fullName}
                                      placeholder="Digite seu nome completo"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.fullName}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                
                                <Col md={6} className="mb-3">
                                  <Form.Group>
                                    <Form.Label>E-mail *</Form.Label>
                                    <Form.Control
                                      type="email"
                                      value={paymentData.email}
                                      onChange={(e) => handleInputChange('email', e.target.value)}
                                      isInvalid={!!errors.email}
                                      placeholder="Digite seu e-mail"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.email}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                              </Row>
                              
                              <Row>
                                <Col md={6} className="mb-3">
                                  <Form.Group>
                                    <Form.Label>CPF *</Form.Label>
                                    <Form.Control
                                      type="text"
                                      value={paymentData.cpf}
                                      onChange={(e) => handleInputChange('cpf', e.target.value)}
                                      isInvalid={!!errors.cpf}
                                      placeholder="000.000.000-00"
                                      maxLength={14}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.cpf}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                              </Row>
                            </>
                          )}
                        </div>

                        {/* Seção de Pagamento via Stripe */}
                        <div className="payment-section">
                          <h6 className="payment-section-title">Pagamento</h6>
                          <p className="text-muted mb-0">
                            Você será redirecionado para o Stripe para finalizar o pagamento de forma segura.
                          </p>
                        </div>

                        {/* Botões de ação */}
                        <div className="payment-actions">
                          <Button
                            variant="outline-secondary"
                            onClick={() => navigate('/reservation')}
                            className="payment-back-button"
                            disabled={isProcessing}
                          >
                            Voltar
                          </Button>
                          
                          <Button
                            type="submit"
                            className="payment-submit-button btn-standard"
                            disabled={isProcessing}
                          >
                            {isProcessing ? (
                              <>
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                  className="me-2"
                                />
                                Processando...
                              </>
                            ) : (
                              'Pagar com Stripe'
                            )}
                          </Button>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
};

export default Payment;
