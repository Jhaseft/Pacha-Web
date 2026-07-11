export enum ServiceType {
  MESSAGE_SEND = 'MESSAGE_SEND',
  MESSAGE = 'MESSAGE',
  CALL = 'CALL',
  VIDEO_CALL = 'VIDEO_CALL',
}

export interface ServicePrice {
  id: string;
  serviceType: ServiceType;
  price: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceConfig {
  type: ServiceType;
  label: string;
  description: string;
  unit: string;
  minPrice: number;
  maxPrice: number;
}
