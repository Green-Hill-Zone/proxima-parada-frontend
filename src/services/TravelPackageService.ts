import axios from 'axios';
import type {
  TravelPackageCreateRequest,
  TravelPackageDetailResponse,
  TravelPackageListItem,
  TravelPackageListParams,
  TravelPackageListResponse
} from '../Entities/TravelPackage';

const api = axios.create({
  baseURL: 'http://localhost:3001', // ou o endereço onde está rodando o json-server
});

/**
 * Cria um novo pacote de viagem
 * @param packageData Dados do pacote a ser criado
 * @returns Promise com o pacote criado
 */
export const createTravelPackage = async (
  packageData: TravelPackageCreateRequest
): Promise<TravelPackageDetailResponse> => {
  const response = await api.post('/TravelPackages', packageData);
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
    const response = await api.get('/TravelPackages', { params });
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
    const response = await api.get('/TravelPackages', {
      params: { featured: true, _limit: limit }
    });
    return response.data;
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
  try {
    const response = await api.get(`/TravelPackages/${id}`);
    return response.data;
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
    const response = await api.put(`/TravelPackages/${id}`, packageData);
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
    await api.delete(`/TravelPackages/${id}`);
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
    // Para JSON Server, assume-se que há uma propriedade Destinations 
    // que podemos filtrar usando query params
    const response = await api.get('/TravelPackages', {
      params: { 'Destinations.Name_like': destinationName }
    });
    return response.data;
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
    const response = await api.get('/TravelPackages', {
      params: { BasePrice_gte: minPrice, BasePrice_lte: maxPrice }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching packages by price range:`, error);
    return [];
  }
};