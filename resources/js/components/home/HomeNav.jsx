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
                    <div className="w-8 h-8 flex items-center justify-center bg-[var(--color-text-main)] transition-transform duration-500 group-hover:rotate-180">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <rect x="1" y="1" width="6" height="6" fill="var(--color-bg-base)" />
                            <rect x="9" y="1" width="6" height="6" fill="var(--color-bg-base)" />
                            <rect x="1" y="9" width="6" height="6" fill="var(--color-bg-base)" />
                            <rect x="9" y="9" width="6" height="6" fill="var(--color-bg-base)" fillOpacity="0.5" />
                        </svg>
                    </div>
                    <div className="text-left">
                        <div className="font-bold text-[15px] tracking-widest text-[var(--color-text-main)] uppercase">Oscorp</div>
                        <div className="text-[8px] uppercase tracking-[0.25em] font-semibold text-[var(--color-text-muted)] group-hover:text-[var(--color-gold)] transition-colors duration-500">Private Bank</div>
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
