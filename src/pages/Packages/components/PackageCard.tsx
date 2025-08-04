import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { type TravelPackageListItem } from '../../../Entities/TravelPackage';

interface PackageCardProps {
  travelPackage: TravelPackageListItem;
}

const PackageCard: React.FC<PackageCardProps> = ({ travelPackage }) => {
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

  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    try {
      // Ir direto para reserva ao clicar no card
      e.preventDefault();
      if (id) {
        navigate('/reservation', { 
          state: { 
            packageId: id 
          } 
        });
      } else {
        console.error('ID do pacote não encontrado');
      }
    } catch (error) {
      console.error('Erro ao navegar:', error);
    }
  };

  // Validações de segurança
  if (!travelPackage) {
    console.error('PackageCard: travelPackage é undefined');
    return <div>Erro: Dados do pacote não encontrados</div>;
  }

  if (!title) {
    console.error('PackageCard: title é undefined');
    return <div>Erro: Título do pacote não encontrado</div>;
  }

  return (
    <Card className="h-100 shadow-sm" style={{ cursor: 'pointer' }} onClick={handleCardClick}>
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
              {price ? new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(price) : 'Preço não disponível'}
            </h5>
            <small className="text-muted">Pacote de viagem</small>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PackageCard;
