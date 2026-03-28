const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://caja-negra-pachamama-backend.wkhbmg.easypanel.host";

function buildUrl(path: string) {
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string>) },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const raw = data && (data.message || data.error);
    let message = `Error ${response.status}: solicitud fallida`;
    if (Array.isArray(raw)) message = raw.join(", ");
    else if (typeof raw === "string") message = raw;
    throw new Error(message);
  }

  return data as T;
}
