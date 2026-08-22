export interface SmmService {
  id: number;
  name: string;
  category: string;
  ratePer1000: number;
  min: number;
  max: number;
  description: string;
}

export interface SmmOrder {
  id: number;
  serviceId: number;
  serviceName: string;
  link: string;
  quantity: number;
  charge: number;
  status: 'Pending' | 'In progress' | 'Completed' | 'Partial' | 'Canceled';
  createdAt: string;
}

export interface UserProfile {
  id: number;
  username: string;
  balance: number;
  apiKey: string;
}
