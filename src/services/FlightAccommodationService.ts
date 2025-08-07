import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7102' || 'http://localhost:5079/api',
});

// Interfaces baseadas nos DTOs do backend
export interface FlightResponse {
  Id: number;
  Airline: {
    Id: number;
    Name: string;
    Code: string;
  };
  OriginDestination: {
    Id: number;
    Name: string;
    Country: string;
  };
  FinalDestination: {
    Id: number;
    Name: string;
    Country: string;
  };
  FlightNumber: string;
  DepartureDateTime: string;
  ArrivalDateTime: string;
  CabinClass: string;
  SeatClass: string;
  Price: number;
  AvailableSeats: number;
}

export interface AccommodationResponse {
  Id: number;
  Name: string;
  Description: string;
  StreetName: string;
  Phone: string;
  Email: string;
  CheckInTime: string;
  CheckOutTime: string;
  StarRating: number;
  PricePerNight: number;
  District: string;
  AddressNumber: string;
  GeoCoordinates: string;
  Destination: {
    Id: number;
    Name: string;
    Country: string;
  };
  RoomType: {
    Id: number;
    Name: string;
    Capacity: number;
    PriceAdjustment: number;
  };
}

/**
 * Busca todos os voos disponíveis
 */
export const getAllFlights = async (): Promise<FlightResponse[]> => {
  try {
    console.log('✈️ Buscando voos disponíveis...');
    const response = await api.get('/Flight');
    
    let flightsData = response.data;
    
    // Se há $values, é um array serializado
    if (flightsData && flightsData.$values) {
      flightsData = flightsData.$values;
    }
    
    // Se não é array, tornar array
    if (!Array.isArray(flightsData)) {
      flightsData = [flightsData];
    }
    
    console.log(`✅ ${flightsData.length} voos encontrados`);
    return flightsData;
  } catch (error) {
    console.error('❌ Erro ao buscar voos:', error);
    return [];
  }
};

/**
 * Busca todas as acomodações disponíveis
 */
export const getAllAccommodations = async (): Promise<AccommodationResponse[]> => {
  try {
    console.log('🏨 Buscando acomodações disponíveis...');
    const response = await api.get('/Accommodation');
    
    let accommodationsData = response.data;
    
    // Se há $values, é um array serializado
    if (accommodationsData && accommodationsData.$values) {
      accommodationsData = accommodationsData.$values;
    }
    
    // Se não é array, tornar array
    if (!Array.isArray(accommodationsData)) {
      accommodationsData = [accommodationsData];
    }
    
    console.log(`✅ ${accommodationsData.length} acomodações encontradas`);
    return accommodationsData;
  } catch (error) {
    console.error('❌ Erro ao buscar acomodações:', error);
    return [];
  }
};

/**
 * Busca voo por ID
 */
export const getFlightById = async (id: number): Promise<FlightResponse | null> => {
  try {
    console.log(`✈️ Buscando voo ${id}...`);
    const response = await api.get(`/Flight/${id}`);
    
    console.log(`✅ Voo ${id} encontrado`);
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao buscar voo ${id}:`, error);
    return null;
  }
};

/**
 * Busca acomodação por ID
 */
export const getAccommodationById = async (id: number): Promise<AccommodationResponse | null> => {
  try {
    console.log(`🏨 Buscando acomodação ${id}...`);
    const response = await api.get(`/Accommodation/${id}`);
    
    console.log(`✅ Acomodação ${id} encontrada`);
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao buscar acomodação ${id}:`, error);
    return null;
  }
};
