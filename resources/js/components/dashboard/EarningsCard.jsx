import { ArrowUpRight, Target, Plus, TrendingUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { useTranslation } from '../../hooks/useTranslation';
import { useCurrency } from '../../hooks/useCurrency';

// High-fidelity cinematic gauge
function CinematicGauge({ pct, color = 'var(--color-gold)' }) {
    const r = 45;
    const cx = 50;
    const cy = 50;
    const circumference = Math.PI * r; // half circle
    const offset = circumference * (1 - pct);

    return (
        <svg viewBox="0 0 100 55" className="w-full drop-shadow-[0_0_8px_rgba(212,175,55,0.2)]">
            <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.6" />
                    <stop offset="100%" stopColor={color} />
                </linearGradient>
                <filter id="gaugeGlow">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            {/* Background Track */}
            <path
                d="M 5 50 A 45 45 0 0 1 95 50"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="8"
                strokeLinecap="round"
            />
            {/* Tick Marks */}
            {[...Array(9)].map((_, i) => {
                const angle = (i * 22.5) * (Math.PI / 180);
                const x1 = cx - Math.cos(angle) * 48;
                const y1 = cy - Math.sin(angle) * 48;
                const x2 = cx - Math.cos(angle) * 42;
                const y2 = cy - Math.sin(angle) * 42;
                return (
                    <line
                        key={i}
                        x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="1"
                    />
                );
            })}
            {/* Progress Path */}
            <motion.path
                d="M 5 50 A 45 45 0 0 1 95 50"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                filter="url(#gaugeGlow)"
            />
        </svg>
    );
}

export default function EarningsCard({ goal }) {
    const { t } = useTranslation();
    const { format } = useCurrency();
    const pct = goal ? Math.min(1, Math.max(0, goal.progress / 100)) : 0;

    return (
        <div className="h-full w-full rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between"
            style={{ background: 'linear-gradient(160deg, #0D0D0D 0%, #050505 100%)', border: '1px solid var(--color-border)' }}
        >
            {/* Top Accent */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold)]/40 to-transparent" />
            
            {/* Ambient Background Light */}
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[var(--color-gold)] opacity-[0.03] rounded-full blur-[40px] pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between shrink-0 mb-2">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[var(--color-gold-bg)] border border-[var(--color-gold)]/20 flex items-center justify-center shadow-inner">
                        <Target className="w-4 h-4 text-[var(--color-gold)]" />
                    </div>
                    <div>
                        <div className="text-[13px] font-black text-white tracking-tight leading-tight">
                            {goal ? goal.name : t('dashboard.wealth_goal')}
                        </div>
                        <div className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold">Strategic Reserve</div>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20">
                    <Sparkles className="w-2.5 h-2.5 text-[var(--color-gold)]" />
                    <span className="text-[8px] font-black text-[var(--color-gold)] uppercase">Priority</span>
                </div>
            </div>

            {/* Gauge Display */}
            <div className="relative flex-1 flex flex-col items-center justify-center min-h-0 py-2">
                <div className="w-full max-w-[140px]">
                    <CinematicGauge pct={pct} />
                </div>
                <div className="absolute bottom-2 text-center">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-[28px] font-black text-white tracking-tighter leading-none"
                    >
                        {Math.round(pct * 100)}<span className="text-[14px] text-[var(--color-gold)] ml-0.5">%</span>
                    </motion.div>
                    <div className="text-[8px] text-[var(--color-text-muted)] uppercase tracking-[0.2em] font-bold mt-1">Acquisition Meta</div>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-2 shrink-0 mb-3">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                    <div className="text-[8px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Current Yield</div>
                    <div className="text-[13px] font-black text-white truncate">{goal ? format(goal.current_savings) : format(0)}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                    <div className="text-[8px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Threshold</div>
                    <div className="text-[13px] font-black text-[var(--color-gold)] truncate">{goal ? format(goal.target_amount) : format(100000)}</div>
                </div>
            </div>

            {/* Action Area */}
            <div className="shrink-0">
                {goal ? (
                    <motion.button 
                        whileHover={{ scale: 1.02, backgroundColor: 'var(--color-gold-hover)' }} 
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2.5 rounded-xl bg-[var(--color-gold)] text-black text-[11px] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2 shadow-lg shadow-[var(--color-gold)]/10"
                    >
                        Optimize Allocation <TrendingUp className="w-3.5 h-3.5 stroke-[3]" />
                    </motion.button>
                ) : (
                    <Link href="/goals" className="w-full block">
                        <motion.button 
                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }} 
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Initialize Goal
                        </motion.button>
                    </Link>
                )}
            </div>
        </div>
    );
}
