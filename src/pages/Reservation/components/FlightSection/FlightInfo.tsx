import React from 'react';
import { Card } from 'react-bootstrap';
import type { Flight } from '../../../../Entities/Flight';

interface FlightInfoProps {
  OutboundFlight: Flight;
  ReturnFlight: Flight;
}

const FlightInfo: React.FC<FlightInfoProps> = ({ OutboundFlight, ReturnFlight }) => {
  // Renderizar informações de um voo individual
  const renderFlightInfo = (flight: Flight, type: string) => (
    <div className="mb-4">
      <div className="d-flex align-items-center mb-2">
        <div className="me-3">
          <span className="badge bg-primary">{flight.FlightNumber}</span>
        </div>
        <div>
          <h6 className="mb-0">{flight.Name}</h6>
          <small className="text-muted">{flight.FlightType || type}</small>
        </div>
      </div>
      <p className="mb-0 mt-2">
        <span className="text-muted">Preço: </span>
        {new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(flight.Price)}
      </p>
    </div>
  );

  return (
    <Card className="h-100 shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Informações de Voo</h5>
      </Card.Header>
      <Card.Body>
        {!OutboundFlight && !ReturnFlight ? (
          <p className="text-muted text-center">Nenhuma informação de voo disponível.</p>
        ) : (
          <>
            <h6 className="mb-3">Voo de Ida</h6>
            {OutboundFlight && renderFlightInfo(OutboundFlight, "Voo de Ida")}

            {ReturnFlight && (
              <>
                <hr />
                <h6 className="mb-3">Voo de Volta</h6>
                {renderFlightInfo(ReturnFlight, "Voo de Volta")}
              </>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default FlightInfo;