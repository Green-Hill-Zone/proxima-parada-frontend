/* ===================================================================== */
/* COMPONENTE DE PAGAMENTO - CLEAN ARCHITECTURE                        */
/* ===================================================================== */

import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { PaymentFlowHelper } from '../services/PaymentService';
import type { CustomerData, TravelData, PaymentMethod } from '../services/PaymentService';

/* ===================================================================== */
/* INTERFACES & TYPES                                                   */
/* ===================================================================== */

// ✅ Estado do componente (Single Responsibility)
interface PaymentState {
  // Dados do cliente
  customerData: CustomerData;
  
  // Dados da viagem
  travelData: TravelData;
  
  // Estado do pagamento
  selectedPaymentMethod: PaymentMethod;
  isProcessing: boolean;
  
  // Feedback
  message: string;
  messageType: 'success' | 'error' | 'info' | '';
  
  // Validação
  formErrors: Record<string, string>;
}

// ✅ Props do componente (KISS principle)
interface PaymentProps {
  travelPackage?: {
    id: number;
    name: string;
    price: number;
    date: string;
  };
  reservationId?: number;
  onPaymentSuccess?: (result: any) => void;
  onPaymentError?: (error: string) => void;
}

/* ===================================================================== */
/* COMPONENTE PRINCIPAL                                                  */
/* ===================================================================== */

const Payment: React.FC<PaymentProps> = ({
  travelPackage,
  reservationId = 1, // Default para teste
  onPaymentSuccess,
  onPaymentError
}) => {
  
  // ✅ Estado inicial (Clean Architecture - separação de responsabilidades)
  const [state, setState] = useState<PaymentState>({
    customerData: {
      name: '',
      document: '',
      email: '',
      phone: '',
      address: {
        zipCode: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: ''
      }
    },
    travelData: {
      name: travelPackage?.name || 'Pacote de Viagem',
      date: travelPackage?.date || new Date().toISOString(),
      price: travelPackage?.price || 1000,
      people: 1,
      packageId: travelPackage?.id
    },
    selectedPaymentMethod: 'card',
    isProcessing: false,
    message: '',
    messageType: '',
    formErrors: {}
  });

  /* ===================================================================== */
  /* VALIDATION LOGIC (DRY principle)                                     */
  /* ===================================================================== */

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Validar nome
    if (!state.customerData.name.trim()) {
      errors.name = 'Nome completo é obrigatório';
    } else if (state.customerData.name.trim().length < 2) {
      errors.name = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!state.customerData.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(state.customerData.email)) {
      errors.email = 'Email inválido';
    }
    
    // Validar CPF (formato básico)
    const cpfClean = state.customerData.document.replace(/\D/g, '');
    if (!cpfClean) {
      errors.document = 'CPF é obrigatório';
    } else if (cpfClean.length !== 11) {
      errors.document = 'CPF deve ter 11 dígitos';
    }
    
    // Validar telefone
    const phoneClean = state.customerData.phone.replace(/\D/g, '');
    if (!phoneClean) {
      errors.phone = 'Telefone é obrigatório';
    } else if (phoneClean.length < 10) {
      errors.phone = 'Telefone deve ter pelo menos 10 dígitos';
    }
    
    // Validar endereço
    const address = state.customerData.address;
    if (!address.zipCode.replace(/\D/g, '')) {
      errors.zipCode = 'CEP é obrigatório';
    } else if (address.zipCode.replace(/\D/g, '').length !== 8) {
      errors.zipCode = 'CEP deve ter 8 dígitos';
    }
    
    if (!address.street.trim()) {
      errors.street = 'Rua é obrigatória';
    }
    
    if (!address.number.trim()) {
      errors.number = 'Número é obrigatório';
    }
    
    if (!address.neighborhood.trim()) {
      errors.neighborhood = 'Bairro é obrigatório';
    }
    
    if (!address.city.trim()) {
      errors.city = 'Cidade é obrigatória';
    }
    
    if (!address.state.trim()) {
      errors.state = 'Estado é obrigatório';
    }
    
    // Validar pessoas
    if (state.travelData.people < 1) {
      errors.people = 'Número de pessoas deve ser pelo menos 1';
    }

    setState(prev => ({ ...prev, formErrors: errors }));
    return Object.keys(errors).length === 0;
  };

  /* ===================================================================== */
  /* EVENT HANDLERS (Single Responsibility)                               */
  /* ===================================================================== */

  const handleCustomerDataChange = (field: keyof CustomerData, value: string) => {
    setState(prev => ({
      ...prev,
      customerData: {
        ...prev.customerData,
        [field]: value
      },
      formErrors: {
        ...prev.formErrors,
        [field]: '' // Limpar erro quando usuário digita
      }
    }));
  };

  const handleAddressChange = (field: keyof CustomerData['address'], value: string) => {
    setState(prev => ({
      ...prev,
      customerData: {
        ...prev.customerData,
        address: {
          ...prev.customerData.address,
          [field]: value
        }
      },
      formErrors: {
        ...prev.formErrors,
        [field]: '' // Limpar erro quando usuário digita
      }
    }));
  };

  const handleTravelDataChange = (field: keyof TravelData, value: string | number) => {
    setState(prev => ({
      ...prev,
      travelData: {
        ...prev.travelData,
        [field]: value
      }
    }));
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setState(prev => ({
      ...prev,
      selectedPaymentMethod: method,
      message: '',
      messageType: ''
    }));
  };

  /* ===================================================================== */
  /* PAYMENT PROCESSING (Clean Architecture - Use Case)                   */
  /* ===================================================================== */

  const processPayment = async () => {
    // 1. Validar formulário
    if (!validateForm()) {
      setState(prev => ({
        ...prev,
        message: 'Por favor, corrija os erros no formulário',
        messageType: 'error'
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      isProcessing: true,
      message: 'Processando pagamento...',
      messageType: 'info'
    }));

    try {
      // 2. Processar pagamento usando o Use Case
      const result = await PaymentFlowHelper.initiatePaymentFlow(
        reservationId,
        state.customerData,
        state.travelData,
        state.selectedPaymentMethod
      );

      // 3. Verificar resultado
      if (result.isSuccessful) {
        setState(prev => ({
          ...prev,
          message: 'Pagamento processado com sucesso!',
          messageType: 'success',
          isProcessing: false
        }));
        
        // Callback de sucesso
        onPaymentSuccess?.(result);
      } else {
        throw new Error(`Falha no pagamento: ${result.status}`);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro no processamento do pagamento';
      
      setState(prev => ({
        ...prev,
        message: errorMessage,
        messageType: 'error',
        isProcessing: false
      }));

      // Callback de erro
      onPaymentError?.(errorMessage);
    }
  };

  /* ===================================================================== */
  /* UTILITY FUNCTIONS (DRY principle)                                    */
  /* ===================================================================== */

  const formatCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatCEP = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const calculateTotal = (): number => {
    return state.travelData.price * state.travelData.people;
  };

  /* ===================================================================== */
  /* RENDER METHODS (KISS principle)                                      */
  /* ===================================================================== */

  const renderCustomerForm = () => (
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">Dados do Cliente</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={12} className="mb-3">
            <Form.Group>
              <Form.Label>Nome Completo *</Form.Label>
              <Form.Control
                type="text"
                value={state.customerData.name}
                onChange={(e) => handleCustomerDataChange('name', e.target.value)}
                placeholder="Digite seu nome completo"
                isInvalid={!!state.formErrors.name}
                disabled={state.isProcessing}
              />
              <Form.Control.Feedback type="invalid">
                {state.formErrors.name}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                value={state.customerData.email}
                onChange={(e) => handleCustomerDataChange('email', e.target.value)}
                placeholder="seu@email.com"
                isInvalid={!!state.formErrors.email}
                disabled={state.isProcessing}
              />
              <Form.Control.Feedback type="invalid">
                {state.formErrors.email}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>CPF *</Form.Label>
              <Form.Control
                type="text"
                value={formatCPF(state.customerData.document)}
                onChange={(e) => handleCustomerDataChange('document', e.target.value.replace(/\D/g, ''))}
                placeholder="000.000.000-00"
                maxLength={14}
                isInvalid={!!state.formErrors.document}
                disabled={state.isProcessing}
              />
              <Form.Control.Feedback type="invalid">
                {state.formErrors.document}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={12} className="mb-3">
            <Form.Group>
              <Form.Label>Telefone *</Form.Label>
              <Form.Control
                type="text"
                value={formatPhone(state.customerData.phone)}
                onChange={(e) => handleCustomerDataChange('phone', e.target.value.replace(/\D/g, ''))}
                placeholder="(11) 99999-9999"
                maxLength={15}
                isInvalid={!!state.formErrors.phone}
                disabled={state.isProcessing}
              />
              <Form.Control.Feedback type="invalid">
                {state.formErrors.phone}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        
        <hr />
        <h6>Endereço</h6>
        
        <Row>
          <Col md={4} className="mb-3">
            <Form.Group>
              <Form.Label>CEP *</Form.Label>
              <Form.Control
                type="text"
                value={formatCEP(state.customerData.address.zipCode)}
                onChange={(e) => handleAddressChange('zipCode', e.target.value.replace(/\D/g, ''))}
                placeholder="00000-000"
                maxLength={9}
                isInvalid={!!state.formErrors.zipCode}
                disabled={state.isProcessing}
              />
              <Form.Control.Feedback type="invalid">
                {state.formErrors.zipCode}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Rua *</Form.Label>
              <Form.Control
                type="text"
                value={state.customerData.address.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                placeholder="Nome da rua"
                isInvalid={!!state.formErrors.street}
                disabled={state.isProcessing}
              />
              <Form.Control.Feedback type="invalid">
                {state.formErrors.street}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={2} className="mb-3">
            <Form.Group>
              <Form.Label>Número *</Form.Label>
              <Form.Control
                type="text"
                value={state.customerData.address.number}
                onChange={(e) => handleAddressChange('number', e.target.value)}
                placeholder="123"
                isInvalid={!!state.formErrors.number}
                disabled={state.isProcessing}
              />
              <Form.Control.Feedback type="invalid">
                {state.formErrors.number}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Complemento</Form.Label>
              <Form.Control
                type="text"
                value={state.customerData.address.complement}
                onChange={(e) => handleAddressChange('complement', e.target.value)}
                placeholder="Apto, casa, etc. (opcional)"
                disabled={state.isProcessing}
              />
            </Form.Group>
          </Col>
          
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Bairro *</Form.Label>
              <Form.Control
                type="text"
                value={state.customerData.address.neighborhood}
                onChange={(e) => handleAddressChange('neighborhood', e.target.value)}
                placeholder="Nome do bairro"
                isInvalid={!!state.formErrors.neighborhood}
                disabled={state.isProcessing}
              />
              <Form.Control.Feedback type="invalid">
                {state.formErrors.neighborhood}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={8} className="mb-3">
            <Form.Group>
              <Form.Label>Cidade *</Form.Label>
              <Form.Control
                type="text"
                value={state.customerData.address.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                placeholder="Nome da cidade"
                isInvalid={!!state.formErrors.city}
                disabled={state.isProcessing}
              />
              <Form.Control.Feedback type="invalid">
                {state.formErrors.city}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={4} className="mb-3">
            <Form.Group>
              <Form.Label>Estado *</Form.Label>
              <Form.Select
                value={state.customerData.address.state}
                onChange={(e) => handleAddressChange('state', e.target.value)}
                isInvalid={!!state.formErrors.state}
                disabled={state.isProcessing}
              >
                <option value="">Selecione</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {state.formErrors.state}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  const renderTravelSummary = () => (
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">Resumo da Viagem</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={8}>
            <h6>{state.travelData.name}</h6>
            <p className="text-muted mb-2">Data: {new Date(state.travelData.date).toLocaleDateString('pt-BR')}</p>
            <p className="text-muted mb-0">Valor por pessoa: R$ {state.travelData.price.toFixed(2)}</p>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Número de Pessoas</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="10"
                value={state.travelData.people}
                onChange={(e) => handleTravelDataChange('people', parseInt(e.target.value) || 1)}
                disabled={state.isProcessing}
                isInvalid={!!state.formErrors.people}
              />
              <Form.Control.Feedback type="invalid">
                {state.formErrors.people}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col className="text-end">
            <h5>Total: R$ {calculateTotal().toFixed(2)}</h5>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  const renderPaymentMethods = () => (
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">Método de Pagamento</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={4} className="mb-3">
            <Form.Check
              type="radio"
              id="payment-card"
              name="paymentMethod"
              label="💳 Cartão de Crédito"
              checked={state.selectedPaymentMethod === 'card'}
              onChange={() => handlePaymentMethodChange('card')}
              disabled={state.isProcessing}
            />
          </Col>
          <Col md={4} className="mb-3">
            <Form.Check
              type="radio"
              id="payment-pix"
              name="paymentMethod"
              label="📱 PIX"
              checked={state.selectedPaymentMethod === 'pix'}
              onChange={() => handlePaymentMethodChange('pix')}
              disabled={state.isProcessing}
            />
          </Col>
          <Col md={4} className="mb-3">
            <Form.Check
              type="radio"
              id="payment-boleto"
              name="paymentMethod"
              label="📄 Boleto Bancário"
              checked={state.selectedPaymentMethod === 'boleto'}
              onChange={() => handlePaymentMethodChange('boleto')}
              disabled={state.isProcessing}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  /* ===================================================================== */
  /* MAIN RENDER                                                          */
  /* ===================================================================== */

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8} xl={6}>
          <div className="text-center mb-4">
            <h2>Finalizar Pagamento</h2>
            <p className="text-muted">Complete os dados para processar seu pagamento</p>
          </div>

          {/* Mensagem de feedback */}
          {state.message && (
            <Alert 
              variant={state.messageType === 'success' ? 'success' : state.messageType === 'error' ? 'danger' : 'info'}
              className="mb-4"
            >
              {state.message}
            </Alert>
          )}

          {/* Formulário de dados do cliente */}
          {renderCustomerForm()}

          {/* Resumo da viagem */}
          {renderTravelSummary()}

          {/* Métodos de pagamento */}
          {renderPaymentMethods()}

          {/* Botão de pagamento */}
          <div className="text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={processPayment}
              disabled={state.isProcessing}
              className="px-5"
            >
              {state.isProcessing ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Processando...
                </>
              ) : (
                `Pagar R$ ${calculateTotal().toFixed(2)}`
              )}
            </Button>
          </div>

          {/* Informações de segurança */}
          <div className="text-center mt-4">
            <small className="text-muted">
              🔒 Pagamento seguro e criptografado<br />
              Seus dados estão protegidos
            </small>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Payment;
