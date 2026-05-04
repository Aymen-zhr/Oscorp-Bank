import { Head, router } from '@inertiajs/react';
import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, SlidersHorizontal, ChevronLeft, ChevronRight,
    X, Download, ArrowUpRight, ArrowDownLeft, Wallet,
    CreditCard, Calendar, Sparkles
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import { catColor, LOGO_KEY, LOGO_BASE_URL, getDomain, DICEBEAR_BASE_URL, STATUS_COLORS } from '@/constants';

/* ── Merchant Logo component ───────────────────────────────── */
const MerchantLogo = function MerchantLogo({ merchant, logoColor, size = 46 }) {
    const [failed, setFailed] = useState(false);
    const domain = getDomain(merchant);
    const color  = logoColor || STATUS_COLORS.default;
    const letter = (merchant || '?').charAt(0).toUpperCase();

    const base = {
        width: size, height: size, flexShrink: 0, borderRadius: 14,
        background: `linear-gradient(135deg, ${color}28, ${color}0f)`,
        border: `1.5px solid ${color}40`,
        boxShadow: `0 2px 10px ${color}15`,
    };

    if (domain && !failed) {
        return (
            <div style={{ ...base, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, overflow: 'hidden' }}>
                <img
                    src={`${LOGO_BASE_URL}/${domain}?token=${LOGO_KEY}&size=64&format=png`}
                    alt={merchant}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={() => setFailed(true)}
                />
            </div>
        );
    }

    return (
        <div style={{
            ...base, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color, fontWeight: 700, fontSize: size * 0.38, userSelect: 'none',
        }}>
            {letter}
        </div>
    );
};
const MemoizedMerchantLogo = function(props) { return <MerchantLogo {...props} />; };

/* ── Amount ────────────────────────────────────────────────── */
const Amount = function Amount({ tx, format, code }) {
    const ok = tx.type === 'credit';
    return (
        <div className={`flex flex-col items-end ${ok ? 'text-emerald-400' : 'text-red-400'}`}>
            <div className="flex items-center gap-1 text-[16px] font-bold leading-none">
                {ok ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                {ok ? '+' : '-'}{format(tx.amount)}
            </div>
            <span className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{code}</span>
        </div>
    );
};
const MemoizedAmount = function(props) { return <Amount {...props} />; };

// Wrapper to pass format and code to Amount

/* ── Helpers ───────────────────────────────────────────────── */
const fmtTime = (d, loc) => {
    const date = new Date(d);
    return isNaN(date.getTime()) ? '–' : date.toLocaleTimeString(loc || 'en-GB', { hour: '2-digit', minute: '2-digit' });
};
const fmtDay  = (d, loc) => {
    const date = new Date(d);
    return isNaN(date.getTime()) ? 'Unknown Date' : date.toLocaleDateString(loc || 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
};

/* ── Quick chip ────────────────────────────────────────────── */
const Chip = function Chip({ label, active, onClick, color }) {
    const c = color || 'var(--color-gold)';
    return (
        <button onClick={onClick} className="px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all whitespace-nowrap"
            style={active
                ? { background: c + '22', color: c, border: `1px solid ${c}50` }
                : { background: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }
            }>
            {label}
        </button>
    );
};

/* ══════════════════════════════════════════════════════════════
   Main page
══════════════════════════════════════════════════════════════ */
export default function Transactions({ transactions, filters, categories, stats }) {
    const [search, setSearch]           = useState(filters.search || '');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const { t, locale } = useTranslation();
    const { format, code } = useCurrency();

    const go = useCallback((patch) => {
        router.get('/transactions', { ...filters, ...patch }, { preserveState: true, replace: true });
    }, [filters]);

    const clearAll = useCallback(() => { setSearch(''); router.get('/transactions'); }, []);

    const hasFilters = filters.type !== 'all' || filters.category !== 'all'
        || filters.date_from || filters.date_to || filters.search;

    const groups = useMemo(() => {
        if (!transactions || !transactions.data) return {};
        return transactions.data.reduce((acc, tx) => {
            const date = tx.transacted_at ? new Date(tx.transacted_at) : new Date();
            const key = date.toDateString();
            if (!acc[key]) acc[key] = [];
            acc[key].push(tx);
            return acc;
        }, {});
    }, [transactions]);

    const statsCards = useMemo(() => [
    { label: t('transactions.net_balance'), value: format(stats.balance || 0), color: 'var(--color-gold)', Icon: Wallet },
    { label: t('transactions.money_in'),    value: '+' + format(stats.total_credits || 0), color: '#34D399', Icon: ArrowDownLeft },
    { label: t('transactions.money_out'),   value: '-' + format(Math.abs(stats.total_debits  || 0)), color: '#F87171', Icon: ArrowUpRight },
    ], [stats.balance, stats.total_credits, stats.total_debits, format]);

    const exportUrl = `/transactions/export?type=${filters.type}&category=${filters.category}&search=${encodeURIComponent(filters.search || '')}&date_from=${filters.date_from || ''}&date_to=${filters.date_to || ''}`;

    return (
        <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
            <Head title="OSCORP | Transactions" />
            <Sidebar active="transactions" />
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Background Fixed Glows (Stabilized) */}
                <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[var(--color-gold)] opacity-[0.03] rounded-full blur-[120px] pointer-events-none z-0" />
                <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-blue-500 opacity-[0.02] rounded-full blur-[100px] pointer-events-none z-0" />
                
                <Topbar />

                <div className="flex-1 overflow-y-auto pb-32 md:pb-0">
                    <div className="max-w-5xl mx-auto px-6 py-5 space-y-5">

                        {/* ── Header ── */}
                        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
                            className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-[26px] font-bold tracking-tight" style={{ color: 'var(--color-text-main)' }}>
                                    {t('transactions.title')}
                                </h1>
                                <p className="text-[13px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                                    {t('transactions.records_info', { count: (transactions?.total || 0).toLocaleString(), current: transactions?.current_page || 1, total: transactions?.last_page || 1 })}
                                </p>
                            </div>
                            <a href={exportUrl} className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium shrink-0 transition-all hover:opacity-80"
                                style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                    <Download className="w-4 h-4" /> {t('transactions.export')}
                            </a>
                        </motion.div>

                        {/* ── Stats ── */}
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                             {statsCards.map(({ label, value, color, Icon }, i) => (
                                <motion.div key={label}
                                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * (i + 1) }}
                                    className="p-4 rounded-2xl flex items-center gap-4"
                                    style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: color + '18', border: `1px solid ${color}30` }}>
                                        <Icon className="w-5 h-5" style={{ color }} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>{label}</div>
                                        <div className="text-[20px] font-bold leading-none" style={{ color }}>
                                            {value} <span className="text-[11px] font-normal opacity-60">{code}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* ── Search & chips ── */}
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="flex-1 flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
                                    style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                    <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--color-text-muted)' }} />
                                    <input type="text" value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && go({ search })}
                                        onBlur={() => search !== (filters.search || '') && go({ search })}
                                        placeholder={t('transactions.search_placeholder')}
                                        className="flex-1 bg-transparent text-[14px] outline-none"
                                        style={{ color: 'var(--color-text-main)' }} />
                                    {search && (
                                        <button onClick={() => { setSearch(''); go({ search: '' }); }}>
                                            <X className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                                        </button>
                                    )}
                                </div>
                                <button onClick={() => setShowAdvanced(v => !v)}
                                    className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all"
                                    style={showAdvanced
                                        ? { background: 'var(--color-gold-bg)', border: '1px solid var(--color-gold)', color: 'var(--color-gold)' }
                                        : { background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }
                                    }>
                                    <SlidersHorizontal className="w-4 h-4" /> {t('transactions.filters')}
                                    {hasFilters && (
                                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: 'var(--color-gold)' }} />
                                    )}
                                </button>
                                {hasFilters && (
                                    <button onClick={clearAll} className="px-3 py-2.5 rounded-xl transition-all"
                                        style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', color: '#F87171' }}>
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Quick type + category chips */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <Chip label={t('transactions.all')}       active={filters.type === 'all'}    onClick={() => go({ type: 'all' })} />
                                <Chip label={t('transactions.income')}  active={filters.type === 'credit'} onClick={() => go({ type: 'credit' })} color="#34D399" />
                                <Chip label={t('transactions.expenses')} active={filters.type === 'debit'} onClick={() => go({ type: 'debit' })} color="#F87171" />
                                <div className="w-px h-4 mx-1" style={{ background: 'var(--color-border)' }} />
                                {categories.slice(0, 7).map(cat => (
                                    <Chip key={cat} label={cat}
                                        active={filters.category === cat}
                                        onClick={() => go({ category: filters.category === cat ? 'all' : cat })}
                                        color={catColor(cat)} />
                                ))}
                            </div>
                        </motion.div>

                        {/* ── Advanced filters ── */}
                        <AnimatePresence>
                            {showAdvanced && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                    <div className="p-5 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4"
                                        style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-wider font-semibold mb-2 block" style={{ color: 'var(--color-text-muted)' }}>{t('transactions.category')}</label>
                                            <select value={filters.category} onChange={e => go({ category: e.target.value })}
                                                className="w-full rounded-xl px-3 py-2 text-[13px] outline-none"
                                                style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}>
                                                 <option value="all">{t('transactions.all')}</option>
                                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-wider font-semibold mb-2 flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
                                                 <Calendar className="w-3 h-3" /> {t('transactions.from')}
                                            </label>
                                            <input type="date" value={filters.date_from} onChange={e => go({ date_from: e.target.value })}
                                                className="w-full rounded-xl px-3 py-2 text-[13px] outline-none"
                                                style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-wider font-semibold mb-2 flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
                                                 <Calendar className="w-3 h-3" /> {t('transactions.to')}
                                            </label>
                                            <input type="date" value={filters.date_to} onChange={e => go({ date_to: e.target.value })}
                                                className="w-full rounded-xl px-3 py-2 text-[13px] outline-none"
                                                style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }} />
                                        </div>
                                        <div className="flex items-end">
                                            <button onClick={clearAll} className="w-full py-2 rounded-xl text-[13px] font-medium"
                                                style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                                {t('transactions.reset_all')}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* ── Transaction groups ── */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}>
                            {transactions.data.length === 0 ? (
                                <div className="rounded-2xl py-20 flex flex-col items-center gap-3"
                                    style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                    <Sparkles className="w-10 h-10" style={{ color: 'var(--color-text-muted)' }} />
                                    <p className="text-[16px] font-semibold" style={{ color: 'var(--color-text-main)' }}>{t('transactions.no_transactions')}</p>
                                    <p className="text-[13px]" style={{ color: 'var(--color-text-muted)' }}>{t('transactions.try_different_search')}</p>
                                    <button onClick={clearAll} className="mt-2 px-5 py-2 rounded-xl text-[13px] font-semibold"
                                        style={{ background: 'var(--color-gold)', color: '#000' }}>{t('transactions.clear_all_filters')}</button>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {Object.entries(groups).map(([dateKey, txs], gi) => (
                                        <div key={dateKey}>
                                            {/* Day header */}
                                            <div className="flex items-center gap-3 mb-2.5 px-1">
                                                <span className="text-[11px] font-bold uppercase tracking-[0.15em]"
                                                    style={{ color: 'var(--color-text-muted)' }}>
                                                    {fmtDay(txs[0].transacted_at, locale)}
                                                </span>
                                                <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
                                                <span className="text-[10px] px-2 py-0.5 rounded-full"
                                                    style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)' }}>
                                                     {t('transactions.txn_count', { count: txs.length })}
                                                </span>
                                            </div>

                                            {/* Transaction rows */}
                                            <div className="rounded-2xl overflow-hidden"
                                                style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                                {txs.map((tx, i) => (
                                                     <motion.div key={tx.id}
                                                         initial={{ opacity: 0, x: -6 }}
                                                         animate={{ opacity: 1, x: 0 }}
                                                         transition={{ delay: gi * 0.04 + i * 0.02 }}
                                                         className="flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 transition-colors cursor-default"
                                                         style={{ borderBottom: i < txs.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                                                         onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-elevated)'}
                                                         onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                     >
                                                         <MemoizedMerchantLogo merchant={tx.merchant} logoColor={tx.logo_color} size={36} />

                                                         <div className="flex-1 min-w-0">
                                                             <div className="flex items-center gap-2 flex-wrap">
                                                                 <span className="text-[14px] sm:text-[15px] font-semibold truncate" style={{ color: 'var(--color-text-main)' }}>
                                                                     {tx.merchant}
                                                                 </span>
                                                                 {tx.card_last4 && (
                                                                     <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded-md"
                                                                         style={{ background: 'var(--color-bg-base)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                                                         <CreditCard className="w-3 h-3" /> ••{tx.card_last4}
                                                                     </span>
                                                                 )}
                                                             </div>
                                                             <div className="flex items-center gap-2 mt-1">
                                                                 {tx.category && (
                                                                     <span className="text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full truncate max-w-[120px]"
                                                                         style={{
                                                                             background: catColor(tx.category) + '18',
                                                                             color: catColor(tx.category),
                                                                             border: `1px solid ${catColor(tx.category)}30`,
                                                                         }}>
                                                                         {tx.category}
                                                                     </span>
                                                                 )}
                                                                 <span className="text-[10px] sm:text-[11px] shrink-0" style={{ color: 'var(--color-text-muted)' }}>
                                                                     {fmtTime(tx.transacted_at, locale)}
                                                                 </span>
                                                             </div>
                                                         </div>

                                                         <MemoizedAmount tx={tx} format={format} code={code} />
                                                     </motion.div>
                                                 ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* ── Pagination ── */}
                        {(transactions?.last_page || 0) > 1 && (
                            <div className="flex items-center justify-between pb-6">
                                <span className="text-[12px]" style={{ color: 'var(--color-text-muted)' }}>
                                    {transactions?.from}–{transactions?.to} of {transactions?.total}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    {transactions?.prev_page_url ? (
                                        <a href={transactions.prev_page_url} className="p-2 rounded-xl transition-all hover:opacity-80"
                                            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                            <ChevronLeft className="w-4 h-4" />
                                        </a>
                                    ) : (
                                        <span className="p-2 rounded-xl opacity-30"
                                            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                            <ChevronLeft className="w-4 h-4" />
                                        </span>
                                    )}

                                    {Array.from({ length: transactions?.last_page || 0 }, (_, i) => i + 1)
                                        .filter(p => p === 1 || p === transactions?.last_page || Math.abs(p - (transactions?.current_page || 0)) <= 1)
                                        .reduce((acc, p, idx, arr) => {
                                            if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
                                            acc.push(p);
                                            return acc;
                                        }, [])
                                        .map((p, idx) => p === '…' ? (
                                            <span key={`e${idx}`} className="px-1 text-[13px]" style={{ color: 'var(--color-text-muted)' }}>…</span>
                                        ) : (
                                            <a key={p}
                                                href={`/transactions?page=${p}&type=${filters.type}&category=${filters.category}&search=${encodeURIComponent(filters.search || '')}&date_from=${filters.date_from || ''}&date_to=${filters.date_to || ''}`}
                                                className="w-9 h-9 flex items-center justify-center rounded-xl text-[13px] font-medium transition-all"
                                                style={p === transactions?.current_page
                                                    ? { background: 'var(--color-gold)', color: '#000' }
                                                    : { background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }
                                                }>{p}</a>
                                        ))}

                                    {transactions?.next_page_url ? (
                                        <a href={transactions.next_page_url} className="p-2 rounded-xl transition-all hover:opacity-80"
                                            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                            <ChevronRight className="w-4 h-4" />
                                        </a>
                                    ) : (
                                        <span className="p-2 rounded-xl opacity-30"
                                            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                            <ChevronRight className="w-4 h-4" />
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}