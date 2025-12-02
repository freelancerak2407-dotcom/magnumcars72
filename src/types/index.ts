export type FuelType = 'Petrol' | 'Diesel' | 'Electric';
export type GearType = 'Manual' | 'Automatic';
export type CarType = '4 Seater' | '6/7 Seater';

export interface Car {
  id: string;
  name: string;
  type: CarType;
  year: number;
  gear: GearType;
  fuel: FuelType;
  price24h: number;
  price12h: number;
  mileage: string;
  image: string;
  cityId: string;
  registrationNumber?: string; // Admin only
  isAvailable: boolean;
  // Owner Details
  ownerName?: string;
  ownerPhone?: string;
  ownerSharePercentage?: number;
}

export interface Booking {
  id: string;
  carId: string;
  cityId: string;
  customerName: string;
  phone: string;
  email: string;
  occupation: string;
  address: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  totalAmount: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed' | 'Maintenance';
  idProofUrl?: string;
  livePhotoUrl?: string;
  signatureUrl?: string;
  createdAt: string;
  startKm?: number;
  endKm?: number;
  discount?: number;
  adminNotes?: string;
  // Joined fields
  carName?: string;
  carReg?: string;
}

export interface City {
  id: string;
  name: string;
  active: boolean;
}

export interface RevenueStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalBookings: number;
  pendingBookings: number;
}
