// Importações do React Bootstrap e componentes locais
import { Col, Container, Row } from 'react-bootstrap';
import TravelCarousel from './components/TravelCard/TravelCarousel.tsx';

import imgBg from '../../imgs/img-home/img-bg.png';
import '../../styles/home/heroSection.css';
import SearchSection from './components/SearchSection/SearchSection.tsx';

import { mockTravelPackages } from '../../data/mockData'; // Dados fictícios dos pacotes
import { HeroSection, TravelCard } from './components'; // Componentes específicos da Home
import './styles.css'; // Importa os estilos específicos da página Home

// Componente Home - Página principal da aplicação
const Home = () => {
  // Função executada quando usuário clica em "Ver detalhes" de um pacote
  const handleViewDetails = (packageId: string) => {
    console.log('Ver detalhes do pacote:', packageId);
    // Aqui você pode implementar a navegação para a página de detalhes
    // Exemplo: usar React Router para navegar para /pacote/[id]
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
          <Row>
            <Col>
              <TravelCarousel
                travelPackages={mockTravelPackages}
                onViewDetails={handleViewDetails}
              />
            </Col>
          </Row>
          {/* Grid de cartões de pacotes */}
          <Row className="home-packages-grid">
            {/* Mapeia cada pacote do array mockTravelPackages para um cartão */}
            {mockTravelPackages.map((travelPackage) => (
              <Col key={travelPackage.id} md={4} className="home-package-col"> {/* 3 colunas em tablets/desktop */}
                <TravelCard
                  travelPackage={travelPackage}        // Dados do pacote
                  onViewDetails={handleViewDetails}    // Função de callback para detalhes
                />
              </Col>
            ))}
          </Row>
        </Container>
      </main>

    </>
  );
};

export default Home;
