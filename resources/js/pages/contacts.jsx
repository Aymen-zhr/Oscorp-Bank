import { Head, router, useForm } from '@inertiajs/react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { useTranslation } from '@/hooks/useTranslation';
import {
    UserPlus,
    Search,
    X,
    Users,
    Mail,
    Trash2,
    Edit2,
    Check,
    MoreVertical,
    Phone,
    MessageSquare,
    Split,
    Clock,
    ArrowRight,
    Sparkles,
    Hash,
} from 'lucide-react';
import { ROUTES, COLORS, AVATAR_COLORS } from '@/constants';

export default function Contacts({
    balance,
    contacts = [],
    pendingRequests = [],
    contactStats = {},
}) {
    const { t, locale } = useTranslation();
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [showActions, setShowActions] = useState(null);
    const [modalSearch, setModalSearch] = useState('');
    const [modalResults, setModalResults] = useState([]);
    const [modalSearching, setModalSearching] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
    });

    const searchUsers = useCallback(async (query) => {
        if (!query || query.length < 2) {
            setSearchResults([]);
            return;
        }
        setSearching(true);
        try {
            const res = await fetch(
                `${ROUTES.contacts}/search?q=${encodeURIComponent(query)}`,
            );
            const results = await res.json();
            setSearchResults(results);
        } catch (e) {
            console.error('Search failed:', e);
        } finally {
            setSearching(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.length >= 2) {
                searchUsers(searchQuery);
            } else {
                setSearchResults([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, searchUsers]);

    const searchModalUsers = useCallback(async (query) => {
        if (!query || query.length < 2) {
            setModalResults([]);
            return;
        }
        setModalSearching(true);
        try {
            const res = await fetch(
                `${ROUTES.contacts}/search?q=${encodeURIComponent(query)}`,
            );
            const results = await res.json();
            setModalResults(results);
        } catch (e) {
            console.error('Modal search failed:', e);
        } finally {
            setModalSearching(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (modalSearch.length >= 2) {
                searchModalUsers(modalSearch);
            } else {
                setModalResults([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [modalSearch, searchModalUsers]);

    const filteredContacts = useMemo(() => {
        if (!searchQuery) return contacts;
        const q = searchQuery.toLowerCase();
        return contacts.filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                c.email.toLowerCase().includes(q) ||
                (c.nickname && c.nickname.toLowerCase().includes(q)),
        );
    }, [contacts, searchQuery]);

    const addContact = (user) => {
        router.post(
            '/contacts',
            {
                contact_user_id: user.id,
                nickname: null,
                avatar_color:
                    AVATAR_COLORS[
                        Math.floor(Math.random() * AVATAR_COLORS.length)
                    ],
            },
            {
                onSuccess: () => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowAddModal(false);
                    setModalSearch('');
                    setModalResults([]);
                },
            },
        );
    };

    const removeContact = (contactId) => {
        router.delete(`/contacts/${contactId}`);
        setShowActions(null);
    };

    const acceptRequest = (requestId) => {
        router.post(`/contacts/${requestId}/accept`);
    };

    const denyRequest = (requestId) => {
        router.post(`/contacts/${requestId}/deny`);
    };

    const saveNickname = (contactUserId, nickname) => {
        router.post(
            '/contacts',
            {
                contact_user_id: contactUserId,
                nickname: nickname || null,
            },
            {
                onSuccess: () => {
                    setEditingContact(null);
                    reset();
                },
            },
        );
    };

    const fmtCurrency = (amount) => {
        return Number(amount).toLocaleString(locale || 'en-MA', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const fmtDate = (date) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString(locale || 'en-MA', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div
            className="flex h-screen w-full overflow-hidden"
            style={{ background: 'var(--color-bg-base)' }}
        >
            <Head title="OSCORP | Contacts" />
            <Sidebar active="contacts" />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Topbar />

                <div className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-5xl space-y-5 px-6 py-5">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -14 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start justify-between gap-4"
                        >
                            <div>
                                <h1
                                    className="text-[26px] font-bold tracking-tight"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    {t('contacts.title')}
                                </h1>
                                <p
                                    className="mt-0.5 text-[13px]"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    {t('contacts.subtitle')}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowAddModal(true);
                                    setModalSearch('');
                                    setModalResults([]);
                                }}
                                className="flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-semibold transition-all hover:opacity-80"
                                style={{
                                    background: 'var(--color-gold)',
                                    color: '#000',
                                }}
                            >
                                <UserPlus className="h-4 w-4" />{' '}
                                {t('contacts.add_contact')}
                            </button>
                        </motion.div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                {
                                    label: 'contacts.total_contacts',
                                    value: contactStats.total || 0,
                                    color: 'var(--color-gold)',
                                    Icon: Users,
                                    sub: 'contacts.people_in_network',
                                },
                                {
                                    label: 'contacts.active_splits',
                                    value:
                                        contactStats.recent_splits?.reduce(
                                            (sum, s) => sum + s.split_count,
                                            0,
                                        ) || 0,
                                    color: '#3B82F6',
                                    Icon: Split,
                                    sub: 'contacts.shared_bills',
                                },
                                {
                                    label: 'contacts.frequent_partners',
                                    value:
                                        contactStats.recent_splits?.length || 0,
                                    color: COLORS.credit,
                                    Icon: Hash,
                                    sub: 'contacts.regular_splitters',
                                },
                            ].map(({ label, value, color, Icon, sub }, i) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.06 * (i + 1) }}
                                    className="rounded-2xl p-4"
                                    style={{
                                        background: 'var(--color-bg-card)',
                                        border: '1px solid var(--color-border)',
                                    }}
                                >
                                    <div className="mb-3 flex items-center gap-3">
                                        <div
                                            className="flex h-10 w-10 items-center justify-center rounded-xl"
                                            style={{
                                                background: color + '18',
                                                border: `1px solid ${color}30`,
                                            }}
                                        >
                                            <Icon
                                                className="h-5 w-5"
                                                style={{ color }}
                                            />
                                        </div>
                                        <div>
                                            <div
                                                className="text-[10px] font-semibold tracking-widest uppercase"
                                                style={{
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                {t(label)}
                                            </div>
                                            <div
                                                className="text-[20px] leading-none font-bold"
                                                style={{ color }}
                                            >
                                                {value}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="text-[11px]"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                        }}
                                    >
                                        {t(sub)}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Search Bar */}
                        <div
                            className="flex items-center gap-3 rounded-2xl px-4 py-3"
                            style={{
                                background: 'var(--color-bg-card)',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            <Search
                                className="h-5 w-5 shrink-0"
                                style={{ color: 'var(--color-text-muted)' }}
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('contacts.search_placeholder')}
                                className="flex-1 bg-transparent text-[14px] outline-none"
                                style={{ color: 'var(--color-text-main)' }}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="rounded-lg p-1 hover:opacity-80"
                                >
                                    <X
                                        className="h-4 w-4"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                        }}
                                    />
                                </button>
                            )}
                        </div>

                        {/* Search Results (when searching) */}
                        {searchQuery.length >= 2 && searchResults.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <h3
                                    className="mb-3 flex items-center gap-2 text-[14px] font-semibold"
                                    style={{
                                        color: 'var(--color-text-main)',
                                    }}
                                >
                                    <Sparkles
                                        className="h-4 w-4"
                                        style={{ color: COLORS.purple }}
                                    />
                                    {t('common.search_results')}
                                </h3>
                                <div className="space-y-2">
                                    {searchResults.map((user) => {
                                        const isContact = contacts.some(
                                            (c) => c.user_id === user.id,
                                        );
                                        return (
                                            <div
                                                key={user.id}
                                                className="flex items-center gap-4 rounded-2xl px-5 py-3"
                                                style={{
                                                    background:
                                                        'var(--color-bg-card)',
                                                    border: '1px solid var(--color-border)',
                                                }}
                                            >
                                                <div
                                                    className="flex h-10 w-10 items-center justify-center rounded-full text-[14px] font-bold"
                                                    style={{
                                                        background:
                                                            '#3B82F622',
                                                        color: '#3B82F6',
                                                        border: '1.5px solid #3B82F640',
                                                    }}
                                                >
                                                    {getInitials(user.name)}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div
                                                        className="text-[14px] font-semibold"
                                                        style={{
                                                            color: 'var(--color-text-main)',
                                                        }}
                                                    >
                                                        {user.name || `User #${user.id}`}
                                                    </div>
                                                    <div
                                                        className="text-[12px]"
                                                        style={{
                                                            color: 'var(--color-text-muted)',
                                                        }}
                                                    >
                                                        {user.phone || user.email}
                                                    </div>
                                                </div>
                                                {!isContact && (
                                                    <button
                                                        onClick={() => addContact(user)}
                                                        className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[12px] font-semibold transition-all hover:opacity-80"
                                                        style={{
                                                            background: 'var(--color-gold)',
                                                            color: '#000',
                                                        }}
                                                    >
                                                        <UserPlus className="h-3.5 w-3.5" />
                                                        Add
                                                    </button>
                                                )}
                                                {isContact && (
                                                    <span
                                                        className="text-[12px] font-medium"
                                                        style={{ color: 'var(--color-text-muted)' }}
                                                    >
                                                        Added
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* Add Contact Modal */}
                        <AnimatePresence>
                            {showAddModal && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                                    style={{
                                        background: 'rgba(0,0,0,0.6)',
                                        backdropFilter: 'blur(4px)',
                                    }}
                                    onClick={() => setShowAddModal(false)}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full max-w-lg rounded-2xl p-6"
                                        style={{
                                            background: 'var(--color-bg-card)',
                                            border: '1px solid var(--color-border)',
                                        }}
                                    >
                                        <div className="mb-5 flex items-center justify-between">
                                            <h2
                                                className="text-[18px] font-bold"
                                                style={{ color: 'var(--color-text-main)' }}
                                            >
                                                {t('contacts.add_contact')}
                                            </h2>
                                            <button
                                                onClick={() => setShowAddModal(false)}
                                                className="rounded-lg p-1.5 transition-colors hover:bg-[var(--color-bg-elevated)]"
                                            >
                                                <X className="h-5 w-5" style={{ color: 'var(--color-text-muted)' }} />
                                            </button>
                                        </div>

                                        <div
                                            className="mb-4 flex items-center gap-3 rounded-xl px-4 py-3"
                                            style={{
                                                background: 'var(--color-bg-base)',
                                                border: '1px solid var(--color-border)',
                                            }}
                                        >
                                            <Search className="h-4 w-4 shrink-0" style={{ color: 'var(--color-text-muted)' }} />
                                            <input
                                                type="text"
                                                value={modalSearch}
                                                onChange={(e) => setModalSearch(e.target.value)}
                                                placeholder="Search by name or email..."
                                                className="flex-1 bg-transparent text-[14px] outline-none"
                                                style={{ color: 'var(--color-text-main)' }}
                                                autoFocus
                                            />
                                            {modalSearch && (
                                                <button onClick={() => setModalSearch('')} className="rounded-lg p-1 hover:opacity-80">
                                                    <X className="h-4 w-4" style={{ color: 'var(--color-text-muted)' }} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="max-h-64 space-y-2 overflow-y-auto">
                                            {modalSearching && (
                                                <div className="flex items-center justify-center py-8">
                                                    <div
                                                        className="h-6 w-6 animate-spin rounded-full border-2 border-transparent"
                                                        style={{
                                                            borderTopColor: 'var(--color-gold)',
                                                            borderRightColor: 'var(--color-gold)',
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            {!modalSearching && modalResults.length === 0 && modalSearch.length >= 2 && (
                                                <div
                                                    className="py-8 text-center text-[13px]"
                                                    style={{ color: 'var(--color-text-muted)' }}
                                                >
                                                    No users found
                                                </div>
                                            )}
                                            {!modalSearching && modalSearch.length < 2 && (
                                                <div
                                                    className="py-8 text-center text-[13px]"
                                                    style={{ color: 'var(--color-text-muted)' }}
                                                >
                                                    Type at least 2 characters to search
                                                </div>
                                            )}
                                            {modalResults.map((user) => {
                                                const alreadyContact = contacts.some((c) => c.user_id === user.id);
                                                return (
                                                    <div
                                                        key={user.id}
                                                        className="flex items-center gap-3 rounded-xl px-4 py-3"
                                                        style={{
                                                            background: 'var(--color-bg-base)',
                                                            border: '1px solid var(--color-border)',
                                                        }}
                                                    >
                                                        <div
                                                            className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold"
                                                            style={{
                                                                background: '#3B82F622',
                                                                color: '#3B82F6',
                                                                border: '1.5px solid #3B82F640',
                                                            }}
                                                        >
                                                            {getInitials(user.name)}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div
                                                                className="text-[13px] font-semibold truncate"
                                                                style={{ color: 'var(--color-text-main)' }}
                                                            >
                                                                {user.name || `User #${user.id}`}
                                                            </div>
                                                            <div
                                                                className="text-[11px] truncate"
                                                                style={{ color: 'var(--color-text-muted)' }}
                                                            >
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                        {!alreadyContact && (
                                                            <button
                                                                onClick={() => addContact(user)}
                                                                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[12px] font-semibold transition-all hover:opacity-80"
                                                                style={{
                                                                    background: 'var(--color-gold)',
                                                                    color: '#000',
                                                                }}
                                                            >
                                                                <UserPlus className="h-3.5 w-3.5" />
                                                                Add
                                                            </button>
                                                        )}
                                                        {alreadyContact && (
                                                            <span
                                                                className="text-[12px] font-medium"
                                                                style={{ color: 'var(--color-text-muted)' }}
                                                            >
                                                                Added
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    </div>
                </div>
            </div>
    );
}
