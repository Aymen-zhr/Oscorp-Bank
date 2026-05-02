import { ArrowUpRight, TrendingDown, ShoppingBag, Coffee, Plane, Laptop, FileText, Smartphone, Briefcase, Car, Gem } from 'lucide-react';
import { usePage, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

const ALLOCATION_COLORS = [
    'var(--color-gold)',
    '#E5E4E2',
    'var(--color-bronze)',
    'var(--color-champagne)',
    '#A9A9A9',
];

const getCategoryIcon = (name) => {
    switch (name.toLowerCase()) {
        case 'luxury goods': case 'shopping': case 'clothing': return Gem;
        case 'fine dining': case 'dining': case 'food': case 'groceries': return Coffee;
        case 'private jets': case 'travel': return Plane;
        case 'tech': case 'electronics': return Laptop;
        case 'real estate': case 'bills': case 'utilities': return FileText;
        case 'philanthropy': return Briefcase;
        case 'transport': case 'vehicles': return Car;
        default: return Smartphone;
    }
};

export default function SpendingCard({ total }) {
    const { t } = useTranslation();
    const { props } = usePage();
    const transactions = props.transactions ?? [];
    const [hoveredSegment, setHoveredSegment] = useState(null);

    const categoryMap = {};
    transactions.forEach(tx => {
        if (tx.type === 'debit') {
            const cat = tx.category || 'Other';
            categoryMap[cat] = (categoryMap[cat] || 0) + Number(tx.amount);
        }
    });

    const categories = Object.keys(categoryMap).length > 0
        ? Object.entries(categoryMap).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([name, amount]) => ({ name, amount }))
        : [
            { name: 'Private Jets', amount: 34000 },
            { name: 'Vehicles', amount: 55000 },
            { name: 'Real Estate', amount: 120000 },
            { name: 'Luxury Goods', amount: 8500 },
        ];

    const actualTotal = categories.reduce((sum, cat) => sum + cat.amount, 0);

    return (
        <motion.div
            className="h-full w-full rounded-2xl p-4 relative overflow-hidden transition-all duration-300 group flex flex-col cursor-default"
            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', backdropFilter: 'blur(20px)' }}
            whileHover={{ y: -2 }}
        >
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold)]/40 to-transparent z-20" />

            <motion.div
                className="absolute inset-0 pointer-events-none opacity-50"
                style={{ background: 'linear-gradient(to top right, var(--color-gold-bg), transparent)' }}
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="flex items-center justify-between mb-2 relative z-10 shrink-0">
                <div>
                    <span className="text-[14px] font-bold text-[var(--color-gold)]">{t('dashboard.capital_allocation')}</span>
                    <div className="text-[9px] text-[var(--color-text-muted)] tracking-wider">{t('dashboard.deployment')}</div>
                </div>
                <Link href="/allocations">
                    <motion.button
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--color-text-muted)] border border-transparent"
                        whileHover={{ scale: 1.1, backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-main)' }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </motion.button>
                </Link>
            </div>

            <div className="flex items-end justify-between mb-3 relative z-10 shrink-0">
                <div>
                    <div className="text-[22px] md:text-[24px] font-bold text-[var(--color-text-main)] tracking-tight leading-none">
                        {Number(actualTotal).toLocaleString()} <span className="text-[12px] text-[var(--color-text-muted)] font-normal uppercase">MAD</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    <TrendingDown className="w-2.5 h-2.5" />
                    <span>4.2% {t('dashboard.optimized')}</span>
                </div>
            </div>

            <div className="flex h-1.5 rounded-full overflow-hidden mb-4 relative z-10 bg-[var(--color-bg-elevated)] shrink-0 border border-[var(--color-border)]">
                {categories.map((cat, i) => {
                    const percent = (cat.amount / actualTotal) * 100;
                    return (
                        <motion.div
                            key={cat.name}
                            initial={{ width: 0 }}
                            animate={{
                                width: `${percent}%`,
                                filter: hoveredSegment === i ? 'brightness(1.2)' : 'brightness(1)',
                            }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className="h-full cursor-pointer relative group/segment border-r border-[var(--color-bg-base)] last:border-0"
                            style={{ backgroundColor: ALLOCATION_COLORS[i % ALLOCATION_COLORS.length] }}
                            onMouseEnter={() => setHoveredSegment(i)}
                            onMouseLeave={() => setHoveredSegment(null)}
                        />
                    );
                })}
            </div>

            <div className="flex flex-col gap-1 relative z-10 overflow-hidden flex-1 min-h-0">
                {categories.map((cat, i) => {
                    const Icon = getCategoryIcon(cat.name);
                    const percent = ((cat.amount / actualTotal) * 100).toFixed(1);
                    return (
                        <motion.div
                            key={cat.name}
                            className="flex items-center justify-between p-1.5 rounded-xl border border-transparent"
                            whileHover={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}
                        >
                            <div className="flex items-center gap-2.5">
                                <div
                                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${ALLOCATION_COLORS[i % ALLOCATION_COLORS.length]}15` }}
                                >
                                    <Icon className="w-3.5 h-3.5" style={{ color: ALLOCATION_COLORS[i % ALLOCATION_COLORS.length] }} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[12px] font-semibold text-[var(--color-text-main)] truncate max-w-[80px] md:max-w-none">{cat.name}</span>
                                    <span className="text-[9px] text-[var(--color-text-muted)]">{percent}%</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[12px] font-bold text-[var(--color-text-main)]">{Number(cat.amount).toLocaleString()}</div>
                                <div className="text-[8px] text-[var(--color-text-muted)] uppercase">MAD</div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
