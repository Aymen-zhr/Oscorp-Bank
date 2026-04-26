import { ArrowUpRight, Filter, ArrowDownLeft, Calendar, DollarSign, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';

// Map merchant names → domain for Clearbit Logo API
const MERCHANT_DOMAINS = {
    // Streaming
    'Netflix':          'netflix.com',
    'Spotify':          'spotify.com',
    'Disney+':          'disneyplus.com',
    'Disney Plus':      'disneyplus.com',
    'HBO':              'hbomax.com',
    'Apple TV':         'apple.com',
    'YouTube':          'youtube.com',
    'Twitch':           'twitch.tv',
    // Gaming
    'Steam':            'steampowered.com',
    'PlayStation':      'playstation.com',
    'Xbox':             'xbox.com',
    'Epic Games':       'epicgames.com',
    // Food & Delivery
    'Glovo':            'glovoapp.com',
    'Uber Eats':        'ubereats.com',
    'Deliveroo':        'deliveroo.com',
    'Dominos':          'dominos.com',
    'McDonald\'s':      'mcdonalds.com',
    'Starbucks':        'starbucks.com',
    'KFC':              'kfc.com',
    // Retail / Shopping
    'Amazon':           'amazon.com',
    'Zara':             'zara.com',
    'H&M':              'hm.com',
    'Nike':             'nike.com',
    'Adidas':           'adidas.com',
    'IKEA':             'ikea.com',
    'Apple':            'apple.com',
    // Transport
    'Uber':             'uber.com',
    'Bolt':             'bolt.eu',
    'InDrive':          'indrive.com',
    // Finance
    'PayPal':           'paypal.com',
    'Wise':             'wise.com',
    // Utilities / Telecom
    'Maroc Telecom':    'iam.ma',
    'Orange':           'orange.com',
    'Inwi':             'inwi.ma',
};

function MerchantLogo({ merchant, color }) {
    const [imgFailed, setImgFailed] = useState(false);
    const logoKey = import.meta.env.VITE_LOGO_DEV_KEY;

    // Try to find a matching domain (case-insensitive partial match)
    const domain = Object.entries(MERCHANT_DOMAINS).find(
        ([key]) => merchant.toLowerCase().includes(key.toLowerCase())
    )?.[1];

    if (domain && !imgFailed && logoKey) {
        return (
            <div
                className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shrink-0 bg-white"
                style={{ border: `1px solid ${color ?? '#3b82f6'}22` }}
            >
                <img
                    src={`https://img.logo.dev/${domain}?token=${logoKey}&size=60&format=png`}
                    alt={merchant}
                    className="w-9 h-9 object-cover"
                    onError={() => setImgFailed(true)}
                />
            </div>
        );
    }

    // Fallback: letter avatar
    return (
        <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-bold shrink-0"
            style={{
                backgroundColor: `${color ?? '#3b82f6'}22`,
                color: color ?? '#3b82f6',
                border: `1px solid ${color ?? '#3b82f6'}33`
            }}
        >
            {merchant.charAt(0).toUpperCase()}
        </div>
    );
}

export default function TransactionsCard({ transactions }) {
    const [sortMode, setSortMode] = useState('latest');
    const [showSortMenu, setShowSortMenu] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric' });
    };

    const sortedTransactions = useMemo(() => {
        if (!transactions) return [];
        return [...transactions].sort((a, b) => {
            const dateA = new Date(a.transacted_at ?? a.created_at).getTime();
            const dateB = new Date(b.transacted_at ?? b.created_at).getTime();
            const amountA = Number(Math.abs(a.amount));
            const amountB = Number(Math.abs(b.amount));

            switch (sortMode) {
                case 'oldest': return dateA - dateB;
                case 'highest': return amountB - amountA;
                case 'lowest': return amountA - amountB;
                case 'latest':
                default:
                    return dateB - dateA;
            }
        });
    }, [transactions, sortMode]);

    const sortOptions = [
        { id: 'latest', label: 'Newest First', icon: Calendar },
        { id: 'oldest', label: 'Oldest First', icon: Calendar },
        { id: 'highest', label: 'Highest Amount', icon: DollarSign },
        { id: 'lowest', label: 'Lowest Amount', icon: DollarSign },
    ];

    return (
        <div className="h-full w-full rounded-2xl p-5 relative overflow-hidden transition-all duration-300 group flex flex-col"
            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', backdropFilter: 'blur(20px)' }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold-bg)] to-transparent pointer-events-none opacity-50" />
            
            <div className="flex items-center justify-between mb-4 relative z-20 shrink-0">
                <div>
                    <span className="text-[15px] font-bold text-[var(--color-gold)]">Ledger Activity</span>
                    <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">Recent financial movements</div>
                </div>
                <div className="flex gap-2 relative">
                    <button 
                        onClick={() => setShowSortMenu(!showSortMenu)}
                        className={`px-2 h-8 rounded-xl flex items-center gap-1.5 text-[11px] font-semibold transition-all border ${showSortMenu ? 'bg-[var(--color-bg-elevated)] border-[var(--color-border)] text-[var(--color-text-main)]' : 'bg-transparent border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-hover)]'}`}
                    >
                        <Filter className="w-3 h-3" />
                        Sort
                        <ChevronDown className={`w-3 h-3 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                        {showSortMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 top-10 w-40 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl shadow-xl z-50 p-1.5 backdrop-blur-xl"
                                >
                                    {sortOptions.map(option => {
                                        const Icon = option.icon;
                                        const isActive = sortMode === option.id;
                                        return (
                                            <button
                                                key={option.id}
                                                onClick={() => { setSortMode(option.id); setShowSortMenu(false); }}
                                                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[11px] font-semibold transition-all ${isActive ? 'bg-[var(--color-gold-bg)] text-[var(--color-gold)]' : 'text-[var(--color-text-main)] hover:bg-[var(--color-bg-base)]'}`}
                                            >
                                                <Icon className="w-3.5 h-3.5" />
                                                {option.label}
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* List */}
            <div className="flex flex-col gap-1 relative z-10 overflow-y-auto max-h-[calc(100%-50px)] pr-2">
                {sortedTransactions && sortedTransactions.length > 0 ? sortedTransactions.map((tx, i) => {
                    const isCredit = tx.type === 'credit';
                    return (
                        <motion.div
                            key={tx.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.06 }}
                            className="flex items-center gap-3 py-2.5 px-2 rounded-xl transition-all hover:bg-[var(--color-bg-elevated)] cursor-default"
                        >
                            <MerchantLogo merchant={tx.merchant} color="var(--color-gold)" />
                            <div className="text-[13px] font-semibold text-[var(--color-text-main)] flex-1 truncate">{tx.merchant}</div>
                            <div className="text-[11px] text-[var(--color-text-muted)] flex-1 hidden sm:block font-mono">
                                ···· {tx.card_last4 ?? '0000'}
                            </div>
                            <div className="text-[11px] text-[var(--color-text-muted)] flex-1 hidden md:block">
                                {formatDate(tx.transacted_at ?? tx.created_at)}
                            </div>
                            
                            <div className="flex items-center gap-2 min-w-[90px] justify-end">
                                <span className={`text-[13px] font-bold ${isCredit ? 'text-[var(--color-gold-dark)]' : 'text-[var(--color-text-main)]'}`}>
                                    {isCredit ? '+' : '-'}{Number(Math.abs(tx.amount)).toFixed(2)} MAD
                                </span>
                                {isCredit ? (
                                    <ArrowDownLeft className="w-3.5 h-3.5 text-[var(--color-gold)]" />
                                ) : (
                                    <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                                )}
                            </div>
                        </motion.div>
                    )
                }) : (
                    <div className="py-10 text-center text-[var(--color-text-muted)] text-[13px]">
                        No transactions yet. Issue a directive to O.I.S. to transfer funds.
                    </div>
                )}
            </div>
        </div>
    );
}
