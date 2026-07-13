import { apiAxios } from './apiClient';

export interface ExpenseHistoryItem {
  id: string;
  monto: number | string;
  tipo: 'MESSAGE_UNLOCK' | 'IMAGE_UNLOCK' | 'DEPOSIT' | 'CALL_PAYMENT' | 'EARNING';
  fecha: string;
  descripcion: string | null;
  detalle: string;
}

export interface ExpenseHistoryResponse {
  success: boolean;
  data: ExpenseHistoryItem[];
  message?: string;
}

// GET /users/expense-history
export const apiGetExpenseHistory = async (): Promise<ExpenseHistoryResponse> => {
  try {
    const response = await apiAxios.get<ExpenseHistoryResponse>('/users/expense-history');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: error?.response?.data?.message ?? 'Error al conectar con el servidor',
    };
  }
};
