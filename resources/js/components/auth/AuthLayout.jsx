import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Lock, ArrowRightLeft } from 'lucide-react';

export default function AuthLayout({ activeTab, children, title, subtitle }) {
    const isLogin = activeTab === 'login';

    return (
        <div className="min-h-screen w-full bg-[#0A0908] text-white font-sans flex items-center justify-center relative overflow-hidden selection:bg-[var(--color-gold)] selection:text-white">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(212,175,55,0.08),transparent_70%)] rounded-full pointer-events-none blur-3xl" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(212,175,55,0.04),transparent_70%)] rounded-full pointer-events-none blur-3xl" />
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
                backgroundImage: 'linear-gradient(var(--color-gold) 1px, transparent 1px), linear-gradient(90deg, var(--color-gold) 1px, transparent 1px)',
                backgroundSize: '80px 80px'
            }} />

            {/* Centered Panel */}
            <div className="w-full flex flex-col items-center justify-center relative z-10 px-6 py-12">
                
                {/* Logo */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', boxShadow: '0 4px 20px rgba(212,175,55,0.4)' }}>
                            <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
                                <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.95" />
                                <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.95" />
                                <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.95" />
                                <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.5" />
                            </svg>
                        </div>
                        <div>
                            <span className="font-bold text-[18px] tracking-wide">OSCORP</span>
                            <div className="text-[10px] text-[var(--color-gold)] uppercase tracking-[0.2em] font-semibold">Private Bank</div>
                        </div>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="w-full max-w-[420px] mb-8">
                    <div className="w-full p-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.1)' }}>
                        <div className="relative flex">
                            <motion.div
                                layoutId="authTabPill"
                                className="absolute top-0 h-full rounded-lg"
                                style={{ background: 'var(--color-gold)', width: 'calc(50% - 3px)', left: isLogin ? '3px' : 'calc(50%)' }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                            <Link href="/login" className="relative z-10 flex-1 text-center py-2.5 rounded-lg text-[13px] font-semibold transition-colors" style={{ color: isLogin ? '#000' : 'var(--color-text-muted)' }}>
                                Sign In
                            </Link>
                            <Link href="/register" className="relative z-10 flex-1 text-center py-2.5 rounded-lg text-[13px] font-semibold transition-colors" style={{ color: !isLogin ? '#000' : 'var(--color-text-muted)' }}>
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Form Area with Sliding Animation */}
                <div className="w-full max-w-[420px] rounded-3xl p-8" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: isLogin ? -30 : 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: isLogin ? 30 : -30 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                        <div className="mb-8 text-center">
                            <motion.h1
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="text-[26px] font-bold tracking-tight mb-2 text-[var(--color-text-main)]"
                            >
                                {title}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.15 }}
                                className="text-[13px] text-[var(--color-text-muted)] uppercase tracking-[1.5px]"
                            >
                                {subtitle}
                            </motion.p>
                        </div>

                        {children}
                    </motion.div>
                </div>

                <Link href="/" className="mt-8 flex items-center gap-1.5 text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors">
                    <ArrowRightLeft className="w-3.5 h-3.5 rotate-180" /> Back to Home
                </Link>

                {/* Bottom badge */}
                <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-[var(--color-text-muted)] uppercase tracking-[2px] opacity-40">
                    <Lock className="w-3 h-3" /> O.S.C.O.R.P. Security Infrastructure v4.2
                </div>

            </div>
        </div>
    );
}
