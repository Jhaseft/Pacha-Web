'use client'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
    const router = useRouter();

    useEffect(() => {
        sessionStorage.setItem('visitedProfile', 'true');
    }, []);

    const handleBack = () => {
        const wasVisitedBefore = sessionStorage.getItem('visitedProfile');
        if (wasVisitedBefore && window.history.length > 1) {
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