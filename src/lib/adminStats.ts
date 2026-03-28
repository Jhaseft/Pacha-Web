import { apiFetch } from "./api";

export type AdminStats = {
  clients: {
    total: number;
    active: number;
    suspended: number;
    newThisMonth: number;
  };
  anfitrionas: {
    total: number;
    active: number;
    inactive: number;
  };
  deposits: {
    pending: number;
    approvedToday: number;
    totalRevenue: number;
  };
  withdrawals: {
    pending: number;
  };
  activity: {
    messageUnlocks: number;
    imageUnlocks: number;
  };
};

export async function getAdminStats(token: string): Promise<AdminStats> {
  return apiFetch<AdminStats>("/admin/stats", { method: "GET" }, token);
}
