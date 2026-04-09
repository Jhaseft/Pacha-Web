import { apiAxios } from "./apiClient";
import { PackageData } from "@/types/package";
import { apiClient } from "./apiClient";

function parseApiError(error: any, fallback: string) {
    const rawMessage = error?.response?.data?.message ?? error?.message;
    if (Array.isArray(rawMessage)) return rawMessage.join(', ');
    if (typeof rawMessage === 'string' && rawMessage.trim().length > 0) return rawMessage;
    return fallback;
}

// CREAR UN NUEVO PAQUETE
export const apiCreatePackage = async (packageData: PackageData) => {
    try {
        const response = await apiAxios.post('/packages/create', packageData);
        return response.data;
    } catch (error: any) {
        throw new Error(parseApiError(error, 'Error al crear el paquete'));
    }
};

// OBTENER TODOS LOS PAQUETES
export const apiGetAllPackages = async () => {
    try {
        const response = await apiAxios.get('/packages');
        return response.data;
    } catch (error: any) {
        throw new Error(parseApiError(error, 'Error al obtener la lista de paquetes'));
    }
};

// EDITAR UN PAQUETE EXISTENTE
export const apiUpdatePackage = async (id: string, updateData: Partial<PackageData>) => {
    try {
        const response = await apiAxios.patch(`/packages/${id}`, updateData);
        return response.data;
    } catch (error: any) {
        throw new Error(parseApiError(error, 'Error al actualizar el paquete'));
    }
};

// ELIMINAR UN PAQUETE
export const apiDeletePackage = async (id: string) => {
    try {
        const response = await apiAxios.delete(`/packages/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(parseApiError(error, 'Error al intentar eliminar el paquete'));
    }
};

// OBTENER UN PAQUETE POR ID
export const apiGetPackageById = async (id: string) => {
    try {
        const response = await apiAxios.get(`/packages/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(parseApiError(error, 'No se pudo obtener la informacion del paquete'));
    }
};
