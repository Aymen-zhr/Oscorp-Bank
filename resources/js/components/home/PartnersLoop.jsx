import { motion } from 'framer-motion';
import { LOGO_KEY, LOGO_BASE_URL, PARTNERS } from '../../constants';

function LogoCard({ partner }) {
    return (
        <div
            className="flex-shrink-0 flex items-center gap-3 px-6 py-3 bg-[var(--color-bg-base)] border border-[var(--color-border)] mx-2"
        >
            <img
                src={`${LOGO_BASE_URL}/${partner.domain}?token=${LOGO_KEY}&size=40&format=png`}
                alt={partner.name}
                className="w-5 h-5 object-contain grayscale opacity-60 mix-blend-luminosity"
                onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="text-[12px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] whitespace-nowrap">
                {partner.name}
            </span>
        </div>
    );
}

export default function PartnersLoop() {
    const doubled = [...PARTNERS, ...PARTNERS];
    return (
        <section className="py-12 overflow-hidden relative border-t border-b border-[var(--color-border)] bg-[var(--color-bg-card)]">
            <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(90deg, var(--color-bg-card), transparent)' }} />
            <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(-90deg, var(--color-bg-card), transparent)' }} />

            <div className="flex" style={{ animation: 'marquee 40s linear infinite' }}>
                {doubled.map((p, i) => <LogoCard key={i} partner={p} />)}
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
