import { Link, usePage, router } from '@inertiajs/react';
import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import {
    LayoutDashboard, Sparkles, CreditCard, ArrowRightLeft,
    FileText, Landmark, Receipt, Moon, Sun,
    Bell, Settings, LogOut, HelpCircle, User, Cog, Package, X, Target
} from 'lucide-react';

const now = new Date();
const dateStr = now.toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric' })
    .toUpperCase()
    .replace(/\s\d{4}/, '');

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Sparkles, label: 'Oscar AI', href: '/ai' },
    { icon: CreditCard, label: 'Accounts', href: '/accounts' },
    { icon: ArrowRightLeft, label: 'Transactions', href: '/transactions' },
    { icon: FileText, label: 'Reports', href: '/reports' },
    { icon: Landmark, label: 'Loans', href: '/loans' },
    { icon: Target, label: 'Goals', href: '/goals' },
    { icon: Receipt, label: 'Taxes', href: '/taxes' },
    { icon: Package, label: 'Subscriptions', href: '/subscriptions' },
];

const bottomItems = [
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: HelpCircle, label: 'Help & Support', href: '#' },
];

export default function Sidebar() {
    const { props } = usePage();
    const user = props.auth?.user;
    const userName = user?.name?.split(' ')[0] ?? 'Guest';
    const { isDark, toggleTheme } = useTheme();
    const currentUrl = props.url || '';
    
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleToggle = () => setIsOpen(prev => !prev);
        window.addEventListener('toggleSidebar', handleToggle);
        return () => window.removeEventListener('toggleSidebar', handleToggle);
    }, []);

    const activeItem = useMemo(() => {
        return navItems.findIndex(item => item.href === '#' ? false : currentUrl.includes(item.href));
    }, [currentUrl]);

    const SidebarContent = () => (
        <div className="relative z-10 flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <div className="flex items-center gap-3">
                    <motion.div 
                        whileHover={{ rotate: 180, transition: { duration: 0.5 } }}
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                        style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', boxShadow: '0 4px 20px rgba(212,175,55,0.4)' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                            <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.95"/>
                            <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.95"/>
                            <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.95"/>
                            <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.5"/>
                        </svg>
                    </motion.div>
                    <div>
                        <span className="font-bold text-[18px] tracking-wide text-[var(--color-text-main)]">OSCORP</span>
                        <div className="text-[9px] text-[var(--color-gold)] uppercase tracking-[0.2em] font-semibold">Private Bank</div>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <X className="w-5 h-5 text-[var(--color-text-muted)]" />
                </button>
            </div>

            {/* User Card */}
            <div className="mx-4 mb-4 rounded-2xl p-4 backdrop-blur-sm" style={{ background: 'linear-gradient(135deg, var(--color-bg-card), var(--color-bg-elevated))', border: '1px solid var(--color-border)' }}>
                <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-[var(--color-gold)]/30" style={{ boxShadow: '0 0 20px rgba(212,175,55,0.15)' }}>
                        <img 
                            src={user?.avatar?.startsWith('/') ? user.avatar : `https://api.dicebear.com/9.x/${user?.avatar || 'adventurer'}/svg?seed=${userName}&backgroundColor=111827`} 
                            alt={userName} 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    
                    {/* Theme Toggle */}
                    <div className="flex items-center rounded-full p-1" style={{ background: 'var(--color-bg-base)', border: '1px solid var(--color-border)' }}>
                        <button onClick={toggleTheme} className="p-2 rounded-full transition-all" style={isDark ? { background: 'var(--color-gold-bg)', color: 'var(--color-gold)' } : {}}>
                            <Moon className="w-4 h-4" />
                        </button>
                        <button onClick={toggleTheme} className="p-2 rounded-full transition-all" style={!isDark ? { background: 'var(--color-gold-bg)', color: 'var(--color-gold)' } : {}}>
                            <Sun className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-[2px] font-semibold mb-1">{dateStr}</div>
                <div className="text-[16px] font-bold text-[var(--color-text-main)] leading-tight">
                    Welcome back,<br /><span style={{ color: 'var(--color-gold)' }}>{userName}</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider font-semibold px-3 mb-2">Menu</div>
                {navItems.map((item, index) => {
                    const isActive = index === activeItem;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all relative ${
                                isActive ? 'text-[var(--color-text-main)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:translate-x-1'
                            }`}
                            style={isActive ? { background: 'var(--color-gold-bg)', color: 'var(--color-gold)' } : {}}
                        >
                            {isActive && (
                                <motion.div 
                                    layoutId="activeIndicator"
                                    className="absolute left-0 w-1 h-6 rounded-r-full"
                                    style={{ background: 'var(--color-gold)' }}
                                />
                            )}
                            <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-[var(--color-gold)]' : ''}`} />
                            {item.label}
                        </Link>
                    );
                })}

                <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider font-semibold px-3 mb-2 mt-6">Support</div>
                {bottomItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-all hover:translate-x-1"
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </Link>
                ))}

                <button
                    onClick={() => {
                        setIsOpen(false);
                        router.post('/logout');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-red-400 hover:bg-red-500/10 transition-all hover:translate-x-1 mt-auto"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </nav>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-[280px] min-w-[280px] flex-col h-full relative border-r" style={{ background: 'var(--color-bg-base)', borderColor: 'var(--color-border)' }}>
                {/* Gradient Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-[400px] opacity-[0.03]" style={{ background: 'radial-gradient(ellipse at 20% 0%, var(--color-gold), transparent 60%)' }} />
                </div>
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
                        />
                        <motion.aside 
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[280px] z-[101] md:hidden flex flex-col"
                            style={{ background: 'var(--color-bg-base)', borderRight: '1px solid var(--color-border)' }}
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}