// Importações do React Bootstrap e componentes locais
import { useEffect, useState } from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { type TravelPackageListItem } from '../../Entities/TravelPackage';
import imgBg from '../../imgs/img-home/img-bg.png';
import { getFeaturedPackages } from '../../services/TravelPackageService';
import '../../styles/home/heroSection.css';
import { HeroSection } from './components'; // Componentes específicos da Home
import SearchSection from './components/SearchSection/SearchSection.tsx';
import TravelCarousel from './components/TravelCard/TravelCarousel.tsx';
import './styles.css'; // Importa os estilos específicos da página Home

// Componente Home - Página principal da aplicação
const Home = () => {
  const navigate = useNavigate();
  const [featuredPackages, setFeaturedPackages] = useState<TravelPackageListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedPackages = async () => {
      try {
        setIsLoading(true);
        const packages = await getFeaturedPackages(); // Busca pacotes em destaque
        setFeaturedPackages(packages.slice(0, 6)); // Limita a 6 pacotes
      } catch (err) {
        console.error('Erro ao carregar pacotes em destaque:', err);
        setError('Não foi possível carregar os pacotes em destaque. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedPackages();
  }, []);

  // Função executada quando usuário clica em "Ver detalhes" de um pacote
  const handleViewDetails = (packageId: number) => {
    console.log('Navegando para reserva do pacote:', packageId);
    navigate('/reservation', { 
      state: { 
        packageId: packageId 
      } 
    });
  };

  const renderPackagesContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Carregando...</span>
          </Spinner>
          <p className="mt-2">Carregando pacotes em destaque...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-5 text-danger">
          <p>{error}</p>
        </div>
      );
    }

    if (featuredPackages.length === 0) {
      return (
        <div className="text-center py-5">
          <p>Nenhum pacote em destaque disponível no momento.</p>
        </div>
      );
    }

    return (
      <>
        <Row>
          <Col>
            <TravelCarousel
              travelPackages={featuredPackages}
              onViewDetails={handleViewDetails}
            />
          </Col>
        </Row>
      </>
    );
  };

  return (
    <>
      {/* Conteúdo principal da página */}
      <main className="home-main">
        {/* Seção hero com título e subtítulo de destaque */}
        <HeroSection
          imgSrc={imgBg}
          title={`Descubra o mundo,\ndescubra a si mesmo`}
          subtitle="Encontre os melhores pacotes de viagem para sua próxima aventura"
        />
        <SearchSection />

        {/* Container para os pacotes de viagem */}
        <Container className="home-packages-section">
          {/* Título da seção de pacotes */}
          <Row className="mb-4">
            <Col>
              <h2 className="ages-title">Pacotes em Destaque</h2>
            </Col>
          </Row>

          {renderPackagesContent()}
        </Container>
      </main>
    </>
  );
};

export default Home;