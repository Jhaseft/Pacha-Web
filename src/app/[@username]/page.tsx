'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CatchAllPageProps {
  params: Promise<{ username: string }>;
}

export default function CatchAllPage({ params }: CatchAllPageProps) {
  const router = useRouter();

  useEffect(() => {
    params.then((p) => {
      // El parámetro viene como "@usuario", necesitamos remover el @
      const username = p.username.startsWith('@') ? p.username.slice(1) : p.username;
      router.replace(`/anfitrionas/${username}`);
    });
  }, [params, router]);

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center">
      <p className="text-ink-faint">Cargando perfil...</p>
    </div>
  );
}
