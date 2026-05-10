import { Link, router, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import {
    Users,
    Landmark,
    Shield,
    Receipt,
    DollarSign,
    BarChart3,
    FileText,
    Settings,
    Menu,
    X,
    LogOut,
    ChevronRight,
    Bell,
    Search as SearchIcon,
} from 'lucide-react';

const navGroups = [
    {
        label: 'Overview',
        items: [
            {
                id: 'dashboard',
                label: 'Dashboard',
                icon: BarChart3,
                href: '/admin',
            },
        ],
    },
    {
        label: 'Management',
        items: [
            { id: 'users', label: 'Users', icon: Users, href: '/admin/users' },
            {
                id: 'accounts',
                label: 'Accounts',
                icon: Shield,
                href: '/admin/accounts',
            },
            {
                id: 'loans',
                label: 'Loans',
                icon: Landmark,
                href: '/admin/loans',
            },
            {
                id: 'transactions',
                label: 'Transactions',
                icon: DollarSign,
                href: '/admin/transactions',
            },
            {
                id: 'bill-splits',
                label: 'Bill Splits',
                icon: Receipt,
                href: '/admin/bill-splits',
            },
        ],
    },
    {
        label: 'System',
        items: [
            {
                id: 'reports',
                label: 'Reports',
                icon: BarChart3,
                href: '/admin/reports',
            },
            {
                id: 'audit-logs',
                label: 'Audit Logs',
                icon: FileText,
                href: '/admin/audit-logs',
            },
            {
                id: 'notifications',
                label: 'Notifications',
                icon: Bell,
                href: '/admin/notifications',
            },
            {
                id: 'settings',
                label: 'Settings',
                icon: Settings,
                href: '/admin/settings',
            },
        ],
    },
];

function SidebarInner({ active, onClose, onLogout }) {
    const { t } = useTranslation();

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                background: 'var(--color-bg-card)',
                borderRight: '1px solid var(--color-border)',
                overflow: 'hidden',
            }}
        >
            {/* Logo */}
            <div
                style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid var(--color-border)',
                    flexShrink: 0,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                height: '2.25rem',
                                width: '2.25rem',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '0.625rem',
                                background:
                                    'linear-gradient(135deg, var(--color-gold), #B8860B)',
                                flexShrink: 0,
                            }}
                        >
                            <Shield
                                style={{
                                    width: '1rem',
                                    height: '1rem',
                                    color: '#000',
                                }}
                            />
                        </div>
                        <div>
                            <div
                                style={{
                                    fontSize: '0.9375rem',
                                    fontWeight: 700,
                                    color: 'var(--color-text-main)',
                                    letterSpacing: '-0.01em',
                                }}
                            >
                                Admin Panel
                            </div>
                            <div
                                style={{
                                    fontSize: '0.625rem',
                                    fontWeight: 600,
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    color: 'var(--color-gold)',
                                }}
                            >
                                Management Console
                            </div>
                        </div>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            style={{
                                padding: '0.375rem',
                                borderRadius: '0.5rem',
                                color: 'var(--color-text-muted)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <X
                                style={{
                                    width: '1.125rem',
                                    height: '1.125rem',
                                }}
                            />
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                }}
            >
                {navGroups.map((group) => (
                    <div key={group.label} style={{ marginBottom: '0.5rem' }}>
                        <div
                            style={{
                                padding: '0.25rem 0.75rem 0.5rem',
                                fontSize: '0.625rem',
                                fontWeight: 700,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: 'var(--color-text-muted)',
                            }}
                        >
                            {group.label}
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.125rem',
                            }}
                        >
                            {group.items.map((item) => {
                                const isActive = active === item.id;
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        onClick={onClose}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.625rem',
                                            padding: '0.5rem 0.75rem',
                                            borderRadius: '0.625rem',
                                            fontSize: '0.8125rem',
                                            fontWeight: isActive ? 600 : 500,
                                            color: isActive
                                                ? 'var(--color-gold)'
                                                : 'var(--color-text-muted)',
                                            background: isActive
                                                ? 'var(--color-gold-bg)'
                                                : 'transparent',
                                            transition: 'all 0.15s ease',
                                            textDecoration: 'none',
                                            position: 'relative',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.background =
                                                    'var(--color-bg-elevated)';
                                                e.currentTarget.style.color =
                                                    'var(--color-text-main)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.background =
                                                    'transparent';
                                                e.currentTarget.style.color =
                                                    'var(--color-text-muted)';
                                            }
                                        }}
                                    >
                                        {isActive && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: '50%',
                                                    transform:
                                                        'translateY(-50%)',
                                                    width: '3px',
                                                    height: '60%',
                                                    borderRadius: '0 2px 2px 0',
                                                    background:
                                                        'var(--color-gold)',
                                                }}
                                            />
                                        )}
                                        <item.icon
                                            style={{
                                                width: '1rem',
                                                height: '1rem',
                                                flexShrink: 0,
                                                color: isActive
                                                    ? 'var(--color-gold)'
                                                    : 'inherit',
                                            }}
                                        />
                                        <span style={{ flex: 1 }}>
                                            {item.label}
                                        </span>
                                        {isActive && (
                                            <ChevronRight
                                                style={{
                                                    width: '0.875rem',
                                                    height: '0.875rem',
                                                    opacity: 0.5,
                                                }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div
                style={{
                    padding: '0.75rem',
                    borderTop: '1px solid var(--color-border)',
                    flexShrink: 0,
                }}
            >
                <button
                    onClick={onLogout}
                    style={{
                        display: 'flex',
                        width: '100%',
                        alignItems: 'center',
                        gap: '0.625rem',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.625rem',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        color: '#f87171',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                            'rgba(239,68,68,0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                    }}
                >
                    <LogOut
                        style={{ width: '1rem', height: '1rem', flexShrink: 0 }}
                    />
                    Logout
                </button>
            </div>
        </div>
    );
}

const getNotificationColors = (type) => {
    const types = {
        success: { color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        alert: { color: 'text-red-400', bg: 'bg-red-500/10' },
        info: {
            color: 'text-[var(--color-gold)]',
            bg: 'bg-[var(--color-gold-bg)]',
        },
    };
    return types[type] || types.info;
};

function LogoutConfirmModal({ onConfirm, onCancel }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
            }}
            onClick={onCancel}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                style={{
                    width: '90%',
                    maxWidth: '28rem',
                    padding: '2rem',
                    borderRadius: '1.5rem',
                    background: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '1.5rem',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '3rem',
                            height: '3rem',
                            borderRadius: '1rem',
                            background: 'rgba(239,68,68,0.1)',
                        }}
                    >
                        <LogOut
                            style={{
                                width: '1.5rem',
                                height: '1.5rem',
                                color: '#ef4444',
                            }}
                        />
                    </div>
                    <div>
                        <h3
                            style={{
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                color: 'var(--color-text-main)',
                                marginBottom: '0.25rem',
                            }}
                        >
                            Confirm Logout
                        </h3>
                        <p
                            style={{
                                fontSize: '0.875rem',
                                color: 'var(--color-text-muted)',
                            }}
                        >
                            Are you sure you want to logout?
                        </p>
                    </div>
                </div>

                <p
                    style={{
                        fontSize: '0.8125rem',
                        color: 'var(--color-text-muted)',
                        marginBottom: '2rem',
                        lineHeight: '1.5',
                    }}
                >
                    You'll need to sign in again to access the admin panel. Any
                    unsaved changes will be lost.
                </p>

                <div
                    style={{
                        display: 'flex',
                        gap: '0.75rem',
                        justifyContent: 'flex-end',
                    }}
                >
                    <button
                        onClick={onCancel}
                        style={{
                            padding: '0.625rem 1.5rem',
                            borderRadius: '0.75rem',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: 'var(--color-text-muted)',
                            background: 'var(--color-bg-base)',
                            border: '1px solid var(--color-border)',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                                'var(--color-bg-elevated)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                                'var(--color-bg-base)';
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: '0.625rem 1.5rem',
                            borderRadius: '0.75rem',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#fff',
                            background:
                                'linear-gradient(135deg, #ef4444, #dc2626)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            boxShadow: '0 2px 8px rgba(239,68,68,0.3)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                                'translateY(-1px)';
                            e.currentTarget.style.boxShadow =
                                '0 4px 12px rgba(239,68,68,0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow =
                                '0 2px 8px rgba(239,68,68,0.3)';
                        }}
                    >
                        Yes, Logout
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function AdminLayout({ children, active = 'dashboard' }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const notifRef = useRef(null);
    const SIDEBAR_W = parseInt(import.meta.env.VITE_SIDEBAR_WIDTH || '240', 10);
    const { props } = usePage();
    const { auth, adminRecentNotifications } = props;
    const user = auth?.user;
    const unreadCount =
        adminRecentNotifications?.filter((n) => !n.read_at).length || 0;

    const handleLogout = () => {
        setShowLogoutConfirm(false);
        router.post('/logout');
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div
            style={{
                display: 'flex',
                minHeight: '100vh',
                backgroundColor: 'var(--color-bg)',
            }}
        >
            {/* Desktop Sidebar — always visible */}
            <div
                className="hidden lg:block"
                style={{
                    width: `${SIDEBAR_W}px`,
                    minWidth: `${SIDEBAR_W}px`,
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    flexShrink: 0,
                }}
            >
                <SidebarInner
                    active={active}
                    onClose={null}
                    onLogout={() => setShowLogoutConfirm(true)}
                />
            </div>

            {/* Mobile drawer + overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            key="overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                zIndex: 40,
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                backdropFilter: 'blur(4px)',
                            }}
                            className="lg:hidden"
                        />
                        <motion.div
                            key="drawer"
                            initial={{ x: -SIDEBAR_W }}
                            animate={{ x: 0 }}
                            exit={{ x: -SIDEBAR_W }}
                            transition={{
                                type: 'spring',
                                damping: 28,
                                stiffness: 220,
                            }}
                            style={{
                                position: 'fixed',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: `${SIDEBAR_W}px`,
                                zIndex: 50,
                            }}
                            className="lg:hidden"
                        >
                            <SidebarInner
                                active={active}
                                onClose={() => setMobileOpen(false)}
                                onLogout={() => setShowLogoutConfirm(true)}
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Right column */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                }}
            >
                {/* Topbar */}
                <header
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 30,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: 'var(--color-bg-card)',
                        borderBottom: '1px solid var(--color-border)',
                        backdropFilter: 'blur(12px)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                        }}
                    >
                        <button
                            className="lg:hidden"
                            onClick={() => setMobileOpen(true)}
                            style={{
                                padding: '0.375rem',
                                borderRadius: '0.5rem',
                                color: 'var(--color-text-muted)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <Menu
                                style={{ width: '1.25rem', height: '1.25rem' }}
                            />
                        </button>

                        {/* Desktop Search */}
                        <div
                            className="hidden lg:flex"
                            style={{ position: 'relative', width: '280px' }}
                        >
                            <SearchIcon
                                style={{
                                    position: 'absolute',
                                    left: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '1rem',
                                    height: '1rem',
                                    color: 'var(--color-text-muted)',
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Search admin console..."
                                style={{
                                    width: '100%',
                                    padding: '0.5rem 1rem 0.5rem 2.25rem',
                                    borderRadius: '100px',
                                    border: '1px solid var(--color-border)',
                                    background: 'var(--color-bg-base)',
                                    color: 'var(--color-text-main)',
                                    fontSize: '0.8125rem',
                                    outline: 'none',
                                    transition: 'all 0.2s ease',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor =
                                        'var(--color-gold)';
                                    e.target.style.boxShadow =
                                        '0 0 0 3px rgba(212,175,55,0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor =
                                        'var(--color-border)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                        }}
                    >
                        <div style={{ position: 'relative' }} ref={notifRef}>
                            <motion.button
                                onClick={() =>
                                    setShowNotifications(!showNotifications)
                                }
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '2.25rem',
                                    height: '2.25rem',
                                    borderRadius: '50%',
                                    background: showNotifications
                                        ? 'var(--color-gold-bg)'
                                        : 'var(--color-bg-base)',
                                    border: `1px solid ${showNotifications ? 'var(--color-gold)' : 'var(--color-border)'}`,
                                    color: showNotifications
                                        ? 'var(--color-gold)'
                                        : 'var(--color-text-muted)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color =
                                        'var(--color-gold)';
                                    e.currentTarget.style.borderColor =
                                        'var(--color-gold)';
                                }}
                                onMouseLeave={(e) => {
                                    if (!showNotifications) {
                                        e.currentTarget.style.color =
                                            'var(--color-text-muted)';
                                        e.currentTarget.style.borderColor =
                                            'var(--color-border)';
                                    }
                                }}
                            >
                                <Bell
                                    style={{
                                        width: '1.125rem',
                                        height: '1.125rem',
                                    }}
                                />
                                {unreadCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        style={{
                                            position: 'absolute',
                                            top: '-2px',
                                            right: '-2px',
                                            width: '0.5rem',
                                            height: '0.5rem',
                                            borderRadius: '50%',
                                            background: 'rgb(239,68,68)',
                                            border: '2px solid var(--color-bg-card)',
                                            boxShadow:
                                                '0 0 8px rgba(239,68,68,0.5)',
                                        }}
                                    />
                                )}
                            </motion.button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: 10,
                                            scale: 0.95,
                                        }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{
                                            opacity: 0,
                                            y: 10,
                                            scale: 0.95,
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: 0,
                                            marginTop: '0.5rem',
                                            width: '20rem',
                                            overflow: 'hidden',
                                            borderRadius: '1rem',
                                            boxShadow:
                                                '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px var(--color-border)',
                                            background: 'var(--color-bg-card)',
                                            border: '1px solid var(--color-border)',
                                            zIndex: 50,
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '0.75rem 1rem',
                                                borderBottom:
                                                    '1px solid var(--color-border)',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: '0.875rem',
                                                    fontWeight: 700,
                                                    color: 'var(--color-text-main)',
                                                }}
                                            >
                                                Notifications
                                            </span>
                                            {adminRecentNotifications &&
                                                adminRecentNotifications.length >
                                                    0 && (
                                                    <button
                                                        onClick={() =>
                                                            router.post(
                                                                '/admin/notifications/mark-all-read',
                                                            )
                                                        }
                                                        style={{
                                                            fontSize:
                                                                '0.6875rem',
                                                            color: 'var(--color-gold)',
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        Mark all read
                                                    </button>
                                                )}
                                        </div>
                                        <div
                                            style={{
                                                maxHeight: '300px',
                                                overflowX: 'hidden',
                                                overflowY: 'auto',
                                            }}
                                        >
                                            {!adminRecentNotifications ||
                                            adminRecentNotifications.length ===
                                                0 ? (
                                                <div
                                                    style={{
                                                        padding: '1.5rem',
                                                        textAlign: 'center',
                                                        fontSize: '0.8125rem',
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    No recent notifications
                                                </div>
                                            ) : (
                                                adminRecentNotifications.map(
                                                    (n) => {
                                                        const { color, bg } =
                                                            getNotificationColors(
                                                                n.data?.type,
                                                            );

                                                        return (
                                                            <div
                                                                key={n.id}
                                                                onClick={() =>
                                                                    router.post(
                                                                        `/admin/notifications/${n.id}/mark-read`,
                                                                    )
                                                                }
                                                                style={{
                                                                    padding:
                                                                        '1rem',
                                                                    borderBottom:
                                                                        '1px solid var(--color-border)',
                                                                    cursor: 'pointer',
                                                                    transition:
                                                                        'background 0.15s',
                                                                }}
                                                                onMouseEnter={(
                                                                    e,
                                                                ) => {
                                                                    e.currentTarget.style.background =
                                                                        'var(--color-bg-elevated)';
                                                                }}
                                                                onMouseLeave={(
                                                                    e,
                                                                ) => {
                                                                    e.currentTarget.style.background =
                                                                        'transparent';
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        display:
                                                                            'flex',
                                                                        gap: '0.75rem',
                                                                    }}
                                                                >
                                                                    <div
                                                                        style={{
                                                                            display:
                                                                                'flex',
                                                                            height: '2rem',
                                                                            width: '2rem',
                                                                            flexShrink: 0,
                                                                            alignItems:
                                                                                'center',
                                                                            justifyContent:
                                                                                'center',
                                                                            borderRadius:
                                                                                '50%',
                                                                            background:
                                                                                bg,
                                                                        }}
                                                                    >
                                                                        <Bell
                                                                            style={{
                                                                                width: '1rem',
                                                                                height: '1rem',
                                                                                color,
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <div
                                                                            style={{
                                                                                display:
                                                                                    'flex',
                                                                                alignItems:
                                                                                    'center',
                                                                                justifyContent:
                                                                                    'space-between',
                                                                                marginBottom:
                                                                                    '0.25rem',
                                                                            }}
                                                                        >
                                                                            <span
                                                                                style={{
                                                                                    fontSize:
                                                                                        '0.8125rem',
                                                                                    fontWeight: 700,
                                                                                    color: 'var(--color-text-main)',
                                                                                }}
                                                                            >
                                                                                {n
                                                                                    .data
                                                                                    ?.title ||
                                                                                    'Notification'}
                                                                            </span>
                                                                            <span
                                                                                style={{
                                                                                    fontSize:
                                                                                        '0.625rem',
                                                                                    color: 'var(--color-text-muted)',
                                                                                }}
                                                                            >
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
                                                                        <p
                                                                            style={{
                                                                                fontSize:
                                                                                    '0.75rem',
                                                                                lineHeight:
                                                                                    '1.25rem',
                                                                                wordBreak:
                                                                                    'break-word',
                                                                                color: 'var(--color-text-muted)',
                                                                            }}
                                                                        >
                                                                            {n
                                                                                .data
                                                                                ?.message ||
                                                                                'No details provided.'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    },
                                                )
                                            )}
                                        </div>
                                        <div
                                            style={{
                                                padding: '0.5rem',
                                                textAlign: 'center',
                                                borderTop:
                                                    '1px solid var(--color-border)',
                                            }}
                                        >
                                            <Link
                                                href="/admin/notifications"
                                                onClick={() =>
                                                    setShowNotifications(false)
                                                }
                                                style={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700,
                                                    color: 'var(--color-gold)',
                                                    textDecoration: 'none',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.textDecoration =
                                                        'underline';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.textDecoration =
                                                        'none';
                                                }}
                                            >
                                                View All
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {user && (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    paddingLeft: '1rem',
                                    borderLeft: '1px solid var(--color-border)',
                                }}
                            >
                                <div
                                    className="hidden sm:block"
                                    style={{ textAlign: 'right' }}
                                >
                                    <div
                                        style={{
                                            fontSize: '0.8125rem',
                                            fontWeight: 600,
                                            color: 'var(--color-text-main)',
                                        }}
                                    >
                                        {user.name}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '0.6875rem',
                                            color: 'var(--color-gold)',
                                            letterSpacing: '0.05em',
                                        }}
                                    >
                                        Admin
                                    </div>
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    style={{
                                        width: '2.25rem',
                                        height: '2.25rem',
                                        borderRadius: '50%',
                                        background:
                                            'linear-gradient(135deg, var(--color-gold), #B8860B)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.875rem',
                                        fontWeight: 700,
                                        color: '#000',
                                        border: '2px solid var(--color-bg-card)',
                                        flexShrink: 0,
                                        boxShadow:
                                            '0 2px 8px rgba(212,175,55,0.3)',
                                    }}
                                >
                                    {user.name.charAt(0).toUpperCase()}
                                </motion.div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Page content */}
                <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                    {children}
                </main>
            </div>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <LogoutConfirmModal
                        onConfirm={handleLogout}
                        onCancel={() => setShowLogoutConfirm(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
