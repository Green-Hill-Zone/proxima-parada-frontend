import { useState } from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { useReservation } from "../../context/ReservationContext";
import { FaHotel, FaCoffee, FaExchangeAlt, FaEdit, FaCalendarAlt } from "react-icons/fa";
import { calculateNights, formatDisplayDate, formatWeekday } from "../../../../utils/dateHelpers";

interface HotelInfoProps {
  onChangeHotel?: () => void;
  isActive?: boolean;
}

const HotelInfo = ({ onChangeHotel, isActive = false }: HotelInfoProps) => {
  const { reservationData } = useReservation();
  const [selectedSuite, setSelectedSuite] = useState("master");

  // Se não há dados de reserva, não renderiza nada
  if (!reservationData) {
    return null;
  }

  // Obter datas do pacote de viagem
  const availableDates = reservationData.travelPackage.availableDates[0];
  const checkInDate = availableDates?.departureDate || '2025-07-28';
  const checkOutDate = availableDates?.returnDate || '2025-07-31';
  
  // Calcular número de diárias
  const numberOfNights = calculateNights(checkInDate, checkOutDate);

  // Dados do hotel (simulados baseados no pacote)
  const hotel = {
    name: `Hotel em ${reservationData.travelPackage.destination.name}`,
    image: '/path/to/default-hotel.jpg',
    rating: 4.5,
    location: reservationData.travelPackage.destination.name,
    suite: 'Quarto Duplo Standard'
  };

  return (
    <Card 
      className={`rounded-4 mb-0 ${isActive ? 'shadow-lg' : ''} stat-card`}
      style={{
        borderWidth: isActive ? '2px' : '1px',
        borderColor: isActive ? '#0d6efd' : '#dee2e6',
        borderStyle: 'solid',
        backgroundColor: isActive ? '#f8f9ff' : 'white',
        transition: 'all 0.3s ease',
        position: 'relative'
      }}
    >
      {isActive && (
        <div 
          className="position-absolute top-0 end-0 m-2"
          style={{ zIndex: 10 }}
        >
          <Badge bg="primary" className="d-flex align-items-center gap-1">
            <FaEdit size={12} />
            Editando
          </Badge>
        </div>
      )}
      
      <Card.Header
        className="rounded-top-4 d-flex justify-content-between align-items-center "
        style={{ background: isActive ? "#1d4ed8" : "#3246aa" }}
      >
        <header aria-level={2} className="d-flex gap-2 align-items-center">
          <FaHotel className="text-white" />
          <span className="d-block fw-bold text-white">Hotel</span>
        </header>
        <nav className="d-flex align-items-center gap-2">
          <a href="#" className="text-decoration-none fw-bold inline-block text-white">
            Detalhes do hotel
          </a>
        </nav>
      </Card.Header>
      <Card.Body className="rounded-4">
          <div className="col-auto">
            <img
              src="https://placehold.co/600x400"
              alt="Foto do hotel"
              className="rounded-3"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          </div>
          <div className="col">
            <h5 className="fw-bold mb-1">{hotel.name}</h5>
            <div className="text-muted small mb-2">
              {hotel.location} ·{" "}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  hotel.location
                )}`}
                className="fw-semibold text-decoration-none"
                target="_blank"
                rel="noopener noreferrer"
              >
                Veja no mapa
              </a>
            </div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="text-warning">★ ★ ★ ☆ ☆</span>
              <span className="text-secondary small">+15</span>
            </div>
            <div className="d-flex justify-content-between text-center mb-3">
              <div>
                <div className="fw-bold text-uppercase text-primary">
                  {formatDisplayDate(checkInDate)}
                </div>
                <div className="text-muted small">Entrada na {formatWeekday(checkInDate)}</div>
              </div>
              
              {/* Badge de diárias no centro */}
              <div className="d-flex align-items-center">
                <Badge 
                  bg="info" 
                  className="rounded-pill px-3 py-2 d-flex align-items-center gap-1"
                  style={{ fontSize: '0.85rem' }}
                >
                  <FaCalendarAlt size={12} />
                  {numberOfNights} {numberOfNights === 1 ? 'diária' : 'diárias'}
                </Badge>
              </div>
              
              <div>
                <div className="fw-bold text-uppercase text-primary">
                  {formatDisplayDate(checkOutDate)}
                </div>
                <div className="text-muted small">Saída na {formatWeekday(checkOutDate)}</div>
              </div>
            </div>
          </div>
        <div className="mt-2 d-flex justify-content-between align-items-center">
          <Badge bg="success" text="white">
            Reembolsável
          </Badge>
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={onChangeHotel}
            className="d-flex align-items-center gap-1"
          >
            <FaExchangeAlt size={12} />
            Trocar Hotel
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default HotelInfo;
