import { Container, Row, Col } from 'react-bootstrap';
import { Header, Footer } from '../../components';
import { HeroSection, TravelCard } from './components';
import { mockTravelPackages } from '../../data/mockData';

const Home = () => {
  const handleViewDetails = (packageId: string) => {
    console.log('Ver detalhes do pacote:', packageId);
    // Aqui você pode implementar a navegação para a página de detalhes
  };

  return (
    <>
      <Header />
      <main>
        <HeroSection 
          title="Descubra o Mundo"
          subtitle="Encontre os melhores pacotes de viagem para sua próxima aventura"
        />

        <Container className="py-5">
          <Row className="mb-4">
            <Col>
              <h2 className="text-center">Pacotes em Destaque</h2>
            </Col>
          </Row>
          <Row>
            {mockTravelPackages.map((travelPackage) => (
              <Col key={travelPackage.id} md={4} className="mb-4">
                <TravelCard 
                  travelPackage={travelPackage}
                  onViewDetails={handleViewDetails}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default Home;
