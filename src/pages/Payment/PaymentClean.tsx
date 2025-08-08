/* ===================================================================== */
/* PAYMENT COMPONENT - CLEAN ARCHITECTURE                              */
/* ===================================================================== */
/*
 * Implementação seguindo os princípios:
 * - Clean Architecture: Separação clara de responsabilidades
 * - KISS: Interface simples com campos essenciais
 * - DRY: Reutilização de componentes e validações
 * - YAGNI: Apenas funcionalidades necessárias
 * - Shadow Properties: Compatível com EF Core
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Button, Card, Col, Container, Form, Row, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckoutService, 
  validateUserForCheckout,
  createCheckoutRequest,
  type ReservationWithStripeSessionResponse 
} from '../../services/CheckoutService';
import { useAuth } from '../../hooks/useAuth';
import { usePageTitle, PAGE_TITLES } from '../../hooks';

/* ===================================================================== */
/* INTERFACES & TYPES - MINIMALISTAS                                   */
/* ===================================================================== */

// ✅ Dados da viagem (alinhados com TravelPackage do backend)
interface TravelData {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// ✅ Dados do cliente (alinhados com CreateCheckoutSessionDto)
interface CustomerData {
  name: string;
  email: string;
}

// ✅ Estado do componente (KISS)
interface PaymentState {
  customerData: CustomerData;
  travelData: TravelData;
  isLoading: boolean;
  errors: Partial<CustomerData>;
  successMessage: string;
  errorMessage: string;
}

/* ===================================================================== */
/* VALIDATION LOGIC - DRY PRINCIPLE                                     */
/* ===================================================================== */

const validateCustomerData = (data: CustomerData): Partial<CustomerData> => {
  const errors: Partial<CustomerData> = {};

  // Validar nome (obrigatório no backend)
  if (!data.name.trim()) {
    errors.name = 'Nome é obrigatório';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Nome deve ter pelo menos 2 caracteres';
  }

  // Validar email (obrigatório no backend)
  if (!data.email.trim()) {
    errors.email = 'E-mail é obrigatório';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'E-mail inválido';
  }

  return errors;
};

/* ===================================================================== */
/* MAIN COMPONENT - PAYMENT CLEAN                                      */
/* ===================================================================== */

// Componente principal Payment - limpo e otimizado
const Payment: React.FC = () => {
  usePageTitle(PAGE_TITLES.PAYMENT);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // ✅ CLEAN ARCH: Integração com AuthContext
  const { user } = useAuth();
  
  // ✅ Dados iniciais da viagem (com fallback para teste)
  const initialTravelData: TravelData = location.state?.travelData || {
    id: 1,
    name: "🗼 Paris Romântico - 7 dias",
    price: 2499.90,
    quantity: 2
  };

  // ✅ Estado do componente centralizado
  const [state, setState] = useState<PaymentState>({
    customerData: {
      name: '',
      email: ''
    },
    travelData: initialTravelData,
    isLoading: false,
    errors: {},
    successMessage: '',
    errorMessage: ''
  });

  /* ===================================================================== */
  /* EFFECTS - AUTO-PREENCHIMENTO COM DADOS DO USUÁRIO                   */
  /* ===================================================================== */
  
  // ✅ CLEAN ARCH: Auto-preencher dados do usuário logado
  useEffect(() => {
    if (user?.name && user?.email) {
      setState(prev => ({
        ...prev,
        customerData: {
          // ✅ DRY: só preenche se vazio, permite override manual
          name: prev.customerData.name || user.name,
          email: prev.customerData.email || user.email
        }
      }));
    }
  }, [user]);

  /* ===================================================================== */
  /* EVENT HANDLERS - SINGLE RESPONSIBILITY                               */
  /* ===================================================================== */

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setState(prev => ({
      ...prev,
      customerData: {
        ...prev.customerData,
        [name]: value
      },
      errors: {
        ...prev.errors,
        [name]: '' // Limpar erro quando usuário digita
      },
      errorMessage: ''
    }));
  }, []);

  const handleQuantityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const quantity = parseInt(e.target.value);
    
    setState(prev => ({
      ...prev,
      travelData: {
        ...prev.travelData,
        quantity
      }
    }));
  }, []);

  /* ===================================================================== */
  /* CHECKOUT PROCESSING - CLEAN ARCHITECTURE                            */
  /* ===================================================================== */

  const handleStripePayment = useCallback(async () => {
    // ✅ CLEAN ARCH: 1. Validar usuário logado PRIMEIRO
    const userValidation = validateUserForCheckout(user);
    if (!userValidation.isValid) {
      setState(prev => ({
        ...prev,
        errorMessage: userValidation.error || 'Erro de validação'
      }));
      
      // ✅ KISS: Redirecionar para login se não estiver logado
      if (!user) {
        setTimeout(() => navigate('/login', { 
          state: { returnTo: location.pathname } 
        }), 2000);
      }
      return;
    }
    
    // 2. Validar dados do formulário
    const errors = validateCustomerData(state.customerData);
    
    if (Object.keys(errors).length > 0) {
      setState(prev => ({
        ...prev,
        errors,
        errorMessage: 'Por favor, corrija os erros no formulário'
      }));
      return;
    }

    // ✅ DRY: 3. Usar helper para criar request padronizado
    const request = createCheckoutRequest(
      state.travelData.id,
      user,
      state.travelData.price * state.travelData.quantity * 100 // converter para centavos
    );

    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      errorMessage: '',
      successMessage: 'Criando sessão de pagamento...'
    }));

    try {
      // 3. Criar sessão Stripe (endpoint testado)
      const response: ReservationWithStripeSessionResponse = await CheckoutService.createReservationWithStripeSession(request);
      
      setState(prev => ({ 
        ...prev, 
        successMessage: `Sessão criada! Reserva: ${response.reservationNumber}`
      }));

      // 4. Redirecionar para Stripe Checkout
      setTimeout(() => {
        CheckoutService.redirectToStripeCheckout(response.checkoutUrl);
      }, 1000);

    } catch (error) {
      console.error('Erro no checkout:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        errorMessage: error instanceof Error ? error.message : 'Erro ao processar pagamento. Tente novamente.',
        successMessage: ''
      }));
    }
  }, [state.customerData, state.travelData, user, navigate, location.pathname]);

  /* ===================================================================== */
  /* RENDER - CLEAN UI                                                    */
  /* ===================================================================== */

  const totalAmount = state.travelData.price * state.travelData.quantity;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">💳 Pagamento - Próxima Parada</h4>
            </Card.Header>
            
            <Card.Body>
              {/* ✅ Resumo da Viagem */}
              <div className="mb-4 p-3 bg-light rounded">
                <h6 className="text-primary mb-2">📋 Resumo da Compra</h6>
                <div className="d-flex justify-content-between mb-1">
                  <span>{state.travelData.name}</span>
                  <strong>R$ {state.travelData.price.toFixed(2)}</strong>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Quantidade de pessoas:</span>
                  <span>{state.travelData.quantity}</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong className="text-success">R$ {totalAmount.toFixed(2)}</strong>
                </div>
              </div>

              {/* ✅ Alertas */}
              {state.errorMessage && (
                <Alert variant="danger" className="mb-3">
                  ❌ {state.errorMessage}
                </Alert>
              )}
              
              {state.successMessage && (
                <Alert variant="success" className="mb-3">
                  ✅ {state.successMessage}
                </Alert>
              )}

              {/* ✅ Formulário de Dados do Cliente */}
              <Form onSubmit={(e) => { e.preventDefault(); handleStripePayment(); }}>
                <h6 className="text-primary mb-3">👤 Dados do Responsável</h6>
                
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Nome Completo *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={state.customerData.name}
                        onChange={handleInputChange}
                        isInvalid={!!state.errors.name}
                        disabled={state.isLoading}
                        placeholder="Digite seu nome completo"
                      />
                      <Form.Control.Feedback type="invalid">
                        {state.errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>E-mail *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={state.customerData.email}
                        onChange={handleInputChange}
                        isInvalid={!!state.errors.email}
                        disabled={state.isLoading}
                        placeholder="Digite seu e-mail"
                      />
                      <Form.Control.Feedback type="invalid">
                        {state.errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Quantidade de Pessoas</Form.Label>
                      <Form.Select 
                        value={state.travelData.quantity} 
                        onChange={handleQuantityChange}
                        disabled={state.isLoading}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'pessoa' : 'pessoas'}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {/* ✅ Botões de Ação */}
                <div className="d-flex gap-2 mt-4">
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate(-1)}
                    disabled={state.isLoading}
                    className="flex-fill"
                  >
                    ← Voltar
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="success"
                    disabled={state.isLoading}
                    className="flex-fill"
                  >
                    {state.isLoading ? (
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
                      '💳 Pagar com Stripe'
                    )}
                  </Button>
                </div>
              </Form>

              {/* ✅ Informações de Segurança */}
              <div className="mt-4 text-center text-muted small">
                <p className="mb-1">🔒 Pagamento seguro processado pelo Stripe</p>
                <p className="mb-0">Seus dados estão protegidos com criptografia SSL</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Payment;
