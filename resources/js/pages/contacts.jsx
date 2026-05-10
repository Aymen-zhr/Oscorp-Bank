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
                                onClick={() => setShowAddModal(true)}
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
                        {searchQuery.length >= 2 &&
                            searchResults.length > 0 && (
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
                                                            {user.name}
                                                        </div>
                                                        <div
                                                            className="text-[12px]"
                                                            style={{
                                                                color: 'var(--color-text-muted)',
                                                            }}
                                                        >
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                    {isContact ? (
                                                        <span
                                                            className="rounded-full px-3 py-1.5 text-[11px] font-medium"
                                                            style={{
                                                                background:
                                                                    'rgba(16,185,129,0.12)',
                                                                color: COLORS.credit,
                                                            }}
                                                        >
                                                            {t(
                                                                'contacts.already_in_contacts',
                                                            )}
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                addContact(user)
                                                            }
                                                            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-semibold transition-all hover:opacity-80"
                                                            style={{
                                                                background:
                                                                    'var(--color-gold)',
                                                                color: '#000',
                                                            }}
                                                        >
                                                            <UserPlus className="h-3.5 w-3.5" />{' '}
                                                            {t('common.add')}
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                        {/* Pending Requests */}
                        {pendingRequests.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <h3
                                    className="mb-3 flex items-center gap-2 text-[14px] font-bold"
                                    style={{ color: COLORS.warning }}
                                >
                                    <Clock className="h-4 w-4" />
                                    Incoming Requests ({pendingRequests.length})
                                </h3>
                                <div className="space-y-2">
                                    {pendingRequests.map((request) => (
                                        <div
                                            key={request.id}
                                            className="flex items-center gap-4 rounded-2xl px-5 py-3"
                                            style={{
                                                background:
                                                    'rgba(245,158,11,0.05)',
                                                border: '1px solid rgba(245,158,11,0.2)',
                                            }}
                                        >
                                            <div
                                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[14px] font-bold"
                                                style={{
                                                    background:
                                                        'rgba(245,158,11,0.1)',
                                                    color: COLORS.warning,
                                                    border: '1.5px solid rgba(245,158,11,0.3)',
                                                }}
                                            >
                                                {getInitials(request.name)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div
                                                    className="text-[14px] font-semibold"
                                                    style={{
                                                        color: 'var(--color-text-main)',
                                                    }}
                                                >
                                                    {request.name}
                                                </div>
                                                <div
                                                    className="text-[12px]"
                                                    style={{
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    {request.email}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        acceptRequest(
                                                            request.id,
                                                        )
                                                    }
                                                    className="rounded-xl px-3 py-1.5 text-[12px] font-bold transition-all hover:brightness-110"
                                                    style={{
                                                        background:
                                                            'var(--color-gold)',
                                                        color: '#000',
                                                    }}
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        denyRequest(request.id)
                                                    }
                                                    className="rounded-xl border border-red-500/30 px-3 py-1.5 text-[12px] font-medium text-red-400 transition-colors hover:bg-red-500/10"
                                                >
                                                    Deny
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Contacts List */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h2
                                className="mb-3 flex items-center gap-2 text-[16px] font-bold"
                                style={{ color: 'var(--color-text-main)' }}
                            >
                                <Users
                                    className="h-4 w-4"
                                    style={{ color: 'var(--color-gold)' }}
                                />
                                {t('contacts.your_contacts_list', {
                                    count: filteredContacts.length,
                                })}
                            </h2>

                            {filteredContacts.length === 0 ? (
                                <div
                                    className="flex flex-col items-center gap-3 rounded-2xl py-16"
                                    style={{
                                        background: 'var(--color-bg-card)',
                                        border: '1px solid var(--color-border)',
                                    }}
                                >
                                    <Users
                                        className="h-10 w-10"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                        }}
                                    />
                                    <p
                                        className="text-[16px] font-semibold"
                                        style={{
                                            color: 'var(--color-text-main)',
                                        }}
                                    >
                                        {searchQuery
                                            ? t('contacts.no_contacts_found')
                                            : t('contacts.no_contacts_yet')}
                                    </p>
                                    <p
                                        className="text-[13px]"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                        }}
                                    >
                                        {searchQuery
                                            ? t('common.try_different_search')
                                            : t('contacts.add_people_to_start')}
                                    </p>
                                    {!searchQuery && (
                                        <button
                                            onClick={() =>
                                                setShowAddModal(true)
                                            }
                                            className="mt-2 rounded-xl px-5 py-2 text-[13px] font-semibold"
                                            style={{
                                                background: 'var(--color-gold)',
                                                color: '#000',
                                            }}
                                        >
                                            {t('contacts.add_contact')}
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredContacts.map((contact) => {
                                        const isEditing =
                                            editingContact === contact.id;
                                        const hasSplits =
                                            contactStats.recent_splits?.some(
                                                (s) =>
                                                    s.user_id ===
                                                    contact.user_id,
                                            );
                                        const splitCount =
                                            contactStats.recent_splits?.find(
                                                (s) =>
                                                    s.user_id ===
                                                    contact.user_id,
                                            )?.split_count || 0;

                                        return (
                                            <div
                                                key={contact.id}
                                                className="rounded-2xl"
                                                style={{
                                                    background:
                                                        'var(--color-bg-card)',
                                                    border: '1px solid var(--color-border)',
                                                }}
                                            >
                                                <div className="flex items-center gap-4 px-5 py-3">
                                                    <div
                                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[14px] font-bold"
                                                        style={{
                                                            background:
                                                                (contact.avatar_color ||
                                                                    '#64748B') +
                                                                '22',
                                                            color:
                                                                contact.avatar_color ||
                                                                '#64748B',
                                                            border: `1.5px solid ${contact.avatar_color || '#64748B'}40`,
                                                        }}
                                                    >
                                                        {getInitials(
                                                            contact.name,
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            {isEditing ? (
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        data.name
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setData(
                                                                            'name',
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    placeholder={t(
                                                                        'contacts.nickname_placeholder',
                                                                    )}
                                                                    className="border-gold/30 border-b bg-transparent text-[14px] font-semibold outline-none"
                                                                    style={{
                                                                        color: 'var(--color-text-main)',
                                                                    }}
                                                                    autoFocus
                                                                />
                                                            ) : (
                                                                <span
                                                                    className="text-[14px] font-semibold"
                                                                    style={{
                                                                        color: 'var(--color-text-main)',
                                                                    }}
                                                                >
                                                                    {
                                                                        contact.name
                                                                    }
                                                                </span>
                                                            )}
                                                            {hasSplits && (
                                                                <span
                                                                    className="rounded-full px-2 py-0.5 text-[10px]"
                                                                    style={{
                                                                        background:
                                                                            'rgba(59,130,246,0.12)',
                                                                        color: '#3B82F6',
                                                                    }}
                                                                >
                                                                    {splitCount}{' '}
                                                                    {splitCount >
                                                                    1
                                                                        ? t(
                                                                              'common.split_bills',
                                                                          )
                                                                        : t(
                                                                              'common.split_bills',
                                                                          )}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="mt-0.5 flex items-center gap-3">
                                                            <span
                                                                className="text-[12px]"
                                                                style={{
                                                                    color: 'var(--color-text-muted)',
                                                                }}
                                                            >
                                                                {contact.email}
                                                            </span>
                                                            {contact.nickname && (
                                                                <span
                                                                    className="rounded-full px-1.5 py-0.5 text-[10px]"
                                                                    style={{
                                                                        background:
                                                                            'rgba(212,175,55,0.12)',
                                                                        color: 'var(--color-gold)',
                                                                    }}
                                                                >
                                                                    "
                                                                    {
                                                                        contact.nickname
                                                                    }
                                                                    "
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {isEditing ? (
                                                            <>
                                                                <button
                                                                    onClick={() =>
                                                                        saveNickname(
                                                                            contact.user_id,
                                                                            data.name,
                                                                        )
                                                                    }
                                                                    className="rounded-lg p-2 hover:opacity-80"
                                                                    style={{
                                                                        background:
                                                                            'rgba(16,185,129,0.1)',
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className="h-4 w-4"
                                                                        style={{
                                                                            color: COLORS.credit,
                                                                        }}
                                                                    />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingContact(
                                                                            null,
                                                                        );
                                                                        reset();
                                                                    }}
                                                                    className="rounded-lg p-2 hover:opacity-80"
                                                                    style={{
                                                                        background:
                                                                            'rgba(239,68,68,0.1)',
                                                                    }}
                                                                >
                                                                    <X
                                                                        className="h-4 w-4"
                                                                        style={{
                                                                            color: COLORS.debit,
                                                                        }}
                                                                    />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingContact(
                                                                            contact.id,
                                                                        );
                                                                        setData(
                                                                            'name',
                                                                            contact.nickname ||
                                                                                '',
                                                                        );
                                                                    }}
                                                                    className="rounded-lg p-2 transition-all hover:opacity-80"
                                                                    style={{
                                                                        background:
                                                                            'var(--color-bg-elevated)',
                                                                    }}
                                                                >
                                                                    <Edit2
                                                                        className="h-3.5 w-3.5"
                                                                        style={{
                                                                            color: 'var(--color-text-muted)',
                                                                        }}
                                                                    />
                                                                </button>
                                                                <div className="relative">
                                                                    <button
                                                                        onClick={() =>
                                                                            setShowActions(
                                                                                showActions ===
                                                                                    contact.id
                                                                                    ? null
                                                                                    : contact.id,
                                                                            )
                                                                        }
                                                                        className="rounded-lg p-2 transition-all hover:opacity-80"
                                                                        style={{
                                                                            background:
                                                                                'var(--color-bg-elevated)',
                                                                        }}
                                                                    >
                                                                        <MoreVertical
                                                                            className="h-3.5 w-3.5"
                                                                            style={{
                                                                                color: 'var(--color-text-muted)',
                                                                            }}
                                                                        />
                                                                    </button>
                                                                    <AnimatePresence>
                                                                        {showActions ===
                                                                            contact.id && (
                                                                            <motion.div
                                                                                initial={{
                                                                                    opacity: 0,
                                                                                    y: -5,
                                                                                }}
                                                                                animate={{
                                                                                    opacity: 1,
                                                                                    y: 0,
                                                                                }}
                                                                                exit={{
                                                                                    opacity: 0,
                                                                                    y: -5,
                                                                                }}
                                                                                className="absolute top-full right-0 z-50 mt-1 w-48 overflow-hidden rounded-xl"
                                                                                style={{
                                                                                    background:
                                                                                        'var(--color-bg-card)',
                                                                                    border: '1px solid var(--color-border)',
                                                                                    boxShadow:
                                                                                        '0 10px 30px rgba(0,0,0,0.2)',
                                                                                }}
                                                                            >
                                                                                <div className="py-1">
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            setEditingContact(
                                                                                                contact.id,
                                                                                            );
                                                                                            setData(
                                                                                                'name',
                                                                                                contact.nickname ||
                                                                                                    '',
                                                                                            );
                                                                                            setShowActions(
                                                                                                null,
                                                                                            );
                                                                                        }}
                                                                                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] transition-all hover:opacity-80"
                                                                                        style={{
                                                                                            color: 'var(--color-text-main)',
                                                                                        }}
                                                                                    >
                                                                                        <Edit2 className="h-3.5 w-3.5" />{' '}
                                                                                        {t(
                                                                                            'contacts.edit_nickname',
                                                                                        )}
                                                                                    </button>
                                                                                    <button
                                                                                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] transition-all hover:opacity-80"
                                                                                        style={{
                                                                                            color: 'var(--color-text-main)',
                                                                                        }}
                                                                                    >
                                                                                        <MessageSquare className="h-3.5 w-3.5" />{' '}
                                                                                        {t(
                                                                                            'contacts.send_message',
                                                                                        )}
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() =>
                                                                                            removeContact(
                                                                                                contact.id,
                                                                                            )
                                                                                        }
                                                                                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] text-red-400 transition-all hover:opacity-80"
                                                                                    >
                                                                                        <Trash2 className="h-3.5 w-3.5" />{' '}
                                                                                        {t(
                                                                                            'contacts.remove_contact',
                                                                                        )}
                                                                                    </button>
                                                                                </div>
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Add Contact Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ background: 'rgba(0,0,0,0.6)' }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-md overflow-hidden rounded-2xl"
                            style={{
                                background: 'var(--color-bg-card)',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            <div
                                className="flex items-center justify-between border-b px-6 py-4"
                                style={{
                                    borderBottomColor: 'var(--color-border)',
                                }}
                            >
                                <h2
                                    className="text-[18px] font-bold"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    {t('contacts.add_contact_modal')}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setSearchQuery('');
                                        setSearchResults([]);
                                    }}
                                    className="rounded-xl p-2 hover:opacity-80"
                                    style={{
                                        background: 'var(--color-bg-elevated)',
                                    }}
                                >
                                    <X
                                        className="h-4 w-4"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                        }}
                                    />
                                </button>
                            </div>

                            <div className="p-6">
                                <div
                                    className="mb-4 flex items-center gap-2 rounded-xl px-4 py-3"
                                    style={{
                                        background: 'var(--color-bg-elevated)',
                                        border: '1px solid var(--color-border)',
                                    }}
                                >
                                    <Search
                                        className="h-4 w-4 shrink-0"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                        }}
                                    />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        placeholder={t(
                                            'contacts.search_by_name_email',
                                        )}
                                        className="flex-1 bg-transparent text-[14px] outline-none"
                                        style={{
                                            color: 'var(--color-text-main)',
                                        }}
                                    />
                                </div>

                                {searching && (
                                    <div className="py-8 text-center">
                                        <div
                                            className="inline-block h-6 w-6 animate-spin rounded-full border-2"
                                            style={{
                                                borderColor:
                                                    'var(--color-gold)',
                                                borderTopColor: 'transparent',
                                            }}
                                        />
                                    </div>
                                )}

                                {searchResults.length > 0 && !searching && (
                                    <div className="max-h-80 space-y-2 overflow-y-auto">
                                        {searchResults.map((user) => {
                                            const isContact = contacts.some(
                                                (c) => c.user_id === user.id,
                                            );
                                            return (
                                                <div
                                                    key={user.id}
                                                    className="flex items-center gap-3 rounded-xl px-3 py-2"
                                                    style={{
                                                        background:
                                                            'var(--color-bg-elevated)',
                                                        border: '1px solid var(--color-border)',
                                                    }}
                                                >
                                                    <div
                                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold"
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
                                                            className="text-[13px] font-medium"
                                                            style={{
                                                                color: 'var(--color-text-main)',
                                                            }}
                                                        >
                                                            {user.name}
                                                        </div>
                                                        <div
                                                            className="text-[10px]"
                                                            style={{
                                                                color: 'var(--color-text-muted)',
                                                            }}
                                                        >
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                    {isContact ? (
                                                        <span
                                                            className="text-[10px]"
                                                            style={{
                                                                color: COLORS.credit,
                                                            }}
                                                        >
                                                            {t(
                                                                'common.already_added',
                                                            )}
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                addContact(user)
                                                            }
                                                            className="rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all hover:opacity-80"
                                                            style={{
                                                                background:
                                                                    'var(--color-gold)',
                                                                color: '#000',
                                                            }}
                                                        >
                                                            {t('common.add')}
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {searchQuery.length >= 2 &&
                                    !searching &&
                                    searchResults.length === 0 && (
                                        <div className="py-8 text-center">
                                            <p
                                                className="text-[14px] font-medium"
                                                style={{
                                                    color: 'var(--color-text-main)',
                                                }}
                                            >
                                                {t('common.no_users_found')}
                                            </p>
                                            <p
                                                className="mt-1 text-[12px]"
                                                style={{
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                {t(
                                                    'common.try_different_search',
                                                )}
                                            </p>
                                        </div>
                                    )}

                                {!searchQuery && (
                                    <div className="py-8 text-center">
                                        <Users
                                            className="mx-auto mb-3 h-10 w-10"
                                            style={{
                                                color: 'var(--color-text-muted)',
                                            }}
                                        />
                                        <p
                                            className="text-[14px] font-medium"
                                            style={{
                                                color: 'var(--color-text-main)',
                                            }}
                                        >
                                            {t('contacts.search_for_users')}
                                        </p>
                                        <p
                                            className="mt-1 text-[12px]"
                                            style={{
                                                color: 'var(--color-text-muted)',
                                            }}
                                        >
                                            {t('contacts.type_name_email')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
