import { motion } from 'framer-motion';

import { useState } from 'react';

const LOGO_KEY = 'pk_binMfKfXSiOiYpfo3CyL2w';

const DOMAIN_MAP = {
    // Tech / Subscriptions
    apple: 'apple.com', netflix: 'netflix.com', spotify: 'spotify.com',
    amazon: 'amazon.com', adobe: 'adobe.com', github: 'github.com',
    microsoft: 'microsoft.com', google: 'google.com', playstation: 'playstation.com',
    zoom: 'zoom.us', slack: 'slack.com', paypal: 'paypal.com',
    steam: 'steampowered.com', airbnb: 'airbnb.com', uber: 'uber.com',
    // Food & retail
    mcdonald: 'mcdonalds.com', starbucks: 'starbucks.com', kfc: 'kfc.com',
    'pizza hut': 'pizzahut.com', domino: 'dominos.com',
    carrefour: 'carrefour.com', zara: 'zara.com', 'h&m': 'hm.com',
    jumia: 'jumia.ma',
    // Morocco
    marjane: 'marjane.ma', inwi: 'inwi.ma',
    'maroc telecom': 'iam.ma', orange: 'orange.ma', lydec: 'lydec.ma',
    bmce: 'banqueofafrica.com', attijariwafa: 'attijariwafabank.com',
    cih: 'cihbank.com', wafacash: 'wafacash.ma',
};

function getDomain(merchant) {
    if (!merchant) return null;
    const lower = merchant.toLowerCase();
    for (const [key, domain] of Object.entries(DOMAIN_MAP)) {
        if (lower.includes(key)) return domain;
    }
    return null;
}

function TransactionItem({ tx, index }) {
    const [failed, setFailed] = useState(false);
    const domain = getDomain(tx.merchant);
    const color = tx.logo_color || (tx.type === 'credit' ? '#10B981' : '#EF4444');
    
    return (
        <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--color-bg-elevated)] transition-colors"
        >
            <div className="flex items-center gap-3">
                <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden" 
                    style={{ 
                        background: `linear-gradient(135deg, ${color}28, ${color}0f)`, 
                        border: `1.5px solid ${color}40` 
                    }}
                >
                    {domain && !failed ? (
                        <img
                            src={`https://img.logo.dev/${domain}?token=${LOGO_KEY}&size=40&format=png`}
                            alt={tx.merchant}
                            className="w-full h-full object-contain p-1.5"
                            onError={() => setFailed(true)}
                        />
                    ) : (
                        <span style={{ color, fontWeight: 700, fontSize: '14px' }}>
                            {(tx.merchant || '?').charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
                <div>
                    <div className="text-[13px] font-medium text-[var(--color-text-main)]">{tx.merchant}</div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">{tx.category}</div>
                </div>
            </div>
            <div className={`text-[14px] font-bold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-red-400'}`}>
                {tx.type === 'credit' ? '+' : '-'}{Math.abs(Number(tx.amount)).toLocaleString()}
            </div>
        </motion.div>
    );
}

export default function TransactionsCard({ transactions }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full w-full rounded-2xl p-5 relative overflow-hidden flex flex-col"
            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-gold-bg)' }}>
                        <svg className="w-4 h-4" style={{ color: 'var(--color-gold)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-[14px] font-semibold text-[var(--color-text-main)]">Recent Activity</div>
                        <div className="text-[10px] text-[var(--color-text-muted)]">Latest transactions</div>
                    </div>
                </div>
                <a href="/transactions" className="text-[11px] text-[var(--color-gold)] hover:underline">View All</a>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
                {transactions?.length > 0 ? (
                    transactions.slice(0, 6).map((tx, i) => (
                        <TransactionItem key={tx.id || i} tx={tx} index={i} />
                    ))
                ) : (
                    <div className="flex-1 flex items-center justify-center py-8">
                        <div className="text-center">
                            <div className="text-[14px] text-[var(--color-text-muted)]">No transactions yet</div>
                            <div className="text-[11px] text-[var(--color-text-muted)]">Your activity will appear here</div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}