export interface User {
  id: number;
  username: string;
  email: string;
  balance: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface Service {
  id: number;
  name: string;
  category: string;
  ratePer1000: number;
  min: number;
  max: number;
  description?: string;
}

export interface Order {
  id: number;
  userId: number;
  serviceId: number;
  serviceName: string;
  link: string;
  quantity: number;
  charge: number;
  status: 'Pending' | 'In progress' | 'Completed' | 'Canceled' | 'Failed';
  createdAt: string;
}

export interface CreateOrderRequest {
  serviceId: number;
  link: string;
  quantity: number;
}

export interface BalanceResponse {
  balance: number;
}

export interface AddFundsRequest {
  amount: number;
  provider?: string;
  providerReference?: string;
}

export interface Payment {
  id: number;
  userId: number;
  amount: number;
  provider: string;
  providerReference?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Refunded';
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentRequest {
  amount: number;
  provider: string;
  providerReference?: string;
}

export interface Booking {
  id: number;
  userId: number;
  serviceType: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  serviceType: 'HVAC Installation' | 'HVAC Repair' | 'Electrical Installation' | 'Electrical Repair' | 'Maintenance' | 'Inspection';
  address: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
}

export interface Quote {
  id: number;
  userId: number;
  serviceType: string;
  propertyType: string;
  squareFootage: number;
  equipmentBrand?: string;
  efficiencyRating?: string;
  estimatedCost: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired';
  details?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuoteRequest {
  serviceType: 'HVAC Installation' | 'HVAC Repair' | 'Electrical Installation' | 'Electrical Repair';
  propertyType: 'Residential' | 'Commercial' | 'Industrial';
  squareFootage: number;
  equipmentBrand?: string;
  efficiencyRating?: 'Standard' | 'High' | 'Premium';
  details?: Record<string, unknown>;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: Record<string, string[]>;
  requestId: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}