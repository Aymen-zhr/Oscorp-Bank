import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { Calendar, CreditCard, Clock, Activity, AlertCircle, PauseCircle, PlayCircle, MoreHorizontal, FileText, Download } from 'lucide-react';
import { useState } from 'react';

const LOGO_KEY = 'pk_binMfKfXSiOiYpfo3CyL2w';

export default function Subscriptions({ subscriptions = [], billingHistory = [], stats = {} }) {
    const [activeTab, setActiveTab] = useState('active');

    const formatCurrency = (amount) => {
        return `MAD ${new Intl.NumberFormat('en-MA', { minimumFractionDigits: 2 }).format(amount)}`;
    };

    return (
        <div className="flex h-screen w-full overflow-hidden font-sans antialiased" style={{ background: 'var(--color-bg-base)' }}>
            <Head title="OSCORP | Subscriptions" />
            <Sidebar active="subscriptions" />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
                    className="flex-1 overflow-y-auto px-6 py-8"
                >
                    <div className="max-w-7xl mx-auto space-y-8">
                        
                        {/* ── Header ── */}
                        <motion.div variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-[28px] font-bold tracking-tight" style={{ color: 'var(--color-text-main)' }}>Subscriptions</h1>
                                <p className="text-[14px] mt-1" style={{ color: 'var(--color-text-muted)' }}>Manage your digital services, recurring payments, and billing history.</p>
                            </div>
                        </motion.div>

                        {/* ── Stats ── */}
                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {[
                                { label: 'Active Subscriptions', value: stats.activeCount || 0, icon: Activity, color: '#10B981' },
                                { label: 'Est. Monthly Spend', value: formatCurrency(stats.monthlySpend || 0), icon: CreditCard, color: 'var(--color-gold)' },
                                { label: 'Projected Yearly', value: formatCurrency(stats.yearlySpend || 0), icon: Calendar, color: '#3B82F6' },
                            ].map((stat, idx) => (
                                <motion.div key={stat.label} whileHover={{ y: -4 }} className="rounded-[24px] p-6 relative overflow-hidden group" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[30px] -translate-y-1/2 translate-x-1/2 opacity-10 transition-opacity group-hover:opacity-30" style={{ background: stat.color }} />
                                    <div className="flex items-center justify-between mb-4 relative z-10">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}>
                                            <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="text-[12px] font-bold uppercase tracking-[0.1em] mb-1" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</div>
                                        <div className="text-[26px] font-bold" style={{ color: 'var(--color-text-main)' }}>{stat.value}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* ── Tabs ── */}
                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <div className="flex flex-wrap gap-2 mb-6 border-b pb-4" style={{ borderColor: 'var(--color-border)' }}>
                                {[
                                    { id: 'active', label: 'My Subscriptions' },
                                    { id: 'billing', label: 'Billing History' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-5 py-2.5 rounded-xl text-[14px] font-bold transition-all ${activeTab === tab.id ? 'text-black' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-elevated)]'}`}
                                        style={activeTab === tab.id ? { background: 'var(--color-gold)', boxShadow: '0 4px 15px rgba(212,175,55,0.2)' } : { border: '1px solid transparent' }}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* ── Active Subscriptions Grid ── */}
                            {activeTab === 'active' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {subscriptions.map((sub, idx) => (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}
                                            key={sub.id} 
                                            className="rounded-[24px] p-6 relative overflow-hidden group transition-all hover:-translate-y-1 flex flex-col" 
                                            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
                                        >
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="w-14 h-14 rounded-[18px] bg-white flex items-center justify-center p-2 shadow-sm border border-gray-100/10">
                                                    <img 
                                                        src={`https://img.logo.dev/${sub.domain}?token=${LOGO_KEY}&size=80&format=png`}
                                                        alt={sub.name}
                                                        className="w-full h-full object-contain rounded-[10px]"
                                                        onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + sub.name.charAt(0) + '&background=random' }}
                                                    />
                                                </div>
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1.5 ${sub.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-400'}`}>
                                                    {sub.status === 'Active' ? <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
                                                    {sub.status}
                                                </span>
                                            </div>
                                            
                                            <div className="mb-6 flex-1">
                                                <h3 className="text-[18px] font-bold mb-1" style={{ color: 'var(--color-text-main)' }}>{sub.name}</h3>
                                                <div className="text-[13px] font-medium" style={{ color: 'var(--color-text-muted)' }}>{sub.plan} Plan</div>
                                            </div>

                                            <div className="space-y-4 pt-5 border-t" style={{ borderColor: 'var(--color-border)' }}>
                                                <div className="flex items-center justify-between">
                                                    <div className="text-[12px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{sub.billingCycle}</div>
                                                    <div className="text-[18px] font-bold" style={{ color: 'var(--color-text-main)' }}>{formatCurrency(sub.price)}</div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'var(--color-bg-base)' }}>
                                                    <Clock className="w-4 h-4" style={{ color: 'var(--color-gold)' }} />
                                                    <div className="text-[12px] font-medium" style={{ color: 'var(--color-text-muted)' }}>
                                                        {sub.status === 'Active' ? `Next billing on ${sub.nextBilling}` : `Subscription paused`}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-5 flex gap-2">
                                                {sub.status === 'Active' ? (
                                                    <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[12px] font-bold transition-all hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30" style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}>
                                                        <PauseCircle className="w-4 h-4" /> Pause
                                                    </button>
                                                ) : (
                                                    <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[12px] font-bold transition-all" style={{ background: 'var(--color-gold-bg)', border: '1px solid var(--color-gold)', color: 'var(--color-gold)' }}>
                                                        <PlayCircle className="w-4 h-4" /> Resume
                                                    </button>
                                                )}
                                                <button className="w-10 flex items-center justify-center rounded-xl transition-all hover:bg-[var(--color-bg-base)]" style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* ── Billing History Content ── */}
                            {activeTab === 'billing' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] overflow-hidden" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                    <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
                                        <div>
                                            <h3 className="text-[16px] font-bold" style={{ color: 'var(--color-text-main)' }}>Recent Invoices</h3>
                                            <p className="text-[13px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Your latest subscription charges</p>
                                        </div>
                                    </div>
                                    <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                                        {billingHistory.map((item, index) => (
                                            <div key={item.id} className="flex items-center justify-between p-5 hover:bg-[var(--color-bg-base)]/50 transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-[12px] bg-white flex items-center justify-center p-1.5 shrink-0">
                                                        <img 
                                                            src={`https://img.logo.dev/${item.domain}?token=${LOGO_KEY}&size=60&format=png`}
                                                            alt={item.description}
                                                            className="w-full h-full object-contain rounded-[6px]"
                                                            onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + item.description.charAt(0) + '&background=random' }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="text-[14px] font-bold" style={{ color: 'var(--color-text-main)' }}>{item.description}</div>
                                                        <div className="text-[12px] font-medium mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{item.date} • {item.id}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <div className="text-[15px] font-bold" style={{ color: 'var(--color-text-main)' }}>{formatCurrency(item.amount)}</div>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">{item.status}</span>
                                                    </div>
                                                    <button className="w-8 h-8 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-[var(--color-bg-card)]" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}>
                                                        <Download className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {billingHistory.length === 0 && (
                                            <div className="p-8 text-center text-[14px]" style={{ color: 'var(--color-text-muted)' }}>
                                                No billing history found.
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
