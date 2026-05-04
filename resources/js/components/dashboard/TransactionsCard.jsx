import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Search, ArrowRight, History, Filter, Download } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '../../hooks/useTranslation';
import { useCurrency } from '../../hooks/useCurrency';
import { LOGO_KEY, LOGO_BASE_URL, getDomain, STATUS_COLORS } from '../../constants';

function TransactionItem({ tx, format, index }) {
    const [failed, setFailed] = useState(false);
    const domain = getDomain(tx.merchant);
    const color = tx.logo_color || (tx.type === 'credit' ? STATUS_COLORS.credit : STATUS_COLORS.debit);
    const isCredit = tx.type === 'credit';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, ease: "easeOut" }}
            className="group relative flex items-center gap-3.5 px-4 py-3.5 hover:bg-white/[0.02] transition-all duration-300 border-b border-white/[0.03]"
        >
            {/* Merchant Logo Container */}
            <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500"
                    style={{ background: `${color}10`, border: `1px solid ${color}25`, boxShadow: `0 0 15px ${color}05` }}>
                    {domain && !failed ? (
                        <img src={`${LOGO_BASE_URL}/${domain}?token=${LOGO_KEY}&size=48&format=png`}
                            alt={tx.merchant} className="w-6 h-6 object-contain filter brightness-110"
                            onError={() => setFailed(true)} />
                    ) : (
                        <span style={{ color, fontWeight: 900, fontSize: 15 }}>
                            {(tx.merchant || '?').charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
                {isCredit && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0D0D0D]" />
                )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold text-white group-hover:text-[var(--color-gold)] transition-colors truncate">
                    {tx.merchant}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-[var(--color-text-muted)] font-medium uppercase tracking-wider truncate max-w-[100px]">
                        {tx.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="text-[10px] font-mono text-[var(--color-text-muted)] opacity-60">
                        {new Date(tx.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                </div>
            </div>

            {/* Amount */}
            <div className="text-right shrink-0">
                <div className={`text-[14px] font-black tracking-tight ${isCredit ? 'text-emerald-400' : 'text-white'}`}>
                    {isCredit ? '+' : '-'}{format(tx.amount).replace(/\s+[A-Z]{2,3}$/, '').trim()}
                </div>
                <div className="text-[8px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold mt-0.5 opacity-40">
                    SETTLED
                </div>
            </div>

            {/* Selection indicator */}
            <div className="absolute left-0 inset-y-0 w-[2px] bg-[var(--color-gold)] scale-y-0 group-hover:scale-y-100 transition-transform origin-center" />
        </motion.div>
    );
}

export default function TransactionsCard({ transactions }) {
    const { t } = useTranslation();
    const { format } = useCurrency();
    const [q, setQ] = useState('');

    const filtered = useMemo(() => {
        return (transactions || []).filter(tx =>
            tx.merchant.toLowerCase().includes(q.toLowerCase()) ||
            tx.category.toLowerCase().includes(q.toLowerCase())
        ).slice(0, 15);
    }, [transactions, q]);

    return (
        <div className="h-full w-full rounded-2xl flex flex-col overflow-hidden relative"
            style={{ background: 'linear-gradient(180deg, #0D0D0D 0%, #050505 100%)', border: '1px solid var(--color-border)' }}>
            
            {/* Architectural Header */}
            <div className="px-5 pt-5 pb-4 shrink-0 border-b border-white/[0.05] bg-white/[0.01]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[var(--color-gold-bg)] border border-[var(--color-gold)]/20 flex items-center justify-center shadow-lg">
                            <History className="w-4.5 h-4.5 text-[var(--color-gold)]" />
                        </div>
                        <div>
                            <div className="text-[15px] font-black text-white tracking-tight leading-tight">
                                {t('dashboard.operational_ledger')}
                            </div>
                            <div className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-[0.2em] font-bold mt-0.5">
                                {t('dashboard.latest_movements')}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <motion.button whileHover={{ scale: 1.05 }} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                            <Download className="w-3.5 h-3.5" />
                        </motion.button>
                        <Link href="/transactions">
                            <motion.button 
                                whileHover={{ x: 3 }}
                                className="flex items-center gap-1.5 text-[10px] font-black text-[var(--color-gold)] uppercase tracking-widest hover:underline pl-2"
                            >
                                {t('all')} <ArrowRight className="w-3.5 h-3.5" />
                            </motion.button>
                        </Link>
                    </div>
                </div>

                {/* Filter / Search Bar */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] focus-within:border-[var(--color-gold)]/50 focus-within:bg-white/[0.05] transition-all duration-300">
                        <Search className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                        <input 
                            value={q} 
                            onChange={e => setQ(e.target.value)}
                            placeholder="Identify specific operation..."
                            className="bg-transparent outline-none text-[11px] text-white placeholder:text-white/20 w-full font-medium" 
                        />
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                        <Filter className="w-3 h-3" /> Filters
                    </motion.button>
                </div>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar overscroll-contain">
                {filtered.length > 0 ? (
                    <div className="divide-y divide-white/[0.02]">
                        {filtered.map((tx, i) => (
                            <TransactionItem key={tx.id || i} tx={tx} index={i} format={format} />
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 py-12">
                        <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-4">
                            <Search className="w-8 h-8" />
                        </div>
                        <div className="text-[12px] font-black uppercase tracking-[0.2em]">{t('dashboard.no_operations_found')}</div>
                    </div>
                )}
            </div>

            {/* Status Footer */}
            <div className="px-5 py-3 border-t border-white/[0.05] flex items-center justify-between shrink-0 bg-white/[0.01]">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
                    <span className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">
                        {filtered.length} active records detected
                    </span>
                </div>
                <div className="text-[8px] font-mono text-white/10 uppercase tracking-tighter">
                    Secured by OIS Terminal
                </div>
            </div>
        </div>
    );
}
