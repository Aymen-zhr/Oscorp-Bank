import { Bell, Search, Zap, User, Settings, LogOut, ChevronDown, Menu, Globe } from 'lucide-react';
import { usePage, Link, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserAvatar from './UserAvatar';
import { useTranslation } from '../../hooks/useTranslation';
import { useCurrency } from '../../hooks/useCurrency';

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
    const day = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });

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
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const changeLocale = (code) => {
        document.cookie = `locale=${code};path=/;max-age=31536000`;
        document.documentElement.lang = code;
        document.documentElement.dir = 'ltr'; // Always use LTR as requested
        router.reload();
    };

    return (
        <header className="flex items-center justify-between px-4 md:px-6 py-2.5 shrink-0 gap-3 md:gap-4 relative z-50"
            style={{ background: 'var(--color-bg-card)', borderBottom: '1px solid var(--color-border)' }}
        >
            <div className="flex items-center gap-3">
                <motion.button
                    onClick={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))}
                    className="md:hidden p-2 rounded-xl text-[var(--color-text-main)] hover:bg-[var(--color-bg-elevated)] transition-all"
                    whileTap={{ scale: 0.9 }}
                >
                    <Menu className="w-5 h-5" />
                </motion.button>
                <div className="flex flex-col">
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[16px] md:text-[20px] font-bold text-[var(--color-text-main)] truncate max-w-[150px] md:max-w-none"
                    >
                        {t('topbar.welcome')}, <span style={{ color: 'var(--color-gold)' }}>{user?.name?.split(' ')[0] || 'Executive'}</span>
                    </motion.h1>
                    <div className="hidden md:block text-[11px] text-[var(--color-text-muted)]">{day}</div>
                </div>
            </div>

            <div className="hidden lg:flex items-center gap-3">
                <motion.div
                    className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-default"
                    style={{ background: 'var(--color-gold-bg)', border: '1px solid var(--color-gold)/20' }}
                    whileHover={{ scale: 1.03 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <motion.div
                        className="w-2 h-2 rounded-full"
                        style={{ background: 'var(--color-gold)', boxShadow: '0 0 10px var(--color-gold)' }}
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-[14px] font-bold text-[var(--color-gold)]">{format(balance)}</span>
                </motion.div>

                <motion.div
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-emerald-400 cursor-default"
                    style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}
                    whileHover={{ scale: 1.03 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <span className="text-[12px] font-semibold">+{format(credits)}</span>
                    <span className="text-[10px] text-emerald-400/70">{t('topbar.in')}</span>
                </motion.div>

                <motion.div
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 cursor-default"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                    whileHover={{ scale: 1.03 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                >
                    <span className="text-[12px] font-semibold">-{format(debits)}</span>
                    <span className="text-[10px] text-red-400/70">{t('topbar.out')}</span>
                </motion.div>
            </div>

            <div className="flex items-center gap-3">
                <motion.div
                    animate={{ width: searchFocused ? 220 : 140 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl overflow-hidden relative"
                    style={{
                        background: searchFocused ? 'var(--color-bg-card)' : 'var(--color-bg-elevated)',
                        border: searchFocused ? '1px solid var(--color-gold)' : '1px solid var(--color-border)',
                        boxShadow: searchFocused ? '0 0 0 3px rgba(212,175,55,0.1)' : 'none',
                    }}
                >
                    <motion.div animate={{ color: searchFocused ? 'var(--color-gold)' : 'var(--color-text-muted)' }}>
                        <Search className="w-4 h-4" />
                    </motion.div>
                    <input
                        className="bg-transparent outline-none text-[12px] text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] w-full"
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
                            className="text-[var(--color-text-muted)] hover:text-white transition-colors"
                        >
                            <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center">
                                <span className="text-[8px]">×</span>
                            </div>
                        </motion.button>
                    )}
                </motion.div>

                <div className="relative" ref={notifRef}>
                    <motion.button
                        onClick={() => setShowNotifications(!showNotifications)}
                        onHoverStart={() => setNotifHover(true)}
                        onHoverEnd={() => setNotifHover(false)}
                        className={`relative p-2 rounded-xl transition-all ${showNotifications ? 'bg-[var(--color-gold-bg)] text-[var(--color-gold)]' : 'text-[var(--color-text-muted)]'}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <motion.div animate={{ rotate: notifHover ? [0, -10, 10, -10, 0] : 0 }} transition={{ duration: 0.5 }}>
                            <Bell className="w-5 h-5" />
                        </motion.div>
                        {user?.unreadNotificationsCount > 0 && (
                            <motion.span
                                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                                style={{ background: 'var(--color-gold)', boxShadow: '0 0 8px var(--color-gold)' }}
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
                                className="absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-xl overflow-hidden z-50"
                                style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
                            >
                                <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
                                    <span className="text-[14px] font-bold text-[var(--color-text-main)]">{t('common.notifications')}</span>
                                    {user?.unreadNotificationsCount > 0 && (
                                        <motion.button
                                            onClick={() => router.post('/notifications/mark-all-read')}
                                            className="text-[11px] text-[var(--color-gold)] hover:underline"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {t('common.mark_all_read')}
                                        </motion.button>
                                    )}
                                </div>
                                <div className="max-h-[300px] overflow-y-auto overflow-x-hidden custom-scrollbar">
                                    {!user?.recentNotifications || user.recentNotifications.length === 0 ? (
                                        <div className="p-6 text-center text-[var(--color-text-muted)] text-[13px]">
                                            {t('common.no_recent_notifications')}
                                        </div>
                                    ) : (
                                        user.recentNotifications.map(n => {
                                            const type = n.data?.type || 'info';
                                            let color = 'text-[var(--color-gold)]';
                                            let bg = 'bg-[var(--color-gold-bg)]';

                                            if (type === 'alert') { color = 'text-red-400'; bg = 'bg-red-500/10'; }
                                            if (type === 'success') { color = 'text-emerald-400'; bg = 'bg-emerald-500/10'; }

                                            return (
                                                <motion.div
                                                    key={n.id}
                                                    onClick={() => router.post(`/notifications/${n.id}/mark-read`)}
                                                    className="p-4 border-b last:border-0 hover:bg-[var(--color-bg-elevated)] transition-colors cursor-pointer"
                                                    style={{ borderColor: 'var(--color-border)' }}
                                                    whileHover={{ x: 4 }}
                                                >
                                                    <div className="flex gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
                                                            <Bell className={`w-4 h-4 ${color}`} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-[13px] font-bold text-[var(--color-text-main)]">{n.data?.title || 'Notification'}</span>
                                                                <span className="text-[10px] text-[var(--color-text-muted)]">
                                                                    {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                            <p className="text-[12px] text-[var(--color-text-muted)] leading-tight break-words">{n.data?.message || 'No details provided.'}</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })
                                    )}
                                </div>
                                <div className="p-2 border-t text-center" style={{ borderColor: 'var(--color-border)' }}>
                                    <Link href="/notifications" className="text-[12px] font-bold text-[var(--color-gold)] hover:underline" onClick={() => setShowNotifications(false)}>{t('common.view_all_activity')}</Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="relative" ref={langRef}>
                    <motion.button
                        onClick={() => setShowLangMenu(!showLangMenu)}
                        className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)] transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Globe className="w-4 h-4" />
                        <span className="text-[12px] font-medium uppercase">{locale}</span>
                    </motion.button>

                    <AnimatePresence>
                        {showLangMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-full mt-2 w-48 py-2 rounded-2xl shadow-2xl overflow-hidden z-50"
                                style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
                            >
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => changeLocale(lang.code)}
                                        className={`flex items-center gap-3 w-full px-4 py-2.5 text-[13px] transition-colors ${
                                            locale === lang.code ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-main)] hover:bg-[var(--color-bg-elevated)]'
                                        }`}
                                    >
                                        <span className="text-[16px]">{lang.flag}</span>
                                        <span className="font-medium">{t(lang.labelKey)}</span>
                                        {locale === lang.code && (
                                            <span className="ml-auto text-[var(--color-gold)]">✓</span>
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
                        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[var(--color-bg-elevated)] transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                        >
                            <UserAvatar 
                                user={user} 
                                size="w-8 h-8" 
                                isDark={document.documentElement.classList.contains('dark')} 
                            />
                        </motion.div>
                        <motion.div
                            animate={{ rotate: showUserMenu ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
                        </motion.div>
                    </motion.button>

                    <AnimatePresence>
                        {showUserMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-full mt-2 w-64 py-2 rounded-[24px] shadow-2xl overflow-hidden"
                                style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
                            >
                                <Link href="/account" className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium transition-colors" style={{ color: 'var(--color-text-main)' }} onClick={() => setShowUserMenu(false)}>
                                    <User className="w-5 h-5 opacity-70" /> {t('common.my_account')}
                                </Link>
                                <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium transition-colors" style={{ color: 'var(--color-text-main)' }} onClick={() => setShowUserMenu(false)}>
                                    <Settings className="w-5 h-5 opacity-70" /> {t('common.settings')}
                                </Link>
                                <hr className="my-1" style={{ borderColor: 'var(--color-border)', opacity: 0.5 }} />
                                <motion.button
                                    onClick={() => router.post('/logout')}
                                    className="flex items-center gap-3 px-4 py-4 text-[14px] font-medium text-[#FF4D4D] hover:bg-red-500/5 w-full text-left transition-colors"
                                    whileHover={{ x: 2 }}
                                >
                                    <LogOut className="w-5 h-5" /> {t('common.sign_out')}
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
