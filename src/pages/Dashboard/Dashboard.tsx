// Importações necessárias
import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePageTitle, PAGE_TITLES } from '../../hooks';
import './Dashboard.css';
import { useState, useEffect } from 'react';
import { resendEmailConfirmation, checkEmailConfirmationStatus, getUserById, adaptUserToAuthUser } from '../../services/UserService';

// Componente Dashboard - Página para usuários autenticados
const Dashboard = () => {
  // Define o título da página
  usePageTitle(PAGE_TITLES.DASHBOARD);
  
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  // Verifica periodicamente se o email foi confirmado (caso o usuário confirme em outra aba)
  useEffect(() => {
    // Só verifica se o usuário estiver logado e o email ainda não estiver confirmado
    if (!user || !user.id || user.isEmailConfirmed) {
      return;
    }

    const checkEmailStatus = async () => {
      try {
        console.log('🔄 Verificando status de confirmação de email no Dashboard');
        
        // Busca os dados atualizados do usuário
        const updatedUserData = await getUserById(parseInt(user.id));
        
        // Se o status mudou (foi confirmado), atualiza o contexto
        if (updatedUserData.isEmailConfirmed && !user.isEmailConfirmed) {
          console.log('✅ Email foi confirmado! Atualizando contexto...');
          
          // Adapta para o formato do contexto preservando dados existentes
          const updatedAuthUser = adaptUserToAuthUser(updatedUserData, user);
          
          // Atualiza o contexto
          updateUser(updatedAuthUser);
        }
      } catch (error) {
        console.error('❌ Erro ao verificar status de confirmação no Dashboard:', error);
      }
    };

    // Verifica imediatamente
    checkEmailStatus();

    // Configura verificação periódica a cada 30 segundos
    const interval = setInterval(checkEmailStatus, 30000);

    // Cleanup: remove o interval quando o componente for desmontado
    return () => {
      clearInterval(interval);
    };
  }, [user?.id, user?.isEmailConfirmed, updateUser]); // Dependências para re-executar o efeito

  // Função para reenviar email de confirmação
  const handleResendEmailConfirmation = async () => {
    if (!user?.id) return;

    setIsResendingEmail(true);
    try {
      await resendEmailConfirmation(Number(user.id));
      alert('Email de confirmação reenviado com sucesso!');
    } catch (error) {
      console.error('Erro ao reenviar email de confirmação:', error);
      alert('Erro ao reenviar o email. Por favor, tente novamente.');
    } finally {
      setIsResendingEmail(false);
    }
  };

  // Função para navegar para a página de pacotes
  const handleExplorarDestinos = () => {
    navigate('/packages'); // Redireciona para a página de pacotes
  };

  // Função para navegar para a página de perfil
  const handleEditarPerfil = () => {
    navigate('/profile'); // Redireciona para a página de perfil
  };

  // Função para navegar para a página de minhas viagens
  const handleMinhasViagens = () => {
    navigate('/my-travels'); // Redireciona para a página de viagens
  };

  // Função para navegar para a página de meus pagamentos
  const handleMeusPagamentos = () => {
    navigate('/my-payments'); // Redireciona para a página de pagamentos
  };

  return (
    <>


      {/* Conteúdo principal do dashboard */}
      <main className="dashboard-main">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              {/* Título de boas-vindas */}
              <div className="dashboard-welcome">
                <h1>Olá, {user?.name}!</h1>
                <p className="lead">Gerencie suas viagens e explore novos destinos.</p>
              </div>

              {/* Aviso de confirmação de email */}
              {user && user.isEmailConfirmed === false && (
                <Alert variant="warning" className="mb-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <Alert.Heading>⚠️ Email não confirmado</Alert.Heading>
                      <p>
                        Seu email ainda não foi confirmado. Para ter acesso completo a todas as 
                        funcionalidades, confirme seu email clicando no link enviado para {user.email}.
                      </p>
                      <p className="mb-0">
                        Não recebeu o email? Verifique sua caixa de spam ou clique no botão ao lado para reenviar.
                      </p>
                    </div>
                    <Button 
                      variant="outline-warning"
                      className="ms-3"
                      onClick={handleResendEmailConfirmation}
                      disabled={isResendingEmail}
                    >
                      {isResendingEmail ? 'Enviando...' : 'Reenviar Email'}
                    </Button>
                  </div>
                </Alert>
              )}

              {/* Cards com funcionalidades */}
              <Row className="dashboard-cards">
                {/* Card - Minhas Viagens */}
                <Col md={4} className="mb-4">
                  <Card className="dashboard-card h-100">
                    <Card.Body className="text-center">
                      <div className="dashboard-card-icon">
                        ✈️
                      </div>
                      <Card.Title>Minhas Viagens</Card.Title>
                      <Card.Text>
                        Veja e gerencie suas viagens planejadas e histórico de destinos visitados.
                      </Card.Text>
                      <Button
                        variant="primary"
                        className="dashboard-card-button btn-standard"
                        onClick={handleMinhasViagens}
                      >
                        Ver Viagens
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Card - Explorar Destinos */}
                <Col md={4} className="mb-4">
                  <Card className="dashboard-card h-100">
                    <Card.Body className="text-center">
                      <div className="dashboard-card-icon">
                        🗺️
                      </div>
                      <Card.Title>Explorar Destinos</Card.Title>
                      <Card.Text>
                        Descubra novos lugares incríveis e planeje sua próxima aventura.
                      </Card.Text>
                      <Button
                        variant="primary"
                        className="dashboard-card-button btn-standard"
                        onClick={handleExplorarDestinos}
                      >
                        Explorar
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Card - Perfil */}
                <Col md={4} className="mb-4">
                  <Card className="dashboard-card h-100">
                    <Card.Body className="text-center">
                      <div className="dashboard-card-icon">
                        👤
                      </div>
                      <Card.Title>Meu Perfil</Card.Title>
                      <Card.Text>
                        Atualize suas informações pessoais e preferências de viagem.
                      </Card.Text>
                      <Button
                        variant="primary"
                        className="dashboard-card-button btn-standard"
                        onClick={handleEditarPerfil}
                      >
                        Editar Perfil
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Segunda linha de cards */}
              <Row className="dashboard-cards">
                {/* Card - Meus Pagamentos */}
                <Col md={4} className="mb-4">
                  <Card className="dashboard-card h-100">
                    <Card.Body className="text-center">
                      <div className="dashboard-card-icon">
                        💳
                      </div>
                      <Card.Title>Meus Pagamentos</Card.Title>
                      <Card.Text>
                        Acompanhe o status dos seus pagamentos e transações realizadas.
                      </Card.Text>
                      <Button
                        variant="primary"
                        className="dashboard-card-button btn-standard"
                        onClick={handleMeusPagamentos}
                      >
                        Ver Pagamentos
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Informações do usuário - Seção expandida */}
              <Row className="mt-5">
                <Col>
                  <Card className="dashboard-user-info">
                    <Card.Header>
                      <h5 className="mb-0">Informações da Conta - {user?.name}</h5>
                    </Card.Header>
                    <Card.Body>
                      {/* Primeira linha - Nome e Email */}
                      <Row className="mb-3">
                        <Col md={6}>
                          <Row>
                            <Col sm={4}><strong>Nome:</strong></Col>
                            <Col sm={8}>{user?.name}</Col>
                          </Row>
                        </Col>
                        <Col md={6}>
                          <Row>
                            <Col sm={4}><strong>Email:</strong></Col>
                            <Col sm={8}>{user?.email}</Col>
                          </Row>
                        </Col>
                      </Row>

                      {/* Segunda linha - Data de Nascimento e CPF */}
                      <Row className="mb-3">
                        <Col md={6}>
                          <Row>
                            <Col sm={4}><strong>Data de Nascimento:</strong></Col>
                            <Col sm={8}>{user?.birthDate}</Col>
                          </Row>
                        </Col>
                        <Col md={6}>
                          <Row>
                            <Col sm={4}><strong>CPF:</strong></Col>
                            <Col sm={8}>{user?.cpf}</Col>
                          </Row>
                        </Col>
                      </Row>

                      {/* Terceira linha - Gênero e Telefone */}
                      <Row className="mb-3">
                        <Col md={6}>
                          <Row>
                            <Col sm={4}><strong>Gênero:</strong></Col>
                            <Col sm={8}>{user?.gender}</Col>
                          </Row>
                        </Col>
                        <Col md={6}>
                          <Row>
                            <Col sm={4}><strong>Telefone:</strong></Col>
                            <Col sm={8}>{user?.phone}</Col>
                          </Row>
                        </Col>
                      </Row>

                      {/* Quarta linha - Membro desde e Telefone 2 */}
                      <Row className="mb-3">
                        <Col md={6}>
                          <Row>
                            <Col sm={4}><strong>Membro desde:</strong></Col>
                            <Col sm={8}>{user?.memberSince}</Col>
                          </Row>
                        </Col>
                        <Col md={6}>
                          <Row>
                            <Col sm={4}><strong>Telefone 2:</strong></Col>
                            <Col sm={8}>{user?.phone2 || '(21) 98888-5679'}</Col>
                          </Row>
                        </Col>
                      </Row>

                      {/* Seção de Endereço */}
                      <div className="dashboard-section-divider mb-3">
                        <h6 className="text-primary mb-3">Endereço</h6>
                      </div>

                      {/* Quinta linha - CEP e Logradouro */}
                      <Row className="mb-3">
                        <Col md={6}>
                          <Row>
                            <Col sm={4}><strong>CEP:</strong></Col>
                            <Col sm={3}>{user?.cep}</Col>
                          </Row>
                        </Col>
                        <Col md={6}>
                          <Row>
                            <Col sm={4}><strong>Logradouro:</strong></Col>
                            <Col sm={3}>{user?.street}</Col>
                          </Row>
                        </Col>
                      </Row>

                      {/* Sexta linha - Número e Complemento */}
                      <Row className="mb-3">
                        <Col md={6}>
                          <Row>
                            <Col sm={4}><strong>Número:</strong></Col>
                            <Col sm={8}>{user?.streetNumber}</Col>
                          </Row>
                        </Col>
                        <Col md={6}>
                          <Row>
                            <Col sm={4}><strong>Complemento:</strong></Col>
                            <Col sm={3}>{user?.complement || '-'}</Col>
                          </Row>
                        </Col>
                      </Row>

                      {/* Sétima linha - Bairro e Cidade */}
                      <Row className="mb-3">
                        <Col md={6}>
                          <Row>
                            <Col sm={4}><strong>Bairro:</strong></Col>
                            <Col sm={3}>{user?.neighborhood}</Col>
                          </Row>
                        </Col>
                        <Col md={6}>
                          <Row>
                            <Col sm={4}><strong>Cidade:</strong></Col>
                            <Col sm={3}>{user?.city}</Col>
                          </Row>
                        </Col>
                      </Row>

                      {/* Oitava linha - País e UF */}
                      <Row>
                        <Col md={6}>
                          <Row>
                            <Col sm={4}><strong>País:</strong></Col>
                            <Col sm={8}>{user?.country || 'Brasil'}</Col>
                          </Row>
                        </Col>
                        <Col md={6}>
                          <Row>
                            <Col sm={4}><strong>UF:</strong></Col>
                            <Col sm={8}>{user?.state}</Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </main>


    </>
  );
};

export default Dashboard;
