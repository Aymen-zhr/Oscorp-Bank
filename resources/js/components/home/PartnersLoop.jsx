import { motion } from 'framer-motion';
import { LOGO_KEY, LOGO_BASE_URL, PARTNERS } from '../../constants';

function LogoCard({ partner }) {
    return (
        <div className="mx-2 flex flex-shrink-0 items-center gap-3 border border-[var(--color-border)] bg-[var(--color-bg-base)] px-6 py-3">
            <img
                src={`${LOGO_BASE_URL}/${partner.domain}?token=${LOGO_KEY}&size=40&format=png`}
                alt={partner.name}
                className="h-5 w-5 object-contain opacity-60 mix-blend-luminosity grayscale"
                onError={(e) => {
                    e.target.style.display = 'none';
                }}
            />
            <span className="text-[12px] font-bold tracking-wider whitespace-nowrap text-[var(--color-text-muted)] uppercase">
                {partner.name}
            </span>
        </div>
    );
}

export default function PartnersLoop() {
    const doubled = [...PARTNERS, ...PARTNERS];
    return (
        <section className="relative overflow-hidden border-t border-b border-[var(--color-border)] bg-[var(--color-bg-card)] py-12">
            <div
                className="pointer-events-none absolute top-0 left-0 z-10 h-full w-24"
                style={{
                    background:
                        'linear-gradient(90deg, var(--color-bg-card), transparent)',
                }}
            />
            <div
                className="pointer-events-none absolute top-0 right-0 z-10 h-full w-24"
                style={{
                    background:
                        'linear-gradient(-90deg, var(--color-bg-card), transparent)',
                }}
            />

            <div
                className="flex"
                style={{ animation: 'marquee 40s linear infinite' }}
            >
                {doubled.map((p, i) => (
                    <LogoCard key={i} partner={p} />
                ))}
            </div>

            <style>{`
                @keyframes marquee {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </section>
    );
}
