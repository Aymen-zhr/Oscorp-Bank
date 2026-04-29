import { Head, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, SlidersHorizontal, ChevronLeft, ChevronRight,
    X, Download, ArrowUpRight, ArrowDownLeft, Wallet,
    CreditCard, Calendar, Sparkles
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';

/* ── Category colours ──────────────────────────────────────── */
const CAT_COLOR = {
    Food: '#F59E0B', Dining: '#F97316', Groceries: '#84CC16',
    Transport: '#6366F1', Entertainment: '#EC4899', Bills: '#EF4444',
    Utilities: '#06B6D4', Shopping: '#10B981', Health: '#8B5CF6',
    Telecoms: '#3B82F6', Transfer: '#D4AF37', Salary: '#22C55E',
    Rent: '#F43F5E', Wellness: '#A78BFA',
};
const catColor = (c) => CAT_COLOR[c] || '#64748B';

/* ── Logo.dev config ───────────────────────────────────────── */
const LOGO_KEY = 'pk_binMfKfXSiOiYpfo3CyL2w';

const DOMAIN_MAP = {
    // Streaming / tech
    netflix: 'netflix.com', spotify: 'spotify.com', amazon: 'amazon.com',
    apple: 'apple.com', google: 'google.com', microsoft: 'microsoft.com',
    youtube: 'youtube.com', adobe: 'adobe.com', dropbox: 'dropbox.com',
    zoom: 'zoom.us', slack: 'slack.com', paypal: 'paypal.com',
    steam: 'steampowered.com', airbnb: 'airbnb.com', uber: 'uber.com',
    // Food & retail
    mcdonald: 'mcdonalds.com', starbucks: 'starbucks.com', kfc: 'kfc.com',
    'pizza hut': 'pizzahut.com', domino: 'dominos.com',
    carrefour: 'carrefour.com', zara: 'zara.com', 'h&m': 'hm.com',
    jumia: 'jumia.ma',
    // Morocco
    marjane: 'marjane.ma', inwi: 'inwi.ma',
    'maroc telecom': 'iam.ma', orange: 'orange.ma', lydec: 'lydec.ma',
    bmce: 'banqueofafrica.com', attijariwafa: 'attijariwafabank.com',
    cih: 'cihbank.com', wafacash: 'wafacash.ma',
};

function getDomain(merchant) {
    if (!merchant) return null;
    const lower = merchant.toLowerCase();
    for (const [key, domain] of Object.entries(DOMAIN_MAP)) {
        if (lower.includes(key)) return domain;
    }
    return null;
}

/* ── Merchant Logo component ───────────────────────────────── */
function MerchantLogo({ merchant, logoColor, size = 46 }) {
    const [failed, setFailed] = useState(false);
    const domain = getDomain(merchant);
    const color  = logoColor || '#64748B';
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
                    src={`https://img.logo.dev/${domain}?token=${LOGO_KEY}&size=64&format=png`}
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
}

/* ── Amount ────────────────────────────────────────────────── */
function Amount({ tx }) {
    const ok = tx.type === 'credit';
    return (
        <div className={`flex flex-col items-end ${ok ? 'text-emerald-400' : 'text-red-400'}`}>
            <div className="flex items-center gap-1 text-[16px] font-bold leading-none">
                {ok ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                {ok ? '+' : '-'}{Math.abs(Number(tx.amount)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--color-text-muted)' }}>MAD</span>
        </div>
    );
}

/* ── Helpers ───────────────────────────────────────────────── */
const fmtTime = (d) => new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
const fmtDay  = (d) => new Date(d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

/* ── Quick chip ────────────────────────────────────────────── */
function Chip({ label, active, onClick, color }) {
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
}

/* ══════════════════════════════════════════════════════════════
   Main page
══════════════════════════════════════════════════════════════ */
export default function Transactions({ transactions, filters, categories, stats }) {
    const [search, setSearch]           = useState(filters.search || '');
    const [showAdvanced, setShowAdvanced] = useState(false);

    const go = useCallback((patch) => {
        router.get('/transactions', { ...filters, ...patch }, { preserveState: true, replace: true });
    }, [filters]);

    const clearAll = () => { setSearch(''); router.get('/transactions'); };

    const hasFilters = filters.type !== 'all' || filters.category !== 'all'
        || filters.date_from || filters.date_to || filters.search;

    // Group transactions by calendar date
    const groups = transactions.data.reduce((acc, tx) => {
        const key = new Date(tx.transacted_at).toDateString();
        if (!acc[key]) acc[key] = [];
        acc[key].push(tx);
        return acc;
    }, {});

    return (
        <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
            <Head title="OSCORP | Transactions" />
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />

                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-5xl mx-auto px-6 py-5 space-y-5">

                        {/* ── Header ── */}
                        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
                            className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-[26px] font-bold tracking-tight" style={{ color: 'var(--color-text-main)' }}>
                                    Transaction Ledger
                                </h1>
                                <p className="text-[13px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                                    {transactions.total.toLocaleString()} records &nbsp;·&nbsp; page {transactions.current_page}/{transactions.last_page}
                                </p>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium shrink-0"
                                style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                <Download className="w-4 h-4" /> Export
                            </button>
                        </motion.div>

                        {/* ── Stats ── */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: 'Net Balance', value: Number(stats.balance || 0).toLocaleString(), color: 'var(--color-gold)', Icon: Wallet },
                                { label: 'Money In',    value: '+' + Number(stats.total_credits || 0).toLocaleString(), color: '#34D399', Icon: ArrowDownLeft },
                                { label: 'Money Out',   value: '-' + Math.abs(Number(stats.total_debits  || 0)).toLocaleString(), color: '#F87171', Icon: ArrowUpRight },
                            ].map(({ label, value, color, Icon }, i) => (
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
                                            {value} <span className="text-[11px] font-normal opacity-60">MAD</span>
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
                                        placeholder="Search by merchant…"
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
                                    <SlidersHorizontal className="w-4 h-4" /> Filters
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
                                <Chip label="All"       active={filters.type === 'all'}    onClick={() => go({ type: 'all' })} />
                                <Chip label="↑ Income"  active={filters.type === 'credit'} onClick={() => go({ type: 'credit' })} color="#34D399" />
                                <Chip label="↓ Expenses" active={filters.type === 'debit'} onClick={() => go({ type: 'debit' })} color="#F87171" />
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
                                            <label className="text-[10px] uppercase tracking-wider font-semibold mb-2 block" style={{ color: 'var(--color-text-muted)' }}>Category</label>
                                            <select value={filters.category} onChange={e => go({ category: e.target.value })}
                                                className="w-full rounded-xl px-3 py-2 text-[13px] outline-none"
                                                style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}>
                                                <option value="all">All</option>
                                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-wider font-semibold mb-2 flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
                                                <Calendar className="w-3 h-3" /> From
                                            </label>
                                            <input type="date" value={filters.date_from} onChange={e => go({ date_from: e.target.value })}
                                                className="w-full rounded-xl px-3 py-2 text-[13px] outline-none"
                                                style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-wider font-semibold mb-2 flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
                                                <Calendar className="w-3 h-3" /> To
                                            </label>
                                            <input type="date" value={filters.date_to} onChange={e => go({ date_to: e.target.value })}
                                                className="w-full rounded-xl px-3 py-2 text-[13px] outline-none"
                                                style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }} />
                                        </div>
                                        <div className="flex items-end">
                                            <button onClick={clearAll} className="w-full py-2 rounded-xl text-[13px] font-medium"
                                                style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                                Reset All
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
                                    <p className="text-[16px] font-semibold" style={{ color: 'var(--color-text-main)' }}>No transactions found</p>
                                    <p className="text-[13px]" style={{ color: 'var(--color-text-muted)' }}>Try a different filter or search term</p>
                                    <button onClick={clearAll} className="mt-2 px-5 py-2 rounded-xl text-[13px] font-semibold"
                                        style={{ background: 'var(--color-gold)', color: '#000' }}>Clear All Filters</button>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {Object.entries(groups).map(([dateKey, txs], gi) => (
                                        <div key={dateKey}>
                                            {/* Day header */}
                                            <div className="flex items-center gap-3 mb-2.5 px-1">
                                                <span className="text-[11px] font-bold uppercase tracking-[0.15em]"
                                                    style={{ color: 'var(--color-text-muted)' }}>
                                                    {fmtDay(txs[0].transacted_at)}
                                                </span>
                                                <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
                                                <span className="text-[10px] px-2 py-0.5 rounded-full"
                                                    style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)' }}>
                                                    {txs.length} txn{txs.length !== 1 ? 's' : ''}
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
                                                        className="flex items-center gap-4 px-5 py-4 transition-colors cursor-default"
                                                        style={{ borderBottom: i < txs.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-elevated)'}
                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        <MerchantLogo merchant={tx.merchant} logoColor={tx.logo_color} />

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <span className="text-[15px] font-semibold truncate" style={{ color: 'var(--color-text-main)' }}>
                                                                    {tx.merchant}
                                                                </span>
                                                                {tx.card_last4 && (
                                                                    <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-md"
                                                                        style={{ background: 'var(--color-bg-base)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                                                        <CreditCard className="w-3 h-3" /> ••{tx.card_last4}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-1.5">
                                                                {tx.category && (
                                                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                                                        style={{
                                                                            background: catColor(tx.category) + '18',
                                                                            color: catColor(tx.category),
                                                                            border: `1px solid ${catColor(tx.category)}30`,
                                                                        }}>
                                                                        {tx.category}
                                                                    </span>
                                                                )}
                                                                <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                                                                    {fmtTime(tx.transacted_at)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <Amount tx={tx} />
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* ── Pagination ── */}
                        {transactions.last_page > 1 && (
                            <div className="flex items-center justify-between pb-6">
                                <span className="text-[12px]" style={{ color: 'var(--color-text-muted)' }}>
                                    {transactions.from}–{transactions.to} of {transactions.total}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    {transactions.prev_page_url ? (
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

                                    {Array.from({ length: transactions.last_page }, (_, i) => i + 1)
                                        .filter(p => p === 1 || p === transactions.last_page || Math.abs(p - transactions.current_page) <= 1)
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
                                                style={p === transactions.current_page
                                                    ? { background: 'var(--color-gold)', color: '#000' }
                                                    : { background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }
                                                }>{p}</a>
                                        ))}

                                    {transactions.next_page_url ? (
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