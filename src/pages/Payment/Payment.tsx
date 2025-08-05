// Importações necessárias
import { useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPayment } from '../../services/PaymentService';
import { useAuth } from '../../hooks/useAuth';
import './Payment.css';

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
}

// Componente Payment - Tela de Pagamento
const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Dados da viagem recebidos via state
  const travelData: TravelData = location.state?.travelData || {
    name: "Paris - França",
    date: "15/08/2025 - 22/08/2025",
    price: 3500.00,
    people: 2,
    travelId: undefined,
    reservationId: undefined
  };

  // Estados do formulário (simplificado para Stripe)
  const [paymentData, setPaymentData] = useState<PaymentData>({
    fullName: '',
    email: '',
    cpf: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<PaymentData>>({});

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
    setErrors({});
    setShowSuccess(false);

    try {
      const paymentRequest = {
        userId: Number(user.id),
        travelId: travelData.travelId,
        reservationId: travelData.reservationId,
        amount: totalAmount,
        fullName: paymentData.fullName,
        email: paymentData.email,
        cpf: paymentData.cpf,
        paymentMethod: 'stripe' as const,
        status: 'pending' as const
      };

      const response = await createPayment(paymentRequest);

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

  // Calcular total
  const totalAmount = travelData.price * travelData.people;

  return (
    <>
      <main className="payment-main">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              {/* Título da página */}
              <div className="payment-header">
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
                          <h6 className="payment-section-title">Dados Pessoais</h6>
                          
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
                                <span className="spinner-border spinner-border-sm me-2" />
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
