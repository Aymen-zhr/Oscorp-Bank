import {
    Bell,
    Search,
    Zap,
    User,
    Settings,
    LogOut,
    ChevronDown,
    Menu,
    Globe,
    Sun,
    Moon,
} from 'lucide-react';
import { usePage, Link, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserAvatar from './UserAvatar';
import { useTranslation } from '../../hooks/useTranslation';
import { useCurrency } from '../../hooks/useCurrency';
import { useTheme } from '../../contexts/ThemeContext';

function ThemeToggleButton() {
    const { isDark, toggleTheme, themeName, themes } = useTheme();
    const theme = themes[themeName];

    if (!theme?.lightMode) return null;

    return (
        <motion.button
            onClick={toggleTheme}
            className="rounded-xl p-2 transition-all hover:scale-110"
            style={{
                color: isDark
                    ? theme.colors['--color-gold']
                    : theme.colors['--color-gold-dark'],
                background: 'var(--color-bg-elevated)',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {isDark ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
        </motion.button>
    );
}

const languages = [
    { code: 'en', labelKey: 'languages.english', flag: '🇬🇧' },
    { code: 'fr', labelKey: 'languages.french', flag: '🇫🇷' },
    { code: 'ar', labelKey: 'languages.arabic', flag: '🇸🇦' },
];

export default function Topbar() {
    const { props } = usePage();
    const balance = props.balance ?? 0;
    const locale = props.locale ?? 'en';
    let transactions = props.transactions ?? [];
    const { format, code } = useCurrency();

    if (transactions?.data) {
        transactions = transactions.data;
    }

    const [searchFocused, setSearchFocused] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [notifHover, setNotifHover] = useState(false);
    const menuRef = useRef(null);
    const notifRef = useRef(null);
    const langRef = useRef(null);
    const user = props.auth?.user;
    const { t } = useTranslation();

    const now = new Date();
    const day = now.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
    });

    const credits = props.total_credits ?? 0;
    const debits = props.total_debits ?? 0;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowUserMenu(false);
            }
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
            if (langRef.current && !langRef.current.contains(e.target)) {
                setShowLangMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const changeLocale = (code) => {
        document.cookie = `locale=${code};path=/;max-age=31536000`;
        document.documentElement.lang = code;
        document.documentElement.dir = 'ltr'; // Always use LTR as requested
        router.reload();
    };

    return (
        <header
            className="relative z-50 flex shrink-0 items-center justify-between gap-3 px-4 py-2.5 md:gap-4 md:px-6"
            style={{
                background: 'var(--color-bg-card)',
                borderBottom: '1px solid var(--color-border)',
            }}
        >
            <div className="flex items-center gap-3">
                <motion.button
                    onClick={() =>
                        window.dispatchEvent(new CustomEvent('toggleSidebar'))
                    }
                    className="rounded-xl p-2 text-[var(--color-text-main)] transition-all hover:bg-[var(--color-bg-elevated)] md:hidden"
                    whileTap={{ scale: 0.9 }}
                >
                    <Menu className="h-5 w-5" />
                </motion.button>
                <div className="flex flex-col">
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-[150px] truncate text-[16px] font-bold text-[var(--color-text-main)] md:max-w-none md:text-[20px]"
                    >
                        {t('topbar.welcome')},{' '}
                        <span style={{ color: 'var(--color-gold)' }}>
                            {user?.name?.split(' ')[0] || 'Executive'}
                        </span>
                    </motion.h1>
                    <div className="hidden text-[11px] text-[var(--color-text-muted)] md:block">
                        {day}
                    </div>
                </div>
            </div>

            <div className="hidden items-center gap-3 lg:flex">
                <motion.div
                    className="flex cursor-default items-center gap-2 rounded-xl px-4 py-2"
                    style={{
                        background: 'var(--color-gold-bg)',
                        border: '1px solid var(--color-gold)/20',
                    }}
                    whileHover={{ scale: 1.03 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <motion.div
                        className="h-2 w-2 rounded-full"
                        style={{
                            background: 'var(--color-gold)',
                            boxShadow: '0 0 10px var(--color-gold)',
                        }}
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-[14px] font-bold text-[var(--color-gold)]">
                        {format(balance)}
                    </span>
                </motion.div>

                <motion.div
                    className="flex cursor-default items-center gap-2 rounded-xl px-3 py-2 text-emerald-400"
                    style={{
                        background: 'rgba(52,211,153,0.1)',
                        border: '1px solid rgba(52,211,153,0.2)',
                    }}
                    whileHover={{ scale: 1.03 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <span className="text-[12px] font-semibold">
                        +{format(credits)}
                    </span>
                    <span className="text-[10px] text-emerald-400/70">
                        {t('topbar.in')}
                    </span>
                </motion.div>

                <motion.div
                    className="flex cursor-default items-center gap-2 rounded-xl px-3 py-2 text-red-400"
                    style={{
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.2)',
                    }}
                    whileHover={{ scale: 1.03 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                >
                    <span className="text-[12px] font-semibold">
                        -{format(debits)}
                    </span>
                    <span className="text-[10px] text-red-400/70">
                        {t('topbar.out')}
                    </span>
                </motion.div>
            </div>

            <div className="flex items-center gap-3">
                <motion.div
                    animate={{ width: searchFocused ? 220 : 140 }}
                    className="relative flex items-center gap-2 overflow-hidden rounded-xl px-3 py-2"
                    style={{
                        background: searchFocused
                            ? 'var(--color-bg-card)'
                            : 'var(--color-bg-elevated)',
                        border: searchFocused
                            ? '1px solid var(--color-gold)'
                            : '1px solid var(--color-border)',
                        boxShadow: searchFocused
                            ? '0 0 0 3px rgba(212,175,55,0.1)'
                            : 'none',
                    }}
                >
                    <motion.div
                        animate={{
                            color: searchFocused
                                ? 'var(--color-gold)'
                                : 'var(--color-text-muted)',
                        }}
                    >
                        <Search className="h-4 w-4" />
                    </motion.div>
                    <input
                        className="w-full bg-transparent text-[12px] text-[var(--color-text-main)] outline-none placeholder:text-[var(--color-text-muted)]"
                        placeholder={t('common.search')}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                    />
                    {searchValue && (
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            onClick={() => setSearchValue('')}
                            className="text-[var(--color-text-muted)] transition-colors hover:text-white"
                        >
                            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-white/10">
                                <span className="text-[8px]">×</span>
                            </div>
                        </motion.button>
                    )}
                </motion.div>

                {/* Theme Toggle */}
                <ThemeToggleButton />
                <div className="relative" ref={notifRef}>
                    <motion.button
                        onClick={() => setShowNotifications(!showNotifications)}
                        onHoverStart={() => setNotifHover(true)}
                        onHoverEnd={() => setNotifHover(false)}
                        className={`relative rounded-xl p-2 transition-all ${showNotifications ? 'bg-[var(--color-gold-bg)] text-[var(--color-gold)]' : 'text-[var(--color-text-muted)]'}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <motion.div
                            animate={{
                                scale: notifHover ? [1, 1.2, 1] : 1,
                                y: notifHover ? [0, -3, 0] : 0,
                            }}
                            transition={{
                                duration: 0.4,
                                type: 'spring',
                                stiffness: 400,
                            }}
                        >
                            <Bell className="h-5 w-5" />
                        </motion.div>
                        {user?.unreadNotificationsCount > 0 && (
                            <motion.span
                                className="absolute top-1 right-1 h-2 w-2 rounded-full"
                                style={{
                                    background: 'var(--color-gold)',
                                    boxShadow: '0 0 8px var(--color-gold)',
                                }}
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        )}
                    </motion.button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl shadow-xl"
                                style={{
                                    background: 'var(--color-bg-card)',
                                    border: '1px solid var(--color-border)',
                                }}
                            >
                                <div
                                    className="flex items-center justify-between border-b px-4 py-3"
                                    style={{
                                        borderColor: 'var(--color-border)',
                                    }}
                                >
                                    <span className="text-[14px] font-bold text-[var(--color-text-main)]">
                                        {t('common.notifications')}
                                    </span>
                                    {user?.unreadNotificationsCount > 0 && (
                                        <motion.button
                                            onClick={() =>
                                                router.post(
                                                    '/notifications/mark-all-read',
                                                )
                                            }
                                            className="text-[11px] text-[var(--color-gold)] hover:underline"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {t('common.mark_all_read')}
                                        </motion.button>
                                    )}
                                </div>
                                <div className="custom-scrollbar max-h-[300px] overflow-x-hidden overflow-y-auto">
                                    {!user?.recentNotifications ||
                                    user.recentNotifications.length === 0 ? (
                                        <div className="p-6 text-center text-[13px] text-[var(--color-text-muted)]">
                                            {t(
                                                'common.no_recent_notifications',
                                            )}
                                        </div>
                                    ) : (
                                        user.recentNotifications.map((n) => {
                                            const type = n.data?.type || 'info';
                                            let color =
                                                'text-[var(--color-gold)]';
                                            let bg =
                                                'bg-[var(--color-gold-bg)]';

                                            if (type === 'alert') {
                                                color = 'text-red-400';
                                                bg = 'bg-red-500/10';
                                            }
                                            if (type === 'success') {
                                                color = 'text-emerald-400';
                                                bg = 'bg-emerald-500/10';
                                            }

                                            return (
                                                <motion.div
                                                    key={n.id}
                                                    onClick={() =>
                                                        router.post(
                                                            `/notifications/${n.id}/mark-read`,
                                                        )
                                                    }
                                                    className="cursor-pointer border-b p-4 transition-colors last:border-0 hover:bg-[var(--color-bg-elevated)]"
                                                    style={{
                                                        borderColor:
                                                            'var(--color-border)',
                                                    }}
                                                    whileHover={{ x: 4 }}
                                                >
                                                    <div className="flex gap-3">
                                                        <div
                                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${bg}`}
                                                        >
                                                            <Bell
                                                                className={`h-4 w-4 ${color}`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <div className="mb-1 flex items-center justify-between">
                                                                <span className="text-[13px] font-bold text-[var(--color-text-main)]">
                                                                    {n.data
                                                                        ?.title ||
                                                                        'Notification'}
                                                                </span>
                                                                <span className="text-[10px] text-[var(--color-text-muted)]">
                                                                    {new Date(
                                                                        n.created_at,
                                                                    ).toLocaleTimeString(
                                                                        [],
                                                                        {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                        },
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <p className="text-[12px] leading-tight break-words text-[var(--color-text-muted)]">
                                                                {n.data
                                                                    ?.message ||
                                                                    'No details provided.'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })
                                    )}
                                </div>
                                <div
                                    className="border-t p-2 text-center"
                                    style={{
                                        borderColor: 'var(--color-border)',
                                    }}
                                >
                                    <Link
                                        href="/notifications"
                                        className="text-[12px] font-bold text-[var(--color-gold)] hover:underline"
                                        onClick={() =>
                                            setShowNotifications(false)
                                        }
                                    >
                                        {t('common.view_all_activity')}
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="relative" ref={langRef}>
                    <motion.button
                        onClick={() => setShowLangMenu(!showLangMenu)}
                        className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[var(--color-text-muted)] transition-all hover:bg-[var(--color-bg-elevated)]"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Globe className="h-4 w-4" />
                        <span className="text-[12px] font-medium uppercase">
                            {locale}
                        </span>
                    </motion.button>

                    <AnimatePresence>
                        {showLangMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full right-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl py-2 shadow-2xl"
                                style={{
                                    background: 'var(--color-bg-card)',
                                    border: '1px solid var(--color-border)',
                                }}
                            >
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => changeLocale(lang.code)}
                                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-[13px] transition-colors ${
                                            locale === lang.code
                                                ? 'text-[var(--color-gold)]'
                                                : 'text-[var(--color-text-main)] hover:bg-[var(--color-bg-elevated)]'
                                        }`}
                                    >
                                        <span className="text-[16px]">
                                            {lang.flag}
                                        </span>
                                        <span className="font-medium">
                                            {t(lang.labelKey)}
                                        </span>
                                        {locale === lang.code && (
                                            <span className="ml-auto text-[var(--color-gold)]">
                                                ✓
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="relative" ref={menuRef}>
                    <motion.button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all hover:bg-[var(--color-bg-elevated)]"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <motion.div whileHover={{ scale: 1.1 }}>
                            <UserAvatar user={user} size="w-8 h-8" />
                        </motion.div>
                        <motion.div
                            animate={{ scale: showUserMenu ? 1.15 : 1 }}
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 17,
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
                        </motion.div>
                    </motion.button>

                    <AnimatePresence>
                        {showUserMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full right-0 mt-2 w-64 overflow-hidden rounded-[24px] py-2 shadow-2xl"
                                style={{
                                    background: 'var(--color-bg-card)',
                                    border: '1px solid var(--color-border)',
                                }}
                            >
                                <Link
                                    href="/account"
                                    className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium transition-colors"
                                    style={{ color: 'var(--color-text-main)' }}
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <User className="h-5 w-5 opacity-70" />{' '}
                                    {t('common.my_account')}
                                </Link>
                                <Link
                                    href="/settings"
                                    className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium transition-colors"
                                    style={{ color: 'var(--color-text-main)' }}
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <Settings className="h-5 w-5 opacity-70" />{' '}
                                    {t('common.settings')}
                                </Link>
                                <hr
                                    className="my-1"
                                    style={{
                                        borderColor: 'var(--color-border)',
                                        opacity: 0.5,
                                    }}
                                />
                                <motion.button
                                    onClick={() => router.post('/logout')}
                                    className="flex w-full items-center gap-3 px-4 py-4 text-left text-[14px] font-medium text-[#FF4D4D] transition-colors hover:bg-red-500/5"
                                    whileHover={{ x: 2 }}
                                >
                                    <LogOut className="h-5 w-5" />{' '}
                                    {t('common.sign_out')}
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
