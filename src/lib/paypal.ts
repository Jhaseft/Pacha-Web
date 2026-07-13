import { apiFetch } from './api';

export interface PaypalOrderResponse {
  approveUrl: string;
  orderId: string;
}

export interface PaypalCaptureResponse {
  credits: number;
  newBalance: string | number;
}

export async function apiPaypalCreateOrder(
  packageId: string,
  token: string,
): Promise<PaypalOrderResponse> {
  return apiFetch<PaypalOrderResponse>(
    '/paypal/create-order',
    { method: 'POST', body: JSON.stringify({ packageId }) },
    token,
  );
}

export async function apiPaypalCapture(
  orderId: string,
  token: string,
): Promise<PaypalCaptureResponse> {
  return apiFetch<PaypalCaptureResponse>(
    '/paypal/capture',
    { method: 'POST', body: JSON.stringify({ orderId }) },
    token,
  );
}
