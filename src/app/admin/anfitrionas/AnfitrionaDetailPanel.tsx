"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { editAnfitriona, type AnfitrionaData } from "../../../lib/adminAnfitrionas";
import { getAnfitrionaStats, type AnfitrionaStats } from "../../../lib/adminStats";
import { parsePhone } from "../../../lib/countryCodes";
import AnfitrionaDetailHeader  from "./components/AnfitrionaDetailHeader";
import AnfitrionaDetailProfile from "./components/AnfitrionaDetailProfile";
import AnfitrionaPhoneField    from "./components/AnfitrionaPhoneField";
import AnfitrionaEditField     from "./components/AnfitrionaEditField";

interface Props {
  anfitriona: AnfitrionaData;
  onClose: () => void;
  onUpdated: (updated: AnfitrionaData) => void;
}

type FieldKey = "phone" | "username" | "bio" | "rateCredits" | "email";

function mapErrorToField(message: string): FieldKey | null {
  const m = message.toLowerCase();
  if (m.includes("email"))                                return "email";
  if (m.includes("teléfono") || m.includes("telefono") || m.includes("phone")) return "phone";
  if (m.includes("usuario")  || m.includes("username"))  return "username";
  if (m.includes("bio"))                                  return "bio";
  if (m.includes("crédito")  || m.includes("credito") || m.includes("rate"))   return "rateCredits";
  return null;
}

export default function AnfitrionaDetailPanel({ anfitriona, onClose, onUpdated }: Props) {
  const { token } = useAuth();

  const [stats,        setStats]        = useState<AnfitrionaStats | null>(null);
  const [editing,      setEditing]      = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [fieldErrors,  setFieldErrors]  = useState<Partial<Record<FieldKey, string>>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [success,      setSuccess]      = useState<string | null>(null);

  const parsed = parsePhone(anfitriona.phoneNumber ?? "");
  const [countryCode, setCountryCode] = useState(parsed.code);
  const [phoneNumber, setPhoneNumber] = useState(parsed.number);

  const [form, setForm] = useState({
    username:    anfitriona.anfitrionaProfile?.username    ?? "",
    bio:         anfitriona.anfitrionaProfile?.bio         ?? "",
    rateCredits: String(anfitriona.anfitrionaProfile?.rateCredits ?? ""),
    email:       anfitriona.email ?? "",
  });

  const savedFormRef  = useRef(form);
  const savedPhoneRef = useRef({ code: parsed.code, number: parsed.number });

  useEffect(() => {
    if (!token) return;
    getAnfitrionaStats(token, anfitriona.id).then(setStats).catch(() => {});
  }, [anfitriona.id, token]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const clearMessages = () => {
    setFieldErrors({});
    setGeneralError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setForm(savedFormRef.current);
    setCountryCode(savedPhoneRef.current.code);
    setPhoneNumber(savedPhoneRef.current.number);
    setEditing(false);
    clearMessages();
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    clearMessages();
    try {
      await editAnfitriona(token, anfitriona.id, {
        phoneNumber:  countryCode + phoneNumber || undefined,
        username:     form.username    || undefined,
        bio:          form.bio         || undefined,
        rateCredits:  form.rateCredits ? Number(form.rateCredits) : undefined,
        email:        form.email       || undefined,
      });

      savedFormRef.current  = { ...form };
      savedPhoneRef.current = { code: countryCode, number: phoneNumber };

      const merged: AnfitrionaData = {
        ...anfitriona,
        phoneNumber: countryCode + phoneNumber,
        email: form.email,
        anfitrionaProfile: anfitriona.anfitrionaProfile
          ? {
              ...anfitriona.anfitrionaProfile,
              username:    form.username,
              bio:         form.bio,
              rateCredits: Number(form.rateCredits),
            }
          : undefined,
      };
      onUpdated(merged);
      setEditing(false);
      setSuccess("Datos actualizados correctamente");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "No se pudo actualizar";
      const field = mapErrorToField(msg);
      if (field) setFieldErrors({ [field]: msg });
      else setGeneralError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0f0f0f] rounded-3xl w-full max-w-lg flex flex-col overflow-hidden shadow-2xl border border-white/5"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <AnfitrionaDetailHeader
          editing={editing}
          saving={saving}
          onClose={onClose}
          onEdit={() => setEditing(true)}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-4">
          <AnfitrionaDetailProfile
            firstName={anfitriona.firstName}
            lastName={anfitriona.lastName}
            avatarUrl={anfitriona.anfitrionaProfile?.avatarUrl}
            isActive={anfitriona.isActive}
            isOnline={anfitriona.anfitrionaProfile?.isOnline ?? false}
            stats={stats}
          />

          {generalError && (
            <p className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{generalError}</p>
          )}
          {success && (
            <p className="text-green-400 text-xs text-center bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2">{success}</p>
          )}

          <div className="bg-[#141414] rounded-2xl border border-zinc-800 overflow-hidden">
            <AnfitrionaPhoneField
              editing={editing}
              countryCode={countryCode}
              phoneNumber={phoneNumber}
              onChangeCode={setCountryCode}
              onChangeNumber={setPhoneNumber}
              error={fieldErrors.phone}
            />
            <AnfitrionaEditField label="Nombre de Usuario"        icon="user"    value={form.username}    editing={editing} onChange={(v) => setForm((p) => ({ ...p, username: v }))}    error={fieldErrors.username} />
            <AnfitrionaEditField label="Biografía"                icon="text"    value={form.bio}         editing={editing} onChange={(v) => setForm((p) => ({ ...p, bio: v }))}          error={fieldErrors.bio}      multiline />
            <AnfitrionaEditField label="Créditos de Calificación" icon="diamond" value={form.rateCredits} editing={editing} onChange={(v) => setForm((p) => ({ ...p, rateCredits: v }))} error={fieldErrors.rateCredits} type="number" />
            <AnfitrionaEditField label="Email"                    icon="email"   value={form.email}       editing={editing} onChange={(v) => setForm((p) => ({ ...p, email: v }))}        error={fieldErrors.email}    type="email" isLast />
          </div>

          <p className="text-zinc-600 text-center text-xs pb-2">
            Puedes actualizar la información del creador de contenido utilizando el modo edición.
          </p>
        </div>
      </div>
    </div>
  );
}
