import React, { useEffect, useState } from 'react';
import { Container, Alert, Spinner, Card, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { createAndAssociateTravelers, type TravelerCreateRequest } from '../../services/TravelerService';

// Componente de confirmação de pagamento (retorno do Stripe)
const PaymentConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estados para controlar o fluxo
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<'success' | 'error' | 'processing'>('processing');
  const [message, setMessage] = useState('Processando seu pagamento...');
  const [savingTravelers, setSavingTravelers] = useState(false);
  
  // Verificar os parâmetros na URL (sessão do Stripe)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session_id');
    const success = queryParams.get('success');
    
    // Se temos o ID da sessão, processar o pagamento
    if (sessionId) {
      processPaymentConfirmation(sessionId, success === 'true');
    } else {
      // Se não temos o ID da sessão, redirecionar para a página inicial
      setStatus('error');
      setMessage('Dados do pagamento não encontrados. Retorne à página inicial e tente novamente.');
      setIsLoading(false);
    }
  }, [location.search]);
  
  // Função para processar a confirmação do pagamento
  const processPaymentConfirmation = async (sessionId: string, isSuccess: boolean) => {
    try {
      // Recuperar os dados do pagamento pendente
      const pendingPaymentData = localStorage.getItem('pendingPayment');
      
      if (!pendingPaymentData) {
        setStatus('error');
        setMessage('Dados do pagamento não encontrados. Retorne à página inicial e tente novamente.');
        setIsLoading(false);
        return;
      }
      
      const paymentData = JSON.parse(pendingPaymentData);
      
      // Se o pagamento foi bem-sucedido
      if (isSuccess) {
        setStatus('success');
        setMessage('Pagamento confirmado com sucesso! Registrando os dados dos viajantes...');
        
        // Verificar se temos viajantes pendentes para salvar
        if (paymentData.pendingTravelers && paymentData.reservationId) {
          setSavingTravelers(true);
          
          // Salvar os viajantes no backend
          const pendingTravelers = paymentData.pendingTravelers as TravelerCreateRequest[];
          const reservationId = paymentData.reservationId as number;
          
          try {
            // Criar e associar os viajantes à reserva
            await createAndAssociateTravelers(pendingTravelers, reservationId);
            
            setMessage('Viajantes registrados com sucesso! Sua reserva está confirmada.');
            setSavingTravelers(false);
            
            // Limpar os dados pendentes
            localStorage.removeItem('pendingTravelers');
            localStorage.removeItem('pendingPayment');
          } catch (error) {
            console.error('Erro ao salvar viajantes:', error);
            setMessage('Pagamento confirmado, mas houve um erro ao registrar os viajantes. Entre em contato com o suporte.');
            setSavingTravelers(false);
          }
        } else {
          setMessage('Pagamento confirmado com sucesso! Sua reserva está confirmada.');
        }
      } else {
        // Se o pagamento falhou
        setStatus('error');
        setMessage('Houve um problema com o pagamento. Por favor, tente novamente ou entre em contato com o suporte.');
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao processar confirmação de pagamento:', error);
      setStatus('error');
      setMessage('Ocorreu um erro ao processar o pagamento. Por favor, tente novamente ou entre em contato com o suporte.');
      setIsLoading(false);
    }
  };
  
  // Função para navegar para outra página
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  return (
    <Container className="py-5">
      <Card className="payment-confirmation-card shadow">
        <Card.Body className="text-center p-5">
          {isLoading || savingTravelers ? (
            <>
              <Spinner animation="border" variant="primary" className="mb-4" />
              <h2>{savingTravelers ? 'Registrando viajantes...' : 'Verificando pagamento...'}</h2>
              <p className="lead text-muted">{message}</p>
            </>
          ) : status === 'success' ? (
            <>
              <div className="success-icon mb-4">
                <i className="fas fa-check-circle text-success" style={{ fontSize: '5rem' }}></i>
              </div>
              <h2 className="text-success">Pagamento Confirmado!</h2>
              <p className="lead mb-4">{message}</p>
              <div className="d-flex justify-content-center mt-4">
                <Button 
                  variant="outline-primary" 
                  className="me-3"
                  onClick={() => handleNavigation('/my-reservations')}
                >
                  Ver Minhas Reservas
                </Button>
                <Button 
                  variant="primary"
                  onClick={() => handleNavigation('/')}
                >
                  Voltar para Home
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="error-icon mb-4">
                <i className="fas fa-times-circle text-danger" style={{ fontSize: '5rem' }}></i>
              </div>
              <h2 className="text-danger">Ocorreu um Problema</h2>
              <p className="lead mb-4">{message}</p>
              <div className="d-flex justify-content-center mt-4">
                <Button 
                  variant="outline-secondary" 
                  className="me-3"
                  onClick={() => handleNavigation('/reservation')}
                >
                  Voltar para Reserva
                </Button>
                <Button 
                  variant="primary"
                  onClick={() => handleNavigation('/')}
                >
                  Voltar para Home
                </Button>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PaymentConfirmation;
