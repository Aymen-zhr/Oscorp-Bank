import { usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useTranslation } from "../../hooks/useTranslation";
import { useCurrency } from "../../hooks/useCurrency";
import { TrendingUp, ShieldCheck, Activity } from "lucide-react";

export default function WealthHero({ balance }) {
    const { t } = useTranslation();
    const { format, code } = useCurrency();
    const { props } = usePage();
    const transactions = props.transactions ?? [];

    // Calculate real stats from transactions
    const credits = transactions
        .filter(tx => tx.type === "credit")
        .reduce((sum, tx) => sum + Number(tx.amount), 0);

    const debits = transactions
        .filter(tx => tx.type === "debit")
        .reduce((sum, tx) => sum + Number(tx.amount), 0);

    const txCount = transactions.length;
    const avgDailySpend = txCount > 0 ? debits / 30 : 0;

    return (
        <div className="w-full relative overflow-hidden rounded-3xl p-6 md:p-8 lg:p-10"
            style={{
                background: "linear-gradient(135deg, #0D0D0D 0%, #111111 100%)",
                border: "1px solid var(--color-border)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
            }}
        >
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(circle at 100% 0%, var(--color-gold) 0%, transparent 70%)" }}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                {/* Left: Main Balance Display */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 rounded-full bg-[var(--color-gold-bg)] border border-[var(--color-gold)]/20 flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-gold)]" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-gold)]">Private Client</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                            <Activity className="w-3 h-3" /> Live
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-[14px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest">{t("dashboard.total_liquid_capital")}</h2>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex items-baseline gap-3"
                        >
                            <span className="text-[48px] md:text-[64px] font-black tracking-tighter text-white leading-none">
                                {format(balance)}
                            </span>
                            <span className="text-[20px] md:text-[24px] font-bold text-[var(--color-gold)] opacity-50">{code}</span>
                        </motion.div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 pt-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Monthly Flow</div>
                                <div className="text-[16px] font-bold text-white">+{format(credits)}</div>
                            </div>
                        </div>
                        <div className="w-px h-8 bg-white/10 hidden md:block" />
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Daily Avg</div>
                                <div className="text-[16px] font-bold text-white">{format(avgDailySpend)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Stats Visualization */}
                <div className="lg:col-span-5 hidden lg:block">
                    <div className="relative h-[180px] w-full flex items-end justify-between px-2">
                        {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 1].map((h, i) => (
                            <div key={i} className="w-8 relative group">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h * 100}%` }}
                                    transition={{ duration: 1.2, delay: i * 0.1, ease: "circOut" }}
                                    className="w-full bg-gradient-to-t from-[var(--color-gold)]/20 to-[var(--color-gold)] rounded-t-lg relative"
                                >
                                    <div className="absolute -top-6 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-bold text-[var(--color-gold)]">{Math.round(h * 100)}</span>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                        <span>Portfolio</span>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" /> Assets</span>
                            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-white/20" /> Liquid</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
