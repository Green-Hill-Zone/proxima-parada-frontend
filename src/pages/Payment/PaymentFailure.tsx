import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { extractStripeParams } from '../../services/CheckoutService';
import './PaymentFailure.css';

/* ===================================================================== */
/* INTERFACES - CLEAN CODE                                             */
/* ===================================================================== */

interface PaymentFailureState {
  reason: 'canceled' | 'failed' | 'invalid' | 'unknown';
  sessionId?: string;
  canRetry: boolean;
  supportInfo: {
    email: string;
    phone: string;
    hours: string;
  };
}

/* ===================================================================== */
/* COMPONENT - SINGLE RESPONSIBILITY                                    */
/* ===================================================================== */

/**
 * Componente responsável por exibir falhas no pagamento
 * Princípios: SRP, KISS, Clean Code
 */
const PaymentFailure: React.FC = () => {
  const navigate = useNavigate();
  
  const [state, setState] = useState<PaymentFailureState>({
    reason: 'unknown',
    canRetry: true,
    supportInfo: {
      email: 'suporte@proximaparada.com.br',
      phone: '(11) 3000-0000',
      hours: 'Segunda a Sexta, 8h às 18h'
    }
  });

  // Analisar motivo da falha quando componente carregar
  useEffect(() => {
    analyzeFailureReason();
  }, []);

  /**
   * Analisa o motivo da falha baseado nos parâmetros da URL
   * KISS: Lógica simples de análise
   */
  const analyzeFailureReason = () => {
    const { sessionId, success, canceled } = extractStripeParams();
    
    let reason: PaymentFailureState['reason'] = 'unknown';
    let canRetry = true;

    if (canceled) {
      reason = 'canceled';
    } else if (sessionId && !success) {
      reason = 'failed';
    } else if (!sessionId) {
      reason = 'invalid';
      canRetry = false;
    } else {
      reason = 'unknown';
    }

    setState(prev => ({
      ...prev,
      reason,
      sessionId: sessionId || undefined,
      canRetry
    }));
  };

  /**
   * Navega para uma rota específica
   * DRY: Função reutilizável de navegação
   */
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  /**
   * Tenta o pagamento novamente
   * Clean Code: Função com nome descritivo
   */
  const handleRetryPayment = () => {
    // Recuperar dados da reserva para retry
    const reservationData = localStorage.getItem('reservationData');
    const pendingPayment = localStorage.getItem('pendingPayment');
    
    if (reservationData || pendingPayment) {
      navigate('/payment', { 
        state: { 
          retryPayment: true,
          previousSessionId: state.sessionId
        }
      });
    } else {
      navigate('/');
    }
  };

  /**
   * Abre contato com suporte
   * KISS: Função simples para contato
   */
  const handleContactSupport = () => {
    const subject = `Problema com pagamento - Sessão: ${state.sessionId || 'N/A'}`;
    const body = `Olá, tive um problema com meu pagamento na Próxima Parada.\n\nDetalhes:\n- Motivo: ${getReasonDescription()}\n- Sessão: ${state.sessionId || 'Não disponível'}\n- Data/Hora: ${new Date().toLocaleString('pt-BR')}\n\nPor favor, me ajudem a resolver esta questão.`;
    
    const mailtoLink = `mailto:${state.supportInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  /**
   * Retorna descrição baseada no motivo da falha
   * Clean Code: Função pura com responsabilidade única
   */
  const getReasonDescription = (): string => {
    switch (state.reason) {
      case 'canceled':
        return 'Pagamento cancelado pelo usuário';
      case 'failed':
        return 'Falha no processamento do pagamento';
      case 'invalid':
        return 'Sessão de pagamento inválida';
      default:
        return 'Motivo não identificado';
    }
  };

  /**
   * Renderiza o conteúdo principal baseado no motivo da falha
   * Clean Code: Separação de responsabilidades de rendering
   */
  const renderMainContent = () => {
    const { reason } = state;

    if (reason === 'canceled') {
      return (
        <>
          <div className="canceled-icon mb-4">
            <i className="fas fa-times-circle text-warning" style={{ fontSize: '4rem' }}></i>
          </div>
          <h1 className="text-warning mb-3">Pagamento Cancelado</h1>
          <p className="lead mb-4">
            Você cancelou o processo de pagamento. Não se preocupe, sua reserva não foi perdida!
          </p>
          <Alert variant="info" className="text-start">
            <Alert.Heading>💡 O que fazer agora?</Alert.Heading>
            <p className="mb-0">
              Você pode tentar o pagamento novamente ou escolher uma forma diferente de pagamento.
              Seus dados de viagem estão salvos e seguros.
            </p>
          </Alert>
        </>
      );
    }

    if (reason === 'failed') {
      return (
        <>
          <div className="failed-icon mb-4">
            <i className="fas fa-exclamation-triangle text-danger" style={{ fontSize: '4rem' }}></i>
          </div>
          <h1 className="text-danger mb-3">Falha no Pagamento</h1>
          <p className="lead mb-4">
            Infelizmente, não foi possível processar seu pagamento. Isso pode acontecer por diversos motivos.
          </p>
          <Alert variant="warning" className="text-start">
            <Alert.Heading>🔍 Possíveis causas:</Alert.Heading>
            <ul className="mb-0">
              <li>Saldo insuficiente no cartão</li>
              <li>Dados do cartão incorretos</li>
              <li>Cartão bloqueado ou vencido</li>
              <li>Problema temporário no processador</li>
            </ul>
          </Alert>
        </>
      );
    }

    if (reason === 'invalid') {
      return (
        <>
          <div className="invalid-icon mb-4">
            <i className="fas fa-ban text-secondary" style={{ fontSize: '4rem' }}></i>
          </div>
          <h1 className="text-secondary mb-3">Sessão Inválida</h1>
          <p className="lead mb-4">
            A sessão de pagamento não é válida ou expirou. Isso pode acontecer se você demorou muito para completar o pagamento.
          </p>
          <Alert variant="secondary" className="text-start">
            <Alert.Heading>🕒 O que aconteceu?</Alert.Heading>
            <p className="mb-0">
              As sessões de pagamento têm um tempo limite por segurança. 
              Você precisará iniciar um novo processo de reserva.
            </p>
          </Alert>
        </>
      );
    }

    // Motivo desconhecido
    return (
      <>
        <div className="unknown-icon mb-4">
          <i className="fas fa-question-circle text-muted" style={{ fontSize: '4rem' }}></i>
        </div>
        <h1 className="text-muted mb-3">Algo deu errado</h1>
        <p className="lead mb-4">
          Ocorreu um problema inesperado durante o processo de pagamento.
        </p>
        <Alert variant="dark" className="text-start">
          <Alert.Heading>🤔 Não conseguimos identificar o problema</Alert.Heading>
          <p className="mb-0">
            Por favor, entre em contato com nosso suporte para que possamos ajudá-lo.
          </p>
        </Alert>
      </>
    );
  };

  /**
   * Renderiza os botões de ação baseados no contexto
   * KISS: Lógica simples de renderização
   */
  const renderActionButtons = () => {
    const { reason, canRetry } = state;

    return (
      <div className="action-buttons">
        {canRetry && (
          <Button 
            variant="primary" 
            size="lg"
            onClick={handleRetryPayment}
            className="me-3"
          >
            <i className="fas fa-redo me-2"></i>
            Tentar Novamente
          </Button>
        )}
        
        {(reason === 'failed' || reason === 'unknown') && (
          <Button 
            variant="outline-warning"
            onClick={handleContactSupport}
            className="me-3"
          >
            <i className="fas fa-headset me-2"></i>
            Falar com Suporte
          </Button>
        )}
        
        <Button 
          variant="outline-secondary"
          onClick={() => handleNavigation('/')}
        >
          <i className="fas fa-home me-2"></i>
          Voltar ao Início
        </Button>
      </div>
    );
  };

  return (
    <div className="payment-failure-page">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            <Card className="payment-failure-card shadow-lg border-0">
              <Card.Body className="text-center p-5">
                {renderMainContent()}
                {renderActionButtons()}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Informações de suporte */}
        <Row className="justify-content-center mt-4">
          <Col lg={8} xl={6}>
            <Card className="support-info-card">
              <Card.Header className="bg-light text-center">
                <h6 className="mb-0">
                  <i className="fas fa-headset me-2"></i>
                  Precisa de Ajuda?
                </h6>
              </Card.Header>
              <Card.Body className="text-center">
                <Row>
                  <Col md={4}>
                    <div className="support-item">
                      <i className="fas fa-envelope text-primary mb-2"></i>
                      <div>
                        <strong>E-mail</strong>
                        <br />
                        <small>{state.supportInfo.email}</small>
                      </div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="support-item">
                      <i className="fas fa-phone text-primary mb-2"></i>
                      <div>
                        <strong>Telefone</strong>
                        <br />
                        <small>{state.supportInfo.phone}</small>
                      </div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="support-item">
                      <i className="fas fa-clock text-primary mb-2"></i>
                      <div>
                        <strong>Horário</strong>
                        <br />
                        <small>{state.supportInfo.hours}</small>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PaymentFailure;
