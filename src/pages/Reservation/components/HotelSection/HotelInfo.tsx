import React from 'react';
import { Badge, Card } from 'react-bootstrap';
import type { Accommodation } from '../../../../Entities/TravelPackage';

interface HotelInfoProps {
  accommodations: Accommodation[];
}

const HotelInfo: React.FC<HotelInfoProps> = ({ accommodations }) => {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Informações de Hospedagem</h5>
      </Card.Header>
      <Card.Body>
        {accommodations.length === 0 ? (
          <p className="text-muted text-center">Nenhuma informação de hospedagem disponível.</p>
        ) : (
          <>
            {accommodations.map(accommodation => (
              <div key={accommodation.Id} className="mb-4">
                <h6 className="mb-2">{accommodation.Name}</h6>
                <p className="mb-2">
                  <Badge bg="info">{accommodation.Category}</Badge>
                </p>
                {accommodation.Address && (
                  <p className="small text-muted mb-2">{accommodation.Address}</p>
                )}
                {accommodation.Amenities && accommodation.Amenities.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-1 fw-bold">Comodidades:</p>
                    <ul className="small ps-3">
                      {accommodation.Amenities.map((amenity, index) => (
                        <li key={index}>{amenity}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default HotelInfo;