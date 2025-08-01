import { Button, Card, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import type { TravelPackageDetailResponse } from '../../../../Entities/TravelPackage';
import { useRequireAuth } from '../../../../hooks/useAuth';

interface ReservationSummaryProps {
  packageDetails: TravelPackageDetailResponse;
}

const ReservationSummary: React.FC<ReservationSummaryProps> = ({ packageDetails }) => {
  const { Title, Price, Duration, AvailableDates } = packageDetails;
  const navigate = useNavigate();
  const { isAuthenticated } = useRequireAuth();

  const valuePerTraveler = 1610;
  const taxes = 205;
  const totalTravelers = 2;
  const finalPrice = (valuePerTraveler + taxes) * totalTravelers;

  // Obter a próxima data disponível (primeira da lista, se existir)
  const nextAvailableDate = AvailableDates && AvailableDates.length > 0 ? AvailableDates[0] : null;

  // Função para formatar datas
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Função para lidar com o clique no botão "Reservar Agora"
  const handleReservarAgora = () => {
    if (isAuthenticated) {
      // Se o usuário estiver logado, vai para a página de pagamento
      navigate('/payment', {
        state: {
          travelData: {
            name: Title,
            date: nextAvailableDate ?
              `${formatDate(nextAvailableDate.DepartureDate)} - ${formatDate(nextAvailableDate.ReturnDate)}` : '',
            price: valuePerTraveler + taxes,
            people: totalTravelers
          }
        }
      });
    } else {
      // Se não estiver logado, vai para a página de login
      navigate('/login');
    }
  };

  return (
    <Card className="h-100 shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Resumo da Reserva</h5>
      </Card.Header>
      <Card.Body className="d-flex flex-column">
        <h5 className="mb-3">{Title}</h5>

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

          <ListGroup.Item>
            <Button
              variant="warning"
              className="w-100 fw-bold text-dark py-2 rounded-pill"
              onClick={handleReservarAgora}
            >
              Reservar Agora
            </Button>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default ReservationSummary;