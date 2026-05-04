import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { ArrowRight, Shield, Wallet, BarChart3, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';

function FloatingCard() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className="relative w-full max-w-md mx-auto"
        >
            {/* Minimalist Glass Card */}
            <div className="rounded-3xl p-8 relative overflow-hidden transition-all duration-500"
                style={{ 
                    background: 'var(--color-bg-card)', 
                    border: '1px solid var(--color-border)', 
                    backdropFilter: 'blur(20px)',
                    boxShadow: isHovered ? '0 30px 60px -15px rgba(0,0,0,0.5)' : '0 20px 40px -10px rgba(0,0,0,0.3)'
                }}>
                
                {/* Subtle top edge highlight */}
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold)]/30 to-transparent opacity-50" />
                
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-elevated)] flex items-center justify-center border border-[var(--color-border)]">
                            <Wallet className="w-4 h-4 text-[var(--color-text-main)]" />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em]">Global Portfolio</div>
                            <div className="text-[13px] font-semibold text-[var(--color-text-main)]">Private Wealth</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-base)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-[var(--color-text-main)] uppercase tracking-wider">Active</span>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Total Deployed</div>
                    <div className="flex items-baseline gap-2">
                        <AnimatedCounter value={2847392} />
                        <span className="text-[16px] font-medium text-[var(--color-text-muted)]">MAD</span>
                    </div>
                </div>

                {/* Ledger-style mini breakdown */}
                <div className="space-y-3 pt-6 border-t border-[var(--color-border)]">
                    {[
                        { label: 'Equities', value: '1,420,000', percent: '49.8%', color: 'var(--color-gold)' },
                        { label: 'Real Estate', value: '850,000', percent: '29.8%', color: '#E5E4E2' },
                        { label: 'Liquid Cash', value: '577,392', percent: '20.4%', color: 'var(--color-text-muted)' },
                    ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center group cursor-default">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-[13px] font-medium text-[var(--color-text-main)] group-hover:text-[var(--color-gold)] transition-colors">{item.label}</span>
                            </div>
                            <div className="flex items-center gap-4 text-right">
                                <span className="text-[12px] font-bold text-[var(--color-text-main)]">{item.value}</span>
                                <span className="text-[11px] text-[var(--color-text-muted)] w-8">{item.percent}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

function AnimatedCounter({ value }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        const duration = 2000;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= end) {
                setDisplay(end);
                clearInterval(timer);
            } else {
                setDisplay(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [value]);

    return (
        <div className="text-[48px] font-bold tracking-tighter text-[var(--color-text-main)] leading-none">
            {display.toLocaleString()}
        </div>
    );
}

export default function HeroSection({ canRegister }) {
    const [hoveredBadge, setHoveredBadge] = useState(null);

    const badges = ['Regulated Framework', 'Military-Grade Encryption', 'Institutional Liquidity', 'AI Cognitive Engine'];

    return (
        <section id="home" className="min-h-screen flex items-center pt-24 pb-16 px-6 relative overflow-hidden">
            {/* Extremely subtle background texture */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(var(--color-text-muted) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-muted) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

            <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
                
                {/* Left Content */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="max-w-2xl">
                    
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-8 text-[10px] font-bold uppercase tracking-[0.2em] border border-[var(--color-border)] bg-[var(--color-bg-card)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
                        <span className="text-[var(--color-text-main)]">Oscorp Financial Systems</span>
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
                         className="text-[40px] md:text-[56px] lg:text-[80px] font-semibold leading-[1.05] tracking-tight mb-6 md:mb-8 text-[var(--color-text-main)]">
                         Capital,<br />
                         <span className="text-[var(--color-text-muted)] italic font-light">Architected.</span>
                     </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-[16px] lg:text-[18px] text-[var(--color-text-muted)] leading-relaxed mb-12 max-w-[500px] font-medium">
                        Oscorp Private Bank delivers zero-latency wealth intelligence, bespoke asset allocation, and absolute financial sovereignty.
                    </motion.p>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-5 mb-16">
                        {canRegister && (
                            <Link href="/register"
                                className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-[13px] font-bold transition-all bg-[var(--color-text-main)] text-[var(--color-bg-base)] hover:bg-[var(--color-gold)] hover:text-black group">
                                Initialize Account
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        )}
                        <button
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-[13px] font-bold transition-all border border-[var(--color-border)] text-[var(--color-text-main)] hover:bg-[var(--color-bg-elevated)]"
                        >
                            <BarChart3 className="w-4 h-4" />
                            View Specifications
                        </button>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }}
                        className="flex flex-wrap gap-x-8 gap-y-4">
                        {badges.map((b, i) => (
                            <div key={b} className="flex items-center gap-2">
                                <Shield className="w-3.5 h-3.5 text-[var(--color-gold)]" />
                                <span className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">{b}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Right Content - Visual */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="relative flex justify-center lg:justify-end">
                    
                    {/* Architectural Grid Lines behind card */}
                    <div className="absolute inset-0 pointer-events-none opacity-20 hidden lg:block"
                        style={{ 
                            backgroundImage: `
                                linear-gradient(to right, var(--color-border) 1px, transparent 1px),
                                linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)
                            `,
                            backgroundSize: '100px 100px',
                            maskImage: 'radial-gradient(circle at center, black, transparent 70%)'
                        }} 
                    />

                    <FloatingCard />
                </motion.div>
            </div>
        </section>
    );
}
