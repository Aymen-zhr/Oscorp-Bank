import { ArrowUpRight, ArrowDownLeft, Wallet, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '../../hooks/useTranslation';
import { useCurrency } from '../../hooks/useCurrency';

export default function BalanceCard({ balance }) {
    const { t } = useTranslation();
    const { format, code } = useCurrency();
    const [showAmount, setShowAmount] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef(null);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ y: -2 }}
            className="h-full w-full rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between"
            style={{
                background: 'linear-gradient(145deg, var(--color-bg-card), var(--color-bg-elevated))',
                border: '1px solid var(--color-border)',
                boxShadow: isHovered ? '0 15px 30px rgba(0,0,0,0.2)' : 'none',
            }}
        >
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold)]/40 to-transparent z-20" />
            
            <motion.div
                className="absolute -top-20 -right-20 w-40 h-40 opacity-10 pointer-events-none"
                style={{ background: 'radial-gradient(circle, var(--color-gold), transparent 70%)', filter: 'blur(40px)' }}
                animate={{ opacity: isHovered ? 0.2 : 0.1, scale: isHovered ? 1.2 : 1 }}
            />

            <div>
                <div className="flex items-center justify-between mb-2 relative z-10">
                    <div className="flex items-center gap-2">
                        <motion.div
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ background: 'var(--color-gold-bg)' }}
                            animate={{ scale: isHovered ? 1.05 : 1 }}
                        >
                            <Wallet className="w-3.5 h-3.5" style={{ color: 'var(--color-gold)' }} />
                        </motion.div>
                        <div>
                            <div className="text-[13px] font-semibold text-[var(--color-text-main)]">{t('dashboard.total_balance')}</div>
                            <div className="text-[9px] text-[var(--color-text-muted)]">{t('dashboard.available_funds')}</div>
                        </div>
                    </div>
                    <motion.button
                        onClick={() => setShowAmount(!showAmount)}
                        className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-gold)] hover:bg-[var(--color-gold-bg)] transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <motion.div
                            animate={{ rotate: showAmount ? 0 : 180 }}
                            transition={{ duration: 0.3 }}
                        >
                            {showAmount ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </motion.div>
                    </motion.button>
                </div>

                <div className="mb-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-baseline gap-1"
                    >
                        <motion.span
                            className="text-[32px] md:text-[36px] font-bold tracking-tight"
                            style={{ color: 'var(--color-text-main)' }}
                            animate={{ scale: isHovered ? 1.01 : 1 }}
                        >
                            {showAmount ? format(balance) : '••••••'}
                        </motion.span>
                        <span className="text-[14px] font-medium text-[var(--color-text-muted)]">{code}</span>
                    </motion.div>
                </div>
            </div>

            <div className="flex gap-2 relative z-10 w-full mt-auto">
                <Link href="/deposit" className="flex-1">
                    <motion.button
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all"
                        style={{ background: 'var(--color-gold)', color: '#000', boxShadow: '0 4px 10px rgba(212,175,55,0.2)' }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <ArrowDownLeft className="w-3 h-3" />
                        {t('common.deposit')}
                    </motion.button>
                </Link>
                
                <Link href="/withdrawal" className="flex-1">
                    <motion.button
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all border"
                        style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-main)', borderColor: 'var(--color-border)' }}
                        whileHover={{ scale: 1.02, backgroundColor: 'var(--color-bg-base)' }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <ArrowUpRight className="w-3 h-3" />
                        {t('common.withdrawal')}
                    </motion.button>
                </Link>
            </div>
        </motion.div>
    );
}
