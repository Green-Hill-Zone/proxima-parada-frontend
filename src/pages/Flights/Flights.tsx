/* ===================================================================== */
/* PÁGINA DE VOOS - LISTAGEM E BUSCA                                   */
/* ===================================================================== */
/*
 * Página para exibir voos disponíveis com funcionalidades de busca.
 * Segue os princípios:
 * - KISS: Interface simples e intuitiva
 * - DRY: Reutiliza componentes existentes
 * - YAGNI: Funcionalidades essenciais
 */

import { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert, Form, Button, Card, Pagination } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { getAllFlights, getFlightsByRoute, type Flight } from '../../services/FlightService';
import { usePageTitle, PAGE_TITLES } from '../../hooks';
import FlightCard from './components/FlightCard';
import './Flights.css';

// Componente principal da página de voos
const Flights = () => {
  // Define o título da página
  usePageTitle(PAGE_TITLES.FLIGHTS);
  // Estados do componente
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const FLIGHTS_PER_PAGE = 4;

  // Hooks de navegação
  const location = useLocation();

  // Estados para filtros de busca
  const [filters, setFilters] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: ''
  });

  /* ================================================================= */
  /* EFEITOS E CARREGAMENTO INICIAL                                  */
  /* ================================================================= */

  // Carrega voos ao montar o componente
  useEffect(() => {
    loadFlights();
  }, [location.search]);

  // Função para carregar voos
  const loadFlights = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Verifica se há parâmetros de busca na URL
      const searchParams = new URLSearchParams(location.search);
      const originId = searchParams.get('origin');
      const destinationId = searchParams.get('destination');
      
      let flightsData: Flight[];
      
      if (originId && destinationId) {
        // Busca por rota específica
        console.log(`Buscando voos de ${originId} para ${destinationId}`);
        flightsData = await getFlightsByRoute(parseInt(originId), parseInt(destinationId));
      } else {
        // Carrega todos os voos
        console.log('Carregando todos os voos');
        flightsData = await getAllFlights();
      }
      
      setFlights(flightsData);
      setCurrentPage(1); // Reset página quando carrega novos voos
      console.log(`✅ ${flightsData.length} voos carregados`);
      
    } catch (err) {
      console.error('❌ Erro ao carregar voos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar voos');
    } finally {
      setIsLoading(false);
    }
  };

  /* ================================================================= */
  /* MANIPULADORES DE EVENTOS                                        */
  /* ================================================================= */

  // Atualiza filtros de busca
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Executa busca com filtros
  const handleSearch = async () => {
    try {
      setSearchLoading(true);
      setError(null);
      
      // Por enquanto, busca todos os voos (pode ser expandido depois)
      const flightsData = await getAllFlights();
      setFlights(flightsData);
      setCurrentPage(1); // Reset página após busca
      
    } catch (err) {
      console.error('❌ Erro na busca:', err);
      setError(err instanceof Error ? err.message : 'Erro na busca');
    } finally {
      setSearchLoading(false);
    }
  };

  // Limpa filtros
  const handleClearFilters = () => {
    setFilters({
      origin: '',
      destination: '',
      departureDate: '',
      returnDate: ''
    });
    setCurrentPage(1); // Reset página
    loadFlights();
  };

  // Seleciona um voo (pode expandir funcionalidade depois)
  const handleSelectFlight = (flight: Flight) => {
    console.log('Voo selecionado:', flight);
    // YAGNI: Implementar navegação para detalhes depois se necessário
  };

  // Inicia processo de reserva
  const handleBookFlight = (flight: Flight) => {
    console.log('Iniciando reserva do voo:', flight);
    // YAGNI: Integrar com sistema de reservas depois
    alert(`Funcionalidade de reserva será implementada em breve!\nVoo: ${flight.flightNumber}`);
  };

  /* ================================================================= */
  /* LÓGICA DE PAGINAÇÃO                                             */
  /* ================================================================= */
  /*
   * Sistema de paginação que divide os voos em páginas de 4 itens.
   * Características:
   * - Mostra 4 voos por página (FLIGHTS_PER_PAGE)
   * - Reset automático da página ao carregar novos voos
   * - Navegação com First, Previous, Next, Last
   * - Páginas numeradas com ellipsis quando necessário
   * - Scroll suave ao trocar de página
   * - Responsivo para dispositivos móveis
   */

  // Calcula os voos da página atual
  const getCurrentPageFlights = () => {
    const startIndex = (currentPage - 1) * FLIGHTS_PER_PAGE;
    const endIndex = startIndex + FLIGHTS_PER_PAGE;
    return flights.slice(startIndex, endIndex);
  };

  // Calcula o número total de páginas
  const getTotalPages = () => {
    return Math.ceil(flights.length / FLIGHTS_PER_PAGE);
  };

  // Navega para uma página específica
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll suave para o topo da lista de voos
    document.querySelector('.flights-count')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start' 
    });
  };

  /* ================================================================= */
  /* RENDERIZAÇÃO                                                     */
  /* ================================================================= */

  return (
    <div className="flights-page">
      <Container>
        <Row>
          <Col>
            {/* Cabeçalho da Página */}
            <div className="flights-header mb-4">
              <h1>Voos Disponíveis</h1>
              <p className="lead">
                Encontre o voo perfeito para seu destino
              </p>
            </div>

            {/* Filtros de Busca */}
            <Card className="search-filters mb-4">
              <Card.Header>
                <h5 className="mb-0">🔍 Buscar Voos</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Origem</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Cidade de origem"
                        value={filters.origin}
                        onChange={(e) => handleFilterChange('origin', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Destino</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Cidade de destino"
                        value={filters.destination}
                        onChange={(e) => handleFilterChange('destination', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Partida</Form.Label>
                      <Form.Control
                        type="date"
                        value={filters.departureDate}
                        onChange={(e) => handleFilterChange('departureDate', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Volta</Form.Label>
                      <Form.Control
                        type="date"
                        value={filters.returnDate}
                        onChange={(e) => handleFilterChange('returnDate', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2} className="d-flex align-items-end">
                    <div className="d-flex gap-2 mb-3">
                      <Button 
                        variant="primary" 
                        onClick={handleSearch}
                        disabled={searchLoading}
                      >
                        {searchLoading ? <Spinner size="sm" /> : 'Buscar'}
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        onClick={handleClearFilters}
                      >
                        Limpar
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Área de Conteúdo */}
            {isLoading ? (
              // Estado de carregamento
              <div className="text-center py-5">
                <Spinner animation="border" role="status" className="me-2" />
                <span>Carregando voos...</span>
              </div>
            ) : error ? (
              // Estado de erro
              <Alert variant="danger" className="mb-4">
                <Alert.Heading>Ops! Algo deu errado</Alert.Heading>
                <p>{error}</p>
                <Button variant="outline-danger" onClick={loadFlights}>
                  Tentar Novamente
                </Button>
              </Alert>
            ) : flights.length === 0 ? (
              // Estado vazio
              <Alert variant="info" className="mb-4">
                <Alert.Heading>Nenhum voo encontrado</Alert.Heading>
                <p>Não encontramos voos para os critérios selecionados.</p>
                <Button variant="outline-info" onClick={handleClearFilters}>
                  Ver Todos os Voos
                </Button>
              </Alert>
            ) : (
              // Lista de voos com paginação
              <>
                <div className="flights-count mb-3">
                  <p className="text-muted">
                    {flights.length} {flights.length === 1 ? 'voo encontrado' : 'voos encontrados'}
                    {flights.length > FLIGHTS_PER_PAGE && (
                      <span className="ms-2">
                        | Página {currentPage} de {getTotalPages()}
                      </span>
                    )}
                  </p>
                </div>
                
                <Row>
                  {getCurrentPageFlights().map((flight) => (
                    <Col key={flight.id} lg={6} className="mb-4">
                      <FlightCard
                        flight={flight}
                        onSelect={handleSelectFlight}
                        onBookNow={handleBookFlight}
                      />
                    </Col>
                  ))}
                </Row>

                {/* Controles de Paginação */}
                {flights.length > FLIGHTS_PER_PAGE && (
                  <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                      <Pagination.First 
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                      />
                      <Pagination.Prev 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      />
                      
                      {/* Páginas numeradas */}
                      {Array.from({ length: getTotalPages() }, (_, index) => {
                        const page = index + 1;
                        const isCurrentPage = page === currentPage;
                        
                        // Mostra páginas próximas à atual (máximo 5 páginas visíveis)
                        const showPage = 
                          page === 1 || 
                          page === getTotalPages() || 
                          Math.abs(page - currentPage) <= 2;
                        
                        if (!showPage) {
                          // Mostra "..." se necessário
                          if (page === currentPage - 3 || page === currentPage + 3) {
                            return <Pagination.Ellipsis key={page} disabled />;
                          }
                          return null;
                        }
                        
                        return (
                          <Pagination.Item
                            key={page}
                            active={isCurrentPage}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Pagination.Item>
                        );
                      })}
                      
                      <Pagination.Next 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === getTotalPages()}
                      />
                      <Pagination.Last 
                        onClick={() => handlePageChange(getTotalPages())}
                        disabled={currentPage === getTotalPages()}
                      />
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Flights;
