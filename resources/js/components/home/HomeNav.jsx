import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Menu, X, ArrowRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
];

function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function HomeNav({ canRegister }) {
    const { isDark, toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [active, setActive] = useState('home');

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 60);
            const sections = ['home', 'features', 'about', 'stats', 'contact'];
            for (const id of sections.reverse()) {
                const el = document.getElementById(id);
                if (el && window.scrollY >= el.offsetTop - 120) { setActive(id); break; }
            }
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <motion.header
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            style={scrolled
                ? { background: 'var(--color-bg-base)', borderBottom: '1px solid var(--color-border)' }
                : { background: 'transparent', borderBottom: '1px solid transparent' }}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 lg:py-5">
                <button
                    onClick={() => scrollTo('home')}
                    className="flex items-center gap-3 group"
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex h-10 w-10 items-center justify-center rounded-xl shadow-lg cursor-pointer relative group overflow-hidden"
                        style={{
                            background: 'var(--color-bg-elevated)',
                            border: '1px solid var(--color-border)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M50 10L15 32V68L50 90L85 68V32L50 10Z" stroke="url(#goldGradNav)" strokeWidth="6" strokeLinejoin="round"/>
                            <path d="M50 30L35 39V61L50 70L65 61V39L50 30Z" fill="url(#goldGradNav)" fillOpacity="0.2" stroke="url(#goldGradNav)" strokeWidth="2"/>
                            <defs>
                                <linearGradient id="goldGradNav" x1="15" y1="10" x2="85" y2="90" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#D4AF37"/>
                                    <stop offset="0.5" stopColor="#FFD700"/>
                                    <stop offset="1" stopColor="#B8860B"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </motion.div>
                    <div className="text-left">
                        <div className="font-bold text-[18px] tracking-wide text-[var(--color-text-main)]">OSCORP</div>
                        <div className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[var(--color-gold)]">Private Bank</div>
                    </div>
                </button>

                <nav className="hidden md:flex items-center gap-2">
                    {navLinks.map(l => (
                        <button
                            key={l.label}
                            onClick={() => scrollTo(l.href.slice(1))}
                            className="relative px-5 py-2 text-[12px] font-bold uppercase tracking-wider overflow-hidden group"
                            style={{ color: active === l.href.slice(1) ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}
                        >
                            <span className="relative z-10 group-hover:text-[var(--color-text-main)] transition-colors">{l.label}</span>
                            {active === l.href.slice(1) && (
                                <motion.div
                                    layoutId="navIndicator"
                                    className="absolute bottom-1 left-5 right-5 h-[2px] bg-[var(--color-text-main)]"
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 transition-colors duration-300 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
                    >
                        <AnimatePresence mode="wait">
                            {isDark ? (
                                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.3 }}>
                                    <Sun className="w-4 h-4" />
                                </motion.div>
                            ) : (
                                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.3 }}>
                                    <Moon className="w-4 h-4" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                    <Link href="/login"
                        className="text-[12px] font-bold uppercase tracking-wider transition-colors duration-300 hover:text-[var(--color-gold)]"
                        style={{ color: 'var(--color-text-main)' }}>
                        Sign In
                    </Link>
                    {canRegister && (
                        <Link href="/register"
                            className="px-6 py-2.5 rounded-none text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all bg-[var(--color-text-main)] text-[var(--color-bg-base)] hover:bg-[var(--color-gold)] hover:text-black group">
                            <span>Initialize</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>

                <button
                    className="md:hidden p-2 text-[var(--color-text-main)]"
                    onClick={() => setMenuOpen(v => !v)}
                >
                    <AnimatePresence mode="wait">
                        {menuOpen ? (
                            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                                <X className="w-5 h-5" />
                            </motion.div>
                        ) : (
                            <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                                <Menu className="w-5 h-5" />
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
                        className="md:hidden overflow-hidden px-6 pb-6 space-y-2 bg-[var(--color-bg-base)] border-t border-[var(--color-border)]"
                    >
                        {navLinks.map((l, i) => (
                            <button
                                key={l.label}
                                onClick={() => { scrollTo(l.href.slice(1)); setMenuOpen(false); }}
                                className="block w-full text-left px-4 py-4 text-[12px] font-bold uppercase tracking-wider border-b border-[var(--color-border)]"
                                style={{ color: 'var(--color-text-main)' }}
                            >
                                {l.label}
                            </button>
                        ))}
                        <div className="flex flex-col gap-3 pt-6">
                            <Link href="/login" className="w-full text-center py-4 text-[12px] font-bold uppercase tracking-wider border border-[var(--color-border)]"
                                style={{ color: 'var(--color-text-main)' }}>Sign In</Link>
                            {canRegister && (
                                <Link href="/register" className="w-full text-center py-4 text-[12px] font-bold uppercase tracking-wider bg-[var(--color-text-main)] text-[var(--color-bg-base)]">
                                    Initialize Account
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
