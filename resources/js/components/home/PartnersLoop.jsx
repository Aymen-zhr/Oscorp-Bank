const LOGO_KEY = 'pk_binMfKfXSiOiYpfo3CyL2w';

const partners = [
    { name: 'Visa',         domain: 'visa.com' },
    { name: 'Mastercard',   domain: 'mastercard.com' },
    { name: 'PayPal',       domain: 'paypal.com' },
    { name: 'Stripe',       domain: 'stripe.com' },
    { name: 'Bloomberg',    domain: 'bloomberg.com' },
    { name: 'HSBC',         domain: 'hsbc.com' },
    { name: 'JPMorgan',     domain: 'jpmorgan.com' },
    { name: 'BlackRock',    domain: 'blackrock.com' },
    { name: 'Goldman Sachs',domain: 'goldmansachs.com' },
    { name: 'Fidelity',     domain: 'fidelity.com' },
    { name: 'AmEx',         domain: 'americanexpress.com' },
    { name: 'Swift',        domain: 'swift.com' },
];

function LogoCard({ partner }) {
    return (
        <div
            className="flex-shrink-0 flex items-center gap-3 px-6 py-3 rounded-2xl mx-3"
            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
        >
            <img
                src={`https://img.logo.dev/${partner.domain}?token=${LOGO_KEY}&size=40&format=png`}
                alt={partner.name}
                className="w-7 h-7 object-contain rounded"
                onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="text-[13px] font-semibold text-[var(--color-text-muted)] whitespace-nowrap">
                {partner.name}
            </span>
        </div>
    );
}

export default function PartnersLoop() {
    const doubled = [...partners, ...partners];
    return (
        <section className="py-16 overflow-hidden relative" style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
            <div className="text-center mb-10">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
                    Trusted by the world's leading institutions
                </p>
            </div>

            {/* Fade masks */}
            <div className="absolute left-0 top-0 h-full w-32 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(90deg, var(--color-bg-base), transparent)' }} />
            <div className="absolute right-0 top-0 h-full w-32 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(-90deg, var(--color-bg-base), transparent)' }} />

            <div className="flex" style={{ animation: 'marquee 30s linear infinite' }}>
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
