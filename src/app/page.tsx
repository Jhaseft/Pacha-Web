import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { WhatIsSection } from "@/components/landing/WhatIsSection";
import { MissionSection } from "@/components/landing/MissionSection";
import { VisionSection } from "@/components/landing/VisionSection";
import { HowToRegisterSection } from "@/components/landing/HowToRegisterSection";
import { VideoSection } from "@/components/landing/VideoSection";
import { LandingContactSection } from "@/components/LandingContactSection";
import { LandingFooter } from "@/components/LandingFooter";
import { AppDownloadButton } from "@/components/AppDownloadButton";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink overflow-x-hidden pb-24 md:pb-0">
      <Navbar />

      {/* Orden del mockup: hero → qué es → misión → visión */}
      <HeroSection />
      <WhatIsSection />
      <MissionSection />
      <VisionSection />

      {/* Empujados abajo: registro, video y contacto */}
      <HowToRegisterSection />
      <VideoSection />
      <LandingContactSection />

      <LandingFooter />
      <AppDownloadButton />
    </div>
  );
}
