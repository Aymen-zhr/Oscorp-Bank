import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Search, ArrowRight, History, Filter, Download } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '../../hooks/useTranslation';
import { useCurrency } from '../../hooks/useCurrency';
import {
    LOGO_KEY,
    LOGO_BASE_URL,
    getDomain,
    STATUS_COLORS,
} from '../../constants';

function TransactionItem({ tx, format, index }) {
    const [failed, setFailed] = useState(false);
    const domain = getDomain(tx.merchant);
    const color =
        tx.logo_color ||
        (tx.type === 'credit' ? STATUS_COLORS.credit : STATUS_COLORS.debit);
    const isCredit = tx.type === 'credit';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, ease: 'easeOut' }}
            className="group relative flex items-center gap-3.5 border-b px-4 py-3.5 transition-all duration-300 hover:bg-[var(--color-bg-elevated)]/10"
            style={{
                borderColor: 'var(--color-border)',
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
            }}
        >
            {/* Merchant Logo Container */}
            <div className="relative shrink-0">
                <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-500 group-hover:scale-110"
                    style={{
                        background: `${color}10`,
                        border: `1px solid ${color}25`,
                        boxShadow: `0 0 15px ${color}05`,
                    }}
                >
                    {domain && !failed ? (
                        <img
                            src={`${LOGO_BASE_URL}/${domain}?token=${LOGO_KEY}&size=48&format=png`}
                            alt={tx.merchant}
                            className="h-6 w-6 object-contain brightness-110 filter"
                            onError={() => setFailed(true)}
                        />
                    ) : (
                        <span style={{ color, fontWeight: 900, fontSize: 15 }}>
                            {(tx.merchant || '?').charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
                {isCredit && (
                    <div
                        className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 bg-emerald-500"
                        style={{ borderColor: 'var(--color-bg-base)' }}
                    />
                )}
            </div>

            {/* Details */}
            <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-bold text-[var(--color-text-main)] transition-colors group-hover:text-[var(--color-gold)]">
                    {tx.merchant}
                </div>
                <div className="mt-0.5 flex items-center gap-2">
                    <span className="max-w-[100px] truncate text-[10px] font-medium tracking-wider text-[var(--color-text-muted)] uppercase">
                        {tx.category}
                    </span>
                    <span
                        className="h-1 w-1 rounded-full"
                        style={{
                            backgroundColor: 'var(--color-border)',
                            opacity: 0.2,
                        }}
                    />
                    <span
                        className="font-mono text-[10px]"
                        style={{
                            color: 'var(--color-text-muted)',
                            opacity: 0.6,
                        }}
                    >
                        {new Date(
                            tx.created_at || Date.now(),
                        ).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        })}
                    </span>
                </div>
            </div>

            {/* Amount */}
            <div className="shrink-0 text-right">
                <div
                    className={`text-[14px] font-black tracking-tight ${isCredit ? 'text-emerald-400' : ''}`}
                    style={{
                        color: isCredit ? undefined : 'var(--color-text-main)',
                    }}
                >
                    {isCredit ? '+' : '-'}
                    {format(tx.amount)
                        .replace(/\s+[A-Z]{2,3}$/, '')
                        .trim()}
                </div>
                <div
                    className="mt-0.5 text-[8px] font-bold tracking-widest uppercase"
                    style={{ color: 'var(--color-text-muted)', opacity: 0.4 }}
                >
                    SETTLED
                </div>
            </div>

            {/* Selection indicator */}
            <div
                className="absolute inset-y-0 left-0 w-[2px] origin-center scale-y-0 transition-transform group-hover:scale-y-100"
                style={{ backgroundColor: 'var(--color-gold)' }}
            />
        </motion.div>
    );
}

export default function TransactionsCard({ transactions }) {
    const { t } = useTranslation();
    const { format } = useCurrency();
    const [q, setQ] = useState('');

    const filtered = useMemo(() => {
        return (transactions || [])
            .filter(
                (tx) =>
                    tx.merchant.toLowerCase().includes(q.toLowerCase()) ||
                    tx.category.toLowerCase().includes(q.toLowerCase()),
            )
            .slice(0, 15);
    }, [transactions, q]);

    return (
        <div
            className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl"
            style={{
                background:
                    'linear-gradient(180deg, var(--color-card-gradient-from) 0%, var(--color-card-gradient-to) 100%)',
                border: '1px solid var(--color-border)',
            }}
        >
            {/* Architectural Header */}
            <div className="shrink-0 border-b border-[var(--color-border)]/20 bg-[var(--color-bg-elevated)]/5 px-5 pt-5 pb-4">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-gold)]/20 bg-[var(--color-gold-bg)] shadow-lg">
                            <History className="h-4.5 w-4.5 text-[var(--color-gold)]" />
                        </div>
                        <div>
                            <div className="text-[15px] leading-tight font-black tracking-tight text-[var(--color-text-main)]">
                                {t('dashboard.operational_ledger')}
                            </div>
                            <div className="mt-0.5 text-[9px] font-bold tracking-[0.2em] text-[var(--color-text-muted)] uppercase">
                                {t('dashboard.latest_movements')}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)]/30 bg-[var(--color-bg-elevated)]/10 text-[var(--color-text-muted)]/40 transition-colors hover:text-[var(--color-text-main)]"
                        >
                            <Download className="h-3.5 w-3.5" />
                        </motion.button>
                        <Link href="/transactions">
                            <motion.button
                                whileHover={{ x: 3 }}
                                className="flex items-center gap-1.5 pl-2 text-[10px] font-black tracking-widest text-[var(--color-gold)] uppercase hover:underline"
                            >
                                {t('all')}{' '}
                                <ArrowRight className="h-3.5 w-3.5" />
                            </motion.button>
                        </Link>
                    </div>
                </div>

                {/* Filter / Search Bar */}
                <div className="flex items-center gap-3">
                    <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 transition-all duration-300 focus-within:border-[var(--color-gold)]/50 focus-within:bg-white/[0.05]">
                        <Search className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Identify specific operation..."
                            className="w-full bg-transparent text-[11px] font-medium text-[var(--color-text-main)] outline-none placeholder:text-[var(--color-text-muted)]/30"
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-2 rounded-xl border border-[var(--color-border)]/30 bg-[var(--color-bg-elevated)]/10 px-3 py-2 text-[10px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase"
                    >
                        <Filter className="h-3 w-3" /> Filters
                    </motion.button>
                </div>
            </div>

            {/* List Body */}
            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
                {filtered.length > 0 ? (
                    <div className="divide-y divide-[var(--color-border)]/10">
                        {filtered.map((tx, i) => (
                            <TransactionItem
                                key={tx.id || i}
                                tx={tx}
                                index={i}
                                format={format}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center py-12 opacity-20">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--color-bg-elevated)]/20">
                            <Search className="h-8 w-8 text-[var(--color-text-muted)]/30" />
                        </div>
                        <div className="text-[12px] font-black tracking-[0.2em] text-[var(--color-text-muted)]/50 uppercase">
                            {t('dashboard.no_operations_found')}
                        </div>
                    </div>
                )}
            </div>

            {/* Status Footer */}
            <div className="flex shrink-0 items-center justify-between border-t border-[var(--color-border)]/20 bg-[var(--color-bg-elevated)]/5 px-5 py-3">
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
                    <span className="text-[9px] font-bold tracking-widest text-[var(--color-text-muted)] uppercase">
                        {filtered.length} active records detected
                    </span>
                </div>
                <div className="font-mono text-[8px] tracking-tighter text-[var(--color-text-muted)]/10 uppercase">
                    Secured by OIS Terminal
                </div>
            </div>
        </div>
    );
}
