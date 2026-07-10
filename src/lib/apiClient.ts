import axios from "axios";

export const API_URL =
    process.env.NEXT_PUBLIC_API_URL ??
    "https://caja-negra-pacha-back.wkhbmg.easypanel.host";

// Creamos la instancia base
export const apiAxios = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiAxios.interceptors.request.use((config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("pacha.accessToken") : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

apiAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                localStorage.removeItem("pacha.accessToken");
                localStorage.removeItem("pacha.user");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export async function apiClient<T>(
    path: string,
    options: any = {},
    token?: string,
): Promise<T> {
    try {
        const headers = {
            ...options.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const response = await apiAxios.request<T>({
            url: path,
            method: options.method ?? "GET",
            data: options.body
                ? typeof options.body === "string"
                    ? JSON.parse(options.body)
                    : options.body
                : undefined,
            headers,
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data;
            const raw = data && (data.message || data.error);

            let message = `Error ${error.response?.status}: solicitud fallida`;
            if (Array.isArray(raw)) message = raw.join(", ");
            else if (typeof raw === "string") message = raw;

            throw new Error(message);
        }
        throw new Error("Ocurrió un error inesperado");
    }
}