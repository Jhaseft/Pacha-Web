import { apiFetch } from "./api";

export type AdminCreatorReferralItem = {
  creatorId: string;
  name: string | null;
  email: string | null;
  referralCode: string | null;
  percent: number;
  isActive: boolean;
  totalReferrals: number;
  totalRewardAmount: number;
};

export type AdminCreatorReferralsResponse = {
  items: AdminCreatorReferralItem[];
  total: number;
  page: number;
  limit: number;
};

export type AdminCreatorSummary = {
  id: string;
  name: string | null;
  email: string | null;
  referralCode?: string | null;
};

export type CreatorReferralStatus = "PENDING" | "ACTIVE" | "DISABLED";

export type AdminCreatorReferralContractItem = {
  id: string;
  referrerCreator: AdminCreatorSummary;
  referredCreator: AdminCreatorSummary;
  percent: number;
  status: CreatorReferralStatus;
  totalGeneratedByReferredCreator: number;
  totalCommissionPaid: number;
  rewardEventsCount: number;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminCreatorReferralContractsResponse = {
  items: AdminCreatorReferralContractItem[];
  total: number;
  page: number;
  limit: number;
};

export type ReferralRewardEvent = {
  sourceEarningTransactionId: string;
  rewardTransactionId: string;
  sourceEarningAmount: number;
  percent: number;
  rewardAmount: number;
  createdAt: string;
};

export type ReferralCreatorItem = {
  referralId?: string;
  referredCreatorId?: string | null;
  referredUserId?: string | null;
  name: string | null;
  email: string | null;
  percent: number;
  status?: CreatorReferralStatus;
  createdAt: string;
  qualifiedAt: string | null;
  totalGenerated: number;
  totalRewardAmount: number;
  rewardEventsCount: number;
  rewardEvents: ReferralRewardEvent[];
};

export type MyReferralsResponse = {
  referralCode: string | null;
  percent: number;
  isActive: boolean;
  totalReferrals: number;
  totalRewardAmount: number;
  referrals: ReferralCreatorItem[];
};

type RawAdminResponse = {
  total?: number;
  page?: number;
  limit?: number;
  data?: any[];
  items?: any[];
};

function mapAdminCreatorSummary(raw: any): AdminCreatorSummary {
  return {
    id: raw?.id ?? "",
    name: raw?.name ?? null,
    email: raw?.email ?? null,
    referralCode: raw?.referralCode ?? raw?.code ?? null,
  };
}

// Legacy endpoint: /admin/referrals/creators
export async function getAdminCreatorReferrals(
  token: string,
  params?: { search?: string; page?: number; limit?: number },
): Promise<AdminCreatorReferralsResponse> {
  const query = new URLSearchParams();
  if (params?.search?.trim()) query.set("search", params.search.trim());
  if (params?.page && params.page > 0) query.set("page", String(params.page));
  if (params?.limit && params.limit > 0) query.set("limit", String(params.limit));

  const raw = await apiFetch<RawAdminResponse>(
    `/admin/referrals/creators${query.toString() ? `?${query.toString()}` : ""}`,
    { method: "GET" },
    token,
  );

  const rows = raw.items ?? raw.data ?? [];
  const items: AdminCreatorReferralItem[] = rows.map((row: any) => ({
    creatorId: row.creatorId ?? row.id,
    name: row.name ?? null,
    email: row.email ?? null,
    referralCode: row.referralCode ?? null,
    percent: Number(row.percent ?? 0),
    isActive: Boolean(row.isActive),
    totalReferrals: Number(row.totalReferrals ?? 0),
    totalRewardAmount: Number(row.totalRewardAmount ?? row.totalGenerated ?? 0),
  }));

  const resolvedLimit = raw.limit ?? params?.limit ?? items.length ?? 20;

  return {
    items,
    total: Number(raw.total ?? items.length),
    page: Number(raw.page ?? 1),
    limit: Number(resolvedLimit),
  };
}

export async function getAdminCreatorReferralContracts(
  token: string,
  params?: { search?: string; page?: number; limit?: number },
): Promise<AdminCreatorReferralContractsResponse> {
  const query = new URLSearchParams();
  if (params?.search?.trim()) query.set("search", params.search.trim());
  if (params?.page && params.page > 0) query.set("page", String(params.page));
  if (params?.limit && params.limit > 0) query.set("limit", String(params.limit));

  const raw = await apiFetch<RawAdminResponse>(
    `/admin/referrals/creator-contracts${query.toString() ? `?${query.toString()}` : ""}`,
    { method: "GET" },
    token,
  );

  const rows = raw.items ?? raw.data ?? [];
  const items: AdminCreatorReferralContractItem[] = rows.map((row: any) => ({
    id: row.id,
    referrerCreator: mapAdminCreatorSummary(row.referrerCreator),
    referredCreator: mapAdminCreatorSummary(row.referredCreator),
    percent: Number(row.percent ?? 0),
    status: String(row.status ?? "ACTIVE") as CreatorReferralStatus,
    totalGeneratedByReferredCreator: Number(
      row.totalGeneratedByReferredCreator ?? row.totalGenerated ?? 0,
    ),
    totalCommissionPaid: Number(row.totalCommissionPaid ?? row.totalRewardAmount ?? 0),
    rewardEventsCount: Number(row.rewardEventsCount ?? 0),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }));

  const resolvedLimit = raw.limit ?? params?.limit ?? items.length ?? 20;

  return {
    items,
    total: Number(raw.total ?? items.length),
    page: Number(raw.page ?? 1),
    limit: Number(resolvedLimit),
  };
}

export async function createCreatorReferralContract(
  token: string,
  payload: { referrerCreatorId: string; referredCreatorId: string; percent: number },
) {
  return apiFetch(
    "/admin/referrals/creator-contracts",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token,
  );
}

export async function updateCreatorReferralContract(
  token: string,
  contractId: string,
  payload: { percent?: number; status?: CreatorReferralStatus },
) {
  return apiFetch(
    `/admin/referrals/creator-contracts/${contractId}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
    token,
  );
}

export async function disableCreatorReferralContract(token: string, contractId: string) {
  return apiFetch(
    `/admin/referrals/creator-contracts/${contractId}/disable`,
    {
      method: "PATCH",
    },
    token,
  );
}

// Legacy endpoint: /admin/referrals/creators/:creatorId/percent
export async function updateCreatorReferralPercent(
  token: string,
  creatorId: string,
  payload: { percent: number; isActive?: boolean },
) {
  return apiFetch(
    `/admin/referrals/creators/${creatorId}/percent`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
    token,
  );
}

export async function getMyReferrals(token: string): Promise<MyReferralsResponse> {
  const raw = await apiFetch<any>("/referrals/me", { method: "GET" }, token);

  return {
    referralCode: raw?.referralCode ?? null,
    percent: Number(raw?.percent ?? 0),
    isActive: Boolean(raw?.isActive ?? true),
    totalReferrals: Number(raw?.totalReferrals ?? 0),
    totalRewardAmount: Number(raw?.totalRewardAmount ?? 0),
    referrals: Array.isArray(raw?.referrals)
      ? raw.referrals.map((item: any) => ({
          referralId: item.referralId,
          referredCreatorId: item.referredCreatorId ?? null,
          referredUserId: item.referredUserId ?? null,
          name: item.name ?? null,
          email: item.email ?? null,
          percent: Number(
            item.percent ?? item.contractPercent ?? item.referralPercent ?? item.agreedPercent ?? 0,
          ),
          status: item.status,
          createdAt: item.createdAt,
          qualifiedAt: item.qualifiedAt ?? null,
          totalGenerated: Number(item.totalGenerated ?? 0),
          totalRewardAmount: Number(item.totalRewardAmount ?? 0),
          rewardEventsCount: Number(item.rewardEventsCount ?? 0),
          rewardEvents: Array.isArray(item.rewardEvents)
            ? item.rewardEvents.map((event: any) => ({
                sourceEarningTransactionId: String(
                  event.sourceEarningTransactionId ?? event.sourceTransactionId ?? "",
                ),
                rewardTransactionId: String(event.rewardTransactionId ?? ""),
                sourceEarningAmount: Number(event.sourceEarningAmount ?? event.sourceAmount ?? 0),
                percent: Number(event.percent ?? 0),
                rewardAmount: Number(event.rewardAmount ?? 0),
                createdAt: String(event.createdAt ?? ""),
              }))
            : [],
        }))
      : [],
  };
}
