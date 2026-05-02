import { Head } from '@inertiajs/react';
import HomeNav from '@/components/home/HomeNav';
import HeroSection from '@/components/home/HeroSection';
import PartnersLoop from '@/components/home/PartnersLoop';
import FeaturesSection from '@/components/home/FeaturesSection';
import AboutSection from '@/components/home/AboutSection';
import StatsSection from '@/components/home/StatsSection';
import ContactSection from '@/components/home/ContactSection';
import HomeFooter from '@/components/home/HomeFooter';

export default function Home({ canRegister }) {
    return (
        <div className="min-h-screen w-full bg-[var(--color-bg-base)] text-[var(--color-text-main)] font-sans antialiased selection:bg-[var(--color-gold)] selection:text-white transition-colors duration-300">
            <Head title="OSCORP | Private Banking Built for the Elite" />
            
            <HomeNav canRegister={canRegister} />
            
            <main>
                <HeroSection canRegister={canRegister} />
                <PartnersLoop />
                <FeaturesSection />
                <AboutSection />
                <StatsSection />
                <ContactSection />
            </main>

            <HomeFooter />
        </div>
    );
}
