import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import { FaHotel, FaTimes, FaFilter, FaStar, FaWifi, FaSwimmingPool, FaCoffee } from 'react-icons/fa';
import { getAccommodationsByDestination } from '../../../../services/AccommodationService';

interface RoomType {
  id: number;
  name: string;
  description: string;
  maxOccupancy: number;
  pricePerNight: number;
  amenities: string[];
}

interface HotelOption {
  id: number;
  name: string;
  rating: number;
  location: string;
  image: string;
  pricePerNight: number;
  amenities: string[];
  roomTypes: RoomType[];
}

interface HotelSelectorProps {
  destination: string;
  destinationId: number;
  onClose: () => void;
  onSelectHotel: (hotel: HotelOption, roomType: RoomType) => void;
}

const HotelSelector: React.FC<HotelSelectorProps> = ({
  destination,
  destinationId,
  onClose,
  onSelectHotel
}) => {
  const [priceFilter, setPriceFilter] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<string>('');
  const [amenityFilter, setAmenityFilter] = useState<string>('');
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<{ [hotelId: number]: number }>({});
  const [hotels, setHotels] = useState<HotelOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar hotéis do backend
  useEffect(() => {
    const fetchHotels = async () => {
      if (!destinationId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const backendAccommodations = await getAccommodationsByDestination(destinationId);
        
        const mappedHotels = mapBackendHotelToComponent(backendAccommodations);
        
        setHotels(mappedHotels);
      } catch (err) {
        console.error('Erro ao buscar hotéis:', err);
        setError('Não foi possível carregar os hotéis. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [destinationId]);

  // Função para mapear dados do backend para o formato do componente
  const mapBackendHotelToComponent = (backendAccommodations: any[]): HotelOption[] => {
  return backendAccommodations.map(accommodation => {
    const firstImage = accommodation.images[0]?.url;
    console.log("estrelas na requisição:", accommodation.starRating);
    
   
    return {
      id: accommodation.id,
      name: accommodation.name,
      rating: accommodation.starRating || 4,
      location: accommodation.location || `Centro de ${destination}`,
      image: firstImage
        ? `http://localhost:5079${firstImage}`
        : "https://via.placeholder.com/300x200.png?text=Sem+Imagem", // fallback se não houver imagem
      pricePerNight: accommodation.pricePerNight || 200,
      amenities: accommodation.amenities || ['WiFi Grátis'],
      roomTypes: accommodation.roomTypes || [{
        id: 1,
        name: 'Standard',
        description: 'Quarto padrão',
        maxOccupancy: 2,
        pricePerNight: accommodation.pricePerNight || 200,
        amenities: ['WiFi Grátis']
      }]
    };
  });
};


  
  const filteredHotels = hotels.filter(hotel => {
    if (priceFilter === 'low' && hotel.pricePerNight > 200) return false;
    if (priceFilter === 'medium' && (hotel.pricePerNight <= 200 || hotel.pricePerNight > 400)) return false;
    if (priceFilter === 'high' && hotel.pricePerNight <= 400) return false;
    if (ratingFilter && hotel.rating < parseInt(ratingFilter)) return false;
    if (amenityFilter && !hotel.amenities.some(amenity => amenity.toLowerCase().includes(amenityFilter.toLowerCase()))) return false;
    return true;
  });

  const handleSelectHotel = (hotel: HotelOption) => {
    const selectedRoomTypeId = selectedRoomTypes[hotel.id] || hotel.roomTypes[0].id;
    const selectedRoomType = hotel.roomTypes.find(rt => rt.id === selectedRoomTypeId)!;
    onSelectHotel(hotel, selectedRoomType);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} className={i < rating ? 'text-warning' : 'text-muted'} size={12} />
    ));
  };

  return (
    <Row className="mt-4">
      {/* Filtros */}
      <Col md={3}>
        <Card className="mb-3">
          <Card.Header className="d-flex align-items-center gap-2">
            <FaFilter />
            <span>Filtros</span>
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label><strong>Preço por noite</strong></Form.Label>
              <Form.Select 
                value={priceFilter} 
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="low">Até R$ 200</option>
                <option value="medium">R$ 200 - R$ 400</option>
                <option value="high">Acima de R$ 400</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><strong>Avaliação mínima</strong></Form.Label>
              <Form.Select 
                value={ratingFilter} 
                onChange={(e) => setRatingFilter(e.target.value)}
              >
                <option value="">Todas</option>
                <option value="3">3+ estrelas</option>
                <option value="4">4+ estrelas</option>
                <option value="5">5 estrelas</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><strong>Comodidades</strong></Form.Label>
              <Form.Select 
                value={amenityFilter} 
                onChange={(e) => setAmenityFilter(e.target.value)}
              >
                <option value="">Todas</option>
                <option value="piscina">Piscina</option>
                <option value="spa">Spa</option>
                <option value="academia">Academia</option>
                <option value="café">Café da Manhã</option>
              </Form.Select>
            </Form.Group>

            <Button variant="outline-secondary" size="sm" onClick={onClose}>
              <FaTimes className="me-1" />
              Fechar
            </Button>
          </Card.Body>
        </Card>
      </Col>

      {/* Lista de Hotéis */}
      <Col md={9}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Hotéis em {destination}</h5>
          {!loading && !error && (
            <span className="text-muted">{filteredHotels.length} hotéis encontrados</span>
          )}
        </div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <p className="mt-2 text-muted">Buscando hotéis disponíveis...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            <strong>Erro ao carregar hotéis:</strong> {error}
          </div>
        )}

        {!loading && !error && filteredHotels.length === 0 && (
          <div className="alert alert-info" role="alert">
            <strong>Nenhum hotel encontrado</strong> com os filtros selecionados.
          </div>
        )}

        {!loading && !error && filteredHotels.map((hotel) => {
          const selectedRoomType = hotel.roomTypes.find(rt => rt.id === selectedRoomTypes[hotel.id]) || hotel.roomTypes[0];
          
          return (
            <Card key={hotel.id} className="mb-3 hotel-card">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={2}>
                    <img 
                      src={hotel.image} 
                      alt={hotel.name}
                      style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  </Col>
                  
                  <Col md={5}>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <FaHotel className="text-primary" />
                      <strong>{hotel.name}</strong>
                    </div>
                    <div className="mb-1">{renderStars(hotel.rating)}</div>
                    <small className="text-muted">{hotel.location}</small>
                    
                    <div className="mt-2">
                      <Form.Group>
                        <Form.Label className="small"><strong>Tipo de Quarto:</strong></Form.Label>
                        <Form.Select 
                          size="sm"
                          value={selectedRoomTypes[hotel.id] || hotel.roomTypes[0].id}
                          onChange={(e) => setSelectedRoomTypes({
                            ...selectedRoomTypes,
                            [hotel.id]: parseInt(e.target.value)
                          })}
                        >
                          {hotel.roomTypes.map(roomType => (
                            <option key={roomType.id} value={roomType.id}>
                              {roomType.name} - R$ {roomType.pricePerNight}/noite
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </div>
                    
                    <div className="mt-2">
                      <small className="text-muted">{selectedRoomType.description}</small>
                    </div>
                  </Col>
                  
                  <Col md={3}>
                    <div className="mb-2">
                      <div className="d-flex flex-wrap gap-1">
                        {hotel.amenities.slice(0, 3).map((amenity, index) => (
                          <Badge key={index} bg="light" text="dark" className="small">
                            {amenity === 'WiFi Grátis' && <FaWifi className="me-1" />}
                            {amenity === 'Piscina' && <FaSwimmingPool className="me-1" />}
                            {amenity === 'Café da Manhã' && <FaCoffee className="me-1" />}
                            {amenity}
                          </Badge>
                        ))}
                        {hotel.amenities.length > 3 && (
                          <Badge bg="secondary" className="small">
                            +{hotel.amenities.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Col>
                  
                  <Col md={2} className="text-center">
                    <div><strong className="text-success">R$ {selectedRoomType.pricePerNight.toLocaleString()}</strong></div>
                    <small className="text-muted">por noite</small>
                    <div className="mt-2">
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleSelectHotel(hotel)}
                      >
                        Selecionar
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          );
        })}
      </Col>
    </Row>
  );
};

export default HotelSelector;
