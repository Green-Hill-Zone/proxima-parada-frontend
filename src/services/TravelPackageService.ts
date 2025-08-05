import axios from 'axios';
import type {
  TravelPackageCreateRequest,
  TravelPackageDetailResponse,
  TravelPackageListItem,
  TravelPackageListParams
} from '../Entities/TravelPackage';

const api = axios.create({
  baseURL: 'https://localhost:7102/api', // Backend .NET API
});

// Adapter para mapear dados do backend para o frontend
const mapBackendToFrontend = (backendData: any): TravelPackageListItem => {
  // Manter a estrutura original das imagens do backend
  const images = backendData.images || backendData.Images || [];

  // Garantir que Destination seja um objeto válido
  let destination = backendData.destination || backendData.Destination;
  if (!destination) {
    destination = {
      Id: 0,
      Name: 'Destino não informado',
      Country: 'País não informado'
    };
  } else {
    // Mapear propriedades do destino para garantir consistência
    destination = {
      Id: destination.id || destination.Id || 0,
      Name: destination.name || destination.Name || 'Destino não informado',
      Country: destination.country || destination.Country || 'País não informado'
    };
  }

  // Garantir que Company seja um objeto válido
  let company = backendData.company || backendData.Company;
  if (!company) {
    company = {
      Id: 0,
      Name: 'Empresa não informada'
    };
  }

  // Retornar os dados originais do backend sem muita transformação
  return {
    ...backendData, // Manter todas as propriedades originais do backend
    Id: backendData.id || backendData.Id,
    Name: backendData.title || backendData.Title || 'Pacote sem nome',
    Description: backendData.description || backendData.Description || 'Sem descrição',
    BasePrice: backendData.price || backendData.Price || 0,
    Duration: 5, // Valor padrão simplificado
    MaxCapacity: 50, // Valor padrão por enquanto
    IsActive: true, // Valor padrão por enquanto
    Images: images, // Manter estrutura original
    MainDestination: destination,
    Company: company
  };
};

export const getTravelPackages = async (): Promise<TravelPackageListItem[]> => {
  try {
    console.log('🏝️ Buscando pacotes de viagem...');
    const response = await api.get('/TravelPackage');
    
    let travelPackagesData = response.data;
    
    // Se há $values, é um array serializado
    if (travelPackagesData && travelPackagesData.$values) {
      travelPackagesData = travelPackagesData.$values;
    }
    
    // Se não é array, tornar array
    if (!Array.isArray(travelPackagesData)) {
      travelPackagesData = [travelPackagesData];
    }
    
    const mappedPackages = travelPackagesData.map(mapBackendToFrontend);
    console.log(`✅ ${mappedPackages.length} pacotes encontrados`);
    
    return mappedPackages;
  } catch (error) {
    console.error('❌ Erro ao buscar pacotes:', error);
    return [];
  }
};

export const searchTravelPackages = async (params: TravelPackageListParams): Promise<TravelPackageListItem[]> => {
  try {
    console.log('🔍 Buscando pacotes com filtros:', params);
    
    // Por enquanto busca todos e filtra no frontend (YAGNI)
    const allPackages = await getTravelPackages();
    
    let filteredPackages = allPackages;
    
    // Filtro por destino
    if (params.destination) {
      const searchTerm = params.destination.toLowerCase();
      filteredPackages = filteredPackages.filter(pkg => {
        // Verificar se MainDestination existe
        if (!pkg.MainDestination) {
          console.warn('⚠️ Pacote sem MainDestination:', pkg);
          return false;
        }
        
        const destinationName = pkg.MainDestination.Name || '';
        const destinationCountry = pkg.MainDestination.Country || '';
        
        return destinationName.toLowerCase().includes(searchTerm) ||
               destinationCountry.toLowerCase().includes(searchTerm);
      });
    }
    
    // Filtro por preço
    if (params.maxPrice) {
      filteredPackages = filteredPackages.filter(pkg => pkg.BasePrice <= params.maxPrice!);
    }
    
    if (params.minPrice) {
      filteredPackages = filteredPackages.filter(pkg => pkg.BasePrice >= params.minPrice!);
    }
    
    console.log(`✅ ${filteredPackages.length} pacotes encontrados após filtros`);
    return filteredPackages;
  } catch (error) {
    console.error('❌ Erro na busca com filtros:', error);
    return [];
  }
};

export const getFeaturedPackages = async (): Promise<TravelPackageListItem[]> => {
  try {
    console.log('⭐ Buscando pacotes em destaque...');
    const allPackages = await getTravelPackages();
    
    // Por enquanto retorna os primeiros 6 (YAGNI)
    const featuredPackages = allPackages.slice(0, 6);
    
    console.log(`✅ ${featuredPackages.length} pacotes em destaque`);
    return featuredPackages;
  } catch (error) {
    console.error('❌ Erro ao buscar pacotes em destaque:', error);
    return [];
  }
};

export const getTravelPackageById = async (id: number): Promise<TravelPackageDetailResponse | null> => {
  try {
    console.log(`🏝️ Buscando pacote ${id}...`);
    const response = await api.get(`/TravelPackage/${id}`);
    
    if (response.data) {
      // Mapear dados detalhados (pode expandir depois conforme necessário)
      const packageData = response.data;
      
      console.log(`✅ Pacote ${id} encontrado:`, packageData.title || packageData.Title);
      return packageData;
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Erro ao buscar pacote ${id}:`, error);
    return null;
  }
};

export const createTravelPackage = async (data: TravelPackageCreateRequest): Promise<TravelPackageDetailResponse | null> => {
  try {
    console.log('➕ Criando novo pacote de viagem...');
    const response = await api.post('/TravelPackage', data);
    
    console.log('✅ Pacote criado com sucesso');
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao criar pacote:', error);
    throw error;
  }
};
