import { apiFetch } from "./api";

// ─── Modelo de UI ─────────────────────────────────────────────────────────────
export type Anfitriona = {
  id: string;
  name: string;
  username?: string;
  avatar: string;
  shortDescription: string;
  credits: number;
  images: string[];
  isOnline: boolean;
  likesCount: number;
  isLiked: boolean;
  isFavorite: boolean;
};

// ─── Respuesta cruda del backend ──────────────────────────────────────────────
type ApiListItem = {
  id: string;
  name: string;
  username?: string | null;
  avatar?: string | null;
  shortDescription?: string | null;
  rateCredits?: number | null;
  images: string[];
  mainImage?: string | null;
  isOnline: boolean;
  likesCount?: number | null;
  isLiked?: boolean | null;
};

type ApiListResponse = {
  data: ApiListItem[];
  total: number;
  page: number;
  limit: number;
};

export type ToggleLikeResponse = { liked: boolean; likesCount: number };
export type ToggleSavedResponse = { saved: boolean };

function mapListItem(item: ApiListItem): Anfitriona {
  const images =
    item.images.length > 0 ? item.images : item.mainImage ? [item.mainImage] : [];
  return {
    id: item.id,
    name: item.name,
    username: item.username ?? undefined,
    avatar: item.avatar ?? "",
    shortDescription: item.shortDescription ?? "",
    credits: item.rateCredits ?? 0,
    images,
    isOnline: item.isOnline,
    likesCount: item.likesCount ?? 0,
    isLiked: item.isLiked ?? false,
    isFavorite: false,
  };
}

export type HostessesPage = {
  anfitrionas: Anfitriona[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

/**
 * GET /anfitrionas/public?page=&limit= — público, sin token.
 * `revalidate` solo aplica cuando se llama desde el servidor (ISR); en el
 * cliente se ignora. Sin él, el fetch no se cachea (default de Next 16).
 */
export async function getPublicHostesses(
  page = 1,
  limit = 10,
  opts: { revalidate?: number } = {},
): Promise<HostessesPage> {
  const res = await apiFetch<ApiListResponse>(
    `/anfitrionas/public?page=${page}&limit=${limit}`,
    opts.revalidate === undefined ? {} : { next: { revalidate: opts.revalidate } },
  );
  return {
    anfitrionas: res.data.map(mapListItem),
    total: res.total,
    page: res.page,
    limit: res.limit,
    hasMore: res.page * res.limit < res.total,
  };
}

/** POST /anfitrionas/public/:id/like — requiere token (rol USER). */
export async function toggleLike(anfitrionaId: string, token: string) {
  return apiFetch<ToggleLikeResponse>(
    `/anfitrionas/public/${anfitrionaId}/like`,
    { method: "POST" },
    token,
  );
}

/** POST /users/public/saved-anfitrionas/toggle — guarda / quita de favoritos. */
export async function toggleSaved(anfitrionaId: string, token: string) {
  return apiFetch<ToggleSavedResponse>(
    `/users/public/saved-anfitrionas/toggle`,
    { method: "POST", body: JSON.stringify({ anfitrionaId }) },
    token,
  );
}

/** GET /users/public/saved-anfitrionas — ids guardados del usuario. */
export async function getSavedAnfitrionas(
  token: string,
): Promise<{ data: { id: string }[]; nextCursor: string | null }> {
  try {
    return await apiFetch(`/users/public/saved-anfitrionas?limit=50`, {}, token);
  } catch {
    return { data: [], nextCursor: null };
  }
}
