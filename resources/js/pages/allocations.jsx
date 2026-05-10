import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import {
    TrendingDown,
    PieChart,
    Briefcase,
    Car,
    Gem,
    Coffee,
    Plane,
    Laptop,
    FileText,
    Smartphone,
    ArrowUpRight,
    BarChart3,
} from 'lucide-react';

const ALLOCATION_COLORS = [
    'var(--color-gold)',
    '#E5E4E2',
    'var(--color-bronze)',
    'var(--color-champagne)',
    '#A9A9A9',
];

const getCategoryIcon = (name) => {
    switch (name.toLowerCase()) {
        case 'luxury goods':
        case 'shopping':
        case 'clothing':
            return Gem;
        case 'fine dining':
        case 'dining':
        case 'food':
        case 'groceries':
            return Coffee;
        case 'private jets':
        case 'travel':
            return Plane;
        case 'tech':
        case 'electronics':
            return Laptop;
        case 'real estate':
        case 'bills':
        case 'utilities':
            return FileText;
        case 'philanthropy':
            return Briefcase;
        case 'transport':
        case 'vehicles':
            return Car;
        default:
            return Smartphone;
    }
};

export default function Allocations({ categories = [], totalAllocation = 0 }) {
    const [hoveredSegment, setHoveredSegment] = useState(null);
    const { t } = useTranslation();
    const { format, code } = useCurrency();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: 'easeOut' },
        },
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[var(--color-bg-base)] font-sans text-[var(--color-text-main)] antialiased transition-colors duration-0 selection:bg-[var(--color-gold)] selection:text-[var(--color-gold-fg)]">
            <Head title="OSCORP | Capital Allocations" />

            <Sidebar active="allocations" />

            <div className="relative flex flex-1 flex-col overflow-hidden">
                <Topbar />

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="custom-scrollbar relative z-10 flex-1 overflow-y-auto p-6 lg:p-10"
                >
                    <div className="mx-auto flex h-full max-w-6xl flex-col space-y-8">
                        {/* Header & Total Allocation */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col items-start justify-between gap-6 border-b border-[var(--color-border)] pb-8 md:flex-row md:items-end"
                        >
                            <div>
                                <div className="mb-4 flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-[var(--color-gold)]" />
                                    <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-main)]">
                                        {t(
                                            'allocations.title',
                                            'Capital Allocations',
                                        )}
                                    </h1>
                                </div>
                                <div className="mb-1 text-[11px] font-semibold tracking-widest text-[var(--color-text-muted)] uppercase">
                                    {t(
                                        'allocations.total_deployed',
                                        'Total Deployed Capital',
                                    )}
                                </div>
                                <div className="text-[40px] leading-none font-bold tracking-tight text-[var(--color-text-main)] md:text-[56px]">
                                    {format(totalAllocation)}{' '}
                                    <span className="ml-1 text-[18px] font-medium tracking-normal text-[var(--color-text-muted)]">
                                        {code}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2 text-[12px] font-bold text-[var(--color-text-main)] transition-all hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                                >
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                    {t(
                                        'allocations.manage',
                                        'Manage Portfolio',
                                    )}
                                </motion.button>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-400">
                                        <TrendingDown className="h-3.5 w-3.5" />
                                        <span>4.2% Optimization</span>
                                    </div>
                                    <span className="text-[12px] text-[var(--color-text-muted)]">
                                        Q3 Deployment
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Visualization Bar */}
                        <motion.div variants={itemVariants} className="w-full">
                            <div className="mb-3 flex items-center justify-between">
                                <span className="text-[13px] font-bold text-[var(--color-text-main)]">
                                    Portfolio Weighting
                                </span>
                                <span className="text-[12px] text-[var(--color-text-muted)]">
                                    {categories.length} Active Sectors
                                </span>
                            </div>

                            <div className="flex h-4 overflow-hidden rounded-full bg-[var(--color-bg-elevated)]">
                                {categories.map((cat, i) => {
                                    const percent =
                                        (cat.amount / totalAllocation) * 100;
                                    const isHovered = hoveredSegment === i;
                                    return (
                                        <motion.div
                                            key={cat.name}
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${percent}%`,
                                                opacity:
                                                    hoveredSegment === null ||
                                                    isHovered
                                                        ? 1
                                                        : 0.2,
                                            }}
                                            transition={{
                                                duration: 1,
                                                delay: i * 0.1,
                                                ease: 'easeOut',
                                            }}
                                            className="relative h-full cursor-pointer border-r border-[var(--color-bg-base)] transition-opacity duration-300 last:border-0"
                                            style={{
                                                backgroundColor:
                                                    ALLOCATION_COLORS[
                                                        i %
                                                            ALLOCATION_COLORS.length
                                                    ],
                                            }}
                                            onHoverStart={() =>
                                                setHoveredSegment(i)
                                            }
                                            onHoverEnd={() =>
                                                setHoveredSegment(null)
                                            }
                                        />
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Detailed Breakdown (Ledger Style) */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)]"
                        >
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 text-[11px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase">
                                <div className="col-span-5 pl-2 md:col-span-4">
                                    Sector
                                </div>
                                <div className="col-span-3 text-center md:col-span-4">
                                    Weight
                                </div>
                                <div className="col-span-4 pr-2 text-right">
                                    Deployed Capital
                                </div>
                            </div>

                            {/* Table Body */}
                            <div className="custom-scrollbar flex-1 overflow-y-auto">
                                {categories.map((cat, i) => {
                                    const Icon = getCategoryIcon(cat.name);
                                    const percent = (
                                        (cat.amount / totalAllocation) *
                                        100
                                    ).toFixed(1);
                                    const isHovered = hoveredSegment === i;
                                    const color =
                                        ALLOCATION_COLORS[
                                            i % ALLOCATION_COLORS.length
                                        ];

                                    return (
                                        <div
                                            key={cat.name}
                                            className="grid cursor-default grid-cols-12 items-center gap-4 border-b border-[var(--color-border)]/50 p-4 transition-colors duration-200 last:border-0"
                                            style={{
                                                backgroundColor: isHovered
                                                    ? 'var(--color-bg-elevated)'
                                                    : 'transparent',
                                            }}
                                            onMouseEnter={() =>
                                                setHoveredSegment(i)
                                            }
                                            onMouseLeave={() =>
                                                setHoveredSegment(null)
                                            }
                                        >
                                            {/* Sector Column */}
                                            <div className="col-span-5 flex items-center gap-4 pl-2 md:col-span-4">
                                                <div
                                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-300"
                                                    style={{
                                                        backgroundColor:
                                                            isHovered
                                                                ? color
                                                                : 'var(--color-bg-elevated)',
                                                    }}
                                                >
                                                    <Icon
                                                        className="h-4 w-4"
                                                        style={{
                                                            color: isHovered
                                                                ? '#000'
                                                                : color,
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-[14px] font-bold text-[var(--color-text-main)]">
                                                    {cat.name}
                                                </span>
                                            </div>

                                            {/* Weight Column */}
                                            <div className="col-span-3 flex flex-col items-center justify-center md:col-span-4">
                                                <span className="text-[13px] font-medium text-[var(--color-text-main)]">
                                                    {percent}%
                                                </span>
                                            </div>

                                            {/* Amount Column */}
                                            <div className="col-span-4 flex flex-col items-end pr-2">
                                                <span className="text-[15px] font-bold text-[var(--color-text-main)]">
                                                    {Number(
                                                        cat.amount,
                                                    ).toLocaleString()}
                                                </span>
                                                <span className="mt-0.5 text-[10px] font-semibold text-[var(--color-text-muted)]">
                                                    {code}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}

                                {categories.length === 0 && (
                                    <div className="p-10 text-center text-[14px] text-[var(--color-text-muted)]">
                                        No active allocations found in
                                        portfolio.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
