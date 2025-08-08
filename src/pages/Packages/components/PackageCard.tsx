import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { type TravelPackageListItem } from '../../../Entities/TravelPackage';

interface PackageCardProps {
  travelPackage: TravelPackageListItem;
}

const PackageCard: React.FC<PackageCardProps> = ({ travelPackage }) => {
  // Verificação de segurança - se não tem travelPackage, retorna null
  if (!travelPackage) {
    console.error('PackageCard: travelPackage é undefined');
    return null;
  }

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7102';

  // Ajustando para a nova estrutura do backend
  const packageData = travelPackage as any; // Cast para acessar as propriedades do backend
  const id = packageData.id || packageData.Id;
  const title = packageData.title || packageData.Name;
  const description = packageData.description || packageData.Description;
  const price = packageData.price || packageData.BasePrice;
  const destination = packageData.destination || packageData.MainDestination;

  // Melhor tratamento para as imagens - similar ao HotelSelector
  const extractImageUrl = () => {
    // Verificar as possíveis estruturas de dados para imagens
    const imagesData = packageData.images || packageData.Images;

    // Se não existem imagens, retornar imagem padrão
    if (!imagesData) {
      return 'https://picsum.photos/300/200?text=Sem+Imagem';
    }

    // Lidar com estrutura $values do .NET de maneira segura
    let imageArray: any[] = [];

    // Verificar se imagesData é um objeto com propriedade $values
    if (imagesData && typeof imagesData === 'object' && !Array.isArray(imagesData) && '$values' in imagesData) {
      imageArray = imagesData.$values || [];
    }
    // Se é um array diretamente
    else if (Array.isArray(imagesData)) {
      imageArray = imagesData;
    }

    // Se array vazio
    if (imageArray.length === 0) {
      return 'https://picsum.photos/300/200?text=Sem+Imagem';
    }

    // Obter a primeira imagem
    const mainImage = imageArray[0];

    // Se a imagem tem uma URL completa, usá-la diretamente
    if (mainImage.url && mainImage.url.startsWith('http')) {
      return mainImage.url;
    }

    // Se a imagem tem uma URL relativa, adicionar o prefixo da API
    if (mainImage.url) {
      return `${API_BASE_URL}${mainImage.url}`;
    }

    // Se a imagem usa o campo ImageUrl em vez de url
    if (mainImage.ImageUrl && mainImage.ImageUrl.startsWith('http')) {
      return mainImage.ImageUrl;
    }

    if (mainImage.ImageUrl) {
      return `${API_BASE_URL}${mainImage.ImageUrl}`;
    }

    // Fallback para imagem padrão
    return 'https://picsum.photos/300/200?text=Sem+Imagem';
  };

  const imageUrl = extractImageUrl();
  const imageAlt = title || 'Imagem do pacote de viagem';

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

  /**
   * ✅ NOVO: Função para comprar diretamente (baseada na pasta FRONT)
   */
  const handleBuyDirectly = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impedir que o evento click do card seja ativado
    try {
      if (id) {
        navigate('/payment', {
          state: {
            travelData: {
              id: id,
              name: title || 'Pacote de Viagem',
              price: price || 0,
              quantity: 1 // Padrão 1 pessoa, pode ser alterado na página de pagamento
            }
          }
        });
      } else {
        console.error('ID do pacote não encontrado');
      }
    } catch (error) {
      console.error('Erro ao navegar para pagamento:', error);
    }
  };

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
          
          {/* ✅ NOVO: Botão para comprar diretamente */}
          <Button
            variant="success"
            size="sm"
            onClick={handleBuyDirectly}
            className="ms-2"
          >
            💳 Comprar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PackageCard;