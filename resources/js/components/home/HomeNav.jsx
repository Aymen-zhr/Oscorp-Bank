import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Menu, X, ArrowRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const navLinks = [
    { label: 'Home',    href: '#home' },
    { label: 'Features',href: '#features' },
    { label: 'About',   href: '#about' },
    { label: 'Contact', href: '#contact' },
];

function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function HomeNav({ canRegister }) {
    const { isDark, toggleTheme } = useTheme();
    const [scrolled, setScrolled]   = useState(false);
    const [menuOpen, setMenuOpen]   = useState(false);
    const [active, setActive]       = useState('home');

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 60);
            const sections = ['home','features','about','stats','contact'];
            for (const id of sections.reverse()) {
                const el = document.getElementById(id);
                if (el && window.scrollY >= el.offsetTop - 120) { setActive(id); break; }
            }
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const navStyle = scrolled
        ? { background: 'var(--color-bg-card)', borderBottom: '1px solid var(--color-border)', backdropFilter: 'blur(20px)' }
        : { background: 'transparent', borderBottom: '1px solid transparent' };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300" style={navStyle}>
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                {/* Logo */}
                <button onClick={() => scrollTo('home')} className="flex items-center gap-3">
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
                        <div className="font-bold text-[16px] tracking-wide text-[var(--color-text-main)]">OSCORP</div>
                        <div className="text-[8px] uppercase tracking-[0.2em] font-semibold" style={{ color: 'var(--color-gold)' }}>Private Bank</div>
                    </div>
                </button>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map(l => (
                        <button key={l.label} onClick={() => scrollTo(l.href.slice(1))}
                            className="px-4 py-2 rounded-xl text-[13px] font-medium transition-all"
                            style={{ color: active === l.href.slice(1) ? 'var(--color-gold)' : 'var(--color-text-muted)' }}>
                            {l.label}
                        </button>
                    ))}
                </nav>

                {/* Right actions */}
                <div className="hidden md:flex items-center gap-3">
                    <button onClick={toggleTheme} className="p-2 rounded-xl transition-all hover:bg-[var(--color-gold-bg)]"
                        style={{ color: 'var(--color-text-muted)' }}>
                        {isDark ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>}
                    </button>
                    <Link href="/login" className="px-4 py-2 rounded-xl text-[13px] font-semibold transition-all"
                        style={{ color: 'var(--color-text-main)', border: '1px solid var(--color-border)' }}>
                        Sign In
                    </Link>
                    {canRegister && (
                        <Link href="/register" className="px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-1.5 transition-all hover:brightness-110"
                            style={{ background: 'var(--color-gold)', color: '#000', boxShadow: '0 4px 15px rgba(212,175,55,0.3)' }}>
                            Open Account <ArrowRight className="w-3.5 h-3.5"/>
                        </Link>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button className="md:hidden p-2 rounded-xl" style={{ color: 'var(--color-text-main)' }}
                    onClick={() => setMenuOpen(v => !v)}>
                    {menuOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
                </button>
            </div>

            {/* Mobile drawer */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="md:hidden px-6 pb-6 space-y-2" style={{ background: 'var(--color-bg-card)', borderTop: '1px solid var(--color-border)' }}>
                        {navLinks.map(l => (
                            <button key={l.label} onClick={() => { scrollTo(l.href.slice(1)); setMenuOpen(false); }}
                                className="block w-full text-left px-4 py-3 rounded-xl text-[14px] font-medium transition-all"
                                style={{ color: 'var(--color-text-main)' }}>
                                {l.label}
                            </button>
                        ))}
                        <div className="flex gap-3 pt-2">
                            <Link href="/login" className="flex-1 text-center py-2.5 rounded-xl text-[13px] font-semibold"
                                style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}>Sign In</Link>
                            {canRegister && (
                                <Link href="/register" className="flex-1 text-center py-2.5 rounded-xl text-[13px] font-bold"
                                    style={{ background: 'var(--color-gold)', color: '#000' }}>Open Account</Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
