import { apiFetch } from "./api";

export type AnfitrionaData = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string;
  email: string | null;
  isActive: boolean;
  wallet?: { balance: number | string } | null;
};

export type PaginatedAnfitrionas = {
  data: AnfitrionaData[];
  nextCursor: string | null;
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
