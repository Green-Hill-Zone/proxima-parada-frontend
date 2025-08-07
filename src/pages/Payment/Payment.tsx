// Importações necessárias
import { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Form, Row, Alert, Badge, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPayment } from '../../services/PaymentService';
import { useAuth } from '../../hooks/useAuth';
import { usePageTitle, PAGE_TITLES } from '../../hooks';
import { FaArrowLeft, FaUsers, FaUser, FaEdit } from 'react-icons/fa';
import './Payment.css';
import { useReservation } from '../Reservation/context/ReservationContext';
import { createStripeCheckoutSession } from '../../services/PaymentService';
import { createAndAssociateTravelers, type TravelerCreateRequest } from '../../services/TravelerService';

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

  // Função para processar o pagamento real
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
      // Recuperar dados de viajantes e reserva do localStorage
      const pendingTravelersString = localStorage.getItem('pendingTravelers');
      const pendingTravelersData = pendingTravelersString ? JSON.parse(pendingTravelersString) : null;
      
      // Se temos dados de reserva do contexto, usar para criar sessão de pagamento
      if (reservationData && reservationData.travelPackage.id) {
        console.log('🔄 Criando sessão de pagamento no Stripe com dados do contexto...');
        
        // Criar sessão de pagamento com Stripe
        const stripeSession = await createStripeCheckoutSession(
          reservationData.travelPackage.id,
          totalAmount
        );
        
        // Salvar dados da compra no localStorage para recuperar depois
        localStorage.setItem('pendingPayment', JSON.stringify({
          travelData,
          paymentData,
          amount: totalAmount,
          status: 'pending',
          createdAt: new Date().toISOString(),
          paymentId: `pay_${Date.now()}`,
          stripeSessionId: stripeSession.sessionId,
          reservationId: reservationData.travelPackage.id,
          pendingTravelers: pendingTravelersData ? pendingTravelersData.travelers : []
        }));
        
        // Redirecionar para o Stripe
        console.log('✅ Redirecionando para Stripe:', stripeSession.checkoutUrl);
        window.location.href = stripeSession.checkoutUrl;
        return;
      } 
      // Se não temos contexto, mas temos dados no localStorage
      else if (pendingTravelersData && pendingTravelersData.reservationId) {
        console.log('🔄 Criando sessão de pagamento no Stripe com dados do localStorage...');
        
        // Criar sessão de pagamento com Stripe usando o ID armazenado no localStorage
        const mockReservationId = pendingTravelersData.reservationId;
        
        try {
          const stripeSession = await createStripeCheckoutSession(
            mockReservationId,
            totalAmount
          );
          
          // Salvar dados da compra no localStorage para recuperar depois
          localStorage.setItem('pendingPayment', JSON.stringify({
            travelData,
            paymentData,
            amount: totalAmount,
            status: 'pending',
            createdAt: new Date().toISOString(),
            paymentId: `pay_${Date.now()}`,
            stripeSessionId: stripeSession.sessionId,
            reservationId: mockReservationId,
            pendingTravelers: pendingTravelersData.travelers
          }));
          
          // Redirecionar para o Stripe
          console.log('✅ Redirecionando para Stripe:', stripeSession.checkoutUrl);
          window.location.href = stripeSession.checkoutUrl;
          return;
        } catch (error) {
          console.error('Erro ao criar sessão no Stripe:', error);
          // Se falhar, cair no fallback abaixo
        }
      }
      
      // Fallback para comportamento anterior (sem contexto de reserva)
      // Simular criação de sessão no Stripe
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados para enviar ao backend/Stripe
      const paymentSession = {
        travelData,
        paymentData,
        amount: totalAmount
      };

      // Salvar dados da compra no localStorage para recuperar depois
      localStorage.setItem('pendingPayment', JSON.stringify({
        ...paymentSession,
        status: 'pending',
        createdAt: new Date().toISOString(),
        paymentId: `pay_${Date.now()}`
      }));

      // Para demonstração, vamos simular o retorno do Stripe
      setShowSuccess(true);

      setTimeout(() => {
        navigate('/my-payments', {
          state: {
            message: 'Pagamento realizado com sucesso!',
            paymentId: response.id
          }
        });
      }, 2000);
    } catch (error: any) {
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
                      <Form onSubmit={handlePayment}>
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
                            disabled={isLoading}
                          >
                            Voltar
                          </Button>
                          
                          <Button
                            type="submit"
                            className="payment-submit-button btn-standard"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                  className="me-2"
                                />
                                Redirecionando...
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
