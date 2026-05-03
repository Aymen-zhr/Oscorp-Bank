import { Head } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';
import { motion } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import AIInsightsCard from '@/components/dashboard/AIInsightsCard';
import BalanceCard from '@/components/dashboard/BalanceCard';
import EarningsCard from '@/components/dashboard/EarningsCard';
import TransactionsCard from '@/components/dashboard/TransactionsCard';
import SpendingCard from '@/components/dashboard/SpendingCard';
import OISPanel from '@/components/dashboard/OISPanel';

const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' }
    })
};

export default function Dashboard({ balance, totalSpending, transactions, activeGoal }) {
    const { t, locale } = useTranslation();
    return (
        <div className="flex h-screen w-full overflow-hidden bg-[var(--color-bg-base)] text-[var(--color-text-main)] font-sans antialiased selection:bg-[var(--color-gold)] selection:text-white">
            <Head title={t('dashboard.title')} />

            <Sidebar active="dashboard" />

            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <Topbar />

                {/* Main content — fixed height, no scroll */}
                <div className="flex-1 overflow-hidden p-3 lg:p-4 min-h-0">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        className="h-full grid grid-rows-2 grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4"
                        style={{ gridTemplateRows: '1fr 1fr' }}
                    >
                        {/* Row 1 — 3 top cards */}
                        <motion.div custom={0} variants={cardVariants}>
                            <AIInsightsCard />
                        </motion.div>

                        <motion.div custom={1} variants={cardVariants}>
                            <BalanceCard balance={balance} />
                        </motion.div>

                        <motion.div custom={2} variants={cardVariants}>
                            <EarningsCard goal={activeGoal} />
                        </motion.div>

                        {/* Row 2 — Transactions (2/3) + Spending (1/3) */}
                        <motion.div custom={3} variants={cardVariants} className="lg:col-span-2">
                            <TransactionsCard transactions={transactions} />
                        </motion.div>

                        <motion.div custom={4} variants={cardVariants}>
                            <SpendingCard total={totalSpending} />
                        </motion.div>
                    </motion.div>
                </div>

                <OISPanel />
            </div>
        </div>
    );
}
