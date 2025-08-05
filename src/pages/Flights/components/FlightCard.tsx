/* ===================================================================== */
/* COMPONENTE FLIGHT CARD - EXIBIÇÃO DE VOO                            */
/* ===================================================================== */
/*
 * Componente para exibir informações de um voo em formato de card.
 * Segue padrões da indústria de viagens:
 * - Informações essenciais destacadas
 * - Layout responsivo
 * - Visual limpo e profissional
 */

import React from 'react';
import { Card, Badge, Button, Row, Col } from 'react-bootstrap';
import { type Flight, formatPrice, formatDateTime, calculateFlightDuration } from '../../../services/FlightService';
import './FlightCard.css';

// Interface para as props do componente
interface FlightCardProps {
  flight: Flight;
  onSelect?: (flight: Flight) => void;
  onBookNow?: (flight: Flight) => void;
}

// Componente FlightCard
const FlightCard: React.FC<FlightCardProps> = ({ 
  flight, 
  onSelect, 
  onBookNow 
}) => {
  
  /* ================================================================= */
  /* SISTEMA DE CORES POR COMPANHIA AÉREA                            */
  /* ================================================================= */
  /*
   * Cada companhia aérea tem uma cor específica flat color:
   * - LATAM: Roxo (#8e44ad) com ícone 🟣
   * - GOL: Laranja (#f39c12) com ícone 🟠  
   * - Azul: Dodger Blue (#1e90ff) com ícone 🔵
   * - Outras: Cinza (#6c757d) com ícone ✈️
   */
  
  // Função para determinar a cor do header baseada na companhia aérea
  const getAirlineHeaderColor = (airlineName: string): string => {
    const name = airlineName.toLowerCase();
    
    if (name.includes('latam')) {
      return '#8e44ad'; // Roxo flat
    } else if (name.includes('gol')) {
      return '#f39c12'; // Laranja flat
    } else if (name.includes('azul')) {
      return '#1e90ff'; // Dodger blue
    }
    
    return '#6c757d'; // Cinza padrão para outras companhias
  };

  // Função para obter o ícone da companhia aérea
  const getAirlineIcon = (airlineName: string): string => {
    const name = airlineName.toLowerCase();
    
    if (name.includes('latam')) {
      return '🟣'; // Círculo roxo
    } else if (name.includes('gol')) {
      return '🟠'; // Círculo laranja
    } else if (name.includes('azul')) {
      return '🔵'; // Círculo azul
    }
    
    return '✈️'; // Avião padrão para outras companhias
  };

  // Função para lidar com clique no card
  const handleCardClick = () => {
    if (onSelect) {
      onSelect(flight);
    }
  };

  // Função para lidar com clique no botão de reserva
  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que o clique no botão dispare o clique no card
    if (onBookNow) {
      onBookNow(flight);
    }
  };

  // Calcula a duração do voo
  const duration = calculateFlightDuration(flight.departureDateTime, flight.arrivalDateTime);

  return (
    <Card 
      className={`flight-card h-100 ${onSelect ? 'flight-card-clickable' : ''}`}
      onClick={handleCardClick}
    >
      {/* Header Colorido da Companhia Aérea */}
      <div 
        className="airline-header"
        style={{ 
          background: `linear-gradient(135deg, ${getAirlineHeaderColor(flight.airline.name)} 0%, ${getAirlineHeaderColor(flight.airline.name)}dd 100%)`,
          height: '6px',
          borderRadius: '12px 12px 0 0'
        }}
      />
      
      <Card.Body>
        {/* Header do Card - Companhia Aérea e Número do Voo */}
        <div className="flight-header d-flex justify-content-between align-items-center mb-3">
          <div className="airline-info">
            <h6 
              className="airline-name colored mb-1" 
              style={{ color: getAirlineHeaderColor(flight.airline.name) }}
            >
              <span className="airline-icon">{getAirlineIcon(flight.airline.name)}</span>
              {flight.airline.name}
            </h6>
            <small className="flight-number text-muted">
              Voo {flight.flightNumber} • {flight.airline.iataCode || 'N/A'}
            </small>
          </div>
          <div className="flight-class">
            <Badge bg="primary" className="me-1">{flight.cabinClass || 'Econômica'}</Badge>
            <Badge bg="secondary">{flight.seatClass || 'Standard'}</Badge>
          </div>
        </div>

        {/* Rota do Voo */}
        <Row className="flight-route mb-3">
          <Col xs={5} className="departure-info">
            <div className="time-display">
              {formatDateTime(flight.departureDateTime)}
            </div>
            <div className="location-display">
              <strong>{flight.originDestination.city || flight.originDestination.name}</strong>
            </div>
            <small className="text-muted">
              {flight.originDestination.country}
            </small>
          </Col>
          
          <Col xs={2} className="flight-arrow text-center">
            <div className="flight-duration">
              <small className="text-muted">{duration}</small>
            </div>
            <div className="arrow-icon">
              ✈️
            </div>
          </Col>
          
          <Col xs={5} className="arrival-info text-end">
            <div className="time-display">
              {formatDateTime(flight.arrivalDateTime)}
            </div>
            <div className="location-display">
              <strong>{flight.finalDestination.city || flight.finalDestination.name}</strong>
            </div>
            <small className="text-muted">
              {flight.finalDestination.country}
            </small>
          </Col>
        </Row>

        {/* Preço e Disponibilidade */}
        <Row className="flight-pricing align-items-center">
          <Col xs={6}>
            <div className="price-display">
              <span className="price-value">
                {formatPrice(flight.price)}
              </span>
              <small className="text-muted d-block">por pessoa</small>
            </div>
          </Col>
          
          <Col xs={6} className="text-end">
            <div className="availability-info mb-2">
              <small className="text-muted">
                {flight.availableSeats || 'Consultar'} {(flight.availableSeats || 0) === 1 ? 'assento' : 'assentos'} disponível
                {(flight.availableSeats || 0) !== 1 ? 'is' : ''}
              </small>
            </div>
            
            {onBookNow && (
              <Button
                variant="primary"
                className="btn-book-flight"
                onClick={handleBookNow}
                disabled={(flight.availableSeats || 0) === 0}
              >
                {(flight.availableSeats || 0) === 0 ? 'Esgotado' : 'Reservar'}
              </Button>
            )}
          </Col>
        </Row>

        {/* Informações Adicionais */}
        <div className="flight-extras mt-3 pt-3 border-top">
          <Row>
            <Col xs={6}>
              <small className="text-muted">
                🛏️ Classe: {flight.cabinClass}
              </small>
            </Col>
            <Col xs={6} className="text-end">
              <small className="text-muted">
                💺 Tipo: {flight.seatClass}
              </small>
            </Col>
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
};

export default FlightCard;
