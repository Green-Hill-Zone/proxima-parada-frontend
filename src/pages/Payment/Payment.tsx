// Importações necessárias
import { useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import './Payment.css';

// Interface para dados do pagamento
interface PaymentData {
  fullName: string;
  email: string;
  cpf: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  installments: string;
}

// Interface para dados da viagem (recebidos via props/state)
interface TravelData {
  name: string;
  date: string;
  price: number;
  people: number;
}

// Componente Payment - Tela de Pagamento
const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Dados da viagem (normalmente viriams via props ou state)
  const travelData: TravelData = location.state?.travelData || {
    name: "Paris - França",
    date: "15/08/2025 - 22/08/2025",
    price: 3500.00,
    people: 2
  };

  // Estados do formulário
  const [paymentData, setPaymentData] = useState<PaymentData>({
    fullName: '',
    email: '',
    cpf: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    installments: '1'
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

  // Função para formatar número do cartão
  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})\d+?$/, '$1');
  };

  // Função para formatar data de validade
  const formatExpiryDate = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2}\/\d{2})\d+?$/, '$1');
  };

  // Função para lidar com mudanças nos inputs
  const handleInputChange = (field: keyof PaymentData, value: string) => {
    let formattedValue = value;

    // Aplicar formatação específica
    switch (field) {
      case 'cpf':
        formattedValue = formatCPF(value);
        break;
      case 'cardNumber':
        formattedValue = formatCardNumber(value);
        break;
      case 'expiryDate':
        formattedValue = formatExpiryDate(value);
        break;
      case 'cvv':
        formattedValue = value.replace(/\D/g, '').slice(0, 4);
        break;
    }

    setPaymentData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validação dos campos
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

    if (!paymentData.cardNumber.trim()) {
      newErrors.cardNumber = 'Número do cartão é obrigatório';
    } else if (paymentData.cardNumber.replace(/\D/g, '').length !== 16) {
      newErrors.cardNumber = 'Número do cartão deve ter 16 dígitos';
    }

    if (!paymentData.expiryDate.trim()) {
      newErrors.expiryDate = 'Data de validade é obrigatória';
    } else if (!/\d{2}\/\d{2}/.test(paymentData.expiryDate)) {
      newErrors.expiryDate = 'Formato inválido (MM/AA)';
    }

    if (!paymentData.cvv.trim()) {
      newErrors.cvv = 'CVV é obrigatório';
    } else if (paymentData.cvv.length < 3) {
      newErrors.cvv = 'CVV deve ter 3 ou 4 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para processar o pagamento
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simular processamento do pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccess(true);
      
      // Redirecionar após sucesso
      setTimeout(() => {
        navigate('/dashboard', { 
          state: { 
            message: 'Pagamento realizado com sucesso! Sua viagem foi confirmada.' 
          }
        });
      }, 3000);
      
    } catch (error) {
      console.error('Erro no pagamento:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular total com base no parcelamento
  const totalAmount = travelData.price * travelData.people;
  const installmentValue = totalAmount / parseInt(paymentData.installments);

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
                <Alert variant="success" className="payment-success-alert">
                  <Alert.Heading>🎉 Pagamento realizado com sucesso!</Alert.Heading>
                  <p>Sua viagem foi confirmada. Você receberá um e-mail com todos os detalhes.</p>
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

                      <hr />
                      
                      <div className="payment-summary-total">
                        <strong>Total:</strong>
                        <strong>R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                      </div>

                      {parseInt(paymentData.installments) > 1 && (
                        <div className="payment-installment-info">
                          <small>
                            {paymentData.installments}x de R$ {installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </small>
                        </div>
                      )}
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

                        {/* Dados do Cartão */}
                        <div className="payment-section">
                          <h6 className="payment-section-title">Dados do Cartão</h6>
                          
                          <Row>
                            <Col md={8} className="mb-3">
                              <Form.Group>
                                <Form.Label>Número do Cartão *</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={paymentData.cardNumber}
                                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                                  isInvalid={!!errors.cardNumber}
                                  placeholder="0000 0000 0000 0000"
                                  maxLength={19}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.cardNumber}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            
                            <Col md={4} className="mb-3">
                              <Form.Group>
                                <Form.Label>CVV *</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={paymentData.cvv}
                                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                                  isInvalid={!!errors.cvv}
                                  placeholder="000"
                                  maxLength={4}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.cvv}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <Row>
                            <Col md={6} className="mb-3">
                              <Form.Group>
                                <Form.Label>Validade *</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={paymentData.expiryDate}
                                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                                  isInvalid={!!errors.expiryDate}
                                  placeholder="MM/AA"
                                  maxLength={5}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.expiryDate}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            
                            <Col md={6} className="mb-3">
                              <Form.Group>
                                <Form.Label>Parcelamento</Form.Label>
                                <Form.Select
                                  value={paymentData.installments}
                                  onChange={(e) => handleInputChange('installments', e.target.value)}
                                >
                                  {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                                    <option key={num} value={num.toString()}>
                                      {num}x {num === 1 ? 'à vista' : `de R$ ${(totalAmount / num).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                            </Col>
                          </Row>
                        </div>

                        {/* Botões de ação */}
                        <div className="payment-actions">
                          <Button
                            variant="outline-secondary"
                            onClick={() => navigate(-1)}
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
                                Processando...
                              </>
                            ) : (
                              'Confirmar Pagamento'
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
