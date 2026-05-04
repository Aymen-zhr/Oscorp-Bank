import { Head, router, useForm } from '@inertiajs/react';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import {
    Plus, X, Users, Receipt, Tv, Music, Gamepad2, Palette,
    Utensils, Wifi, CheckCircle2, Clock, Trash2,
    Wallet, ArrowUpRight, ArrowDownLeft, ChevronDown, ChevronUp,
    Calendar, Hash, Sparkles, CreditCard, XCircle, ShieldCheck,
    UserPlus, Search, Bell, RefreshCw, Download, Repeat
} from 'lucide-react';
import { AVATAR_COLORS, QUICK_BILL_ICONS as QUICK_BILL_COLORS, ROUTES } from '@/constants';

const QUICK_BILL_ICONS = [
    { value: 'tv', icon: Tv, labelKey: 'split_bills.bill_icons.netflix', color: QUICK_BILL_COLORS[0].color },
    { value: 'music', icon: Music, labelKey: 'split_bills.bill_icons.spotify', color: QUICK_BILL_COLORS[1].color },
    { value: 'gamepad-2', icon: Gamepad2, labelKey: 'split_bills.bill_icons.xbox', color: QUICK_BILL_COLORS[2].color },
    { value: 'palette', icon: Palette, labelKey: 'split_bills.bill_icons.adobe', color: QUICK_BILL_COLORS[3].color },
    { value: 'utensils', icon: Utensils, labelKey: 'split_bills.bill_icons.dining', color: QUICK_BILL_COLORS[4].color },
    { value: 'wifi', icon: Wifi, labelKey: 'split_bills.bill_icons.internet', color: QUICK_BILL_COLORS[5].color },
    { value: 'receipt', icon: Receipt, labelKey: 'split_bills.bill_icons.other', color: QUICK_BILL_COLORS[6].color },
];

function getIconComponent(name) {
    const option = QUICK_BILL_ICONS.find(o => o.value === name);
    return option ? option.icon : Receipt;
}

export default function SplitBills({ balance, userId, splits = [], summary = {}, suggestedBills = [], contacts = [] }) {
    const { t, locale } = useTranslation();
    const { format, code } = useCurrency();
    const isMe = (p) => p.user_id === userId;
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showContacts, setShowContacts] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [expandedSplit, setExpandedSplit] = useState(null);
    const [contactSearch, setContactSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [showRemindModal, setShowRemindModal] = useState(null);
    const [showRecurringModal, setShowRecurringModal] = useState(null);
    const [recurringPeriod, setRecurringPeriod] = useState('monthly');

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        total_amount: '',
        icon: 'receipt',
        logo_color: '#D4AF37',
        split_type: 'equal',
        due_date: '',
        is_recurring: false,
        recurring_period: 'monthly',
        participants: [
            { name: 'You', user_id: null, tag: '@me', avatar_color: AVATAR_COLORS[0], share_amount: '', is_you: true, has_paid: false },
        ],
    });

    const searchUsers = useCallback(async (query) => {
        if (!query || query.length < 2) {
            setSearchResults([]);
            return;
        }
        setSearching(true);
        try {
            const res = await fetch(`${ROUTES.contacts}/search?q=${encodeURIComponent(query)}`);
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
            if (contactSearch.length >= 2) {
                searchUsers(contactSearch);
            } else {
                setSearchResults([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [contactSearch, searchUsers]);

    // Using useCurrency hook instead of fmtCurrency

    const fmtDate = (date) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString(locale || 'en-MA', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const sharePerPerson = useMemo(() => {
        if (!data.total_amount || data.participants.length === 0) return 0;
        return parseFloat(data.total_amount) / data.participants.length;
    }, [data.total_amount, data.participants.length]);

    const allContacts = useMemo(() => {
        const contactList = contacts.map(c => ({
            id: c.id,
            name: c.name,
            tag: `@${c.name.toLowerCase().replace(/\s+/g, '_')}`,
            color: c.avatar_color || AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
            avatar: c.avatar,
            is_contact: true,
        }));
        return contactList;
    }, [contacts]);

    const filteredContacts = useMemo(() => {
        if (!contactSearch) return allContacts;
        const q = contactSearch.toLowerCase();
        return allContacts.filter(c =>
            c.name.toLowerCase().includes(q) || c.tag.toLowerCase().includes(q)
        );
    }, [contactSearch, allContacts]);

    const addParticipant = () => {
        const colors = AVATAR_COLORS.filter(c => !data.participants.some(p => p.avatar_color === c));
        setData('participants', [
            ...data.participants,
            { name: '', user_id: null, tag: '', avatar_color: colors[0] || AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)], share_amount: '', is_you: false, has_paid: false, partial_paid: 0 },
        ]);
    };

    const addContact = (contact) => {
        if (data.participants.some(p => p.user_id === contact.id)) return;
        const colors = AVATAR_COLORS.filter(c => !data.participants.some(p => p.avatar_color === c));
        setData('participants', [
            ...data.participants,
            { name: contact.name, user_id: contact.id, tag: contact.tag, avatar_color: contact.color, share_amount: '', is_you: false, has_paid: false, partial_paid: 0 },
        ]);
    };

    const addSearchResult = (user) => {
        if (data.participants.some(p => p.user_id === user.id)) return;
        const colors = AVATAR_COLORS.filter(c => !data.participants.some(p => p.avatar_color === c));
        setData('participants', [
            ...data.participants,
            { name: user.name, user_id: user.id, tag: `@${user.name.toLowerCase().replace(/\s+/g, '_')}`, avatar_color: colors[0] || AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)], share_amount: '', is_you: false, has_paid: false, partial_paid: 0 },
        ]);
    };

    const removeParticipant = (index) => {
        if (data.participants[index].is_you) return;
        const updated = [...data.participants];
        updated.splice(index, 1);
        setData('participants', updated);
    };

    const updateParticipant = (index, field, value) => {
        const updated = [...data.participants];
        updated[index] = { ...updated[index], [field]: value };
        setData('participants', updated);
    };

    const selectPreset = (bill) => {
        const presetContacts = allContacts.slice(0, bill.participants - 1);
        setData({
            ...data,
            title: bill.title,
            description: bill.description,
            total_amount: bill.typical_amount.toString(),
            icon: bill.icon,
            logo_color: bill.color,
            split_type: 'equal',
            due_date: '',
            is_recurring: false,
            recurring_period: 'monthly',
            participants: [
                { name: 'You', user_id: null, tag: '@me', avatar_color: AVATAR_COLORS[0], share_amount: '', is_you: true, has_paid: false, partial_paid: 0 },
                ...presetContacts.map(c => ({
                    name: c.name,
                    user_id: c.id,
                    tag: c.tag,
                    avatar_color: c.color,
                    share_amount: '',
                    is_you: false,
                    has_paid: false,
                    partial_paid: 0,
                })),
            ],
        });
        setShowCreateModal(true);
        setShowSuggestions(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/split-bills', {
            onSuccess: () => {
                reset();
                setShowCreateModal(false);
                setExpandedSplit(null);
            },
        });
    };

    const handleRespond = (splitId, status) => {
        router.post(`/split-bills/${splitId}/respond`, { status });
    };

    const handlePay = (id, amount = null) => {
        if (amount) {
            router.post(`/split-bills/${id}/pay`, { partial_amount: amount });
        } else {
            router.post(`/split-bills/${id}/pay`);
        }
    };

    const handleSettle = (id) => {
        router.post(`/split-bills/${id}/settle`);
    };

    const handleDelete = (id) => {
        router.delete(`/split-bills/${id}`);
    };

    const handleRemind = (splitId) => {
        router.post(`/split-bills/${splitId}/remind`);
        setShowRemindModal(null);
    };

    const handleExportCSV = () => {
        window.location.href = '/split-bills/export';
    };

    const toggleContactsModal = () => {
        setShowContacts(v => !v);
        setShowSearch(false);
        setContactSearch('');
        setSearchResults([]);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
            <Head title="OSCORP | Split Bills" />
            <Sidebar active="split-bills" />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />

                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-5xl mx-auto px-6 py-5 space-y-5">

                        {/* Header */}
                        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
                            className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-[26px] font-bold tracking-tight" style={{ color: 'var(--color-text-main)' }}>
                                    {t('split_bills.title')}
                                </h1>
                                <p className="text-[13px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                                    {t('split_bills.subtitle')}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={handleExportCSV}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all"
                                    style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                    <Download className="w-4 h-4" /> {t('split_bills.export')}
                                </button>
                                <button onClick={() => setShowSuggestions(v => !v)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all"
                                    style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                    <Sparkles className="w-4 h-4" /> {t('split_bills.quick_bills')}
                                </button>
                                <button onClick={() => setShowCreateModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all hover:opacity-80"
                                    style={{ background: 'var(--color-gold)', color: '#000' }}>
                                    <Plus className="w-4 h-4" /> {t('split_bills.new_split')}
                                </button>
                            </div>
                        </motion.div>

                        {/* Quick Bills Suggestions */}
                        <AnimatePresence>
                            {showSuggestions && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                    <div className="p-5 rounded-2xl" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                        <h3 className="text-[14px] font-semibold mb-3" style={{ color: 'var(--color-text-main)' }}>
                                            {t('split_bills.quick_bill_templates')}
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {suggestedBills.map((bill, i) => {
                                                const Icon = getIconComponent(bill.icon);
                                                return (
                                                    <button key={i} onClick={() => selectPreset(bill)}
                                                        className="flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:opacity-80"
                                                        style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
                                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                                            style={{ background: bill.color + '18', border: `1px solid ${bill.color}30` }}>
                                                            <Icon className="w-5 h-5" style={{ color: bill.color }} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-[13px] font-semibold truncate" style={{ color: 'var(--color-text-main)' }}>{bill.title}</div>
                                                            <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{bill.participants} {t('split_bills.people_count').replace('{count}', '')} &middot; {format(bill.typical_amount)}</div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: 'split_bills.pending', value: summary.pending_total || 0, color: '#F59E0B', Icon: Clock, subKey: 'split_bills.awaiting_approval', subCount: summary.pending_count || 0 },
                                { label: 'split_bills.you_owe', value: summary.total_you_owe || 0, color: '#EF4444', Icon: ArrowUpRight, subKey: 'split_bills.active_debts', subCount: summary.active_count || 0 },
                                { label: 'split_bills.net_balance', value: (summary.total_owed_to_you || 0) - (summary.total_you_owe || 0), color: 'var(--color-gold)', Icon: Wallet, sub: (summary.total_owed_to_you || 0) >= (summary.total_you_owe || 0) ? t('split_bills.in_your_favor') : t('split_bills.you_owe_more') },
                            ].map(({ label, value, color, Icon, subKey, sub, subCount }, i) => (
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
                                             <div className="text-[20px] font-bold leading-none" style={{ color }}>
                                                 {format(Math.abs(value))} {code}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{subKey ? t(subKey, { count: subCount }) : sub}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pending Splits */}
                        {splits.filter(s => s.status === 'pending').length > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                                <h2 className="text-[16px] font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text-main)' }}>
                                    <Clock className="w-4 h-4" style={{ color: '#F59E0B' }} /> {t('split_bills.pending_approval')}
                                </h2>
                                <div className="space-y-3">
                                    {splits.filter(s => s.status === 'pending').map((split) => {
                                        const Icon = getIconComponent(split.icon);
                                        const acceptedCount = split.participants.filter(p => p.acceptance_status === 'accepted').length;
                                        const isPendingForYou = split.participants.some(p => isMe(p) && p.acceptance_status === 'pending');
                                        return (
                                            <div key={split.id} className="rounded-2xl overflow-hidden" style={{ background: 'var(--color-bg-card)', border: '1px solid rgba(245,158,11,0.3)' }}>
                                                <div className="flex items-center gap-4 px-5 py-4">
                                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                                        style={{ background: split.logo_color + '18', border: `1px solid ${split.logo_color}30` }}>
                                                        <Icon className="w-6 h-6" style={{ color: split.logo_color }} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="text-[15px] font-semibold" style={{ color: 'var(--color-text-main)' }}>{split.title}</span>
                                                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B' }}>
                                                                {t('split_bills.awaiting_approval_badge')}
                                                            </span>
                                                        </div>
                                                        <div className="text-[11px] mt-1" style={{ color: 'var(--color-text-muted)' }}>
                                                            {t('split_bills.accepted_count', { accepted: acceptedCount, total: split.participant_count })} &middot;                                                                  {t('split_bills.your_share', { amount: format(split.your_share) })}
                                                        </div>
                                                    </div>
                                                    {isPendingForYou && (
                                                         <div className="flex items-center gap-2">
                                                             <button onClick={() => handleRespond(split.id, 'accepted')}
                                                                 className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all hover:opacity-80"
                                                                 style={{ background: '#10B981', color: '#fff' }}>
                                                                 <CheckCircle2 className="w-3.5 h-3.5" /> {t('split_bills.accept')}
                                                             </button>
                                                             <button onClick={() => handleRespond(split.id, 'declined')}
                                                                 className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all hover:opacity-80"
                                                                 style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444' }}>
                                                                 <XCircle className="w-3.5 h-3.5" /> {t('split_bills.decline')}
                                                             </button>
                                                         </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* Active Splits */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                            <h2 className="text-[16px] font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text-main)' }}>
                                <ShieldCheck className="w-4 h-4" style={{ color: '#10B981' }} /> {t('split_bills.active_splits')}
                            </h2>

                            {splits.filter(s => s.status === 'active').length === 0 ? (
                                <div className="rounded-2xl py-16 flex flex-col items-center gap-3"
                                    style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                    <Receipt className="w-10 h-10" style={{ color: 'var(--color-text-muted)' }} />
                                    <p className="text-[16px] font-semibold" style={{ color: 'var(--color-text-main)' }}>{t('split_bills.no_active_splits')}</p>
                                    <p className="text-[13px]" style={{ color: 'var(--color-text-muted)' }}>{t('split_bills.create_split_to_start')}</p>
                                    <button onClick={() => setShowCreateModal(true)} className="mt-2 px-5 py-2 rounded-xl text-[13px] font-semibold"
                                        style={{ background: 'var(--color-gold)', color: '#000' }}>{t('split_bills.create_split')}</button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {splits.filter(s => s.status === 'active').map((split) => {
                                        const Icon = getIconComponent(split.icon);
                                        const isExpanded = expandedSplit === split.id;
                                        const unpaidCount = split.participants.filter(p => !isMe(p) && !p.has_paid).length;
                                        return (
                                            <div key={split.id} className="rounded-2xl overflow-hidden" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                                <div className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                                                    onClick={() => setExpandedSplit(isExpanded ? null : split.id)}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-elevated)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                                        style={{ background: split.logo_color + '18', border: `1px solid ${split.logo_color}30` }}>
                                                        <Icon className="w-6 h-6" style={{ color: split.logo_color }} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="text-[15px] font-semibold" style={{ color: 'var(--color-text-main)' }}>{split.title}</span>
                                                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                                                style={{ background: split.you_owe ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)', color: split.you_owe ? '#EF4444' : '#10B981' }}>
                                                                {split.you_owe ? t('split_bills.you_owe') : t('split_bills.owes_you')}
                                                            </span>
                                                            {split.is_recurring && (
                                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: 'rgba(139,92,246,0.12)', color: '#8B5CF6' }}>
                                                                    <Repeat className="w-3 h-3" /> {split.recurring_period}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                                                                {t('split_bills.people_count', { count: split.participant_count })}
                                                            </span>
                                                            {unpaidCount > 0 && (
                                                                <span className="text-[11px]" style={{ color: '#F59E0B' }}>
                                                                    {t('split_bills.unpaid_count', { count: unpaidCount })}
                                                                </span>
                                                            )}
                                                            {split.due_date && (
                                                                <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                                                                    <Calendar className="w-3 h-3" /> {t('split_bills.due_date', { date: fmtDate(split.due_date) })}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-right">
                                                            <div className="text-[16px] font-bold" style={{ color: split.you_owe ? '#EF4444' : '#10B981' }}>
                                                                 {format(split.your_share)} {code}
                                                            </div>
                                                            <div className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                                                                 {t('common.total_amount')}: {format(split.total_amount)} {code}
                                                            </div>
                                                        </div>
                                                        {isExpanded ? <ChevronUp className="w-4 h-4 shrink-0" style={{ color: 'var(--color-text-muted)' }} /> : <ChevronDown className="w-4 h-4 shrink-0" style={{ color: 'var(--color-text-muted)' }} />}
                                                    </div>
                                                </div>

                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                                            <div className="px-5 pb-4 border-t" style={{ borderTopColor: 'var(--color-border)' }}>
                                                                <div className="pt-4 space-y-3">
                                                                    {split.description && (
                                                                        <p className="text-[13px]" style={{ color: 'var(--color-text-muted)' }}>{split.description}</p>
                                                                    )}
                                                                    <div>
                                                                        <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                                                                            {t('split_bills.participants', { count: split.participant_count })}
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            {split.participants.map((p, i) => (
                                                                                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl"
                                                                                    style={{ background: isMe(p) ? 'rgba(212,175,55,0.08)' : 'transparent' }}>
                                                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold"
                                                                                        style={{ background: p.avatar_color + '22', color: p.avatar_color, border: `1.5px solid ${p.avatar_color}40` }}>
                                                                                        {p.name.charAt(0).toUpperCase()}
                                                                                    </div>
                                                                                    <div className="flex-1">
                                                                                        <div className="flex items-center gap-2">
                                                                                            <span className="text-[13px] font-medium" style={{ color: 'var(--color-text-main)' }}>
                                                                                                 {p.name} {isMe(p) && <span className="text-[10px]" style={{ color: 'var(--color-gold)' }}>{t('split_bills.you_label')}</span>}
                                                                                            </span>
                                                                                        </div>
                                                                                        {p.tag && <div className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{p.tag}</div>}
                                                                                    </div>
                                                                                    <div className="text-right">
                                                                                        <span className="text-[13px] font-semibold block" style={{ color: 'var(--color-text-main)' }}>
                                                                                            {format(p.share_amount)} {code}
                                                                                        </span>
                                                                                        {p.has_paid ? (
                                                                                            <span className="text-[10px] font-medium" style={{ color: '#10B981' }}>{t('split_bills.paid')}</span>
                                                                                        ) : p.partial_paid > 0 ? (
                                                                                            <span className="text-[10px] font-medium" style={{ color: '#3B82F6' }}>                                                                 {t('split_bills.partial_paid', { amount: format(p.partial_paid) })}</span>
                                                                                        ) : p.acceptance_status === 'accepted' ? (
                                                                                            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B' }}>{t('split_bills.pending_status')}</span>
                                                                                        ) : null}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                     <div className="flex items-center gap-2 pt-2">
                                                                          {split.you_owe && !split.participants.find(p => isMe(p))?.has_paid && (
                                                                             <>
                                                                                 <button onClick={() => handlePay(split.id)}
                                                                                     className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:opacity-80"
                                                                                     style={{ background: 'var(--color-gold)', color: '#000' }}>
                                                                                     <CreditCard className="w-4 h-4" />                                                                  {t('split_bills.pay_amount', { amount: format(split.your_share) })}
                                                                                 </button>
                                                                                 <button onClick={() => handlePay(split.id, split.your_share / 2)}
                                                                                     className="px-3 py-2.5 rounded-xl text-[11px] font-medium transition-all hover:opacity-80"
                                                                                     style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#3B82F6' }}>
                                                                                     {t('split_bills.pay_half')}
                                                                                 </button>
                                                                             </>
                                                                         )}
                                                                         {!split.you_owe && (
                                                                             <>
                                                                                 <button onClick={() => handleSettle(split.id)}
                                                                                     className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:opacity-80"
                                                                                     style={{ background: '#10B981', color: '#fff' }}>
                                                                                     <CheckCircle2 className="w-4 h-4" /> {t('split_bills.mark_settled')}
                                                                                 </button>
                                                                                {unpaidCount > 0 && (
                                                                                    <button onClick={() => setShowRemindModal(split.id)}
                                                                                        className="p-2.5 rounded-xl transition-all hover:opacity-80"
                                                                                        style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
                                                                                        <Bell className="w-4 h-4" style={{ color: '#F59E0B' }} />
                                                                                    </button>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                        <button onClick={() => handleDelete(split.id)}
                                                                            className="p-2.5 rounded-xl transition-all hover:opacity-80"
                                                                            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                                                                            <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>

                        {/* Paid/Completed Splits */}
                        {splits.filter(s => s.status === 'paid').length > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                                <h2 className="text-[16px] font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text-main)' }}>
                                    <CheckCircle2 className="w-4 h-4" style={{ color: '#10B981' }} /> {t('split_bills.completed')}
                                </h2>
                                <div className="space-y-2">
                                    {splits.filter(s => s.status === 'paid').map((split) => {
                                        const Icon = getIconComponent(split.icon);
                                        return (
                                            <div key={split.id} className="flex items-center gap-4 px-5 py-3 rounded-2xl opacity-60"
                                                style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                                    style={{ background: split.logo_color + '10', border: `1px solid ${split.logo_color}20` }}>
                                                    <Icon className="w-5 h-5" style={{ color: split.logo_color }} />
                                                </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[14px] font-semibold" style={{ color: 'var(--color-text-main)' }}>{split.title}</div>
                                                        <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{t('split_bills.people_count', { count: split.participant_count })} &middot; {t('split_bills.settled')}</div>
                                                    </div>
                                                <div className="text-right">
                                                    <div className="text-[14px] font-bold" style={{ color: '#10B981' }}>{format(split.your_share)} {code}</div>
                                                </div>
                                                <CheckCircle2 className="w-4 h-4" style={{ color: '#10B981' }} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* Declined Splits */}
                        {splits.filter(s => s.status === 'declined').length > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                                <h2 className="text-[16px] font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text-main)' }}>
                                    <XCircle className="w-4 h-4" style={{ color: '#EF4444' }} /> {t('split_bills.declined_status')}
                                </h2>
                                <div className="space-y-2">
                                    {splits.filter(s => s.status === 'declined').map((split) => {
                                        const Icon = getIconComponent(split.icon);
                                        return (
                                            <div key={split.id} className="flex items-center gap-4 px-5 py-3 rounded-2xl opacity-40"
                                                style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                                    style={{ background: split.logo_color + '10', border: `1px solid ${split.logo_color}20` }}>
                                                    <Icon className="w-5 h-5" style={{ color: split.logo_color }} />
                                                </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[14px] font-semibold" style={{ color: 'var(--color-text-main)' }}>{split.title}</div>
                                                        <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{t('split_bills.declined_by_someone')}</div>
                                                    </div>
                                                <button onClick={() => handleDelete(split.id)}
                                                    className="p-2 rounded-xl transition-all hover:opacity-80"
                                                    style={{ background: 'rgba(239,68,68,0.05)' }}>
                                                    <Trash2 className="w-3.5 h-3.5" style={{ color: '#EF4444' }} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl"
                            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                            <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b" style={{ borderBottomColor: 'var(--color-border)', background: 'var(--color-bg-card)' }}>
                                <h2 className="text-[18px] font-bold" style={{ color: 'var(--color-text-main)' }}>{t('split_bills.create_bill_title')}</h2>
                                <button onClick={() => { setShowCreateModal(false); reset(); }}
                                    className="p-2 rounded-xl hover:opacity-80" style={{ background: 'var(--color-bg-elevated)' }}>
                                    <X className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                {/* Bill Type Icons */}
                                <div>
                                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--color-text-muted)' }}>{t('split_bills.bill_type')}</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {QUICK_BILL_ICONS.map((opt) => {
                                            const Icon = opt.icon;
                                            const isSelected = data.icon === opt.value;
                                            return (
                                                <button key={opt.value} type="button"
                                                    onClick={() => { setData('icon', opt.value); setData('logo_color', opt.color); }}
                                                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-medium transition-all"
                                                    style={isSelected
                                                        ? { background: opt.color + '22', border: `1px solid ${opt.color}50`, color: opt.color }
                                                        : { background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                                    <Icon className="w-4 h-4" /> {t(opt.labelKey)}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Title & Amount */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--color-text-muted)' }}>{t('split_bills.title_label')}</label>
                                        <input type="text" value={data.title} onChange={e => setData('title', e.target.value)}
                                            placeholder={t('split_bills.title_placeholder')}
                                            className="w-full px-4 py-3 rounded-xl text-[14px] outline-none"
                                            style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }} />
                                        {errors.title && <p className="text-red-400 text-[12px] mt-1">{errors.title}</p>}
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--color-text-muted)' }}>{t('split_bills.total_amount')}</label>
                                        <input type="number" step="0.01" min="0.01" value={data.total_amount} onChange={e => setData('total_amount', e.target.value)}
                                            placeholder={t('split_bills.amount_placeholder')}
                                            className="w-full px-4 py-3 rounded-xl text-[14px] outline-none"
                                            style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }} />
                                        {errors.total_amount && <p className="text-red-400 text-[12px] mt-1">{errors.total_amount}</p>}
                                    </div>
                                </div>

                                {/* Description & Due Date */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--color-text-muted)' }}>{t('split_bills.description')}</label>
                                        <input type="text" value={data.description} onChange={e => setData('description', e.target.value)}
                                            placeholder={t('split_bills.description_placeholder')}
                                            className="w-full px-4 py-3 rounded-xl text-[14px] outline-none"
                                            style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }} />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
                                            <Calendar className="w-3 h-3" /> {t('split_bills.due_date_label')}
                                        </label>
                                        <input type="date" value={data.due_date} onChange={e => setData('due_date', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl text-[14px] outline-none"
                                            style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }} />
                                    </div>
                                </div>

                                {/* Split Type */}
                                <div>
                                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--color-text-muted)' }}>{t('split_bills.split_method')}</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { id: 'equal', label: 'split_bills.equal_split', icon: Hash, desc: 'split_bills.everyone_pays_same' },
                                            { id: 'custom', label: 'split_bills.custom', icon: Plus, desc: 'split_bills.set_individual_amounts' },
                                        ].map((m) => (
                                            <button key={m.id} type="button" onClick={() => setData('split_type', m.id)}
                                                className="flex flex-col items-start gap-1 p-3 rounded-xl text-left transition-all border"
                                                style={data.split_type === m.id
                                                    ? { background: 'var(--color-gold-bg)', borderColor: 'var(--color-gold)', color: 'var(--color-gold)' }
                                                    : { background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
                                                <m.icon className="w-4 h-4" />
                                                <div>
                                                    <div className="text-[12px] font-semibold">{t(m.label)}</div>
                                                    <div className="text-[10px] opacity-70">{t(m.desc)}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Recurring Toggle */}
                                <div>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <div className="relative">
                                            <input type="checkbox" checked={data.is_recurring}
                                                onChange={e => setData('is_recurring', e.target.checked)}
                                                className="sr-only" />
                                            <div className={`w-10 h-6 rounded-full transition-colors ${data.is_recurring ? 'bg-[var(--color-gold)]' : 'bg-[var(--color-border)'}`}>
                                                <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform mt-1 ${data.is_recurring ? 'translate-x-5 ml-5' : 'translate-x-1 ml-1'}`} />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Repeat className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                                            <span className="text-[13px] font-medium" style={{ color: 'var(--color-text-main)' }}>{t('split_bills.recurring_bill')}</span>
                                        </div>
                                    </label>
                                    {data.is_recurring && (
                                        <div className="mt-3 grid grid-cols-3 gap-2">
                                            {['weekly', 'monthly', 'yearly'].map(period => (
                                                <button key={period} type="button"
                                                    onClick={() => setData('recurring_period', period)}
                                                    className={`py-2 rounded-xl text-[12px] font-medium transition-all ${data.recurring_period === period
                                                        ? 'bg-[var(--color-gold)] text-black'
                                                        : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border)]'}`}>
                                                    {t(`split_bills.${period}`)}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Participants */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
                                            <Users className="w-3 h-3" /> {t('split_bills.participants', { count: data.participants.length })}
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <button type="button" onClick={toggleContactsModal}
                                                className="text-[11px] font-medium flex items-center gap-1 px-2 py-1 rounded-lg transition-all hover:opacity-80"
                                                style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}>
                                                <UserPlus className="w-3 h-3" /> {t('split_bills.add_people')}
                                            </button>
                                            <button type="button" onClick={addParticipant}
                                                className="text-[11px] font-medium flex items-center gap-1" style={{ color: 'var(--color-gold)' }}>
                                                <Plus className="w-3 h-3" /> {t('common.add')}
                                            </button>
                                        </div>
                                    </div>

                                    {data.split_type === 'equal' && data.total_amount && (
                                        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
                                            <Hash className="w-3.5 h-3.5" style={{ color: 'var(--color-gold)' }} />
                                            <span className="text-[12px] font-medium" style={{ color: 'var(--color-gold)' }}>
                                                {t('split_bills.each_pays', { amount: format(sharePerPerson) })}
                                            </span>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        {data.participants.map((p, i) => (
                                            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                                                style={{ background: p.is_you ? 'rgba(212,175,55,0.08)' : 'var(--color-bg-elevated)', border: p.is_you ? '1px solid rgba(212,175,55,0.2)' : '1px solid var(--color-border)' }}>
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
                                                    style={{ background: p.avatar_color + '22', color: p.avatar_color, border: `1.5px solid ${p.avatar_color}40` }}>
                                                    {p.name ? p.name.charAt(0).toUpperCase() : '?'}
                                                </div>
                                                {p.is_you ? (
                                                    <span className="flex-1 text-[13px] font-medium" style={{ color: 'var(--color-gold)' }}>You</span>
                                                ) : (
                                                    <>
                                                        <input type="text" value={p.name} onChange={e => updateParticipant(i, 'name', e.target.value)}
                                                            placeholder={t('split_bills.name_placeholder')}
                                                            className="flex-1 bg-transparent text-[13px] outline-none min-w-0"
                                                            style={{ color: 'var(--color-text-main)' }} />
                                                        {p.tag && <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{p.tag}</span>}
                                                    </>
                                                )}
                                                {data.split_type === 'custom' && !p.is_you && (
                                                    <input type="number" step="0.01" min="0" value={p.share_amount}
                                                        onChange={e => updateParticipant(i, 'share_amount', e.target.value)}
                                                        placeholder={t('split_bills.amount_mad_placeholder')}
                                                        className="w-24 bg-transparent text-[13px] outline-none text-right"
                                                        style={{ color: 'var(--color-text-main)' }} />
                                                )}
                                                {!p.is_you && data.participants.length > 1 && (
                                                    <button type="button" onClick={() => removeParticipant(i)}
                                                        className="p-1 rounded-lg hover:opacity-80 shrink-0">
                                                        <X className="w-3.5 h-3.5" style={{ color: '#EF4444' }} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit */}
                                <button type="submit" disabled={processing}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-semibold transition-all hover:opacity-80 disabled:opacity-50"
                                    style={{ background: 'var(--color-gold)', color: '#000' }}>
                                    <Plus className="w-4 h-4" /> {processing ? t('split_bills.creating') : t('split_bills.create_split_submit')}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Contacts/Search Modal */}
            <AnimatePresence>
                {(showContacts || showSearch) && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-sm rounded-2xl overflow-hidden"
                            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderBottomColor: 'var(--color-border)' }}>
                                <h3 className="text-[16px] font-bold" style={{ color: 'var(--color-text-main)' }}>{t('split_bills.add_people_title')}</h3>
                                <button onClick={() => { setShowContacts(false); setShowSearch(false); setContactSearch(''); setSearchResults([]); }}
                                    className="p-1.5 rounded-lg hover:opacity-80">
                                    <X className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                                </button>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
                                    <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--color-text-muted)' }} />
                                    <input type="text" value={contactSearch} onChange={e => setContactSearch(e.target.value)}
                                        placeholder={t('split_bills.search_contacts')}
                                        className="flex-1 bg-transparent text-[13px] outline-none"
                                        style={{ color: 'var(--color-text-main)' }} />
                                </div>

                                {/* Search Results */}
                                {contactSearch.length >= 2 && (
                                    <div className="mb-4">
                                        <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                                            {searching ? t('common.loading') : t('common.search_results')}
                                        </div>
                                        <div className="space-y-1 max-h-40 overflow-y-auto">
                                            {searchResults.map((user) => {
                                                const alreadyAdded = data.participants.some(p => p.user_id === user.id);
                                                return (
                                                    <button key={user.id} type="button" onClick={() => !alreadyAdded && addSearchResult(user)}
                                                        disabled={alreadyAdded}
                                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-left transition-all"
                                                        style={{ background: alreadyAdded ? 'transparent' : 'var(--color-bg-elevated)', opacity: alreadyAdded ? 0.4 : 1, border: '1px solid var(--color-border)' }}>
                                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
                                                            style={{ background: '#3B82F622', color: '#3B82F6', border: '1.5px solid #3B82F640' }}>
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-[13px] font-medium truncate" style={{ color: 'var(--color-text-main)' }}>{user.name}</div>
                                                            <div className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{user.email}</div>
                                                        </div>
                                                        {user.is_contact && <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>{t('contacts.already_in_contacts')}</span>}
                                                        {alreadyAdded && <span className="text-[10px]" style={{ color: 'var(--color-gold)' }}>{t('common.already_added')}</span>}
                                                    </button>
                                                );
                                            })}
                                            {!searching && searchResults.length === 0 && (
                                                <div className="text-[12px] text-center py-4" style={{ color: 'var(--color-text-muted)' }}>{t('common.no_users_found')}</div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Your Contacts */}
                                <div>
                                    <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                                        {t('split_bills.your_contacts', { count: allContacts.length })}
                                    </div>
                                    <div className="space-y-1 max-h-48 overflow-y-auto">
                                        {filteredContacts.map((contact) => {
                                            const alreadyAdded = data.participants.some(p => p.user_id === contact.id);
                                            return (
                                                <button key={contact.id} type="button" onClick={() => !alreadyAdded && addContact(contact)}
                                                    disabled={alreadyAdded}
                                                    className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-left transition-all"
                                                    style={{ background: alreadyAdded ? 'transparent' : 'var(--color-bg-elevated)', opacity: alreadyAdded ? 0.4 : 1, border: '1px solid var(--color-border)' }}>
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
                                                        style={{ background: contact.color + '22', color: contact.color, border: `1.5px solid ${contact.color}40` }}>
                                                        {contact.name.charAt(0)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[13px] font-medium truncate" style={{ color: 'var(--color-text-main)' }}>{contact.name}</div>
                                                        <div className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{contact.tag}</div>
                                                    </div>
                                                    {alreadyAdded && <span className="text-[10px]" style={{ color: 'var(--color-gold)' }}>{t('common.already_added')}</span>}
                                                </button>
                                            );
                                        })}
                                        {allContacts.length === 0 && (
                                            <div className="text-[12px] text-center py-4" style={{ color: 'var(--color-text-muted)' }}>
                                                {t('split_bills.no_contacts_yet')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Remind Modal */}
            <AnimatePresence>
                {showRemindModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-sm rounded-2xl p-6"
                            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.12)' }}>
                                        <Bell className="w-5 h-5" style={{ color: '#F59E0B' }} />
                                    </div>
                                    <div>
                                        <h3 className="text-[16px] font-bold" style={{ color: 'var(--color-text-main)' }}>{t('split_bills.remind_title')}</h3>
                                        <p className="text-[12px]" style={{ color: 'var(--color-text-muted)' }}>{t('split_bills.remind_subtitle')}</p>
                                    </div>
                                </div>
                                <p className="text-[13px] mb-6" style={{ color: 'var(--color-text-muted)' }}>
                                    {t('split_bills.remind_description')}
                                </p>
                                <div className="flex gap-2">
                                    <button onClick={() => setShowRemindModal(null)}
                                        className="flex-1 py-2.5 rounded-xl text-[13px] font-medium"
                                        style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                        {t('common.cancel')}
                                    </button>
                                    <button onClick={() => handleRemind(showRemindModal)}
                                        className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold"
                                        style={{ background: '#F59E0B', color: '#000' }}>
                                        {t('split_bills.send_reminders')}
                                    </button>
                                </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
