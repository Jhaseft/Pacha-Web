'use client';

import { AnfitrioneProfileDetail } from '@/lib/hostessService';
import { getAnfitrioneProfileSocialLinks } from '@/lib/socialNetworkService';
import { SocialLink } from '@/types/socialNetwork';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ProfileHeaderProps {
    profile: AnfitrioneProfileDetail;
}

export default function SocialNetwork({ profile }: ProfileHeaderProps) {
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [loadingSocial, setLoadingSocial] = useState(true);

    useEffect(() => {
        const fetchSocialLinks = async () => {
            try {
                const links = await getAnfitrioneProfileSocialLinks(profile.id);
                setSocialLinks(links);
            } catch (error) {
                console.error('Error loading social links:', error);
            } finally {
                setLoadingSocial(false);
            }
        };

        fetchSocialLinks();
    }, [profile.id]);

    if (loadingSocial) {
        return <div className="flex justify-center items-center py-12">
            <div className="text-white/50">Cargando redes sociales...</div>
        </div>;
    }

    if (socialLinks.length === 0) {
        return null;
    }

    return (
        <div>
            <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Sígueme en mis <span className="text-secondary">redes</span>
                    <span className="ml-1">💜</span>
                </h2>
                <p className="text-white/60 mt-1 text-sm">Conéctate conmigo en todas mis plataformas</p>
            </div>

            <div className="flex flex-wrap justify-center gap-5 sm:gap-7">
                {socialLinks.map((link) => (
                    <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col items-center gap-2.5 w-20"
                    >
                        <div className="rounded-full p-[2.5px] bg-linear-to-br from-secondary/50 to-purple/50 group-hover:from-secondary group-hover:to-purple transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-secondary/40">
                            <div className="w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-full bg-surface-card flex items-center justify-center overflow-hidden">
                                <Image
                                    src={link.socialNetwork.icon}
                                    alt={link.socialNetwork.name}
                                    width={40}
                                    height={40}
                                    className="w-9 h-9 sm:w-10 sm:h-10 object-contain group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                        </div>

                        <p className="text-xs sm:text-sm font-semibold text-white/80 group-hover:text-secondary transition-colors text-center">
                            {link.socialNetwork.name}
                        </p>
                    </a>
                ))}
            </div>
        </div>
    );
}
