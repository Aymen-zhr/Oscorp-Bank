import { Head, router, usePage, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { ArrowUpRight, CheckCircle, Send as SendIcon, Search, User, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';

const QUICK_AMOUNTS = [50, 100, 200, 500, 1000, 2000];

export default function Send({ balance, recentSends = [] }) {
    const { t } = useTranslation();
    const { format, code } = useCurrency();
    const [amount, setAmount] = useState('');
    const [recipientSearch, setRecipientSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedRecipient, setSelectedRecipient] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [searching, setSearching] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [note, setNote] = useState('');
    const [error, setError] = useState(null);

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
            if (recipientSearch.length >= 2) {
                searchUsers(recipientSearch);
                setShowResults(true);
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [recipientSearch, searchUsers]);

    const selectRecipient = (user) => {
        setSelectedRecipient(user);
        setRecipientSearch(user.name);
        setShowResults(false);
        setSearchResults([]);
    };

    const clearRecipient = () => {
        setSelectedRecipient(null);
        setRecipientSearch('');
    };

    const isValid = amount && parseFloat(amount) > 0 && selectedRecipient;

    const handleSend = () => {
        if (!isValid) return;
        setSending(true);
        setError(null);
        router.post('/send', {
            amount: parseFloat(amount),
            recipient_id: selectedRecipient.id,
            note: note || null,
        }, {
            onSuccess: () => {
                setSuccess(true);
                setConfirming(false);
                setAmount('');
                setSelectedRecipient(null);
                setRecipientSearch('');
                setNote('');
                setTimeout(() => setSuccess(false), 5000);
            },
            onError: (errors) => {
                setError(errors.amount || errors.recipient_id || 'Failed to send');
            },
            onFinish: () => setSending(false),
        });
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
            <Head title="OSCORP | Send Money" />
            <Sidebar active="send" />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />

                <div className="flex-1 overflow-y-auto px-6 py-8">
                    <div className="max-w-4xl mx-auto space-y-8">

                        {/* Header */}
                        <div className="flex items-end justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: '#EF444418', border: '1px solid #EF444430' }}>
                                        <SendIcon className="w-6 h-6" style={{ color: '#EF4444' }} />
                                    </div>
                                    <h1 className="text-[32px] font-bold" style={{ color: 'var(--color-text-main)' }}>{t('send.title')}</h1>
                                </div>
                                <p className="text-[14px]" style={{ color: 'var(--color-text-muted)' }}>{t('send.subtitle')}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>{t('send.balance')}</div>
                                <div className="text-[24px] font-bold" style={{ color: 'var(--color-gold)' }}>{format(balance)} <span className="text-[12px] opacity-60">{code}</span></div>
                            </div>
                        </div>

                        {/* Success */}
                        <AnimatePresence>
                            {success && (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                    className="p-6 rounded-2xl flex items-center gap-4" style={{ background: '#10B9810D', border: '1px solid #10B98130' }}>
                                    <CheckCircle className="w-8 h-8" style={{ color: '#10B981' }} />
                                    <div>
                                        <h3 className="text-[16px] font-bold" style={{ color: '#10B981' }}>{t('send.success_title')}</h3>
                                        <p className="text-[13px]" style={{ color: 'var(--color-text-muted)' }}>{t('send.success_desc')}</p>
                                    </div>
                                    <Link href="/transactions" className="ml-auto px-5 py-2.5 rounded-xl font-bold text-[12px] transition-all" style={{ background: '#10B981', color: '#000' }}>
                                        {t('send.history')}
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Error */}
                        {error && (
                            <div className="p-4 rounded-xl text-[13px]" style={{ background: '#EF444410', border: '1px solid #EF444430', color: '#EF4444' }}>
                                {error}
                            </div>
                        )}

                        {/* Main Form */}
                        <div className="p-8 rounded-[32px] space-y-8 relative overflow-hidden" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#EF4444] to-transparent opacity-40" />

                            {/* Recipient */}
                            <div className="space-y-4">
                                <label className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--color-text-muted)' }}>{t('send.recipient')}</label>
                                <div className="relative">
                                    <div className="flex items-center gap-3 p-4 rounded-xl border transition-all" style={{ background: 'var(--color-bg-elevated)', borderColor: selectedRecipient ? 'var(--color-gold)' : 'var(--color-border)' }}>
                                        <Search className="w-5 h-5 shrink-0" style={{ color: 'var(--color-text-muted)' }} />
                                        <input
                                            type="text"
                                            value={recipientSearch}
                                            onChange={e => setRecipientSearch(e.target.value)}
                                            onFocus={() => searchResults.length > 0 && setShowResults(true)}
                                            placeholder={t('send.search_placeholder')}
                                            className="flex-1 bg-transparent text-[14px] outline-none"
                                            style={{ color: 'var(--color-text-main)' }}
                                        />
                                        {selectedRecipient && (
                                            <button onClick={clearRecipient} className="p-1 rounded-lg hover:opacity-80">
                                                <X className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                                            </button>
                                        )}
                                    </div>
                                    <AnimatePresence>
                                        {showResults && searchResults.length > 0 && (
                                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                className="absolute top-full left-0 right-0 z-10 mt-2 rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
                                                {searchResults.map(user => (
                                                    <button key={user.id} onClick={() => selectRecipient(user)}
                                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                                                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0" style={{ background: '#EF444422', color: '#EF4444', border: '1.5px solid #EF444440' }}>
                                                            {getInitials(user.name)}
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="text-[13px] font-semibold" style={{ color: 'var(--color-text-main)' }}>{user.name}</div>
                                                            <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{user.email}</div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                {selectedRecipient && (
                                    <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'var(--color-gold-bg)', border: '1px solid var(--color-gold)' }}>
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0" style={{ background: 'var(--color-gold)22', color: 'var(--color-gold)' }}>
                                            {getInitials(selectedRecipient.name)}
                                        </div>
                                        <div>
                                            <div className="text-[13px] font-semibold" style={{ color: 'var(--color-gold)' }}>{selectedRecipient.name}</div>
                                            <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{t('send.selected')}</div>
                                        </div>
                                        <CheckCircle className="w-5 h-5 ml-auto" style={{ color: 'var(--color-gold)' }} />
                                    </div>
                                )}
                            </div>

                            {/* Amount */}
                            <div className="space-y-5">
                                <label className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--color-text-muted)' }}>{t('send.amount_label')}</label>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[18px] font-bold" style={{ color: 'var(--color-text-muted)' }}>{code}</div>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        className="w-full py-3.5 pl-16 pr-5 rounded-xl text-[28px] font-bold outline-none transition-all border bg-[var(--color-bg-elevated)] text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] focus:border-[#EF4444] focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]"
                                        style={{ borderColor: amount ? '#EF4444' : 'var(--color-border)' }}
                                    />
                                </div>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                    {QUICK_AMOUNTS.map(amt => (
                                        <motion.button key={amt} type="button"
                                            whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                                            onClick={() => setAmount(String(amt))}
                                            className={`py-3 rounded-xl text-[13px] font-bold transition-all border ${amount === String(amt) ? 'text-black shadow-lg' : 'hover:opacity-80'}`}
                                            style={amount === String(amt) ? { background: '#EF4444', borderColor: '#EF4444', color: '#000' } : { background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }}>
                                            {amt}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Note */}
                            <div className="space-y-3">
                                <label className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--color-text-muted)' }}>{t('send.note_label')} <span className="font-normal lowercase opacity-50">{t('common.optional')}</span></label>
                                <input type="text" value={note} onChange={e => setNote(e.target.value)}
                                    placeholder={t('send.note_placeholder')}
                                    className="w-full py-3 px-4 rounded-xl text-[14px] outline-none border transition-all bg-[var(--color-bg-elevated)] text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] focus:border-[#EF4444] focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]"
                                    style={{ borderColor: 'var(--color-border)' }} />
                            </div>

                            {/* Balance Preview */}
                            {amount && (
                                <div className="p-5 rounded-2xl space-y-3" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
                                    <div className="flex justify-between text-[13px]">
                                        <span style={{ color: 'var(--color-text-muted)' }}>{t('send.current_balance')}</span>
                                        <span className="font-semibold" style={{ color: 'var(--color-text-main)' }}>{format(balance)} {code}</span>
                                    </div>
                                    <div className="flex justify-between text-[13px]">
                                        <span style={{ color: 'var(--color-text-muted)' }}>{t('send.sending')}</span>
                                        <span className="font-bold" style={{ color: '#EF4444' }}>-{format(parseFloat(amount) || 0)} {code}</span>
                                    </div>
                                    <div className="pt-3 border-t flex justify-between" style={{ borderColor: 'var(--color-border)' }}>
                                        <span className="text-[14px] font-bold" style={{ color: 'var(--color-text-main)' }}>{t('send.after')}</span>
                                        <span className="text-[18px] font-bold" style={{ color: 'var(--color-gold)' }}>{format(balance - parseFloat(amount))} {code}</span>
                                    </div>
                                </div>
                            )}

                            {/* Send Button */}
                            <motion.button type="button"
                                whileHover={isValid ? { scale: 1.02 } : {}}
                                whileTap={isValid ? { scale: 0.98 } : {}}
                                onClick={() => setConfirming(true)}
                                disabled={!isValid}
                                className="w-full h-14 rounded-2xl text-[15px] font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-4 shadow-xl"
                                style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#FFF' }}>
                                {t('send.send_now')}
                                <ArrowUpRight className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {/* Recent Sends */}
                        {recentSends.length > 0 && (
                            <div className="p-6 rounded-[28px] space-y-4" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                <div className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--color-text-muted)' }}>{t('send.recent_sends')}</div>
                                <div className="space-y-2">
                                    {recentSends.map((s, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold" style={{ background: '#EF444418', color: '#EF4444' }}>
                                                    {getInitials(s.merchant || '?')}
                                                </div>
                                                <div>
                                                    <div className="text-[13px] font-semibold" style={{ color: 'var(--color-text-main)' }}>{s.merchant}</div>
                                                    <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{s.note || new Date(s.transacted_at).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <div className="text-[14px] font-bold" style={{ color: '#EF4444' }}>-{format(s.amount)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {confirming && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-md p-8 rounded-[32px] shadow-2xl relative overflow-hidden" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                            <div className="absolute top-0 inset-x-0 h-[4px] bg-gradient-to-r from-transparent via-[#EF4444] to-transparent" />
                            <h2 className="text-[24px] font-bold text-center mb-6" style={{ color: 'var(--color-text-main)' }}>{t('send.confirm_title')}</h2>
                            <div className="space-y-4 mb-8">
                                <div className="p-4 rounded-2xl space-y-3" style={{ background: 'var(--color-bg-elevated)' }}>
                                    <div className="flex justify-between text-[14px]">
                                        <span style={{ color: 'var(--color-text-muted)' }}>{t('send.to')}</span>
                                        <span className="font-bold" style={{ color: 'var(--color-text-main)' }}>{selectedRecipient?.name}</span>
                                    </div>
                                    <div className="flex justify-between text-[14px]">
                                        <span style={{ color: 'var(--color-text-muted)' }}>{t('send.amount')}</span>
                                        <span className="font-bold" style={{ color: '#EF4444' }}>{format(amount)} {code}</span>
                                    </div>
                                </div>
                                {balance < parseFloat(amount) && (
                                    <p className="text-[13px] text-center" style={{ color: '#EF4444' }}>{t('send.insufficient')}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-3">
                                <button onClick={handleSend} disabled={sending || balance < parseFloat(amount)}
                                    className="w-full h-14 rounded-2xl font-bold text-[16px] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#FFF' }}>
                                    {sending ? t('common.processing') : t('send.confirm_btn')}
                                </button>
                                <button onClick={() => setConfirming(false)}
                                    className="w-full h-12 rounded-2xl border font-bold text-[14px] transition-all hover:opacity-80"
                                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', background: 'transparent' }}>
                                    {t('common.cancel')}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
