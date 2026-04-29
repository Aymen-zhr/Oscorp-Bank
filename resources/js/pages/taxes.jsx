import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { 
    Receipt, Download, Upload, Calendar, AlertCircle, 
    CheckCircle, Clock, TrendingUp, Calculator, Building2,
    Briefcase, FileText, Search
} from 'lucide-react';
import { useState } from 'react';

const ICON_MAP = {
    CheckCircle, Clock, TrendingUp, Receipt, Calendar
};

export default function Taxes({ taxDocuments = [], taxCategories = [], upcomingDeadlines = [], stats = {} }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');

    // Tax Estimator State
    const [calcGross, setCalcGross] = useState(500000);
    const [calcDeductions, setCalcDeductions] = useState(50000);

    const calcResults = (() => {
        const gross = Number(calcGross) || 0;
        const deductions = Number(calcDeductions) || 0;
        
        let taxableIncome = gross - deductions;
        if (taxableIncome < 0) taxableIncome = 0;

        // Simple progressive tax bracket logic
        let tax = 0;
        if (taxableIncome <= 30000) { tax = 0; }
        else if (taxableIncome <= 50000) { tax = (taxableIncome - 30000) * 0.10; }
        else if (taxableIncome <= 60000) { tax = 2000 + (taxableIncome - 50000) * 0.20; }
        else if (taxableIncome <= 80000) { tax = 4000 + (taxableIncome - 60000) * 0.30; }
        else if (taxableIncome <= 180000) { tax = 10000 + (taxableIncome - 80000) * 0.34; }
        else { tax = 44000 + (taxableIncome - 180000) * 0.38; }

        let effectiveRate = gross > 0 ? (tax / gross) * 100 : 0;

        return {
            taxableIncome: taxableIncome,
            estimatedTax: tax,
            effectiveRate: effectiveRate,
            netIncome: gross - tax
        };
    })();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-MA', { maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden font-sans antialiased" style={{ background: 'var(--color-bg-base)' }}>
            <Head title="OSCORP | Taxes" />
            <Sidebar />
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
                                <h1 className="text-[28px] font-bold tracking-tight" style={{ color: 'var(--color-text-main)' }}>Tax Center</h1>
                                <p className="text-[14px] mt-1" style={{ color: 'var(--color-text-muted)' }}>Track tax obligations, manage documents, and calculate estimates.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:opacity-80" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}>
                                    <Upload className="w-4 h-4" /> Upload Document
                                </button>
                                <button onClick={() => setActiveTab('estimator')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:opacity-80" 
                                    style={{ background: 'var(--color-gold)', color: '#000', boxShadow: '0 4px 15px rgba(212,175,55,0.3)' }}>
                                    <Calculator className="w-4 h-4" /> Tax Estimator
                                </button>
                            </div>
                        </motion.div>

                        {/* ── Stats ── */}
                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {[
                                { label: 'Total Paid (YTD)', value: `MAD ${formatCurrency(stats.totalPaidThisYear || 0)}`, icon: CheckCircle, color: '#10B981' },
                                { label: 'Pending Payment', value: `MAD ${formatCurrency(stats.pendingPayment || 0)}`, icon: Clock, color: '#F59E0B' },
                                { label: 'Estimated Annual', value: `MAD ${formatCurrency(stats.estimatedAnnual || 0)}`, icon: TrendingUp, color: '#3B82F6' },
                                { label: 'Tax Deductions', value: `MAD ${formatCurrency(stats.taxDeductions || 0)}`, icon: Receipt, color: 'var(--color-gold)' },
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
                                        <div className="text-[22px] font-bold" style={{ color: 'var(--color-text-main)' }}>{stat.value}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* ── Tabs ── */}
                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {[
                                    { id: 'overview', label: 'Tax Overview' },
                                    { id: 'documents', label: 'Documents' },
                                    { id: 'deadlines', label: 'Deadlines' },
                                    { id: 'estimator', label: 'Tax Estimator' }
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

                            {/* ── Overview Content ── */}
                            {activeTab === 'overview' && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="rounded-[24px] p-6 lg:p-8" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                        <h3 className="text-[18px] font-bold mb-6" style={{ color: 'var(--color-text-main)' }}>Tax Breakdown</h3>
                                        <div className="space-y-6">
                                            {taxCategories.map((item) => (
                                                <div key={item.category} className="group">
                                                    <div className="flex items-center justify-between text-[14px] font-medium mb-2">
                                                        <span style={{ color: 'var(--color-text-main)' }}>{item.category}</span>
                                                        <span style={{ color: 'var(--color-text-main)' }}>MAD {formatCurrency(item.amount)}</span>
                                                    </div>
                                                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-elevated)' }}>
                                                        <motion.div 
                                                            initial={{ width: 0 }} animate={{ width: `${item.percentage}%` }} transition={{ duration: 1 }}
                                                            className="h-full rounded-full relative" 
                                                            style={{ background: item.color }} 
                                                        >
                                                            <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)', backgroundSize: '1rem 1rem' }} />
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                    
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-[24px] p-6 lg:p-8" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                        <h3 className="text-[18px] font-bold mb-6" style={{ color: 'var(--color-text-main)' }}>Upcoming Deadlines</h3>
                                        <div className="space-y-4">
                                            {upcomingDeadlines.slice(0, 3).map((deadline, idx) => (
                                                <div key={idx} className="p-4 rounded-xl flex items-center justify-between" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--color-bg-base)]">
                                                            <Calendar className="w-5 h-5 text-[var(--color-gold)]" />
                                                        </div>
                                                        <div>
                                                            <div className="text-[14px] font-bold" style={{ color: 'var(--color-text-main)' }}>{deadline.description}</div>
                                                            <div className="text-[12px] font-medium mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{deadline.deadline}</div>
                                                        </div>
                                                    </div>
                                                    <div className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md ${deadline.daysLeft < 30 ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                        {deadline.daysLeft} Days
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 p-4 rounded-xl flex items-start gap-3" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)' }}>
                                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--color-gold)' }} />
                                            <div className="text-[12px] font-medium leading-relaxed" style={{ color: 'var(--color-gold)' }}>
                                                Action Required: You have a quarterly tax payment coming up. We recommend setting up auto-pay to avoid any late penalties.
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}

                            {/* ── Documents Content ── */}
                            {activeTab === 'documents' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] overflow-hidden" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                    <div className="p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderColor: 'var(--color-border)' }}>
                                        <div>
                                            <h3 className="text-[18px] font-bold" style={{ color: 'var(--color-text-main)' }}>Tax Document Library</h3>
                                            <p className="text-[13px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Access your previously filed returns and summaries</p>
                                        </div>
                                        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl w-full md:w-auto" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
                                            <Search className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                                            <input 
                                                type="text" 
                                                placeholder="Search documents..." 
                                                value={searchQuery}
                                                onChange={e => setSearchQuery(e.target.value)}
                                                className="bg-transparent text-[13px] outline-none w-full"
                                                style={{ color: 'var(--color-text-main)' }}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-[var(--color-bg-base)]/30">
                                        {taxDocuments
                                            .filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                            .map((doc, idx) => {
                                            const Icon = ICON_MAP[doc.icon] || FileText;
                                            return (
                                                <motion.div 
                                                    key={doc.id} whileHover={{ y: -2 }}
                                                    className="p-5 rounded-2xl flex flex-col group transition-colors cursor-pointer relative overflow-hidden"
                                                    style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}
                                                >
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: 'rgba(212,175,55,0.1)' }}>
                                                            <Icon className="w-5 h-5" style={{ color: 'var(--color-gold)' }} />
                                                        </div>
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${doc.status === 'Filed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                            {doc.status}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex-1">
                                                        <h4 className="text-[15px] font-bold mb-1 group-hover:text-[var(--color-gold)] transition-colors" style={{ color: 'var(--color-text-main)' }}>{doc.name}</h4>
                                                        <div className="text-[12px] font-medium mb-4" style={{ color: 'var(--color-text-muted)' }}>{doc.type} • MAD {formatCurrency(doc.amount)}</div>
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-between pt-4 mt-auto border-t" style={{ borderColor: 'var(--color-border)' }}>
                                                        <span className="text-[11px] font-semibold" style={{ color: 'var(--color-text-muted)' }}>Filed: {doc.date}</span>
                                                        <button className="flex items-center gap-1.5 text-[12px] font-bold hover:opacity-80 transition-opacity" style={{ color: 'var(--color-gold)' }}>
                                                            Download <Download className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {/* ── Deadlines Content ── */}
                            {activeTab === 'deadlines' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                    {upcomingDeadlines.map((deadline, index) => (
                                        <div key={index} className="rounded-[24px] p-6" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex items-start gap-5">
                                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'var(--color-gold-bg)' }}>
                                                        <Calendar className="w-6 h-6" style={{ color: 'var(--color-gold)' }} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-[18px] font-bold mb-1" style={{ color: 'var(--color-text-main)' }}>{deadline.description}</h3>
                                                        <div className="flex items-center gap-2 text-[13px] font-medium" style={{ color: 'var(--color-text-muted)' }}>
                                                            <Clock className="w-4 h-4" />
                                                            <span>Due Date: {deadline.deadline}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="md:text-right flex md:flex-col items-center md:items-end justify-between">
                                                    <div>
                                                        <div className={`text-[32px] font-bold leading-none ${deadline.daysLeft < 30 ? 'text-red-500' : 'text-[var(--color-gold)]'}`}>
                                                            {deadline.daysLeft}
                                                        </div>
                                                        <div className="text-[11px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--color-text-muted)' }}>Days Remaining</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-6 pt-6 border-t flex flex-col sm:flex-row gap-3" style={{ borderColor: 'var(--color-border)' }}>
                                                <button className="flex-1 py-2.5 rounded-xl text-[14px] font-bold transition-opacity hover:opacity-90" style={{ background: 'var(--color-gold)', color: '#000' }}>
                                                    Pay Now
                                                </button>
                                                <button className="flex-1 py-2.5 rounded-xl text-[14px] font-bold transition-all hover:bg-[var(--color-bg-base)]" style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}>
                                                    Set Reminder
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {/* ── Tax Estimator Content ── */}
                            {activeTab === 'estimator' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                    <div className="lg:col-span-3 rounded-[24px] p-6 lg:p-8" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                        <div className="flex items-center gap-3 mb-8 pb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)' }}>
                                                <Calculator className="w-5 h-5 text-[var(--color-gold)]" />
                                            </div>
                                            <div>
                                                <h3 className="text-[18px] font-bold" style={{ color: 'var(--color-text-main)' }}>Progressive Tax Estimator</h3>
                                                <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-muted)' }}>Estimate your tax liability based on Moroccan tax brackets.</p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-8">
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <label className="text-[13px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Gross Annual Income</label>
                                                    <span className="text-[15px] font-bold" style={{ color: 'var(--color-text-main)' }}>MAD {formatCurrency(calcGross)}</span>
                                                </div>
                                                <input 
                                                    type="range" min="30000" max="2000000" step="10000" 
                                                    value={calcGross} onChange={(e) => setCalcGross(e.target.value)} 
                                                    className="w-full accent-[var(--color-gold)] cursor-pointer" 
                                                />
                                            </div>
                                            
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <label className="text-[13px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Total Deductions</label>
                                                    <span className="text-[15px] font-bold text-emerald-400">MAD {formatCurrency(calcDeductions)}</span>
                                                </div>
                                                <input 
                                                    type="range" min="0" max="500000" step="5000" 
                                                    value={calcDeductions} onChange={(e) => setCalcDeductions(e.target.value)} 
                                                    className="w-full accent-[var(--color-gold)] cursor-pointer" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="lg:col-span-2 rounded-[24px] p-6 lg:p-8 flex flex-col justify-center relative overflow-hidden" 
                                        style={{ background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)', border: '1px solid rgba(212,175,55,0.2)' }}>
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-gold)] opacity-5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3" />
                                        
                                        <h3 className="text-[14px] font-bold uppercase tracking-widest mb-8 text-center" style={{ color: 'var(--color-gold)' }}>Estimated Results</h3>
                                        
                                        <div className="text-center mb-8 relative z-10">
                                            <div className="text-[12px] font-semibold text-white/50 mb-2">Estimated Tax Due</div>
                                            <div className="text-[42px] font-bold leading-none text-white tracking-tight">
                                                MAD {formatCurrency(calcResults.estimatedTax)}
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-white/10 relative z-10">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[13px] font-medium text-white/60">Taxable Income</span>
                                                <span className="text-[14px] font-bold text-white">MAD {formatCurrency(calcResults.taxableIncome)}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[13px] font-medium text-white/60">Effective Tax Rate</span>
                                                <span className="text-[14px] font-bold text-emerald-400">{calcResults.effectiveRate.toFixed(1)}%</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[13px] font-medium text-white/60">Estimated Net Income</span>
                                                <span className="text-[14px] font-bold text-white">MAD {formatCurrency(calcResults.netIncome)}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-8 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 relative z-10">
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--color-gold)' }} />
                                                <div className="text-[11px] leading-relaxed text-white/60">
                                                    This estimate assumes standard progressive tax brackets and does not substitute professional tax advice.
                                                </div>
                                            </div>
                                        </div>
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
