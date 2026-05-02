import { Link } from '@inertiajs/react';

const links = {
    Platform: [
        { label: 'Dashboard',    href: '/dashboard' },
        { label: 'Accounts',     href: '/accounts' },
        { label: 'Transactions', href: '/transactions' },
        { label: 'Oscar AI',     href: '/ai' },
        { label: 'Reports',      href: '/reports' },
    ],
    Company: [
        { label: 'About',   href: '#about' },
        { label: 'Contact', href: '#contact' },
        { label: 'Careers', href: '#' },
        { label: 'Press',   href: '#' },
    ],
    Legal: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Use',   href: '#' },
        { label: 'Security',       href: '#' },
        { label: 'Compliance',     href: '#' },
    ],
};

export default function HomeFooter() {
    return (
        <footer className="pt-16 pb-8 px-6" style={{ borderTop: '1px solid var(--color-border)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', boxShadow: '0 4px 20px rgba(212,175,55,0.35)' }}>
                                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                                    <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.95"/>
                                    <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.95"/>
                                    <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.95"/>
                                    <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.5"/>
                                </svg>
                            </div>
                            <div>
                                <div className="font-bold text-[15px] tracking-wide text-[var(--color-text-main)]">OSCORP</div>
                                <div className="text-[8px] uppercase tracking-[0.2em] font-semibold" style={{ color: 'var(--color-gold)' }}>Private Bank</div>
                            </div>
                        </div>
                        <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed mb-5">
                            Elite private banking powered by artificial intelligence. Designed for those who demand the extraordinary.
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-text-muted)]">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                            All systems operational
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(links).map(([group, items]) => (
                        <div key={group}>
                            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-5">{group}</div>
                            <ul className="space-y-3">
                                {items.map(item => (
                                    <li key={item.label}>
                                        <a href={item.href}
                                            className="text-[13px] text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors">
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
                    style={{ borderTop: '1px solid var(--color-border)' }}>
                    <div className="text-[12px] text-[var(--color-text-muted)]">
                        © 2026 OSCORP Private Bank. All rights reserved.
                    </div>
                    <div className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-[1.5px]">
                        O.S.C.O.R.P. Security Infrastructure v4.2
                    </div>
                </div>
            </div>
        </footer>
    );
}
