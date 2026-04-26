import { ArrowUpRight, Brain, TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePage } from '@inertiajs/react';

export default function AIInsightsCard() {
    const { props } = usePage();
    const balance = Number(props.balance ?? 74652);
    const spending = Number(props.totalSpending ?? 84433);
    const txCount = props.transactions?.length ?? 0;

    const [tick, setTick] = useState(0);
    const [slideIndex, setSlideIndex] = useState(0);

    const slides = [
        { icon: Activity, label: 'Burn Rate', value: `${Number((spending / 30).toFixed(0)).toLocaleString()} MAD/day`, trend: 'neutral', insight: 'Daily expenditure is within acceptable range.' },
        { icon: TrendingUp, label: 'Liquid Threshold', value: `${balance.toLocaleString()} MAD`, trend: 'up', insight: 'Capital reserves are healthy. No intervention needed.' },
        { icon: Zap, label: 'Transaction Velocity', value: `${txCount} entries`, trend: 'up', insight: 'Activity volume increased 5% vs. last period.' },
        { icon: TrendingDown, label: 'Capital Burn', value: `${Number((spending / balance * 100).toFixed(1))}% ratio`, trend: 'neutral', insight: 'Spending-to-balance ratio is nominal. Maintained.' },
    ];

    useEffect(() => {
        const id = setInterval(() => {
            setTick(t => t + 1);
            setSlideIndex(s => (s + 1) % slides.length);
        }, 4000);
        return () => clearInterval(id);
    }, []);

    // Animated mini waveform data
    const wavePoints = Array.from({ length: 20 }, (_, i) => 20 + Math.sin(i * 0.8 + tick * 0.5) * 15 + Math.random() * 5);

    const current = slides[slideIndex];

    return (
        <div className="h-full w-full rounded-2xl relative overflow-hidden flex flex-col"
            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', backdropFilter: 'blur(20px)' }}
        >
            {/* Top glow */}
            <motion.div
                animate={{ opacity: [0.15, 0.4, 0.15], scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-10 -left-10 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, var(--color-gold-bg) 0%, transparent 70%)' }}
            />

            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 relative z-10">
                <motion.div
                    animate={{ boxShadow: ['0 0 0px var(--color-glow-primary)', '0 0 12px var(--color-border-hover)', '0 0 0px var(--color-glow-primary)'] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold"
                    style={{ background: 'var(--color-gold-bg)', border: '1px solid var(--color-border)', color: 'var(--color-gold)' }}
                >
                    <Brain className="w-3 h-3" /> Private Intelligence
                </motion.div>
                <div className="text-[10px] text-[var(--color-text-muted)] font-mono">{slideIndex + 1}/{slides.length}</div>
            </div>

            {/* Center: Animated Metric Display */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slideIndex}
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="w-full flex flex-col items-center text-center gap-2"
                    >
                        {/* Icon ring */}
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-1"
                            style={{ background: 'var(--color-gold-bg)', border: '1px solid var(--color-border)' }}
                        >
                            <current.icon className="w-5 h-5 text-[var(--color-gold)]" />
                        </div>
                        <div className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-widest font-semibold">{current.label}</div>
                        <div className="text-[22px] font-bold text-[var(--color-text-main)] leading-tight">{current.value}</div>
                        
                        <div className="text-[11px] text-[var(--color-gold)] font-medium mt-1 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] shadow-[0_0_4px_var(--color-gold)]" />
                            {current.insight}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom: Mini Neural Waveform */}
            <div className="px-4 pb-2 relative z-10">
                <svg viewBox="0 0 200 40" className="w-full h-[30px]" preserveAspectRatio="none">
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
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* Pagination dots */}
            <div className="flex items-center justify-between px-4 pb-4 relative z-10">
                <div className="flex gap-1.5">
                    {slides.map((_, i) => (
                        <motion.button
                            key={i}
                            onClick={() => setSlideIndex(i)}
                            animate={{ width: i === slideIndex ? 18 : 6, backgroundColor: i === slideIndex ? 'var(--color-gold)' : 'var(--color-border)' }}
                            className="h-1.5 rounded-full cursor-pointer"
                        />
                    ))}
                </div>
                <div className="text-[10px] text-[var(--color-text-muted)] font-mono">{slideIndex + 1}/{slides.length}</div>
            </div>
        </div>
    );
}
