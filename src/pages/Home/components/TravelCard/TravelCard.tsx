import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { type TravelPackageListItem } from '../../../../Entities/TravelPackage';

interface TravelCardProps {
  travelPackage: TravelPackageListItem;
  onViewDetails?: (id: number) => void;
}

const TravelCard: React.FC<TravelCardProps> = ({ travelPackage, onViewDetails }) => {
  // Desestruturando propriedades do pacote de viagem
  const { Id, Title, Description, Price, Images, Destination, Duration } = travelPackage;

  // Encontrar a imagem principal ou usar a primeira disponível
  const mainImage = Images?.find(img => img.IsMain) || Images?.[0];
  const imageUrl = mainImage?.ImageUrl || 'https://via.placeholder.com/300x200?text=Sem+Imagem';
  const imageAlt = mainImage?.AltText || Title;

  // Truncar descrição para não ficar muito longa
  const truncatedDescription = Description?.length > 120
    ? `${Description.substring(0, 120)}...`
    : Description;

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={imageUrl}
        alt={imageAlt}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{Title}</Card.Title>

        {Destination && (
          <Card.Subtitle className="mb-2 text-muted">
            {Destination.Name}, {Destination.Country}
          </Card.Subtitle>
        )}

        <Card.Text className="flex-grow-1 my-2">
          {truncatedDescription}
        </Card.Text>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div>
            <h5 className="text-primary mb-0">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(Price)}
            </h5>
            <small className="text-muted">{Duration} dias</small>
          </div>

          {onViewDetails && (
            <Button
              variant="outline-primary"
              onClick={() => onViewDetails(Id)}
            >
              Ver detalhes
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default TravelCard;