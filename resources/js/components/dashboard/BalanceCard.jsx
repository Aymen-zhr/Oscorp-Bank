import { ArrowUpRight, ArrowDownLeft, Wallet, Eye, EyeOff, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from '../../hooks/useTranslation';
import { useCurrency } from '../../hooks/useCurrency';

// Sparkline built from recent transaction trend
const SparkLine = ({ points = [], color = 'var(--color-gold)' }) => {
    const pts = points.length >= 2 ? points : [30, 45, 38, 60, 50, 72, 65, 80, 74, 90];
    const max = Math.max(...pts), min = Math.min(...pts);
    const range = max - min || 1;
    const H = 30;
    const norm = pts.map(p => H - ((p - min) / range) * (H - 4) - 2);
    const d = norm.map((y, i) => `${i === 0 ? 'M' : 'L'} ${(i / (pts.length - 1)) * 100} ${y}`).join(' ');
    const fill = d + ` L 100 ${H + 2} L 0 ${H + 2} Z`;

    return (
        <svg viewBox={`0 0 100 ${H + 2}`} preserveAspectRatio="none" className="w-full h-full">
            <defs>
                <linearGradient id="sfBc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={fill} fill="url(#sfBc)" />
            <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
        const txList = Array.isArray(transactions) ? transactions : (transactions.data || []);
        const sorted = [...txList].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).slice(-10);
        
        let running = balance;
        const reversed = [...sorted].reverse();
        const points = reversed.map(tx => {
            const amt = Number(tx.amount);
            running = tx.type === 'credit' ? running - amt : running + amt;
            return Math.max(0, running);
        }).reverse();
        
        if (points.length < 2) {
            points.unshift(...Array(10 - points.length).fill(balance > 0 ? balance * 0.9 : 5000));
        }

        // Use global monthly stats for the percentage calculation
        const net = monthlyCredits - monthlyDebits;
        const base = (balance - net) || 1;
        const pct = ((net / base) * 100).toFixed(1);

        return { sparkPoints: points, monthChange: Math.abs(pct), isPositive: net >= 0 };
    }, [transactions, balance, monthlyCredits, monthlyDebits]);

    const sparkColor = isPositive ? '#34D399' : '#F87171';

    return (
        <div className="h-full w-full rounded-2xl p-4 relative overflow-hidden flex flex-col"
            style={{ background: 'linear-gradient(145deg, #0D0D0D, #050505)', border: '1px solid var(--color-border)' }}
        >
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold)]/50 to-transparent" />
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--color-gold)] opacity-[0.05] rounded-full blur-[50px] pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-3 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[var(--color-gold-bg)]">
                        <Wallet className="w-3.5 h-3.5 text-[var(--color-gold)]" />
                    </div>
                    <div>
                        <div className="text-[12px] font-bold text-white">{t('dashboard.total_balance')}</div>
                        <div className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-wider">{t('dashboard.available_funds')}</div>
                    </div>
                </div>
                <button
                    onClick={() => setShow(!show)}
                    className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-gold)] hover:bg-[var(--color-gold-bg)] transition-all"
                >
                    {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
            </div>

            {/* Balance */}
            <div className="flex-1 flex flex-col justify-center min-h-0">
                <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-[26px] lg:text-[30px] font-black tracking-tight text-white leading-none">
                        {show ? format(balance) : '••••••'}
                    </span>
                    <span className="text-[10px] text-[var(--color-text-muted)] font-medium uppercase">{code}</span>
                </div>

                <div className={`flex items-center gap-1.5 text-[10px] font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>
                        {isPositive ? '+' : '-'}{monthChange}% {t('common.this_month')}
                    </span>
                </div>
            </div>

            {/* Trend Graph */}
            <div className="h-9 w-full my-2 shrink-0 opacity-80">
                <SparkLine points={sparkPoints} color={sparkColor} />
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 shrink-0 mt-1">
                <Link href="/receive" className="flex-1">
                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider"
                        style={{ background: 'var(--color-gold)', color: '#000' }}
                    >
                        <ArrowDownLeft className="w-3.5 h-3.5 stroke-[3]" /> {t('receive')}
                    </motion.button>
                </Link>
                <Link href="/send" className="flex-1">
                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border"
                        style={{ background: 'rgba(255,255,255,0.03)', color: '#FFF', borderColor: 'rgba(255,255,255,0.1)' }}
                    >
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" /> {t('send')}
                    </motion.button>
                </Link>
            </div>
        </div>
    );
}
