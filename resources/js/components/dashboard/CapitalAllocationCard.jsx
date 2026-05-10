import {
    ArrowUpRight,
    Plane,
    Car,
    Building2,
    Heart,
    Palmtree,
    ShoppingBag,
    TrendingDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePage, Link } from '@inertiajs/react';
import { useTranslation } from '../../hooks/useTranslation';
import { useCurrency } from '../../hooks/useCurrency';

const ICON_MAP = {
    'Real Estate': Building2,
    Vehicles: Car,
    'Private Jets': Plane,
    Philanthropy: Heart,
    Travel: Palmtree,
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
    const allocations =
        rawAllocations.length > 0
            ? rawAllocations
            : [
                  { name: 'Real Estate', amount: 120000, color: '#D4AF37' },
                  { name: 'Vehicles', amount: 55000, color: '#FFFFFF' },
                  { name: 'Private Jets', amount: 34000, color: '#B8860B' },
                  { name: 'Luxury Goods', amount: 8500, color: '#E5E4E2' },
              ];

    const displayTotal = allocations.reduce(
        (sum, item) => sum + item.amount,
        0,
    );

    return (
        <div
            className="relative flex h-full w-full flex-col overflow-hidden rounded-[24px] p-6"
            style={{
                background: 'var(--color-card-gradient-from)',
                border: '1px solid var(--color-border)',
            }}
        >
            {/* Header Area */}
            <div className="mb-1 flex shrink-0 items-start justify-between">
                <div>
                    <h2 className="text-[20px] leading-none font-black tracking-tight text-[var(--color-gold)]">
                        Capital Allocation
                    </h2>
                    <div
                        className="mt-2 text-[10px] font-black tracking-[0.2em] text-[var(--color-text-muted)] uppercase"
                        style={{ opacity: 0.3 }}
                    >
                        DEPLOYMENT
                    </div>
                </div>
                <Link href="/allocations">
                    <ArrowUpRight className="h-5 w-5 text-[var(--color-text-muted)]/30 transition-colors hover:text-[var(--color-text-main)]" />
                </Link>
            </div>

            {/* Total Balance Row */}
            <div className="mt-3 mb-6 flex shrink-0 items-center justify-between">
                <div className="flex items-baseline gap-2">
                    <span className="text-[32px] leading-none font-black tracking-tighter text-[var(--color-text-main)]">
                        {format(displayTotal).split(' ')[0]}
                    </span>
                    <span className="text-[20px] font-black tracking-tight text-[var(--color-text-main)]">
                        {code}
                    </span>
                    <span
                        className="ml-1 text-[12px] font-bold text-[var(--color-text-muted)]"
                        style={{ opacity: 0.3 }}
                    >
                        {code}
                    </span>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg border border-[#0A5230] bg-[#06331D] px-2.5 py-1">
                    <TrendingDown className="h-3 w-3 rotate-180 text-[#34D399]" />
                    <span className="text-[11px] font-bold text-[#34D399]">
                        4.2% optimized
                    </span>
                </div>
            </div>

            {/* Segmented Progress Bar */}
            <div
                className="mb-8 flex h-[6px] w-full shrink-0 gap-[2px] overflow-hidden rounded-full bg-[var(--color-bg-elevated)]"
                style={{ opacity: 0.2 }}
            >
                {allocations.map((item, i) => (
                    <motion.div
                        key={item.name}
                        initial={{ width: 0 }}
                        animate={{
                            width: `${(item.amount / displayTotal) * 100}%`,
                        }}
                        transition={{
                            duration: 1,
                            delay: 0.2 + i * 0.1,
                            ease: 'circOut',
                        }}
                        className="h-full"
                        style={{
                            backgroundColor:
                                item.color || COLORS[i % COLORS.length],
                        }}
                    />
                ))}
            </div>

            {/* Allocation List */}
            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto pr-1">
                <div className="flex flex-col gap-6">
                    {allocations.map((item, i) => {
                        const Icon = ICON_MAP[item.name] || Building2;
                        const pct = (
                            (item.amount / displayTotal) *
                            100
                        ).toFixed(1);

                        return (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className="group flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-bg-elevated)]"
                                        style={{ opacity: 0.2 }}
                                    >
                                        <Icon className="h-5 w-5 text-[var(--color-gold)]" />
                                    </div>
                                    <div>
                                        <div className="text-[15px] leading-tight font-black text-[var(--color-text-main)]">
                                            {item.name}
                                        </div>
                                        <div
                                            className="mt-0.5 text-[11px] font-bold text-[var(--color-text-muted)]"
                                            style={{ opacity: 0.3 }}
                                        >
                                            {pct}%
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[15px] leading-tight font-black text-[var(--color-text-main)]">
                                        {format(item.amount).split(' ')[0]}{' '}
                                        {code}
                                    </div>
                                    <div
                                        className="mt-0.5 text-[10px] font-bold tracking-widest text-[var(--color-text-muted)] uppercase"
                                        style={{ opacity: 0.2 }}
                                    >
                                        {code}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Glow */}
            <div className="pointer-events-none absolute inset-x-0 -bottom-10 h-20 bg-gradient-to-t from-[var(--color-gold)]/5 to-transparent" />
        </div>
    );
}
