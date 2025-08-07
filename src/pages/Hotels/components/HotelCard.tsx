/* ===================================================================== */
/* COMPONENTE HOTEL CARD - EXIBIÇÃO DE ACOMODAÇÃO                      */
/* ===================================================================== */
/*
 * Componente para exibir informações de uma acomodação em formato de card.
 * Segue padrões da indústria de viagens:
 * - Informações essenciais destacadas
 * - Layout responsivo
 * - Visual limpo e profissional
 */

import React from 'react';
import { Card, Badge, Button, Row, Col } from 'react-bootstrap';
import { 
  type Accommodation, 
  formatPrice, 
  formatTime, 
  getStarRating,
  calculateTotalPrice 
} from '../../../services/AccommodationService';
import './HotelCard.css';

// Interface para as props do componente
interface HotelCardProps {
  accommodation: Accommodation;
  checkIn?: string;
  checkOut?: string;
  onSelect?: (accommodation: Accommodation) => void;
  onBookNow?: (accommodation: Accommodation) => void;
}

// Componente HotelCard
const HotelCard: React.FC<HotelCardProps> = ({ 
  accommodation, 
  checkIn,
  checkOut,
  onSelect, 
  onBookNow 
}) => {
  
  /* ================================================================= */
  /* SISTEMA DE CORES POR CATEGORIA DE HOTEL                         */
  /* ================================================================= */
  /*
   * Cada categoria de hotel tem uma cor específica:
   * - 5 estrelas: Dourado (#f39c12) com ícone 🏆
   * - 4 estrelas: Azul (#3498db) com ícone 💎
   * - 3 estrelas: Verde (#27ae60) com ícone ⭐
   * - 1-2 estrelas: Cinza (#6c757d) com ícone 🏨
   */
  
  // Função para determinar a cor do header baseada na categoria
  const getHotelHeaderColor = (starRating: number): string => {
    if (starRating >= 5) {
      return '#f39c12'; // Dourado flat
    } else if (starRating >= 4) {
      return '#3498db'; // Azul flat
    } else if (starRating >= 3) {
      return '#27ae60'; // Verde flat
    } else {
      return '#6c757d'; // Cinza flat
    }
  };

  // Função para obter o ícone baseado na categoria
  const getHotelIcon = (starRating: number): string => {
    if (starRating >= 5) {
      return '🏆';
    } else if (starRating >= 4) {
      return '💎';
    } else if (starRating >= 3) {
      return '⭐';
    } else {
      return '🏨';
    }
  };

  // Calcula o preço total se houver datas
  const totalPrice = checkIn && checkOut 
    ? calculateTotalPrice(accommodation.pricePerNight, checkIn, checkOut)
    : accommodation.pricePerNight;

  const nights = checkIn && checkOut 
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 1;

  /* ================================================================= */
  /* RENDERIZAÇÃO                                                     */
  /* ================================================================= */

  return (
    <Card className="hotel-card h-100 shadow-sm">
      {/* Header do Card com cor baseada na categoria */}
      <Card.Header 
        className="hotel-card-header text-white"
        style={{ backgroundColor: getHotelHeaderColor(accommodation.starRating) }}
      >
        <Row className="align-items-center">
          <Col>
            <div className="d-flex align-items-center">
              <span className="hotel-icon me-2" style={{ fontSize: '1.2em' }}>
                {getHotelIcon(accommodation.starRating)}
              </span>
              <div>
                <h6 className="mb-0 fw-bold">{accommodation.name}</h6>
                <small className="opacity-90">
                  {accommodation.destination.city}, {accommodation.destination.country}
                </small>
              </div>
            </div>
          </Col>
          <Col xs="auto">
            <Badge bg="light" text="dark" className="star-rating">
              {getStarRating(accommodation.starRating)}
            </Badge>
          </Col>
        </Row>
      </Card.Header>

      {/* Corpo do Card */}
      <Card.Body className="d-flex flex-column">
        {/* Informações Principais */}
        <Row className="mb-3">
          <Col md={8}>
            <div className="hotel-info">
              {/* Tipo de Quarto */}
              <div className="info-item mb-2">
                <small className="text-muted">🛏️ Tipo de Quarto:</small>
                <div className="fw-semibold">{accommodation.roomType.name}</div>
              </div>

              {/* Localização */}
              <div className="info-item mb-2">
                <small className="text-muted">📍 Endereço:</small>
                <div className="fw-semibold">
                  {accommodation.streetName}, {accommodation.addressNumber}
                </div>
                <small className="text-muted">{accommodation.district}</small>
              </div>

              {/* Check-in / Check-out */}
              <div className="info-item mb-2">
                <small className="text-muted">🕐 Check-in / Check-out:</small>
                <div className="fw-semibold">
                  {formatTime(accommodation.checkInTime)} / {formatTime(accommodation.checkOutTime)}
                </div>
              </div>
            </div>
          </Col>
          
          <Col md={4} className="text-end">
            {/* Preços */}
            <div className="price-section">
              <div className="price-per-night text-muted mb-1">
                <small>Por noite:</small>
              </div>
              <div className="price-amount h5 text-primary fw-bold mb-1">
                {formatPrice(accommodation.pricePerNight)}
              </div>
              
              {/* Preço total se houver datas */}
              {checkIn && checkOut && nights > 1 && (
                <div className="total-price">
                  <Badge bg="success" className="mb-2">
                    {nights} noite{nights > 1 ? 's' : ''}: {formatPrice(totalPrice)}
                  </Badge>
                </div>
              )}
            </div>
          </Col>
        </Row>

        {/* Descrição */}
        {accommodation.description && (
          <div className="hotel-description mb-3">
            <small className="text-muted">ℹ️ Sobre:</small>
            <p className="mb-0 mt-1" style={{ fontSize: '0.9em', lineHeight: '1.4' }}>
              {accommodation.description}
            </p>
          </div>
        )}

        {/* Informações de Contato */}
        <div className="contact-info mb-3">
          <Row>
            <Col md={6}>
              <small className="text-muted">📧 Email:</small>
              <div style={{ fontSize: '0.85em' }}>{accommodation.email}</div>
            </Col>
            <Col md={6}>
              <small className="text-muted">📞 Telefone:</small>
              <div style={{ fontSize: '0.85em' }}>{accommodation.phone}</div>
            </Col>
          </Row>
        </div>

        {/* Ações - sempre no final do card */}
        <div className="mt-auto">
          <Row className="g-2">
            <Col>
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="w-100"
                onClick={() => onSelect?.(accommodation)}
              >
                Ver Detalhes
              </Button>
            </Col>
            <Col>
              <Button 
                variant="primary" 
                size="sm" 
                className="w-100"
                onClick={() => onBookNow?.(accommodation)}
              >
                Reservar
              </Button>
            </Col>
          </Row>
        </div>
      </Card.Body>

      {/* Footer com informações adicionais */}
      <Card.Footer className="text-muted">
        <Row className="align-items-center">
          <Col>
            <small>
              🏨 Categoria: {accommodation.starRating} estrela{accommodation.starRating > 1 ? 's' : ''}
            </small>
          </Col>
          <Col xs="auto">
            <small>
              📅 Adicionado em {new Date(accommodation.createdAt).toLocaleDateString('pt-BR')}
            </small>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default HotelCard;
