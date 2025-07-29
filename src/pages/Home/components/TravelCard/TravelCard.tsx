import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface TravelPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface TravelCardProps {
  travelPackage: TravelPackage,
  onViewDetails?: (id: string) => void
}

const TravelCard = ({ travelPackage }: TravelCardProps) => {
  const { title, description, price, imageUrl } = travelPackage;
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/payment', {
      state: {
        travelData: {
          name: title,
          date: "15/08/2025 - 22/08/2025",
          price: price,
          people: 1
        }
      }
    });
  };

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img variant="top" src={imageUrl} alt={title} />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{title}</Card.Title>
        <Card.Text className="flex-grow-1">
          {description}
        </Card.Text>
        <div className="mt-auto">
          <h5 className="text-primary mb-3">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(price)}
          </h5>
          <Button 
            variant="primary" 
            className="w-100"
            onClick={handleBookNow}
          >
            Reservar Agora
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TravelCard;
export type { TravelPackage };

