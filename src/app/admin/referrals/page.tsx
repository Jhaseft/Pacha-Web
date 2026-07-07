"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  createCreatorReferralContract,
  disableCreatorReferralContract,
  getAdminCreatorReferralContracts,
  updateCreatorReferralContract,
  type AdminCreatorReferralContractItem,
  type CreatorReferralStatus,
} from "../../../lib/referrals";
import { getAllAnfitrionas, type AnfitrionaData } from "../../../lib/adminAnfitrionas";

function formatMoney(value: number) {
  return value.toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatPercent(value: number) {
  return value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
}

function validatePercent(raw: string, options?: { requirePositive?: boolean }) {
  if (!raw.trim()) return "El porcentaje es obligatorio.";
  const value = Number(raw.replace(",", "."));
  if (Number.isNaN(value)) return "El porcentaje debe ser numerico.";
  if (value < 0) return "El porcentaje no puede ser menor a 0.";
  if (options?.requirePositive && value <= 0) {
    return "El porcentaje debe ser mayor a 0.";
  }
  if (value > 100) return "El porcentaje no puede ser mayor a 100.";
  return null;
}

function statusLabel(status: CreatorReferralStatus) {
  if (status === "PENDING") return "Pendiente de activación";
  if (status === "ACTIVE") return "Activo";
  return "Desactivado";
}

function statusClassName(status: CreatorReferralStatus) {
  if (status === "PENDING") return "text-amber-400 font-semibold";
  if (status === "ACTIVE") return "text-green-400 font-semibold";
  return "text-red-400 font-semibold";
}

function getCreatorName(creator?: AnfitrionaData) {
  if (!creator) return "";
  return [creator.firstName, creator.lastName].filter(Boolean).join(" ") || creator.email || creator.id;
}

export default function AdminReferralsPage() {
  const { token } = useAuth();

  const [items, setItems] = useState<AdminCreatorReferralContractItem[]>([]);
  const [creators, setCreators] = useState<AnfitrionaData[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingCreators, setLoadingCreators] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftPercent, setDraftPercent] = useState("");
  const [draftStatus, setDraftStatus] = useState<CreatorReferralStatus>("ACTIVE");

  const [newReferrerSelectId, setNewReferrerSelectId] = useState("");
  const [newReferredSelectId, setNewReferredSelectId] = useState("");
  const [newReferrerManualId, setNewReferrerManualId] = useState("");
  const [newReferredManualId, setNewReferredManualId] = useState("");
  const [newPercent, setNewPercent] = useState("10");

  const loadContracts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await getAdminCreatorReferralContracts(token, {
        search: search.trim() || undefined,
      });
      setItems(res.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los contratos.");
    } finally {
      setLoading(false);
    }
  }, [token, search]);

  const loadCreators = useCallback(async () => {
    if (!token) return;
    setLoadingCreators(true);
    try {
      const all: AnfitrionaData[] = [];
      let cursor: string | null | undefined = undefined;

      for (let i = 0; i < 8; i += 1) {
        const page = await getAllAnfitrionas(token, undefined, cursor ?? undefined);
        const rows = Array.isArray(page.data) ? page.data : [];
        all.push(...rows);
        if (!page.nextCursor) break;
        cursor = page.nextCursor;
      }

      const unique = new Map<string, AnfitrionaData>();
      all.forEach((creator) => {
        if (creator?.id && !unique.has(creator.id)) unique.set(creator.id, creator);
      });
      setCreators(Array.from(unique.values()));
    } catch {
      // Fallback: allow manual IDs anyway
      setCreators([]);
    } finally {
      setLoadingCreators(false);
    }
  }, [token]);

  useEffect(() => {
    loadContracts();
  }, [loadContracts]);

  useEffect(() => {
    loadCreators();
  }, [loadCreators]);

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.generated += item.totalGeneratedByReferredCreator;
        acc.commission += item.totalCommissionPaid;
        return acc;
      },
      { generated: 0, commission: 0 },
    );
  }, [items]);

  function startEdit(item: AdminCreatorReferralContractItem) {
    setEditingId(item.id);
    setDraftPercent(String(item.percent));
    setDraftStatus(item.status);
    setMessage("");
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setDraftPercent("");
    setDraftStatus("ACTIVE");
  }

  async function saveEdit(contractId: string) {
    if (!token) return;
    const validationError = validatePercent(draftPercent);
    if (validationError) {
      setError(validationError);
      return;
    }

    const percent = Number(draftPercent.replace(",", "."));
    if (draftStatus === "ACTIVE" && percent <= 0) {
      setError("Para activar un contrato, el porcentaje debe ser mayor a 0.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");
    try {
      await updateCreatorReferralContract(token, contractId, {
        percent,
        status: draftStatus,
      });
      setMessage("Contrato actualizado correctamente.");
      cancelEdit();
      await loadContracts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el contrato.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDisable(contractId: string) {
    if (!token) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await disableCreatorReferralContract(token, contractId);
      setMessage("Contrato desactivado correctamente.");
      await loadContracts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo desactivar el contrato.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateContract() {
    if (!token) return;

    const validationError = validatePercent(newPercent, { requirePositive: true });
    if (validationError) {
      setError(validationError);
      return;
    }

    const referrerCreatorId = newReferrerManualId.trim() || newReferrerSelectId;
    const referredCreatorId = newReferredManualId.trim() || newReferredSelectId;

    if (!referrerCreatorId || !referredCreatorId) {
      setError("Debes indicar creador referente y creador referido.");
      return;
    }

    if (referrerCreatorId === referredCreatorId) {
      setError("No se permite autorreferido.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");
    try {
      await createCreatorReferralContract(token, {
        referrerCreatorId,
        referredCreatorId,
        percent: Number(newPercent.replace(",", ".")),
      });
      setMessage("Contrato creado correctamente.");
      setNewPercent("10");
      setNewReferrerManualId("");
      setNewReferredManualId("");
      setNewReferrerSelectId("");
      setNewReferredSelectId("");
      await loadContracts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el contrato.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-white text-3xl font-black tracking-tight">Contratos de referidos</h1>
        <p className="text-white/40 text-sm mt-1">
          Gestiona contratos entre creadores de contenido y su porcentaje de comision.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-[#111] border border-white/5 rounded-xl px-4 py-3">
          <p className="text-white/40 text-xs">Contratos</p>
          <p className="text-white text-2xl font-black">{items.length}</p>
        </div>
        <div className="bg-[#111] border border-white/5 rounded-xl px-4 py-3">
          <p className="text-white/40 text-xs">Total generado por creadoras referidas</p>
          <p className="text-white text-2xl font-black">S/ {formatMoney(totals.generated)}</p>
        </div>
        <div className="bg-[#111] border border-white/5 rounded-xl px-4 py-3">
          <p className="text-white/40 text-xs">Total comision pagada</p>
          <p className="text-green-400 text-2xl font-black">S/ {formatMoney(totals.commission)}</p>
        </div>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-2xl p-4 mb-6">
        <p className="text-white font-semibold mb-3">Crear contrato</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-white/60 text-xs">Creador referente (seleccion)</label>
            <select
              value={newReferrerSelectId}
              onChange={(e) => setNewReferrerSelectId(e.target.value)}
              className="mt-1 w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white text-sm"
            >
              <option value="">Seleccionar creador referente</option>
              {creators.map((creator) => (
                <option key={creator.id} value={creator.id}>
                  {getCreatorName(creator)}
                </option>
              ))}
            </select>
            <input
              value={newReferrerManualId}
              onChange={(e) => setNewReferrerManualId(e.target.value)}
              placeholder="o ingresar ID manual"
              className="mt-2 w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-white/30"
            />
          </div>

          <div>
            <label className="text-white/60 text-xs">Creador referido (seleccion)</label>
            <select
              value={newReferredSelectId}
              onChange={(e) => setNewReferredSelectId(e.target.value)}
              className="mt-1 w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white text-sm"
            >
              <option value="">Seleccionar creador referido</option>
              {creators.map((creator) => (
                <option key={creator.id} value={creator.id}>
                  {getCreatorName(creator)}
                </option>
              ))}
            </select>
            <input
              value={newReferredManualId}
              onChange={(e) => setNewReferredManualId(e.target.value)}
              placeholder="o ingresar ID manual"
              className="mt-2 w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-white/30"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          <div className="w-full sm:w-48">
            <label className="text-white/60 text-xs">Porcentaje acordado</label>
            <input
              value={newPercent}
              onChange={(e) => setNewPercent(e.target.value)}
              placeholder="Ej: 10"
              className="mt-1 w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-white/30"
            />
          </div>
          <button
            onClick={handleCreateContract}
            disabled={saving}
            className="bg-[#A11213] hover:bg-red-800 disabled:opacity-50 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
          >
            {saving ? "Guardando..." : "Crear contrato"}
          </button>
          {loadingCreators && <p className="text-white/40 text-xs">Cargando creadores...</p>}
        </div>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o email"
          className="w-full sm:max-w-md bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-white/20 transition-colors text-sm"
        />
        <button
          onClick={loadContracts}
          className="bg-[#A11213] hover:bg-red-800 text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors"
        >
          Buscar
        </button>
      </div>

      {message && (
        <div className="mb-4 bg-green-900/20 border border-green-500/20 text-green-400 rounded-xl px-4 py-3 text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-900/20 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[#111] border border-white/5 rounded-2xl h-16 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-[#111] border border-white/5 rounded-2xl p-10 text-center">
          <p className="text-white/30">No hay contratos para mostrar.</p>
        </div>
      ) : (
        <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-white/40 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Creador referente</th>
                  <th className="px-4 py-3 text-left">Creador referido</th>
                  <th className="px-4 py-3 text-left">Codigo referente</th>
                  <th className="px-4 py-3 text-left">Porcentaje</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-left">Total generado</th>
                  <th className="px-4 py-3 text-left">Total comision</th>
                  <th className="px-4 py-3 text-left">Eventos</th>
                  <th className="px-4 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const isEditing = editingId === item.id;

                  return (
                    <tr key={item.id} className="border-t border-white/5 align-top">
                      <td className="px-4 py-3 text-white">
                        <p className="font-semibold">{item.referrerCreator.name || "Sin nombre"}</p>
                        <p className="text-xs text-white/50">{item.referrerCreator.email || item.referrerCreator.id}</p>
                      </td>
                      <td className="px-4 py-3 text-white">
                        <p className="font-semibold">{item.referredCreator.name || "Sin nombre"}</p>
                        <p className="text-xs text-white/50">{item.referredCreator.email || item.referredCreator.id}</p>
                      </td>
                      <td className="px-4 py-3 text-white/80">
                        {item.referrerCreator.referralCode || "-"}
                      </td>
                      <td className="px-4 py-3 text-white font-semibold">{formatPercent(item.percent)}%</td>
                      <td className="px-4 py-3">
                        <span
                          className={statusClassName(item.status)}
                        >
                          {statusLabel(item.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white">S/ {formatMoney(item.totalGeneratedByReferredCreator)}</td>
                      <td className="px-4 py-3 text-green-400 font-semibold">S/ {formatMoney(item.totalCommissionPaid)}</td>
                      <td className="px-4 py-3 text-white/80">{item.rewardEventsCount}</td>
                      <td className="px-4 py-3">
                        {!isEditing ? (
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => startEdit(item)}
                              className="bg-white/10 hover:bg-white/15 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                            >
                              Editar
                            </button>
                            {item.status === "ACTIVE" && (
                              <button
                                onClick={() => handleDisable(item.id)}
                                disabled={saving}
                                className="bg-red-900/40 hover:bg-red-900/60 disabled:opacity-50 text-red-200 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                              >
                                Desactivar
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="w-56 bg-black/30 border border-white/10 rounded-xl p-3 flex flex-col gap-2">
                            <label className="text-white/70 text-xs">Porcentaje</label>
                            <input
                              value={draftPercent}
                              onChange={(e) => setDraftPercent(e.target.value)}
                              className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                            />
                            <label className="text-white/70 text-xs">Estado</label>
                            <select
                              value={draftStatus}
                              onChange={(e) => setDraftStatus(e.target.value as CreatorReferralStatus)}
                              className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                            >
                              <option value="PENDING">Pendiente de activación</option>
                              <option value="ACTIVE">Activo</option>
                              <option value="DISABLED">Desactivado</option>
                            </select>
                            <div className="flex gap-2">
                              <button
                                onClick={() => saveEdit(item.id)}
                                disabled={saving}
                                className="bg-[#A11213] hover:bg-red-800 disabled:opacity-50 text-white text-xs font-bold px-3 py-2 rounded-lg"
                              >
                                Guardar
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="bg-white/10 hover:bg-white/15 text-white text-xs font-bold px-3 py-2 rounded-lg"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
