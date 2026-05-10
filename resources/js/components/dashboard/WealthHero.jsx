import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { useCurrency } from '../../hooks/useCurrency';
import { TrendingUp, ShieldCheck, Activity } from 'lucide-react';

export default function WealthHero({ balance }) {
    const { t } = useTranslation();
    const { format, code } = useCurrency();
    const { props } = usePage();
    const transactions = props.transactions ?? [];

    // Calculate real stats from transactions
    const credits = transactions
        .filter((tx) => tx.type === 'credit')
        .reduce((sum, tx) => sum + Number(tx.amount), 0);

    const debits = transactions
        .filter((tx) => tx.type === 'debit')
        .reduce((sum, tx) => sum + Number(tx.amount), 0);

    const txCount = transactions.length;
    const avgDailySpend = txCount > 0 ? debits / 30 : 0;

    return (
        <div
            className="relative w-full overflow-hidden rounded-3xl p-6 md:p-8 lg:p-10"
            style={{
                background: 'linear-gradient(135deg, #0D0D0D 0%, #111111 100%)',
                border: '1px solid var(--color-border)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            }}
        >
            {/* Background Effects */}
            <div
                className="pointer-events-none absolute top-0 right-0 h-full w-1/2 opacity-20"
                style={{
                    background:
                        'radial-gradient(circle at 100% 0%, var(--color-gold) 0%, transparent 70%)',
                }}
            />

            <div className="relative z-10 grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
                {/* Left: Main Balance Display */}
                <div className="space-y-4 lg:col-span-7">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-full border border-[var(--color-gold)]/20 bg-[var(--color-gold-bg)] px-3 py-1">
                            <ShieldCheck className="h-3.5 w-3.5 text-[var(--color-gold)]" />
                            <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-gold)] uppercase">
                                Private Client
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                            <Activity className="h-3 w-3" /> Live
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-[14px] font-semibold tracking-widest text-[var(--color-text-muted)] uppercase">
                            {t('dashboard.total_liquid_capital')}
                        </h2>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="flex items-baseline gap-3"
                        >
                            <span className="text-[48px] leading-none font-black tracking-tighter text-white md:text-[64px]">
                                {format(balance)}
                            </span>
                            <span className="text-[20px] font-bold text-[var(--color-gold)] opacity-50 md:text-[24px]">
                                {code}
                            </span>
                        </motion.div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 pt-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                                <TrendingUp className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase">
                                    Monthly Flow
                                </div>
                                <div className="text-[16px] font-bold text-white">
                                    +{format(credits)}
                                </div>
                            </div>
                        </div>
                        <div className="hidden h-8 w-px bg-white/10 md:block" />
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                                <TrendingUp className="h-5 w-5 text-red-400" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase">
                                    Daily Avg
                                </div>
                                <div className="text-[16px] font-bold text-white">
                                    {format(avgDailySpend)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Stats Visualization */}
                <div className="hidden lg:col-span-5 lg:block">
                    <div className="relative flex h-[180px] w-full items-end justify-between px-2">
                        {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 1].map((h, i) => (
                            <div key={i} className="group relative w-8">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h * 100}%` }}
                                    transition={{
                                        duration: 1.2,
                                        delay: i * 0.1,
                                        ease: 'circOut',
                                    }}
                                    className="relative w-full rounded-t-lg bg-gradient-to-t from-[var(--color-gold)]/20 to-[var(--color-gold)]"
                                >
                                    <div className="absolute -top-6 right-0 left-0 text-center opacity-0 transition-opacity group-hover:opacity-100">
                                        <span className="text-[10px] font-bold text-[var(--color-gold)]">
                                            {Math.round(h * 100)}
                                        </span>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-[10px] font-bold tracking-widest text-[var(--color-text-muted)] uppercase">
                        <span>Portfolio</span>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />{' '}
                                Assets
                            </span>
                            <span className="flex items-center gap-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-white/20" />{' '}
                                Liquid
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
