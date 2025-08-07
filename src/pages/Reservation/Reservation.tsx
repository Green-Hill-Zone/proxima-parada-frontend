import { useState } from 'react';
import { Alert, Badge, Col, Container, Row, Spinner } from 'react-bootstrap';
import { PAGE_TITLES, usePageTitle } from '../../hooks';
import { calculateNewPrice } from '../../services/ReservationService';
import FlightInfo from './components/FlightSection/FlightInfo';
import FlightSelector from './components/FlightSection/FlightSelector';
import HotelInfo from './components/HotelSection/HotelInfo';
import HotelSelector from './components/HotelSection/HotelSelector';
import ReservationSummary from './components/Reservations/ReservationSummary';
import { useReservation } from './context/ReservationContext';

// Helper function to render room capacity details
const getRoomCapacityDetails = (roomType: any) => {
  if (!roomType) return 'Informações não disponíveis';

  const adults = roomType.capacityAdults || 0;
  const children = roomType.capacityChildren || 0;
  const total = roomType.totalCapacity || (adults + children) || 0;

  const adultsText = adults > 0 ? `${adults} adulto${adults > 1 ? 's' : ''}` : '';
  const childrenText = children > 0 ? `${children} criança${children > 1 ? 's' : ''}` : '';

  if (adultsText && childrenText) {
    return `${adultsText} e ${childrenText} (capacidade total: ${total})`;
  } else if (adultsText) {
    return `${adultsText} (capacidade total: ${total})`;
  } else if (childrenText) {
    return `${childrenText} (capacidade total: ${total})`;
  } else {
    return `Capacidade total: ${total || 'não informada'}`;
  }
};

const Reservation = () => {
  // Define o título da página
  usePageTitle(PAGE_TITLES.RESERVATION);

  const { reservationData, setReservationData, isLoading, error } = useReservation();
  const [showFlightSelector, setShowFlightSelector] = useState(false);
  const [showHotelSelector, setShowHotelSelector] = useState(false);
  const [priceComparison, setPriceComparison] = useState<{
    originalPrice: number;
    newPrice: number;
    changeType: 'flight' | 'hotel' | 'both';
    flightPriceDiff?: number;
    hotelPriceDiff?: number;
  } | null>(null);

  const handleChangeFlight = () => {
    setShowFlightSelector(true);
    setShowHotelSelector(false);
    setPriceComparison(null); // Reset price comparison
  };

  const handleChangeHotel = () => {
    setShowHotelSelector(true);
    setShowFlightSelector(false);
    setPriceComparison(null); // Reset price comparison
  };

  const handleCloseSelectors = () => {
    setShowFlightSelector(false);
    setShowHotelSelector(false);
    setPriceComparison(null); // Reset price comparison
  };

  const handleSelectFlight = async (flight: any) => {
    try {
      console.log('Voo selecionado:', flight);

      // Calcular novo preço com o voo alterado
      const originalPrice = reservationData?.totalPrice || reservationData?.travelPackage.price || 0;
      const newPrice = await calculateNewPrice({
        travelPackageId: reservationData!.travelPackage.id,
        customFlightId: flight.id,
        customFlightPrice: flight.totalPrice || flight.price
      });

      console.log('✅ Novo preço calculado:', newPrice);

      // Calcular diferença baseada no preço real calculado
      const flightPriceDiff = newPrice - originalPrice;

      // Mostrar comparação de preços
      setPriceComparison({
        originalPrice,
        newPrice,
        changeType: 'flight',
        flightPriceDiff
      });

      // KISS: Atualizar estado local em vez de chamar backend que não existe
      if (reservationData) {
        setReservationData({
          ...reservationData,
          selectedFlight: {
            id: flight.id,
            origin: 'São Paulo',
            destination: reservationData.travelPackage.destination.name,
            departureDate: flight.outbound.date,
            returnDate: flight.return.date,
            price: flight.totalPrice
          },
          totalPrice: newPrice // Atualizar o preço total da reserva
        });
      }

      setShowFlightSelector(false);
    } catch (err) {
      console.error('Erro ao selecionar voo:', err);

      // Fallback: mostrar comparação sem cálculo preciso
      if (reservationData) {
        const originalPrice = reservationData.totalPrice || 0;
        const estimatedNewPrice = originalPrice + (flight.totalPrice * 0.1); // Estimativa simples

        setPriceComparison({
          originalPrice,
          newPrice: estimatedNewPrice,
          changeType: 'flight',
          flightPriceDiff: estimatedNewPrice - originalPrice
        });

        // Atualizar estado mesmo com erro
        setReservationData({
          ...reservationData,
          selectedFlight: {
            id: flight.id,
            origin: 'São Paulo',
            destination: reservationData.travelPackage.destination.name,
            departureDate: flight.outbound.date,
            returnDate: flight.return.date,
            price: flight.totalPrice
          },
          totalPrice: estimatedNewPrice
        });

        setShowFlightSelector(false);
      }
    }
  };

  const handleSelectHotel = async (hotel: any, roomType: any) => {
    try {
      console.log('Hotel selecionado:', hotel, 'Tipo de quarto:', roomType);

      // Calcular novo preço com o hotel alterado
      const originalPrice = reservationData?.totalPrice || 0;
      const newPrice = await calculateNewPrice({
        travelPackageId: reservationData!.travelPackage.id,
        customAccommodationId: hotel.id,
        customAccommodationPrice: roomType.pricePerNight
      });

      console.log('✅ Novo preço calculado:', newPrice);

      // Calcular diferença baseada no preço real calculado
      const hotelPriceDiff = newPrice - originalPrice;

      // Mostrar comparação de preços
      setPriceComparison({
        originalPrice,
        newPrice,
        changeType: 'hotel',
        hotelPriceDiff
      });

      // KISS: Atualizar estado local em vez de chamar backend que não existe
      if (reservationData) {
        setReservationData({
          ...reservationData,
          selectedAccommodation: {
            id: hotel.id,
            name: hotel.name,
            description: hotel.description,
            destination: hotel.destination,
            roomType: roomType,
            starRating: hotel.starRating || 4,
            pricePerNight: roomType.pricePerNight,
            streetName: hotel.streetName || '',
            addressNumber: hotel.addressNumber || '',
            district: hotel.district || '',
            email: hotel.email || '',
            phone: hotel.phone || '',
            checkInTime: hotel.checkInTime || '14:00',
            checkOutTime: hotel.checkOutTime || '12:00',
            createdAt: hotel.createdAt || new Date().toISOString(),
            updatedAt: hotel.updatedAt
          },
          totalPrice: newPrice
        });
      }

      setShowHotelSelector(false);
    } catch (err) {
      console.error('Erro ao selecionar hotel:', err);

      // Fallback: mostrar comparação sem cálculo preciso
      if (reservationData) {
        const originalPrice = reservationData.totalPrice || 0;
        const hotelCostDiff = (roomType.pricePerNight * 5) - (originalPrice * 0.3); // 5 noites vs 30% do preço base
        const estimatedNewPrice = originalPrice + hotelCostDiff;

        setPriceComparison({
          originalPrice,
          newPrice: estimatedNewPrice,
          changeType: 'hotel',
          hotelPriceDiff: hotelCostDiff
        });

        // Atualizar estado mesmo com erro
        setReservationData({
          ...reservationData,
          selectedAccommodation: {
            id: hotel.id,
            name: hotel.name,
            description: hotel.description,
            destination: hotel.destination,
            roomType: roomType,
            starRating: hotel.starRating || 4,
            pricePerNight: roomType.pricePerNight,
            streetName: hotel.streetName || '',
            addressNumber: hotel.addressNumber || '',
            district: hotel.district || '',
            email: hotel.email || '',
            phone: hotel.phone || '',
            checkInTime: hotel.checkInTime || '14:00',
            checkOutTime: hotel.checkOutTime || '12:00',
            createdAt: hotel.createdAt || new Date().toISOString(),
            updatedAt: hotel.updatedAt
          },
          totalPrice: estimatedNewPrice
        });

        setShowHotelSelector(false);
      }
    }
  };

  // Estado de carregamento
  if (isLoading) {
    return (
      <Container className="mt-5">
        <div className="text-center py-5">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Carregando...</span>
          </Spinner>
          <div>Carregando dados da reserva...</div>
        </div>
      </Container>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="mb-4">
          <Alert.Heading>Ops! Algo deu errado</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>
              Tentar novamente
            </button>
          </div>
        </Alert>
      </Container>
    );
  }

  // Estado sem dados
  if (!reservationData) {
    return (
      <Container className="mt-5">
        <Alert variant="info" className="text-center py-5">
          <div className="mb-3" style={{ fontSize: '3rem' }}>🎫</div>
          <Alert.Heading>Nenhuma reserva encontrada</Alert.Heading>
          <p>Não foi possível carregar os dados da reserva.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">Resumo da Viagem</h2>
      <div className="mb-3 text-center">
        <h4 className="text-primary">{reservationData.travelPackage.title}</h4>
        <p className="text-muted">
          {reservationData.travelPackage.destination.name}, {reservationData.travelPackage.destination.country}
        </p>
      </div>

      {/* Detalhes adicionais sobre a acomodação, se estiver selecionada */}
      {reservationData.selectedAccommodation && (
        <div className="mb-4 text-center">
          <Alert variant="light" className="border shadow-sm">
            <h5>Detalhes da Acomodação</h5>
            <Row className="mt-3">
              <Col md={6}>
                <p className="mb-1"><strong>Hotel:</strong> {reservationData.selectedAccommodation.name}</p>
                <p className="mb-1">
                  <strong>Quarto:</strong> {reservationData.selectedAccommodation.roomType.name || 'Standard'}
                </p>
                <p className="mb-1">
                  <strong>Capacidade:</strong> {getRoomCapacityDetails(reservationData.selectedAccommodation.roomType)}
                </p>
              </Col>
              <Col md={6}>
                <p className="mb-1">
                  <strong>Check-in:</strong> {reservationData.selectedAccommodation.checkInTime || '14:00'}
                </p>
                <p className="mb-1">
                  <strong>Check-out:</strong> {reservationData.selectedAccommodation.checkOutTime || '12:00'}
                </p>
                <p className="mb-1">
                  <Badge bg="info">
                    {reservationData.selectedAccommodation.starRating} {'★'.repeat(Math.min(5, Math.max(1, reservationData.selectedAccommodation.starRating)))}
                  </Badge>
                </p>
              </Col>
            </Row>
            <p className="mt-2 text-muted small">
              {reservationData.selectedAccommodation.description?.length > 150
                ? reservationData.selectedAccommodation.description.slice(0, 150) + '...'
                : reservationData.selectedAccommodation.description}
            </p>
          </Alert>
        </div>
      )}

      {/* Cards principais ou seletores */}
      {!showFlightSelector && !showHotelSelector ? (
        <Row className="align-items-stretch">
          <Col xs={12} sm={12} md={6} lg={4} className="h-100 py-3">
            <FlightInfo
              onChangeFlight={handleChangeFlight}
              isActive={false}
            />
          </Col>
          <Col xs={12} sm={12} md={6} lg={4} className="h-100 py-3">
            <HotelInfo
              onChangeHotel={handleChangeHotel}
              isActive={false}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={4} className="h-100 py-3">
            <ReservationSummary priceComparison={priceComparison} />
          </Col>
        </Row>
      ) : (
        <>
          {/* Cards destacados quando seletores estão abertos */}
          <Row className="mb-4">
            <Col md={4}>
              <FlightInfo
                onChangeFlight={handleChangeFlight}
                isActive={showFlightSelector}
              />
            </Col>
            <Col md={4}>
              <HotelInfo
                onChangeHotel={handleChangeHotel}
                isActive={showHotelSelector}
              />
            </Col>
            <Col md={4}>
              <ReservationSummary priceComparison={priceComparison} />
            </Col>
          </Row>

          {/* Seletores */}
          {showFlightSelector && (
            <FlightSelector
              destination={reservationData.travelPackage.destination.name}
              destinationId={reservationData.travelPackage.destination.id}
              originId={1} // ID de São Paulo, pode ser configurável
              onClose={handleCloseSelectors}
              onSelectFlight={handleSelectFlight}
            />
          )}

          {showHotelSelector && (
            <HotelSelector
              destination={reservationData.travelPackage.destination.name}
              destinationId={reservationData.travelPackage.destination.id}
              onClose={handleCloseSelectors}
              onSelectHotel={handleSelectHotel}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default Reservation;