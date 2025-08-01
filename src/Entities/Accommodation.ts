/*
public int Id { get; set; }
public DestinationResponseDto? Destination { get; set; }
public string? Name { get; set; }
public string? Description { get; set; }
public string? StreetName { get; set; }
public string? Phone { get; set; }
public string? Email { get; set; }
public TimeSpan? CheckInTime { get; set; }
public TimeSpan? CheckOutTime { get; set; }
public int? StarRating { get; set; }
public decimal? PricePerNight { get; set; }
public string? District { get; set; }
public string? AddressNumber { get; set; }
public string? GeoCoordinates { get; set; }
public int RoomTypesCount { get; set; }
public DateTime CreatedAt { get; set; }
public DateTime? UpdatedAt { get; set; } 
 */
import type { Destination } from "./Destination";
import type { Image } from "./Image";


export interface Accommodation {
  $id: string;
  Id: number;
  Destination: Destination;
  Name: string;
  Description?: string;
  StreetName: string;
  Phone?: string;
  Email?: string;
  CheckInTime?: string; // ISO time string
  CheckOutTime?: string; // ISO time string
  StarRating?: number;
  PricePerNight?: number;
  Price: number;
  District?: string;
  AddressNumber?: string;
  GeoCoordinates?: string; // e.g., "latitude,longitude"
  RoomTypesCount: number;
  Category: string;
  Address: string;
  City: string;
  Country: string;
  Amenities: string[];
  IsActive: boolean;
  Images?: Image[];
}

