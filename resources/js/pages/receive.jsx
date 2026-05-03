import { Head, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { ArrowDownToLine, CheckCircle, Copy, Search, X, Share2, QrCode, User } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';

const QUICK_AMOUNTS = [50, 100, 200, 500, 1000, 2000];

export default function Receive({ balance, recentReceives = [] }) {
    const { t } = useTranslation();
    const { format, code } = useCurrency();
    const [copied, setCopied] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestSearch, setRequestSearch] = useState('');
    const [requestResults, setRequestResults] = useState([]);
    const [selectedRequester, setSelectedRequester] = useState(null);
    const [showRequestResults, setShowRequestResults] = useState(false);
    const [requestAmount, setRequestAmount] = useState('');
    const [requestNote, setRequestNote] = useState('');
    const [requestSending, setRequestSending] = useState(false);
    const [requestSuccess, setRequestSuccess] = useState(false);
    const [searching, setSearching] = useState(false);

    const myRIB = "MA64 0079 9901 1234 5678 9012 34";

    const copyRIB = () => {
        navigator.clipboard.writeText(myRIB);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const copyLink = () => {
        const url = `${window.location.origin}/send?to=${btoa(myRIB)}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const searchUsers = useCallback(async (query) => {
        if (!query || query.length < 2) {
            setRequestResults([]);
            return;
        }
        setSearching(true);
        try {
            const res = await fetch(`/contacts/search?q=${encodeURIComponent(query)}`);
            const results = await res.json();
            setRequestResults(results);
        } catch (e) {
            console.error('Search failed:', e);
        } finally {
            setSearching(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (requestSearch.length >= 2) {
                searchUsers(requestSearch);
                setShowRequestResults(true);
            } else {
                setRequestResults([]);
                setShowRequestResults(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [requestSearch, searchUsers]);

    const selectRequester = (user) => {
        setSelectedRequester(user);
        setRequestSearch(user.name);
        setShowRequestResults(false);
        setRequestResults([]);
    };

    const clearRequester = () => {
        setSelectedRequester(null);
        setRequestSearch('');
    };

    const sendRequest = () => {
        if (!selectedRequester || !requestAmount || parseFloat(requestAmount) <= 0) return;
        setRequestSending(true);
        router.post('/receive', {
            amount: parseFloat(requestAmount),
            requester_id: selectedRequester.id,
            note: requestNote || null,
        }, {
            onSuccess: () => {
                setRequestSuccess(true);
                setShowRequestModal(false);
                setRequestAmount('');
                setRequestSearch('');
                setSelectedRequester(null);
                setRequestNote('');
                setTimeout(() => setRequestSuccess(false), 4000);
            },
            onFinish: () => setRequestSending(false),
        });
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
            <Head title="OSCORP | Receive Money" />
            <Sidebar active="receive" />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />

                <div className="flex-1 overflow-y-auto px-6 py-8">
                    <div className="max-w-4xl mx-auto space-y-8">

                        {/* Header */}
                        <div className="flex items-end justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: '#10B98118', border: '1px solid #10B98130' }}>
                                        <ArrowDownToLine className="w-6 h-6" style={{ color: '#10B981' }} />
                                    </div>
                                    <h1 className="text-[32px] font-bold" style={{ color: 'var(--color-text-main)' }}>{t('receive.title')}</h1>
                                </div>
                                <p className="text-[14px]" style={{ color: 'var(--color-text-muted)' }}>{t('receive.subtitle')}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>{t('receive.balance')}</div>
                                <div className="text-[24px] font-bold" style={{ color: 'var(--color-gold)' }}>{format(balance)} <span className="text-[12px] opacity-60">{code}</span></div>
                            </div>
                        </div>

                        {/* Success */}
                        <AnimatePresence>
                            {requestSuccess && (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                    className="p-6 rounded-2xl flex items-center gap-4" style={{ background: '#10B9810D', border: '1px solid #10B98130' }}>
                                    <CheckCircle className="w-8 h-8" style={{ color: '#10B981' }} />
                                    <div>
                                        <h3 className="text-[16px] font-bold" style={{ color: '#10B981' }}>{t('receive.request_sent')}</h3>
                                        <p className="text-[13px]" style={{ color: 'var(--color-text-muted)' }}>{t('receive.request_sent_desc')}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left: RIB Card */}
                            <div className="space-y-6">
                                {/* RIB Card */}
                                <div className="p-8 rounded-[32px] space-y-6 relative overflow-hidden" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#10B981] to-transparent opacity-40" />
                                    <div className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--color-text-muted)' }}>{t('receive.your_rib')}</div>
                                    <div className="p-5 rounded-2xl font-mono text-[18px] tracking-wider text-center" style={{ background: 'black/40', border: '1px solid var(--color-border)', color: 'var(--color-gold)' }}>
                                        {myRIB}
                                    </div>
                                    <button onClick={copyRIB}
                                        className="w-full py-3 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-2"
                                        style={{ background: 'var(--color-gold-bg)', border: '1px solid var(--color-gold)', color: 'var(--color-gold)' }}>
                                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copied ? t('receive.copied') : t('receive.copy_rib')}
                                    </button>
                                </div>

                                {/* Share Link */}
                                <div className="p-8 rounded-[32px] space-y-6 relative overflow-hidden" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-40" />
                                    <div className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--color-text-muted)' }}>{t('receive.share_link')}</div>
                                    <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'var(--color-bg-elevated)' }}>
                                        <Share2 className="w-5 h-5 shrink-0" style={{ color: '#3B82F6' }} />
                                        <span className="text-[12px] truncate flex-1" style={{ color: 'var(--color-text-muted)' }}>{t('receive.share_link_desc')}</span>
                                    </div>
                                    <button onClick={copyLink}
                                        className="w-full py-3 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-2"
                                        style={{ background: '#3B82F618', border: '1px solid #3B82F640', color: '#3B82F6' }}>
                                        {copied ? <CheckCircle className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                                        {t('receive.copy_link')}
                                    </button>
                                </div>
                            </div>

                            {/* Right: Request Money */}
                            <div className="space-y-6">
                                <div className="p-8 rounded-[32px] space-y-6 relative overflow-hidden" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-40" />
                                    <div className="flex items-center gap-3 mb-4">
                                        <QrCode className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                                        <h3 className="text-[18px] font-bold" style={{ color: 'var(--color-text-main)' }}>{t('receive.request_title')}</h3>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowRequestModal(true)}
                                        className="w-full py-4 rounded-2xl text-[15px] font-bold transition-all shadow-lg"
                                        style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', color: '#FFF' }}>
                                        {t('receive.request_btn')}
                                    </motion.button>
                                </div>

                                {/* Recent Receives */}
                                {recentReceives.length > 0 && (
                                    <div className="p-6 rounded-[28px] space-y-4" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                        <div className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--color-text-muted)' }}>{t('receive.recent_receives')}</div>
                                        <div className="space-y-2">
                                            {recentReceives.slice(0, 5).map((r, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold" style={{ background: '#10B98118', color: '#10B981' }}>
                                                            {getInitials(r.merchant || '?')}
                                                        </div>
                                                        <div>
                                                            <div className="text-[13px] font-semibold" style={{ color: 'var(--color-text-main)' }}>{r.merchant}</div>
                                                            <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{new Date(r.transacted_at).toLocaleDateString()}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-[14px] font-bold" style={{ color: '#10B981' }}>+{format(r.amount)}</div>
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

            {/* Request Money Modal */}
            <AnimatePresence>
                {showRequestModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-md p-8 rounded-[32px] shadow-2xl relative overflow-hidden" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                            <div className="absolute top-0 inset-x-0 h-[4px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent" />
                            <h2 className="text-[24px] font-bold text-center mb-6" style={{ color: 'var(--color-text-main)' }}>{t('receive.request_title')}</h2>

                            {/* Search Person */}
                            <div className="space-y-3 mb-6">
                                <label className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--color-text-muted)' }}>{t('receive.from')}</label>
                                <div className="relative">
                                    <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
                                        <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--color-text-muted)' }} />
                                        <input type="text" value={requestSearch} onChange={e => setRequestSearch(e.target.value)}
                                            onFocus={() => requestResults.length > 0 && setShowRequestResults(true)}
                                            placeholder={t('receive.search_from')}
                                            className="flex-1 bg-transparent text-[14px] outline-none" style={{ color: 'var(--color-text-main)' }} />
                                        {selectedRequester && (
                                            <button onClick={clearRequester} className="p-1 rounded-lg hover:opacity-80">
                                                <X className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                                            </button>
                                        )}
                                    </div>
                                    <AnimatePresence>
                                        {showRequestResults && requestResults.length > 0 && (
                                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                className="absolute top-full left-0 right-0 z-10 mt-2 rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
                                                {requestResults.map(user => (
                                                    <button key={user.id} onClick={() => selectRequester(user)}
                                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                                                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0" style={{ background: '#8B5CF622', color: '#8B5CF6', border: '1.5px solid #8B5CF640' }}>
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
                                {selectedRequester && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#8B5CF610', border: '1px solid #8B5CF630' }}>
                                        <User className="w-5 h-5 shrink-0" style={{ color: '#8B5CF6' }} />
                                        <span className="text-[13px] font-semibold" style={{ color: '#8B5CF6' }}>{selectedRequester.name}</span>
                                        <CheckCircle className="w-4 h-4 ml-auto" style={{ color: '#8B5CF6' }} />
                                    </div>
                                )}
                            </div>

                            {/* Amount */}
                            <div className="space-y-4 mb-6">
                                <label className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--color-text-muted)' }}>{t('receive.request_amount')}</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-bold" style={{ color: 'var(--color-text-muted)' }}>{code}</span>
                                    <input type="number" placeholder="0.00" value={requestAmount} onChange={e => setRequestAmount(e.target.value)}
                                        className="w-full py-3 pl-14 pr-4 rounded-xl text-[24px] font-bold outline-none border bg-[var(--color-bg-elevated)] text-[var(--color-text-main)] focus:border-[#8B5CF6]" style={{ borderColor: 'var(--color-border)' }} />
                                </div>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                    {QUICK_AMOUNTS.map(amt => (
                                        <motion.button key={amt} type="button"
                                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                            onClick={() => setRequestAmount(String(amt))}
                                            className={`py-2 rounded-xl text-[12px] font-bold transition-all border ${requestAmount === String(amt) ? 'text-black' : ''}`}
                                            style={requestAmount === String(amt) ? { background: '#8B5CF6', borderColor: '#8B5CF6', color: '#FFF' } : { background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }}>
                                            {amt}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Note */}
                            <div className="space-y-3 mb-8">
                                <label className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--color-text-muted)' }}>{t('receive.request_note')} <span className="font-normal lowercase opacity-50">{t('common.optional')}</span></label>
                                <input type="text" value={requestNote} onChange={e => setRequestNote(e.target.value)}
                                    placeholder={t('receive.request_note_placeholder')}
                                    className="w-full py-3 px-4 rounded-xl text-[14px] outline-none border bg-[var(--color-bg-elevated)] text-[var(--color-text-main)] focus:border-[#8B5CF6]" style={{ borderColor: 'var(--color-border)' }} />
                            </div>

                            <div className="flex flex-col gap-3">
                                <button onClick={sendRequest} disabled={requestSending || !selectedRequester || !requestAmount}
                                    className="w-full h-14 rounded-2xl font-bold text-[16px] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', color: '#FFF' }}>
                                    {requestSending ? t('common.processing') : t('receive.send_request')}
                                </button>
                                <button onClick={() => setShowRequestModal(false)}
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
