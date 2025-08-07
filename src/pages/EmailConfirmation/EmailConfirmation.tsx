import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmEmail, getUserById, adaptUserToAuthUser } from '../../services/UserService';
import { useAuth } from '../../hooks/useAuth';

// Componente EmailConfirmation - Página de confirmação de email
const EmailConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, updateUser } = useAuth(); // Adiciona acesso ao contexto de autenticação
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState('');

  // Extrai o token da URL
  const token = searchParams.get('token');

  useEffect(() => {
    const processEmailConfirmation = async () => {
      if (!token) {
        setError('Token de confirmação não encontrado na URL.');
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔄 Processando confirmação de email com token:', token);
        console.log('📏 Tamanho do token:', token.length);
        console.log('🔍 Token decodificado:', decodeURIComponent(token));
        
        const success = await confirmEmail(token);
        
        if (success) {
          console.log('✅ Email confirmado com sucesso');
          setIsConfirmed(true);
          
          // Atualiza o status de confirmação no contexto se o usuário estiver logado
          if (user && user.id) {
            try {
              console.log('🔄 Buscando dados atualizados do usuário após confirmação');
              
              // Busca os dados atualizados do usuário no backend
              const updatedUserData = await getUserById(parseInt(user.id));
              
              // Adapta para o formato do contexto de autenticação preservando dados existentes
              const updatedAuthUser = adaptUserToAuthUser(updatedUserData, user);
              
              console.log('✅ Atualizando contexto com dados frescos do backend:', {
                antes: user.isEmailConfirmed,
                depois: updatedAuthUser.isEmailConfirmed
              });
              
              // Atualiza o contexto com os dados frescos
              updateUser(updatedAuthUser);
              
            } catch (updateError) {
              console.error('⚠️ Erro ao atualizar dados do usuário no contexto:', updateError);
              // Fallback: apenas atualiza o status de confirmação localmente
              updateUser({
                ...user,
                isEmailConfirmed: true
              });
            }
          }
        } else {
          console.log('❌ Erro ao confirmar email');
          setError('Não foi possível confirmar o email. O token pode estar expirado ou inválido.');
        }
      } catch (error) {
        console.error('❌ Erro durante confirmação:', error);
        setError('Erro interno durante a confirmação. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    processEmailConfirmation();
  }, [token]);

  // Função para ir para o login
  const handleGoToLogin = () => {
    navigate('/login');
  };

  // Função para ir para o dashboard
  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col lg={8} xl={6}>
          <Card className="text-center">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Confirmação de Email</h4>
            </Card.Header>
            <Card.Body className="p-5">
              
              {/* Estado de carregamento */}
              {isLoading && (
                <div>
                  <Spinner animation="border" variant="primary" className="mb-3" />
                  <h5>Confirmando seu email...</h5>
                  <p className="text-muted">
                    Aguarde enquanto processamos a confirmação do seu email.
                  </p>
                </div>
              )}

              {/* Estado de sucesso */}
              {!isLoading && isConfirmed && (
                <div>
                  <div className="text-success mb-4">
                    <i className="fas fa-check-circle fa-5x"></i>
                  </div>
                  <h3 className="text-success mb-3">Email Confirmado!</h3>
                  <p className="mb-4">
                    Parabéns! Seu email foi confirmado com sucesso. 
                    Agora você tem acesso completo a todas as funcionalidades da plataforma.
                  </p>
                  
                  <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                    <Button 
                      variant="primary" 
                      size="lg"
                      onClick={handleGoToDashboard}
                      className="me-md-2"
                    >
                      Ir para Dashboard
                    </Button>
                    <Button 
                      variant="outline-primary" 
                      size="lg"
                      onClick={handleGoToLogin}
                    >
                      Fazer Login
                    </Button>
                  </div>
                </div>
              )}

              {/* Estado de erro */}
              {!isLoading && !isConfirmed && error && (
                <div>
                  <div className="text-danger mb-4">
                    <i className="fas fa-times-circle fa-5x"></i>
                  </div>
                  <h3 className="text-danger mb-3">Erro na Confirmação</h3>
                  
                  <Alert variant="danger" className="text-start">
                    <Alert.Heading>Não foi possível confirmar o email</Alert.Heading>
                    <p>{error}</p>
                  </Alert>

                  <div className="mt-4">
                    <h6>Possíveis soluções:</h6>
                    <ul className="text-start text-muted">
                      <li>Verifique se você clicou no link mais recente enviado</li>
                      <li>O token pode ter expirado - solicite um novo email</li>
                      <li>Entre em contato com o suporte se o problema persistir</li>
                    </ul>
                  </div>
                  
                  <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-4">
                    <Button 
                      variant="primary" 
                      onClick={handleGoToLogin}
                      className="me-md-2"
                    >
                      Ir para Login
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => navigate('/')}
                    >
                      Voltar ao Início
                    </Button>
                  </div>
                </div>
              )}

            </Card.Body>
          </Card>

          {/* Informações adicionais */}
          <div className="text-center mt-4">
            <small className="text-muted">
              Se você não solicitou esta confirmação, pode ignorar este email com segurança.
            </small>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EmailConfirmation;
