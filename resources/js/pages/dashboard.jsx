import { Head } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';
import { motion } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import AIInsightsCard from '@/components/dashboard/AIInsightsCard';
import BalanceCard from '@/components/dashboard/BalanceCard';
import EarningsCard from '@/components/dashboard/EarningsCard';
import TransactionsCard from '@/components/dashboard/TransactionsCard';
import CapitalAllocationCard from '@/components/dashboard/CapitalAllocationCard';
import OISPanel from '@/components/dashboard/OISPanel';

const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, delay: i * 0.07, ease: 'easeOut' }
    })
};

export default function Dashboard({ transactions, activeGoal }) {
    const { t } = useTranslation();

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[var(--color-bg-base)] text-[var(--color-text-main)] font-sans antialiased">
            <Head title={t('dashboard.title')} />

            {/* Ambient glows */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[60%] bg-[var(--color-gold)] opacity-[0.025] rounded-full blur-[140px]" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[50%] bg-blue-600 opacity-[0.02] rounded-full blur-[120px]" />
            </div>

            <Sidebar active="dashboard" />

            <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative z-10">
                <Topbar />

                {/* ── Desktop: strict 2-row grid, no page scroll ─────────── */}
                <div className="hidden lg:flex flex-1 overflow-hidden p-4 min-h-0">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        className="w-full h-full grid gap-4"
                        style={{
                            gridTemplateColumns: '1fr 1fr 1fr',
                            gridTemplateRows: '1fr 1.55fr',
                        }}
                    >
                        <motion.div custom={0} variants={cardVariants} className="min-h-0 overflow-hidden">
                            <AIInsightsCard />
                        </motion.div>
                        <motion.div custom={1} variants={cardVariants} className="min-h-0 overflow-hidden">
                            <BalanceCard />
                        </motion.div>
                        <motion.div custom={2} variants={cardVariants} className="min-h-0 overflow-hidden">
                            <EarningsCard goal={activeGoal} />
                        </motion.div>
                        <motion.div custom={3} variants={cardVariants} className="col-span-2 min-h-0 overflow-hidden">
                            <TransactionsCard transactions={transactions} />
                        </motion.div>
                        <motion.div custom={4} variants={cardVariants} className="min-h-0 overflow-hidden">
                            <CapitalAllocationCard />
                        </motion.div>
                    </motion.div>
                </div>

                {/* ── Mobile / Tablet: scrollable single column ───────────── */}
                <div className="flex lg:hidden flex-1 overflow-y-auto p-3 pb-24 custom-scrollbar">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        className="w-full flex flex-col gap-3"
                    >
                        <motion.div custom={0} variants={cardVariants} className="h-[200px]">
                            <BalanceCard />
                        </motion.div>
                        <motion.div custom={1} variants={cardVariants} className="h-[180px]">
                            <AIInsightsCard />
                        </motion.div>
                        <motion.div custom={2} variants={cardVariants} className="h-[220px]">
                            <EarningsCard goal={activeGoal} />
                        </motion.div>
                        <motion.div custom={3} variants={cardVariants} className="h-[380px]">
                            <TransactionsCard transactions={transactions} />
                        </motion.div>
                        <motion.div custom={4} variants={cardVariants} className="h-[340px]">
                            <CapitalAllocationCard />
                        </motion.div>
                    </motion.div>
                </div>

                <OISPanel />
            </div>
        </div>
    );
}
