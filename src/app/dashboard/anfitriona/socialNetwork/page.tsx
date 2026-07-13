'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  getAllSocialNetworks,
  getAnfitrioneProfileSocialLinks,
  addSocialLink,
  updateSocialLink,
  deleteSocialLink,
} from '@/lib/socialNetworkService';
import type { SocialNetwork, SocialLink } from '@/types/socialNetwork';
import PageHeader from '@/components/common/PageHeader';
import SocialNetworkForm from '@/components/anfitriona/socialNetwork/SocialNetworkForm';
import SocialNetworkList from '@/components/anfitriona/socialNetwork/SocialNetworkList';

function SocialNetworkContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isHydrated } = useAuth();

  // El perfil enlaza con ?userId=…; si falta, usamos el usuario de la sesión.
  const userId = searchParams.get('userId') || user?.id;

  const [links, setLinks] = useState<SocialLink[]>([]);
  const [networks, setNetworks] = useState<SocialNetwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(null);
  const [url, setUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'ANFITRIONA') {
      router.push('/dashboard');
    }
  }, [isHydrated, isAuthenticated, user?.role, router]);

  const loadData = useCallback(async () => {
    if (!userId) return;
    try {
      const [networksData, linksData] = await Promise.all([
        getAllSocialNetworks(),
        getAnfitrioneProfileSocialLinks(userId),
      ]);
      setNetworks(networksData);
      setLinks(linksData);
    } catch {
      setError('No se pudieron cargar las redes sociales');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const resetForm = () => {
    setSelectedNetworkId(null);
    setUrl('');
    setEditingId(null);
  };

  const handleAddOrUpdate = async () => {
    setError('');
    setSuccess('');

    if (!selectedNetworkId || !url.trim() || !userId) {
      setError('Por favor completa todos los campos');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await updateSocialLink(userId, editingId, { url });
        setSuccess('Red social actualizada');
      } else {
        await addSocialLink(userId, { socialNetworkId: selectedNetworkId, url });
        setSuccess('Red social agregada');
      }
      resetForm();
      await loadData();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar la red social');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!userId) return;
    if (!window.confirm('¿Estás segura de que quieres eliminar esta red social?')) return;

    setError('');
    setSuccess('');
    try {
      await deleteSocialLink(userId, id);
      setLinks((prev) => prev.filter((link) => link.id !== id));
      setSuccess('Red social eliminada');
      await loadData();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo eliminar la red social');
    }
  };

  const handleEdit = (link: SocialLink) => {
    setEditingId(link.id);
    setSelectedNetworkId(link.socialNetworkId);
    setUrl(link.url);
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <div className="w-full max-w-lg mx-auto px-4 sm:px-5 py-6 flex-1 flex flex-col">
        <PageHeader title="Redes Sociales" description="Gestiona tus redes sociales" />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm mb-4">
            {success}
          </div>
        )}

        <SocialNetworkForm
          networks={networks}
          selectedNetworkId={selectedNetworkId}
          url={url}
          editingId={editingId}
          submitting={submitting}
          onNetworkSelect={setSelectedNetworkId}
          onUrlChange={setUrl}
          onSubmit={handleAddOrUpdate}
          onCancel={resetForm}
        />

        <SocialNetworkList
          links={links}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default function SocialNetworkPage() {
  return (
    <Suspense>
      <SocialNetworkContent />
    </Suspense>
  );
}
