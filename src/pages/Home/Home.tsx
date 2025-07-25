import { Container, Row, Col } from 'react-bootstrap';
import { Header, Footer } from '../../components';
import { HeroSection,  } from './components';
import { mockTravelPackages } from '../../data/mockData';
import TravelCarousel from './components/TravelCard/TravelCarousel.tsx';

import imgBg from '../../imgs/img-home/img-bg.png';
import '../../styles/home/heroSection.css';
import SearchSection from './components/SearchSection/SearchSection.tsx';

const Home = () => {
  const handleViewDetails = (packageId: string) => {
    console.log('Ver detalhes do pacote:', packageId);
  };

  return (
    <>
      <Header />
      <main>
        <HeroSection
          imgSrc={imgBg}
          title={`Descubra o mundo,\ndescubra a si mesmo`}
          subtitle="Encontre os melhores pacotes de viagem para sua próxima aventura"
        />
        <SearchSection></SearchSection>

        <Container className="py-5">
          <Row className="mb-4">
            <Col>
              <h2 className="text-center">Pacotes em Destaque</h2>
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
      <Footer />
    </>
  );
};

export default Home;
