import { ArrowUpRight, Plane, Car, Building2, Heart, Palmtree, ShoppingBag, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePage, Link } from '@inertiajs/react';
import { useTranslation } from '../../hooks/useTranslation';
import { useCurrency } from '../../hooks/useCurrency';

const ICON_MAP = {
    'Real Estate': Building2,
    'Vehicles': Car,
    'Private Jets': Plane,
    'Philanthropy': Heart,
    'Travel': Palmtree,
    'Luxury Goods': ShoppingBag,
    'Liquid Reserves': ArrowUpRight,
    'Strategic Goals': Building2,
    'Operating Flow': TrendingDown,
};

const COLORS = ['#D4AF37', '#FFFFFF', '#B8860B', '#E5E4E2', '#A9A9A9'];

export default function CapitalAllocationCard() {
    const { t } = useTranslation();
    const { format, code } = useCurrency();
    const { props } = usePage();

    const rawAllocations = props.capital_allocation ?? [];
    const totalCapital = props.total_capital ?? 0;

    // Use the allocations from props, or fallback to demo assets if empty to match user's visual request
    const allocations = rawAllocations.length > 0 ? rawAllocations : [
        { name: 'Real Estate', amount: 120000, color: '#D4AF37' },
        { name: 'Vehicles', amount: 55000, color: '#FFFFFF' },
        { name: 'Private Jets', amount: 34000, color: '#B8860B' },
        { name: 'Luxury Goods', amount: 8500, color: '#E5E4E2' },
    ];
    
    const displayTotal = allocations.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="h-full w-full rounded-[24px] p-6 relative overflow-hidden flex flex-col"
            style={{ background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.08)' }}
        >
            {/* Header Area */}
            <div className="flex justify-between items-start mb-1 shrink-0">
                <div>
                    <h2 className="text-[20px] font-black text-[var(--color-gold)] tracking-tight leading-none">
                        Capital Allocation
                    </h2>
                    <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mt-2">
                        DEPLOYMENT
                    </div>
                </div>
                <Link href="/allocations">
                    <ArrowUpRight className="w-5 h-5 text-white/20 hover:text-white transition-colors" />
                </Link>
            </div>

            {/* Total Balance Row */}
            <div className="flex items-center justify-between mt-3 mb-6 shrink-0">
                <div className="flex items-baseline gap-2">
                    <span className="text-[32px] font-black text-white tracking-tighter leading-none">
                        {format(displayTotal).split(' ')[0]}
                    </span>
                    <span className="text-[20px] font-black text-white tracking-tight">{code}</span>
                    <span className="text-[12px] font-bold text-white/20 ml-1">{code}</span>
                </div>
                
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#06331D] border border-[#0A5230]">
                    <TrendingDown className="w-3 h-3 text-[#34D399] rotate-180" />
                    <span className="text-[11px] font-bold text-[#34D399]">4.2% optimized</span>
                </div>
            </div>

            {/* Segmented Progress Bar */}
            <div className="h-[6px] w-full bg-white/5 rounded-full overflow-hidden flex gap-[2px] mb-8 shrink-0">
                {allocations.map((item, i) => (
                    <motion.div
                        key={item.name}
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.amount / displayTotal) * 100}%` }}
                        transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: 'circOut' }}
                        className="h-full"
                        style={{ backgroundColor: item.color || COLORS[i % COLORS.length] }}
                    />
                ))}
            </div>

            {/* Allocation List */}
            <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar pr-1">
                <div className="flex flex-col gap-6">
                    {allocations.map((item, i) => {
                        const Icon = ICON_MAP[item.name] || Building2;
                        const pct = ((item.amount / displayTotal) * 100).toFixed(1);
                        
                        return (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className="flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                        <Icon className="w-5 h-5 text-[var(--color-gold)]" />
                                    </div>
                                    <div>
                                        <div className="text-[15px] font-black text-white leading-tight">
                                            {item.name}
                                        </div>
                                        <div className="text-[11px] font-bold text-white/30 mt-0.5">
                                            {pct}%
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[15px] font-black text-white leading-tight">
                                        {format(item.amount).split(' ')[0]} {code}
                                    </div>
                                    <div className="text-[10px] font-bold text-white/20 mt-0.5 uppercase tracking-widest">
                                        {code}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Glow */}
            <div className="absolute -bottom-10 inset-x-0 h-20 bg-gradient-to-t from-[var(--color-gold)]/5 to-transparent pointer-events-none" />
        </div>
    );
}
