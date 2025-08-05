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
import { Container, Row, Col, Spinner, Alert, Form, Button, Card, Pagination, InputGroup } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { getAllFlights, getFlightsByRoute, isFlightInternational, matchesFlightClass, type Flight } from '../../services/FlightService';
import { normalizeText } from '../../utils/textUtils';
import FlightCard from './components/FlightCard';
import './Flights.css';

// Componente principal da página de voos
const Flights = () => {
  // Estados do componente
  const [flights, setFlights] = useState<Flight[]>([]);
  const [allFlights, setAllFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filtrar voos com base no termo de pesquisa e filtros
  const filteredFlights = useMemo(() => {
    let result = allFlights;

    // Filtro por texto de busca
    if (searchTerm.trim()) {
      const searchNormalized = normalizeText(searchTerm);
      result = result.filter(flight => {
        // Busca no número do voo
        const flightNumber = normalizeText(flight.flightNumber);
        
        // Busca na companhia aérea
        const airlineName = normalizeText(flight.airline.name);
        const airlineCode = normalizeText(flight.airline.iataCode);
        
        // Busca na origem
        const originName = normalizeText(flight.originDestination.name);
        const originCountry = normalizeText(flight.originDestination.country);
        const originCity = normalizeText(flight.originDestination.city || '');
        
        // Busca no destino
        const destinationName = normalizeText(flight.finalDestination.name);
        const destinationCountry = normalizeText(flight.finalDestination.country);
        const destinationCity = normalizeText(flight.finalDestination.city || '');
        
        // Busca por classe com variações
        const classMatches = matchesFlightClass(flight.cabinClass, searchTerm) ||
                            matchesFlightClass(flight.seatClass || '', searchTerm);
        
        // Busca por tipo de voo (nacional/internacional)
        const typeMatches = (() => {
          const isInternational = isFlightInternational(flight);
          const searchLower = searchNormalized;
          
          if (isInternational) {
            return searchLower.includes('internacional') || 
                   searchLower.includes('international') ||
                   searchLower.includes('inter');
          } else {
            return searchLower.includes('nacional') || 
                   searchLower.includes('domestic') ||
                   searchLower.includes('domestico');
          }
        })();
        
        return flightNumber.includes(searchNormalized) ||
               airlineName.includes(searchNormalized) ||
               airlineCode.includes(searchNormalized) ||
               originName.includes(searchNormalized) ||
               originCountry.includes(searchNormalized) ||
               originCity.includes(searchNormalized) ||
               destinationName.includes(searchNormalized) ||
               destinationCountry.includes(searchNormalized) ||
               destinationCity.includes(searchNormalized) ||
               classMatches ||
               typeMatches;
      });
    }

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
  }, [allFlights, searchTerm, filters]);

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
    setSearchTerm('');
    setCurrentPage(1); // Reset página
  };

  // Limpa apenas a pesquisa por texto
  const clearTextSearch = () => {
    setSearchTerm('');
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

            {/* Barra de Pesquisa Rápida */}
            <Card className="quick-search mb-4">
              <Card.Body>
                <Row>
                  <Col>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Pesquisar por voo, empresa, origem, destino, classe (economy, business), tipo (nacional, internacional)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                      />
                      {searchTerm && (
                        <Button 
                          variant="outline-secondary" 
                          onClick={clearTextSearch}
                          className="clear-button"
                          title="Limpar pesquisa"
                        >
                          ✕
                        </Button>
                      )}
                      <InputGroup.Text className="search-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path 
                            d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                      </InputGroup.Text>
                    </InputGroup>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Filtros de Busca */}
            <Card className="search-filters mb-4">
              <Card.Header>
                <h5 className="mb-0">Filtros Avançados</h5>
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
                
                {/* Segunda linha de filtros */}
                <Row>
                  <Col md={2}>
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
                  <Col md={2}>
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
                  <Col md={2}>
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
                  <Col md={2}>
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
                  <Col md={2}>
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
                  <Col md={2}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-muted">Ações</Form.Label>
                      <div>
                        <small className="text-muted">
                          {Object.values(filters).filter(v => v).length} filtro(s) ativo(s)
                        </small>
                      </div>
                    </Form.Group>
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
                {searchTerm || filters.origin || filters.destination || filters.departureDate ||
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
                    {searchTerm && (
                      <span className="ms-2">
                        para "{searchTerm}"
                      </span>
                    )}
                    {flights.length > FLIGHTS_PER_PAGE && (
                      <span className="ms-2">
                        | Página {currentPage} de {getTotalPages()}
                      </span>
                    )}
                  </p>
                  {(searchTerm || filters.origin || filters.destination || filters.departureDate || 
                    filters.cabinClass || filters.seatClass || filters.flightType || 
                    filters.minPrice || filters.maxPrice) && (
                    <div className="active-filters mt-2">
                      <small className="text-info">
                        Filtros ativos: 
                        {searchTerm && <span className="badge bg-primary ms-2">Busca: {searchTerm}</span>}
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
