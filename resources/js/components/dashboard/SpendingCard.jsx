import { ArrowUpRight, TrendingDown, ShoppingBag, Coffee, Plane, Laptop, FileText, Smartphone, Briefcase, Car, Gem } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';

// Distinct luxury color palette for allocation segments
const ALLOCATION_COLORS = [
    'var(--color-gold)',        // Gold
    '#E5E4E2',                  // Platinum
    'var(--color-bronze)',      // Bronze
    'var(--color-champagne)',   // Champagne
    '#A9A9A9',                  // Silver
];

// Map categories to icons
const getCategoryIcon = (name) => {
    switch (name.toLowerCase()) {
        case 'luxury goods':
        case 'shopping':
        case 'clothing': return Gem;
        case 'fine dining':
        case 'dining':
        case 'food':
        case 'groceries': return Coffee;
        case 'private jets':
        case 'travel': return Plane;
        case 'tech':
        case 'electronics': return Laptop;
        case 'real estate':
        case 'bills':
        case 'utilities': return FileText;
        case 'philanthropy': return Briefcase;
        case 'transport': return Car;
        default: return Smartphone;
    }
};

export default function SpendingCard({ total }) {
    const { props } = usePage();
    const transactions = props.transactions ?? [];

    // Build live category breakdown from real transactions
    const categoryMap = {};
    transactions.forEach(tx => {
        if (tx.type === 'debit') {
            const cat = tx.category || 'Other';
            categoryMap[cat] = (categoryMap[cat] || 0) + Number(tx.amount);
        }
    });

    const categories = Object.keys(categoryMap).length > 0
        ? Object.entries(categoryMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, amount]) => ({ name, amount }))
        : [
            { name: 'Private Jets', amount: 34000 },
            { name: 'Fine Dining', amount: 16000 },
            { name: 'Real Estate', amount: 12000 },
            { name: 'Luxury Goods', amount: 8000 },
            { name: 'Philanthropy', amount: 6000 },
        ];

    const actualTotal = categories.reduce((sum, cat) => sum + cat.amount, 0);

    return (
        <div className="h-full w-full rounded-2xl p-5 relative overflow-hidden transition-all duration-300 group flex flex-col"
            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', backdropFilter: 'blur(20px)' }}
        >
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-gold-bg)] to-transparent pointer-events-none opacity-50" />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4 relative z-10 shrink-0">
                <div>
                    <span className="text-[15px] font-bold text-[var(--color-gold)]">Capital Allocation</span>
                    <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5 tracking-wide">Q3 PORTFOLIO DEPLOYMENT</div>
                </div>
                <button className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-all hover:bg-[var(--color-bg-elevated)] border border-transparent hover:border-[var(--color-border-hover)]">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Total metric and MoM trend */}
            <div className="flex items-end justify-between mb-6 relative z-10 shrink-0">
                <div>
                    <div className="text-[28px] font-bold text-[var(--color-text-main)] tracking-tight leading-none">
                        {Number(actualTotal).toLocaleString()} <span className="text-[14px] text-[var(--color-text-muted)] font-normal">MAD</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 shadow-sm">
                    <TrendingDown className="w-3 h-3" />
                    <span>4.2% optimized</span>
                </div>
            </div>

            {/* Stacked Horizontal Bar */}
            <div className="flex h-2.5 rounded-full overflow-hidden mb-5 relative z-10 bg-[var(--color-bg-elevated)] shrink-0 shadow-inner border border-[var(--color-border)]">
                {categories.map((cat, i) => {
                    const percent = (cat.amount / actualTotal) * 100;
                    return (
                        <motion.div
                            key={cat.name}
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                            className="h-full hover:brightness-110 transition-all cursor-pointer relative group/segment border-r border-[var(--color-bg-base)] last:border-0"
                            style={{ backgroundColor: ALLOCATION_COLORS[i % ALLOCATION_COLORS.length] }}
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/segment:opacity-100 bg-[var(--color-bg-elevated)] text-[var(--color-text-main)] text-[10px] px-2 py-1 rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-[var(--color-border)] whitespace-nowrap pointer-events-none transition-opacity z-50 font-medium">
                                {cat.name}: {percent.toFixed(1)}%
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Detailed Category List */}
            <div className="flex flex-col gap-1.5 relative z-10 overflow-y-auto pr-1 flex-1 min-h-0 custom-scrollbar">
                {categories.map((cat, i) => {
                    const Icon = getCategoryIcon(cat.name);
                    const percent = ((cat.amount / actualTotal) * 100).toFixed(1);
                    return (
                        <div key={cat.name} className="flex items-center justify-between group/item p-2 rounded-xl hover:bg-[var(--color-bg-elevated)] transition-all border border-transparent hover:border-[var(--color-border-hover)]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover/item:scale-105"
                                    style={{ backgroundColor: `${ALLOCATION_COLORS[i % ALLOCATION_COLORS.length]}15` }}
                                >
                                    <Icon className="w-4 h-4" style={{ color: ALLOCATION_COLORS[i % ALLOCATION_COLORS.length] }} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-semibold text-[var(--color-text-main)] transition-colors group-hover/item:text-[var(--color-gold)]">{cat.name}</span>
                                    <span className="text-[10px] text-[var(--color-text-muted)]">{percent}% of deployment</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[13px] font-bold text-[var(--color-text-main)]">
                                    {Number(cat.amount).toLocaleString()}
                                </div>
                                <div className="text-[10px] text-[var(--color-text-muted)] uppercase">
                                    MAD
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
