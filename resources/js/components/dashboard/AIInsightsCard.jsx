import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePage } from '@inertiajs/react';
import { useTranslation } from '../../hooks/useTranslation';
import { useCurrency } from '../../hooks/useCurrency';

// Animated live sine-wave ticker
function LiveWave({ color = '#D4AF37', amplitude = 8, speed = 1.4 }) {
    const canvasRef = useRef(null);
    const frame = useRef(0);
    const raf = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const draw = () => {
            const { width: W, height: H } = canvas;
            ctx.clearRect(0, 0, W, H);

            // gradient stroke
            const grad = ctx.createLinearGradient(0, 0, W, 0);
            grad.addColorStop(0, color + '00');
            grad.addColorStop(0.3, color + 'CC');
            grad.addColorStop(0.7, color + 'CC');
            grad.addColorStop(1, color + '00');

            ctx.beginPath();
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.lineJoin = 'round';

            for (let x = 0; x <= W; x++) {
                const t = (x / W) * Math.PI * 4 + frame.current;
                const y = H / 2 + Math.sin(t) * amplitude + Math.sin(t * 1.7 + 1) * (amplitude * 0.4);
                x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.stroke();

            // fill area under wave
            ctx.lineTo(W, H);
            ctx.lineTo(0, H);
            ctx.closePath();
            const fill = ctx.createLinearGradient(0, 0, 0, H);
            fill.addColorStop(0, color + '18');
            fill.addColorStop(1, color + '00');
            ctx.fillStyle = fill;
            ctx.fill();

            frame.current += speed * 0.018;
            raf.current = requestAnimationFrame(draw);
        };

        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        resize();
        draw();

        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        return () => { cancelAnimationFrame(raf.current); ro.disconnect(); };
    }, [color, amplitude, speed]);

    return <canvas ref={canvasRef} className="w-full h-full" />;
}

const INTEL = (balance, spending, txCount, format) => [
    {
        id: 'burn',
        label: 'Daily Burn',
        value: spending > 0 ? `${format(spending / 30)}/d` : '—',
        sub: 'within range',
        color: '#F59E0B',
        status: 'nominal',
    },
    {
        id: 'liquidity',
        label: 'Net Liquidity',
        value: format(balance),
        sub: 'reserves healthy',
        color: '#D4AF37',
        status: 'optimal',
    },
    {
        id: 'velocity',
        label: 'Activity',
        value: `${txCount} ops`,
        sub: '+5% vs prior',
        color: '#60A5FA',
        status: 'elevated',
    },
    {
        id: 'growth',
        label: 'Portfolio',
        value: '+8.4%',
        sub: 'annual yield',
        color: '#34D399',
        status: 'optimal',
    },
];

const STATUS_DOT = { nominal: '#F59E0B', optimal: '#34D399', elevated: '#60A5FA', secure: '#34D399' };

export default function AIInsightsCard() {
    const { t } = useTranslation();
    const { format } = useCurrency();
    const { props } = usePage();

    const balance = Number(props.balance ?? 0);
    const spending = Number(props.monthly_debits ?? 0);
    const txCount = props.transactions?.length ?? 0;

    const slides = useMemo(() => INTEL(balance, spending, txCount, format), [balance, spending, txCount, format]);
    const [idx, setIdx] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) return;
        const id = setInterval(() => setIdx(i => (i + 1) % slides.length), 4000);
        return () => clearInterval(id);
    }, [paused]);

    const cur = slides[idx];

    return (
        <div
            className="h-full w-full rounded-2xl relative overflow-hidden flex flex-col select-none"
            style={{ background: 'linear-gradient(160deg, #0A0A0A 0%, #040404 100%)', border: '1px solid rgba(255,255,255,0.07)' }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* ── Gold accent line top ── */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold)]/60 to-transparent z-10" />

            {/* ── Ambient radial glow that follows active color ── */}
            <motion.div
                className="absolute -top-8 -right-8 w-40 h-40 rounded-full blur-[60px] pointer-events-none"
                animate={{ backgroundColor: cur.color + '20' }}
                transition={{ duration: 0.8 }}
            />

            {/* ── HEADER ── */}
            <div className="flex items-center justify-between px-4 pt-4 shrink-0 relative z-10">
                <div className="flex items-center gap-2">
                    {/* Live indicator */}
                    <div className="relative w-2 h-2">
                        <div className="absolute inset-0 rounded-full bg-emerald-500" />
                        <motion.div
                            className="absolute inset-0 rounded-full bg-emerald-500"
                            animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity }}
                        />
                    </div>
                    <span className="text-[9px] font-black text-[var(--color-gold)] uppercase tracking-[0.25em]">
                        Private Intel
                    </span>
                </div>
                <div className="text-[8px] font-mono text-white/20 uppercase tracking-widest">
                    OIS · {idx + 1}/{slides.length}
                </div>
            </div>

            {/* ── CENTRAL DISPLAY ── */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 min-h-0 py-1">
                {/* Oscorp Logo */}
                <div className="relative flex items-center justify-center mb-3">
                    <div className="relative w-12 h-12">
                        {/* Subtle pulse behind logo */}
                        <motion.div
                            className="absolute inset-0 rounded-xl"
                            animate={{ opacity: [0.15, 0.35, 0.15], scale: [0.9, 1.05, 0.9] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            style={{ background: `radial-gradient(circle, ${cur.color}40 0%, transparent 70%)` }}
                        />
                        <motion.div
                            className="w-12 h-12 rounded-xl flex items-center justify-center relative"
                            animate={{ borderColor: cur.color + '50' }}
                            transition={{ duration: 0.6 }}
                            style={{ background: 'linear-gradient(135deg, #1a1a1a, #000)', border: '1px solid', boxShadow: `0 0 18px ${cur.color}20` }}
                        >
                            <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
                                <path d="M50 10L15 32V68L50 90L85 68V32L50 10Z"
                                    stroke="url(#lgLogo)" strokeWidth="6" strokeLinejoin="round" />
                                <path d="M50 30L35 39V61L50 70L65 61V39L50 30Z"
                                    fill="url(#lgLogo)" fillOpacity="0.2" stroke="url(#lgLogo)" strokeWidth="2" />
                                <defs>
                                    <linearGradient id="lgLogo" x1="15" y1="10" x2="85" y2="90" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#D4AF37" />
                                        <stop offset="0.5" stopColor="#FFD700" />
                                        <stop offset="1" stopColor="#B8860B" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </motion.div>
                    </div>
                </div>

                {/* Slide data */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 6, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -6, filter: 'blur(6px)' }}
                        transition={{ duration: 0.3 }}
                        className="text-center"
                    >
                        <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-0.5">
                            {cur.label}
                        </div>
                        <div
                            className="text-[20px] font-black leading-none tracking-tighter"
                            style={{ color: cur.color, textShadow: `0 0 20px ${cur.color}60` }}
                        >
                            {cur.value}
                        </div>
                        <div className="flex items-center justify-center gap-1.5 mt-1">
                            <div className="w-1 h-1 rounded-full" style={{ background: STATUS_DOT[cur.status] }} />
                            <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: STATUS_DOT[cur.status] }}>
                                {cur.sub}
                            </span>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── LIVE WAVE ── */}
            <div className="h-8 w-full shrink-0 px-4 relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                        <LiveWave color={cur.color} amplitude={6} speed={1 + idx * 0.3} />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── METRIC STRIP ── */}
            <div className="grid grid-cols-4 border-t shrink-0 relative z-10" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                {slides.map((s, i) => (
                    <motion.button
                        key={s.id}
                        onClick={() => setIdx(i)}
                        className="flex flex-col items-center py-2.5 gap-0.5 relative transition-all"
                        whileTap={{ scale: 0.95 }}
                        style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
                    >
                        {i === idx && (
                            <motion.div layoutId="activeTab"
                                className="absolute inset-0 opacity-100"
                                style={{ background: s.color + '10', borderTop: `1px solid ${s.color}40` }}
                            />
                        )}
                        <div className="w-1 h-1 rounded-full relative z-10" style={{ background: i === idx ? s.color : 'rgba(255,255,255,0.15)', boxShadow: i === idx ? `0 0 6px ${s.color}` : 'none' }} />
                        <span className="text-[7.5px] font-black uppercase tracking-wider relative z-10 leading-none"
                            style={{ color: i === idx ? s.color : 'rgba(255,255,255,0.2)' }}>
                            {s.label.split(' ')[0]}
                        </span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
