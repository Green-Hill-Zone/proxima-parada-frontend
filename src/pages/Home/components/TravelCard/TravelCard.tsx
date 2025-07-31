import React, { useState } from 'react';
import { Button, Card, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { type TravelPackageListItem } from '../../../../Entities/TravelPackage';

interface TravelCardProps {
  travelPackage: TravelPackageListItem;
  onViewDetails?: (id: number) => void;
}


const TravelCard: React.FC<TravelCardProps> = ({ travelPackage, onViewDetails }) => {
  const { Id, id, Name, Description, BasePrice, Images, MainDestination, Duration } = travelPackage as any;
  const mainImage = Images?.find((img: any) => img.IsMain) || Images?.[0];
  const imageUrl = mainImage?.ImageUrl || 'https://via.placeholder.com/300x200?text=Sem+Imagem';
  const imageAlt = mainImage?.AltText || Name;
  const truncatedDescription = Description?.length > 120
    ? `${Description.substring(0, 120)}...`
    : Description;


  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleShowDetails = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const handleReserve = () => {
    navigate('/reservation');
  };

  return (
    <>
      <Card className="h-100 shadow-sm" style={{ cursor: 'pointer' }} onClick={handleShowDetails}>
        <Card.Img
          variant="top"
          src={imageUrl}
          alt={imageAlt}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <Card.Body className="d-flex flex-column">
          <Card.Title>{Name}</Card.Title>

          {MainDestination && (
            <Card.Subtitle className="mb-2 text-muted">
              {MainDestination.Name}, {MainDestination.Country}
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
                }).format(BasePrice)}
              </h5>
              <small className="text-muted">{Duration} dias</small>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{Name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={imageUrl}
            alt={imageAlt}
            style={{ width: '100%', height: '200px', objectFit: 'cover', marginBottom: 16 }}
          />
          <p><strong>Destino:</strong> {MainDestination?.Name}, {MainDestination?.Country}</p>
          <p><strong>Descrição:</strong> {Description}</p>
          <p><strong>Preço:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(BasePrice)}</p>
          <p><strong>Duração:</strong> {Duration} dias</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleReserve}>
            Reservar agora
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TravelCard;