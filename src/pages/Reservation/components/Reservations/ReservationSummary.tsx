import { Card, Badge, Button } from 'react-bootstrap';


const ReservationSummary = () => {
  const valuePerTraveler = 1610;
  const taxes = 205;
  const totalTravelers = 2;
  const finalPrice = (valuePerTraveler + taxes) * totalTravelers;

  return (
    <Card className="rounded-4 mb-0 stat-card">
      <Card.Header className="rounded-top-4 d-flex justify-content-between align-items-center border-0" style={{ background: '#3246aa' }}>
        <header aria-level={2} className='d-flex gap-2 align-items-center'>
          <span className='d-block fw-bold text-white'>Resumo</span>
        </header>
        <nav className='d-flex align-items-center gap-2'>
          <a href="#" className="text-decoration-none fw-bold inline-block text-white">Detalhes do valor</a>
        </nav>
      </Card.Header>
      <Card.Body className="p-2 bg-white rounded-4">
        <div className="mb-3">
          <div className="d-flex justify-content-between">
            <span className="text-secondary">Valor por viajante</span>
            <span className="fw-semibold">R$ {valuePerTraveler.toLocaleString()}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span className="text-secondary">Taxas e impostos</span>
            <span className="fw-semibold">R$ {taxes.toLocaleString()}</span>
          </div>
        </div>

        <div className="my-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-semibold text-danger">Valor final {totalTravelers} viajantes</span>
            <span className="fw-bold fs-5">R$ {finalPrice.toLocaleString()}</span>
          </div>

          <Badge bg="warning" text="dark" className="mb-3 rounded-pill fw-bold">
            Não Reembolsável
          </Badge>

          <Button
            variant="warning"
            className="w-100 fw-bold text-dark py-2 rounded-pill"
          >
            Reservar Agora
          </Button>
        </div>

        <div className="text-center mt-2 small text-muted">
          Taxas inclusas | Em até <strong>12x</strong>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ReservationSummary;
