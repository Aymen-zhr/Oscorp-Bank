import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Menu, X, ArrowRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from '@/hooks/useTranslation';

function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function HomeNav({ canRegister }) {
    const { isDark, toggleTheme } = useTheme();
    const { t } = useTranslation();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [active, setActive] = useState('home');

    const navLinks = [
        { label: t('home.nav.home'), href: '#home' },
        { label: t('home.nav.features'), href: '#features' },
        { label: t('home.nav.about'), href: '#about' },
        { label: t('home.nav.contact'), href: '#contact' },
    ];

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 60);
            const sections = ['home', 'features', 'about', 'stats', 'contact'];
            for (const id of sections.reverse()) {
                const el = document.getElementById(id);
                if (el && window.scrollY >= el.offsetTop - 120) {
                    setActive(id);
                    break;
                }
            }
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <motion.header
            className="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
            style={
                scrolled
                    ? {
                          background: 'var(--color-bg-base)',
                          borderBottom: '1px solid var(--color-border)',
                      }
                    : {
                          background: 'transparent',
                          borderBottom: '1px solid transparent',
                      }
            }
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:py-5">
                <button
                    onClick={() => scrollTo('home')}
                    className="group flex items-center gap-3"
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-xl shadow-lg"
                        style={{
                            background: 'var(--color-bg-elevated)',
                            border: '1px solid var(--color-border)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)]/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 100 100"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M50 10L15 32V68L50 90L85 68V32L50 10Z"
                                stroke="url(#goldGradNav)"
                                strokeWidth="6"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M50 30L35 39V61L50 70L65 61V39L50 30Z"
                                fill="url(#goldGradNav)"
                                fillOpacity="0.2"
                                stroke="url(#goldGradNav)"
                                strokeWidth="2"
                            />
                            <defs>
                                <linearGradient
                                    id="goldGradNav"
                                    x1="15"
                                    y1="10"
                                    x2="85"
                                    y2="90"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor="#D4AF37" />
                                    <stop offset="0.5" stopColor="#FFD700" />
                                    <stop offset="1" stopColor="#B8860B" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </motion.div>
                    <div className="text-left">
                        <div className="text-[18px] font-bold tracking-wide text-[var(--color-text-main)]">
                            {t('home.brand')}
                        </div>
                        <div className="text-[9px] font-semibold tracking-[0.2em] text-[var(--color-gold)] uppercase">
                            {t('home.brand_subtitle')}
                        </div>
                    </div>
                </button>

                <nav className="hidden items-center gap-2 md:flex">
                    {navLinks.map((l) => (
                        <button
                            key={l.label}
                            onClick={() => scrollTo(l.href.slice(1))}
                            className="group relative overflow-hidden px-5 py-2 text-[12px] font-bold tracking-wider uppercase"
                            style={{
                                color:
                                    active === l.href.slice(1)
                                        ? 'var(--color-text-main)'
                                        : 'var(--color-text-muted)',
                            }}
                        >
                            <span className="relative z-10 transition-colors group-hover:text-[var(--color-text-main)]">
                                {l.label}
                            </span>
                            {active === l.href.slice(1) && (
                                <motion.div
                                    layoutId="navIndicator"
                                    className="absolute right-5 bottom-1 left-5 h-[2px] bg-[var(--color-text-main)]"
                                    transition={{
                                        type: 'spring',
                                        stiffness: 500,
                                        damping: 30,
                                    }}
                                />
                            )}
                        </button>
                    ))}
                </nav>

                <div className="hidden items-center gap-4 md:flex">
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-[var(--color-text-muted)] transition-colors duration-300 hover:text-[var(--color-text-main)]"
                    >
                        <AnimatePresence mode="wait">
                            {isDark ? (
                                <motion.div
                                    key="sun"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{
                                        duration: 0.25,
                                        type: 'spring',
                                        stiffness: 300,
                                    }}
                                >
                                    <Sun className="h-4 w-4" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="moon"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{
                                        duration: 0.25,
                                        type: 'spring',
                                        stiffness: 300,
                                    }}
                                >
                                    <Moon className="h-4 w-4" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                    <Link
                        href="/login"
                        className="text-[12px] font-bold tracking-wider uppercase transition-colors duration-300 hover:text-[var(--color-gold)]"
                        style={{ color: 'var(--color-text-main)' }}
                    >
                        {t('home.sign_in')}
                    </Link>
                    {canRegister && (
                        <Link
                            href="/register"
                            className="group flex items-center gap-2 rounded-none bg-[var(--color-text-main)] px-6 py-2.5 text-[11px] font-bold tracking-wider text-[var(--color-bg-base)] uppercase transition-all hover:bg-[var(--color-gold)] hover:text-[var(--color-gold-fg)]"
                        >
                            <span>{t('home.initialize')}</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    )}
                </div>

                <button
                    className="p-2 text-[var(--color-text-main)] md:hidden"
                    onClick={() => setMenuOpen((v) => !v)}
                >
                    <AnimatePresence mode="wait">
                        {menuOpen ? (
                            <motion.div
                                key="x"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{
                                    duration: 0.2,
                                    type: 'spring',
                                    stiffness: 400,
                                }}
                            >
                                <X className="h-5 w-5" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{
                                    duration: 0.2,
                                    type: 'spring',
                                    stiffness: 400,
                                }}
                            >
                                <Menu className="h-5 w-5" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2 overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-bg-base)] px-6 pb-6 md:hidden"
                    >
                        {navLinks.map((l, i) => (
                            <button
                                key={l.label}
                                onClick={() => {
                                    scrollTo(l.href.slice(1));
                                    setMenuOpen(false);
                                }}
                                className="block w-full border-b border-[var(--color-border)] px-4 py-4 text-left text-[12px] font-bold tracking-wider uppercase"
                                style={{ color: 'var(--color-text-main)' }}
                            >
                                {l.label}
                            </button>
                        ))}
                        <div className="flex flex-col gap-3 pt-6">
                            <Link
                                href="/login"
                                className="w-full border border-[var(--color-border)] py-4 text-center text-[12px] font-bold tracking-wider uppercase"
                                style={{ color: 'var(--color-text-main)' }}
                            >
                                {t('home.sign_in')}
                            </Link>
                            {canRegister && (
                                <Link
                                    href="/register"
                                    className="w-full bg-[var(--color-text-main)] py-4 text-center text-[12px] font-bold tracking-wider text-[var(--color-bg-base)] uppercase"
                                >
                                    {t('home.initialize_account')}
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
