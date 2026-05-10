import {
    ArrowUpRight,
    ArrowDownLeft,
    Wallet,
    Eye,
    EyeOff,
    TrendingUp,
    TrendingDown,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from '../../hooks/useTranslation';
import { useCurrency } from '../../hooks/useCurrency';

// Sparkline built from recent transaction trend
const SparkLine = ({ points = [], color = 'var(--color-gold)' }) => {
    const pts =
        points.length >= 2 ? points : [30, 45, 38, 60, 50, 72, 65, 80, 74, 90];
    const max = Math.max(...pts),
        min = Math.min(...pts);
    const range = max - min || 1;
    const H = 30;
    const norm = pts.map((p) => H - ((p - min) / range) * (H - 4) - 2);
    const d = norm
        .map(
            (y, i) =>
                `${i === 0 ? 'M' : 'L'} ${(i / (pts.length - 1)) * 100} ${y}`,
        )
        .join(' ');
    const fill = d + ` L 100 ${H + 2} L 0 ${H + 2} Z`;

    return (
        <svg
            viewBox={`0 0 100 ${H + 2}`}
            preserveAspectRatio="none"
            className="h-full w-full"
        >
            <defs>
                <linearGradient id="sfBc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={fill} fill="url(#sfBc)" />
            <path
                d={d}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default function BalanceCard() {
    const { t } = useTranslation();
    const { format, code } = useCurrency();
    const { props } = usePage();
    const [show, setShow] = useState(true);

    // Source of Truth from global props
    const balance = props.balance ?? 0;
    const monthlyCredits = props.monthly_credits ?? 0;
    const monthlyDebits = props.monthly_debits ?? 0;
    const transactions = props.transactions ?? [];

    // Sparkline calculation remains relative to the loaded transactions for trend visualization
    const { sparkPoints, monthChange, isPositive } = useMemo(() => {
        const txList = Array.isArray(transactions)
            ? transactions
            : transactions.data || [];
        const sorted = [...txList]
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
            .slice(-10);

        let running = balance;
        const reversed = [...sorted].reverse();
        const points = reversed
            .map((tx) => {
                const amt = Number(tx.amount);
                running = tx.type === 'credit' ? running - amt : running + amt;
                return Math.max(0, running);
            })
            .reverse();

        if (points.length < 2) {
            points.unshift(
                ...Array(10 - points.length).fill(
                    balance > 0 ? balance * 0.9 : 5000,
                ),
            );
        }

        // Use global monthly stats for the percentage calculation
        const net = monthlyCredits - monthlyDebits;
        const base = balance - net || 1;
        const pct = ((net / base) * 100).toFixed(1);

        return {
            sparkPoints: points,
            monthChange: Math.abs(pct),
            isPositive: net >= 0,
        };
    }, [transactions, balance, monthlyCredits, monthlyDebits]);

    const sparkColor = isPositive ? '#34D399' : '#F87171';

    return (
        <div
            className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl p-4"
            style={{
                background:
                    'linear-gradient(145deg, var(--color-card-gradient-from), var(--color-card-gradient-to))',
                border: '1px solid var(--color-border)',
            }}
        >
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold)]/50 to-transparent" />
            <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[var(--color-gold)] opacity-[0.05] blur-[50px]" />

            {/* Header */}
            <div className="mb-3 flex shrink-0 items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-gold-bg)]">
                        <Wallet className="h-3.5 w-3.5 text-[var(--color-gold)]" />
                    </div>
                    <div>
                        <div className="text-[12px] font-bold text-[var(--color-text-main)]">
                            {t('dashboard.total_balance')}
                        </div>
                        <div className="text-[9px] tracking-wider text-[var(--color-text-muted)] uppercase">
                            {t('dashboard.available_funds')}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setShow(!show)}
                    className="rounded-lg p-1.5 text-[var(--color-text-muted)] transition-all hover:bg-[var(--color-gold-bg)] hover:text-[var(--color-gold)]"
                >
                    {show ? (
                        <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                        <Eye className="h-3.5 w-3.5" />
                    )}
                </button>
            </div>

            {/* Balance */}
            <div className="flex min-h-0 flex-1 flex-col justify-center">
                <div className="mb-1 flex items-baseline gap-1.5">
                    <span className="text-[26px] leading-none font-black tracking-tight text-[var(--color-text-main)] lg:text-[30px]">
                        {show ? format(balance) : '••••••'}
                    </span>
                    <span className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase">
                        {code}
                    </span>
                </div>

                <div
                    className={`flex items-center gap-1.5 text-[10px] font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}
                >
                    {isPositive ? (
                        <TrendingUp className="h-3 w-3" />
                    ) : (
                        <TrendingDown className="h-3 w-3" />
                    )}
                    <span>
                        {isPositive ? '+' : '-'}
                        {monthChange}% {t('common.this_month')}
                    </span>
                </div>
            </div>

            {/* Trend Graph */}
            <div className="my-2 h-9 w-full shrink-0 opacity-80">
                <SparkLine points={sparkPoints} color={sparkColor} />
            </div>

            {/* Quick Actions */}
            <div className="mt-1 flex shrink-0 gap-2">
                <Link href="/receive" className="flex-1">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-[11px] font-black tracking-wider uppercase"
                        style={{
                            background: 'var(--color-gold)',
                            color: '#000',
                        }}
                    >
                        <ArrowDownLeft className="h-3.5 w-3.5 stroke-[3]" />{' '}
                        {t('receive')}
                    </motion.button>
                </Link>
                <Link href="/send" className="flex-1">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl border py-2 text-[11px] font-black tracking-wider uppercase"
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            color: '#FFF',
                            borderColor: 'rgba(255,255,255,0.1)',
                        }}
                    >
                        <ArrowUpRight className="h-3.5 w-3.5 stroke-[3]" />{' '}
                        {t('send')}
                    </motion.button>
                </Link>
            </div>
        </div>
    );
}
