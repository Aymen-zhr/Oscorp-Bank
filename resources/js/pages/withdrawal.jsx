import { Head, useForm, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { ArrowUpFromLine, CheckCircle, ArrowRight, Banknote, ShieldAlert, AlertTriangle, Building2, Lock, Smartphone, X } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';

const QUICK_AMOUNTS = [200, 500, 1000, 2000, 5000, 10000];
const MOROCCAN_BANKS = [
    { id: 'awb', name: 'Attijariwafa Bank' },
    { id: 'bcp', name: 'Banque Populaire' },
    { id: 'boa', name: 'Bank of Africa' },
    { id: 'cih', name: 'CIH Bank' },
    { id: 'cdm', name: 'Crédit du Maroc' },
    { id: 'sg', name: 'Société Générale' },
    { id: 'bmci', name: 'BMCI' },
    { id: 'oscorp', name: 'OSCORP Private' },
];

export default function Withdrawal({ balance, recentWithdrawals }) {
    const [step, setStep] = useState('form'); // 'form', 'otp', 'success'
    const [otp, setOtp] = useState(['', '', '', '']);
    const [fee, setFee] = useState(0);
    const { t, locale } = useTranslation();
    const { format, code } = useCurrency();

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        bank: MOROCCAN_BANKS[0].name,
        rib: '',
        note: '',
    });

    const amount = parseFloat(data.amount) || 0;
    const totalAmount = amount + fee;
    const isInsufficient = totalAmount > balance;
    const isValidRIB = data.rib.replace(/\s/g, '').length === 24;
    const isValidForm = amount >= 10 && isValidRIB && !isInsufficient;

    useEffect(() => {
        // Logical fees for Moroccan banking
        if (data.bank === 'OSCORP Private') setFee(0);
        else if (amount > 10000) setFee(15);
        else setFee(5);
    }, [data.bank, amount]);

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 3) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const initiateWithdrawal = (e) => {
        e.preventDefault();
        setStep('otp');
    };

    const confirmWithdrawal = () => {
        post('/withdrawal', {
            onSuccess: () => {
                setStep('success');
                reset();
            },
        });
    };

    const inputClass = "w-full py-3.5 px-4 rounded-xl text-[14px] outline-none transition-all border text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-gold)] focus:shadow-[0_0_0_4px_rgba(212,175,55,0.1)] bg-[var(--color-bg-elevated)] border-[var(--color-border)]";

    return (
        <div className="flex h-screen w-full overflow-hidden font-sans antialiased selection:bg-[var(--color-gold)] selection:text-white" style={{ background: 'var(--color-bg-base)' }}>
            <Head title="OSCORP | Withdrawal" />
            <Sidebar active="withdrawal" />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                <Topbar />

                <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar">
                    <div className="max-w-5xl mx-auto space-y-8">
                        
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h1 className="text-[32px] font-bold tracking-tight text-[var(--color-text-main)]">{t('withdrawal.title')}</h1>
                                <p className="text-[14px] text-[var(--color-text-muted)] mt-1">{t('withdrawal.subtitle')}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">{t('withdrawal.available_balance')}</div>
                                <div className="text-[24px] font-bold text-[var(--color-gold)]">{format(balance)} <span className="text-[12px] font-medium opacity-60">{code}</span></div>
                            </div>
                        </div>

                        {step === 'success' ? (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center p-12 rounded-[40px] bg-[var(--color-bg-card)] border border-[var(--color-border)] text-center space-y-6 shadow-2xl">
                                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">
                                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-[28px] font-bold text-[var(--color-text-main)]">{t('withdrawal.success_title')}</h2>
                                    <p className="text-[14px] text-[var(--color-text-muted)] max-sm">
                                        {t('withdrawal.success_desc')}
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <Link href="/transactions" className="px-8 py-3.5 rounded-2xl bg-[var(--color-gold)] text-black font-bold text-[14px] hover:brightness-110 transition-all">
                                        {t('withdrawal.view_transactions')}
                                    </Link>

                                    <button onClick={() => setStep('form')} className="px-8 py-3.5 rounded-2xl border border-[var(--color-border)] font-bold text-[14px] hover:bg-white/5 transition-all">
                                        {t('withdrawal.new_withdrawal')}
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <form onSubmit={initiateWithdrawal} className="p-8 rounded-[32px] space-y-6 relative overflow-hidden" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-40" />

                                        {/* Bank Selector */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">{t('withdrawal.destination_bank')}</label>
                                                <div className="relative">
                                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                                                    <select value={data.bank} onChange={e => setData('bank', e.target.value)} className={`${inputClass} pl-10`}>
                                                        {MOROCCAN_BANKS.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">{t('withdrawal.rib_label')}</label>
                                                <input
                                                    type="text"
                                                    placeholder={t('withdrawal.rib_placeholder')}
                                                    value={data.rib}
                                                    onChange={e => {
                                                        const val = e.target.value.replace(/\D/g, '').slice(0, 24);
                                                        const formatted = val.replace(/(.{4})/g, '$1 ').trim();
                                                        setData('rib', formatted);
                                                    }}
                                                    className={inputClass}
                                                />
                                            </div>
                                        </div>

                                        {/* Amount */}
                                        <div className="space-y-4 pt-4 border-t border-[var(--color-border)]">
                                            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">{t('withdrawal.amount_label')}</label>
                                            <div className="relative">
                                                <Banknote className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                                                <input
                                                    type="number"
                                                    placeholder={t('withdrawal.amount_placeholder')}
                                                    value={data.amount}
                                                    onChange={e => setData('amount', e.target.value)}
                                                    className={`${inputClass} pl-14 text-[28px] font-bold h-20 ${isInsufficient ? 'border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : ''}`}
                                                />
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                    <div className="h-8 w-[1px] bg-[var(--color-border)] mx-2" />
                                                    <span className="text-[16px] font-bold text-[var(--color-text-muted)]">{code}</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                                {QUICK_AMOUNTS.map(amt => (
                                                    <motion.button
                                                        key={amt}
                                                        type="button"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setData('amount', String(amt))}
                                                        className={`py-3 rounded-xl text-[13px] font-bold transition-all border ${data.amount === String(amt) ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20' : 'bg-[var(--color-bg-elevated)] border-[var(--color-border)] text-[var(--color-text-main)] hover:border-red-500/40'}`}
                                                    >
                                                        {amt >= 1000 ? `${amt / 1000}K` : amt}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Preview Details */}
                                        <AnimatePresence>
                                            {isValidForm && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                                    className="p-6 rounded-2xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] space-y-3 overflow-hidden">
                                                    <div className="flex justify-between text-[13px]">
                                                        <span className="text-[var(--color-text-muted)]">{t('withdrawal.transfer_fee', { bank: data.bank.split(' ')[0] })}</span>
                                                        <span className="font-bold text-amber-400">{format(fee)} {code}</span>
                                                    </div>
                                                    <div className="flex justify-between text-[13px]">
                                                        <span className="text-[var(--color-text-muted)]">{t('withdrawal.total_debit')}</span>
                                                        <span className="font-bold text-red-400">{format(totalAmount)} {code}</span>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {isInsufficient && (
                                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                                <span className="text-[12px] font-bold text-red-500 uppercase tracking-wide">{t('withdrawal.insufficient_funds')}</span>
                                            </div>
                                        )}

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            disabled={!isValidForm || processing}
                                            className="w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                                            style={{ background: 'linear-gradient(135deg, #EF4444, #B91C1C)', color: '#fff' }}
                                        >
                                            {processing ? t('common.processing') : t('withdrawal.verify_confirm')}
                                            <ArrowRight className="w-5 h-5" />
                                        </motion.button>
                                    </form>
                                </div>

                                {/* Right Panel */}
                                <div className="space-y-6">
                                    <div className="p-6 rounded-[28px] bg-[var(--color-bg-card)] border border-[var(--color-border)] space-y-4">
                                        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)] flex items-center gap-2">
                                            <ShieldAlert className="w-4 h-4 text-[var(--color-gold)]" />
                                            {t('withdrawal.security_title')}
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-lg bg-[var(--color-gold-bg)] flex items-center justify-center shrink-0">
                                                    <Lock className="w-3 h-3 text-[var(--color-gold)]" />
                                                </div>
                                                <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
                                                     {t('withdrawal.security_otp')}
                                                 </p>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-lg bg-[var(--color-gold-bg)] flex items-center justify-center shrink-0">
                                                    <Smartphone className="w-3 h-3 text-[var(--color-gold)]" />
                                                </div>
                                                <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
                                                     {t('withdrawal.security_time')}
                                                 </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-[28px] bg-[var(--color-bg-card)] border border-[var(--color-border)] space-y-4">
                                        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">{t('withdrawal.recent_history')}</div>
                                        <div className="space-y-3">
                                            {recentWithdrawals.length === 0 ? (
                                                <div className="text-center py-4 text-[11px] text-[var(--color-text-muted)] opacity-50 italic">{t('withdrawal.no_recent')}</div>
                                            ) : (
                                                recentWithdrawals.slice(0, 3).map((w, i) => (
                                                    <div key={i} className="flex items-center justify-between">
                                                        <div>
                                                             <div className="text-[12px] font-bold">{w.bank || t('withdrawal.default_label')}</div>
                                                            <div className="text-[10px] text-[var(--color-text-muted)]">{new Date(w.transacted_at).toLocaleDateString()}</div>
                                                        </div>
                                                         <div className="text-[13px] font-bold text-red-500">-{format(w.amount)}</div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* OTP Modal */}
            <AnimatePresence>
                {step === 'otp' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md px-4">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-md bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[40px] p-10 relative overflow-hidden text-center">
                            <div className="absolute top-0 inset-x-0 h-1 bg-[var(--color-gold)]" />
                            <button onClick={() => setStep('form')} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-[var(--color-text-muted)]">
                                <X className="w-5 h-5" />
                            </button>
                            
                            <div className="w-16 h-16 rounded-2xl bg-[var(--color-gold-bg)] flex items-center justify-center mx-auto mb-6">
                                <Smartphone className="w-8 h-8 text-[var(--color-gold)]" />
                            </div>
                            
                            <h2 className="text-[24px] font-bold mb-2">{t('withdrawal.otp_title')}</h2>
                            <p className="text-[14px] text-[var(--color-text-muted)] mb-8">
                                 {t('withdrawal.otp_desc')}
                             </p>
                            
                            <div className="flex justify-center gap-4 mb-8">
                                {otp.map((digit, i) => (
                                    <input
                                        key={i} id={`otp-${i}`}
                                        type="text" value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        className="w-14 h-16 rounded-2xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-center text-[24px] font-bold text-[var(--color-gold)] focus:border-[var(--color-gold)] outline-none transition-all"
                                    />
                                ))}
                            </div>
                            
                            <button
                                onClick={confirmWithdrawal}
                                disabled={otp.some(d => !d) || processing}
                                className="w-full h-14 rounded-2xl bg-[var(--color-gold)] text-black font-bold text-[16px] shadow-lg hover:brightness-110 disabled:opacity-50 transition-all mb-4"
                            >
                                {processing ? t('withdrawal.validating') : t('withdrawal.confirm_btn')}
                            </button>
                            
                            <p className="text-[12px] text-[var(--color-text-muted)]">
                                 {t('withdrawal.no_code')} <span className="text-[var(--color-gold)] cursor-pointer hover:underline font-bold">{t('withdrawal.resend')}</span>
                             </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
