import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { 
    CreditCard, Landmark, Copy, Check, ShieldCheck, 
    Zap, ArrowUpRight, ArrowDownRight, Info,
    Eye, EyeOff, Download, ChevronRight, History
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';

export default function Cards({ user, card, rib, account, stats, recentTransactions = [] }) {
    const [showFullCard, setShowFullCard] = useState(false);
    const [copied, setCopied] = useState(null);
    const { t, locale } = useTranslation();
    const { format } = useCurrency();

    const copyToClipboard = (text, key) => {
        navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };

    // Using useCurrency hook instead of formatCurrency

    return (
        <div className="flex h-screen w-full overflow-hidden font-sans antialiased selection:bg-[var(--color-gold)] selection:text-white" style={{ background: 'var(--color-bg-base)' }}>
            <Head title="Card Information" />
            <Sidebar />
            
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Background Ambient Glows (Stabilized) */}
                <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[var(--color-gold)] opacity-[0.03] rounded-full blur-[120px] pointer-events-none z-0" />
                <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-blue-500 opacity-[0.02] rounded-full blur-[100px] pointer-events-none z-0" />
                
                <Topbar />

                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar"
                >
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-[32px] font-bold tracking-tight text-[var(--color-text-main)]">{t('cards.title')}</h1>
                                 <p className="text-[14px] text-[var(--color-text-muted)] mt-1">{t('cards.subtitle')}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[13px] font-bold text-[var(--color-text-main)] transition-all hover:bg-[var(--color-bg-card)]">
                                    <Download className="w-4 h-4" /> {t('cards.statements')}
                                </button>
                                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-gold)] text-black text-[13px] font-bold transition-all hover:brightness-110 shadow-lg shadow-[var(--color-gold)]/20">
                                    <Zap className="w-4 h-4" /> {t('cards.transfer_funds')}
                                </button>
                            </div>
                        </div>

                        {/* Top Cards Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            
                            {/* Card Section */}
                            <div className="lg:col-span-5 space-y-6">
                                <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)] px-1">{t('cards.active_card')}</h3>
                                <motion.div 
                                    whileHover={{ y: -5 }}
                                    className="relative h-[280px] w-full rounded-[28px] overflow-hidden shadow-2xl group cursor-pointer"
                                    style={{ 
                                        background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
                                        border: '1px solid rgba(212,175,55,0.3)',
                                        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)'
                                    }}
                                >
                                    {/* Card Textures */}
                                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(212,175,55,0.4) 0%, transparent 40%)' }} />
                                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }} />
                                    
                                    <div className="relative h-full flex flex-col p-8 justify-between z-10">
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-gold)] mb-1">OSCORP PRIVATE</span>
                                                <span className="text-[20px] font-bold text-white/90 italic tracking-wider">PLATINUM</span>
                                            </div>
                                            <div className="w-14 h-10 rounded-lg bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 overflow-hidden">
                                                <div className="w-8 h-8 rounded-full bg-red-500/80 mix-blend-screen -mr-3" />
                                                <div className="w-8 h-8 rounded-full bg-yellow-500/80 mix-blend-screen" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-6">
                                                <div className="text-[22px] font-mono tracking-[0.2em] text-white">
                                                    {showFullCard ? card.full_number : `••••  ••••  ••••  ${card.number}`}
                                                </div>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setShowFullCard(!showFullCard); }}
                                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                                >
                                                    {showFullCard ? <EyeOff className="w-4 h-4 text-white/60" /> : <Eye className="w-4 h-4 text-white/60" />}
                                                </button>
                                            </div>
                                            
                                            <div className="flex gap-12">
                                                <div>
                                                    <div className="text-[8px] font-bold uppercase tracking-widest text-white/40 mb-1">Card Holder</div>
                                                    <div className="text-[14px] font-bold text-white/90 uppercase tracking-widest">{card.holder}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[8px] font-bold uppercase tracking-widest text-white/40 mb-1">Expires</div>
                                                    <div className="text-[14px] font-bold text-white/90">{card.expiry}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[8px] font-bold uppercase tracking-widest text-white/40 mb-1">CVV</div>
                                                    <div className="text-[14px] font-bold text-white/90">{showFullCard ? '774' : '•••'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Chip */}
                                    <div className="absolute top-1/2 left-8 -translate-y-1/2 w-12 h-10 rounded-lg bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 opacity-80 border border-black/10 overflow-hidden">
                                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-[2px] p-1 opacity-40">
                                            {[...Array(9)].map((_, i) => <div key={i} className="border border-black/20" />)}
                                        </div>
                                    </div>
                                </motion.div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                                        <div className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase mb-2">{t('cards.spending_limit')}</div>
                                         <div className="text-[18px] font-bold text-[var(--color-text-main)]">{format(card.limit)}</div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                                        <div className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase mb-2">{t('cards.available_credit')}</div>
                                         <div className="text-[18px] font-bold text-emerald-400">{format(card.available)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Account Details / RIB Section */}
                            <div className="lg:col-span-7 space-y-6">
                                <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)] px-1">{t('cards.account_identifiers')}</h3>
                                
                                <div className="p-8 rounded-[28px] bg-[var(--color-bg-card)] border border-[var(--color-border)] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-gold)] opacity-[0.03] rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
                                    
                                    <div className="space-y-8 relative z-10">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-[var(--color-gold)]/10 flex items-center justify-center border border-[var(--color-gold)]/20">
                                                    <Landmark className="w-6 h-6 text-[var(--color-gold)]" />
                                                </div>
                                                <div>
                                                    <div className="text-[18px] font-bold text-[var(--color-text-main)]">{account.type}</div>
                                                    <div className="text-[13px] text-[var(--color-text-muted)]">{account.branch}</div>
                                                </div>
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                {account.status}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                            <div className="space-y-4">
                                                <div className="group">
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{t('cards.rib_full')}</span>
                                                        <button 
                                                            onClick={() => copyToClipboard(rib.full, 'full')}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-white/5"
                                                        >
                                                            {copied === 'full' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />}
                                                        </button>
                                                    </div>
                                                    <div className="text-[15px] font-mono font-bold text-[var(--color-text-main)] tracking-wide bg-[var(--color-bg-elevated)] p-3 rounded-xl border border-[var(--color-border)]">
                                                        {rib.full}
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">{t('cards.bank_code')}</div>
                                                        <div className="text-[14px] font-mono font-bold text-[var(--color-text-main)]">{rib.bank_code}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">{t('cards.branch_code')}</div>
                                                        <div className="text-[14px] font-mono font-bold text-[var(--color-text-main)]">{rib.branch_code}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="group">
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{t('cards.account_number')}</span>
                                                        <button 
                                                            onClick={() => copyToClipboard(rib.account_number, 'acc')}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-white/5"
                                                        >
                                                            {copied === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />}
                                                        </button>
                                                    </div>
                                                    <div className="text-[15px] font-mono font-bold text-[var(--color-text-main)] tracking-wide bg-[var(--color-bg-elevated)] p-3 rounded-xl border border-[var(--color-border)]">
                                                        {rib.account_number}
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">{t('cards.rib_key')}</div>
                                                        <div className="text-[14px] font-mono font-bold text-[var(--color-text-main)]">{rib.rib_key}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">{t('cards.opened_on')}</div>
                                                        <div className="text-[14px] font-bold text-[var(--color-text-main)]">{account.opened}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="pt-6 border-t border-[var(--color-border)] flex items-start gap-4">
                                            <div className="p-2 rounded-lg bg-blue-500/10 shrink-0">
                                                <Info className="w-4 h-4 text-blue-400" />
                                            </div>
                                             <p className="text-[12px] text-[var(--color-text-muted)] leading-relaxed">
                                                 {t('cards.rib_description')}
                                             </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent History / Stats Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">
                            
                            {/* Activity Stats */}
                            <div className="lg:col-span-4 space-y-6">
                                <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)] px-1">{t('cards.engagement_metrics')}</h3>
                                <div className="p-6 rounded-[28px] bg-[var(--color-bg-card)] border border-[var(--color-border)] space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-emerald-500/10">
                                                <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                                            </div>
                                            <span className="text-[13px] font-bold text-[var(--color-text-main)]">{t('cards.total_inflow')}</span>
                                        </div>
                                         <span className="text-[14px] font-bold text-emerald-400">+{format(stats.total_credits)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-red-500/10">
                                                <ArrowUpRight className="w-4 h-4 text-red-400" />
                                            </div>
                                            <span className="text-[13px] font-bold text-[var(--color-text-main)]">{t('cards.total_outflow')}</span>
                                        </div>
                                         <span className="text-[14px] font-bold text-red-400">-{format(stats.total_debits)}</span>
                                    </div>
                                    <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-blue-500/10">
                                                <History className="w-4 h-4 text-blue-400" />
                                            </div>
                                            <span className="text-[13px] font-bold text-[var(--color-text-main)]">{t('cards.monthly_volume')}</span>
                                        </div>
                                        <span className="text-[14px] font-bold text-[var(--color-text-main)]">{stats.transaction_count} Tx</span>
                                    </div>
                                    
                                    <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-[var(--color-gold-bg)] to-transparent border border-[var(--color-gold)]/10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <ShieldCheck className="w-4 h-4 text-[var(--color-gold)]" />
                                            <span className="text-[12px] font-bold text-[var(--color-gold)]">{t('cards.security_status')}</span>
                                        </div>
                                        <p className="text-[11px] text-[var(--color-text-muted)]">{t('cards.security_desc')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Transactions Mini List */}
                            <div className="lg:col-span-8 space-y-6">
                                <div className="flex items-center justify-between px-1">
                                    <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">{t('cards.recent_activity')}</h3>
                                    <button className="text-[12px] font-bold text-[var(--color-gold)] flex items-center gap-1 hover:underline">
                                        {t('cards.view_all')} <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="rounded-[28px] bg-[var(--color-bg-card)] border border-[var(--color-border)] overflow-hidden">
                                    <div className="divide-y divide-[var(--color-border)]">
                                        {recentTransactions.map((tx, i) => (
                                            <div key={tx.id} className="flex items-center justify-between p-5 hover:bg-white/5 transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <div 
                                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                                                        style={{ background: tx.logo_color || 'var(--color-gold)' }}
                                                    >
                                                        {tx.merchant.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-[14px] font-bold text-[var(--color-text-main)]">{tx.merchant}</div>
                                                        <div className="text-[12px] text-[var(--color-text-muted)]">{tx.category} • {new Date(tx.transacted_at).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                                <div className={`text-[15px] font-bold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-[var(--color-text-main)]'}`}>
                                                     {tx.type === 'credit' ? '+' : '-'}{format(tx.amount)}
                                                </div>
                                            </div>
                                        ))}
                                        {recentTransactions.length === 0 && (
                                            <div className="p-10 text-center text-[14px] text-[var(--color-text-muted)]">
                                                {t('cards.no_recent')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
