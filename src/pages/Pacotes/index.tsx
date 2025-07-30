import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { mockTravelPackages } from '../../data/mockData';
import TravelCard from '../Home/components/TravelCard/TravelCard';

const Pacotes = () => {
  const handleViewDetails = (packageId: string) => {
    // Aqui você pode implementar a navegação para detalhes do pacote
    console.log('Ver detalhes do pacote:', packageId);
  };

  return (
    <Container className="mt-5">
      <h1>Pacotes</h1>
      <Row>
        {mockTravelPackages.map((travelPackage) => (
          <Col key={travelPackage.id} xs={12} sm={6} md={4} className="home-package-col mb-4">
            <TravelCard
              travelPackage={travelPackage}
              onViewDetails={handleViewDetails}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Pacotes;
