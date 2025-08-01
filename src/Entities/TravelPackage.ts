/**
 * Interfaces para Pacotes de Viagem
 */

import type { Accommodation } from "./Accommodation";
import type { Destination } from "./Destination";
import type { Flight } from "./Flight";
import type { Image } from "./Image";

// Entidades básicas
export interface Company {
  Id: number;
  Name: string;
  Phone?: string;
  Email?: string;
}

export interface AvailableDate {
  Id: number;
  DepartureDate: string; // ISO date string
  ReturnDate: string; // ISO date string
  AvailableSpots: number;
  Price: number;
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
  Title: string;
  Description: string;
  Price: number;
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
  $id: string;
  Id: number;
  Title: string;
  Description: string;
  Price: number;
  Duration: number;
  IsActive: boolean;
  Destination: Destination;
  Company: Company;
  Images: Image[];
}

// Response da listagem paginada
export interface TravelPackageListResponse {
  Data: TravelPackageListItem[];
  Pagination: Pagination;
}

// Response completa de um pacote detalhado
export interface TravelPackageDetailResponse {
  $id: string;
  Id: number;
  Title: string;
  Description: string;
  Price: number;
  Duration: number;
  Destination: Destination;
  Company: Company;
  Accommodations: Accommodation[];
  Flights: Flight[];
  AvailableDates: AvailableDate[];
  Images: Image[];
  PaymentOptions: PaymentOption[];
  CreatedAt: string; // ISO date string
  UpdatedAt: string | null;
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

export interface GetAllTravelPackagesResponse {
  $id: string;
  $values: TravelPackageListItem[];
}