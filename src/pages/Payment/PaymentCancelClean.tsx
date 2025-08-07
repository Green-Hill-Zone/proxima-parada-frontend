/* ===================================================================== */
/* PÁGINA DE CANCELAMENTO - CLEAN ARCHITECTURE                         */
/* ===================================================================== */
/*
 * Implementação seguindo os princípios:
 * - Clean Architecture: Separação clara de responsabilidades
 * - KISS: Interface simples para feedback de cancelamento
 * - DRY: Reutilização de componentes
 * - YAGNI: Apenas funcionalidades necessárias
 */

import React from 'react';
import { Button, Card, Col, Container, Row, Alert } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';

/* ===================================================================== */
/* MAIN COMPONENT - CANCEL PAGE                                        */
/* ===================================================================== */

const PaymentCancelClean: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const sessionId = searchParams.get('session_id');

  /* ===================================================================== */
  /* RENDER - CANCEL UI                                                   */
  /* ===================================================================== */

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header className="bg-warning text-dark text-center">
              <h4 className="mb-0">⏹️ Pagamento Cancelado</h4>
            </Card.Header>
            
            <Card.Body>
              <div className="text-center mb-4">
                <div className="text-warning" style={{ fontSize: '4rem' }}>
                  ⏹️
                </div>
                <h5 className="text-warning">Pagamento foi cancelado</h5>
                <p className="text-muted">
                  Você cancelou o processo de pagamento no Stripe
                </p>
              </div>

              {/* ✅ Informações */}
              <Alert variant="info" className="mb-4">
                <strong>📌 O que aconteceu:</strong><br />
                • O pagamento foi cancelado antes da confirmação<br />
                • Nenhuma cobrança foi realizada<br />
                • Sua reserva não foi confirmada<br />
                • Você pode tentar novamente a qualquer momento
              </Alert>

              {sessionId && (
                <div className="bg-light p-3 rounded mb-4">
                  <h6 className="text-muted mb-2">🔍 Informações Técnicas</h6>
                  <small className="text-muted">
                    <strong>Session ID:</strong> {sessionId.substring(0, 30)}...
                  </small>
                </div>
              )}

              {/* ✅ Ações */}
              <div className="d-grid gap-2">
                <Button
                  variant="warning"
                  size="lg"
                  onClick={() => navigate(-1)} // Voltar para checkout
                >
                  🔄 Tentar Pagamento Novamente
                </Button>
                
                <Button
                  variant="outline-primary"
                  onClick={() => navigate('/')}
                >
                  🏠 Voltar ao Início
                </Button>
                
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate('/packages')}
                >
                  🧳 Ver Outros Pacotes
                </Button>
              </div>

              {/* ✅ Suporte */}
              <div className="mt-4 text-center">
                <hr />
                <p className="text-muted small">
                  <strong>💬 Precisa de ajuda?</strong><br />
                  Entre em contato conosco pelo e-mail: <br />
                  <a href="mailto:suporte@proximaparada.com">
                    suporte@proximaparada.com
                  </a>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentCancelClean;
