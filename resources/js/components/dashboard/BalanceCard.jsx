import { ArrowUpRight, TrendingUp, ArrowDownLeft, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePage } from '@inertiajs/react';

export default function BalanceCard({ balance }) {
    const { props } = usePage();
    const transactions = props.transactions ?? [];

    const credits = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + Number(t.amount), 0);
    const debits = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + Number(t.amount), 0);
    const netFlow = credits - debits;

    const pts = [40, 55, 35, 50, 42, 38, 52, 60, 45, 55, 48, 58, 65];
    const mn = Math.min(...pts), mx = Math.max(...pts), rng = mx - mn || 1;
    const w = 400, h = 70;
    const xs = pts.map((_, i) => (i / (pts.length - 1)) * w);
    const ys = pts.map(v => h - ((v - mn) / rng) * (h - 10) - 5);

    let pathD = `M ${xs[0]} ${ys[0]} `;
    for (let i = 1; i < xs.length; i++) {
        const cx = (xs[i - 1] + xs[i]) / 2;
        pathD += `C ${cx} ${ys[i - 1]}, ${cx} ${ys[i]}, ${xs[i]} ${ys[i]} `;
    }
    const fillPathD = `${pathD} L ${w} ${h} L 0 ${h} Z`;
    const labels = ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];

    return (
        <div className="h-full w-full rounded-2xl p-5 relative overflow-hidden transition-all duration-300 group"
            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', backdropFilter: 'blur(20px)' }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold-bg)] to-transparent pointer-events-none" />

            <div className="flex items-center justify-between mb-3 relative z-10">
                <div>
                    <span className="text-[15px] font-bold text-[var(--color-gold)]">Capital Reserves</span>
                    <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">Live aggregated balance</div>
                </div>
                <button className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-all hover:bg-[var(--color-bg-elevated)] border border-transparent group-hover:border-[var(--color-border)]">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="flex items-baseline gap-2 mb-4 relative z-10">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-[32px] font-bold text-[var(--color-text-main)] tracking-tight"
                >
                    {Number(balance).toLocaleString()}
                </motion.span>
                <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-[14px] font-semibold text-[var(--color-text-muted)]"
                >
                    MAD
                </motion.span>
                <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ml-2"
                    style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399' }}
                >
                    <TrendingUp className="w-3 h-3" /> +12%
                </motion.span>
            </div>

            {/* Stats row */}
            <div className="flex gap-2 flex-wrap mb-4 relative z-10">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 px-2.5 py-1 rounded-lg"
                    style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}
                >
                    <ArrowDownLeft className="w-3 h-3" />
                    +{Number(credits).toLocaleString()} in
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-text-muted)] px-2.5 py-1 rounded-lg"
                    style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}
                >
                    <Wallet className="w-3 h-3" />
                    {transactions.length} transactions
                </div>
                <div className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg ${netFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                    style={{ background: netFlow >= 0 ? 'rgba(52,211,153,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${netFlow >= 0 ? 'rgba(52,211,153,0.2)' : 'rgba(239,68,68,0.2)'}` }}
                >
                    <TrendingUp className="w-3 h-3" />
                    Net: {netFlow >= 0 ? '+' : ''}{Number(netFlow).toLocaleString()}
                </div>
            </div>

            {/* Animated SVG Chart */}
            <div className="w-full h-[80px] relative z-10">
                <svg viewBox={`0 0 ${w} ${h + 15}`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <motion.path d={fillPathD} fill="url(#balGrad)"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} />
                    <motion.path d={pathD} fill="none" stroke="var(--color-gold)" strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                        style={{ filter: 'drop-shadow(0px 2px 6px var(--color-glow-primary))' }}
                    />
                    {labels.map((l, i) => (
                        <motion.text key={i} x={(i / (labels.length - 1)) * w} y={h + 12}
                            fill="var(--color-text-muted)" fontSize="9" textAnchor="middle"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 + i * 0.1 }}>
                            {l}
                        </motion.text>
                    ))}
                </svg>
            </div>
        </div>
    );
}
