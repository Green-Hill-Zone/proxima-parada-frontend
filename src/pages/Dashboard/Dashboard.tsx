// Importações necessárias
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Dashboard.css';

// Componente Dashboard - Página para usuários autenticados
const Dashboard = () => {
  const { user } = useAuth();

  return (
    <>
      {/* Header com navegação */}
      <Header />
      
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
                      <Button variant="primary" className="dashboard-card-button">
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
                      <Button variant="outline-primary" className="dashboard-card-button">
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
                      <Button variant="outline-secondary" className="dashboard-card-button">
                        Editar Perfil
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Informações do usuário */}
              <Row className="mt-5">
                <Col>
                  <Card className="dashboard-user-info">
                    <Card.Header>
                      <h5 className="mb-0">Informações da Conta</h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col sm={3}><strong>Nome:</strong></Col>
                        <Col>{user?.name}</Col>
                      </Row>
                      <Row className="mt-2">
                        <Col sm={3}><strong>Email:</strong></Col>
                        <Col>{user?.email}</Col>
                      </Row>
                      <Row className="mt-2">
                        <Col sm={3}><strong>Membro desde:</strong></Col>
                        <Col>Janeiro 2024</Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Dashboard;
