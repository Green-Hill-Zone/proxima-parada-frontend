import { Card } from 'react-bootstrap';

interface TravelPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface TravelCardProps {
  travelPackage: TravelPackage;
}

const TravelCard = ({ travelPackage }: TravelCardProps) => {
  const {  title, description, price, imageUrl } = travelPackage;

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img variant="top" src={imageUrl} alt={title} />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{title}</Card.Title>
        <Card.Text className="flex-grow-1">
          {description}
        </Card.Text>
        <div className="mt-auto">
          <h5 className="text-primary">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(price)}
          </h5>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TravelCard;
export type { TravelPackage };
