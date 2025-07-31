/**
 * Interfaces para Pacotes de Viagem
 */

// Entidades básicas
export interface Company {
  Id: number;
  Name: string;
  Phone?: string;
  Email?: string;
}

export interface Destination {
  Id: number;
  Name: string;
  Country: string;
  Description?: string;
}

export interface Accommodation {
  Id: number;
  Name: string;
  Category: string;
  Address?: string;
  Amenities?: string[];
}

export interface Airline {
  Id: number;
  Name: string;
  Code: string;
}

export interface AvailableDate {
  Id: number;
  DepartureDate: string; // ISO date string
  ReturnDate: string; // ISO date string
  AvailableSpots: number;
  Price: number;
}

export interface Image {
  Id: number;
  ImageUrl: string;
  AltText: string;
  IsMain: boolean;
}

export interface RoomType {
  Id: number;
  Name: string;
  Capacity: number;
  PriceAdjustment: number;
}

export interface PaymentOption {
  Id: number;
  Name: string;
  Installments: number;
  InterestRate: number;
}

export interface Pagination {
  CurrentPage: number;
  TotalPages: number;
  TotalItems: number;
  PageSize: number;
}

// Request para criação de pacote
export interface TravelPackageCreateRequest {
  Name: string;
  Description: string;
  BasePrice: number;
  Duration: number;
  MaxCapacity: number;
  CategoryId: number;
  CompanyId: number;
  DestinationIds: number[];
  AccommodationIds: number[];
  AirlineIds: number[];
}

// Response de um pacote resumido (listagem)
export interface TravelPackageListItem {
  Id: number;
  Name: string;
  Description: string;
  BasePrice: number;
  Duration: number;
  MaxCapacity: number;
  IsActive: boolean;
  Company: Company;
  MainDestination: Destination;
  Images: Image[];
}

// Response da listagem paginada
export interface TravelPackageListResponse {
  Data: TravelPackageListItem[];
  Pagination: Pagination;
}

// Response completa de um pacote detalhado
export interface TravelPackageDetailResponse {
  Id: number;
  Name: string;
  Description: string;
  BasePrice: number;
  Duration: number;
  MaxCapacity: number;
  IsActive: boolean;
  CreatedAt: string; // ISO date string
  Company: Company;
  Destinations: Destination[];
  Accommodations: Accommodation[];
  Airlines: Airline[];
  AvailableDates: AvailableDate[];
  Images: Image[];
  RoomTypes: RoomType[];
  PaymentOptions: PaymentOption[];
}

// Parâmetros de query para listar pacotes
export interface TravelPackageListParams {
  page?: number;
  pageSize?: number;
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  duration?: number;
}