import { apiFetch } from "./api";

export type AnfitrionaData = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  isActive: boolean;
  wallet?: {
    balance: number | string;
  };
  anfitrionaProfile?: {
    username: string;
    avatarUrl?: string;
    bio: string;
    rateCredits: number;
    isOnline: boolean;
  };
};

export type PaginatedAnfitrionas = {
  data: AnfitrionaData[];
  nextCursor?: string | null;
};

export type EditAnfitrionaRequest = {
  phoneNumber?: string;
  username?: string;
  bio?: string;
  rateCredits?: number;
  email?: string;
};

export async function getAllAnfitrionas(
  token: string,
  search?: string,
  cursor?: string,
): Promise<PaginatedAnfitrionas> {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (cursor) params.set("cursor", cursor);
  params.set("limit", "10");

  return apiFetch<PaginatedAnfitrionas>(`/admin/anfitrionas?${params}`, { method: "GET" }, token);
}

export async function toggleAnfitrionaStatus(
  token: string,
  id: string,
  isActive: boolean,
) {
  return apiFetch(
    `/admin/anfitrionas/${id}/status`,
    { method: "PATCH", body: JSON.stringify({ isActive }) },
    token,
  );
}

export async function adminUpdateAnfitrionaProfile(
  token: string,
  id: string,
  payload: { firstName?: string; lastName?: string; username?: string; bio?: string },
) {
  return apiFetch(
    `/admin/anfitrionas/${id}/profile`,
    { method: "PATCH", body: JSON.stringify(payload) },
    token,
  );
}

export async function editAnfitriona(
  token: string,
  id: string,
  data: EditAnfitrionaRequest,
): Promise<AnfitrionaData> {
  return apiFetch<AnfitrionaData>(
    `/admin/anfitrionas/${id}/edit`,
    { method: "PATCH", body: JSON.stringify(data) },
    token,
  );
}
