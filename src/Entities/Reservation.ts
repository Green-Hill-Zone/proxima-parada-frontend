import type { Accommodation } from "./Accommodation";
import type { TravelPackageDetailResponse } from "./TravelPackage";
import type { User } from "./User";

/*
{
  "$id": "1",
  "id": 1,
  "customerId": 1,
  "customerName": "João Silva",
  "travelPackageId": 1,
  "travelPackageName": "Paris Romântico",
  "availableDateId": null,
  "departureDate": null,
  "returnDate": null,
  "outboundFlightId": null,
  "returnFlightId": null,
  "roomTypeId": null,
  "roomTypeName": null,
  "reservationNumber": "RES-2024-001",
  "status": "confirmed",
  "includesInsurance": true,
  "insurancePrice": 150,
  "termsAcceptedAt": null,
  "travelersCount": 0,
  "paymentsCount": 1,
  "createdAt": "2025-07-19T06:01:37.8006115",
  "updatedAt": null
}
*/

export interface Travelers {
  Id: number;
  Name: string;
  email: string;
  DocumentNumber: string; // CPF or RG
  DocumentType: "CPF" | "RG";
}

export interface Payment {
  Id: number;
  Amount: number;
  Status: "pending" | "completed" | "failed";
  Method: "credit_card" | "bank_transfer" | "boleto";
  CreatedAt: string; // ISO date string
  UpdatedAt?: string | null;
}

export interface Reservation {
  $id: string;
  Id: number;
  Customer: User;
  TravelPackage: TravelPackageDetailResponse;
  Accommodation: Accommodation | null;
  Status: "pending" | "confirmed" | "canceled";
  IncludesInsurance: boolean;
  InsurancePrice: number;
  TermsAcceptedAt?: string | null;
  Travelers: Travelers[];
  Payment: Payment;
  CreatedAt: string;
  UpdatedAt?: string | null;
}
