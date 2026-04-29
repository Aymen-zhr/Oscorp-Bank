import { ArrowUpRight, TrendingUp, ArrowDownLeft, Wallet, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function BalanceCard({ balance }) {
    const [showAmount, setShowAmount] = useState(true);
    const displayBalance = showAmount ? balance : '••••••';

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="h-full w-full rounded-2xl p-5 relative overflow-hidden"
            style={{ background: 'linear-gradient(145deg, var(--color-bg-card), var(--color-bg-elevated))', border: '1px solid var(--color-border)' }}
        >
            {/* Glow effects */}
            <div className="absolute -top-20 -right-20 w-40 h-40 opacity-10" style={{ background: 'radial-gradient(circle, var(--color-gold), transparent 70%)', filter: 'blur(40px)' }} />
            <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)', opacity: 0.3 }} />

            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-gold-bg)' }}>
                        <Wallet className="w-4 h-4" style={{ color: 'var(--color-gold)' }} />
                    </div>
                    <div>
                        <div className="text-[14px] font-semibold text-[var(--color-text-main)]">Total Balance</div>
                        <div className="text-[10px] text-[var(--color-text-muted)]">Available funds</div>
                    </div>
                </div>
                <button 
                    onClick={() => setShowAmount(!showAmount)}
                    className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-gold)] hover:bg-[var(--color-gold-bg)] transition-all"
                >
                    {showAmount ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>

            <div className="mb-4 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-baseline gap-1"
                >
                    <span className="text-[36px] font-bold tracking-tight" style={{ color: 'var(--color-text-main)' }}>
                        {Number(balance).toLocaleString()}
                    </span>
                    <span className="text-[16px] font-medium text-[var(--color-text-muted)]">MAD</span>
                </motion.div>
            </div>

            {/* Quick stats */}
            <div className="flex gap-2 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                    style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}
                >
                    <ArrowDownLeft className="w-3 h-3 text-emerald-400" />
                    <span className="text-[11px] font-semibold text-emerald-400">+Income</span>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                    <ArrowUpRight className="w-3 h-3 text-red-400" />
                    <span className="text-[11px] font-semibold text-red-400">-Expense</span>
                </motion.div>
            </div>

            {/* Action button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="absolute bottom-4 right-4 px-4 py-2 rounded-xl text-[12px] font-semibold flex items-center gap-2"
                style={{ background: 'var(--color-gold)', color: '#000', boxShadow: '0 4px 15px rgba(212,175,55,0.3)' }}
            >
                <ArrowUpRight className="w-3 h-3" />
                Transfer
            </motion.button>
        </motion.div>
    );
}