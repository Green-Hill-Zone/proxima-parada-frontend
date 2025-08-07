import axios from 'axios';
import type {
  TravelPackageCreateRequest,
  TravelPackageDetailResponse,
  TravelPackageListItem,
  TravelPackageListParams
} from '../Entities/TravelPackage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7102' || 'http://localhost:5079/api', // Backend .NET API
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
    const response = await api.get('/api/TravelPackage');
    
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
    const response = await api.get(`/api/TravelPackage/${id}`);
    
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

// Interface para criação direta via backend (TravelPackageDto)
interface TravelPackageBackendRequest {
  Title: string;
  Description?: string | null;
  Price: number;
  DepartureDate?: string | null;
  ReturnDate?: string | null;
  DestinationId?: number | null;
  CompanyId: number;
}

export const createTravelPackage = async (data: TravelPackageCreateRequest): Promise<TravelPackageDetailResponse | null> => {
  try {
    console.log('➕ Criando novo pacote de viagem...');
    const response = await api.post('/api/TravelPackage', data);
    
    console.log('✅ Pacote criado com sucesso');
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao criar pacote:', error);
    throw error;
  }
};

// Nova função que aceita dados no formato do backend
export const createTravelPackageBackend = async (packageData: TravelPackageBackendRequest) => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7102';
    
    console.log("📤 Enviando dados para API:", packageData);
    console.log("🔗 Endpoint:", `${API_BASE_URL}/api/TravelPackage`);
    
    const response = await axios.post(`${API_BASE_URL}/api/TravelPackage`, packageData);
    
    console.log("✅ Resposta da API:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erro no serviço createTravelPackageBackend:", error);
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Resposta do servidor:", error.response.data);
        console.error("Status:", error.response.status);
      }
    }
    
    throw error;
  }
};

// Função para adicionar voos ao pacote
export const addFlightsToPackage = async (packageId: number, flightIds: number[]): Promise<any> => {
  try {
    console.log(`✈️ Adicionando voos ao pacote ${packageId}...`, flightIds);
    
    // Garantir que packageId é um número
    const numericPackageId = Number(packageId);
    if (isNaN(numericPackageId)) {
      console.error("❌ ID do pacote inválido:", packageId);
      throw new Error("ID do pacote deve ser um número válido");
    }
    
    console.log(`📤 Enviando voos para o pacote ID ${numericPackageId}:`, flightIds);
    
    const response = await api.post(`/api/TravelPackage/${numericPackageId}/flights`, flightIds);
    
    console.log('✅ Voos adicionados com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao adicionar voos:', error);
    throw error;
  }
};

// Interface para requisição de upload de imagem
interface ImageUploadRequest {
  file: File;
  altText: string;
  travelPackageId: number;
}


export const uploadTravelPackageImage = async (imageData: ImageUploadRequest): Promise<any> => {
  try {
    console.log("🖼️ Enviando imagem para o pacote...", imageData.travelPackageId);
    
    // Validações da imagem
    if (!imageData.file.type.startsWith('image/')) {
      throw new Error("O arquivo deve ser uma imagem válida");
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (imageData.file.size > MAX_SIZE) {
      throw new Error("A imagem não deve exceder 5MB");
    }

    // Preparar FormData
    const formData = new FormData();
    formData.append("File", imageData.file);
    formData.append("AltText", imageData.altText);
    
    // Garantir que o ID seja um número válido antes de converter para string
    // Usamos o Number.isInteger para garantir que é um número inteiro válido
    if (!Number.isInteger(imageData.travelPackageId)) {
      console.error("ID do pacote inválido:", imageData.travelPackageId);
      throw new Error("ID do pacote inválido. Deve ser um número inteiro.");
    }

    const packageIdString: string = imageData.travelPackageId.toString();
    formData.append("TravelPackageId", packageIdString);

    // Log dos dados sendo enviados
    console.log("📤 Enviando dados da imagem:", {
      fileName: imageData.file.name,
      fileType: imageData.file.type,
      fileSize: imageData.file.size,
      altText: imageData.altText,
      packageId: packageIdString
    });

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7102';
    
    // Certificar que a URL está corretamente formatada
    let imageEndpoint = `${API_BASE_URL}/api/image`;

    // Verificação adicional para evitar duplicação de /api
    if (imageEndpoint.includes('/api/api')) {
      imageEndpoint = imageEndpoint.replace('/api/api', '/api');
    }

    console.log("🔗 Endpoint de upload:", imageEndpoint);

    // Adicionar um log para verificar o conteúdo exato do FormData
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    const response = await axios.post(imageEndpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    console.log("✅ Imagem enviada com sucesso", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao enviar imagem do pacote:", error);
    
    if (error instanceof Error) {
      console.error("Detalhes do erro:", error.message);
    }
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Resposta do servidor:", error.response.data);
        console.error("Status:", error.response.status);
      }
    }
    
    throw error;
  }
};