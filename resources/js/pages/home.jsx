import { Head } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';
import HomeNav from '@/components/home/HomeNav';
import HeroSection from '@/components/home/HeroSection';
import PartnersLoop from '@/components/home/PartnersLoop';
import FeaturesSection from '@/components/home/FeaturesSection';
import AboutSection from '@/components/home/AboutSection';
import StatsSection from '@/components/home/StatsSection';
import ContactSection from '@/components/home/ContactSection';

export default function Home({ canRegister }) {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen w-full bg-[var(--color-bg-base)] font-sans text-[var(--color-text-main)] antialiased transition-colors duration-300 selection:bg-[var(--color-gold)] selection:text-[var(--color-gold-fg)]">
            <Head
                title={t(
                    'home.page_title',
                    'OSCORP | Private Banking Built for the Elite',
                )}
            />

            <HomeNav canRegister={canRegister} />

            <main>
                <HeroSection canRegister={canRegister} />
                <PartnersLoop />
                <FeaturesSection />
                <AboutSection />
                <StatsSection />
                <ContactSection />
            </main>
        </div>
    );
}
