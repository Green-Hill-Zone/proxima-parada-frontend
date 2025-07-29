// Importações necessárias
import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row, Badge, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import './MyPayments.css';

// Interface para dados do pagamento
interface Payment {
  paymentId: string;
  travelData: {
    name: string;
    date: string;
    price: number;
    people: number;
  };
  paymentData: {
    fullName: string;
    email: string;
    installments: string;
  };
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  createdAt: string;
  updatedAt?: string;
  stripeSessionId?: string;
}

// Componente MyPayments - Página de Meus Pagamentos
const MyPayments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Simular dados de pagamentos (em produção viria da API)
    const mockPayments: Payment[] = [
      {
        paymentId: 'pay_1234567890',
        travelData: {
          name: 'Paris - França',
          date: '15/08/2025 - 22/08/2025',
          price: 3500.00,
          people: 2
        },
        paymentData: {
          fullName: 'Maria Santos',
          email: 'maria@email.com',
          installments: '3'
        },
        amount: 7000.00,
        status: 'approved',
        createdAt: '2025-01-20T10:30:00Z',
        updatedAt: '2025-01-20T10:35:00Z'
      },
      {
        paymentId: 'pay_0987654321',
        travelData: {
          name: 'Londres - Inglaterra',
          date: '10/09/2025 - 17/09/2025',
          price: 4200.00,
          people: 1
        },
        paymentData: {
          fullName: 'Maria Santos',
          email: 'maria@email.com',
          installments: '1'
        },
        amount: 4200.00,
        status: 'rejected',
        createdAt: '2025-01-15T14:20:00Z',
        updatedAt: '2025-01-15T14:25:00Z'
      }
    ];

    // Simular carregamento de dados
    const loadPayments = async () => {
      setLoading(true);
      
      try {
        // Verificar se há pagamento pendente no localStorage
        const pendingPaymentStr = localStorage.getItem('pendingPayment');
        const allPayments = [...mockPayments];
        
        if (pendingPaymentStr) {
          const pendingPayment = JSON.parse(pendingPaymentStr);
          
          // Simular atualização do status do pagamento
          // Em produção, isso seria feito via webhook do Stripe
          const randomStatus = Math.random() > 0.3 ? 'approved' : 'rejected';
          pendingPayment.status = randomStatus;
          pendingPayment.updatedAt = new Date().toISOString();
          
          allPayments.unshift(pendingPayment);
          localStorage.removeItem('pendingPayment');
        }
        
        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setPayments(allPayments);
        
        // Mostrar mensagem se veio da tela de pagamento
        if (location.state?.message) {
          setMessage(location.state.message);
          setTimeout(() => setMessage(''), 5000);
        }
        
      } catch (error) {
        console.error('Erro ao carregar pagamentos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [location.state]);

  // Função para obter cor do badge baseado no status
  const getStatusBadge = (status: Payment['status']) => {
    switch (status) {
      case 'approved':
        return <Badge bg="success">Aprovado</Badge>;
      case 'rejected':
        return <Badge bg="danger">Rejeitado</Badge>;
      case 'processing':
        return <Badge bg="warning">Processando</Badge>;
      case 'pending':
        return <Badge bg="secondary">Pendente</Badge>;
      default:
        return <Badge bg="secondary">Desconhecido</Badge>;
    }
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  // Função para tentar pagamento novamente
  const retryPayment = (payment: Payment) => {
    navigate('/payment', {
      state: {
        travelData: payment.travelData,
        retryPayment: true
      }
    });
  };

  return (
    <>
      <main className="my-payments-main">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              {/* Cabeçalho da página */}
              <div className="my-payments-header">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h1>Meus Pagamentos</h1>
                    <p className="lead">Acompanhe o status dos seus pagamentos e transações</p>
                  </div>
                  <Button
                    variant="outline-primary"
                    onClick={() => navigate('/dashboard')}
                    className="my-payments-back-button"
                  >
                    Voltar ao Dashboard
                  </Button>
                </div>
              </div>

              {/* Mensagem de feedback */}
              {message && (
                <Alert variant="info" className="mb-4">
                  {message}
                </Alert>
              )}

              {/* Loading */}
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                  <p className="mt-3">Carregando seus pagamentos...</p>
                </div>
              ) : (
                <>
                  {/* Lista de pagamentos */}
                  {payments.length === 0 ? (
                    <Card className="text-center py-5">
                      <Card.Body>
                        <h5>Nenhum pagamento encontrado</h5>
                        <p className="text-muted">Você ainda não realizou nenhum pagamento.</p>
                        <Button
                          variant="primary"
                          onClick={() => navigate('/destinations')}
                        >
                          Explorar Destinos
                        </Button>
                      </Card.Body>
                    </Card>
                  ) : (
                    <Row>
                      {payments.map((payment) => (
                        <Col key={payment.paymentId} lg={12} className="mb-4">
                          <Card className="payment-card">
                            <Card.Body>
                              <Row>
                                {/* Informações da viagem */}
                                <Col md={6}>
                                  <div className="payment-travel-info">
                                    <h5 className="payment-travel-title">
                                      {payment.travelData.name}
                                    </h5>
                                    <p className="payment-travel-date">
                                      📅 {payment.travelData.date}
                                    </p>
                                    <p className="payment-travel-people">
                                      👥 {payment.travelData.people} {payment.travelData.people === 1 ? 'pessoa' : 'pessoas'}
                                    </p>
                                  </div>
                                </Col>

                                {/* Informações do pagamento */}
                                <Col md={6}>
                                  <div className="payment-info">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                      <h6 className="mb-0">Status do Pagamento</h6>
                                      {getStatusBadge(payment.status)}
                                    </div>
                                    
                                    <div className="payment-details">
                                      <div className="payment-detail-item">
                                        <strong>Valor Total:</strong>
                                        <span>R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                      </div>
                                      
                                      <div className="payment-detail-item">
                                        <strong>Parcelamento:</strong>
                                        <span>
                                          {payment.paymentData.installments}x 
                                          {payment.paymentData.installments === '1' 
                                            ? ' à vista' 
                                            : ` de R$ ${(payment.amount / parseInt(payment.paymentData.installments)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                                          }
                                        </span>
                                      </div>
                                      
                                      <div className="payment-detail-item">
                                        <strong>Data:</strong>
                                        <span>{formatDate(payment.createdAt)}</span>
                                      </div>
                                      
                                      <div className="payment-detail-item">
                                        <strong>ID do Pagamento:</strong>
                                        <span className="payment-id">{payment.paymentId}</span>
                                      </div>
                                    </div>

                                    {/* Ações baseadas no status */}
                                    <div className="payment-actions mt-3">
                                      {payment.status === 'rejected' && (
                                        <Button
                                          variant="warning"
                                          size="sm"
                                          onClick={() => retryPayment(payment)}
                                        >
                                          Tentar Novamente
                                        </Button>
                                      )}
                                      
                                      {payment.status === 'approved' && (
                                        <Button
                                          variant="success"
                                          size="sm"
                                          onClick={() => navigate('/my-travels')}
                                        >
                                          Ver Viagem
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  )}
                </>
              )}
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
};

export default MyPayments;
