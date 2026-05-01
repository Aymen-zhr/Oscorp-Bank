import { Head, useForm, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { ArrowUpFromLine, CheckCircle, ArrowRight, Banknote, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const QUICK_AMOUNTS = [500, 1000, 5000, 10000, 25000, 50000];
const DESTINATIONS = ['Bank Transfer', 'Cash Pickup', 'Wire Transfer', 'External Account'];

function formatMAD(n) {
    return Number(n).toLocaleString('en-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Withdrawal({ balance, recentWithdrawals }) {
    const [success, setSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        amount: '',
        source: 'Bank Transfer',
        note: '',
    });

    const amount        = parseFloat(data.amount) || 0;
    const newBalance    = balance - amount;
    const isValidAmount = data.amount !== '' && amount >= 1;
    const isInsufficient = amount > balance;
    const usagePercent  = balance > 0 ? Math.min(100, (amount / balance) * 100) : 0;

    const inputClass = "w-full py-3 px-4 rounded-xl text-[14px] outline-none transition-all border text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-gold)] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.12)] bg-[var(--color-bg-elevated)] border-[var(--color-border)]";

    const submit = (e) => {
        e.preventDefault();
        post('/withdrawal', {
            onSuccess: () => {
                setSuccessMsg('Withdrawal initiated successfully.');
                setSuccess(true);
                setData('amount', '');
                setData('note', '');
                setTimeout(() => setSuccess(false), 5000);
            },
        });
    };

    return (
        <div className="flex h-screen w-full overflow-hidden font-sans antialiased selection:bg-[var(--color-gold)] selection:text-white" style={{ background: 'var(--color-bg-base)' }}>
            <Head title="OSCORP | Withdrawal" />
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-5" style={{ background: 'rgba(239,68,68,0.5)' }} />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none opacity-5" style={{ background: 'var(--color-gold)' }} />

                <Topbar />

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="flex-1 overflow-y-auto px-6 py-8">
                    <div className="max-w-7xl mx-auto space-y-8">

                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-[32px] font-bold tracking-tight text-[var(--color-text-main)]">Request Withdrawal</h1>
                                <p className="text-[14px] text-[var(--color-text-muted)] mt-1">Transfer funds from your OSCORP account securely.</p>
                            </div>
                            <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl" style={{ background: 'var(--color-gold-bg)', border: '1px solid var(--color-border)' }}>
                                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--color-gold)' }} />
                                <span className="text-[13px] font-bold" style={{ color: 'var(--color-gold)' }}>
                                    Available: {formatMAD(balance)} MAD
                                </span>
                            </div>
                        </div>

                        {/* Success Banner */}
                        <AnimatePresence>
                            {success && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center gap-4 p-5 rounded-2xl"
                                    style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)' }}>
                                    <CheckCircle className="w-6 h-6 text-amber-400 shrink-0" />
                                    <div>
                                        <div className="text-[15px] font-bold text-amber-400">Withdrawal Initiated!</div>
                                        <div className="text-[13px] text-[var(--color-text-muted)]">{successMsg}</div>
                                    </div>
                                    <Link href="/transactions" className="ml-auto px-4 py-2 rounded-xl text-[12px] font-bold text-amber-400 hover:bg-amber-500/10 transition-all">
                                        View Transactions →
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Main Form */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Quick Amounts */}
                                <div className="p-6 rounded-[28px] space-y-4" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                    <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Quick Amounts</div>
                                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                        {QUICK_AMOUNTS.map(amt => {
                                            const over = amt > balance;
                                            return (
                                                <motion.button key={amt}
                                                    type="button"
                                                    whileHover={{ scale: over ? 1 : 1.04 }}
                                                    whileTap={{ scale: over ? 1 : 0.97 }}
                                                    onClick={() => !over && setData('amount', String(amt))}
                                                    disabled={over}
                                                    className="py-2.5 rounded-xl text-[13px] font-bold transition-all"
                                                    style={amount === amt && !over
                                                        ? { background: '#EF4444', color: '#fff', boxShadow: '0 4px 14px rgba(239,68,68,0.3)' }
                                                        : over
                                                            ? { background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', opacity: 0.4, cursor: 'not-allowed' }
                                                            : { background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}>
                                                    {amt >= 1000 ? `${amt / 1000}K` : amt}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                    <p className="text-[11px] text-[var(--color-text-muted)]">Greyed-out amounts exceed your available balance.</p>
                                </div>

                                {/* Form */}
                                <form onSubmit={submit} className="p-6 rounded-[28px] space-y-5 relative overflow-hidden" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                    <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #EF4444, transparent)' }} />

                                    {/* Amount */}
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2">Withdrawal Amount (MAD)</label>
                                        <div className="relative">
                                            <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                                            <input
                                                type="number" min="1" max={balance}
                                                placeholder="0.00"
                                                value={data.amount}
                                                onChange={e => setData('amount', e.target.value)}
                                                className={`${inputClass} pl-10 text-[22px] font-bold ${isInsufficient ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]' : ''}`}
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-[var(--color-text-muted)]">MAD</span>
                                        </div>
                                        <AnimatePresence>
                                            {isInsufficient && (
                                                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                    className="mt-2 flex items-center gap-2 text-[12px] text-red-400 font-medium">
                                                    <AlertTriangle className="w-3.5 h-3.5" />
                                                    Insufficient funds — Max available: {formatMAD(balance)} MAD
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        {errors.amount && <div className="mt-2 text-[12px] text-red-400 font-medium">{errors.amount}</div>}
                                    </div>

                                    {/* Balance usage bar */}
                                    {isValidAmount && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                                            <div className="flex justify-between text-[11px] text-[var(--color-text-muted)]">
                                                <span>Balance usage</span>
                                                <span className={`font-semibold ${isInsufficient ? 'text-red-400' : 'text-[var(--color-text-main)]'}`}>
                                                    {usagePercent.toFixed(1)}% of balance
                                                </span>
                                            </div>
                                            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-elevated)' }}>
                                                <motion.div className="h-full rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(100, usagePercent)}%` }}
                                                    style={{ background: isInsufficient ? '#EF4444' : usagePercent > 80 ? '#F59E0B' : '#34D399' }}
                                                />
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Destination */}
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2">Withdrawal Destination</label>
                                        <select value={data.source} onChange={e => setData('source', e.target.value)} className={inputClass}>
                                            {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>

                                    {/* Note */}
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2">
                                            Reference Note <span className="normal-case font-normal">(optional)</span>
                                        </label>
                                        <textarea rows={2} placeholder="Add a reference or description..."
                                            value={data.note} onChange={e => setData('note', e.target.value)}
                                            className={`${inputClass} resize-none`} />
                                    </div>

                                    {/* Live Preview */}
                                    {isValidAmount && !isInsufficient && (
                                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                            className="p-4 rounded-2xl space-y-3"
                                            style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
                                            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Transaction Preview</div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[13px] text-[var(--color-text-muted)]">Withdrawal Amount</span>
                                                <span className="text-[15px] font-bold text-red-400">-{formatMAD(amount)} MAD</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[13px] text-[var(--color-text-muted)]">Destination</span>
                                                <span className="text-[13px] font-semibold text-[var(--color-text-main)]">{data.source}</span>
                                            </div>
                                            <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
                                                <span className="text-[13px] font-bold text-[var(--color-text-main)]">Remaining Balance</span>
                                                <span className="text-[18px] font-bold" style={{ color: 'var(--color-gold)' }}>{formatMAD(newBalance)} MAD</span>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Warning */}
                                    <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)' }}>
                                        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                        <p className="text-[12px] text-[var(--color-text-muted)] leading-relaxed">
                                            Withdrawals are processed within 1 business day. Wire Transfers may take up to 3 business days.
                                        </p>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: isInsufficient ? 1 : 1.02 }}
                                        whileTap={{ scale: isInsufficient ? 1 : 0.98 }}
                                        type="submit"
                                        disabled={processing || !isValidAmount || isInsufficient}
                                        className="w-full py-3.5 rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{
                                            background: isInsufficient ? '#374151' : '#EF4444',
                                            color: '#fff',
                                            boxShadow: isInsufficient ? 'none' : '0 6px 20px rgba(239,68,68,0.25)'
                                        }}>
                                        {processing ? 'Processing...' : isInsufficient ? 'Insufficient Funds' : 'Confirm Withdrawal'}
                                        {!processing && !isInsufficient && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                    </motion.button>
                                </form>
                            </div>

                            {/* Right column */}
                            <div className="space-y-6">
                                <div className="p-6 rounded-[28px] space-y-4" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                    <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">How It Works</div>
                                    {[
                                        { step: '1', text: 'Select an amount within your available balance' },
                                        { step: '2', text: 'Choose your withdrawal destination' },
                                        { step: '3', text: 'Review the preview and confirm' },
                                    ].map(s => (
                                        <div key={s.step} className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5"
                                                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
                                                {s.step}
                                            </div>
                                            <span className="text-[13px] text-[var(--color-text-muted)] leading-relaxed">{s.text}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6 rounded-[28px] space-y-4" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                    <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Recent Withdrawals</div>
                                    {recentWithdrawals.length === 0 ? (
                                        <div className="text-center py-6 text-[13px] text-[var(--color-text-muted)]">No withdrawals yet.</div>
                                    ) : (
                                        recentWithdrawals.map((w, i) => (
                                            <div key={i} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: 'var(--color-border)' }}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
                                                        <ArrowUpFromLine className="w-3.5 h-3.5 text-red-400" />
                                                    </div>
                                                    <div>
                                                        <div className="text-[13px] font-semibold text-[var(--color-text-main)]">{w.source || 'Withdrawal'}</div>
                                                        <div className="text-[11px] text-[var(--color-text-muted)]">{new Date(w.transacted_at).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                                <span className="text-[13px] font-bold text-red-400">-{formatMAD(w.amount)}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
