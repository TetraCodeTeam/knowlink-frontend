import { useEffect, useState } from "react";
import AboutFrankieDialog from "@/modules/landing/components/AboutFrankieDialog";
import CommunitySection from "@/modules/landing/components/CommunitySection";
import DualRoleSection from "@/modules/landing/components/DualRoleSection";
import ExplainSection from "@/modules/landing/components/ExplainSection";
import FeaturesSection from "@/modules/landing/components/FeaturesSection";
import FinalCta from "@/modules/landing/components/FinalCta";
import GuestGateProvider from "@/modules/landing/components/GuestGateProvider";
import HeroSection from "@/modules/landing/components/HeroSection";
import HowItWorksSection from "@/modules/landing/components/HowItWorksSection";
import LandingNav from "@/modules/landing/components/LandingNav";
import { useHeroReveal } from "@/modules/landing/hooks/useHeroReveal";
import styles from "@/modules/landing/styles/sections.module.css";
import "@/modules/landing/styles/landing-tokens.css";

const PAGE_TITLE = "KnowLink — Tutorías que conectan";

/** Página pública de presentación de KnowLink. Quien ya inició sesión es redirigido a su panel. */
export default function LandingPage() {
  const reveal = useHeroReveal();
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    const previous = document.title;
    document.title = PAGE_TITLE;
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <GuestGateProvider>
      <div className={styles.landing}>
        <LandingNav revealed={reveal.revealed} />
        <HeroSection reveal={reveal} onOpenAbout={() => setAboutOpen(true)} />
        <main>
          <DualRoleSection />
          <HowItWorksSection />
          <FeaturesSection />
          <CommunitySection />
          <ExplainSection />
        </main>
        <FinalCta />
      </div>
      <AboutFrankieDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </GuestGateProvider>
  );
}
