import { Head, router, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import {
    Send as SendIcon,
    Search,
    CheckCircle,
    ArrowRight,
    X,
    Clock,
    User,
} from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import { TIMEOUTS, ROUTES, COLORS, VALIDATION } from '@/constants';

export default function Send({ balance, recentSends = [], contacts = [] }) {
    const { t } = useTranslation();
    const { format, code } = useCurrency();

    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');

    const [sendMode, setSendMode] = useState('contact'); // 'contact' or 'rib'
    const [rib, setRib] = useState('');
    const [beneficiaryName, setBeneficiaryName] = useState('');

    const [recipientSearch, setRecipientSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedRecipient, setSelectedRecipient] = useState(null);
    const [showResults, setShowResults] = useState(false);

    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const amountInputRef = useRef(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const to = params.get('to');
        const amt = params.get('amount');
        if (to) setRecipientSearch(to);
        if (amt) setAmount(amt);
    }, []);

    const searchUsers = useCallback(async (query) => {
        if (!query || query.length < 2) {
            setSearchResults([]);
            return;
        }
        try {
            const res = await fetch(
                `${ROUTES.contacts}/search?q=${encodeURIComponent(query)}`,
            );
            const results = await res.json();
            setSearchResults(results);
        } catch (e) {
            console.error('Search failed:', e);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (recipientSearch.length >= 2 && !selectedRecipient) {
                searchUsers(recipientSearch);
                setShowResults(true);
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [recipientSearch, searchUsers, selectedRecipient]);

    const handleSelectRecipient = (user) => {
        setSelectedRecipient(user);
        setRecipientSearch(user.name);
        setShowResults(false);
        setSearchResults([]);
        setTimeout(() => amountInputRef.current?.focus(), TIMEOUTS.inputFocus);
    };

    const clearRecipient = () => {
        setSelectedRecipient(null);
        setRecipientSearch('');
    };

    const handleSend = () => {
        if (!amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance)
            return;
        if (sendMode === 'contact' && !selectedRecipient) return;
        if (
            sendMode === 'rib' &&
            (!beneficiaryName || rib.length < VALIDATION.ribMinLength)
        )
            return;

        setSending(true);
        setError(null);

        const payload = {
            amount: parseFloat(amount),
            send_mode: sendMode,
            note: note || null,
        };

        if (sendMode === 'contact') {
            payload.recipient_id = selectedRecipient.id;
        } else {
            payload.rib = rib;
            payload.beneficiary_name = beneficiaryName;
        }

        router.post(ROUTES.send, payload, {
            onSuccess: () => {
                setSuccess(true);
                setAmount('');
                setSelectedRecipient(null);
                setRecipientSearch('');
                setRib('');
                setBeneficiaryName('');
                setNote('');
                setTimeout(() => setSuccess(false), TIMEOUTS.successMessage);
            },
            onError: (errors) => {
                setError(
                    errors.amount ||
                        errors.recipient_id ||
                        errors.rib ||
                        errors.beneficiary_name ||
                        'Failed to complete transaction.',
                );
            },
            onFinish: () => setSending(false),
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
            <Head title="OSCORP | Send Money" />
            <Sidebar active="send" />

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <Topbar />

                <div className="flex-1 overflow-y-auto p-4 pb-32 lg:p-8 lg:pb-8">
                    <div className="mx-auto max-w-5xl space-y-6">
                        {/* Header */}
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                            <div>
                                <h1
                                    className="text-3xl font-black tracking-tight"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    {t('send_page.title')}
                                </h1>
                                <p
                                    className="mt-1 text-sm font-medium opacity-50"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    {t('send_page.subtitle')}
                                </p>
                            </div>
                            <div className="md:text-right">
                                <div
                                    className="mb-1 text-[11px] font-bold tracking-widest uppercase opacity-40"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    {t('send_page.balance')}
                                </div>
                                <div
                                    className="text-2xl font-black"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    {format(balance)}{' '}
                                    <span className="ml-1 text-sm opacity-50">
                                        {code}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Error/Success Messages */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center gap-3 rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/10 p-4 text-sm font-bold text-[#EF4444]"
                                >
                                    <X className="h-5 w-5" />
                                    {error}
                                </motion.div>
                            )}
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center gap-3 rounded-xl border border-[#10B981]/20 bg-[#10B981]/10 p-4 text-sm font-bold text-[#10B981]"
                                >
                                    <CheckCircle className="h-5 w-5" />
                                    {t('send_page.success_title')}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                            {/* Main Form Area */}
                            <div className="space-y-5 lg:col-span-2">
                                <div
                                    className="space-y-6 rounded-[24px] border border-white/5 bg-white/[0.02] p-6"
                                    style={{
                                        background: 'var(--color-bg-card)',
                                        borderColor: 'var(--color-border)',
                                    }}
                                >
                                    {/* Send Mode Toggle */}
                                    <div
                                        className="flex rounded-xl border bg-black/20 p-1 transition-colors"
                                        style={{
                                            borderColor: 'var(--color-border)',
                                            background:
                                                'var(--color-bg-elevated)',
                                        }}
                                    >
                                        <button
                                            onClick={() =>
                                                setSendMode('contact')
                                            }
                                            className={`flex-1 rounded-lg py-2.5 text-[10px] font-bold tracking-widest uppercase transition-all ${sendMode === 'contact' ? 'bg-white/10 opacity-100 shadow-sm' : 'opacity-40 hover:opacity-100'}`}
                                            style={{
                                                color: 'var(--color-text-main)',
                                            }}
                                        >
                                            Internal Transfer
                                        </button>
                                        <button
                                            onClick={() => setSendMode('rib')}
                                            className={`flex-1 rounded-lg py-2.5 text-[10px] font-bold tracking-widest uppercase transition-all ${sendMode === 'rib' ? 'bg-white/10 opacity-100 shadow-sm' : 'opacity-40 hover:opacity-100'}`}
                                            style={{
                                                color: 'var(--color-text-main)',
                                            }}
                                        >
                                            External (RIB)
                                        </button>
                                    </div>

                                    {sendMode === 'contact' ? (
                                        <div className="space-y-3">
                                            {/* Recipient Field */}
                                            <label
                                                className="text-[11px] font-bold tracking-widest uppercase opacity-50"
                                                style={{
                                                    color: 'var(--color-text-main)',
                                                }}
                                            >
                                                {t('send_page.recipient')}
                                            </label>
                                            <div className="relative">
                                                <div
                                                    className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${selectedRecipient ? 'border-[#EF4444] bg-[#EF4444]/5' : 'border-white/10 bg-black/20 hover:border-white/20'}`}
                                                    style={
                                                        !selectedRecipient
                                                            ? {
                                                                  borderColor:
                                                                      'var(--color-border)',
                                                                  background:
                                                                      'var(--color-bg-elevated)',
                                                              }
                                                            : {}
                                                    }
                                                >
                                                    <Search
                                                        className={`h-5 w-5 ${selectedRecipient ? 'text-[#EF4444]' : 'opacity-30'}`}
                                                        style={
                                                            !selectedRecipient
                                                                ? {
                                                                      color: 'var(--color-text-main)',
                                                                  }
                                                                : {}
                                                        }
                                                    />
                                                    <input
                                                        type="text"
                                                        value={recipientSearch}
                                                        onChange={(e) =>
                                                            setRecipientSearch(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onFocus={() =>
                                                            searchResults.length >
                                                                0 &&
                                                            setShowResults(true)
                                                        }
                                                        placeholder={t(
                                                            'send_page.search_placeholder',
                                                        )}
                                                        className="flex-1 bg-transparent text-base font-bold outline-none placeholder:font-medium placeholder:opacity-30"
                                                        style={{
                                                            color: 'var(--color-text-main)',
                                                        }}
                                                    />
                                                    {selectedRecipient && (
                                                        <button
                                                            onClick={
                                                                clearRecipient
                                                            }
                                                            className="rounded-lg p-1 transition-colors hover:bg-white/10"
                                                        >
                                                            <X
                                                                className="h-5 w-5 opacity-50"
                                                                style={{
                                                                    color: 'var(--color-text-main)',
                                                                }}
                                                            />
                                                        </button>
                                                    )}
                                                </div>

                                                <AnimatePresence>
                                                    {showResults &&
                                                        searchResults.length >
                                                            0 && (
                                                            <motion.div
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: 5,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                exit={{
                                                                    opacity: 0,
                                                                    y: 5,
                                                                }}
                                                                className="absolute top-[calc(100%+8px)] right-0 left-0 z-50 overflow-hidden rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl"
                                                                style={{
                                                                    background:
                                                                        'var(--color-bg-card)',
                                                                }}
                                                            >
                                                                <div className="custom-scrollbar max-h-[250px] overflow-y-auto">
                                                                    {searchResults.map(
                                                                        (
                                                                            user,
                                                                        ) => (
                                                                            <button
                                                                                key={
                                                                                    user.id
                                                                                }
                                                                                onClick={() =>
                                                                                    handleSelectRecipient(
                                                                                        user,
                                                                                    )
                                                                                }
                                                                                className="flex w-full items-center gap-4 border-b border-white/5 px-4 py-3 text-left transition-colors last:border-0 hover:bg-white/5"
                                                                            >
                                                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EF4444]/10 text-xs font-bold text-[#EF4444]">
                                                                                    {getInitials(
                                                                                        user.name,
                                                                                    )}
                                                                                </div>
                                                                                <div>
                                                                                    <div
                                                                                        className="text-sm font-bold"
                                                                                        style={{
                                                                                            color: 'var(--color-text-main)',
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            user.name
                                                                                        }
                                                                                    </div>
                                                                                    <div
                                                                                        className="text-xs opacity-50"
                                                                                        style={{
                                                                                            color: 'var(--color-text-main)',
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            user.email
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </button>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-5">
                                            <div className="space-y-3">
                                                <label
                                                    className="text-[11px] font-bold tracking-widest uppercase opacity-50"
                                                    style={{
                                                        color: 'var(--color-text-main)',
                                                    }}
                                                >
                                                    Beneficiary Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={beneficiaryName}
                                                    onChange={(e) =>
                                                        setBeneficiaryName(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Enter recipient's full name"
                                                    className="w-full rounded-xl border bg-black/20 px-5 py-4 text-sm font-bold transition-all outline-none placeholder:opacity-30 hover:border-white/20 focus:border-[#EF4444]"
                                                    style={{
                                                        borderColor:
                                                            'var(--color-border)',
                                                        color: 'var(--color-text-main)',
                                                        background:
                                                            'var(--color-bg-elevated)',
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <label
                                                        className="text-[11px] font-bold tracking-widest uppercase opacity-50"
                                                        style={{
                                                            color: 'var(--color-text-main)',
                                                        }}
                                                    >
                                                        RIB Number
                                                    </label>
                                                    {rib.length > 0 &&
                                                        rib.length < 24 && (
                                                            <span className="text-[9px] font-bold tracking-widest text-[#EF4444] uppercase">
                                                                {rib.length}/24
                                                                Digits
                                                            </span>
                                                        )}
                                                </div>
                                                <input
                                                    type="text"
                                                    value={rib}
                                                    onChange={(e) =>
                                                        setRib(
                                                            e.target.value
                                                                .replace(
                                                                    /\D/g,
                                                                    '',
                                                                )
                                                                .slice(0, 24),
                                                        )
                                                    }
                                                    placeholder="24-digit bank account number"
                                                    className="w-full rounded-xl border bg-black/20 px-5 py-4 font-mono text-sm font-bold tracking-widest transition-all outline-none placeholder:opacity-30 hover:border-white/20 focus:border-[#EF4444]"
                                                    style={{
                                                        borderColor:
                                                            'var(--color-border)',
                                                        color: 'var(--color-text-main)',
                                                        background:
                                                            'var(--color-bg-elevated)',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Amount Field */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label
                                                className="text-[11px] font-bold tracking-widest uppercase opacity-50"
                                                style={{
                                                    color: 'var(--color-text-main)',
                                                }}
                                            >
                                                {t('send_page.amount_label')}
                                            </label>
                                            {parseFloat(amount) > balance && (
                                                <span className="rounded bg-[#EF4444]/10 px-2 py-0.5 text-[11px] font-bold tracking-wider text-[#EF4444] uppercase">
                                                    {t(
                                                        'send_page.insufficient',
                                                    ) || 'Insufficient Funds'}
                                                </span>
                                            )}
                                        </div>
                                        <div
                                            className="flex w-full items-center gap-3 rounded-xl border bg-black/20 px-5 py-3 transition-all focus-within:border-[#EF4444] hover:border-white/20"
                                            style={{
                                                borderColor:
                                                    'var(--color-border)',
                                                background:
                                                    'var(--color-bg-elevated)',
                                            }}
                                        >
                                            <span
                                                className="shrink-0 text-xl font-black opacity-30"
                                                style={{
                                                    color: 'var(--color-text-main)',
                                                }}
                                            >
                                                {code}
                                            </span>
                                            <input
                                                ref={amountInputRef}
                                                type="number"
                                                placeholder="0.00"
                                                value={amount}
                                                onChange={(e) =>
                                                    setAmount(e.target.value)
                                                }
                                                className="flex-1 bg-transparent text-3xl font-black outline-none placeholder:opacity-20"
                                                style={{
                                                    color: 'var(--color-text-main)',
                                                }}
                                            />
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            {[100, 500, 1000, 5000].map(
                                                (amt) => (
                                                    <button
                                                        key={amt}
                                                        type="button"
                                                        onClick={() =>
                                                            setAmount(
                                                                String(amt),
                                                            )
                                                        }
                                                        className={`rounded-lg border px-4 py-2 text-xs font-bold transition-colors ${amount === String(amt) ? 'border-[#EF4444] bg-[#EF4444] text-white' : 'bg-transparent opacity-70 hover:bg-white/5 hover:opacity-100'}`}
                                                        style={
                                                            amount !==
                                                            String(amt)
                                                                ? {
                                                                      borderColor:
                                                                          'var(--color-border)',
                                                                      color: 'var(--color-text-main)',
                                                                  }
                                                                : {}
                                                        }
                                                    >
                                                        {amt}
                                                    </button>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    {/* Note Field */}
                                    <div className="space-y-3">
                                        <label
                                            className="text-[11px] font-bold tracking-widest uppercase opacity-50"
                                            style={{
                                                color: 'var(--color-text-main)',
                                            }}
                                        >
                                            {t('send_page.note_label')}{' '}
                                            <span className="tracking-normal lowercase opacity-50">
                                                ({t('common.optional')})
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={note}
                                            onChange={(e) =>
                                                setNote(e.target.value)
                                            }
                                            placeholder={t(
                                                'send_page.note_placeholder',
                                            )}
                                            className="w-full rounded-xl border bg-black/20 px-5 py-4 text-sm font-medium transition-all outline-none placeholder:opacity-30 hover:border-white/20 focus:border-[#EF4444]"
                                            style={{
                                                borderColor:
                                                    'var(--color-border)',
                                                color: 'var(--color-text-main)',
                                                background:
                                                    'var(--color-bg-elevated)',
                                            }}
                                        />
                                    </div>

                                    {/* Action Button */}
                                    <div className="pt-4">
                                        <button
                                            onClick={handleSend}
                                            disabled={
                                                !amount ||
                                                parseFloat(amount) <= 0 ||
                                                parseFloat(amount) > balance ||
                                                sending ||
                                                (sendMode === 'contact' &&
                                                    !selectedRecipient) ||
                                                (sendMode === 'rib' &&
                                                    (!beneficiaryName ||
                                                        rib.length <
                                                            VALIDATION.ribMinLength))
                                            }
                                            className="flex h-14 w-full items-center justify-center gap-3 rounded-xl text-sm font-bold tracking-widest text-white uppercase transition-all disabled:opacity-30"
                                            style={{ background: COLORS.debit }}
                                        >
                                            {sending ? (
                                                <motion.div
                                                    animate={{
                                                        scale: [1, 1.3, 1],
                                                        opacity: [1, 0.6, 1],
                                                    }}
                                                    transition={{
                                                        duration: 1.2,
                                                        repeat: Infinity,
                                                        ease: 'easeInOut',
                                                    }}
                                                    transition={{
                                                        repeat: Infinity,
                                                        duration: 1,
                                                        ease: 'linear',
                                                    }}
                                                    className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                                                />
                                            ) : (
                                                <>
                                                    {t('send_page.confirm_btn')}{' '}
                                                    <SendIcon className="h-4 w-4" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar / Info Area */}
                            <div className="space-y-5">
                                {/* Quick Contacts */}
                                {contacts.length > 0 && !selectedRecipient && (
                                    <div
                                        className="rounded-[24px] border border-white/5 bg-white/[0.02] p-6"
                                        style={{
                                            background: 'var(--color-bg-card)',
                                            borderColor: 'var(--color-border)',
                                        }}
                                    >
                                        <h3
                                            className="mb-4 text-[11px] font-bold tracking-widest uppercase opacity-50"
                                            style={{
                                                color: 'var(--color-text-main)',
                                            }}
                                        >
                                            {t('send_page.recent_contacts')}
                                        </h3>
                                        <div className="grid grid-cols-3 gap-3">
                                            {contacts.map((contact) => (
                                                <button
                                                    key={contact.id}
                                                    onClick={() =>
                                                        handleSelectRecipient(
                                                            contact,
                                                        )
                                                    }
                                                    className="group flex flex-col items-center rounded-xl border border-transparent p-3 transition-colors hover:border-white/10 hover:bg-white/5"
                                                >
                                                    <div
                                                        className="mb-2 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/5 bg-black/20 text-sm font-bold group-hover:border-[#EF4444]/30"
                                                        style={{
                                                            color: 'var(--color-text-main)',
                                                        }}
                                                    >
                                                        {contact.avatar ? (
                                                            <img
                                                                src={
                                                                    contact.avatar
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            getInitials(
                                                                contact.name,
                                                            )
                                                        )}
                                                    </div>
                                                    <span
                                                        className="w-full truncate text-center text-xs font-bold"
                                                        style={{
                                                            color: 'var(--color-text-main)',
                                                        }}
                                                    >
                                                        {
                                                            contact.name.split(
                                                                ' ',
                                                            )[0]
                                                        }
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Selected Recipient Summary (Only shows when someone is selected) */}
                                {selectedRecipient && (
                                    <div className="flex items-center gap-4 rounded-[24px] border border-[#EF4444]/20 bg-[#EF4444]/5 p-6">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EF4444] text-sm font-bold text-white">
                                            {getInitials(
                                                selectedRecipient.name,
                                            )}
                                        </div>
                                        <div>
                                            <div className="mb-0.5 text-[10px] font-bold tracking-widest text-[#EF4444] uppercase">
                                                Sending To
                                            </div>
                                            <div
                                                className="text-sm font-bold"
                                                style={{
                                                    color: 'var(--color-text-main)',
                                                }}
                                            >
                                                {selectedRecipient.name}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Recent Transfers */}
                                {recentSends.length > 0 && (
                                    <div
                                        className="rounded-[24px] border border-white/5 bg-white/[0.02] p-6"
                                        style={{
                                            background: 'var(--color-bg-card)',
                                            borderColor: 'var(--color-border)',
                                        }}
                                    >
                                        <div className="mb-6 flex items-center gap-2">
                                            <Clock
                                                className="h-4 w-4 opacity-40"
                                                style={{
                                                    color: 'var(--color-text-main)',
                                                }}
                                            />
                                            <h3
                                                className="text-[11px] font-bold tracking-widest uppercase opacity-50"
                                                style={{
                                                    color: 'var(--color-text-main)',
                                                }}
                                            >
                                                {t('send_page.history') ||
                                                    'Recent Transfers'}
                                            </h3>
                                        </div>
                                        <div className="space-y-4">
                                            {recentSends
                                                .slice(0, 5)
                                                .map((tx, i) => (
                                                    <div
                                                        key={i}
                                                        className="group flex cursor-pointer items-center justify-between"
                                                        onClick={() =>
                                                            setAmount(
                                                                String(
                                                                    tx.amount,
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EF4444]/10 text-xs font-bold text-[#EF4444]">
                                                                {getInitials(
                                                                    tx.merchant?.replace(
                                                                        'Sent to ',
                                                                        '',
                                                                    ) || '?',
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div
                                                                    className="text-sm font-bold transition-colors group-hover:text-[#EF4444]"
                                                                    style={{
                                                                        color: 'var(--color-text-main)',
                                                                    }}
                                                                >
                                                                    {tx.merchant?.replace(
                                                                        'Sent to ',
                                                                        '',
                                                                    )}
                                                                </div>
                                                                <div
                                                                    className="mt-0.5 text-[10px] font-medium opacity-50"
                                                                    style={{
                                                                        color: 'var(--color-text-main)',
                                                                    }}
                                                                >
                                                                    {new Date(
                                                                        tx.transacted_at,
                                                                    ).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-sm font-bold text-[#EF4444]">
                                                            -{format(tx.amount)}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
                input[type=number]::-webkit-inner-spin-button, 
                input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
            `,
                }}
            />
        </div>
    );
}
