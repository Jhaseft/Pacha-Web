'use client'

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
    const router = useRouter();

    const handleBack = () => {
        // Solo volvemos atrás si la pantalla anterior era de nuestro propio
        // sitio. Si el link se abrió pegándolo (referrer externo o vacío, p. ej.
        // la "nueva pestaña" del navegador), `history.length` igual es > 1, así
        // que esa comprobación sacaría al usuario fuera de la app. Con el
        // referrer distinguimos navegación interna de una llegada directa.
        let cameFromOurSite = false;
        try {
            cameFromOurSite =
                !!document.referrer &&
                new URL(document.referrer).origin === window.location.origin;
        } catch {
            cameFromOurSite = false;
        }

        if (cameFromOurSite) {
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