// Importações necessárias
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { TravelPackage } from '../../contexts/AuthContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './MyTravels.css';

// Componente MyTravels - Página de histórico de viagens do usuário
const MyTravels = () => {
  const { user, getUserTravels } = useAuth();
  const navigate = useNavigate();
  const [travels, setTravels] = useState<TravelPackage[]>([]);
  const [filteredTravels, setFilteredTravels] = useState<TravelPackage[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');

  // Carrega viagens do usuário quando componente monta
  useEffect(() => {
    if (user) {
      const userTravels = getUserTravels(user.id);
      setTravels(userTravels);
      setFilteredTravels(userTravels);
    }
  }, [user, getUserTravels]);

  // Aplica filtros e ordenação
  useEffect(() => {
    let filtered = [...travels];

    // Aplicar filtro por status
    if (filter !== 'all') {
      filtered = filtered.filter(travel => travel.status === filter);
    }

    // Aplicar ordenação
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => {
          const dateA = new Date(a.startDate.split('/').reverse().join('-'));
          const dateB = new Date(b.startDate.split('/').reverse().join('-'));
          return dateB.getTime() - dateA.getTime(); // Mais recente primeiro
        });
        break;
      case 'price':
        filtered.sort((a, b) => b.price - a.price); // Maior preço primeiro
        break;
      case 'destination':
        filtered.sort((a, b) => a.destination.localeCompare(b.destination));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0)); // Maior avaliação primeiro
        break;
    }

    setFilteredTravels(filtered);
  }, [travels, filter, sortBy]);

  // Função para voltar ao dashboard
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Função para formatar preço em Real
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Função para obter badge do status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge bg="success">Concluída</Badge>;
      case 'upcoming':
        return <Badge bg="primary">Próxima</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelada</Badge>;
      default:
        return <Badge bg="secondary">Indefinida</Badge>;
    }
  };

  // Função para obter categoria badge
  const getCategoryBadge = (category: string) => {
    const colors: { [key: string]: string } = {
      'Praia': 'info',
      'Montanha': 'success',
      'Cidade': 'warning',
      'Cultural': 'purple',
      'Natureza': 'success',
      'Ecoturismo': 'success'
    };
    return <Badge bg={colors[category] || 'secondary'}>{category}</Badge>;
  };

  // Função para renderizar estrelas de avaliação
  const renderStars = (rating?: number) => {
    if (!rating) return <span className="text-muted">Não avaliado</span>;
    
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-warning' : 'text-muted'}>
          ★
        </span>
      );
    }
    return <div className="travel-rating">{stars}</div>;
  };

  return (
    <>
      {/* Header com navegação */}
      <Header />
      
      {/* Conteúdo principal */}
      <main className="my-travels-main">
        <Container>
          <Row className="justify-content-center">
            <Col lg={12}>
              
              {/* Cabeçalho da página */}
              <div className="my-travels-header">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h1>Minhas Viagens</h1>
                    <p className="lead">Acompanhe seu histórico de aventuras e próximas viagens</p>
                  </div>
                  <Button
                    variant="outline-secondary"
                    onClick={handleBackToDashboard}
                    className="my-travels-back-button"
                  >
                    ← Voltar ao Dashboard
                  </Button>
                </div>
              </div>

              {/* Filtros e Ordenação */}
              <Card className="my-travels-filters mb-4">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Filtrar por status:</Form.Label>
                        <Form.Select
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                          className="my-travels-filter-select"
                        >
                          <option value="all">Todas as viagens</option>
                          <option value="completed">Concluídas</option>
                          <option value="upcoming">Próximas</option>
                          <option value="cancelled">Canceladas</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Ordenar por:</Form.Label>
                        <Form.Select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="my-travels-sort-select"
                        >
                          <option value="date">Data (mais recente)</option>
                          <option value="price">Preço (maior)</option>
                          <option value="destination">Destino (A-Z)</option>
                          <option value="rating">Avaliação (maior)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Estatísticas rápidas */}
              <Row className="my-travels-stats mb-4">
                <Col md={4}>
                  <Card className="stat-card text-center">
                    <Card.Body>
                      <h3 className="stat-number text-primary">{travels.length}</h3>
                      <p className="stat-label">Total de Viagens</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="stat-card text-center">
                    <Card.Body>
                      <h3 className="stat-number text-success">
                        {travels.filter(t => t.status === 'completed').length}
                      </h3>
                      <p className="stat-label">Concluídas</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="stat-card text-center">
                    <Card.Body>
                      <h3 className="stat-number text-warning">
                        {travels.filter(t => t.status === 'upcoming').length}
                      </h3>
                      <p className="stat-label">Próximas</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Lista de Viagens */}
              {filteredTravels.length === 0 ? (
                <Alert variant="info" className="text-center">
                  <h5>Nenhuma viagem encontrada</h5>
                  <p>
                    {filter === 'all' 
                      ? 'Você ainda não possui viagens registradas.' 
                      : `Não há viagens com o status "${filter === 'completed' ? 'concluídas' : filter === 'upcoming' ? 'próximas' : 'canceladas'}".`
                    }
                  </p>
                </Alert>
              ) : (
                <Row>
                  {filteredTravels.map((travel) => (
                    <Col lg={6} xl={4} key={travel.id} className="mb-4">
                      <Card className="travel-card h-100">
                        
                        {/* Imagem do destino */}
                        <div className="travel-image-container">
                          <Card.Img 
                            variant="top" 
                            src={travel.imageUrl} 
                            alt={travel.destination}
                            className="travel-image"
                          />
                          <div className="travel-status-overlay">
                            {getStatusBadge(travel.status)}
                          </div>
                        </div>

                        <Card.Body className="d-flex flex-column">
                          
                          {/* Cabeçalho do card */}
                          <div className="travel-header mb-3">
                            <Card.Title className="travel-title">{travel.title}</Card.Title>
                            <div className="travel-destination text-muted mb-2">
                              📍 {travel.destination}
                            </div>
                            <div className="travel-badges">
                              {getCategoryBadge(travel.category)}
                            </div>
                          </div>

                          {/* Informações da viagem */}
                          <div className="travel-info mb-3">
                            <div className="travel-dates mb-2">
                              <strong>Período:</strong> {travel.startDate} a {travel.endDate}
                            </div>
                            <div className="travel-duration mb-2">
                              <strong>Duração:</strong> {travel.duration} dias
                            </div>
                            <div className="travel-price mb-2">
                              <strong>Valor:</strong> <span className="text-success fw-bold">{formatPrice(travel.price)}</span>
                            </div>
                          </div>

                          {/* Descrição */}
                          <p className="travel-description">{travel.description}</p>

                          {/* Inclui */}
                          <div className="travel-includes mb-3">
                            <strong>Inclui:</strong>
                            <ul className="includes-list">
                              {travel.includes.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Avaliação e Review (apenas para viagens concluídas) */}
                          {travel.status === 'completed' && (
                            <div className="travel-review mt-auto">
                              <hr />
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <strong>Sua Avaliação:</strong>
                                {renderStars(travel.rating)}
                              </div>
                              {travel.review && (
                                <blockquote className="travel-review-text">
                                  "{travel.review}"
                                </blockquote>
                              )}
                            </div>
                          )}

                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}

            </Col>
          </Row>
        </Container>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default MyTravels;
