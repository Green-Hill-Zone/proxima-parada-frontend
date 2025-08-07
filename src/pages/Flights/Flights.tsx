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

import { useEffect, useState, useMemo } from 'react';
import { Container, Row, Col, Spinner, Alert, Form, Button, Card, Pagination, Stack } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { getAllFlights, getFlightsByRoute, isFlightInternational, matchesFlightClass, type Flight } from '../../services/FlightService';
import { usePageTitle, PAGE_TITLES } from '../../hooks';
import { normalizeText } from '../../utils/textUtils';
import FlightCard from './components/FlightCard';
import './Flights.css';

// Componente principal da página de voos
const Flights = () => {
  // Define o título da página
  usePageTitle(PAGE_TITLES.FLIGHTS);
  // Estados do componente
  const [flights, setFlights] = useState<Flight[]>([]);
  const [allFlights, setAllFlights] = useState<Flight[]>([]);
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
    returnDate: '',
    cabinClass: '',
    seatClass: '',
    flightType: '', // 'national', 'international', ou ''
    minPrice: '',
    maxPrice: ''
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
      
      setAllFlights(flightsData);
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

  // Filtrar voos com base nos filtros
  const filteredFlights = useMemo(() => {
    let result = allFlights;

    // Filtro por origem (dos filtros avançados)
    if (filters.origin.trim()) {
      const originNormalized = normalizeText(filters.origin);
      result = result.filter(flight => {
        const originName = normalizeText(flight.originDestination.name);
        const originCountry = normalizeText(flight.originDestination.country);
        const originCity = normalizeText(flight.originDestination.city || '');
        
        return originName.includes(originNormalized) ||
               originCountry.includes(originNormalized) ||
               originCity.includes(originNormalized);
      });
    }

    // Filtro por destino (dos filtros avançados)
    if (filters.destination.trim()) {
      const destinationNormalized = normalizeText(filters.destination);
      result = result.filter(flight => {
        const destinationName = normalizeText(flight.finalDestination.name);
        const destinationCountry = normalizeText(flight.finalDestination.country);
        const destinationCity = normalizeText(flight.finalDestination.city || '');
        
        return destinationName.includes(destinationNormalized) ||
               destinationCountry.includes(destinationNormalized) ||
               destinationCity.includes(destinationNormalized);
      });
    }

    // Filtro por data de partida
    if (filters.departureDate) {
      const searchDate = new Date(filters.departureDate);
      result = result.filter(flight => {
        const flightDate = new Date(flight.departureDateTime);
        return flightDate.toDateString() === searchDate.toDateString();
      });
    }

    // Filtro por classe da cabine
    if (filters.cabinClass.trim()) {
      result = result.filter(flight => 
        matchesFlightClass(flight.cabinClass, filters.cabinClass)
      );
    }

    // Filtro por classe do assento
    if (filters.seatClass.trim()) {
      result = result.filter(flight => 
        matchesFlightClass(flight.seatClass || '', filters.seatClass)
      );
    }

    // Filtro por tipo de voo (nacional/internacional)
    if (filters.flightType) {
      const isInternational = filters.flightType === 'international';
      result = result.filter(flight => 
        isFlightInternational(flight) === isInternational
      );
    }

    // Filtro por preço mínimo
    if (filters.minPrice.trim()) {
      const minPrice = parseFloat(filters.minPrice);
      if (!isNaN(minPrice)) {
        result = result.filter(flight => 
          (flight.price || 0) >= minPrice
        );
      }
    }

    // Filtro por preço máximo
    if (filters.maxPrice.trim()) {
      const maxPrice = parseFloat(filters.maxPrice);
      if (!isNaN(maxPrice)) {
        result = result.filter(flight => 
          (flight.price || 0) <= maxPrice
        );
      }
    }

    return result;
  }, [allFlights, filters]);

  // Atualizar flights quando filteredFlights mudar
  useEffect(() => {
    setFlights(filteredFlights);
    setCurrentPage(1); // Reset página quando filtros mudam
  }, [filteredFlights]);

  // Atualiza filtros de busca
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Executa busca com filtros (agora usa o filtro reativo)
  const handleSearch = async () => {
    try {
      setSearchLoading(true);
      setError(null);
      
      // Os filtros já são aplicados automaticamente através do useMemo
      // Esta função pode ser usada para busca no backend futuramente
      console.log('Busca aplicada automaticamente');
      
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
      returnDate: '',
      cabinClass: '',
      seatClass: '',
      flightType: '',
      minPrice: '',
      maxPrice: ''
    });
    setCurrentPage(1); // Reset página
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

  // Função auxiliar para detectar telas pequenas
  const isSmallScreen = () => {
    return window.innerWidth < 576;
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
                <h5 className="mb-0">Filtros de Busca</h5>
              </Card.Header>
              <Card.Body>
                {/* Primeira linha de filtros */}
                <Row>
                  <Col xs={12} md={6} lg={3}>
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
                  <Col xs={12} md={6} lg={3}>
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
                  <Col xs={6} md={6} lg={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Partida</Form.Label>
                      <Form.Control
                        type="date"
                        value={filters.departureDate}
                        onChange={(e) => handleFilterChange('departureDate', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={6} md={6} lg={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Volta</Form.Label>
                      <Form.Control
                        type="date"
                        value={filters.returnDate}
                        onChange={(e) => handleFilterChange('returnDate', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  {/* Botões somente visíveis em desktop (lg) */}
                  <Col xs={0} md={0} lg={2} className="d-none d-lg-flex align-items-end justify-content-end">
                    <div className="d-flex gap-2 mb-3 w-lg-auto">
                      <Button 
                        variant="primary" 
                        onClick={handleSearch}
                        disabled={searchLoading}
                        className="flex-lg-grow-0"
                      >
                        {searchLoading ? <Spinner size="sm" /> : 'Buscar'}
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        onClick={handleClearFilters}
                        className="flex-lg-grow-0"
                      >
                        Limpar
                      </Button>
                    </div>
                  </Col>
                </Row>
                
                {/* Segunda linha de filtros */}
                <Row>
                  <Col xs={6} sm={6} md={4} lg={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Classe da Cabine</Form.Label>
                      <Form.Select
                        value={filters.cabinClass}
                        onChange={(e) => handleFilterChange('cabinClass', e.target.value)}
                      >
                        <option value="">Todas</option>
                        <option value="economy">Econômica</option>
                        <option value="business">Executiva</option>
                        <option value="first">Primeira Classe</option>
                        <option value="premium">Premium</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={6} sm={6} md={4} lg={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Classe do Assento</Form.Label>
                      <Form.Select
                        value={filters.seatClass}
                        onChange={(e) => handleFilterChange('seatClass', e.target.value)}
                      >
                        <option value="">Todas</option>
                        <option value="standard">Standard</option>
                        <option value="premium">Premium</option>
                        <option value="business">Business</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={6} sm={6} md={4} lg={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo de Voo</Form.Label>
                      <Form.Select
                        value={filters.flightType}
                        onChange={(e) => handleFilterChange('flightType', e.target.value)}
                      >
                        <option value="">Todos</option>
                        <option value="national">Nacional</option>
                        <option value="international">Internacional</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={6} sm={6} md={4} lg={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Preço Min. (R$)</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="0"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        min="0"
                        step="50"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={6} sm={6} md={4} lg={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Preço Máx. (R$)</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="9999"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        min="0"
                        step="50"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={6} sm={6} md={4} lg={2}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-muted">Ações</Form.Label>
                      <div>
                        <small className="text-muted d-block">
                          {Object.values(filters).filter(v => v).length} filtro(s) ativo(s)
                        </small>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Linha de botões (somente visível em mobile/tablet) */}
                <Row className="d-flex d-lg-none mt-2">
                  <Col xs={12}>
                    <div className="d-flex gap-2 mb-2">
                      <Button 
                        variant="primary" 
                        onClick={handleSearch}
                        disabled={searchLoading}
                        className="flex-grow-1"
                      >
                        {searchLoading ? <Spinner size="sm" /> : 'Buscar'}
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        onClick={handleClearFilters}
                        className="flex-grow-1"
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
                {filters.origin || filters.destination || filters.departureDate ||
                 filters.cabinClass || filters.seatClass || filters.flightType || 
                 filters.minPrice || filters.maxPrice ? (
                  <div>
                    <p>Não encontramos voos que correspondam aos seus critérios de busca.</p>
                    <p>Tente:</p>
                    <ul>
                      <li>Verificar a ortografia dos termos de busca</li>
                      <li>Usar termos mais gerais</li>
                      <li>Remover alguns filtros</li>
                    </ul>
                    <Button variant="outline-info" onClick={handleClearFilters}>
                      Limpar Filtros e Ver Todos os Voos
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p>Não há voos disponíveis no momento.</p>
                    <Button variant="outline-info" onClick={loadFlights}>
                      Recarregar Voos
                    </Button>
                  </div>
                )}
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
                  {(filters.origin || filters.destination || filters.departureDate || 
                    filters.cabinClass || filters.seatClass || filters.flightType || 
                    filters.minPrice || filters.maxPrice) && (
                    <div className="active-filters mt-2">
                      <small className="text-info">
                        Filtros ativos: 
                        {filters.origin && <span className="badge bg-secondary ms-2">Origem: {filters.origin}</span>}
                        {filters.destination && <span className="badge bg-secondary ms-2">Destino: {filters.destination}</span>}
                        {filters.departureDate && <span className="badge bg-secondary ms-2">Data: {new Date(filters.departureDate).toLocaleDateString('pt-BR')}</span>}
                        {filters.cabinClass && <span className="badge bg-info ms-2">Cabine: {filters.cabinClass}</span>}
                        {filters.seatClass && <span className="badge bg-info ms-2">Assento: {filters.seatClass}</span>}
                        {filters.flightType && <span className="badge bg-success ms-2">Tipo: {filters.flightType === 'national' ? 'Nacional' : 'Internacional'}</span>}
                        {filters.minPrice && <span className="badge bg-warning ms-2">Min: R$ {filters.minPrice}</span>}
                        {filters.maxPrice && <span className="badge bg-warning ms-2">Max: R$ {filters.maxPrice}</span>}
                        <Button 
                          variant="link" 
                          size="sm" 
                          onClick={handleClearFilters}
                          className="text-decoration-none ms-2 p-0"
                        >
                          Limpar todos
                        </Button>
                      </small>
                    </div>
                  )}
                </div>
                
                <Row>
                  {getCurrentPageFlights().map((flight) => (
                    <Col key={flight.id} xs={12} md={6} className="mb-4">
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
                  <div className="d-flex justify-content-center mt-4 pagination-container">
                    <Pagination className="flex-wrap responsive-pagination">
                      <Pagination.First 
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                      />
                      <Pagination.Prev 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      />
                      
                      {/* Páginas numeradas - versão responsiva */}
                      {Array.from({ length: getTotalPages() }, (_, index) => {
                        const page = index + 1;
                        const isCurrentPage = page === currentPage;
                        
                        // Em telas pequenas, mostrar menos páginas
                        const showPage = 
                          page === 1 || 
                          page === getTotalPages() || 
                          Math.abs(page - currentPage) <= (isSmallScreen() ? 1 : 2);
                        
                        if (!showPage) {
                          // Mostra "..." se necessário
                          if ((isSmallScreen() && (page === currentPage - 2 || page === currentPage + 2)) ||
                              (!isSmallScreen() && (page === currentPage - 3 || page === currentPage + 3))) {
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
