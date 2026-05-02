import { ArrowUpRight, TrendingUp, Plus, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { useTranslation } from '../../hooks/useTranslation';
import { useCurrency } from '../../hooks/useCurrency';

export default function EarningsCard({ goal }) {
    const { t } = useTranslation();
    const { format } = useCurrency();
    const cx = 90, cy = 85, r = 60;
    const arcPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
    
    // If no goal, use default path progress (0%)
    const pct = goal ? Math.min(1, Math.max(0, goal.progress / 100)) : 0;

    return (
        <motion.div
            className="h-full w-full rounded-2xl p-4 relative overflow-hidden transition-all duration-300 group cursor-default"
            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', backdropFilter: 'blur(20px)' }}
            whileHover={{ y: -2 }}
        >
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold)]/40 to-transparent z-20" />

            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to bottom right, var(--color-gold-bg), transparent)' }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="flex items-center justify-between mb-1 relative z-10">
                <div>
                    <span className="text-[14px] font-bold text-[var(--color-gold)]">
                        {goal ? goal.name : t('dashboard.monthly_goal')}
                    </span>
                    <div className="text-[9px] text-[var(--color-text-muted)] mt-0.5">
                        {goal ? t('dashboard.savings_progress') : t('dashboard.no_active_goal')}
                    </div>
                </div>
                <Link href="/goals">
                    <motion.button
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-all border border-transparent"
                        style={{ background: 'transparent' }}
                        whileHover={{ scale: 1.1, borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </motion.button>
                </Link>
            </div>

            {goal ? (
                <>
                    <div className="flex items-baseline gap-2 relative z-10 mb-0.5">
                        <motion.span
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[20px] font-bold text-[var(--color-text-main)] truncate max-w-[140px]"
                                                            title={format(goal.current_savings)}
                                >
                                    {format(goal.current_savings)}
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap"
                            style={{ background: 'rgba(212,175,55,0.12)', color: 'var(--color-gold)' }}
                        >
                                    <Target className="w-2.5 h-2.5" /> {format(goal.target_amount)}
                        </motion.span>
                    </div>

                    <div className="flex flex-col items-center relative z-10">
                        <motion.div
                            className="relative"
                            style={{ width: 160, height: 90 }}
                        >
                            <svg width="160" height="90" viewBox="0 0 180 100">
                                <defs>
                                    <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="var(--color-gold)" />
                                        <stop offset="100%" stopColor="var(--color-bronze)" />
                                    </linearGradient>
                                </defs>
                                <path d={arcPath} fill="none" stroke="var(--color-border)" strokeWidth="14" strokeLinecap="round" />
                                <motion.path
                                    d={arcPath}
                                    fill="none"
                                    stroke="url(#arcGrad)"
                                    strokeWidth="14"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: pct }}
                                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                                    style={{ filter: 'drop-shadow(0px 0px 6px var(--color-glow-primary))' }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-end pb-3">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 1 }}
                                    className="text-[20px] font-bold text-[var(--color-text-main)]"
                                >
                                    {Math.round(goal.progress)}%
                                </motion.div>
                            </div>
                        </motion.div>
                        <div className="text-[9px] text-[var(--color-text-muted)] -mt-1 uppercase tracking-tight">{t('dashboard.target_reached')}</div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center flex-1 relative z-10 text-center">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] flex items-center justify-center mb-2 text-[var(--color-text-muted)]">
                        <Target className="w-4 h-4 opacity-50" />
                    </div>
                    <span className="text-[12px] font-medium text-[var(--color-text-main)] mb-0.5">{t('dashboard.no_active_goals_dashboard')}</span>
                    <span className="text-[10px] text-[var(--color-text-muted)] mb-3 max-w-[160px]">{t('dashboard.track_wealth')}</span>
                    <Link href="/goals">
                        <motion.button 
                            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-main)] hover:border-[var(--color-gold)] transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Plus className="w-3 h-3" />
                            {t('dashboard.create')}
                        </motion.button>
                    </Link>
                </div>
            )}
        </motion.div>
    );
}
