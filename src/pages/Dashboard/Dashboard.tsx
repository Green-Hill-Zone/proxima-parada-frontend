// Importações necessárias
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Dashboard.css';

// Componente Dashboard - Página para usuários autenticados
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
                      {/* Primeira linha - 4 colunas de informações principais */}
                      <Row className="mb-3">
                        <Col xl={3} lg={6} md={6}>
                          <Row>
                            <Col sm={5}><strong>Nome:</strong></Col>
                            <Col sm={7}>{user?.name}</Col>
                          </Row>
                        </Col>
                        <Col xl={3} lg={6} md={6}>
                          <Row>
                            <Col sm={4}><strong>Email:</strong></Col>
                            <Col sm={8}>{user?.email}</Col>
                          </Row>
                        </Col>
                        <Col xl={3} lg={6} md={6}>
                          <Row>
                            <Col sm={5}><strong>Data Nasc.:</strong></Col>
                            <Col sm={7}>{user?.birthDate}</Col>
                          </Row>
                        </Col>
                        <Col xl={3} lg={6} md={6}>
                          <Row>
                            <Col sm={4}><strong>CPF:</strong></Col>
                            <Col sm={8}>{user?.cpf}</Col>
                          </Row>
                        </Col>
                      </Row>

                      {/* Segunda linha - 4 colunas de contato */}
                      <Row className="mb-3">
                        <Col xl={3} lg={6} md={6}>
                          <Row>
                            <Col sm={5}><strong>Gênero:</strong></Col>
                            <Col sm={7}>{user?.gender}</Col>
                          </Row>
                        </Col>
                        <Col xl={3} lg={6} md={6}>
                          <Row>
                            <Col sm={5}><strong>Telefone:</strong></Col>
                            <Col sm={7}>{user?.phone}</Col>
                          </Row>
                        </Col>
                        <Col xl={3} lg={6} md={6}>
                          <Row>
                            <Col sm={5}><strong>Telefone 2:</strong></Col>
                            <Col sm={7}>{user?.phone2 || '-'}</Col>
                          </Row>
                        </Col>
                        <Col xl={3} lg={6} md={6}>
                          <Row>
                            <Col sm={5}><strong>Membro desde:</strong></Col>
                            <Col sm={7}>{user?.memberSince}</Col>
                          </Row>
                        </Col>
                      </Row>

                      {/* Seção de Endereço */}
                      <div className="dashboard-section-divider mb-3">
                        <h6 className="text-primary mb-3">Endereço</h6>
                      </div>

                      {/* Terceira linha - 4 colunas de endereço */}
                      <Row className="mb-3">
                        <Col xl={3} lg={6} md={6}>
                          <Row>
                            <Col sm={4}><strong>CEP:</strong></Col>
                            <Col sm={8}>{user?.cep}</Col>
                          </Row>
                        </Col>
                        <Col xl={3} lg={6} md={6}>
                          <Row>
                            <Col sm={5}><strong>Bairro:</strong></Col>
                            <Col sm={7}>{user?.neighborhood}</Col>
                          </Row>
                        </Col>
                        <Col xl={3} lg={6} md={6}>
                          <Row>
                            <Col sm={4}><strong>Cidade:</strong></Col>
                            <Col sm={8}>{user?.city}</Col>
                          </Row>
                        </Col>
                        <Col xl={3} lg={6} md={6}>
                          <Row>
                            <Col sm={4}><strong>UF:</strong></Col>
                            <Col sm={8}>{user?.state}</Col>
                          </Row>
                        </Col>
                      </Row>

                      {/* Quarta linha - Logradouro, Número, Complemento, País */}
                      <Row>
                        <Col xl={4} lg={6} md={6}>
                          <Row>
                            <Col sm={4}><strong>Logradouro:</strong></Col>
                            <Col sm={8}>{user?.street}</Col>
                          </Row>
                        </Col>
                        <Col xl={2} lg={3} md={3}>
                          <Row>
                            <Col sm={5}><strong>Nº:</strong></Col>
                            <Col sm={7}>{user?.streetNumber}</Col>
                          </Row>
                        </Col>
                        <Col xl={3} lg={3} md={3}>
                          <Row>
                            <Col sm={6}><strong>Compl.:</strong></Col>
                            <Col sm={6}>{user?.complement || '-'}</Col>
                          </Row>
                        </Col>
                        <Col xl={3} lg={6} md={6}>
                          <Row>
                            <Col sm={4}><strong>País:</strong></Col>
                            <Col sm={8}>{user?.country || 'Brasil'}</Col>
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
