// Importações do React Bootstrap e componentes locais
import { Col, Container, Row } from 'react-bootstrap';
import { mockTravelPackages } from '../../data/mockData'; // Dados fictícios dos pacotes
import imgBg from '../../imgs/img-home/img-bg.png';
import '../../styles/home/heroSection.css';
import { HeroSection, TravelCard } from './components'; // Componentes específicos da Home
import SearchSection from './components/SearchSection/SearchSection.tsx';
import TravelCarousel from './components/TravelCard/TravelCarousel.tsx';
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
              <h2 className="ages-title">Pacotes em Destaque</h2>
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
        
        </Container>
      </main>

    </>
  );
};

export default Home;
