import React from 'react';
import { Button, Card, ListGroup } from 'react-bootstrap';
import type { TravelPackageDetailResponse } from '../../../../Entities/TravelPackage';

interface ReservationSummaryProps {
  packageDetails: TravelPackageDetailResponse;
}

const ReservationSummary: React.FC<ReservationSummaryProps> = ({ packageDetails }) => {
  const { Name, BasePrice, Duration, AvailableDates } = packageDetails;

  // Pegar a data mais próxima disponível
  const nextAvailableDate = AvailableDates && AvailableDates.length > 0
    ? AvailableDates.sort((a, b) =>
      new Date(a.DepartureDate).getTime() - new Date(b.DepartureDate).getTime()
    )[0]
    : null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Card className="h-100 shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Resumo da Reserva</h5>
      </Card.Header>
      <Card.Body className="d-flex flex-column">
        <h5 className="mb-3">{Name}</h5>

        <ListGroup variant="flush" className="mb-4">
          <ListGroup.Item className="d-flex justify-content-between">
            <span>Duração:</span>
            <span>{Duration} dias</span>
          </ListGroup.Item>

          {nextAvailableDate && (
            <>
              <ListGroup.Item className="d-flex justify-content-between">
                <span>Data de ida:</span>
                <span>{formatDate(nextAvailableDate.DepartureDate)}</span>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span>Data de volta:</span>
                <span>{formatDate(nextAvailableDate.ReturnDate)}</span>
              </ListGroup.Item>
            </>
          )}

          <ListGroup.Item className="d-flex justify-content-between">
            <span>Preço por pessoa:</span>
            <span className="fw-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(BasePrice)}
            </span>
          </ListGroup.Item>
        </ListGroup>

        <div className="mt-auto">
          <Button variant="primary" className="w-100">
            Continuar Reserva
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ReservationSummary;