// Importações necessárias
import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row, Badge, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserPayments } from '../../services/PaymentService';
import type { PaymentResponse } from '../../services/PaymentService';
import { useAuth } from '../../hooks/useAuth';
import { usePageTitle, PAGE_TITLES } from '../../hooks';
import './MyPayments.css';

// Interface para dados do pagamento (adaptada da API)
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
    installments?: string;
  };
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  createdAt: string;
  updatedAt?: string;
  stripeSessionId?: string;
}

// Componente MyPayments - Página de Meus Pagamentos
const MyPayments = () => {
  // Define o título da página
  usePageTitle(PAGE_TITLES.MY_PAYMENTS);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);
      try {
        if (!user) {
          setPayments([]);
          setLoading(false);
          return;
        }
        // Buscar pagamentos reais da API
        const apiPayments: PaymentResponse[] = await getUserPayments(Number(user.id));

        // Adaptar dados da API para o formato esperado pelo componente
        const mappedPayments: Payment[] = apiPayments.map((p) => ({
          paymentId: String(p.id),
          travelData: {
            name: p.travelId ? `Pacote #${p.travelId}` : 'Viagem',
            date: p.createdAt ? new Date(p.createdAt).toLocaleDateString('pt-BR') : '',
            price: p.amount,
            people: 1 // Ajuste conforme sua API
          },
          paymentData: {
            fullName: user.name,
            email: user.email,
            installments: '1' // Ajuste conforme sua API
          },
          amount: p.amount,
          status: p.status === 'completed' ? 'approved' : (p.status === 'failed' ? 'rejected' : (p.status as any)),
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          stripeSessionId: p.stripeSessionId
        }));

        setPayments(mappedPayments);

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
  }, [location.state, user]);

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
                                          : ` de R$ ${(payment.amount / parseInt(payment.paymentData.installments || '1')).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
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
