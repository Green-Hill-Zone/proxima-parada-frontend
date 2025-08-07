import React, { useState, useRef } from 'react';
import { Button, Card, Col, Container, Form, Row, ButtonGroup } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckoutService, { type PaymentMethod, type TravelData } from '../../services/CheckoutService';
import './PaymentPage.css';

interface PaymentData {
  fullName: string;
  email: string;
  cpf: string;
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasSubmitted = useRef(false);
  
  const travelData: TravelData = location.state?.travelData || {
    name: "Paris - França",
    date: "15/08/2025 - 22/08/2025",
    price: 3500.00,
    people: 2,
    packageId: 1
  };

  const [paymentData, setPaymentData] = useState<PaymentData>({
    fullName: '',
    email: '',
    cpf: ''
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('card');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<PaymentData>>({});

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cpf') {
      setPaymentData(prev => ({
        ...prev,
        [name]: formatCPF(value)
      }));
    } else {
      setPaymentData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name as keyof PaymentData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

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
    } else if (paymentData.cpf.length !== 14) {
      newErrors.cpf = 'CPF deve ter 11 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ PREVENIR DUPLA SUBMISSÃO COM useRef
    if (hasSubmitted.current) {
      console.log('⚠️ Submissão já em andamento, ignorando...');
      return;
    }

    if (!validateForm()) {
      return;
    }

    hasSubmitted.current = true;
    setIsLoading(true);

    try {
      // ✅ REAL INTEGRATION: Criar sessão de checkout real
      console.log('🚀 Iniciando checkout real com backend...');
      
      const checkoutRequest = {
        packageId: travelData.packageId || 1,
        customerName: paymentData.fullName,
        customerEmail: paymentData.email,
        quantity: travelData.people,
        packageName: travelData.name
      };

      console.log('📋 Request para checkout:', checkoutRequest);
      
      const response = await CheckoutService.createStripeSession(checkoutRequest);
      
      console.log('✅ Sessão criada:', response);
      
      // ✅ CLEAN ARCHITECTURE: Redirecionar para Stripe real
      CheckoutService.redirectToStripeCheckout(response.checkoutUrl);

    } catch (error) {
      console.error('❌ Erro no pagamento real:', error);
      hasSubmitted.current = false;
      setIsLoading(false);
      
      // Em caso de erro, navegar para página de cancelamento
      navigate('/payment/cancel', {
        state: {
          error: 'Erro no processamento do pagamento',
          customerData: paymentData,
          travelData
        }
      });
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <>
      <main className="payment-page">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <Row>
                {/* Resumo da Viagem */}
                <Col lg={4}>
                  <Card className="travel-summary-card">
                    <Card.Header>
                      <h5 className="mb-0">
                        <i className="fas fa-plane me-2"></i>
                        Resumo da Viagem
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <div className="travel-info">
                        <h6 className="travel-name">{travelData.name}</h6>
                        <p className="travel-date">
                          <i className="fas fa-calendar me-2"></i>
                          {travelData.date}
                        </p>
                        <p className="travel-people">
                          <i className="fas fa-users me-2"></i>
                          {travelData.people} {travelData.people === 1 ? 'pessoa' : 'pessoas'}
                        </p>
                        
                        <hr />
                        
                        <div className="price-breakdown">
                          <div className="price-item">
                            <span>Valor por pessoa:</span>
                            <span>{formatCurrency(travelData.price)}</span>
                          </div>
                          <div className="price-item">
                            <span>Quantidade:</span>
                            <span>{travelData.people}</span>
                          </div>
                          <hr />
                          <div className="price-item total">
                            <span><strong>Total:</strong></span>
                            <span><strong>{formatCurrency(travelData.price * travelData.people)}</strong></span>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Formulário de Pagamento */}
                <Col lg={8}>
                  <Card className="payment-form-card">
                    <Card.Header>
                      <h5 className="mb-0">
                        <i className="fas fa-credit-card me-2"></i>
                        Dados do Pagamento
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <Form onSubmit={handleSubmit}>
                        {/* Dados Pessoais */}
                        <div className="form-section">
                          <h6 className="section-title">Dados Pessoais</h6>
                          
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Nome Completo *</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="fullName"
                                  value={paymentData.fullName}
                                  onChange={handleInputChange}
                                  isInvalid={!!errors.fullName}
                                  placeholder="Digite seu nome completo"
                                  disabled={isLoading}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.fullName}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>E-mail *</Form.Label>
                                <Form.Control
                                  type="email"
                                  name="email"
                                  value={paymentData.email}
                                  onChange={handleInputChange}
                                  isInvalid={!!errors.email}
                                  placeholder="seu@email.com"
                                  disabled={isLoading}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.email}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>CPF *</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="cpf"
                                  value={paymentData.cpf}
                                  onChange={handleInputChange}
                                  isInvalid={!!errors.cpf}
                                  placeholder="000.000.000-00"
                                  maxLength={14}
                                  disabled={isLoading}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.cpf}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                          </Row>
                        </div>

                        {/* Método de Pagamento */}
                        <div className="form-section">
                          <h6 className="section-title">Método de Pagamento</h6>
                          
                          <ButtonGroup className="payment-methods-group mb-3">
                            <Button
                              variant={selectedPaymentMethod === 'card' ? 'primary' : 'outline-primary'}
                              onClick={() => setSelectedPaymentMethod('card')}
                              disabled={isLoading}
                              className="payment-method-btn"
                            >
                              <i className="fas fa-credit-card me-2"></i>
                              Cartão de Crédito
                            </Button>
                            <Button
                              variant={selectedPaymentMethod === 'pix' ? 'primary' : 'outline-primary'}
                              onClick={() => setSelectedPaymentMethod('pix')}
                              disabled={isLoading}
                              className="payment-method-btn"
                            >
                              <i className="fas fa-mobile-alt me-2"></i>
                              PIX
                            </Button>
                            <Button
                              variant={selectedPaymentMethod === 'boleto' ? 'primary' : 'outline-primary'}
                              onClick={() => setSelectedPaymentMethod('boleto')}
                              disabled={isLoading}
                              className="payment-method-btn"
                            >
                              <i className="fas fa-barcode me-2"></i>
                              Boleto
                            </Button>
                          </ButtonGroup>

                          {/* Campos específicos para cartão */}
                          {selectedPaymentMethod === 'card' && (
                            <div className="card-fields">
                              <Row>
                                <Col md={8}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Número do Cartão</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="1234 5678 9012 3456"
                                      disabled={isLoading}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={4}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>CVV</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="123"
                                      maxLength={3}
                                      disabled={isLoading}
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                              <Row>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Validade</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="MM/AA"
                                      disabled={isLoading}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Nome no Cartão</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Nome como no cartão"
                                      disabled={isLoading}
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                            </div>
                          )}

                          {/* Informações para PIX */}
                          {selectedPaymentMethod === 'pix' && (
                            <div className="pix-info">
                              <div className="alert alert-info">
                                <i className="fas fa-info-circle me-2"></i>
                                Após confirmar, você receberá o QR Code para pagamento via PIX.
                              </div>
                            </div>
                          )}

                          {/* Informações para Boleto */}
                          {selectedPaymentMethod === 'boleto' && (
                            <div className="boleto-info">
                              <div className="alert alert-warning">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                O boleto será gerado e você poderá pagá-lo em qualquer banco.
                                <br />
                                <small>Prazo de vencimento: 3 dias úteis</small>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Botão de Submissão */}
                        <div className="form-actions">
                          <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            disabled={isLoading}
                            className="submit-payment-btn"
                          >
                            {isLoading ? (
                              <>
                                <i className="fas fa-spinner fa-spin me-2"></i>
                                Processando...
                              </>
                            ) : (
                              <>
                                {selectedPaymentMethod === 'card' && '💳 Pagar com Cartão'}
                                {selectedPaymentMethod === 'pix' && '📱 Pagar com PIX'}
                                {selectedPaymentMethod === 'boleto' && '🏦 Gerar Boleto'}
                              </>
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

export default PaymentPage;
