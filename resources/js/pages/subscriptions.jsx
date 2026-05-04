import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { Calendar, CreditCard, Clock, Activity, PauseCircle, PlayCircle, MoreHorizontal, Download, ShieldCheck, Zap } from 'lucide-react';
import { useState } from 'react';
import { LOGO_KEY, LOGO_BASE_URL, DICEBEAR_BASE_URL } from '@/constants';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';

export default function Subscriptions({ subscriptions = [], billingHistory = [], stats = {} }) {
    const [activeTab, setActiveTab] = useState('active');
    const { t } = useTranslation();
    const { format, code } = useCurrency();

    return (
        <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
            <Head title="OSCORP | Subscriptions" />
            <Sidebar active="subscriptions" />
            
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <Topbar />

                {/* Ambient Backgrounds Removed for Dark Luxury Aesthetic */}

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
                    className="flex-1 overflow-y-auto p-4 lg:p-8 z-10"
                >
                    <div className="max-w-6xl mx-auto space-y-8">
                        
                        {/* Header */}
                        <motion.div variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--color-text-main)' }}>Subscriptions</h1>
                                <p className="text-sm font-medium opacity-50 mt-1" style={{ color: 'var(--color-text-main)' }}>Manage digital assets and recurring liabilities.</p>
                            </div>
                            <div className="md:text-right flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5">
                                <ShieldCheck className="w-4 h-4 opacity-50" style={{ color: 'var(--color-text-main)' }} />
                                <span className="text-[11px] font-bold uppercase tracking-widest opacity-50" style={{ color: 'var(--color-text-main)' }}>Secure Billing</span>
                            </div>
                        </motion.div>

                        {/* Stats Grid */}
                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Active Subscriptions', value: stats.activeCount || 0, icon: Activity, color: '#10B981', isCurrency: false },
                                { label: 'Est. Monthly Spend', value: stats.monthlySpend || 0, icon: CreditCard, color: '#D4AF37', isCurrency: true },
                                { label: 'Projected Yearly', value: stats.yearlySpend || 0, icon: Calendar, color: '#8B5CF6', isCurrency: true },
                            ].map((stat, idx) => (
                                <motion.div key={stat.label} className="bg-white/[0.02] border border-white/5 hover:border-white/20 transition-colors rounded-[24px] p-6 flex flex-col justify-between group" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="text-[11px] font-bold uppercase tracking-widest opacity-50" style={{ color: 'var(--color-text-main)' }}>{stat.label}</div>
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-105" style={{ background: `${stat.color}10`, borderColor: `${stat.color}20` }}>
                                            <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-black tracking-tighter" style={{ color: 'var(--color-text-main)' }}>
                                            {stat.isCurrency ? format(stat.value) : stat.value}
                                            {stat.isCurrency && <span className="text-sm opacity-50 ml-1">{code}</span>}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Tabs */}
                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <div className="flex flex-wrap gap-6 mb-8 border-b border-white/5 pb-4 relative">
                                <div className="absolute bottom-[-1px] h-[2px] bg-white transition-all duration-300" style={{ width: activeTab === 'active' ? '120px' : '100px', transform: activeTab === 'active' ? 'translateX(0)' : 'translateX(144px)' }} />
                                {[
                                    { id: 'active', label: 'My Subscriptions' },
                                    { id: 'billing', label: 'Billing Ledger' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`pb-2 text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                                        style={{ color: 'var(--color-text-main)' }}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Active Subscriptions Grid */}
                            <AnimatePresence mode="wait">
                                {activeTab === 'active' && (
                                    <motion.div key="active" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {subscriptions.map((sub, idx) => (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}
                                                key={sub.id} 
                                                className="bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all rounded-[24px] p-6 flex flex-col group" 
                                                style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
                                            >
                                                <div className="flex items-start justify-between mb-6">
                                                    <div className="w-14 h-14 rounded-[16px] bg-black/20 flex items-center justify-center p-2 border border-white/5 group-hover:border-white/20 transition-colors">
                                                        <img 
                                                            src={`${LOGO_BASE_URL}/${sub.domain}?token=${LOGO_KEY}&size=80&format=png`}
                                                            alt={sub.name}
                                                            className="w-full h-full object-contain rounded-lg"
                                                            onError={(e) => { 
                                                                e.target.onerror = null; 
                                                                e.target.src = `${DICEBEAR_BASE_URL}/initials/svg?seed=${sub.name}&backgroundColor=10B981,D4AF37,8B5CF6,3B82F6,EF4444`; 
                                                            }}
                                                        />
                                                    </div>
                                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${sub.status === 'Active' ? 'bg-[#10B981]/10 border-[#10B981]/20' : 'bg-white/5 border-white/5'}`}>
                                                        {sub.status === 'Active' ? (
                                                            <>
                                                                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                                                                <span className="text-[9px] font-bold uppercase tracking-widest text-[#10B981]">Active</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                                                                <span className="text-[9px] font-bold uppercase tracking-widest text-white/50">Paused</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="mb-6 flex-1">
                                                    <h3 className="text-xl font-black mb-1" style={{ color: 'var(--color-text-main)' }}>{sub.name}</h3>
                                                    <div className="text-[11px] font-bold uppercase tracking-widest opacity-50" style={{ color: 'var(--color-text-main)' }}>{sub.plan}</div>
                                                </div>

                                                <div className="space-y-4 pt-6 border-t border-white/5">
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-[11px] font-bold uppercase tracking-widest opacity-50" style={{ color: 'var(--color-text-main)' }}>{sub.billingCycle}</div>
                                                        <div className="text-xl font-black tracking-tighter" style={{ color: 'var(--color-text-main)' }}>{format(sub.price)} <span className="text-xs font-bold opacity-50">{code}</span></div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5" style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
                                                        <Clock className="w-4 h-4 opacity-30" style={{ color: 'var(--color-text-main)' }} />
                                                        <div className="text-xs font-medium opacity-50" style={{ color: 'var(--color-text-main)' }}>
                                                            {sub.status === 'Active' ? `Next billing on ${sub.nextBilling}` : `Subscription paused`}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-6 flex gap-3">
                                                    {sub.status === 'Active' ? (
                                                        <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors bg-white/[0.02] hover:bg-[#EF4444]/10 hover:text-[#EF4444] border border-white/5 hover:border-[#EF4444]/30" style={{ color: 'var(--color-text-main)' }}>
                                                            <PauseCircle className="w-4 h-4" /> Pause
                                                        </button>
                                                    ) : (
                                                        <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors border bg-white/[0.02] hover:bg-[#10B981]/10 hover:text-[#10B981] hover:border-[#10B981]/30 border-white/5" style={{ color: 'var(--color-text-main)' }}>
                                                            <PlayCircle className="w-4 h-4" /> Resume
                                                        </button>
                                                    )}
                                                    <button className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors bg-white/[0.02] hover:bg-white/10 border border-white/5" style={{ color: 'var(--color-text-main)' }}>
                                                        <MoreHorizontal className="w-4 h-4 opacity-50" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}

                                {/* Billing History Content */}
                                {activeTab === 'billing' && (
                                    <motion.div key="billing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                                        className="bg-white/[0.02] border border-white/5 rounded-[24px] overflow-hidden" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
                                        
                                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-sm font-black" style={{ color: 'var(--color-text-main)' }}>Transaction Ledger</h3>
                                                <p className="text-[11px] font-bold uppercase tracking-widest opacity-40 mt-1" style={{ color: 'var(--color-text-main)' }}>Recent Subscription Charges</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-black/20 border border-white/5 flex items-center justify-center" style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
                                                <Zap className="w-4 h-4 opacity-50" style={{ color: 'var(--color-text-main)' }} />
                                            </div>
                                        </div>
                                        
                                        <div className="divide-y divide-white/5">
                                            {billingHistory.map((item, index) => (
                                                <div key={item.id} className="flex items-center justify-between p-6 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-[16px] bg-black/20 flex items-center justify-center p-2 shrink-0 border border-white/5 group-hover:border-white/20 transition-colors" style={{ background: 'var(--color-bg-elevated)' }}>
                                                            <img 
                                                                src={`${LOGO_BASE_URL}/${item.domain}?token=${LOGO_KEY}&size=60&format=png`}
                                                                alt={item.description}
                                                                className="w-full h-full object-contain rounded-lg"
                                                                onError={(e) => { 
                                                                    e.target.onerror = null; 
                                                                    e.target.src = `${DICEBEAR_BASE_URL}/initials/svg?seed=${item.description}&backgroundColor=10B981,D4AF37,8B5CF6,3B82F6,EF4444`; 
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold" style={{ color: 'var(--color-text-main)' }}>{item.description}</div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-[11px] font-bold uppercase tracking-widest opacity-40" style={{ color: 'var(--color-text-main)' }}>{item.date}</span>
                                                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                                                <span className="text-[11px] font-bold uppercase tracking-widest opacity-30" style={{ color: 'var(--color-text-main)' }}>#{item.id}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <div className="text-right">
                                                            <div className="text-base font-black tracking-tighter" style={{ color: 'var(--color-text-main)' }}>{format(item.amount)} <span className="text-[10px] font-bold opacity-50">{code}</span></div>
                                                            <span className="text-[9px] font-bold uppercase tracking-widest text-[#10B981] mt-0.5 block">{item.status}</span>
                                                        </div>
                                                        <button className="w-10 h-10 flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-colors bg-white/[0.02] hover:bg-white/10 border border-white/5" style={{ color: 'var(--color-text-main)' }}>
                                                            <Download className="w-4 h-4 opacity-50" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            {billingHistory.length === 0 && (
                                                <div className="p-12 flex flex-col items-center justify-center text-center">
                                                    <Zap className="w-8 h-8 opacity-20 mb-4" />
                                                    <div className="text-[11px] font-bold uppercase tracking-widest opacity-40" style={{ color: 'var(--color-text-main)' }}>
                                                        No ledger history found.
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Minimalist styling without heavy backdrop filters */}
        </div>
    );
}
