import { Head, router, useForm } from '@inertiajs/react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { useTranslation } from '@/hooks/useTranslation';
import {
    UserPlus, Search, X, Users, Mail, Trash2, Edit2, Check,
    MoreVertical, Phone, MessageSquare, Split, Clock, ArrowRight,
    Sparkles, Hash
} from 'lucide-react';

const AVATAR_COLORS = ['#D4AF37', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#EF4444', '#06B6D4'];

export default function Contacts({ balance, contacts = [], contactStats = {} }) {
    const { t } = useTranslation();
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
            const res = await fetch(`/contacts/search?q=${encodeURIComponent(query)}`);
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
        return contacts.filter(c =>
            c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            (c.nickname && c.nickname.toLowerCase().includes(q))
        );
    }, [contacts, searchQuery]);

    const addContact = (user) => {
        post('/contacts', {
            data: {
                contact_user_id: user.id,
                nickname: null,
                avatar_color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
            },
            onSuccess: () => {
                setSearchQuery('');
                setSearchResults([]);
            },
        });
    };

    const removeContact = (contactId) => {
        router.delete(`/contacts/${contactId}`);
        setShowActions(null);
    };

    const saveNickname = (contactId, nickname) => {
        post('/contacts', {
            data: {
                contact_user_id: contactId,
                nickname: nickname || null,
            },
            onSuccess: () => setEditingContact(null),
        });
    };

    const fmtCurrency = (amount) => {
        return Number(amount).toLocaleString('en-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const fmtDate = (date) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString('en-MA', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
            <Head title="OSCORP | Contacts" />
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />

                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-5xl mx-auto px-6 py-5 space-y-5">

                        {/* Header */}
                        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
                            className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-[26px] font-bold tracking-tight" style={{ color: 'var(--color-text-main)' }}>
                                    {t('contacts.title')}
                                </h1>
                                <p className="text-[13px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                                    {t('contacts.subtitle')}
                                </p>
                            </div>
                            <button onClick={() => setShowAddModal(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all hover:opacity-80"
                                style={{ background: 'var(--color-gold)', color: '#000' }}>
                                <UserPlus className="w-4 h-4" /> {t('contacts.add_contact')}
                            </button>
                        </motion.div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: 'contacts.total_contacts', value: contactStats.total || 0, color: 'var(--color-gold)', Icon: Users, sub: 'contacts.people_in_network' },
                                { label: 'contacts.active_splits', value: contactStats.recent_splits?.reduce((sum, s) => sum + s.split_count, 0) || 0, color: '#3B82F6', Icon: Split, sub: 'contacts.shared_bills' },
                                { label: 'contacts.frequent_partners', value: (contactStats.recent_splits?.length || 0), color: '#10B981', Icon: Hash, sub: 'contacts.regular_splitters' },
                            ].map(({ label, value, color, Icon, sub }, i) => (
                                <motion.div key={label}
                                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * (i + 1) }}
                                    className="p-4 rounded-2xl" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                            style={{ background: color + '18', border: `1px solid ${color}30` }}>
                                            <Icon className="w-5 h-5" style={{ color }} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>{t(label)}</div>
                                            <div className="text-[20px] font-bold leading-none" style={{ color }}>{value}</div>
                                        </div>
                                    </div>
                                    <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{t(sub)}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Search Bar */}
                        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                            <Search className="w-5 h-5 shrink-0" style={{ color: 'var(--color-text-muted)' }} />
                            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                placeholder={t('contacts.search_placeholder')}
                                className="flex-1 bg-transparent text-[14px] outline-none"
                                style={{ color: 'var(--color-text-main)' }} />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="p-1 rounded-lg hover:opacity-80">
                                    <X className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                                </button>
                            )}
                        </div>

                        {/* Search Results (when searching) */}
                        {searchQuery.length >= 2 && searchResults.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <h3 className="text-[14px] font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text-main)' }}>
                                    <Sparkles className="w-4 h-4" style={{ color: '#8B5CF6' }} />
                                    {t('common.search_results')}
                                </h3>
                                <div className="space-y-2">
                                    {searchResults.map((user) => {
                                        const isContact = contacts.some(c => c.user_id === user.id);
                                        return (
                                            <div key={user.id} className="flex items-center gap-4 px-5 py-3 rounded-2xl"
                                                style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold"
                                                    style={{ background: '#3B82F622', color: '#3B82F6', border: '1.5px solid #3B82F640' }}>
                                                    {getInitials(user.name)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[14px] font-semibold" style={{ color: 'var(--color-text-main)' }}>{user.name}</div>
                                                    <div className="text-[12px]" style={{ color: 'var(--color-text-muted)' }}>{user.email}</div>
                                                </div>
                                                {isContact ? (
                                                    <span className="text-[11px] font-medium px-3 py-1.5 rounded-full" style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>
                                                        {t('contacts.already_in_contacts')}
                                                    </span>
                                                ) : (
                                                    <button onClick={() => addContact(user)}
                                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all hover:opacity-80"
                                                        style={{ background: 'var(--color-gold)', color: '#000' }}>
                                                        <UserPlus className="w-3.5 h-3.5" /> {t('common.add')}
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* Contacts List */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                            <h2 className="text-[16px] font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text-main)' }}>
                                <Users className="w-4 h-4" style={{ color: 'var(--color-gold)' }} />
                                {t('contacts.your_contacts_list', { count: filteredContacts.length })}
                            </h2>

                            {filteredContacts.length === 0 ? (
                                <div className="rounded-2xl py-16 flex flex-col items-center gap-3"
                                    style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                    <Users className="w-10 h-10" style={{ color: 'var(--color-text-muted)' }} />
                                    <p className="text-[16px] font-semibold" style={{ color: 'var(--color-text-main)' }}>
                                        {searchQuery ? t('contacts.no_contacts_found') : t('contacts.no_contacts_yet')}
                                    </p>
                                    <p className="text-[13px]" style={{ color: 'var(--color-text-muted)' }}>
                                        {searchQuery ? t('common.try_different_search') : t('contacts.add_people_to_start')}
                                    </p>
                                    {!searchQuery && (
                                        <button onClick={() => setShowAddModal(true)} className="mt-2 px-5 py-2 rounded-xl text-[13px] font-semibold"
                                            style={{ background: 'var(--color-gold)', color: '#000' }}>{t('contacts.add_contact')}</button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredContacts.map((contact) => {
                                        const isEditing = editingContact === contact.id;
                                        const hasSplits = contactStats.recent_splits?.some(s => s.user_id === contact.user_id);
                                        const splitCount = contactStats.recent_splits?.find(s => s.user_id === contact.user_id)?.split_count || 0;

                                        return (
                                            <div key={contact.id} className="rounded-2xl overflow-hidden" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                                <div className="flex items-center gap-4 px-5 py-3">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0"
                                                        style={{ background: (contact.avatar_color || '#64748B') + '22', color: contact.avatar_color || '#64748B', border: `1.5px solid ${(contact.avatar_color || '#64748B')}40` }}>
                                                        {getInitials(contact.name)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            {isEditing ? (
                                                                <input type="text" value={contact.nickname || ''}
                                                                    onChange={e => setData('name', e.target.value)}
                                                                    placeholder="Set nickname"
                                                                    className="bg-transparent text-[14px] font-semibold outline-none"
                                                                    style={{ color: 'var(--color-text-main)' }} />
                                                            ) : (
                                                                <span className="text-[14px] font-semibold" style={{ color: 'var(--color-text-main)' }}>
                                                                    {contact.name}
                                                                </span>
                                                            )}
                                                            {hasSplits && (
                                                                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.12)', color: '#3B82F6' }}>
                                                                    {splitCount} {splitCount > 1 ? t('common.split_bills') : t('common.split_bills')}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-0.5">
                                                            <span className="text-[12px]" style={{ color: 'var(--color-text-muted)' }}>{contact.email}</span>
                                                            {contact.nickname && (
                                                                <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.12)', color: 'var(--color-gold)' }}>
                                                                    "{contact.nickname}"
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {isEditing ? (
                                                            <>
                                                                <button onClick={() => saveNickname(contact.id, data.name)}
                                                                    className="p-2 rounded-lg hover:opacity-80" style={{ background: 'rgba(16,185,129,0.1)' }}>
                                                                    <Check className="w-4 h-4" style={{ color: '#10B981' }} />
                                                                </button>
                                                                <button onClick={() => { setEditingContact(null); reset(); }}
                                                                    className="p-2 rounded-lg hover:opacity-80" style={{ background: 'rgba(239,68,68,0.1)' }}>
                                                                    <X className="w-4 h-4" style={{ color: '#EF4444' }} />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button onClick={() => { setEditingContact(contact.id); setData('name', contact.nickname || ''); }}
                                                                    className="p-2 rounded-lg hover:opacity-80 transition-all"
                                                                    style={{ background: 'var(--color-bg-elevated)' }}>
                                                                    <Edit2 className="w-3.5 h-3.5" style={{ color: 'var(--color-text-muted)' }} />
                                                                </button>
                                                                <div className="relative">
                                                                    <button onClick={() => setShowActions(showActions === contact.id ? null : contact.id)}
                                                                        className="p-2 rounded-lg hover:opacity-80 transition-all"
                                                                        style={{ background: 'var(--color-bg-elevated)' }}>
                                                                        <MoreVertical className="w-3.5 h-3.5" style={{ color: 'var(--color-text-muted)' }} />
                                                                    </button>
                                                                    <AnimatePresence>
                                                                        {showActions === contact.id && (
                                                                            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                                                                className="absolute right-0 top-full mt-1 w-48 rounded-xl overflow-hidden z-10"
                                                                                style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                                                                                 <div className="py-1">
                                                                                     <button onClick={() => { setEditingContact(contact.id); setData('name', contact.nickname || ''); setShowActions(null); }}
                                                                                         className="flex items-center gap-2 w-full px-4 py-2.5 text-[13px] text-left transition-all hover:opacity-80"
                                                                                         style={{ color: 'var(--color-text-main)' }}>
                                                                                         <Edit2 className="w-3.5 h-3.5" /> {t('contacts.edit_nickname')}
                                                                                     </button>
                                                                                     <button
                                                                                         className="flex items-center gap-2 w-full px-4 py-2.5 text-[13px] text-left transition-all hover:opacity-80"
                                                                                         style={{ color: 'var(--color-text-main)' }}>
                                                                                         <MessageSquare className="w-3.5 h-3.5" /> {t('contacts.send_message')}
                                                                                     </button>
                                                                                     <button onClick={() => removeContact(contact.id)}
                                                                                         className="flex items-center gap-2 w-full px-4 py-2.5 text-[13px] text-left text-red-400 transition-all hover:opacity-80">
                                                                                         <Trash2 className="w-3.5 h-3.5" /> {t('contacts.remove_contact')}
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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-md rounded-2xl overflow-hidden"
                            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderBottomColor: 'var(--color-border)' }}>
                                <h2 className="text-[18px] font-bold" style={{ color: 'var(--color-text-main)' }}>{t('contacts.add_contact_modal')}</h2>
                                <button onClick={() => { setShowAddModal(false); setSearchQuery(''); setSearchResults([]); }}
                                    className="p-2 rounded-xl hover:opacity-80" style={{ background: 'var(--color-bg-elevated)' }}>
                                    <X className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
                                    <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--color-text-muted)' }} />
                                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                        placeholder={t('contacts.search_by_name_email')}
                                        className="flex-1 bg-transparent text-[14px] outline-none"
                                        style={{ color: 'var(--color-text-main)' }} />
                                </div>

                                {searching && (
                                    <div className="text-center py-8">
                                        <div className="inline-block w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--color-gold)', borderTopColor: 'transparent' }} />
                                    </div>
                                )}

                                {searchResults.length > 0 && !searching && (
                                    <div className="space-y-2 max-h-80 overflow-y-auto">
                                        {searchResults.map((user) => {
                                            const isContact = contacts.some(c => c.user_id === user.id);
                                            return (
                                                <div key={user.id} className="flex items-center gap-3 px-3 py-2 rounded-xl"
                                                    style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
                                                        style={{ background: '#3B82F622', color: '#3B82F6', border: '1.5px solid #3B82F640' }}>
                                                        {getInitials(user.name)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[13px] font-medium" style={{ color: 'var(--color-text-main)' }}>{user.name}</div>
                                                        <div className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{user.email}</div>
                                                    </div>
                                                    {isContact ? (
                                                        <span className="text-[10px]" style={{ color: '#10B981' }}>{t('common.already_added')}</span>
                                                    ) : (
                                                        <button onClick={() => addContact(user)}
                                                            className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all hover:opacity-80"
                                                            style={{ background: 'var(--color-gold)', color: '#000' }}>
                                                            {t('common.add')}
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-[14px] font-medium" style={{ color: 'var(--color-text-main)' }}>{t('common.no_users_found')}</p>
                                        <p className="text-[12px] mt-1" style={{ color: 'var(--color-text-muted)' }}>{t('common.try_different_search')}</p>
                                    </div>
                                )}

                                {!searchQuery && (
                                    <div className="text-center py-8">
                                        <Users className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} />
                                        <p className="text-[14px] font-medium" style={{ color: 'var(--color-text-main)' }}>{t('contacts.search_for_users')}</p>
                                        <p className="text-[12px] mt-1" style={{ color: 'var(--color-text-muted)' }}>{t('contacts.type_name_email')}</p>
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
