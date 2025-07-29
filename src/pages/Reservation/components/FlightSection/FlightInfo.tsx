import { useReservation } from '../../context/ReservationContext';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { FaPlane } from 'react-icons/fa'


const FlightInfo = () => {
  const { reservation } = useReservation();
  const { origin, destination, departure, return: returnDate } = reservation.flight;

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

  return (
    <Card className="rounded-4 mb-0 bg-light stat-card">
        <Card.Header
          className="rounded-top-4 d-flex justify-content-between align-items-center border-0"
          style={{ background: "#3246aa" }}
        >
          <header aria-level={2} className='d-flex gap-2 align-items-center'>
            <FaPlane className="text-white" />
            <span className='d-block fw-bold text-white'>Voo</span>
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
          <Row className="py-4 mb-3 px-4">
            <Col className="d-flex justify-content-start">
              <Badge bg="warning" text="dark"> Não Reembolsável </Badge>
            </Col>
          </Row>
        </Card.Body>
      </Card>
  );
};

export default FlightInfo;
