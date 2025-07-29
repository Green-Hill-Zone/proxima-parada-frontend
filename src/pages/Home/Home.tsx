// Importações do React Bootstrap e componentes locais
import { useEffect, useState } from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { type TravelPackageListItem } from '../../Entities/TravelPackage';
import imgBg from '../../imgs/img-home/img-bg.png';
import { getFeaturedPackages } from '../../services/TravelPackageService';
import '../../styles/home/heroSection.css';
import { HeroSection, TravelCard } from './components'; // Componentes específicos da Home
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
        const packages = await getFeaturedPackages(6); // Busca 6 pacotes em destaque
        setFeaturedPackages(packages);
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
    console.log('Ver detalhes do pacote:', packageId);
    navigate(`/pacotes/${packageId}`);
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

        <Row className="home-packages-grid mt-5">
          <Col xs={12}>
            <h3 className="mb-4">Todos os Pacotes</h3>
          </Col>
          {featuredPackages.map((travelPackage) => (
            <Col key={travelPackage.Id} md={4} className="home-package-col mb-4">
              <TravelCard
                travelPackage={travelPackage}
                onViewDetails={handleViewDetails}
              />
            </Col>
          ))}
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
              <h2 className="home-packages-title">Pacotes em Destaque</h2>
            </Col>
          </Row>

          {renderPackagesContent()}
        </Container>
      </main>
    </>
  );
};

export default Home;