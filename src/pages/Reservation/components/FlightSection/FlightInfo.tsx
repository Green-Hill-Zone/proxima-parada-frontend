import { useReservation } from '../../context/ReservationContext';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { FaPlane, FaExchangeAlt, FaEdit, FaUser } from 'react-icons/fa';

interface FlightInfoProps {
  onChangeFlight?: () => void;
  isActive?: boolean;
}

const FlightInfo = ({ onChangeFlight, isActive = false }: FlightInfoProps) => {
  const { reservationData } = useReservation();
  
  // Se não há dados de reserva, não renderiza nada
  if (!reservationData) {
    return null;
  }

  // Dados do voo (simulados baseados no pacote)
  const origin = 'São Paulo';
  const destination = reservationData.travelPackage.destination.name;
  const departure = reservationData.travelPackage.availableDates[0]?.departureDate || '';
  const returnDate = reservationData.travelPackage.availableDates[0]?.returnDate || '';

  // Simulações de horário e duração
  const departureTime = '15:30';
  const arrivalTime = '16:45';
  const returnDepartureTime = '10:10';
  const returnArrivalTime = '11:30';
  const durationDeparture = '1h 15min';
  const durationReturn = '1h 20min';

  // Formatação de datas
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  // Cálculo dinâmico de preços baseado no destino
  const calculateFlightPrices = () => {
    const destinationPrices: { [key: string]: { outbound: number; return: number } } = {
      'Paris': { outbound: 1200, return: 1350 },
      'Londres': { outbound: 1100, return: 1250 },
      'Nova York': { outbound: 1500, return: 1650 },
      'Tokyo': { outbound: 2200, return: 2400 },
      'Barcelona': { outbound: 950, return: 1050 },
      'Roma': { outbound: 800, return: 900 },
      'Amsterdam': { outbound: 850, return: 950 },
      'Default': { outbound: 450, return: 520 }
    };

    return destinationPrices[destination] || destinationPrices['Default'];
  };

  const flightPrices = calculateFlightPrices();
  const totalFlightPrice = flightPrices.outbound + flightPrices.return;

  return (
    <Card 
      className={`rounded-4 mb-0 ${isActive ? 'bg-light shadow-lg' : 'bg-light'} stat-card`}
      style={{
        borderWidth: isActive ? '2px' : '1px',
        borderColor: isActive ? '#0d6efd' : '#dee2e6',
        borderStyle: 'solid',
        backgroundColor: isActive ? '#f8f9ff' : '#f8f9fa',
        transition: 'all 0.3s ease',
        position: 'relative'
      }}
    >
        {isActive && (
          <div 
            className="position-absolute top-0 end-0 m-2"
            style={{ zIndex: 10 }}
          >
            <Badge bg="primary" className="d-flex align-items-center gap-1">
              <FaEdit size={12} />
              Editando
            </Badge>
          </div>
        )}
        
        <Card.Header
          className="rounded-top-4 d-flex justify-content-between align-items-center border-0"
          style={{ background: isActive ? "#1d4ed8" : "#3246aa" }}
        >
          <header aria-level={2} className='d-flex gap-2 align-items-center'>
            <FaPlane className="text-white" />
            <span className='d-block fw-bold text-white'>Voo</span>
            <Badge bg="light" text="dark" className="ms-2 rounded-pill">
              R$ {totalFlightPrice.toLocaleString()}
            </Badge>
          </header>
          <nav className='d-flex align-items-center gap-2'>
            <a href="#ida" className="text-decoration-none fw-bold inline-block text-white">Detalhes ida</a>
            <span className='inline-block text-white'>|</span>
            <a href="#volta" className="text-decoration-none fw-bold inline-block text-white">Detalhes volta</a>
          </nav>
        </Card.Header>

        <Card.Body className='p-2 bg-white rounded-4' >
          <div className='rounded-top-4'>
            {/* IDA */}
            <section id="ida" className="py-3">
              <Row className="align-items-center text-center px-4 bord">
                <Col md={3}>
                  <h3 className='text-start mb-0' style={{ fontSize: '22px', lineHeight: '28px' }}>Ida</h3>
                  <p className='text-start' style={{ fontSize: '11px', lineHeight: '150%' }}>{formatDate(departure)}</p>
                </Col>
                <Col md={9} className='d-flex gap-2'>
                  <div className='d-flex flex-column gap-1'>
                    <h3 className='text-start mb-0' style={{ fontSize: '22px', lineHeight: '28px' }}>{departureTime}</h3>
                    <p className='text-start' style={{ fontSize: '12px', lineHeight: '150%' }}>{origin}</p>
                  </div>

                  <div className="text-primary d-flex gap-1 flex-column py-2" style={{ fontSize: '12px', lineHeight: '150%' }}>
                    Total: {durationDeparture}
                    <span className="line d-block" style={{ width: '100%', height: '2px', background: 'red' }}></span>
                    <small className="d-block">Voo direto</small>
                  </div>

                  <div className='d-flex flex-column gap-1'>
                    <h3 className='text-start mb-0' style={{ fontSize: '22px', lineHeight: '28px' }}>{arrivalTime}</h3>
                    <p className='text-start' style={{ fontSize: '12px', lineHeight: '150%' }}>{destination}</p>
                  </div>
                </Col>
              </Row>
            </section>
            {/* VOLTA */}
            <section id="volta" className="mb-4">
              <Row className="align-items-center text-center px-4 bord">
                <Col md={3}>
                  <h3 className='text-start mb-0' style={{ fontSize: '22px', lineHeight: '28px' }}>Volta</h3>
                  <p className='text-start' style={{ fontSize: '11px', lineHeight: '150%' }}>{formatDate(returnDate)}</p>
                </Col>
                <Col md={9} className='d-flex gap-2'>
                  <div className='d-flex flex-column gap-1'>
                    <h3 className='text-start mb-0' style={{ fontSize: '22px', lineHeight: '28px' }}>{returnDepartureTime}</h3>
                    <p className='text-start' style={{ fontSize: '12px', lineHeight: '150%' }}>{destination}</p>
                  </div>

                  <div className="text-primary d-flex gap-1 flex-column py-2" style={{ fontSize: '12px', lineHeight: '150%' }}>
                    Total: {durationReturn}
                    <span className="line d-block" style={{ width: '100%', height: '2px', background: 'red' }}></span>
                    <small className="d-block">Voo direto</small>
                  </div>

                  <div className='d-flex flex-column gap-1'>
                    <h3 className='text-start mb-0' style={{ fontSize: '22px', lineHeight: '28px' }}>{returnArrivalTime}</h3>
                    <p className='text-start' style={{ fontSize: '12px', lineHeight: '150%' }}>{origin}</p>
                  </div>
                </Col>
              </Row>
            </section>
          </div>

          {/* Seção de preços do voo */}
          <div className="mx-4 mb-3 p-3 bg-light rounded-3">
            <div className="fw-bold mb-2 text-primary d-flex align-items-center gap-2">
              <FaUser size={14} />
              Preços por passageiro
            </div>
            
            <div className="row g-2">
              <div className="col-6">
                <div className="p-2 bg-white rounded-2">
                  <small className="text-muted d-block">Voo de Ida</small>
                  <span className="fw-bold text-success">R$ {flightPrices.outbound.toLocaleString()}</span>
                </div>
              </div>
              <div className="col-6">
                <div className="p-2 bg-white rounded-2">
                  <small className="text-muted d-block">Voo de Volta</small>
                  <span className="fw-bold text-success">R$ {flightPrices.return.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-2 p-2 bg-primary text-white rounded-2">
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">Total por passageiro:</span>
                <span className="fw-bold fs-5">R$ {totalFlightPrice.toLocaleString()}</span>
              </div>
              <small className="opacity-75">Taxas e impostos inclusos</small>
            </div>
          </div>

          <Row className="py-4 mb-3 px-4">
            <Col className="d-flex justify-content-between align-items-center">
              <Badge bg="warning" text="dark"> Não Reembolsável </Badge>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={onChangeFlight}
                className="d-flex align-items-center gap-1"
              >
                <FaExchangeAlt size={12} />
                Trocar Voo
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
  );
};

export default FlightInfo;
