'use client'

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { hasInternalHistory } from '@/lib/navHistory';

export default function BackButton() {
    const router = useRouter();

    const handleBack = () => {
        // Si el usuario llegó navegando dentro de la app (p. ej. "Ver mi perfil"
        // desde su panel), volvemos a la pantalla anterior. Si entró directo por
        // el link (o desde una pestaña nueva del navegador), no hay a dónde
        // volver dentro del sitio, así que lo llevamos al inicio. No usamos
        // document.referrer porque no se actualiza en la navegación SPA de Next.
        if (hasInternalHistory()) {
            router.back();
        } else {
            router.push('/');
        }
    };

    return (
        <button
            onClick={handleBack}
            className="fixed top-4 left-4 z-20 bg-black/50 hover:bg-black/70 p-2.5 rounded-full transition backdrop-blur-sm"
        >
            <ArrowLeft size={20} className="text-white" />
        </button>
    );
}