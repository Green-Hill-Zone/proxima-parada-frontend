
import { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import TravelCard from '../Home/components/TravelCard/TravelCard';
import { getTravelPackages } from '../../services/TravelPackageService';
import { type TravelPackageListItem } from '../../Entities/TravelPackage';

const Packages = () => {
  const [travelPackages, setTravelPackages] = useState<TravelPackageListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        setIsLoading(true);
        const packages = await getTravelPackages();
        setTravelPackages(packages);
      } catch (err) {
        setError('Não foi possível carregar os pacotes.');
      } finally {
        setIsLoading(false);
      }
    };
    loadPackages();
  }, []);

  const handleViewDetails = (id: number) => {
    console.log('View package details:', id);
  };

  return (
    <main className="home-main">
      <Container className="mt-5 home-packages-section">
        <Row className="mb-4">
          <Col>
            <h2 className="ages-title">Pacotes</h2>
          </Col>
        </Row>
        <Row>
          {isLoading ? (
            <Col className="text-center py-5">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Carregando...</span>
              </Spinner>
              <p className="mt-2">Carregando pacotes...</p>
            </Col>
          ) : error ? (
            <Col className="text-center py-5 text-danger">
              <p>{error}</p>
            </Col>
          ) : travelPackages.length === 0 ? (
            <Col>
              <p className="text-center text-muted">No packages found.</p>
            </Col>
          ) : (
            <>
              {travelPackages.map((travelPackage) => (
                <Col key={travelPackage.Id} xs={12} sm={6} md={4} className="home-package-col mb-4">
                  <TravelCard
                    travelPackage={travelPackage}
                    onViewDetails={handleViewDetails}
                  />
                </Col>
              ))}
            </>
          )}
        </Row>
      </Container>
    </main>
  );
};

export default Packages;
