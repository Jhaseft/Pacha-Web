import { apiAxios } from './apiClient';
import { ServicePrice, ServiceType } from '@/types/precios';

export const apiGetMyServicePrices = async (): Promise<ServicePrice[]> => {
  const response = await apiAxios.get<ServicePrice[]>('/service-prices');
  return response.data;
};

export const apiUpsertServicePrice = async (
  serviceType: ServiceType,
  price: number,
): Promise<ServicePrice> => {
  const response = await apiAxios.put<ServicePrice>('/service-prices', {
    serviceType,
    price,
  });
  return response.data;
};
