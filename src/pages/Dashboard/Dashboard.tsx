// Importações necessárias
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Dashboard.css';

// Componente Dashboard - Página para usuários autenticados
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Função para navegar para a página de explorar destinos
  const handleExplorarDestinos = () => {
    navigate('/'); // Redireciona para a página principal
  };

  // Função para navegar para a página de perfil
  const handleEditarPerfil = () => {
    navigate('/profile'); // Redireciona para a página de perfil
  };

  // Função para navegar para a página de minhas viagens
  const handleMinhasViagens = () => {
    navigate('/my-travels'); // Redireciona para a página de viagens
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
                <h1>Bem-vindo, {user?.name}!</h1>
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

              {/* Informações do usuário - Seção expandida */}
              <Row className="mt-5">
                <Col>
                  <Card className="dashboard-user-info">
                    <Card.Header>
                      <h5 className="mb-0">Informações da Conta</h5>
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

                      {/* Quarta linha - Membro desde */}
                      <Row className="mb-3">
                        <Col md={6}>
                          <Row>
                            <Col sm={4}><strong>Membro desde:</strong></Col>
                            <Col sm={8}>{user?.memberSince}</Col>
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
                            <Col sm={8}>{user?.cep}</Col>
                          </Row>
                        </Col>
                        <Col md={6}>
                          <Row>
                            <Col sm={4}><strong>Logradouro:</strong></Col>
                            <Col sm={8}>{user?.street}</Col>
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
                            <Col sm={8}>{user?.complement || '-'}</Col>
                          </Row>
                        </Col>
                      </Row>

                      {/* Sétima linha - Bairro, Cidade e Estado */}
                      <Row>
                        <Col md={4}>
                          <Row>
                            <Col sm={5}><strong>Bairro:</strong></Col>
                            <Col sm={7}>{user?.neighborhood}</Col>
                          </Row>
                        </Col>
                        <Col md={5}>
                          <Row>
                            <Col sm={4}><strong>Cidade:</strong></Col>
                            <Col sm={8}>{user?.city}</Col>
                          </Row>
                        </Col>
                        <Col md={3}>
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
