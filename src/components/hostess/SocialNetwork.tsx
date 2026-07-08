'use client';

import { AnfitrioneProfileDetail } from '@/lib/hostessService';
import { getAnfitrioneProfileSocialLinks } from '@/lib/socialNetworkService';
import { SocialLink } from '@/types/socialNetwork';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

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
            <div className="text-gray-400">Cargando redes sociales...</div>
        </div>;
    }

    if (socialLinks.length === 0) {
        return null;
    }

    return (
        <div className="sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-xl font-bold text-white mb-4 mt-6 flex items-center gap-1">
                    <span className="w-1 h-6 bg-linear-to-b from-pink-500 to-purple-500 rounded-full" />
                    Sígueme en mis redes
                </h2>
                
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {socialLinks.map((link) => (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 hover:border-pink-500/50 hover:from-pink-500/10 hover:to-purple-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20"
                        >
                            <div className="relative w-18 h-18 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 group-hover:border-pink-500/60 group-hover:from-pink-500/30 group-hover:to-purple-500/30 transition-all duration-300 group-hover:scale-110">
                                <Image
                                    src={link.socialNetwork.icon}
                                    alt={link.socialNetwork.name}
                                    width={32}
                                    height={32}
                                    className="w-12 h-12 object-contain group-hover:brightness-125 transition-all"
                                />
                                <ExternalLink 
                                    size={12} 
                                    className="absolute -top-1 -right-1 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity bg-black rounded-full p-0.5" 
                                />
                            </div>
                            
                            <div className="text-center">
                                <p className="text-sm font-semibold text-white group-hover:text-pink-400 transition-colors">
                                    {link.socialNetwork.name}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
