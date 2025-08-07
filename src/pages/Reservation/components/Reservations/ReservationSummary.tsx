import { Card, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useRequireAuth } from '../../../../hooks/useAuth';
import { useReservation } from '../../context/ReservationContext';

interface ReservationSummaryProps {
  priceComparison?: {
    originalPrice: number;
    newPrice: number;
    changeType: 'flight' | 'hotel' | 'both';
    flightPriceDiff?: number;
    hotelPriceDiff?: number;
  } | null;
}

const ReservationSummary = ({ priceComparison }: ReservationSummaryProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useRequireAuth();
  const { reservationData } = useReservation();
  
  // Se não há dados de reserva, não renderiza nada
  if (!reservationData) {
    return null;
  }

  // Usar o preço atual da reserva (que pode ter sido atualizado por customizações)
  const currentPackagePrice = reservationData.totalPrice || reservationData.travelPackage.price;
  const originalPackagePrice = reservationData.travelPackage.price;
  
  // Calcular valores baseados no preço atual
  const valuePerTraveler = currentPackagePrice;
  const taxes = Math.round(valuePerTraveler * 0.12); // Simula 12% de taxas
  const totalTravelers = 2; // Padrão de 2 viajantes
  const finalPrice = (valuePerTraveler + taxes) * totalTravelers;
  
  // Calcular valores originais para comparação
  const originalValuePerTraveler = originalPackagePrice;
  const originalTaxes = Math.round(originalValuePerTraveler * 0.12);
  const originalFinalPrice = (originalValuePerTraveler + originalTaxes) * totalTravelers;

  // Função para lidar com o clique no botão "Reservar Agora"
  const handleReservarAgora = () => {
    if (isAuthenticated) {
      // Se o usuário estiver logado, vai para a página de pagamento
      const departureDate = reservationData.travelPackage.availableDates[0]?.departureDate || '';
      const returnDate = reservationData.travelPackage.availableDates[0]?.returnDate || '';
      
      const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('pt-BR');
      };

      navigate('/payment', {
        state: {
          travelData: {
            name: reservationData.travelPackage.title,
            date: `${formatDate(departureDate)} - ${formatDate(returnDate)}`,
            price: valuePerTraveler + taxes, // Usar preço atual com taxas
            people: totalTravelers,
            totalAmount: finalPrice // Valor total final
          }
        }
      });
    } else {
      // Se não estiver logado, vai para a página de login
      navigate('/login');
    }
  };

  return (
    <Card className="rounded-4 mb-0  stat-card">
      <Card.Header className="rounded-top-4 d-flex justify-content-between align-items-center border-0" style={{ background: '#3246aa' }}>
        <header aria-level={2} className='d-flex gap-2 align-items-center'>
          <span className='d-block fw-bold text-white'>Resumo</span>
        </header>
        <nav className='d-flex align-items-center gap-2'>
          <a href="#" className="text-decoration-none fw-bold inline-block text-white">Detalhes do valor</a>
        </nav>
      </Card.Header>
      <Card.Body className="p-3 bg-white rounded-4">
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

          {/* Mostrar comparação de preços quando disponível */}
          {priceComparison && (
            <div className="mb-3">
              {/* Comparação customizada para mostrar os valores corretos */}
              <div className="price-calculator-integrated border rounded p-3 bg-light">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="fw-bold small text-primary">📊 Comparação de Preços</span>
                </div>
                
                <div className="d-flex justify-content-between mb-2">
                  <div className="text-center">
                    <small className="text-muted d-block">Preço Original</small>
                    <span className="fw-semibold">R$ {originalFinalPrice.toLocaleString()}</span>
                  </div>
                  <div className="text-center">
                    <small className="text-muted d-block">Novo Preço</small>
                    <span className="fw-semibold text-primary">R$ {finalPrice.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="text-center p-2 bg-white rounded">
                  {(() => {
                    const totalDifference = finalPrice - originalFinalPrice;
                    const percentageChange = ((totalDifference / originalFinalPrice) * 100);
                    const isPositive = totalDifference > 0;
                    const isNegative = totalDifference < 0;
                    
                    return (
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        {isPositive && <span className="text-danger">⬆️</span>}
                        {isNegative && <span className="text-success">⬇️</span>}
                        <span className={`fw-bold ${isPositive ? 'text-danger' : isNegative ? 'text-success' : 'text-muted'}`}>
                          {totalDifference >= 0 ? '+' : ''}R$ {Math.abs(totalDifference).toLocaleString()}
                        </span>
                        <small className="text-muted">
                          ({totalDifference >= 0 ? '+' : ''}{percentageChange.toFixed(1)}%)
                        </small>
                      </div>
                    );
                  })()}
                </div>
                
                <small className="text-muted d-block text-center mt-2">
                  {priceComparison.changeType === 'hotel' && '🏨 Alteração no hotel'}
                  {priceComparison.changeType === 'flight' && '✈️ Alteração no voo'}
                  {priceComparison.changeType === 'both' && '✈️🏨 Alterações no voo e hotel'}
                </small>
              </div>
            </div>
          )}

          <Badge bg="warning" text="dark" className="mb-4 rounded-pill fw-semibold">
            Não Reembolsável
          </Badge>

          <Button
            variant="warning"
            className="w-100 fw-bold text-dark py-2 rounded-pill"
            onClick={handleReservarAgora}
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
