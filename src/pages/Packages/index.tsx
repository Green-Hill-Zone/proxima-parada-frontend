
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import PackageCard from './components/PackageCard';
import { getTravelPackages, searchTravelPackages } from '../../services/TravelPackageService';
import { type TravelPackageListItem } from '../../Entities/TravelPackage';

const Packages = () => {
  const [travelPackages, setTravelPackages] = useState<TravelPackageListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const loadPackages = async () => {
      try {
        setIsLoading(true);
        
        // KISS: verificar se há parâmetros de busca na URL
        const searchParams = new URLSearchParams(location.search);
        const hasSearchParams = searchParams.size > 0;
        
        let packages: TravelPackageListItem[];
        
        if (hasSearchParams) {
          // Fazer busca com parâmetros
          const searchData = {
            destination: searchParams.get('destination') || undefined,
            minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
            maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
            duration: searchParams.get('duration') ? parseInt(searchParams.get('duration')!) : undefined,
          };
          
          console.log('Searching with params:', searchData);
          packages = await searchTravelPackages(searchData);
        } else {
          // Carregar todos os pacotes
          packages = await getTravelPackages();
        }
        
        setTravelPackages(packages);
      } catch (err) {
        setError('Não foi possível carregar os pacotes.');
      } finally {
        setIsLoading(false);
      }
    };
    loadPackages();
  }, [location.search]); // Recarregar quando os parâmetros de busca mudarem

  // KISS: verificar se é uma busca para mostrar título diferente
  const searchParams = new URLSearchParams(location.search);
  const isSearchResults = searchParams.size > 0;
  const destinationSearch = searchParams.get('destination');

  return (
    <main className="home-main">
      <Container className="mt-5 home-packages-section">
        <Row className="mb-4">
          <Col>
            <h2 className="ages-title">
              {isSearchResults 
                ? `Resultados${destinationSearch ? ` para "${destinationSearch}"` : ' da busca'}`
                : 'Pacotes'
              }
            </h2>
            {isSearchResults && (
              <p className="text-muted">
                Encontrados {travelPackages.length} pacote{travelPackages.length !== 1 ? 's' : ''}
              </p>
            )}
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
              {travelPackages.map((travelPackage: any) => (
                <Col key={travelPackage.id || travelPackage.Id} xs={12} sm={6} md={4} className="home-package-col mb-4">
                  <PackageCard
                    travelPackage={travelPackage}
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
