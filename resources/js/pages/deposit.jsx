import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { ArrowDownToLine, CheckCircle, ArrowRight, Banknote, Info, Sparkles, Building2, Copy, Check } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

const QUICK_AMOUNTS = [200, 500, 1000, 2000, 5000, 10000];

const AGENCIES = ['Casablanca - Anfa', 'Casablanca - Maarif', 'Rabat - Agdal', 'Marrakech - Gueliz', 'Tangier - City Center'];

function formatMAD(n) {
    return Number(n).toLocaleString('en-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Deposit({ balance, recentDeposits }) {
    const [success, setSuccess] = useState(false);
    const [showRIB, setShowRIB] = useState(false);
    const [copied, setCopied] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const { t, locale } = useTranslation();

    const SOURCES = [
        { id: 'bank', name: t('deposit.source_bank'), icon: Building2, desc: 'Direct transfer to your OSCORP RIB' },
        { id: 'cash', name: t('deposit.source_agency'), icon: Banknote, desc: 'Cash deposit at any partner agency' },
        { id: 'wire', name: t('deposit.source_wire'), icon: Sparkles, desc: 'Swift/Wire from abroad' }
    ];

    const { data, setData, post, processing, errors } = useForm({
        amount: '',
        source: 'bank',
        agency: AGENCIES[0],
        note: '',
    });

    const newBalance = useMemo(() => balance + (parseFloat(data.amount) || 0), [balance, data.amount]);
    const isValidAmount = data.amount !== '' && parseFloat(data.amount) >= 1;

    const copyRIB = () => {
        navigator.clipboard.writeText("MA64 0079 9901 1234 5678 9012 34");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const submit = (e) => {
        if (e) e.preventDefault();
        post('/deposit', {
            onSuccess: () => {
                setSuccess(true);
                setConfirming(false);
                setData('amount', '');
                setTimeout(() => setSuccess(false), 5000);
            },
        });
    };

    const inputClass = "w-full py-3.5 px-4 rounded-xl text-[14px] outline-none transition-all border text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-gold)] focus:shadow-[0_0_0_4px_rgba(212,175,55,0.1)] bg-[var(--color-bg-elevated)] border-[var(--color-border)]";

    return (
        <div className="flex h-screen w-full overflow-hidden font-sans antialiased selection:bg-[var(--color-gold)] selection:text-white" style={{ background: 'var(--color-bg-base)' }}>
            <Head title="OSCORP | Deposit Funds" />
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                <Topbar />

                <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar">
                    <div className="max-w-5xl mx-auto space-y-8">
                        
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h1 className="text-[32px] font-bold tracking-tight text-[var(--color-text-main)]">{t('deposit.title')}</h1>
                                <p className="text-[14px] text-[var(--color-text-muted)] mt-1">{t('deposit.subtitle')}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">{t('deposit.available_balance')}</div>
                                <div className="text-[24px] font-bold text-[var(--color-gold)]">{formatMAD(balance)} <span className="text-[12px] font-medium opacity-60">MAD</span></div>
                            </div>
                        </div>

                        {/* Success Message */}
                        <AnimatePresence>
                            {success && (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                    className="p-6 rounded-2xl flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-[16px] font-bold text-emerald-400">{t('deposit.success_title')}</h3>
                                        <p className="text-[13px] text-[var(--color-text-muted)]">{t('deposit.success_desc')}</p>
                                    </div>
                                    <Link href="/transactions" className="ml-auto px-5 py-2.5 rounded-xl bg-emerald-500 text-black text-[12px] font-bold hover:brightness-110 transition-all">
                                        {t('deposit.history')}
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                
                                {/* Source Selector */}
                                <div className="p-1 rounded-2xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] flex">
                                    {SOURCES.map(s => (
                                        <button
                                            key={s.id}
                                            onClick={() => setData('source', s.id)}
                                            className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl transition-all ${data.source === s.name ? 'bg-[var(--color-bg-card)] shadow-lg border border-[var(--color-border)] scale-[1.02]' : 'opacity-60 hover:opacity-100'}`}
                                        >
                                            <s.icon className={`w-5 h-5 ${data.source === s.name ? 'text-[var(--color-gold)]' : ''}`} />
                                            <span className="text-[11px] font-bold uppercase tracking-wider">{s.name.split(' ')[0]}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Main Interaction Area */}
                                <div className="p-8 rounded-[32px] space-y-8 relative overflow-hidden" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-40" />
                                    
                                    {data.source === 'bank' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">{t('deposit.your_rib')}</div>
                                                <button onClick={copyRIB} className="flex items-center gap-2 text-[10px] font-bold text-[var(--color-gold)] hover:brightness-125 transition-all bg-[var(--color-gold-bg)] px-3 py-1.5 rounded-lg border border-[var(--color-gold)]/20">
                                                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                    {copied ? t('deposit.copied') : t('deposit.copy_rib')}
                                                </button>
                                            </div>
                                            <div className="p-5 rounded-2xl font-mono text-[16px] md:text-[18px] tracking-wider text-center bg-black/40 border border-[var(--color-border)] text-[var(--color-gold)]">
                                                MA64 0079 9901 1234 5678 9012 34
                                            </div>
                                            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                                                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                                <p className="text-[12px] text-[var(--color-text-muted)] leading-relaxed">
                                                     {t('deposit.rib_desc')}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {data.source === 'cash' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                            <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">{t('deposit.deposit_agency_label')}</label>
                                            <select value={data.agency} onChange={e => setData('agency', e.target.value)} className={inputClass}>
                                                {AGENCIES.map(a => <option key={a} value={a}>{a}</option>)}
                                            </select>
                                            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                                                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                                <p className="text-[12px] text-[var(--color-text-muted)] leading-relaxed">
                                                     {t('deposit.agency_desc', { agency: data.agency })}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Amount Selection */}
                                    <div className="space-y-5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">{t('deposit.amount_label')}</label>
                                        </div>
                                        <div className="relative">
                                            <Banknote className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={data.amount}
                                                onChange={e => setData('amount', e.target.value)}
                                                className={`${inputClass} pl-14 text-[28px] font-bold h-20`}
                                            />
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                <div className="h-8 w-[1px] bg-[var(--color-border)] mx-2" />
                                                <span className="text-[16px] font-bold text-[var(--color-text-muted)]">MAD</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                            {QUICK_AMOUNTS.map(amt => (
                                                <motion.button
                                                    key={amt}
                                                    type="button"
                                                    whileHover={{ scale: 1.05, y: -2 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setData('amount', String(amt))}
                                                    className={`py-3 rounded-xl text-[13px] font-bold transition-all border ${data.amount === String(amt) ? 'bg-[var(--color-gold)] text-black border-[var(--color-gold)] shadow-[0_8px_20px_rgba(212,175,55,0.2)]' : 'bg-[var(--color-bg-elevated)] border-[var(--color-border)] text-[var(--color-text-main)] hover:border-[var(--color-gold)]/40'}`}
                                                >
                                                    {amt >= 1000 ? `${amt / 1000}K` : amt}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => isValidAmount && setConfirming(true)}
                                        disabled={processing || !isValidAmount}
                                        className="w-full h-14 rounded-2xl text-[15px] font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-xl"
                                        style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', color: '#000' }}
                                    >
                                        {t('deposit.continue')}
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Right Panel - Info & History */}
                            <div className="space-y-6">
                                <div className="p-6 rounded-[28px] bg-[var(--color-bg-card)] border border-[var(--color-border)] space-y-5">
                                    <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">{t('deposit.balance_summary')}</div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-[13px]">
                                            <span className="text-[var(--color-text-muted)]">{t('deposit.current_balance')}</span>
                                            <span className="font-semibold">{formatMAD(balance)} MAD</span>
                                        </div>
                                        <div className="flex justify-between text-[13px]">
                                            <span className="text-[var(--color-text-muted)]">{t('deposit.expected_deposit')}</span>
                                            <span className="font-bold text-emerald-400">+{formatMAD(data.amount || 0)} MAD</span>
                                        </div>
                                        <div className="pt-3 border-t border-[var(--color-border)] flex justify-between">
                                            <span className="text-[14px] font-bold">{t('deposit.new_balance')}</span>
                                            <span className="text-[18px] font-bold text-[var(--color-gold)]">{formatMAD(newBalance)} MAD</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 rounded-[28px] bg-[var(--color-bg-card)] border border-[var(--color-border)] space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">{t('deposit.recent_deposits')}</div>
                                        <Link href="/transactions" className="text-[10px] font-bold text-[var(--color-gold)]">{t('deposit.view_all')}</Link>
                                    </div>
                                    <div className="space-y-1">
                                        {recentDeposits.slice(0, 3).map((d, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                                        <ArrowDownToLine className="w-4 h-4 text-emerald-400" />
                                                    </div>
                                                    <div>
                                                        <div className="text-[12px] font-bold">{d.source || 'Deposit'}</div>
                                                        <div className="text-[10px] text-[var(--color-text-muted)]">{new Date(d.transacted_at).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                                <div className="text-[13px] font-bold text-emerald-400">+{formatMAD(d.amount)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {confirming && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-md p-8 rounded-[32px] bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 inset-x-0 h-[4px] bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent" />
                            <h2 className="text-[24px] font-bold text-center mb-6">{t('deposit.confirm_title')}</h2>
                            
                            <div className="space-y-4 mb-8">
                                <div className="p-4 rounded-2xl bg-[var(--color-bg-elevated)] space-y-3">
                                    <div className="flex justify-between text-[14px]">
                                        <span className="text-[var(--color-text-muted)]">{t('deposit.amount')}</span>
                                        <span className="font-bold text-[var(--color-text-main)]">{formatMAD(data.amount)} MAD</span>
                                    </div>
                                    <div className="flex justify-between text-[14px]">
                                        <span className="text-[var(--color-text-muted)]">{t('deposit.method')}</span>
                                        <span className="font-bold text-[var(--color-text-main)]">{SOURCES.find(s => s.id === data.source)?.name}</span>
                                    </div>
                                    {data.source === 'cash' && (
                                        <div className="flex justify-between text-[14px]">
                                            <span className="text-[var(--color-text-muted)]">{t('deposit.agency_label')}</span>
                                            <span className="font-bold text-[var(--color-text-main)]">{data.agency}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={submit}
                                    disabled={processing}
                                    className="w-full h-14 rounded-2xl bg-[var(--color-gold)] text-black font-bold text-[16px] shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    {processing ? t('common.processing') : t('deposit.confirm_btn')}
                                </button>
                                <button
                                    onClick={() => setConfirming(false)}
                                    className="w-full h-12 rounded-2xl border border-[var(--color-border)] text-[var(--color-text-muted)] font-bold text-[14px] hover:text-[var(--color-text-main)] hover:bg-white/5 transition-all"
                                >
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
