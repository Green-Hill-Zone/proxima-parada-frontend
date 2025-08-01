import axios from 'axios';
import type { CollectionWrapper } from '../Entities/CollectionWrapper';
import type {
  TravelPackageCreateRequest,
  TravelPackageDetailResponse,
  TravelPackageListItem,
  TravelPackageListParams,
  TravelPackageListResponse
} from '../Entities/TravelPackage';

const api = axios.create({
  baseURL: 'https://localhost:7102/api',
});

/**
 * Função utilitária para extrair valores de uma CollectionWrapper
 * @param wrapper Objeto CollectionWrapper ou qualquer outro objeto
 * @returns Array com os valores ou o objeto original se não for uma CollectionWrapper
 */
function unwrapCollection<T>(wrapper: CollectionWrapper<T> | any): T[] | any {
  if (wrapper && wrapper.$values !== undefined) {
    return wrapper.$values;
  }
  return wrapper;
}

/**
 * Cria um novo pacote de viagem
 * @param packageData Dados do pacote a ser criado
 * @returns Promise com o pacote criado
 */
export const createTravelPackage = async (
  packageData: TravelPackageCreateRequest
): Promise<TravelPackageDetailResponse> => {
  const response = await api.post('/TravelPackage', packageData);
  return response.data;
};

/**
 * Obtém lista de pacotes de viagem com opção de filtros
 * @param params Parâmetros de filtro e paginação
 * @returns Promise com lista de pacotes
 */
export const getTravelPackages = async (
  params?: TravelPackageListParams
): Promise<TravelPackageListResponse> => {
  try {
    const response = await api.get('/TravelPackage', { params });
    const packages = unwrapCollection(response.data);
    
    // Se a resposta era um CollectionWrapper, formata como TravelPackageListResponse
    if (Array.isArray(packages) && packages !== response.data) {
      return {
        Data: packages,
        Pagination: {
          CurrentPage: params?.page || 1,
          TotalPages: 1,
          TotalItems: packages.length,
          PageSize: params?.pageSize || 10
        }
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching travel packages:', error);
    return { Data: [], Pagination: { CurrentPage: 1, TotalPages: 0, TotalItems: 0, PageSize: 10 } };
  }
};

/**
 * Obtém pacotes de viagem em destaque
 * @param limit Número máximo de pacotes a retornar
 * @returns Promise com lista de pacotes destacados
 */
export const getFeaturedPackages = async (limit: number = 6): Promise<TravelPackageListItem[]> => {
  try {
    const response = await getTravelPackages({ page: 1, pageSize: limit });
    return response.Data || [];
  } catch (error) {
    console.error('Error fetching featured packages:', error);
    return [];
  }
};

/**
 * Obtém um pacote de viagem específico pelo ID
 * @param id ID do pacote de viagem
 * @returns Promise com os detalhes do pacote ou null se não encontrado
 */
export const getTravelPackageById = async (
  id: number
): Promise<TravelPackageDetailResponse | null> => {
  console.log(`Fetching travel package with ID: ${id} na rota ${api.getUri()}/TravelPackage/${id}`);
  try {
    const response = await api.get(`/TravelPackage/${id}`);
    
    if (response.data) {
      const packageData = { ...response.data };
      
      // Transforma todos os campos que são CollectionWrapper usando a função unwrapCollection
      if (packageData.images) {
        packageData.Images = unwrapCollection(packageData.images);
      }
      
      if (packageData.flights) {
        packageData.Flights = unwrapCollection(packageData.flights);
      }
      
      if (packageData.availableDates) {
        packageData.AvailableDates = unwrapCollection(packageData.availableDates);
      }
      
      if (packageData.paymentOptions) {
        packageData.PaymentOptions = unwrapCollection(packageData.paymentOptions);
      }
      
      if (packageData.accommodations) {
        packageData.Accommodations = unwrapCollection(packageData.accommodations);
      }

      // Ajusta os nomes de campos para o padrão usado no frontend
      if (packageData.title) packageData.Title = packageData.title;
      if (packageData.description) packageData.Description = packageData.description;
      if (packageData.price) packageData.Price = packageData.price;
      if (packageData.destination) packageData.Destination = packageData.destination;
      if (packageData.company) packageData.Company = packageData.company;
      if (packageData.createdAt) packageData.CreatedAt = packageData.createdAt;
      if (packageData.updatedAt) packageData.UpdatedAt = packageData.updatedAt;
      
      return packageData;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching travel package with ID ${id}:`, error);
    return null;
  }
};

/**
 * Atualiza um pacote de viagem existente
 * @param id ID do pacote de viagem
 * @param packageData Dados do pacote a serem atualizados
 * @returns Promise com o pacote atualizado ou null em caso de erro
 */
export const updateTravelPackage = async (
  id: number,
  packageData: Partial<TravelPackageCreateRequest>
): Promise<TravelPackageDetailResponse | null> => {
  try {
    const response = await api.put(`/TravelPackage/${id}`, packageData);
    return response.data;
  } catch (error) {
    console.error(`Error updating travel package with ID ${id}:`, error);
    return null;
  }
};

/**
 * Exclui um pacote de viagem
 * @param id ID do pacote de viagem
 * @returns Promise void
 */
export const deleteTravelPackage = async (id: number): Promise<void> => {
  try {
    await api.delete(`/TravelPackage/${id}`);
  } catch (error) {
    console.error(`Error deleting travel package with ID ${id}:`, error);
  }
};

/**
 * Busca pacotes de viagem por destino
 * @param destinationName Nome do destino
 * @returns Promise com lista de pacotes correspondentes
 */
export const getTravelPackagesByDestination = async (
  destinationName: string
): Promise<TravelPackageListItem[]> => {
  try {
    const response = await api.get('/TravelPackage/by-destination', {
      params: { destination: destinationName }
    });
    return unwrapCollection(response.data) || [];
  } catch (error) {
    console.error(`Error fetching packages for destination ${destinationName}:`, error);
    return [];
  }
};

/**
 * Busca pacotes de viagem por faixa de preço
 * @param minPrice Preço mínimo
 * @param maxPrice Preço máximo
 * @returns Promise com lista de pacotes correspondentes
 */
export const getTravelPackagesByPriceRange = async (
  minPrice: number,
  maxPrice: number
): Promise<TravelPackageListItem[]> => {
  try {
    const response = await api.get('/TravelPackage/by-price', {
      params: { minPrice, maxPrice }
    });
    return unwrapCollection(response.data) || [];
  } catch (error) {
    console.error(`Error fetching packages by price range:`, error);
    return [];
  }
};