import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import { FaPlane, FaTimes, FaFilter } from 'react-icons/fa';
import { getFlightsByRoute, type Flight } from '../../../../services/FlightService';

interface FlightOption {
  id: number;
  airline: string;
  flightNumber: string;
  outbound: {
    departureTime: string;
    arrivalTime: string;
    duration: string;
    date: string;
  };
  return: {
    departureTime: string;
    arrivalTime: string;
    duration: string;
    date: string;
  };
  totalPrice: number;
  stops: number;
  aircraft: string;
}

interface FlightSelectorProps {
  destinationId: number;  // NOVO: ID do destino para buscar no backend
  originId: number;       // NOVO: ID da origem para buscar no backend
  destination: string;    // MANTER: Nome do destino para exibição
  onClose: () => void;
  onSelectFlight: (flight: FlightOption) => void;
}

const FlightSelector: React.FC<FlightSelectorProps> = ({
  destinationId,
  originId,
  destination,
  onClose,
  onSelectFlight
}) => {
  const [priceFilter, setPriceFilter] = useState<string>('');
  const [stopsFilter, setStopsFilter] = useState<string>('');
  const [timeFilter, setTimeFilter] = useState<string>('');
  const [flights, setFlights] = useState<FlightOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // YAGNI: Buscar voos reais do backend ao montar componente
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        setError('');
        
        // KISS: Buscar voos por rota usando service existente
        const backendFlights = await getFlightsByRoute(originId, destinationId);
        console.log('📋 Voos da rota recebidos:', backendFlights.length);
        
        // DRY: Mapear dados do backend para formato do componente
        const mappedFlights = backendFlights.map(mapBackendFlightToComponent);
        console.log('🗺️ Voos mapeados:', mappedFlights.length, mappedFlights);
        
        setFlights(mappedFlights);
        
      } catch (error) {
        console.error('Erro ao buscar voos:', error);
        setError('Erro ao carregar voos. Tente novamente.');
        setFlights([]); // Fallback para array vazio
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [destinationId, originId]);

  // DRY: Função helper para mapear dados do backend para o componente
  const mapBackendFlightToComponent = (backendFlight: Flight): FlightOption => {
    console.log('🔄 Mapeando voo:', backendFlight.flightNumber, 'Price:', backendFlight.price);
    
    return {
      id: backendFlight.id,
      airline: backendFlight.airline.name,
      flightNumber: backendFlight.flightNumber,
      outbound: {
        departureTime: new Date(backendFlight.departureDateTime).toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        arrivalTime: new Date(backendFlight.arrivalDateTime).toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        duration: '1h 30min', // YAGNI: Cálculo simples por enquanto
        date: new Date(backendFlight.departureDateTime).toLocaleDateString('pt-BR')
      },
      return: {
        departureTime: new Date(backendFlight.arrivalDateTime).toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        arrivalTime: new Date(backendFlight.departureDateTime).toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        duration: '1h 30min', // YAGNI: Cálculo simples por enquanto
        date: new Date(backendFlight.arrivalDateTime).toLocaleDateString('pt-BR')
      },
      totalPrice: backendFlight.price ?? 1500, // YAGNI: Preço padrão se null/undefined
      stops: 0, // YAGNI: Por enquanto assumir voo direto
      aircraft: 'Boeing 737' // YAGNI: Tipo de aeronave padrão
    };
  };

  const filteredFlights = flights.filter(flight => {
    let passesFilter = true;
    const reasons = [];
    
    if (priceFilter === 'low' && flight.totalPrice > 2000) {
      passesFilter = false;
      reasons.push(`preço ${flight.totalPrice} > 2000`);
    }
    if (priceFilter === 'high' && flight.totalPrice <= 2000) {
      passesFilter = false;
      reasons.push(`preço ${flight.totalPrice} <= 2000`);
    }
    if (stopsFilter === 'direct' && flight.stops > 0) {
      passesFilter = false;
      reasons.push(`tem ${flight.stops} paradas`);
    }
    if (stopsFilter === 'stops' && flight.stops === 0) {
      passesFilter = false;
      reasons.push('é voo direto');
    }
    if (timeFilter === 'morning' && parseInt(flight.outbound.departureTime.split(':')[0]) >= 12) {
      passesFilter = false;
      reasons.push('não é manhã');
    }
    if (timeFilter === 'afternoon' && (parseInt(flight.outbound.departureTime.split(':')[0]) < 12 || parseInt(flight.outbound.departureTime.split(':')[0]) >= 18)) {
      passesFilter = false;
      reasons.push('não é tarde');
    }
    if (timeFilter === 'night' && parseInt(flight.outbound.departureTime.split(':')[0]) < 18) {
      passesFilter = false;
      reasons.push('não é noite');
    }
    
    console.log(`✈️ Voo ${flight.flightNumber} (${flight.airline}): ${passesFilter ? '✅ PASSA' : '❌ FALHA'} - ${reasons.join(', ') || 'sem restrições'}`);
    
    return passesFilter;
  });

  console.log('🔍 Filtros aplicados - Total:', flights.length, 'Filtrados:', filteredFlights.length);
  console.log('🔍 Filtros ativos:', { priceFilter, stopsFilter, timeFilter });

  return (
    <Row className="mt-4">
      {/* Filtros */}
      <Col md={3}>
        <Card className="mb-3">
          <Card.Header className="d-flex align-items-center gap-2">
            <FaFilter />
            <span>Filtros</span>
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label><strong>Preço</strong></Form.Label>
              <Form.Select 
                value={priceFilter} 
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="low">Até R$ 2.000</option>
                <option value="high">Acima de R$ 2.000</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><strong>Paradas</strong></Form.Label>
              <Form.Select 
                value={stopsFilter} 
                onChange={(e) => setStopsFilter(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="direct">Voo direto</option>
                <option value="stops">Com paradas</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><strong>Horário de Partida</strong></Form.Label>
              <Form.Select 
                value={timeFilter} 
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="morning">Manhã (06h-12h)</option>
                <option value="afternoon">Tarde (12h-18h)</option>
                <option value="night">Noite (18h-24h)</option>
              </Form.Select>
            </Form.Group>

            <Button variant="outline-secondary" size="sm" onClick={onClose}>
              <FaTimes className="me-1" />
              Fechar
            </Button>
          </Card.Body>
        </Card>
      </Col>

      {/* Lista de Voos */}
      <Col md={9}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Voos para {destination}</h5>
          {!loading && !error && (
            <span className="text-muted">{filteredFlights.length} voos encontrados</span>
          )}
        </div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <p className="mt-2 text-muted">Buscando voos disponíveis...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            <strong>Erro ao carregar voos:</strong> {error}
          </div>
        )}

        {!loading && !error && filteredFlights.length === 0 && (
          <div className="alert alert-info" role="alert">
            <strong>Nenhum voo encontrado</strong> com os filtros selecionados.
          </div>
        )}

        {!loading && !error && filteredFlights.map((flight) => (
          <Card key={flight.id} className="mb-3 flight-card">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={2}>
                  <div className="text-center">
                    <FaPlane className="text-primary mb-1" />
                    <div><strong>{flight.airline}</strong></div>
                    <small className="text-muted">{flight.flightNumber}</small>
                  </div>
                </Col>
                
                <Col md={6}>
                  {/* Voo de Ida */}
                  <div className="mb-2">
                    <small className="text-muted fw-bold">IDA</small>
                    <Row className="align-items-center text-center">
                      <Col xs={4}>
                        <div><strong>{flight.outbound.departureTime}</strong></div>
                        <small className="text-muted">São Paulo</small>
                      </Col>
                      <Col xs={4}>
                        <div className="text-center">
                          <small className="text-muted">{flight.outbound.duration}</small>
                          <hr className="my-1" />
                          <small className="text-muted">
                            {flight.stops === 0 ? 'Direto' : `${flight.stops} parada${flight.stops > 1 ? 's' : ''}`}
                          </small>
                        </div>
                      </Col>
                      <Col xs={4}>
                        <div><strong>{flight.outbound.arrivalTime}</strong></div>
                        <small className="text-muted">{destination}</small>
                      </Col>
                    </Row>
                  </div>
                  
                  {/* Voo de Volta */}
                  <div>
                    <small className="text-muted fw-bold">VOLTA</small>
                    <Row className="align-items-center text-center">
                      <Col xs={4}>
                        <div><strong>{flight.return.departureTime}</strong></div>
                        <small className="text-muted">{destination}</small>
                      </Col>
                      <Col xs={4}>
                        <div className="text-center">
                          <small className="text-muted">{flight.return.duration}</small>
                          <hr className="my-1" />
                          <small className="text-muted">
                            {flight.stops === 0 ? 'Direto' : `${flight.stops} parada${flight.stops > 1 ? 's' : ''}`}
                          </small>
                        </div>
                      </Col>
                      <Col xs={4}>
                        <div><strong>{flight.return.arrivalTime}</strong></div>
                        <small className="text-muted">São Paulo</small>
                      </Col>
                    </Row>
                  </div>
                  
                  <div className="mt-2">
                    <Badge bg="light" text="dark">{flight.aircraft}</Badge>
                  </div>
                </Col>
                
                <Col md={2} className="text-center">
                  <div><strong className="text-success">R$ {flight.totalPrice.toLocaleString()}</strong></div>
                  <small className="text-muted">total (ida e volta)</small>
                </Col>
                
                <Col md={2} className="text-center">
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => onSelectFlight(flight)}
                  >
                    Selecionar
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}
      </Col>
    </Row>
  );
};

export default FlightSelector;
