import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import AIInsightsCard from '@/components/dashboard/AIInsightsCard';
import BalanceCard from '@/components/dashboard/BalanceCard';
import EarningsCard from '@/components/dashboard/EarningsCard';
import TransactionsCard from '@/components/dashboard/TransactionsCard';
import SpendingCard from '@/components/dashboard/SpendingCard';
import OISPanel from '@/components/dashboard/OISPanel';

export default function Dashboard({ balance, totalSpending, transactions, earningsPercentage }) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-[var(--color-bg-base)] text-[var(--color-text-main)] font-sans antialiased selection:bg-[var(--color-gold)] selection:text-white transition-colors duration-0">
            <Head title="NeuroBank Dashboard" />
            
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                <Topbar />

                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 }
                        }
                    }}
                    className="flex-1 grid grid-cols-3 grid-rows-2 gap-3.5 p-4 overflow-y-auto"
                >
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                        <AIInsightsCard />
                    </motion.div>
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                        <BalanceCard balance={balance} />
                    </motion.div>
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                        <EarningsCard percentage={earningsPercentage} />
                    </motion.div>
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="col-span-2">
                        <TransactionsCard transactions={transactions} />
                    </motion.div>
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                        <SpendingCard total={totalSpending} />
                    </motion.div>
                </motion.div>
                
                <OISPanel />
            </div>
        </div>
    );
}
