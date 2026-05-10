import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Shield,
    Wallet,
    BarChart3,
    ArrowUpRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useCurrency } from '../../hooks/useCurrency';

function FloatingCard() {
    const [isHovered, setIsHovered] = useState(false);
    const { t } = useTranslation();
    const { format, code } = useCurrency();

    const portfolioData = [
        {
            label: t('home.equities'),
            value: 1420000,
            percent: '49.8%',
            color: 'var(--color-gold)',
        },
        {
            label: t('home.real_estate'),
            value: 850000,
            percent: '29.8%',
            color: 'var(--color-champagne)',
        },
        {
            label: t('home.liquid_cash'),
            value: 577392,
            percent: '20.4%',
            color: 'var(--color-text-muted)',
        },
    ];

    const totalDeployed = portfolioData.reduce(
        (sum, item) => sum + item.value,
        0,
    );

    return (
        <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className="relative mx-auto w-full max-w-md"
        >
            {/* Minimalist Glass Card */}
            <div
                className="relative overflow-hidden rounded-3xl p-8 transition-all duration-500"
                style={{
                    background: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: isHovered
                        ? '0 30px 60px -15px rgba(0,0,0,0.5)'
                        : '0 20px 40px -10px rgba(0,0,0,0.3)',
                }}
            >
                {/* Subtle top edge highlight */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold)]/30 to-transparent opacity-50" />

                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
                            <Wallet className="h-4 w-4 text-[var(--color-text-main)]" />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-text-muted)] uppercase">
                                {t('home.global_portfolio')}
                            </div>
                            <div className="text-[13px] font-semibold text-[var(--color-text-main)]">
                                {t('home.private_wealth')}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-base)] px-3 py-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold tracking-wider text-[var(--color-text-main)] uppercase">
                            {t('home.active')}
                        </span>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="mb-2 text-[11px] font-bold tracking-widest text-[var(--color-text-muted)] uppercase">
                        {t('home.total_deployed')}
                    </div>
                    <div className="flex items-baseline gap-2">
                        <AnimatedCounter value={totalDeployed} />
                        <span className="text-[16px] font-medium text-[var(--color-text-muted)]">
                            {code}
                        </span>
                    </div>
                </div>

                {/* Ledger-style mini breakdown */}
                <div className="space-y-3 border-t border-[var(--color-border)] pt-6">
                    {portfolioData.map((item, i) => (
                        <div
                            key={i}
                            className="group flex cursor-default items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-[13px] font-medium text-[var(--color-text-main)] transition-colors group-hover:text-[var(--color-gold)]">
                                    {item.label}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-right">
                                <span className="text-[12px] font-bold text-[var(--color-text-main)]">
                                    {item.value}
                                </span>
                                <span className="w-8 text-[11px] text-[var(--color-text-muted)]">
                                    {item.percent}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

function AnimatedCounter({ value, duration = 2000 }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= end) {
                setDisplay(end);
                clearInterval(timer);
            } else {
                setDisplay(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [value, duration]);

    return (
        <div className="text-[48px] leading-none font-bold tracking-tighter text-[var(--color-text-main)]">
            {display.toLocaleString()}
        </div>
    );
}

export default function HeroSection({ canRegister }) {
    const [hoveredBadge, setHoveredBadge] = useState(null);
    const { code: currencyCode } = useCurrency();
    const { t } = useTranslation();

    const badges = [
        t('home.badges.regulated'),
        t('home.badges.encryption'),
        t('home.badges.liquidity'),
        t('home.badges.ai'),
    ];

    return (
        <section
            id="home"
            className="relative flex min-h-screen items-center overflow-hidden px-6 pt-24 pb-16"
        >
            {/* Extremely subtle background texture */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage:
                        'linear-gradient(var(--color-text-muted) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-muted) 1px, transparent 1px)',
                    backgroundSize: '64px 64px',
                }}
            />

            <div className="relative z-10 mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="max-w-2xl"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.8 }}
                        className="mb-8 inline-flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-2 text-[10px] font-bold tracking-[0.2em] uppercase"
                    >
                        <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
                        <span className="text-[var(--color-text-main)]">
                            {t('home.hero.badge')}
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="mb-6 text-[40px] leading-[1.05] font-semibold tracking-tight text-[var(--color-text-main)] md:mb-8 md:text-[56px] lg:text-[80px]"
                    >
                        {t('home.hero.heading1')}
                        <br />
                        <span className="font-light text-[var(--color-text-muted)] italic">
                            {t('home.hero.heading2')}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="mb-12 max-w-[500px] text-[16px] leading-relaxed font-medium text-[var(--color-text-muted)] lg:text-[18px]"
                    >
                        {t('home.hero.paragraph')}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="mb-16 flex flex-col gap-5 sm:flex-row"
                    >
                        {canRegister && (
                            <Link
                                href="/register"
                                className="group flex items-center justify-center gap-3 rounded-xl bg-[var(--color-text-main)] px-8 py-4 text-[13px] font-bold text-[var(--color-bg-base)] transition-all hover:bg-[var(--color-gold)] hover:text-[var(--color-gold-fg)]"
                            >
                                {t('home.hero.cta_register')}
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        )}
                        <button
                            onClick={() =>
                                document
                                    .getElementById('features')
                                    ?.scrollIntoView({ behavior: 'smooth' })
                            }
                            className="flex items-center justify-center gap-3 rounded-xl border border-[var(--color-border)] px-8 py-4 text-[13px] font-bold text-[var(--color-text-main)] transition-all hover:bg-[var(--color-bg-elevated)]"
                        >
                            <BarChart3 className="h-4 w-4" />
                            {t('home.hero.cta_specs')}
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 1 }}
                        className="flex flex-wrap gap-x-8 gap-y-4"
                    >
                        {badges.map((b, i) => (
                            <div key={b} className="flex items-center gap-2">
                                <Shield className="h-3.5 w-3.5 text-[var(--color-gold)]" />
                                <span className="text-[11px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase">
                                    {b}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Right Content - Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                    className="relative flex justify-center lg:justify-end"
                >
                    {/* Architectural Grid Lines behind card */}
                    <div
                        className="pointer-events-none absolute inset-0 hidden opacity-20 lg:block"
                        style={{
                            backgroundImage: `
                                linear-gradient(to right, var(--color-border) 1px, transparent 1px),
                                linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)
                            `,
                            backgroundSize: '100px 100px',
                            maskImage:
                                'radial-gradient(circle at center, black, transparent 70%)',
                        }}
                    />

                    <FloatingCard />
                </motion.div>
            </div>
        </section>
    );
}
