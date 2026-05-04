import { Link, usePage, router } from '@inertiajs/react';
import { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserAvatar from './UserAvatar';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';
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
    PieChart,
    Users,
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
    { icon: LayoutDashboard, label: 'common.dashboard', href: '/dashboard' },
    { icon: Sparkles, label: 'sidebar.oscar_ai', href: '/ai' },
    { icon: User, label: 'common.account', href: '/account' },
    { icon: CreditCard, label: 'sidebar.card_info', href: '/cards' },
    { icon: ArrowDownToLine, label: 'receive', href: '/receive' },
    { icon: ArrowUpFromLine, label: 'send', href: '/send' },
    { icon: ArrowRightLeft, label: 'common.transfer', href: '/transfer' },
    { icon: Users, label: 'common.split_bills', href: '/split-bills' },
    { icon: Users, label: 'common.contacts', href: '/contacts' },
    { icon: FileText, label: 'common.transactions', href: '/transactions' },
    { icon: PieChart, label: 'common.allocations', href: '/allocations' },
    { icon: FileText, label: 'common.reports', href: '/reports' },
    { icon: Landmark, label: 'common.loans', href: '/loans' },
    { icon: Target, label: 'common.goals', href: '/goals' },
    { icon: Receipt, label: 'common.taxes', href: '/taxes' },
    { icon: Package, label: 'common.subscriptions', href: '/subscriptions' },
    { icon: Bell, label: 'common.notifications', href: '/notifications' },
];

const bottomItems = [
    { icon: Settings, label: 'common.settings', href: '/settings' },
    { icon: HelpCircle, label: 'common.help_support', href: '#' },
];

function SidebarContent({ 
    user, userName, isDark, toggleTheme, setIsOpen, 
    hoveredItem, setHoveredItem, userCardHover, setUserCardHover, 
    activeItem, activeBottomItem, dateStr, t
}) {
    const sidebarNavRef = useRef(null);

    useEffect(() => {
        const savedScroll = localStorage.getItem('sidebar-scroll');
        if (savedScroll && sidebarNavRef.current) {
            sidebarNavRef.current.scrollTop = parseInt(savedScroll, 10);
        }
    }, []);

    const handleSidebarScroll = (e) => {
        localStorage.setItem('sidebar-scroll', e.currentTarget.scrollTop);
    };

    return (
        <div className="relative z-10 flex h-full flex-col">
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <div className="flex items-center gap-3">
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
                            <path d="M50 10L15 32V68L50 90L85 68V32L50 10Z" stroke="url(#goldGradSidebar)" strokeWidth="6" strokeLinejoin="round"/>
                            <path d="M50 30L35 39V61L50 70L65 61V39L50 30Z" fill="url(#goldGradSidebar)" fillOpacity="0.2" stroke="url(#goldGradSidebar)" strokeWidth="2"/>
                            <defs>
                                <linearGradient id="goldGradSidebar" x1="15" y1="10" x2="85" y2="90" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#D4AF37"/>
                                    <stop offset="0.5" stopColor="#FFD700"/>
                                    <stop offset="1" stopColor="#B8860B"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </motion.div>
                    <div>
                        <span className="text-[18px] font-bold tracking-wide text-[var(--color-text-main)]">{t('common.oscorp')}</span>
                        <div className="text-[9px] font-semibold tracking-[0.2em] text-[var(--color-gold)] uppercase">{t('common.private_bank')}</div>
                    </div>
                </div>
                <motion.button
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg p-2 transition-colors hover:bg-white/5 md:hidden"
                    whileTap={{ scale: 0.9 }}
                >
                    <X className="h-5 w-5 text-[var(--color-text-muted)]" />
                </motion.button>
            </div>

            <Link href="/account">
                <motion.div
                    className="mx-4 mb-4 rounded-2xl p-4 backdrop-blur-sm cursor-pointer relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, var(--color-bg-card), var(--color-bg-elevated))',
                        border: '1px solid var(--color-border)',
                    }}
                    onHoverStart={() => setUserCardHover(true)}
                    onHoverEnd={() => setUserCardHover(false)}
                    whileHover={{ scale: 1.01 }}
                >
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        animate={{ opacity: userCardHover ? 0.1 : 0 }}
                        style={{ background: 'radial-gradient(circle at 30% 30%, var(--color-gold), transparent 60%)' }}
                    />
                    <div className="mb-3 flex items-center justify-between relative z-10">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                        >
                            <UserAvatar 
                                user={user} 
                                size="h-12 w-12" 
                                isDark={isDark} 
                            />
                        </motion.div>

                        <div className="flex items-center rounded-full p-1" style={{ background: 'var(--color-bg-base)', border: '1px solid var(--color-border)' }}>
                            <motion.button
                                onClick={(e) => { e.preventDefault(); toggleTheme(e); }}
                                className="rounded-full p-2 transition-all"
                                style={isDark ? { background: 'var(--color-gold-bg)', color: 'var(--color-gold)' } : {}}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Moon className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                                onClick={(e) => { e.preventDefault(); toggleTheme(e); }}
                                className="rounded-full p-2 transition-all"
                                style={!isDark ? { background: 'var(--color-gold-bg)', color: 'var(--color-gold)' } : {}}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Sun className="h-4 w-4" />
                            </motion.button>
                        </div>
                    </div>

                    <div className="mb-1 text-[10px] font-semibold tracking-[2px] text-[var(--color-text-muted)] uppercase relative z-10">{dateStr}</div>
                    <div className="text-[16px] leading-tight font-bold text-[var(--color-text-main)] relative z-10">
                        {t('common.welcome_back')},<br />
                        <span style={{ color: 'var(--color-gold)' }}>{userName}</span>
                    </div>
                </motion.div>
            </Link>

            <nav 
                ref={sidebarNavRef}
                onScroll={handleSidebarScroll}
                className="custom-scrollbar flex-1 space-y-1 overflow-y-auto px-3"
            >
                <div className="mb-2 px-3 text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)] uppercase">{t('common.menu')}</div>
                {navItems.map((item, index) => {
                    const isActive = index === activeItem;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            preserveScroll
                            onClick={() => setIsOpen(false)}
                            onMouseEnter={() => setHoveredItem(index)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all ${
                                isActive ? 'text-[var(--color-text-main)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                            }`}
                            style={isActive ? { background: 'var(--color-gold-bg)', color: 'var(--color-gold)' } : {}}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute left-0 h-6 w-1 rounded-r-full"
                                    style={{ background: 'var(--color-gold)' }}
                                />
                            )}
                            <motion.div
                                animate={{
                                    scale: hoveredItem === index || isActive ? 1.15 : 1,
                                    color: isActive ? 'var(--color-gold)' : hoveredItem === index ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <item.icon className="h-5 w-5" />
                            </motion.div>
                            <span>{t(item.label)}</span>
                        </Link>
                    );
                })}

                <div className="mt-6 mb-2 px-3 text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)] uppercase">{t('common.support')}</div>
                {bottomItems.map((item, index) => {
                    const isActive = index === activeBottomItem;
                    return (
                        <Link
                            key={index}
                            href={item.href}
                            preserveScroll
                            onClick={() => setIsOpen(false)}
                            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all ${
                                isActive ? 'text-[var(--color-gold)] bg-[var(--color-gold-bg)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                            }`}
                            whileHover={{ x: 4 }}
                        >
                            <item.icon className={`h-5 w-5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                            {t(item.label)}
                        </Link>
                    );
                })}

                <motion.button
                    onClick={() => {
                        setIsOpen(false);
                        router.post('/logout');
                    }}
                    className="mt-auto flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-red-400 transition-all hover:bg-red-500/10"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <LogOut className="h-5 w-5" />
                    {t('common.logout')}
                </motion.button>
            </nav>
        </div>
    );
}

export default function Sidebar({ active }) {
    const { props } = usePage();
    const user = props.auth?.user;
    const userName = user?.name?.split(' ')[0] ?? 'Guest';
    const { isDark, toggleTheme } = useTheme();
    const currentUrl = props.url || '';
    const { t } = useTranslation();

    const [isOpen, setIsOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [userCardHover, setUserCardHover] = useState(false);

    useEffect(() => {
        const handleToggle = () => setIsOpen((prev) => !prev);
        window.addEventListener('toggleSidebar', handleToggle);
        return () => window.removeEventListener('toggleSidebar', handleToggle);
    }, []);

    const activeItem = useMemo(() => {
        if (active) {
            const index = navItems.findIndex(item => item.label.includes(active) || item.href.includes(active));
            if (index !== -1) return index;
        }
        
        // Find all matches
        const matches = navItems
            .map((item, index) => ({ item, index }))
            .filter(({ item }) => item.href !== '#' && (currentUrl === item.href || currentUrl.startsWith(item.href + '/')));
            
        // If no matches with slash, try exact or startsWith for root-level
        if (matches.length === 0) {
            return navItems.findIndex(item => item.href !== '#' && currentUrl === item.href);
        }

        // Return the most specific match (longest href)
        return matches.reduce((prev, curr) => 
            curr.item.href.length > prev.item.href.length ? curr : prev
        ).index;
    }, [currentUrl, active]);

    const activeBottomItem = useMemo(() => {
        if (active) {
            const index = bottomItems.findIndex(item => item.label.includes(active) || item.href.includes(active));
            if (index !== -1) return index;
        }
        return bottomItems.findIndex((item) =>
            item.href !== '#' && (currentUrl === item.href || currentUrl.startsWith(item.href + '/'))
        );
    }, [currentUrl, active]);

    const commonProps = {
        user, userName, isDark, toggleTheme, setIsOpen,
        hoveredItem, setHoveredItem, userCardHover, setUserCardHover,
        activeItem, activeBottomItem, dateStr, t
    };

    return (
        <>
            <aside
                className="relative hidden h-full w-[280px] min-w-[280px] flex-col border-r md:flex"
                style={{ background: 'var(--color-bg-base)', borderColor: 'var(--color-border)' }}
            >
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-0 left-0 h-[400px] w-full opacity-[0.03]" style={{ background: 'radial-gradient(ellipse at 20% 0%, var(--color-gold), transparent 60%)' }} />
                </div>
                <SidebarContent {...commonProps} />
            </aside>

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
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-[101] flex w-[280px] flex-col md:hidden"
                            style={{ background: 'var(--color-bg-base)', borderRight: '1px solid var(--color-border)' }}
                        >
                            <SidebarContent {...commonProps} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
