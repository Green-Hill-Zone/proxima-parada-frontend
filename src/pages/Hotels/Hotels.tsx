/* ===================================================================== */
/* PÁGINA DE HOTÉIS - LISTAGEM E BUSCA                                 */
/* ===================================================================== */
/*
 * Página para exibir acomodações disponíveis com funcionalidades de busca.
 * Segue os princípios:
 * - KISS: Interface simples e intuitiva
 * - DRY: Reutiliza componentes existentes
 * - YAGNI: Funcionalidades essenciais
 */

import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Pagination, Row, Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { PAGE_TITLES, usePageTitle } from '../../hooks';
import {
  getAllAccommodations,
  searchAccommodations,
  type Accommodation,
  type AccommodationFilters
} from '../../services/AccommodationService';
import HotelCard from './components/HotelCard';
import './Hotels.css';

// Componente principal da página de hotéis
const Hotels = () => {
  // Define o título da página
  usePageTitle(PAGE_TITLES.HOTELS);

  // Estados do componente
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const HOTELS_PER_PAGE = 4;

  // Hooks de navegação
  const location = useLocation();

  // Estados para filtros de busca
  const [filters, setFilters] = useState<AccommodationFilters>({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    minPrice: undefined,
    maxPrice: undefined,
    minStars: undefined,
    maxStars: undefined
  });

  /* ================================================================= */
  /* EFEITOS E CARREGAMENTO INICIAL                                  */
  /* ================================================================= */

  // Carrega hotéis ao montar o componente
  useEffect(() => {
    loadAccommodations();
  }, [location.search]);

  // Função para carregar acomodações
  const loadAccommodations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Verifica se há parâmetros de busca na URL
      const searchParams = new URLSearchParams(location.search);
      const destinationParam = searchParams.get('destination');

      let accommodationsData: Accommodation[];

      if (destinationParam) {
        // Busca por destino específico
        console.log(`Buscando hotéis para destino: ${destinationParam}`);
        accommodationsData = await searchAccommodations({ destination: destinationParam });
      } else {
        // Carrega todas as acomodações
        console.log('Carregando todos os hotéis');
        accommodationsData = await getAllAccommodations();
      }

      setAccommodations(accommodationsData);
      setCurrentPage(1); // Reset página quando carrega novos hotéis
      console.log(`✅ ${accommodationsData.length} hotéis carregados`);

    } catch (err) {
      console.error('❌ Erro ao carregar hotéis:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar hotéis');
    } finally {
      setIsLoading(false);
    }
  };

  /* ================================================================= */
  /* MANIPULADORES DE EVENTOS                                        */
  /* ================================================================= */

  // Atualiza filtros de busca
  const handleFilterChange = (field: keyof AccommodationFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value
    }));
  };

  // Executa busca com filtros
  const handleSearch = async () => {
    try {
      setSearchLoading(true);
      setError(null);

      console.log('🔍 Buscando com filtros:', filters);
      const accommodationsData = await searchAccommodations(filters);
      setAccommodations(accommodationsData);
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
      destination: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      minPrice: undefined,
      maxPrice: undefined,
      minStars: undefined,
      maxStars: undefined
    });
    setCurrentPage(1); // Reset página
    loadAccommodations();
  };

  // Seleciona um hotel (pode expandir funcionalidade depois)
  const handleSelectHotel = (accommodation: Accommodation) => {
    console.log('Hotel selecionado:', accommodation);
    // YAGNI: Implementar navegação para detalhes depois se necessário
  };

  // Inicia processo de reserva
  const handleBookHotel = (accommodation: Accommodation) => {
    console.log('Iniciando reserva do hotel:', accommodation);
    // YAGNI: Integrar com sistema de reservas depois
    alert(`Funcionalidade de reserva será implementada em breve!\nHotel: ${accommodation.name}`);
  };

  /* ================================================================= */
  /* LÓGICA DE PAGINAÇÃO                                             */
  /* ================================================================= */
  /*
   * Sistema de paginação que divide os hotéis em páginas de 4 itens.
   * Características:
   * - Mostra 4 hotéis por página (HOTELS_PER_PAGE)
   * - Reset automático da página ao carregar novos hotéis
   * - Navegação com First, Previous, Next, Last
   * - Páginas numeradas com ellipsis quando necessário
   * - Scroll suave ao trocar de página
   * - Responsivo para dispositivos móveis
   */

  // Calcula os hotéis da página atual
  const getCurrentPageAccommodations = () => {
    const startIndex = (currentPage - 1) * HOTELS_PER_PAGE;
    const endIndex = startIndex + HOTELS_PER_PAGE;
    return accommodations.slice(startIndex, endIndex);
  };

  // Calcula o número total de páginas
  const getTotalPages = () => {
    return Math.ceil(accommodations.length / HOTELS_PER_PAGE);
  };

  // Navega para uma página específica
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll suave para o topo da lista de hotéis
    document.querySelector('.hotels-count')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  /* ================================================================= */
  /* RENDERIZAÇÃO                                                     */
  /* ================================================================= */

  return (
    <div className="hotels-page">
      <Container>
        <Row>
          <Col>
            {/* Cabeçalho da Página */}
            <div className="hotels-header mb-4">
              <h1>Hotéis Disponíveis</h1>
              <p className="lead">
                Encontre a acomodação perfeita para sua estadia
              </p>
            </div>

            {/* Filtros de Busca */}
            <Card className="search-filters mb-4">
              <Card.Header>
                <h5 className="mb-0">🔍 Buscar Hotéis</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Destino</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Cidade ou país"
                        value={filters.destination || ''}
                        onChange={(e) => handleFilterChange('destination', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Check-in</Form.Label>
                      <Form.Control
                        type="date"
                        value={filters.checkIn || ''}
                        onChange={(e) => handleFilterChange('checkIn', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Check-out</Form.Label>
                      <Form.Control
                        type="date"
                        value={filters.checkOut || ''}
                        onChange={(e) => handleFilterChange('checkOut', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Hóspedes</Form.Label>
                      <Form.Select
                        value={filters.guests || 1}
                        onChange={(e) => handleFilterChange('guests', parseInt(e.target.value))}
                      >
                        <option value={1}>1 hóspede</option>
                        <option value={2}>2 hóspedes</option>
                        <option value={3}>3 hóspedes</option>
                        <option value={4}>4 hóspedes</option>
                        <option value={5}>5+ hóspedes</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3} className="d-flex align-items-end">
                    <div className="d-flex gap-2 mb-3 w-100">
                      <Button
                        variant="primary"
                        onClick={handleSearch}
                        disabled={searchLoading}
                        className="flex-fill"
                      >
                        {searchLoading ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                            Buscando...
                          </>
                        ) : (
                          'Buscar'
                        )}
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={handleClearFilters}
                        className="flex-fill"
                      >
                        Limpar
                      </Button>
                    </div>
                  </Col>
                </Row>

                {/* Filtros Adicionais */}
                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Preço Mínimo (R$)</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="ex: 100"
                        value={filters.minPrice || ''}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : '')}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Preço Máximo (R$)</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="ex: 500"
                        value={filters.maxPrice || ''}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : '')}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Estrelas Mín.</Form.Label>
                      <Form.Select
                        value={filters.minStars || ''}
                        onChange={(e) => handleFilterChange('minStars', e.target.value ? parseInt(e.target.value) : '')}
                      >
                        <option value="">Qualquer</option>
                        <option value={1}>1+ estrela</option>
                        <option value={2}>2+ estrelas</option>
                        <option value={3}>3+ estrelas</option>
                        <option value={4}>4+ estrelas</option>
                        <option value={5}>5 estrelas</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Estrelas Máx.</Form.Label>
                      <Form.Select
                        value={filters.maxStars || ''}
                        onChange={(e) => handleFilterChange('maxStars', e.target.value ? parseInt(e.target.value) : '')}
                      >
                        <option value="">Qualquer</option>
                        <option value={2}>Até 2 estrelas</option>
                        <option value={3}>Até 3 estrelas</option>
                        <option value={4}>Até 4 estrelas</option>
                        <option value={5}>Até 5 estrelas</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Contador de Resultados */}
            <div className="hotels-count mb-3">
              <Row className="align-items-center">
                <Col>
                  <h5 className="mb-0">
                    {isLoading ? (
                      'Carregando hotéis...'
                    ) : (
                      `${accommodations.length} hot${accommodations.length !== 1 ? 'éis' : ''} encontrado${accommodations.length !== 1 ? 's' : ''}`
                    )}
                  </h5>
                  {accommodations.length > 0 && (
                    <small className="text-muted">
                      Mostrando {((currentPage - 1) * HOTELS_PER_PAGE) + 1} a {Math.min(currentPage * HOTELS_PER_PAGE, accommodations.length)} de {accommodations.length} resultado{accommodations.length !== 1 ? 's' : ''}
                    </small>
                  )}
                </Col>
              </Row>
            </div>

            {/* Lista de Hotéis */}
            {isLoading ? (
              // Estado de carregamento
              <div className="text-center py-5">
                <Spinner animation="border" role="status" className="mb-3">
                  <span className="visually-hidden">Carregando...</span>
                </Spinner>
                <div>Carregando hotéis disponíveis...</div>
              </div>
            ) : error ? (
              // Estado de erro
              <Alert variant="danger" className="mb-4">
                <Alert.Heading>Ops! Algo deu errado</Alert.Heading>
                <p>{error}</p>
                <hr />
                <div className="d-flex justify-content-end">
                  <Button onClick={loadAccommodations} variant="outline-danger">
                    Tentar novamente
                  </Button>
                </div>
              </Alert>
            ) : accommodations.length === 0 ? (
              // Estado vazio
              <Alert variant="info" className="text-center py-5">
                <div className="mb-3" style={{ fontSize: '3rem' }}>🏨</div>
                <Alert.Heading>Nenhum hotel encontrado</Alert.Heading>
                <p>Não encontramos hotéis que correspondam aos seus critérios de busca.</p>
                <p>Tente:</p>
                <ul className="list-unstyled">
                  <li>• Alterar o destino</li>
                  <li>• Ajustar as datas</li>
                  <li>• Modificar os filtros de preço ou estrelas</li>
                  <li>• Limpar todos os filtros</li>
                </ul>
                <hr />
                <Button onClick={handleClearFilters} variant="primary">
                  Limpar Filtros e Ver Todos
                </Button>
              </Alert>
            ) : (
              // Lista de hotéis
              <>
                <Row>
                  {getCurrentPageAccommodations().map((accommodation) => (
                    <Col key={accommodation.id} lg={6} className="mb-4">
                      <HotelCard
                        accommodation={accommodation}
                        checkIn={filters.checkIn}
                        checkOut={filters.checkOut}
                        onSelect={handleSelectHotel}
                        onBookNow={handleBookHotel}
                      />
                    </Col>
                  ))}
                </Row>

                {/* Paginação */}
                {getTotalPages() > 1 && (
                  <Row>
                    <Col>
                      <div className="d-flex justify-content-center mt-4">
                        <Pagination className="hotels-pagination">
                          {/* Primeira página */}
                          <Pagination.First
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                          />

                          {/* Página anterior */}
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

                          {/* Próxima página */}
                          <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === getTotalPages()}
                          />

                          {/* Última página */}
                          <Pagination.Last
                            onClick={() => handlePageChange(getTotalPages())}
                            disabled={currentPage === getTotalPages()}
                          />
                        </Pagination>
                      </div>
                    </Col>
                  </Row>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Hotels;
