
import { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Spinner, Form, InputGroup, Button } from 'react-bootstrap';
import PackageCard from './components/PackageCard';
import { getTravelPackages, searchTravelPackages } from '../../services/TravelPackageService';
import { type TravelPackageListItem } from '../../Entities/TravelPackage';
import { usePageTitle, PAGE_TITLES } from '../../hooks';
import { normalizeText } from '../../utils/textUtils';
import './Packages.css';

const Packages = () => {
  // Define o título da página
  usePageTitle(PAGE_TITLES.PACKAGES);
  
  const [travelPackages, setTravelPackages] = useState<TravelPackageListItem[]>([]);
  const [allPackages, setAllPackages] = useState<TravelPackageListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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
        
        setAllPackages(packages);
        setTravelPackages(packages);
      } catch (err) {
        setError('Não foi possível carregar os pacotes.');
      } finally {
        setIsLoading(false);
      }
    };
    loadPackages();
  }, [location.search]); // Recarregar quando os parâmetros de busca mudarem

  // Filtrar pacotes com base no termo de pesquisa
  const filteredPackages = useMemo(() => {
    if (!searchTerm.trim()) {
      return allPackages;
    }

    const searchNormalized = normalizeText(searchTerm);
    return allPackages.filter(pkg => {
      // Buscar no nome do pacote
      const packageName = normalizeText(pkg.Name || '');
      
      // Buscar na descrição
      const description = normalizeText(pkg.Description || '');
      
      // Buscar no destino
      const destinationName = normalizeText(pkg.MainDestination?.Name || '');
      const destinationCountry = normalizeText(pkg.MainDestination?.Country || '');
      
      // Buscar na empresa
      const companyName = normalizeText(pkg.Company?.Name || '');

      return packageName.includes(searchNormalized) ||
             description.includes(searchNormalized) ||
             destinationName.includes(searchNormalized) ||
             destinationCountry.includes(searchNormalized) ||
             companyName.includes(searchNormalized);
    });
  }, [allPackages, searchTerm]);

  // Atualizar travelPackages quando filteredPackages mudar
  useEffect(() => {
    setTravelPackages(filteredPackages);
  }, [filteredPackages]);

  // Função para limpar a pesquisa
  const clearSearch = () => {
    setSearchTerm('');
  };

  // KISS: verificar se é uma busca para mostrar título diferente
  const searchParams = new URLSearchParams(location.search);
  const isSearchResults = searchParams.size > 0;
  const destinationSearch = searchParams.get('destination');

  return (
    <main className="home-main">
      <Container className="mt-5 home-packages-section">
        {/* Barra de Pesquisa */}
        <Row className="mb-4">
          <Col>
            <div className="search-container">
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Pesquisar pacotes por nome, destino, empresa... (ignora acentos)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <Button 
                    variant="outline-secondary" 
                    onClick={clearSearch}
                    className="clear-button"
                    title="Limpar pesquisa"
                  >
                    ✕
                  </Button>
                )}
                <InputGroup.Text className="search-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </InputGroup.Text>
              </InputGroup>
            </div>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <h2 className="ages-title">
              {isSearchResults 
                ? `Resultados${destinationSearch ? ` para "${destinationSearch}"` : ' da busca'}`
                : searchTerm 
                  ? `Resultados para "${searchTerm}"` 
                  : 'Pacotes'
              }
            </h2>
            {(isSearchResults || searchTerm) && (
              <p className="text-muted">
                Encontrados {travelPackages.length} pacote{travelPackages.length !== 1 ? 's' : ''}
              </p>
            )}
          </Col>
        </Row>
        <Row>
          {isLoading ? (
            <Col className="text-center loading-container">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Carregando...</span>
              </Spinner>
              <p className="mt-2">Carregando pacotes...</p>
            </Col>
          ) : error ? (
            <Col className="text-center error-container">
              <p>{error}</p>
            </Col>
          ) : travelPackages.length === 0 ? (
            <Col className="no-results-container">
              {searchTerm ? (
                <div>
                  <h4>Nenhum pacote encontrado</h4>
                  <p className="text-muted">
                    Não encontramos pacotes que correspondam à sua pesquisa "{searchTerm}".
                  </p>
                  <p className="text-muted">
                    Tente usar termos diferentes ou verificar a ortografia.
                  </p>
                  <Button variant="outline-primary" onClick={clearSearch} className="mt-2">
                    Ver todos os pacotes
                  </Button>
                </div>
              ) : (
                <p className="text-center text-muted">Nenhum pacote disponível no momento.</p>
              )}
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
