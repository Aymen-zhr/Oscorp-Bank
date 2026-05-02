import { ArrowUpRight, Brain, TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePage } from '@inertiajs/react';
import { useTranslation } from '../../hooks/useTranslation';

export default function AIInsightsCard() {
    const { t } = useTranslation();
    const { props } = usePage();
    const balance = Number(props.balance ?? 74652);
    const spending = Number(props.totalSpending ?? 84433);
    const txCount = props.transactions?.length ?? 0;

    const [tick, setTick] = useState(0);
    const [slideIndex, setSlideIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const slides = [
        { icon: Activity, label: 'dashboard.burn_rate', value: `${Number((spending / 30).toFixed(0)).toLocaleString()} MAD/day`, trend: 'neutral', insight: 'dashboard.daily_expenditure' },
        { icon: TrendingUp, label: 'dashboard.liquid_threshold', value: `${balance.toLocaleString()} MAD`, trend: 'up', insight: 'dashboard.capital_reserves' },
        { icon: Zap, label: 'dashboard.transaction_velocity', value: `${txCount} entries`, trend: 'up', insight: 'dashboard.activity_volume' },
        { icon: TrendingDown, label: 'dashboard.capital_burn', value: `${Number((spending / balance * 100).toFixed(1))}% ratio`, trend: 'neutral', insight: 'dashboard.spending_ratio' },
    ];

    useEffect(() => {
        if (isPaused) return;
        const id = setInterval(() => {
            setTick(t => t + 1);
            setSlideIndex(s => (s + 1) % slides.length);
        }, 4000);
        return () => clearInterval(id);
    }, [isPaused]);

    const wavePoints = Array.from({ length: 20 }, (_, i) => 20 + Math.sin(i * 0.8 + tick * 0.5) * 15 + Math.random() * 5);
    const current = slides[slideIndex];

    return (
        <div
            className="h-full w-full rounded-2xl relative overflow-hidden flex flex-col cursor-default"
            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', backdropFilter: 'blur(20px)' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold)]/40 to-transparent z-20" />
            
            <motion.div
                animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-10 -left-10 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, var(--color-gold-bg) 0%, transparent 70%)' }}
            />

            <div className="flex items-center justify-between px-4 pt-3 relative z-10">
                <motion.div
                    animate={{ boxShadow: ['0 0 0px var(--color-glow-primary)', '0 0 8px var(--color-border-hover)', '0 0 0px var(--color-glow-primary)'] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold"
                    style={{ background: 'var(--color-gold-bg)', border: '1px solid var(--color-border)', color: 'var(--color-gold)' }}
                >
                    <Brain className="w-2.5 h-2.5" /> {t('dashboard.private_intel')}
                </motion.div>
                <div className="text-[9px] text-[var(--color-text-muted)] font-mono">{slideIndex + 1}/{slides.length}</div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 py-1">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slideIndex}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                        className="w-full flex flex-col items-center text-center gap-1"
                    >
                        <motion.div
                            className="w-10 h-10 rounded-xl flex items-center justify-center mb-0.5"
                            style={{ background: 'var(--color-gold-bg)', border: '1px solid var(--color-border)' }}
                            whileHover={{ scale: 1.05, rotate: 2 }}
                        >
                            <current.icon className="w-4 h-4 text-[var(--color-gold)]" />
                        </motion.div>
                        <div className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-[0.15em] font-semibold">{t(current.label)}</div>
                        <motion.div
                            className="text-[18px] md:text-[22px] font-bold text-[var(--color-text-main)] leading-tight"
                        >
                            {current.value}
                        </motion.div>

                        <div className="text-[10px] text-[var(--color-gold)] font-medium mt-0.5 flex items-center gap-1.5 line-clamp-1">
                            <motion.span
                                className="w-1 h-1 rounded-full bg-[var(--color-gold)]"
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            {t(current.insight)}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="px-4 pb-1 relative z-10">
                <svg viewBox="0 0 200 40" className="w-full h-[25px]" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0" />
                            <stop offset="40%" stopColor="var(--color-gold)" stopOpacity="0.8" />
                            <stop offset="60%" stopColor="var(--color-bronze)" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="var(--color-bronze)" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <polyline
                        points={wavePoints.map((v, i) => `${(i / (wavePoints.length - 1)) * 200},${40 - v}`).join(' ')}
                        fill="none"
                        stroke="url(#waveGrad)"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            <div className="flex items-center justify-between px-4 pb-3 relative z-10">
                <div className="flex gap-1">
                    {slides.map((_, i) => (
                        <motion.button
                            key={i}
                            onClick={() => setSlideIndex(i)}
                            animate={{
                                width: i === slideIndex ? 14 : 4,
                                backgroundColor: i === slideIndex ? 'var(--color-gold)' : 'var(--color-border)',
                            }}
                            className="h-1 rounded-full cursor-pointer"
                        />
                    ))}
                </div>
                <div className="text-[8px] font-mono flex items-center gap-1 text-[var(--color-text-muted)] uppercase tracking-tighter">
                    <div className={`w-1 h-1 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
                    {isPaused ? t('dashboard.paused') : t('dashboard.live')}
                </div>
            </div>
        </div>
    );
}
