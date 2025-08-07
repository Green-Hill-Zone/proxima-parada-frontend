/* ===================================================================== */
/* PÁGINA DE SUCESSO - CLEAN ARCHITECTURE                              */
/* ===================================================================== */
/*
 * Implementação seguindo os princípios:
 * - Clean Architecture: Separação clara de responsabilidades
 * - KISS: Interface simples para feedback de sucesso
 * - DRY: Reutilização de componentes
 * - YAGNI: Apenas funcionalidades necessárias
 * - Shadow Properties: Compatível com EF Core
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Col, Container, Row, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CheckoutService, { 
  formatCurrency,
  type PaymentConfirmationResponse 
} from '../../services/CheckoutService';

/* ===================================================================== */
/* INTERFACES & TYPES                                                   */
/* ===================================================================== */

interface PaymentSuccessState {
  sessionId: string | null;
  paymentData: PaymentConfirmationResponse | null;
  isLoading: boolean;
  errorMessage: string;
}

/* ===================================================================== */
/* MAIN COMPONENT - SUCCESS PAGE                                       */
/* ===================================================================== */

const PaymentSuccessClean: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // 🛡️ Ref para prevenir dupla execução no React StrictMode
  const hasConfirmed = useRef(false);
  
  const [state, setState] = useState<PaymentSuccessState>({
    sessionId: searchParams.get('session_id'),
    paymentData: null,
    isLoading: true,
    errorMessage: ''
  });

  /* ===================================================================== */
  /* EFFECT - CONFIRMAR PAGAMENTO (COM PROTEÇÃO DUPLA EXECUÇÃO)         */
  /* ===================================================================== */

  useEffect(() => {
    const confirmPayment = async () => {
      // 🛡️ PROTEÇÃO: Se já confirmou, não executa novamente
      if (hasConfirmed.current) {
        console.log('🚫 Confirmação já executada - ignorando chamada duplicada');
        return;
      }

      if (!state.sessionId) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          errorMessage: 'Session ID não encontrado na URL'
        }));
        return;
      }

      // 🏁 Marcar como confirmado ANTES da chamada
      hasConfirmed.current = true;
      console.log('🔄 Confirmando pagamento para sessão:', state.sessionId);

      try {
        // ✅ Confirmar pagamento usando endpoint testado
        const paymentData = await CheckoutService.confirmPayment({
          sessionId: state.sessionId
        });

        console.log('✅ Confirmação recebida:', paymentData);

        setState(prev => ({
          ...prev,
          paymentData,
          isLoading: false
        }));

      } catch (error) {
        console.error('💥 Erro ao confirmar pagamento:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          errorMessage: 'Erro ao confirmar pagamento. Entre em contato conosco.'
        }));
      }
    };

    confirmPayment();
  }, [state.sessionId]);

  /* ===================================================================== */
  /* RENDER - SUCCESS UI                                                  */
  /* ===================================================================== */

  if (state.isLoading) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="text-center">
              <Card.Body className="py-5">
                <Spinner animation="border" variant="primary" className="mb-3" />
                <h4>Confirmando pagamento...</h4>
                <p className="text-muted">Aguarde enquanto processamos sua transação</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (state.errorMessage) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="border-danger">
              <Card.Header className="bg-danger text-white text-center">
                <h4 className="mb-0">❌ Erro na Confirmação</h4>
              </Card.Header>
              <Card.Body className="text-center">
                <Alert variant="danger" className="mb-4">
                  {state.errorMessage}
                </Alert>
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/')}
                  >
                    🏠 Voltar ao Início
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => window.location.reload()}
                  >
                    🔄 Tentar Novamente
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  const { paymentData } = state;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            {paymentData?.isSuccessful ? (
              // ✅ SUCESSO
              <>
                <Card.Header className="bg-success text-white text-center">
                  <h4 className="mb-0">✅ Pagamento Confirmado!</h4>
                </Card.Header>
                <Card.Body>
                  <div className="text-center mb-4">
                    <div className="text-success" style={{ fontSize: '4rem' }}>
                      🎉
                    </div>
                    <h5 className="text-success">Pagamento realizado com sucesso!</h5>
                    <p className="text-muted">Sua reserva foi confirmada</p>
                  </div>

                  {/* ✅ Detalhes do Pagamento */}
                  <div className="bg-light p-3 rounded mb-4">
                    <h6 className="text-primary mb-3">📋 Detalhes da Transação</h6>
                    
                    <div className="row mb-2">
                      <div className="col-6"><strong>Valor Pago:</strong></div>
                      <div className="col-6 text-end">
                        {formatCurrency(paymentData.amount)}
                      </div>
                    </div>
                    
                    <div className="row mb-2">
                      <div className="col-6"><strong>Status:</strong></div>
                      <div className="col-6 text-end">
                        <span className="badge bg-success">{paymentData.status}</span>
                      </div>
                    </div>

                    {paymentData.reservationId && (
                      <div className="row mb-2">
                        <div className="col-6"><strong>Reserva ID:</strong></div>
                        <div className="col-6 text-end">#{paymentData.reservationId}</div>
                      </div>
                    )}

                    {paymentData.reservationStatus && (
                      <div className="row mb-2">
                        <div className="col-6"><strong>Status Reserva:</strong></div>
                        <div className="col-6 text-end">
                          <span className="badge bg-primary">{paymentData.reservationStatus}</span>
                        </div>
                      </div>
                    )}

                    {paymentData.paymentIntentId && (
                      <div className="row">
                        <div className="col-6"><strong>ID Transação:</strong></div>
                        <div className="col-6 text-end">
                          <small className="text-muted">
                            {paymentData.paymentIntentId.substring(0, 20)}...
                          </small>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ✅ Próximos Passos */}
                  <Alert variant="info" className="mb-4">
                    <strong>📧 Próximos Passos:</strong><br />
                    • Você receberá um e-mail de confirmação em breve<br />
                    • Acesse "Minhas Viagens" para ver os detalhes<br />
                    • Em caso de dúvidas, entre em contato conosco
                  </Alert>

                  {/* ✅ Ações */}
                  <div className="d-grid gap-2">
                    <Button
                      variant="success"
                      size="lg"
                      onClick={() => navigate('/my-travels')}
                    >
                      ✈️ Ver Minhas Viagens
                    </Button>
                    <Button
                      variant="outline-primary"
                      onClick={() => navigate('/')}
                    >
                      🏠 Voltar ao Início
                    </Button>
                  </div>
                </Card.Body>
              </>
            ) : (
              // ❌ FALHA
              <>
                <Card.Header className="bg-warning text-dark text-center">
                  <h4 className="mb-0">⚠️ Pagamento Não Processado</h4>
                </Card.Header>
                <Card.Body>
                  <div className="text-center mb-4">
                    <div className="text-warning" style={{ fontSize: '4rem' }}>
                      ⚠️
                    </div>
                    <h5 className="text-warning">Pagamento não foi confirmado</h5>
                    <p className="text-muted">
                      {paymentData?.errorMessage || 'O pagamento não foi processado com sucesso'}
                    </p>
                  </div>

                  {/* ✅ Detalhes */}
                  <div className="bg-light p-3 rounded mb-4">
                    <h6 className="text-warning mb-3">📋 Informações</h6>
                    
                    <div className="row mb-2">
                      <div className="col-6"><strong>Status:</strong></div>
                      <div className="col-6 text-end">
                        <span className="badge bg-warning text-dark">{paymentData?.status}</span>
                      </div>
                    </div>

                    {paymentData?.amount && (
                      <div className="row mb-2">
                        <div className="col-6"><strong>Valor:</strong></div>
                        <div className="col-6 text-end">
                          {formatCurrency(paymentData.amount)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ✅ Ações */}
                  <div className="d-grid gap-2">
                    <Button
                      variant="warning"
                      size="lg"
                      onClick={() => navigate(-2)} // Voltar para checkout
                    >
                      🔄 Tentar Novamente
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => navigate('/')}
                    >
                      🏠 Voltar ao Início
                    </Button>
                  </div>
                </Card.Body>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentSuccessClean;
