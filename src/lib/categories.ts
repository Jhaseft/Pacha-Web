import { apiAxios } from "./apiClient";
import { CategoryData } from "@/types/category";

function parseApiError(error: any, fallback: string) {
  const rawMessage = error?.response?.data?.message ?? error?.message;
  if (Array.isArray(rawMessage)) return rawMessage.join(", ");
  if (typeof rawMessage === "string" && rawMessage.trim().length > 0)
    return rawMessage;
  return fallback;
}

// TODAS LAS CATEGORÍAS (admin, incluye inactivas)
export const apiGetAllCategories = async (): Promise<CategoryData[]> => {
  try {
    const response = await apiAxios.get("/categories/all");
    return response.data;
  } catch (error: any) {
    throw new Error(parseApiError(error, "Error al obtener las categorías"));
  }
};

// CATEGORÍAS ACTIVAS (público: explorar / selección)
export const apiGetActiveCategories = async (): Promise<CategoryData[]> => {
  try {
    const response = await apiAxios.get("/categories");
    return response.data;
  } catch (error: any) {
    throw new Error(parseApiError(error, "Error al obtener las categorías"));
  }
};

// CREAR CATEGORÍA
export const apiCreateCategory = async (
  data: Omit<CategoryData, "id" | "creatorsCount">,
): Promise<CategoryData> => {
  try {
    const response = await apiAxios.post("/categories", data);
    return response.data;
  } catch (error: any) {
    throw new Error(parseApiError(error, "Error al crear la categoría"));
  }
};

// EDITAR CATEGORÍA
export const apiUpdateCategory = async (
  id: string,
  data: Partial<CategoryData>,
): Promise<CategoryData> => {
  try {
    const response = await apiAxios.patch(`/categories/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(parseApiError(error, "Error al actualizar la categoría"));
  }
};

// ELIMINAR CATEGORÍA
export const apiDeleteCategory = async (id: string) => {
  try {
    const response = await apiAxios.delete(`/categories/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(parseApiError(error, "Error al eliminar la categoría"));
  }
};
