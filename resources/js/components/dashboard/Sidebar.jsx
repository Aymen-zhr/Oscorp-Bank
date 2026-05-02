import { Link, usePage, router } from '@inertiajs/react';
import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import {
    LayoutDashboard,
    Sparkles,
    CreditCard,
    ArrowRightLeft,
    FileText,
    Landmark,
    Receipt,
    Moon,
    Sun,
    Bell,
    Settings,
    LogOut,
    HelpCircle,
    User,
    Cog,
    Package,
    X,
    Target,
    ArrowDownToLine,
    ArrowUpFromLine,
} from 'lucide-react';

const now = new Date();
const dateStr = now
    .toLocaleDateString('en-GB', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    })
    .toUpperCase()
    .replace(/\s\d{4}/, '');

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Sparkles, label: 'Oscar AI', href: '/ai' },
    { icon: CreditCard, label: 'Accounts', href: '/accounts' },
    { icon: ArrowDownToLine, label: 'Deposit', href: '/deposit' },
    { icon: ArrowUpFromLine, label: 'Withdrawal', href: '/withdrawal' },
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
        const handleToggle = () => setIsOpen((prev) => !prev);
        window.addEventListener('toggleSidebar', handleToggle);
        return () => window.removeEventListener('toggleSidebar', handleToggle);
    }, []);

    const activeItem = useMemo(() => {
        return navItems.findIndex((item) =>
            item.href === '#' ? false : currentUrl.includes(item.href),
        );
    }, [currentUrl]);

    const SidebarContent = () => (
        <div className="relative z-10 flex h-full flex-col">
            {/* Logo */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <div className="flex items-center gap-3">
                    <motion.div
                        whileHover={{
                            rotate: 180,
                            transition: { duration: 0.5 },
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-xl shadow-lg"
                        style={{
                            background:
                                'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                            boxShadow: '0 4px 20px rgba(212,175,55,0.4)',
                        }}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 16 16"
                            fill="none"
                        >
                            <rect
                                x="1"
                                y="1"
                                width="6"
                                height="6"
                                rx="1.5"
                                fill="white"
                                fillOpacity="0.95"
                            />
                            <rect
                                x="9"
                                y="1"
                                width="6"
                                height="6"
                                rx="1.5"
                                fill="white"
                                fillOpacity="0.95"
                            />
                            <rect
                                x="1"
                                y="9"
                                width="6"
                                height="6"
                                rx="1.5"
                                fill="white"
                                fillOpacity="0.95"
                            />
                            <rect
                                x="9"
                                y="9"
                                width="6"
                                height="6"
                                rx="1.5"
                                fill="white"
                                fillOpacity="0.5"
                            />
                        </svg>
                    </motion.div>
                    <div>
                        <span className="text-[18px] font-bold tracking-wide text-[var(--color-text-main)]">
                            OSCORP
                        </span>
                        <div className="text-[9px] font-semibold tracking-[0.2em] text-[var(--color-gold)] uppercase">
                            Private Bank
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg p-2 transition-colors hover:bg-white/5 md:hidden"
                >
                    <X className="h-5 w-5 text-[var(--color-text-muted)]" />
                </button>
            </div>

            {/* User Card */}
            <div
                className="mx-4 mb-4 rounded-2xl p-4 backdrop-blur-sm"
                style={{
                    background:
                        'linear-gradient(135deg, var(--color-bg-card), var(--color-bg-elevated))',
                    border: '1px solid var(--color-border)',
                }}
            >
                <div className="mb-3 flex items-center justify-between">
                    <div
                        className="h-12 w-12 overflow-hidden rounded-xl ring-2 ring-[var(--color-gold)]/30"
                        style={{ boxShadow: '0 0 20px rgba(212,175,55,0.15)' }}
                    >
                        <img
                            src={
                                user?.avatar?.startsWith('/')
                                    ? user.avatar
                                    : `https://api.dicebear.com/9.x/${user?.avatar || 'adventurer'}/svg?seed=${userName}&backgroundColor=111827`
                            }
                            alt={userName}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Theme Toggle */}
                    <div
                        className="flex items-center rounded-full p-1"
                        style={{
                            background: 'var(--color-bg-base)',
                            border: '1px solid var(--color-border)',
                        }}
                    >
                        <button
                            onClick={toggleTheme}
                            className="rounded-full p-2 transition-all"
                            style={
                                isDark
                                    ? {
                                          background: 'var(--color-gold-bg)',
                                          color: 'var(--color-gold)',
                                      }
                                    : {}
                            }
                        >
                            <Moon className="h-4 w-4" />
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="rounded-full p-2 transition-all"
                            style={
                                !isDark
                                    ? {
                                          background: 'var(--color-gold-bg)',
                                          color: 'var(--color-gold)',
                                      }
                                    : {}
                            }
                        >
                            <Sun className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="mb-1 text-[10px] font-semibold tracking-[2px] text-[var(--color-text-muted)] uppercase">
                    {dateStr}
                </div>
                <div className="text-[16px] leading-tight font-bold text-[var(--color-text-main)]">
                    Welcome back,
                    <br />
                    <span style={{ color: 'var(--color-gold)' }}>
                        {userName}
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto px-3">
                <div className="mb-2 px-3 text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)] uppercase">
                    Menu
                </div>
                {navItems.map((item, index) => {
                    const isActive = index === activeItem;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all ${
                                isActive
                                    ? 'text-[var(--color-text-main)]'
                                    : 'text-[var(--color-text-muted)] hover:translate-x-1 hover:text-[var(--color-text-main)]'
                            }`}
                            style={
                                isActive
                                    ? {
                                          background: 'var(--color-gold-bg)',
                                          color: 'var(--color-gold)',
                                      }
                                    : {}
                            }
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute left-0 h-6 w-1 rounded-r-full"
                                    style={{ background: 'var(--color-gold)' }}
                                />
                            )}
                            <item.icon
                                className={`h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? 'text-[var(--color-gold)]' : ''}`}
                            />
                            {item.label}
                        </Link>
                    );
                })}

                <div className="mt-6 mb-2 px-3 text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)] uppercase">
                    Support
                </div>
                {bottomItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-[var(--color-text-muted)] transition-all hover:translate-x-1 hover:text-[var(--color-text-main)]"
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                ))}

                <button
                    onClick={() => {
                        setIsOpen(false);
                        router.post('/logout');
                    }}
                    className="mt-auto flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-red-400 transition-all hover:translate-x-1 hover:bg-red-500/10"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </nav>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className="relative hidden h-full w-[280px] min-w-[280px] flex-col border-r md:flex"
                style={{
                    background: 'var(--color-bg-base)',
                    borderColor: 'var(--color-border)',
                }}
            >
                {/* Gradient Background */}
                <div className="pointer-events-none absolute inset-0">
                    <div
                        className="absolute top-0 left-0 h-[400px] w-full opacity-[0.03]"
                        style={{
                            background:
                                'radial-gradient(ellipse at 20% 0%, var(--color-gold), transparent 60%)',
                        }}
                    />
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
                            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm md:hidden"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{
                                type: 'spring',
                                damping: 25,
                                stiffness: 200,
                            }}
                            className="fixed inset-y-0 left-0 z-[101] flex w-[280px] flex-col md:hidden"
                            style={{
                                background: 'var(--color-bg-base)',
                                borderRight: '1px solid var(--color-border)',
                            }}
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
