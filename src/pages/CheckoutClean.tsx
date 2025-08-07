/* ===================================================================== */
/* CHECKOUT LIMPO - ALINHADO COM BACKEND TESTADO                       */
/* ===================================================================== */
/*
 * Implementação seguindo os princípios:
 * - Clean Architecture: Separação clara de responsabilidades
 * - KISS: Interface simples com campos essenciais
 * - DRY: Reutilização de componentes e validações
 * - YAGNI: Apenas funcionalidades necessárias
 * - Shadow Properties: Compatível com EF Core
 */

import React, { useState, useCallback } from 'react';
import { Button, Card, Col, Container, Form, Row, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckoutService, { 
  formatCurrency, 
  type CreateStripeSessionRequest,
  type StripeSessionResponse 
} from '../services/CheckoutService';

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
interface CheckoutState {
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
/* MAIN COMPONENT - CHECKOUT LIMPO                                     */
/* ===================================================================== */

const CheckoutClean: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ✅ Dados iniciais da viagem (com fallback para teste)
  const initialTravelData: TravelData = location.state?.travelData || {
    id: 1,
    name: "🗼 Paris Romântico - 7 dias",
    price: 2499.90,
    quantity: 2
  };

  // ✅ Estado do componente centralizado
  const [state, setState] = useState<CheckoutState>({
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

  const handleCheckout = useCallback(async () => {
    // 1. Validar dados
    const errors = validateCustomerData(state.customerData);
    
    if (Object.keys(errors).length > 0) {
      setState(prev => ({
        ...prev,
        errors,
        errorMessage: 'Por favor, corrija os erros no formulário'
      }));
      return;
    }

    // 2. Preparar requisição (alinhada com backend testado)
    const request: CreateStripeSessionRequest = {
      packageId: state.travelData.id,
      customerName: state.customerData.name,
      customerEmail: state.customerData.email,
      quantity: state.travelData.quantity,
      customPrice: state.travelData.price,
      packageName: state.travelData.name
    };

    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      errorMessage: '',
      successMessage: 'Criando sessão de pagamento...'
    }));

    try {
      // 3. Criar sessão Stripe (endpoint testado)
      const response: StripeSessionResponse = await CheckoutService.createStripeSession(request);
      
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
        errorMessage: 'Erro ao processar pagamento. Tente novamente.',
        successMessage: ''
      }));
    }
  }, [state.customerData, state.travelData]);

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
              <h4 className="mb-0">💳 Checkout - Próxima Parada</h4>
            </Card.Header>
            
            <Card.Body>
              {/* ✅ Resumo da Viagem */}
              <div className="mb-4 p-3 bg-light rounded">
                <h5 className="text-primary mb-3">📋 Resumo da Viagem</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span><strong>Pacote:</strong></span>
                  <span>{state.travelData.name}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span><strong>Preço por pessoa:</strong></span>
                  <span>{formatCurrency(state.travelData.price)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span><strong>Quantidade:</strong></span>
                  <Form.Select 
                    size="sm" 
                    style={{ width: '80px' }}
                    value={state.travelData.quantity}
                    onChange={handleQuantityChange}
                    disabled={state.isLoading}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </Form.Select>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <span><strong>Total:</strong></span>
                  <span className="h5 text-success mb-0">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>

              {/* ✅ Dados do Cliente */}
              <h5 className="text-primary mb-3">👤 Dados do Cliente</h5>
              
              <Form.Group className="mb-3">
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

              <Form.Group className="mb-4">
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

              {/* ✅ Mensagens de Feedback */}
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

              {/* ✅ Botão de Checkout */}
              <div className="d-grid gap-2">
                <Button
                  variant="success"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={state.isLoading}
                >
                  {state.isLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Processando...
                    </>
                  ) : (
                    `💳 Pagar ${formatCurrency(totalAmount)}`
                  )}
                </Button>
                
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate(-1)}
                  disabled={state.isLoading}
                >
                  ← Voltar
                </Button>
              </div>

              {/* ✅ Informações de Segurança */}
              <div className="mt-4 text-center text-muted small">
                🔒 Pagamento seguro processado via Stripe<br />
                🧪 Ambiente de desenvolvimento - Pagamentos simulados
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutClean;
