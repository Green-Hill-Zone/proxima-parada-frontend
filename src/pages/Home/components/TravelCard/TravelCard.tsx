import React, { useState } from 'react';
import { Button, Card, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { type TravelPackageListItem } from '../../../../Entities/TravelPackage';

interface TravelCardProps {
  travelPackage: TravelPackageListItem;
  onViewDetails?: (id: number) => void;
}


const TravelCard: React.FC<TravelCardProps> = ({ travelPackage, onViewDetails }) => {
  // Ajustando para a nova estrutura do backend
  const packageData = travelPackage as any; // Cast para acessar as propriedades do backend
  const id = packageData.id || packageData.Id;
  const title = packageData.title || packageData.Name;
  const description = packageData.description || packageData.Description;
  const price = packageData.price || packageData.BasePrice;
  const destination = packageData.destination || packageData.MainDestination;
  
  // Extrair imagens da nova estrutura do backend
  const imagesData = packageData.images;
  const imageArray = imagesData?.$values || imagesData || [];
  const mainImage = Array.isArray(imageArray) ? imageArray[0] : null;
  const imageUrl = mainImage?.url || mainImage?.ImageUrl || 'https://picsum.photos/300/200?text=Sem+Imagem';
  const imageAlt = mainImage?.altText || mainImage?.AltText || title;
  
  const truncatedDescription = description?.length > 120
    ? `${description.substring(0, 120)}...`
    : description;


  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleShowDetails = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const handleReserve = () => {
    // Navegar para reserva passando o ID do pacote
    navigate('/reservation', { 
      state: { 
        packageId: id 
      } 
    });
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
          <Card.Title>{title}</Card.Title>

          {destination && (
            <Card.Subtitle className="mb-2 text-muted">
              {destination.name || destination.Name}, {destination.country || destination.Country}
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
                }).format(price)}
              </h5>
              <small className="text-muted">Pacote de viagem</small>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={imageUrl}
            alt={imageAlt}
            style={{ width: '100%', height: '200px', objectFit: 'cover', marginBottom: 16 }}
          />
          <p><strong>Destino:</strong> {destination?.name || destination?.Name}, {destination?.country || destination?.Country}</p>
          <p><strong>Descrição:</strong> {description}</p>
          <p><strong>Preço:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}</p>
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