import { apiFetch } from "./api";

export type ClientData = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string;
  email: string | null;
  isActive: boolean;
  wallet?: { balance: number | string } | null;
};

export type PaginatedClients = {
  data: ClientData[];
  nextCursor: string | null;
};

export async function getAllClients(
  token: string,
  search?: string,
  cursor?: string,
): Promise<PaginatedClients> {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (cursor) params.set("cursor", cursor);
  params.set("limit", "10");

  return apiFetch<PaginatedClients>(`/admin/clients?${params}`, { method: "GET" }, token);
}

export async function toggleClientStatus(
  token: string,
  id: string,
  isActive: boolean,
) {
  return apiFetch(
    `/admin/clients/${id}/status`,
    { method: "PATCH", body: JSON.stringify({ isActive }) },
    token,
  );
}
