import { Badge, Button, Card, Col, Row } from 'react-bootstrap';
import { FaEdit, FaExchangeAlt, FaPlane, FaUser } from 'react-icons/fa';
import { useReservation } from '../../context/ReservationContext';

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

  // Prioriza o voo selecionado, senão usa os dados do pacote
  const flight = reservationData.selectedFlight;
  const travelPackage = reservationData.travelPackage;

  // Safely access available dates
  const availableDates = travelPackage.availableDates?.[0];

  // Dados do voo
  const origin = flight?.origin || 'Origem'; // Fallback
  const destination = flight?.destination || travelPackage.destination.name;
  const departure = flight?.departureDate || availableDates?.departureDate || '';
  const returnDate = flight?.returnDate || availableDates?.returnDate || '';
  const totalFlightPrice = flight?.price || 0; // Usar o preço do voo selecionado ou 0

  // Formatação de datas
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    // Checa se a data é válida antes de formatar
    if (isNaN(date.getTime())) {
      return 'N/A';
    }
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Informações de voo com horários fixos
  const departureInfo = {
    date: formatDate(departure),
    departureTime: '15:30',
    arrivalTime: '16:45',
  };

  const returnInfo = {
    date: formatDate(returnDate),
    departureTime: '10:10',
    arrivalTime: '11:30',
  };


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
          {totalFlightPrice > 0 && (
            <Badge bg="light" text="dark" className="ms-2 rounded-pill">
              R$ {totalFlightPrice.toLocaleString('pt-BR')}
            </Badge>
          )}
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
                <p className='text-start' style={{ fontSize: '11px', lineHeight: '150%' }}>{departureInfo.date}</p>
              </Col>
              <Col md={9} className='d-flex gap-2'>
                <div className='d-flex flex-column gap-1'>
                  <h3 className='text-start mb-0' style={{ fontSize: '22px', lineHeight: '28px' }}>{departureInfo.departureTime}</h3>
                  <p className='text-start' style={{ fontSize: '12px', lineHeight: '150%' }}>{origin}</p>
                </div>

                <div className="text-primary d-flex gap-1 flex-column py-2" style={{ fontSize: '12px', lineHeight: '150%' }}>
                  <span className="line d-block" style={{ width: '100%', height: '2px', background: 'red' }}></span>
                  <small className="d-block">Voo direto</small>
                </div>

                <div className='d-flex flex-column gap-1'>
                  <h3 className='text-start mb-0' style={{ fontSize: '22px', lineHeight: '28px' }}>{departureInfo.arrivalTime}</h3>
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
                <p className='text-start' style={{ fontSize: '11px', lineHeight: '150%' }}>{returnInfo.date}</p>
              </Col>
              <Col md={9} className='d-flex gap-2'>
                <div className='d-flex flex-column gap-1'>
                  <h3 className='text-start mb-0' style={{ fontSize: '22px', lineHeight: '28px' }}>{returnInfo.departureTime}</h3>
                  <p className='text-start' style={{ fontSize: '12px', lineHeight: '150%' }}>{destination}</p>
                </div>

                <div className="text-primary d-flex gap-1 flex-column py-2" style={{ fontSize: '12px', lineHeight: '150%' }}>
                  <span className="line d-block" style={{ width: '100%', height: '2px', background: 'red' }}></span>
                  <small className="d-block">Voo direto</small>
                </div>

                <div className='d-flex flex-column gap-1'>
                  <h3 className='text-start mb-0' style={{ fontSize: '22px', lineHeight: '28px' }}>{returnInfo.arrivalTime}</h3>
                  <p className='text-start' style={{ fontSize: '12px', lineHeight: '150%' }}>{origin}</p>
                </div>
              </Col>
            </Row>
          </section>
        </div>

        {/* Seção de preços do voo */}
        {totalFlightPrice > 0 && (
          <div className="mx-4 mb-3 p-3 bg-light rounded-3">
            <div className="fw-bold mb-2 text-primary d-flex align-items-center gap-2">
              <FaUser size={14} />
              Preços por passageiro
            </div>
            <div className="mt-2 p-2 bg-primary text-white rounded-2">
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">Total por passageiro:</span>
                <span className="fw-bold fs-5">R$ {totalFlightPrice.toLocaleString('pt-BR')}</span>
              </div>
              <small className="opacity-75">Taxas e impostos inclusos</small>
            </div>
          </div>
        )}

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
