import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

const LOGO_KEY = 'pk_binMfKfXSiOiYpfo3CyL2w';

const DOMAIN_MAP = {
    apple: 'apple.com', netflix: 'netflix.com', spotify: 'spotify.com',
    amazon: 'amazon.com', adobe: 'adobe.com', github: 'github.com',
    microsoft: 'microsoft.com', google: 'google.com', playstation: 'playstation.com',
    zoom: 'zoom.us', slack: 'slack.com', paypal: 'paypal.com',
    steam: 'steampowered.com', airbnb: 'airbnb.com', uber: 'uber.com',
    mcdonald: 'mcdonalds.com', starbucks: 'starbucks.com', kfc: 'kfc.com',
    'pizza hut': 'pizzahut.com', domino: 'dominos.com',
    carrefour: 'carrefour.com', zara: 'zara.com', 'h&m': 'hm.com',
    jumia: 'jumia.ma', marjane: 'marjane.ma', inwi: 'inwi.ma',
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
    const [isHovered, setIsHovered] = useState(false);
    const domain = getDomain(tx.merchant);
    const color = tx.logo_color || (tx.type === 'credit' ? '#10B981' : '#EF4444');

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-2 rounded-xl transition-colors cursor-default"
            style={{
                background: isHovered ? 'var(--color-bg-elevated)' : 'transparent',
                border: isHovered ? '1px solid var(--color-border)' : '1px solid transparent',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center gap-2.5">
                <motion.div
                    className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden shrink-0"
                    style={{
                        background: `linear-gradient(135deg, ${color}20, ${color}08)`,
                        border: `1px solid ${color}30`,
                    }}
                >
                    {domain && !failed ? (
                        <img
                            src={`https://img.logo.dev/${domain}?token=${LOGO_KEY}&size=32&format=png`}
                            alt={tx.merchant}
                            className="w-full h-full object-contain p-1"
                            onError={() => setFailed(true)}
                        />
                    ) : (
                        <span style={{ color, fontWeight: 700, fontSize: '12px' }}>
                            {(tx.merchant || '?').charAt(0).toUpperCase()}
                        </span>
                    )}
                </motion.div>
                <div>
                    <div className="text-[12px] font-semibold text-[var(--color-text-main)] leading-none mb-0.5">{tx.merchant}</div>
                    <div className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-tight">{tx.category}</div>
                </div>
            </div>
            <div className={`text-[13px] font-bold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-red-400'}`}>
                {tx.type === 'credit' ? '+' : '-'}{Math.abs(Number(tx.amount)).toLocaleString()}
            </div>
        </motion.div>
    );
}

export default function TransactionsCard({ transactions }) {
    const { t } = useTranslation();
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full w-full rounded-2xl p-4 relative overflow-hidden flex flex-col"
            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
        >
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold)]/40 to-transparent z-20" />

            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-gold-bg)' }}>
                        <svg className="w-3.5 h-3.5" style={{ color: 'var(--color-gold)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-[14px] font-semibold text-[var(--color-text-main)]">{t('dashboard.recent_activity')}</div>
                        <div className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-tighter">{t('dashboard.latest_movements')}</div>
                    </div>
                </div>
                <motion.a
                    href="/transactions"
                    className="text-[10px] font-bold text-[var(--color-gold)] uppercase tracking-wider hover:underline"
                    whileHover={{ x: 2 }}
                >
                    {t('dashboard.all')}
                </motion.a>
            </div>

            <div className="flex-1 overflow-hidden space-y-1">
                {transactions?.length > 0 ? (
                    transactions.slice(0, 5).map((tx, i) => (
                        <TransactionItem key={tx.id || i} tx={tx} index={i} />
                    ))
                ) : (
                    <div className="flex-1 flex items-center justify-center py-4">
                        <div className="text-center">
                            <div className="text-[13px] text-[var(--color-text-muted)]">{t('dashboard.clean_ledger')}</div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
