import { Head, router, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { Send as SendIcon, Search, CheckCircle, ArrowRight, X, Clock, User } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import { TIMEOUTS, ROUTES } from '@/constants';

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
            const res = await fetch(`${ROUTES.contacts}/search?q=${encodeURIComponent(query)}`);
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
        if (!amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance) return;
        if (sendMode === 'contact' && !selectedRecipient) return;
        if (sendMode === 'rib' && (!beneficiaryName || rib.length < 16)) return;
        
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
                setError(errors.amount || errors.recipient_id || errors.rib || errors.beneficiary_name || 'Failed to complete transaction.');
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

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Topbar />

                <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-32 lg:pb-8">
                    <div className="max-w-5xl mx-auto space-y-6">
                        
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--color-text-main)' }}>{t('send_page.title')}</h1>
                                <p className="text-sm font-medium opacity-50 mt-1" style={{ color: 'var(--color-text-main)' }}>{t('send_page.subtitle')}</p>
                            </div>
                            <div className="md:text-right">
                                <div className="text-[11px] font-bold uppercase tracking-widest opacity-40 mb-1" style={{ color: 'var(--color-text-main)' }}>{t('send_page.balance')}</div>
                                <div className="text-2xl font-black" style={{ color: 'var(--color-text-main)' }}>
                                    {format(balance)} <span className="text-sm opacity-50 ml-1">{code}</span>
                                </div>
                            </div>
                        </div>

                        {/* Error/Success Messages */}
                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-sm font-bold flex items-center gap-3">
                                    <X className="w-5 h-5" />
                                    {error}
                                </motion.div>
                            )}
                            {success && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-sm font-bold flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5" />
                                    {t('send_page.success_title')}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                            
                            {/* Main Form Area */}
                            <div className="lg:col-span-2 space-y-5">
                                <div className="bg-white/[0.02] border border-white/5 rounded-[24px] p-6 space-y-6" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
                                    
                                    {/* Send Mode Toggle */}
                                    <div className="flex p-1 rounded-xl border transition-colors bg-black/20" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-elevated)' }}>
                                        <button 
                                            onClick={() => setSendMode('contact')}
                                            className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${sendMode === 'contact' ? 'bg-white/10 shadow-sm opacity-100' : 'opacity-40 hover:opacity-100'}`}
                                            style={{ color: 'var(--color-text-main)' }}
                                        >
                                            Internal Transfer
                                        </button>
                                        <button 
                                            onClick={() => setSendMode('rib')}
                                            className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${sendMode === 'rib' ? 'bg-white/10 shadow-sm opacity-100' : 'opacity-40 hover:opacity-100'}`}
                                            style={{ color: 'var(--color-text-main)' }}
                                        >
                                            External (RIB)
                                        </button>
                                    </div>

                                    {sendMode === 'contact' ? (
                                        <div className="space-y-3">
                                            {/* Recipient Field */}
                                            <label className="text-[11px] font-bold uppercase tracking-widest opacity-50" style={{ color: 'var(--color-text-main)' }}>{t('send_page.recipient')}</label>
                                            <div className="relative">
                                                <div className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${selectedRecipient ? 'border-[#EF4444] bg-[#EF4444]/5' : 'border-white/10 bg-black/20 hover:border-white/20'}`} style={!selectedRecipient ? { borderColor: 'var(--color-border)', background: 'var(--color-bg-elevated)' } : {}}>
                                                    <Search className={`w-5 h-5 ${selectedRecipient ? 'text-[#EF4444]' : 'opacity-30'}`} style={!selectedRecipient ? { color: 'var(--color-text-main)' } : {}} />
                                                    <input
                                                        type="text"
                                                        value={recipientSearch}
                                                        onChange={e => setRecipientSearch(e.target.value)}
                                                        onFocus={() => searchResults.length > 0 && setShowResults(true)}
                                                        placeholder={t('send_page.search_placeholder')}
                                                        className="flex-1 bg-transparent text-base font-bold outline-none placeholder:opacity-30 placeholder:font-medium"
                                                        style={{ color: 'var(--color-text-main)' }}
                                                    />
                                                    {selectedRecipient && (
                                                        <button onClick={clearRecipient} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                                                            <X className="w-5 h-5 opacity-50" style={{ color: 'var(--color-text-main)' }} />
                                                        </button>
                                                    )}
                                                </div>

                                                <AnimatePresence>
                                                    {showResults && searchResults.length > 0 && (
                                                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                                                            className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 rounded-xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl"
                                                            style={{ background: 'var(--color-bg-card)' }}>
                                                            <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                                                                {searchResults.map(user => (
                                                                    <button key={user.id} onClick={() => handleSelectRecipient(user)}
                                                                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-left">
                                                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 bg-[#EF4444]/10 text-[#EF4444]">
                                                                            {getInitials(user.name)}
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-sm font-bold" style={{ color: 'var(--color-text-main)' }}>{user.name}</div>
                                                                            <div className="text-xs opacity-50" style={{ color: 'var(--color-text-main)' }}>{user.email}</div>
                                                                        </div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-5">
                                            <div className="space-y-3">
                                                <label className="text-[11px] font-bold uppercase tracking-widest opacity-50" style={{ color: 'var(--color-text-main)' }}>Beneficiary Name</label>
                                                <input 
                                                    type="text" 
                                                    value={beneficiaryName} 
                                                    onChange={e => setBeneficiaryName(e.target.value)}
                                                    placeholder="Enter recipient's full name"
                                                    className="w-full py-4 px-5 rounded-xl text-sm font-bold outline-none border transition-all bg-black/20 hover:border-white/20 focus:border-[#EF4444] placeholder:opacity-30"
                                                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-main)', background: 'var(--color-bg-elevated)' }} 
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[11px] font-bold uppercase tracking-widest opacity-50" style={{ color: 'var(--color-text-main)' }}>RIB Number</label>
                                                    {rib.length > 0 && rib.length < 24 && (
                                                        <span className="text-[9px] font-bold text-[#EF4444] uppercase tracking-widest">{rib.length}/24 Digits</span>
                                                    )}
                                                </div>
                                                <input 
                                                    type="text" 
                                                    value={rib} 
                                                    onChange={e => setRib(e.target.value.replace(/\D/g, '').slice(0, 24))}
                                                    placeholder="24-digit bank account number"
                                                    className="w-full py-4 px-5 rounded-xl text-sm font-bold outline-none border transition-all bg-black/20 hover:border-white/20 focus:border-[#EF4444] placeholder:opacity-30 font-mono tracking-widest"
                                                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-main)', background: 'var(--color-bg-elevated)' }} 
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Amount Field */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[11px] font-bold uppercase tracking-widest opacity-50" style={{ color: 'var(--color-text-main)' }}>{t('send_page.amount_label')}</label>
                                            {parseFloat(amount) > balance && (
                                                <span className="text-[11px] font-bold text-[#EF4444] bg-[#EF4444]/10 px-2 py-0.5 rounded uppercase tracking-wider">{t('send_page.insufficient') || 'Insufficient Funds'}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 w-full py-3 px-5 rounded-xl border transition-all hover:border-white/20 focus-within:border-[#EF4444] bg-black/20" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-elevated)' }}>
                                            <span className="text-xl font-black opacity-30 shrink-0" style={{ color: 'var(--color-text-main)' }}>{code}</span>
                                            <input
                                                ref={amountInputRef}
                                                type="number"
                                                placeholder="0.00"
                                                value={amount}
                                                onChange={e => setAmount(e.target.value)}
                                                className="flex-1 bg-transparent text-3xl font-black outline-none placeholder:opacity-20"
                                                style={{ color: 'var(--color-text-main)' }}
                                            />
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            {[100, 500, 1000, 5000].map(amt => (
                                                <button key={amt} type="button" onClick={() => setAmount(String(amt))}
                                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors border ${amount === String(amt) ? 'bg-[#EF4444] text-white border-[#EF4444]' : 'bg-transparent hover:bg-white/5 opacity-70 hover:opacity-100'}`}
                                                    style={amount !== String(amt) ? { borderColor: 'var(--color-border)', color: 'var(--color-text-main)' } : {}}>
                                                    {amt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Note Field */}
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-bold uppercase tracking-widest opacity-50" style={{ color: 'var(--color-text-main)' }}>{t('send_page.note_label')} <span className="opacity-50 lowercase tracking-normal">({t('common.optional')})</span></label>
                                        <input 
                                            type="text" 
                                            value={note} 
                                            onChange={e => setNote(e.target.value)}
                                            placeholder={t('send_page.note_placeholder')}
                                            className="w-full py-4 px-5 rounded-xl text-sm font-medium outline-none border transition-all bg-black/20 hover:border-white/20 focus:border-[#EF4444] placeholder:opacity-30"
                                            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-main)', background: 'var(--color-bg-elevated)' }} 
                                        />
                                    </div>

                                    {/* Action Button */}
                                    <div className="pt-4">
                                        <button 
                                            onClick={handleSend}
                                            disabled={
                                                !amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance || sending ||
                                                (sendMode === 'contact' && !selectedRecipient) ||
                                                (sendMode === 'rib' && (!beneficiaryName || rib.length < 16))
                                            }
                                            className="w-full h-14 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all disabled:opacity-30 text-white"
                                            style={{ background: '#EF4444' }}
                                        >
                                            {sending ? (
                                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                                            ) : (
                                                <>
                                                    {t('send_page.confirm_btn')} <SendIcon className="w-4 h-4" />
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
                                    <div className="bg-white/[0.02] border border-white/5 rounded-[24px] p-6" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-[11px] font-bold uppercase tracking-widest opacity-50 mb-4" style={{ color: 'var(--color-text-main)' }}>{t('send_page.recent_contacts')}</h3>
                                        <div className="grid grid-cols-3 gap-3">
                                            {contacts.map(contact => (
                                                <button key={contact.id} onClick={() => handleSelectRecipient(contact)}
                                                    className="flex flex-col items-center p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group">
                                                    <div className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center text-sm font-bold mb-2 overflow-hidden border border-white/5 group-hover:border-[#EF4444]/30" style={{ color: 'var(--color-text-main)' }}>
                                                        {contact.avatar ? <img src={contact.avatar} className="w-full h-full object-cover" /> : getInitials(contact.name)}
                                                    </div>
                                                    <span className="text-xs font-bold truncate w-full text-center" style={{ color: 'var(--color-text-main)' }}>{contact.name.split(' ')[0]}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Selected Recipient Summary (Only shows when someone is selected) */}
                                {selectedRecipient && (
                                    <div className="bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-[24px] p-6 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[#EF4444] text-white flex items-center justify-center font-bold text-sm">
                                            {getInitials(selectedRecipient.name)}
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-[#EF4444] mb-0.5">Sending To</div>
                                            <div className="text-sm font-bold" style={{ color: 'var(--color-text-main)' }}>{selectedRecipient.name}</div>
                                        </div>
                                    </div>
                                )}

                                {/* Recent Transfers */}
                                {recentSends.length > 0 && (
                                    <div className="bg-white/[0.02] border border-white/5 rounded-[24px] p-6" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
                                        <div className="flex items-center gap-2 mb-6">
                                            <Clock className="w-4 h-4 opacity-40" style={{ color: 'var(--color-text-main)' }} />
                                            <h3 className="text-[11px] font-bold uppercase tracking-widest opacity-50" style={{ color: 'var(--color-text-main)' }}>{t('send_page.history') || 'Recent Transfers'}</h3>
                                        </div>
                                        <div className="space-y-4">
                                            {recentSends.slice(0, 5).map((tx, i) => (
                                                <div key={i} className="flex items-center justify-between group cursor-pointer" onClick={() => setAmount(String(tx.amount))}>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-[#EF4444]/10 text-[#EF4444] flex items-center justify-center text-xs font-bold">
                                                            {getInitials(tx.merchant?.replace('Sent to ', '') || '?')}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold group-hover:text-[#EF4444] transition-colors" style={{ color: 'var(--color-text-main)' }}>{tx.merchant?.replace('Sent to ', '')}</div>
                                                            <div className="text-[10px] font-medium opacity-50 mt-0.5" style={{ color: 'var(--color-text-main)' }}>{new Date(tx.transacted_at).toLocaleDateString()}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm font-bold text-[#EF4444]">-{format(tx.amount)}</div>
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

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
                input[type=number]::-webkit-inner-spin-button, 
                input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
            `}} />
        </div>
    );
}
