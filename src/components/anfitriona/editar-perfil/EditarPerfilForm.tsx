'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader } from 'lucide-react';
import FormField from './FormField';
import ImageUpload from './ImageUpload';
import PageHeader from '@/components/common/PageHeader';
import { useAuth } from '@/context/AuthContext';
import { apiGetMyProfile } from '@/lib/perfil';
import { apiUpdateProfileWithImages } from '@/lib/editar-perfil';
import { MyProfileData } from '@/types/perfil';

export default function EditarPerfilForm() {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | undefined>();
  const [avatarFile, setAvatarFile] = useState<File | undefined>();
  const [coverUri, setCoverUri] = useState<string | undefined>();
  const [coverFile, setCoverFile] = useState<File | undefined>();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await apiGetMyProfile();
      setFirstName(data.firstName ?? '');
      setLastName(data.lastName ?? '');
      setUsername(data.username ?? '');
      setBio(data.bio ?? '');
      setAvatarUri(data.avatarUrl ?? undefined);
      setCoverUri(data.coverUrl ?? undefined);
    } catch (error) {
      alert('Error al cargar el perfil');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      alert('El nombre de usuario es obligatorio');
      return;
    }

    setSaving(true);
    try {
      await apiUpdateProfileWithImages({
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        username: username.trim(),
        bio: bio.trim(),
        avatarFile,
        coverFile,
      });

      alert('¡Perfil actualizado correctamente!');
      router.back();
    } catch (error: any) {
      alert(error?.message || 'Error al guardar el perfil');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin">
          <Loader className="w-8 h-8 text-brand" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-purple-200/30 py-4 md:hidden">
        <div className="max-w-lg mx-auto px-5 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-purple-100/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-blue-600" />
          </button>
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Editar perfil
          </h1>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block w-full max-w-lg mx-auto px-5 pt-6 pb-2">
        <PageHeader
          title="Editar perfil"
          description="Actualiza tu información personal"
        />
      </div>

      {/* Cover Image */}
      <div className="w-full max-w-lg mx-auto px-5 pt-2 pb-6">
        <ImageUpload
          label="Foto de portada"
          currentImage={coverUri}
          onImageSelect={setCoverFile}
          aspectRatio="banner"
          hint="Toca para cambiar el banner (16:9)"
        />
      </div>

      {/* Avatar */}
      <div className="w-full max-w-lg mx-auto px-5 flex justify-center mb-8">
        <ImageUpload
          label="Foto de perfil"
          currentImage={avatarUri}
          onImageSelect={setAvatarFile}
          aspectRatio="square"
          hint="Toca para cambiar foto de perfil"
        />
      </div>

      {/* Form Fields */}
      <div className="w-full max-w-lg mx-auto px-5 py-6 flex-1 flex flex-col">
        <div className="space-y-4">
          <FormField
            label="Nombre"
            value={firstName}
            onChange={setFirstName}
            placeholder="Tu nombre"
          />

          <FormField
            label="Apellido"
            value={lastName}
            onChange={setLastName}
            placeholder="Tu apellido"
          />

          <FormField
            label={`Nombre de usuario${!username.trim() ? '  ⚠️ Obligatorio' : ''}`}
            value={username}
            onChange={setUsername}
            placeholder="Ej: maria_g (requerido)"
            highlight={!username.trim()}
          />

          <FormField
            label="Descripción (bio)"
            value={bio}
            onChange={setBio}
            placeholder="Cuéntale algo a tus clientes..."
            multiline
            rows={4}
          />

          {/* Email - Read Only */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <label className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Correo electrónico
              </label>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl border border-blue-600/30 bg-gradient-to-r from-blue-600/5 to-purple-600/5 shadow-sm">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-ink/70 flex-1">{user?.email ?? '—'}</span>
            </div>
            <p className="text-xs text-ink/40 mt-2">
              No es posible cambiar el correo desde aquí.
            </p>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 rounded-xl border-l-4 border-purple-600 bg-gradient-to-r from-purple-600/10 to-pink-600/10 shadow-sm">
            <p className="text-xs text-ink/70 leading-relaxed">
              <span className="font-bold text-purple-600">ℹ️</span> El número de teléfono, cédula y fecha de nacimiento no son editables. Contacta al administrador para cambios de identidad.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button - Bottom */}
      <div className="w-full max-w-lg mx-auto px-5 py-6 flex justify-center">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving && <Loader className="w-4 h-4 animate-spin" />}
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
