import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { TrendingDown, PieChart, Briefcase, Car, Gem, Coffee, Plane, Laptop, FileText, Smartphone, ArrowUpRight, BarChart3 } from 'lucide-react';

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

export default function Allocations({ categories = [], totalAllocation = 0 }) {
    const [hoveredSegment, setHoveredSegment] = useState(null);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[var(--color-bg-base)] text-[var(--color-text-main)] font-sans antialiased selection:bg-[var(--color-gold)] selection:text-white transition-colors duration-0">
            <Head title="OSCORP | Capital Allocations" />
            
            <Sidebar active="allocations" />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                <Topbar />

                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar relative z-10"
                >
                    <div className="max-w-6xl mx-auto flex flex-col h-full space-y-8">
                        
                        {/* Header & Total Allocation */}
                        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[var(--color-border)] pb-8">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <BarChart3 className="w-5 h-5 text-[var(--color-gold)]" />
                                    <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-main)]">Capital Allocations</h1>
                                </div>
                                <div className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-widest font-semibold mb-1">Total Deployed Capital</div>
                                <div className="text-[40px] md:text-[56px] font-bold tracking-tight text-[var(--color-text-main)] leading-none">
                                    {Number(totalAllocation).toLocaleString()} <span className="text-[18px] font-medium text-[var(--color-text-muted)] tracking-normal ml-1">MAD</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-3">
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-4 py-2 rounded-lg text-[12px] font-bold text-[var(--color-text-main)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all flex items-center gap-2"
                                >
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                    Manage Portfolio
                                </motion.button>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-400">
                                        <TrendingDown className="w-3.5 h-3.5" />
                                        <span>4.2% Optimization</span>
                                    </div>
                                    <span className="text-[12px] text-[var(--color-text-muted)]">Q3 Deployment</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Visualization Bar */}
                        <motion.div variants={itemVariants} className="w-full">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[13px] font-bold text-[var(--color-text-main)]">Portfolio Weighting</span>
                                <span className="text-[12px] text-[var(--color-text-muted)]">{categories.length} Active Sectors</span>
                            </div>
                            
                            <div className="flex h-4 rounded-full overflow-hidden bg-[var(--color-bg-elevated)]">
                                {categories.map((cat, i) => {
                                    const percent = (cat.amount / totalAllocation) * 100;
                                    const isHovered = hoveredSegment === i;
                                    return (
                                        <motion.div
                                            key={cat.name}
                                            initial={{ width: 0 }}
                                            animate={{ 
                                                width: `${percent}%`,
                                                opacity: hoveredSegment === null || isHovered ? 1 : 0.2,
                                            }}
                                            transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                                            className="h-full cursor-pointer relative transition-opacity duration-300 border-r border-[var(--color-bg-base)] last:border-0"
                                            style={{ backgroundColor: ALLOCATION_COLORS[i % ALLOCATION_COLORS.length] }}
                                            onHoverStart={() => setHoveredSegment(i)}
                                            onHoverEnd={() => setHoveredSegment(null)}
                                        />
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Detailed Breakdown (Ledger Style) */}
                        <motion.div variants={itemVariants} className="flex-1 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden flex flex-col">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 p-4 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                                <div className="col-span-5 md:col-span-4 pl-2">Sector</div>
                                <div className="col-span-3 md:col-span-4 text-center">Weight</div>
                                <div className="col-span-4 text-right pr-2">Deployed Capital</div>
                            </div>

                            {/* Table Body */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {categories.map((cat, i) => {
                                    const Icon = getCategoryIcon(cat.name);
                                    const percent = ((cat.amount / totalAllocation) * 100).toFixed(1);
                                    const isHovered = hoveredSegment === i;
                                    const color = ALLOCATION_COLORS[i % ALLOCATION_COLORS.length];
                                    
                                    return (
                                        <div
                                            key={cat.name}
                                            className="grid grid-cols-12 gap-4 p-4 items-center border-b border-[var(--color-border)]/50 last:border-0 transition-colors duration-200 cursor-default"
                                            style={{ backgroundColor: isHovered ? 'var(--color-bg-elevated)' : 'transparent' }}
                                            onMouseEnter={() => setHoveredSegment(i)}
                                            onMouseLeave={() => setHoveredSegment(null)}
                                        >
                                            {/* Sector Column */}
                                            <div className="col-span-5 md:col-span-4 flex items-center gap-4 pl-2">
                                                <div 
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300"
                                                    style={{ backgroundColor: isHovered ? color : 'var(--color-bg-elevated)' }}
                                                >
                                                    <Icon className="w-4 h-4" style={{ color: isHovered ? '#000' : color }} />
                                                </div>
                                                <span className="text-[14px] font-bold text-[var(--color-text-main)]">{cat.name}</span>
                                            </div>

                                            {/* Weight Column */}
                                            <div className="col-span-3 md:col-span-4 flex flex-col items-center justify-center">
                                                <span className="text-[13px] font-medium text-[var(--color-text-main)]">{percent}%</span>
                                            </div>

                                            {/* Amount Column */}
                                            <div className="col-span-4 flex flex-col items-end pr-2">
                                                <span className="text-[15px] font-bold text-[var(--color-text-main)]">
                                                    {Number(cat.amount).toLocaleString()}
                                                </span>
                                                <span className="text-[10px] text-[var(--color-text-muted)] font-semibold mt-0.5">MAD</span>
                                            </div>
                                        </div>
                                    );
                                })}
                                
                                {categories.length === 0 && (
                                    <div className="p-10 text-center text-[var(--color-text-muted)] text-[14px]">
                                        No active allocations found in portfolio.
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
