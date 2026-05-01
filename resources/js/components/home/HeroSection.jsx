import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { ArrowRight, Sparkles, Shield, Wallet } from 'lucide-react';

function FloatingCard() {
    return (
        <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            className="relative w-full max-w-sm mx-auto"
        >
            {/* Glow behind card */}
            <div className="absolute inset-0 rounded-[28px] blur-3xl opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(circle, var(--color-gold), transparent 70%)' }} />

            {/* Main balance card */}
            <div className="rounded-[28px] p-6 relative overflow-hidden"
                style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', backdropFilter: 'blur(20px)' }}>
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }} />
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-gold-bg)' }}>
                            <Wallet className="w-4 h-4" style={{ color: 'var(--color-gold)' }} />
                        </div>
                        <div className="text-[12px] font-semibold text-[var(--color-text-muted)]">Total Balance</div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold"
                        style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34D399' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                        Live
                    </div>
                </div>
                <div className="mb-6">
                    <div className="text-[38px] font-bold tracking-tight text-[var(--color-text-main)]">$2,847,392</div>
                    <div className="text-[13px] text-emerald-400 font-medium mt-1">+$34,291 this month</div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Income',   value: '$48.2K', color: '#34D399' },
                        { label: 'Expenses', value: '$12.1K', color: '#EF4444' },
                        { label: 'Savings',  value: '$36.1K', color: 'var(--color-gold)' },
                    ].map(s => (
                        <div key={s.label} className="px-3 py-2.5 rounded-xl text-center"
                            style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
                            <div className="text-[9px] text-[var(--color-text-muted)] mb-1">{s.label}</div>
                            <div className="text-[13px] font-bold" style={{ color: s.color }}>{s.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI floating badge */}
            <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -top-4 -right-4 px-3 py-2 rounded-2xl flex items-center gap-2 shadow-xl"
                style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--color-gold)' }} />
                <span className="text-[11px] font-bold text-[var(--color-text-main)]">Oscar AI</span>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--color-gold)' }} />
            </motion.div>

            {/* Security badge */}
            <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 -left-4 px-3 py-2 rounded-2xl flex items-center gap-2 shadow-xl"
                style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-bold text-[var(--color-text-main)]">256-bit Secure</span>
            </motion.div>
        </motion.div>
    );
}

export default function HeroSection({ canRegister }) {
    return (
        <section id="home" className="min-h-screen flex items-center pt-24 pb-16 px-6 relative overflow-hidden">
            {/* Background glows */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-10"
                style={{ background: 'radial-gradient(circle, var(--color-gold), transparent 70%)', filter: 'blur(80px)' }} />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-5"
                style={{ background: 'radial-gradient(circle, var(--color-gold), transparent 70%)', filter: 'blur(60px)' }} />
            {/* Subtle grid */}
            <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(var(--color-gold) 1px, transparent 1px), linear-gradient(90deg, var(--color-gold) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                {/* Left: Copy */}
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-[11px] font-bold uppercase tracking-wider"
                        style={{ background: 'var(--color-gold-bg)', border: '1px solid var(--color-border)', color: 'var(--color-gold)' }}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--color-gold)' }} />
                        Private Banking · Est. 2024
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-[52px] lg:text-[64px] font-bold leading-[1.05] tracking-tight mb-6 text-[var(--color-text-main)]">
                        Banking Built<br />for the{' '}
                        <span className="bg-clip-text text-transparent"
                            style={{ backgroundImage: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))' }}>
                            Elite.
                        </span>
                    </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="text-[17px] text-[var(--color-text-muted)] leading-relaxed mb-10 max-w-[480px]">
                        OSCORP Private Bank delivers AI-powered wealth intelligence, seamless global transfers, and platinum-tier service — all in one secure platform.
                    </motion.p>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="flex flex-wrap gap-4 mb-10">
                        {canRegister && (
                            <Link href="/register"
                                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-[14px] font-bold transition-all hover:brightness-110 group"
                                style={{ background: 'var(--color-gold)', color: '#000', boxShadow: '0 8px 30px rgba(212,175,55,0.35)' }}>
                                Open Account
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        )}
                        <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-7 py-3.5 rounded-2xl text-[14px] font-semibold transition-all hover:bg-[var(--color-bg-elevated)]"
                            style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}>
                            Explore Features
                        </button>
                    </motion.div>

                    {/* Trust badges */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                        className="flex flex-wrap gap-4">
                        {['✔ Fully Regulated', '✔ 256-bit AES', '✔ FDIC Insured', '✔ AI-Powered'].map(b => (
                            <span key={b} className="text-[12px] font-semibold" style={{ color: 'var(--color-text-muted)' }}>{b}</span>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Right: Card */}
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex justify-center">
                    <FloatingCard />
                </motion.div>
            </div>
        </section>
    );
}
