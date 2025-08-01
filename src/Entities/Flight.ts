import type { Destination } from "./Destination";

export interface Airline {
  Id: number;
  Name: string;
  Code: string;
}

/*
public int Id { get; set; }
public AirlineDto Airline { get; set; }
public DestinationDto OriginDestination { get; set; } = new();
public DestinationDto Destination { get; set; } = new();
public string? FlightNumber { get; set; }
public DateTime? DepartureDateTime { get; set; }
public DateTime? ArrivalDateTime { get; set; }
public TimeSpan? FlightDuration => (ArrivalDateTime.HasValue && DepartureDateTime.HasValue) ? ArrivalDateTime - DepartureDateTime : null;
public string? CabinClass { get; set; }
public string? SeatClass { get; set; }
public decimal? Price { get; set; }
public int? AvailableSeats { get; set; }
public DateTime CreatedAt { get; set; }
public DateTime? UpdatedAt { get; set; }
*/
export interface Flight{
  Id: number,
  Name: string,
  Price: number,
  FlightType: string,
  Airline: Airline,
  DepartureDateTime: string, // ISO date string
  ArrivalDateTime: string, // ISO date string
  FlightDuration?: string, // Duration in HH:mm:ss format
  CabinClass?: string,
  SeatClass?: string,
  AvailableSeats?: number,
  OriginDestination: Destination,
  Destination: Destination,
  CreatedAt: string, // ISO date string
  UpdatedAt?: string, // ISO date string
  FlightNumber?: string,
}

export interface Flights{
  OutboundFlight: Flight;
  ReturnFlight: Flight;
}