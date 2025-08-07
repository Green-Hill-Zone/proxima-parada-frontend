// Importações necessárias
import { Alert, Badge, Button, Card, Col, Container, Row } from 'react-bootstrap';
import { FaBox, FaCalendarAlt, FaChartLine, FaHotel, FaPlane, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth, useIsAdmin } from '../../hooks/useAuth';
import { usePageTitle, PAGE_TITLES } from '../../hooks';
import PerformanceChart from './components/PerformanceChart';
import './AdminDashboard.css';

// Componente AdminDashboard - Painel administrativo
const AdminDashboard = () => {
  // Define o título da página
  usePageTitle(PAGE_TITLES.ADMIN_DASHBOARD);
  
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();

  // Se não for admin, mostra mensagem de acesso negado
  if (!isAdmin) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <h4>Acesso Negado</h4>
          <p>Você não tem permissão para acessar esta área administrativa.</p>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            Voltar ao Dashboard
          </Button>
        </Alert>
      </Container>
    );
  }

  // Dados mockados para demonstração
  const recentVisitors = [
    { name: 'João Silva', email: 'joao@email.com', date: '05 Out, 2024', action: 'Reservou Paris Romântico' },
    { name: 'Maria Santos', email: 'maria@email.com', date: '04 Out, 2024', action: 'Visualizou Cancún' },
    { name: 'Carlos Oliveira', email: 'carlos@email.com', date: '03 Out, 2024', action: 'Finalizou Compra' },
    { name: 'Ana Costa', email: 'ana@email.com', date: '02 Out, 2024', action: 'Cadastrou-se' },
  ];

  const trendingPackages = [
    { id: 1, name: 'Paris Romântico', location: 'Paris, França', bookings: 156, image: '/api/placeholder/300/200' },
    { id: 2, name: 'Cancún Tropical', location: 'Cancún, México', bookings: 142, image: '/api/placeholder/300/200' },
    { id: 3, name: 'Nova York Urbano', location: 'Nova York, EUA', bookings: 128, image: '/api/placeholder/300/200' },
    { id: 4, name: 'Tóquio Cultural', location: 'Tóquio, Japão', bookings: 89, image: '/api/placeholder/300/200' },
  ];

  return (
    <>
      {/* Conteúdo principal do dashboard administrativo */}
      <main className="admin-dashboard-main">
        <Container>
          {/* Cabeçalho */}
          <div className="admin-header mb-4">
            <h1>Dashboard</h1>
            <p className="text-muted">Bem-vindo de volta, {user?.name}!</p>
          </div>

          <Row>
            {/* Menu Horizontal no Topo */}
            <Col xs={12} className="mb-4">
              <div className="admin-sidebar-horizontal">
                <div className="sidebar-menu-horizontal">
                  <div className="menu-item active">
                    <FaChartLine className="me-2" />
                    Dashboard
                  </div>
                  <div className="menu-item" onClick={() => navigate('/admin/packages')}>
                    <FaBox className="me-2" />
                    Pacotes
                  </div>
                  <div className="menu-item" onClick={() => navigate('/admin/hotels')}>
                    <FaHotel className="me-2" />
                    Hotéis
                  </div>
                  <div className="menu-item" onClick={() => navigate('/admin/flights')}>
                    <FaPlane className="me-2" />
                    Voos
                  </div>
                  <div className="menu-item" onClick={() => navigate('/admin/sales')}>
                    <FaUsers className="me-2" />
                    Relatórios
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            {/* Conteúdo Principal */}
            <Col xs={12}>
              {/* Cards de estatísticas */}
              <Row className="stats-row mb-4">
                <Col md={3}>
                  <div className="stat-card">
                    <div className="stat-content">
                      <div className="stat-number">240</div>
                      <div className="stat-label">Total de Visitas</div>
                      <div className="stat-change positive">
                        <small>↗ 23%</small>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="stat-card">
                    <div className="stat-content">
                      <div className="stat-number">15</div>
                      <div className="stat-label">Viagens Canceladas</div>
                      <div className="stat-change negative">
                        <small>↘ 1,5%</small>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="stat-card">
                    <div className="stat-content">
                      <div className="stat-number">24</div>
                      <div className="stat-label">Na Fila</div>
                      <div className="stat-change positive">
                        <small>↗ 1,6%</small>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="stat-card">
                    <div className="stat-content">
                      <div className="stat-number">56</div>
                      <div className="stat-label">Lugares de Interesse</div>
                      <div className="stat-change positive">
                        <small>↗ 6,8%</small>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Layout em 2 Colunas - Conteúdo Principal */}
              <Row className="mb-4">
                {/* Coluna 1: Destinos em Alta */}
                <Col lg={8} xl={8} className="mb-4">
                  <div className="trending-section h-100">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5>Destinos em Alta</h5>
                      <Button variant="link" className="see-all-btn">Ver Todos</Button>
                    </div>
                    <Row>
                      {trendingPackages.map((pkg) => (
                        <Col xs={6} key={pkg.id} className="mb-3">
                          <Card className="trending-card">
                            <div className="card-image-container">
                              <div className="card-image-placeholder">
                                <FaBox size={24} />
                              </div>
                              <Badge bg="primary" className="card-badge">
                                {pkg.bookings} reservas
                              </Badge>
                            </div>
                            <Card.Body className="p-3">
                              <h6 className="mb-1">{pkg.name}</h6>
                              <small className="text-muted">{pkg.location}</small>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Col>

                {/* Coluna 2: Viagens Este Mês e Performance */}
                <Col lg={4} xl={4} className="mb-4">
                  <div className="d-flex flex-column h-100">
                    <Card className="calendar-card mb-3 flex-grow-1">
                      <Card.Header className="border-0">
                        <h6 className="mb-0">Viagens Este Mês</h6>
                      </Card.Header>
                      <Card.Body>
                        <div className="calendar-placeholder">
                          <FaCalendarAlt size={32} className="text-muted" />
                          <p className="text-muted mt-2 small">Agosto 2025</p>
                        </div>
                      </Card.Body>
                    </Card>
                    
                    {/* Performance Chart */}
                    <Card className="chart-card flex-grow-1">
                      <Card.Header className="border-0">
                        <h6 className="mb-0">Performance</h6>
                      </Card.Header>
                      <Card.Body className="p-0">
                        <PerformanceChart />
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
              </Row>

              {/* Seção dos Próximos Visitantes - Largura Total */}
              <Row className="mb-4">
                <Col xs={12}>
                  <Card className="visitors-card">
                    <Card.Header className="border-0">
                      <h5 className="mb-0">Próximos Visitantes</h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                      <Row>
                        {recentVisitors.map((visitor, index) => (
                          <Col md={6} lg={3} key={index} className="mb-3 mb-lg-0">
                            <div className="visitor-item">
                              <div className="visitor-avatar">
                                <FaUsers />
                              </div>
                              <div className="visitor-info">
                                <div className="visitor-name">{visitor.name}</div>
                                <div className="visitor-date">{visitor.date}</div>
                                <div className="visitor-action">{visitor.action}</div>
                              </div>
                              <Button variant="link" size="sm" className="details-btn">
                                Detalhes
                              </Button>
                            </div>
                          </Col>
                        ))}
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

export default AdminDashboard;
