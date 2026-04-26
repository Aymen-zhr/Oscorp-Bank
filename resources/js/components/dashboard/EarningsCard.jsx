import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EarningsCard({ percentage }) {
    const cx = 90, cy = 95, r = 68;
    const arcPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
    const pct = Math.min(1, Math.max(0, (percentage ?? 58) / 100));

    return (
        <div className="h-full w-full rounded-2xl p-5 relative overflow-hidden transition-all duration-300 group"
            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', backdropFilter: 'blur(20px)' }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold-bg)] to-transparent pointer-events-none" />

            <div className="flex items-center justify-between mb-2 relative z-10">
                <div>
                    <span className="text-[15px] font-bold text-[var(--color-gold)]">Monthly Goal</span>
                    <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">Earnings progress</div>
                </div>
                <button className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-all hover:bg-[var(--color-bg-elevated)] border border-transparent group-hover:border-[var(--color-border)]">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="flex items-baseline gap-2 relative z-10 mb-1">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-[24px] font-bold text-[var(--color-text-main)]"
                >
                    74,652 MAD
                </motion.span>
                <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399' }}
                >
                    <TrendingUp className="w-3 h-3" /> +7%
                </motion.span>
            </div>

            {/* Radial Chart */}
            <div className="flex flex-col items-center relative z-10">
                <div className="relative" style={{ width: 180, height: 100 }}>
                    <svg width="180" height="100" viewBox="0 0 180 100">
                        <defs>
                            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="var(--color-gold)" />
                                <stop offset="100%" stopColor="var(--color-bronze)" />
                            </linearGradient>
                        </defs>
                        {/* Track */}
                        <path d={arcPath} fill="none" stroke="var(--color-border)" strokeWidth="12" strokeLinecap="round" />
                        {/* Progress */}
                        <motion.path d={arcPath} fill="none" stroke="url(#arcGrad)" strokeWidth="12" strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: pct }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                            style={{ filter: 'drop-shadow(0px 0px 8px var(--color-glow-primary))' }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }}
                            className="text-[22px] font-bold text-[var(--color-text-main)]">{percentage ?? 58}%</motion.div>
                    </div>
                </div>
                <div className="text-[11px] text-[var(--color-text-muted)] -mt-1">of monthly target reached</div>

                <div className="flex gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-gold)]">
                        <div className="w-2 h-2 rounded-full bg-[var(--color-gold)] shadow-[0_0_5px_var(--color-gold)]" />Current
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-muted)]">
                        <div className="w-2 h-2 rounded-full bg-[var(--color-border-hover)]" />Target
                    </div>
                </div>
            </div>
        </div>
    );
}
