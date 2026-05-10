import { Head, router } from '@inertiajs/react';
import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    SlidersHorizontal,
    ChevronLeft,
    ChevronRight,
    X,
    Download,
    ArrowUpRight,
    ArrowDownLeft,
    Wallet,
    CreditCard,
    Calendar,
    Sparkles,
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import {
    catColor,
    LOGO_KEY,
    LOGO_BASE_URL,
    getDomain,
    DICEBEAR_BASE_URL,
    STATUS_COLORS,
    COLORS,
} from '@/constants';

/* ── Merchant Logo component ───────────────────────────────── */
const MerchantLogo = function MerchantLogo({ merchant, logoColor, size = 46 }) {
    const [failed, setFailed] = useState(false);
    const domain = getDomain(merchant);
    const color = logoColor || STATUS_COLORS.default;
    const letter = (merchant || '?').charAt(0).toUpperCase();

    const base = {
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: 14,
        background: `linear-gradient(135deg, ${color}28, ${color}0f)`,
        border: `1.5px solid ${color}40`,
        boxShadow: `0 2px 10px ${color}15`,
    };

    if (domain && !failed) {
        return (
            <div
                style={{
                    ...base,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 8,
                    overflow: 'hidden',
                }}
            >
                <img
                    src={`${LOGO_BASE_URL}/${domain}?token=${LOGO_KEY}&size=64&format=png`}
                    alt={merchant}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                    }}
                    onError={() => setFailed(true)}
                />
            </div>
        );
    }

    return (
        <div
            style={{
                ...base,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color,
                fontWeight: 700,
                fontSize: size * 0.38,
                userSelect: 'none',
            }}
        >
            {letter}
        </div>
    );
};
const MemoizedMerchantLogo = function (props) {
    return <MerchantLogo {...props} />;
};

/* ── Amount ────────────────────────────────────────────────── */
const Amount = function Amount({ tx, format, code }) {
    const ok = tx.type === 'credit';
    return (
        <div
            className={`flex flex-col items-end ${ok ? 'text-emerald-400' : 'text-red-400'}`}
        >
            <div className="flex items-center gap-1 text-[16px] leading-none font-bold">
                {ok ? (
                    <ArrowDownLeft className="h-3.5 w-3.5" />
                ) : (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                )}
                {ok ? '+' : '-'}
                {format(tx.amount)}
            </div>
            <span
                className="mt-0.5 text-[10px] font-medium"
                style={{ color: 'var(--color-text-muted)' }}
            >
                {code}
            </span>
        </div>
    );
};
const MemoizedAmount = function (props) {
    return <Amount {...props} />;
};

// Wrapper to pass format and code to Amount

/* ── Helpers ───────────────────────────────────────────────── */
const fmtTime = (d, loc) => {
    const date = new Date(d);
    return isNaN(date.getTime())
        ? '–'
        : date.toLocaleTimeString(loc || 'en-GB', {
              hour: '2-digit',
              minute: '2-digit',
          });
};
const fmtDay = (d, loc) => {
    const date = new Date(d);
    return isNaN(date.getTime())
        ? 'Unknown Date'
        : date.toLocaleDateString(loc || 'en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
          });
};

/* ── Quick chip ────────────────────────────────────────────── */
const Chip = function Chip({ label, active, onClick, color }) {
    const c = color || 'var(--color-gold)';
    return (
        <button
            onClick={onClick}
            className="rounded-full px-3 py-1.5 text-[12px] font-semibold whitespace-nowrap transition-all"
            style={
                active
                    ? {
                          background: c + '22',
                          color: c,
                          border: `1px solid ${c}50`,
                      }
                    : {
                          background: 'var(--color-bg-elevated)',
                          color: 'var(--color-text-muted)',
                          border: '1px solid var(--color-border)',
                      }
            }
        >
            {label}
        </button>
    );
};

/* ══════════════════════════════════════════════════════════════
   Main page
══════════════════════════════════════════════════════════════ */
export default function Transactions({
    transactions,
    filters,
    categories,
    stats,
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const { t, locale } = useTranslation();
    const { format, code } = useCurrency();

    const go = useCallback(
        (patch) => {
            router.get(
                '/transactions',
                { ...filters, ...patch },
                { preserveState: true, replace: true },
            );
        },
        [filters],
    );

    const clearAll = useCallback(() => {
        setSearch('');
        router.get('/transactions');
    }, []);

    const hasFilters =
        filters.type !== 'all' ||
        filters.category !== 'all' ||
        filters.date_from ||
        filters.date_to ||
        filters.search;

    const groups = useMemo(() => {
        if (!transactions || !transactions.data) return {};
        return transactions.data.reduce((acc, tx) => {
            const date = tx.transacted_at
                ? new Date(tx.transacted_at)
                : new Date();
            const key = date.toDateString();
            if (!acc[key]) acc[key] = [];
            acc[key].push(tx);
            return acc;
        }, {});
    }, [transactions]);

    const statsCards = useMemo(
        () => [
            {
                label: t('transactions.net_balance'),
                value: format(stats.balance || 0),
                color: 'var(--color-gold)',
                Icon: Wallet,
            },
            {
                label: t('transactions.money_in'),
                value: '+' + format(stats.total_credits || 0),
                color: COLORS.credit,
                Icon: ArrowDownLeft,
            },
            {
                label: t('transactions.money_out'),
                value: '-' + format(Math.abs(stats.total_debits || 0)),
                color: COLORS.debit,
                Icon: ArrowUpRight,
            },
        ],
        [stats.balance, stats.total_credits, stats.total_debits, format],
    );

    const exportUrl = `/transactions/export?type=${filters.type}&category=${filters.category}&search=${encodeURIComponent(filters.search || '')}&date_from=${filters.date_from || ''}&date_to=${filters.date_to || ''}`;

    return (
        <div
            className="flex h-screen w-full overflow-hidden"
            style={{ background: 'var(--color-bg-base)' }}
        >
            <Head title="OSCORP | Transactions" />
            <Sidebar active="transactions" />
            <div className="relative flex flex-1 flex-col overflow-hidden">
                {/* Background Fixed Glows (Stabilized) */}
                <div className="pointer-events-none fixed top-0 right-0 z-0 h-[500px] w-[500px] rounded-full bg-[var(--color-gold)] opacity-[0.03] blur-[120px]" />
                <div className="pointer-events-none fixed bottom-0 left-0 z-0 h-[400px] w-[400px] rounded-full bg-blue-500 opacity-[0.02] blur-[100px]" />

                <Topbar />

                <div className="flex-1 overflow-y-auto pb-32 md:pb-0">
                    <div className="mx-auto max-w-5xl space-y-5 px-6 py-5">
                        {/* ── Header ── */}
                        <motion.div
                            initial={{ opacity: 0, y: -14 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start justify-between gap-4"
                        >
                            <div>
                                <h1
                                    className="text-[26px] font-bold tracking-tight"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    {t('transactions.title')}
                                </h1>
                                <p
                                    className="mt-0.5 text-[13px]"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    {t('transactions.records_info', {
                                        count: (
                                            transactions?.total || 0
                                        ).toLocaleString(),
                                        current:
                                            transactions?.current_page || 1,
                                        total: transactions?.last_page || 1,
                                    })}
                                </p>
                            </div>
                            <a
                                href={exportUrl}
                                className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-medium transition-all hover:opacity-80"
                                style={{
                                    background: 'var(--color-bg-card)',
                                    border: '1px solid var(--color-border)',
                                    color: 'var(--color-text-muted)',
                                }}
                            >
                                <Download className="h-4 w-4" />{' '}
                                {t('transactions.export')}
                            </a>
                        </motion.div>

                        {/* ── Stats ── */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            {statsCards.map(
                                ({ label, value, color, Icon }, i) => (
                                    <motion.div
                                        key={label}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.06 * (i + 1) }}
                                        className="flex items-center gap-4 rounded-2xl p-4"
                                        style={{
                                            background: 'var(--color-bg-card)',
                                            border: '1px solid var(--color-border)',
                                        }}
                                    >
                                        <div
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                                            style={{
                                                background: color + '18',
                                                border: `1px solid ${color}30`,
                                            }}
                                        >
                                            <Icon
                                                className="h-5 w-5"
                                                style={{ color }}
                                            />
                                        </div>
                                        <div>
                                            <div
                                                className="mb-1 text-[10px] font-semibold tracking-widest uppercase"
                                                style={{
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                {label}
                                            </div>
                                            <div
                                                className="text-[20px] leading-none font-bold"
                                                style={{ color }}
                                            >
                                                {value}{' '}
                                                <span className="text-[11px] font-normal opacity-60">
                                                    {code}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ),
                            )}
                        </div>

                        {/* ── Search & chips ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-3"
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className="flex flex-1 items-center gap-2.5 rounded-xl px-4 py-2.5"
                                    style={{
                                        background: 'var(--color-bg-card)',
                                        border: '1px solid var(--color-border)',
                                    }}
                                >
                                    <Search
                                        className="h-4 w-4 shrink-0"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                        }}
                                    />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === 'Enter' && go({ search })
                                        }
                                        onBlur={() =>
                                            search !== (filters.search || '') &&
                                            go({ search })
                                        }
                                        placeholder={t(
                                            'transactions.search_placeholder',
                                        )}
                                        className="flex-1 bg-transparent text-[14px] outline-none"
                                        style={{
                                            color: 'var(--color-text-main)',
                                        }}
                                    />
                                    {search && (
                                        <button
                                            onClick={() => {
                                                setSearch('');
                                                go({ search: '' });
                                            }}
                                        >
                                            <X
                                                className="h-4 w-4"
                                                style={{
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            />
                                        </button>
                                    )}
                                </div>
                                <button
                                    onClick={() => setShowAdvanced((v) => !v)}
                                    className="relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-medium transition-all"
                                    style={
                                        showAdvanced
                                            ? {
                                                  background:
                                                      'var(--color-gold-bg)',
                                                  border: '1px solid var(--color-gold)',
                                                  color: 'var(--color-gold)',
                                              }
                                            : {
                                                  background:
                                                      'var(--color-bg-card)',
                                                  border: '1px solid var(--color-border)',
                                                  color: 'var(--color-text-muted)',
                                              }
                                    }
                                >
                                    <SlidersHorizontal className="h-4 w-4" />{' '}
                                    {t('transactions.filters')}
                                    {hasFilters && (
                                        <span
                                            className="absolute -top-1 -right-1 h-2 w-2 rounded-full"
                                            style={{
                                                background: 'var(--color-gold)',
                                            }}
                                        />
                                    )}
                                </button>
                                {hasFilters && (
                                    <button
                                        onClick={clearAll}
                                        className="rounded-xl px-3 py-2.5 transition-all"
                                        style={{
                                            background: COLORS.debit + '18',
                                            border: `1px solid ${COLORS.debit}40`,
                                            color: COLORS.debit,
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {/* Quick type + category chips */}
                            <div className="flex flex-wrap items-center gap-2">
                                <Chip
                                    label={t('transactions.all')}
                                    active={filters.type === 'all'}
                                    onClick={() => go({ type: 'all' })}
                                />
                                <Chip
                                    label={t('transactions.income')}
                                    active={filters.type === 'credit'}
                                    onClick={() => go({ type: 'credit' })}
                                    color={COLORS.credit}
                                />
                                <Chip
                                    label={t('transactions.expenses')}
                                    active={filters.type === 'debit'}
                                    onClick={() => go({ type: 'debit' })}
                                    color={COLORS.debit}
                                />
                                <div
                                    className="mx-1 h-4 w-px"
                                    style={{
                                        background: 'var(--color-border)',
                                    }}
                                />
                                {categories.slice(0, 7).map((cat) => (
                                    <Chip
                                        key={cat}
                                        label={cat}
                                        active={filters.category === cat}
                                        onClick={() =>
                                            go({
                                                category:
                                                    filters.category === cat
                                                        ? 'all'
                                                        : cat,
                                            })
                                        }
                                        color={catColor(cat)}
                                    />
                                ))}
                            </div>
                        </motion.div>

                        {/* ── Advanced filters ── */}
                        <AnimatePresence>
                            {showAdvanced && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div
                                        className="grid grid-cols-2 gap-4 rounded-2xl p-5 sm:grid-cols-4"
                                        style={{
                                            background: 'var(--color-bg-card)',
                                            border: '1px solid var(--color-border)',
                                        }}
                                    >
                                        <div>
                                            <label
                                                className="mb-2 block text-[10px] font-semibold tracking-wider uppercase"
                                                style={{
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                {t('transactions.category')}
                                            </label>
                                            <select
                                                value={filters.category}
                                                onChange={(e) =>
                                                    go({
                                                        category:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-xl px-3 py-2 text-[13px] outline-none"
                                                style={{
                                                    background:
                                                        'var(--color-bg-elevated)',
                                                    border: '1px solid var(--color-border)',
                                                    color: 'var(--color-text-main)',
                                                }}
                                            >
                                                <option value="all">
                                                    {t('transactions.all')}
                                                </option>
                                                {categories.map((c) => (
                                                    <option key={c} value={c}>
                                                        {c}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label
                                                className="mb-2 flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase"
                                                style={{
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                <Calendar className="h-3 w-3" />{' '}
                                                {t('transactions.from')}
                                            </label>
                                            <input
                                                type="date"
                                                value={filters.date_from}
                                                onChange={(e) =>
                                                    go({
                                                        date_from:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-xl px-3 py-2 text-[13px] outline-none"
                                                style={{
                                                    background:
                                                        'var(--color-bg-elevated)',
                                                    border: '1px solid var(--color-border)',
                                                    color: 'var(--color-text-main)',
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label
                                                className="mb-2 flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase"
                                                style={{
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                <Calendar className="h-3 w-3" />{' '}
                                                {t('transactions.to')}
                                            </label>
                                            <input
                                                type="date"
                                                value={filters.date_to}
                                                onChange={(e) =>
                                                    go({
                                                        date_to: e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-xl px-3 py-2 text-[13px] outline-none"
                                                style={{
                                                    background:
                                                        'var(--color-bg-elevated)',
                                                    border: '1px solid var(--color-border)',
                                                    color: 'var(--color-text-main)',
                                                }}
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <button
                                                onClick={clearAll}
                                                className="w-full rounded-xl py-2 text-[13px] font-medium"
                                                style={{
                                                    background:
                                                        'var(--color-bg-elevated)',
                                                    border: '1px solid var(--color-border)',
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                {t('transactions.reset_all')}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* ── Transaction groups ── */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.28 }}
                        >
                            {transactions.data.length === 0 ? (
                                <div
                                    className="flex flex-col items-center gap-3 rounded-2xl py-20"
                                    style={{
                                        background: 'var(--color-bg-card)',
                                        border: '1px solid var(--color-border)',
                                    }}
                                >
                                    <Sparkles
                                        className="h-10 w-10"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                        }}
                                    />
                                    <p
                                        className="text-[16px] font-semibold"
                                        style={{
                                            color: 'var(--color-text-main)',
                                        }}
                                    >
                                        {t('transactions.no_transactions')}
                                    </p>
                                    <p
                                        className="text-[13px]"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                        }}
                                    >
                                        {t('transactions.try_different_search')}
                                    </p>
                                    <button
                                        onClick={clearAll}
                                        className="mt-2 rounded-xl px-5 py-2 text-[13px] font-semibold"
                                        style={{
                                            background: 'var(--color-gold)',
                                            color: '#000',
                                        }}
                                    >
                                        {t('transactions.clear_all_filters')}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {Object.entries(groups).map(
                                        ([dateKey, txs], gi) => (
                                            <div key={dateKey}>
                                                {/* Day header */}
                                                <div className="mb-2.5 flex items-center gap-3 px-1">
                                                    <span
                                                        className="text-[11px] font-bold tracking-[0.15em] uppercase"
                                                        style={{
                                                            color: 'var(--color-text-muted)',
                                                        }}
                                                    >
                                                        {fmtDay(
                                                            txs[0]
                                                                .transacted_at,
                                                            locale,
                                                        )}
                                                    </span>
                                                    <div
                                                        className="h-px flex-1"
                                                        style={{
                                                            background:
                                                                'var(--color-border)',
                                                        }}
                                                    />
                                                    <span
                                                        className="rounded-full px-2 py-0.5 text-[10px]"
                                                        style={{
                                                            background:
                                                                'var(--color-bg-elevated)',
                                                            color: 'var(--color-text-muted)',
                                                        }}
                                                    >
                                                        {t(
                                                            'transactions.txn_count',
                                                            {
                                                                count: txs.length,
                                                            },
                                                        )}
                                                    </span>
                                                </div>

                                                {/* Transaction rows */}
                                                <div
                                                    className="overflow-hidden rounded-2xl"
                                                    style={{
                                                        background:
                                                            'var(--color-bg-card)',
                                                        border: '1px solid var(--color-border)',
                                                    }}
                                                >
                                                    {txs.map((tx, i) => (
                                                        <motion.div
                                                            key={tx.id}
                                                            initial={{
                                                                opacity: 0,
                                                                x: -6,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                x: 0,
                                                            }}
                                                            transition={{
                                                                delay:
                                                                    gi * 0.04 +
                                                                    i * 0.02,
                                                            }}
                                                            className="flex cursor-default items-center gap-3 px-3 py-3 transition-colors sm:gap-4 sm:px-5 sm:py-4"
                                                            style={{
                                                                borderBottom:
                                                                    i <
                                                                    txs.length -
                                                                        1
                                                                        ? '1px solid var(--color-border)'
                                                                        : 'none',
                                                            }}
                                                            onMouseEnter={(e) =>
                                                                (e.currentTarget.style.background =
                                                                    'var(--color-bg-elevated)')
                                                            }
                                                            onMouseLeave={(e) =>
                                                                (e.currentTarget.style.background =
                                                                    'transparent')
                                                            }
                                                        >
                                                            <MemoizedMerchantLogo
                                                                merchant={
                                                                    tx.merchant
                                                                }
                                                                logoColor={
                                                                    tx.logo_color
                                                                }
                                                                size={36}
                                                            />

                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <span
                                                                        className="truncate text-[14px] font-semibold sm:text-[15px]"
                                                                        style={{
                                                                            color: 'var(--color-text-main)',
                                                                        }}
                                                                    >
                                                                        {
                                                                            tx.merchant
                                                                        }
                                                                    </span>
                                                                    {tx.card_last4 && (
                                                                        <span
                                                                            className="flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[9px] sm:text-[10px]"
                                                                            style={{
                                                                                background:
                                                                                    'var(--color-bg-base)',
                                                                                border: '1px solid var(--color-border)',
                                                                                color: 'var(--color-text-muted)',
                                                                            }}
                                                                        >
                                                                            <CreditCard className="h-3 w-3" />{' '}
                                                                            ••
                                                                            {
                                                                                tx.card_last4
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="mt-1 flex items-center gap-2">
                                                                    {tx.category && (
                                                                        <span
                                                                            className="max-w-[120px] truncate rounded-full px-2 py-0.5 text-[9px] font-semibold sm:text-[10px]"
                                                                            style={{
                                                                                background:
                                                                                    catColor(
                                                                                        tx.category,
                                                                                    ) +
                                                                                    '18',
                                                                                color: catColor(
                                                                                    tx.category,
                                                                                ),
                                                                                border: `1px solid ${catColor(tx.category)}30`,
                                                                            }}
                                                                        >
                                                                            {
                                                                                tx.category
                                                                            }
                                                                        </span>
                                                                    )}
                                                                    <span
                                                                        className="shrink-0 text-[10px] sm:text-[11px]"
                                                                        style={{
                                                                            color: 'var(--color-text-muted)',
                                                                        }}
                                                                    >
                                                                        {fmtTime(
                                                                            tx.transacted_at,
                                                                            locale,
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <MemoizedAmount
                                                                tx={tx}
                                                                format={format}
                                                                code={code}
                                                            />
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}
                        </motion.div>

                        {/* ── Pagination ── */}
                        {(transactions?.last_page || 0) > 1 && (
                            <div className="flex items-center justify-between pb-6">
                                <span
                                    className="text-[12px]"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    {transactions?.from}–{transactions?.to} of{' '}
                                    {transactions?.total}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    {transactions?.prev_page_url ? (
                                        <a
                                            href={transactions.prev_page_url}
                                            className="rounded-xl p-2 transition-all hover:opacity-80"
                                            style={{
                                                background:
                                                    'var(--color-bg-card)',
                                                border: '1px solid var(--color-border)',
                                                color: 'var(--color-text-muted)',
                                            }}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </a>
                                    ) : (
                                        <span
                                            className="rounded-xl p-2 opacity-30"
                                            style={{
                                                background:
                                                    'var(--color-bg-card)',
                                                border: '1px solid var(--color-border)',
                                                color: 'var(--color-text-muted)',
                                            }}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </span>
                                    )}

                                    {Array.from(
                                        {
                                            length:
                                                transactions?.last_page || 0,
                                        },
                                        (_, i) => i + 1,
                                    )
                                        .filter(
                                            (p) =>
                                                p === 1 ||
                                                p === transactions?.last_page ||
                                                Math.abs(
                                                    p -
                                                        (transactions?.current_page ||
                                                            0),
                                                ) <= 1,
                                        )
                                        .reduce((acc, p, idx, arr) => {
                                            if (idx > 0 && p - arr[idx - 1] > 1)
                                                acc.push('…');
                                            acc.push(p);
                                            return acc;
                                        }, [])
                                        .map((p, idx) =>
                                            p === '…' ? (
                                                <span
                                                    key={`e${idx}`}
                                                    className="px-1 text-[13px]"
                                                    style={{
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    …
                                                </span>
                                            ) : (
                                                <a
                                                    key={p}
                                                    href={`/transactions?page=${p}&type=${filters.type}&category=${filters.category}&search=${encodeURIComponent(filters.search || '')}&date_from=${filters.date_from || ''}&date_to=${filters.date_to || ''}`}
                                                    className="flex h-9 w-9 items-center justify-center rounded-xl text-[13px] font-medium transition-all"
                                                    style={
                                                        p ===
                                                        transactions?.current_page
                                                            ? {
                                                                  background:
                                                                      'var(--color-gold)',
                                                                  color: '#000',
                                                              }
                                                            : {
                                                                  background:
                                                                      'var(--color-bg-card)',
                                                                  border: '1px solid var(--color-border)',
                                                                  color: 'var(--color-text-muted)',
                                                              }
                                                    }
                                                >
                                                    {p}
                                                </a>
                                            ),
                                        )}

                                    {transactions?.next_page_url ? (
                                        <a
                                            href={transactions.next_page_url}
                                            className="rounded-xl p-2 transition-all hover:opacity-80"
                                            style={{
                                                background:
                                                    'var(--color-bg-card)',
                                                border: '1px solid var(--color-border)',
                                                color: 'var(--color-text-muted)',
                                            }}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </a>
                                    ) : (
                                        <span
                                            className="rounded-xl p-2 opacity-30"
                                            style={{
                                                background:
                                                    'var(--color-bg-card)',
                                                border: '1px solid var(--color-border)',
                                                color: 'var(--color-text-muted)',
                                            }}
                                        >
                                            <ChevronRight className="h-4 w-4" />
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
