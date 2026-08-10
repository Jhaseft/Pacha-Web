import type { MyProfileData } from '@/types/perfil';
import { Card, FieldRow, PrimaryButton, StepTitle } from '../components/ui';
import { ImagePicker, MultiImagePicker } from '../components/pickers';
import { MIN_GALLERY_IMAGES, MIN_PREMIUM_IMAGES } from '../constants';

export function ProfileStep({
  profile,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  bio,
  setBio,
  avatarPreview,
  onPickAvatar,
  coverPreview,
  onPickCover,
  publicFiles,
  setPublicFiles,
  totalPublic,
  premiumFiles,
  setPremiumFiles,
  totalPremium,
  premiumUnlock,
  setPremiumUnlock,
  saving,
  error,
  onSubmit,
}: {
  profile: MyProfileData | null;
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  bio: string;
  setBio: (v: string) => void;
  avatarPreview: string | null;
  onPickAvatar: (f: File) => void;
  coverPreview: string | null;
  onPickCover: (f: File) => void;
  publicFiles: File[];
  setPublicFiles: (f: File[]) => void;
  totalPublic: number;
  premiumFiles: File[];
  setPremiumFiles: (f: File[]) => void;
  totalPremium: number;
  premiumUnlock: string;
  setPremiumUnlock: (v: string) => void;
  saving: boolean;
  error: string;
  onSubmit: () => void;
}) {
  const galleryDone = totalPublic >= MIN_GALLERY_IMAGES;
  const missing = Math.max(0, MIN_GALLERY_IMAGES - totalPublic);
  const premiumDone = totalPremium >= MIN_PREMIUM_IMAGES;
  const missingPremium = Math.max(0, MIN_PREMIUM_IMAGES - totalPremium);

  return (
    <Card>
      <StepTitle
        title="Completa tu perfil"
        subtitle="Tu perfil debe ser atractivo para que los usuarios quieran conocerte."
      />

      {/* Foto de perfil */}
      <FieldRow
        index={1}
        title="Foto de perfil"
        hint="Una foto clara donde se vea tu rostro."
        done={!!(avatarPreview || profile?.avatarUrl)}
      >
        <ImagePicker round preview={avatarPreview || profile?.avatarUrl || null} onPick={onPickAvatar} />
      </FieldRow>

      {/* Foto de portada */}
      <FieldRow
        index={2}
        title="Foto de portada"
        hint="Una imagen llamativa que represente tu estilo."
        done={!!(coverPreview || profile?.coverUrl)}
      >
        <ImagePicker wide preview={coverPreview || profile?.coverUrl || null} onPick={onPickCover} />
      </FieldRow>

      {/* Galería pública — obligatoria (mínimo MIN_GALLERY_IMAGES) */}
      <FieldRow
        index={3}
        title={`Galería de fotos (mínimo ${MIN_GALLERY_IMAGES})`}
        hint={`Sube al menos ${MIN_GALLERY_IMAGES} fotos que muestren tu mejor contenido.`}
        done={galleryDone}
      >
        <MultiImagePicker files={publicFiles} onChange={setPublicFiles} />
        <p className={`mt-1 text-xs font-semibold ${galleryDone ? 'text-emerald-600' : 'text-brand-violet'}`}>
          {totalPublic} / {MIN_GALLERY_IMAGES} foto{totalPublic === 1 ? '' : 's'}
          {missing > 0 ? ` — te faltan ${missing}` : ' ✓'}
        </p>
      </FieldRow>

      {/* Fotos exclusivas */}
      <FieldRow
        index={4}
        title={`Fotos exclusivas (mínimo ${MIN_PREMIUM_IMAGES})`}
        hint="Fotos que solo verán tus clientes que paguen por ellas."
        done={premiumDone}
      >
        <MultiImagePicker files={premiumFiles} onChange={setPremiumFiles} premium />
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-ink-soft">Desbloqueo:</span>
          <input
            type="number"
            min={1}
            value={premiumUnlock}
            onChange={(e) => setPremiumUnlock(e.target.value)}
            className="w-20 rounded-lg border border-line px-2 py-1 text-sm text-ink outline-none focus:border-brand-violet"
          />
          <span className="text-xs text-ink-soft">créditos c/u</span>
        </div>
        <p className={`mt-1 text-xs font-semibold ${premiumDone ? 'text-emerald-600' : 'text-brand-violet'}`}>
          {totalPremium} / {MIN_PREMIUM_IMAGES} foto{totalPremium === 1 ? '' : 's'} exclusiva{totalPremium === 1 ? '' : 's'}
          {missingPremium > 0 ? ` — te faltan ${missingPremium}` : ' ✓'}
        </p>
      </FieldRow>

      {/* Información básica */}
      <FieldRow
        index={5}
        title="Información básica"
        hint="Completa tu información para que te encuentren fácilmente."
        done={!!bio.trim()}
        last
      >
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            placeholder="Nombre"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="rounded-lg border border-line px-3 py-2 text-sm text-ink outline-none focus:border-brand-violet"
          />
          <input
            placeholder="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="rounded-lg border border-line px-3 py-2 text-sm text-ink outline-none focus:border-brand-violet"
          />
        </div>
        <textarea
          placeholder="Cuéntales algo sobre ti…"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-line px-3 py-2 text-sm text-ink outline-none focus:border-brand-violet resize-none"
        />
      </FieldRow>

      <PrimaryButton onClick={onSubmit} loading={saving} error={error}>
        Continuar
      </PrimaryButton>
    </Card>
  );
}
