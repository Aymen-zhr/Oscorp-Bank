import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { 
    Landmark, Plus, ArrowUpRight, ArrowDownRight, 
    Clock, CheckCircle, AlertCircle, Percent, Calculator, 
    FileText, Home, Car, User, Briefcase, GraduationCap 
} from 'lucide-react';
import { useState } from 'react';

const ICON_MAP = {
    Home, Car, User, Briefcase, GraduationCap, Landmark
};

export default function Loans({ activeLoans = [], loanOffers = [], stats = {} }) {
    const [activeTab, setActiveTab] = useState('active');

    // Calculator State
    const [calcAmount, setCalcAmount] = useState(100000);
    const [calcRate, setCalcRate] = useState(5.5);
    const [calcTerm, setCalcTerm] = useState(5);

    const calcResults = (() => {
        const p = Number(calcAmount) || 0;
        const r = (Number(calcRate) || 0) / 100 / 12;
        const n = (Number(calcTerm) || 0) * 12;

        if (p <= 0 || r <= 0 || n <= 0) {
            return { payment: 0, totalInterest: 0, totalPayment: 0 };
        }

        const payment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalPayment = payment * n;
        const totalInterest = totalPayment - p;

        return {
            payment: payment,
            totalInterest: totalInterest,
            totalPayment: totalPayment
        };
    })();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-MA', { maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden font-sans antialiased" style={{ background: 'var(--color-bg-base)' }}>
            <Head title="OSCORP | Loans" />
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
                                <h1 className="text-[28px] font-bold tracking-tight" style={{ color: 'var(--color-text-main)' }}>Loans & Credit</h1>
                                <p className="text-[14px] mt-1" style={{ color: 'var(--color-text-muted)' }}>Manage your active loans and explore new financing options.</p>
                            </div>
                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:opacity-80" 
                                style={{ background: 'var(--color-gold)', color: '#000', boxShadow: '0 4px 15px rgba(212,175,55,0.3)' }}>
                                <Plus className="w-4 h-4" /> Apply for Loan
                            </button>
                        </motion.div>

                        {/* ── Stats ── */}
                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {[
                                { label: 'Total Outstanding', value: `MAD ${formatCurrency(stats.totalOutstanding || 0)}`, icon: Landmark, color: '#F59E0B' },
                                { label: 'Monthly Payments', value: `MAD ${formatCurrency(stats.monthlyPayments || 0)}`, icon: ArrowUpRight, color: '#EF4444' },
                                { label: 'Average Rate', value: `${stats.averageRate || 0}%`, icon: Percent, color: '#3B82F6' },
                                { label: 'Paid Off This Year', value: `MAD ${formatCurrency(stats.paidOffThisYear || 0)}`, icon: ArrowDownRight, color: '#10B981' },
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
                                    { id: 'active', label: 'Active Loans' },
                                    { id: 'offers', label: 'Loan Offers' },
                                    { id: 'calculator', label: 'Loan Calculator' }
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

                            {/* ── Active Loans Content ── */}
                            {activeTab === 'active' && (
                                <div className="space-y-5">
                                    {activeLoans.map((loan, idx) => {
                                        const Icon = ICON_MAP[loan.icon] || Landmark;
                                        return (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                                                key={loan.id} 
                                                className="rounded-[24px] p-6 relative overflow-hidden" 
                                                style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
                                            >
                                                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-gold)] opacity-5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
                                                <div className="relative z-10">
                                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--color-bg-elevated)] border border-[var(--color-border)]">
                                                                <Icon className="w-6 h-6 text-[var(--color-gold)]" />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-3 mb-1">
                                                                    <h3 className="text-[18px] font-bold" style={{ color: 'var(--color-text-main)' }}>{loan.type}</h3>
                                                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500">{loan.status}</span>
                                                                </div>
                                                                <div className="text-[13px] font-medium" style={{ color: 'var(--color-text-muted)' }}>ID: {loan.id} • Term: {loan.term}</div>
                                                            </div>
                                                        </div>
                                                        <div className="md:text-right">
                                                            <div className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>Remaining Balance</div>
                                                            <div className="text-[24px] font-bold" style={{ color: 'var(--color-text-main)' }}>MAD {formatCurrency(loan.balance)}</div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mb-6">
                                                        <div className="flex items-center justify-between text-[13px] font-semibold mb-2">
                                                            <span style={{ color: 'var(--color-text-muted)' }}>Repayment Progress</span>
                                                            <span style={{ color: 'var(--color-gold)' }}>{loan.progress}%</span>
                                                        </div>
                                                        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
                                                            <motion.div 
                                                                initial={{ width: 0 }} animate={{ width: `${loan.progress}%` }} transition={{ duration: 1, delay: 0.2 }}
                                                                className="h-full rounded-full relative" 
                                                                style={{ background: 'linear-gradient(90deg, #d4af37, #f3e5ab)' }} 
                                                            >
                                                                <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)', backgroundSize: '1rem 1rem' }} />
                                                            </motion.div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 border-t" style={{ borderColor: 'var(--color-border)' }}>
                                                        <div>
                                                            <div className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>Interest Rate</div>
                                                            <div className="text-[16px] font-semibold" style={{ color: 'var(--color-text-main)' }}>{loan.rate}%</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>Monthly Payment</div>
                                                            <div className="text-[16px] font-semibold" style={{ color: 'var(--color-text-main)' }}>MAD {formatCurrency(loan.monthlyPayment)}</div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.1)' }}>
                                                                <Clock className="w-4 h-4" style={{ color: 'var(--color-gold)' }} />
                                                            </div>
                                                            <div>
                                                                <div className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>Next Payment</div>
                                                                <div className="text-[14px] font-semibold" style={{ color: 'var(--color-text-main)' }}>{new Date(loan.nextPayment).toLocaleDateString('en-MA', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* ── Loan Offers Content ── */}
                            {activeTab === 'offers' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    {loanOffers.map((offer, idx) => {
                                        const Icon = ICON_MAP[offer.icon] || Landmark;
                                        return (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}
                                                key={offer.type} 
                                                className="rounded-[24px] p-6 relative overflow-hidden group flex flex-col transition-all hover:-translate-y-1" 
                                                style={{ 
                                                    background: 'var(--color-bg-card)', 
                                                    border: offer.featured ? '2px solid var(--color-gold)' : '1px solid var(--color-border)',
                                                    boxShadow: offer.featured ? '0 10px 30px -10px rgba(212,175,55,0.2)' : 'none'
                                                }}
                                            >
                                                {offer.featured && (
                                                    <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md" style={{ background: 'var(--color-gold)', color: 'black' }}>
                                                        Recommended
                                                    </div>
                                                )}
                                                
                                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110" style={{ background: offer.featured ? 'rgba(212,175,55,0.15)' : 'var(--color-bg-elevated)' }}>
                                                    <Icon className="w-7 h-7" style={{ color: offer.featured ? 'var(--color-gold)' : 'var(--color-text-main)' }} />
                                                </div>
                                                
                                                <div className="mb-6 flex-1">
                                                    <h3 className="text-[20px] font-bold mb-1" style={{ color: 'var(--color-text-main)' }}>{offer.type}</h3>
                                                    <div className="text-[13px] font-medium" style={{ color: 'var(--color-text-muted)' }}>Borrow up to MAD {formatCurrency(offer.maxAmount)}</div>
                                                </div>
                                                
                                                <div className="space-y-3 mb-6 p-4 rounded-xl" style={{ background: 'var(--color-bg-base)' }}>
                                                    <div className="flex items-center justify-between text-[14px]">
                                                        <span className="font-medium" style={{ color: 'var(--color-text-muted)' }}>Interest Rate</span>
                                                        <span className="font-bold text-emerald-400">From {offer.rate}%</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-[14px]">
                                                        <span className="font-medium" style={{ color: 'var(--color-text-muted)' }}>Term</span>
                                                        <span className="font-bold" style={{ color: 'var(--color-text-main)' }}>{offer.term}</span>
                                                    </div>
                                                </div>
                                                
                                                <button className="w-full py-3 rounded-xl text-[14px] font-bold transition-opacity hover:opacity-90" 
                                                    style={{ background: offer.featured ? 'var(--color-gold)' : 'var(--color-bg-elevated)', color: offer.featured ? 'black' : 'var(--color-text-main)' }}>
                                                    Start Application
                                                </button>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* ── Loan Calculator Content ── */}
                            {activeTab === 'calculator' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                    <div className="lg:col-span-3 rounded-[24px] p-6 lg:p-8" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                        <div className="flex items-center gap-3 mb-8 pb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)' }}>
                                                <Calculator className="w-5 h-5 text-[var(--color-gold)]" />
                                            </div>
                                            <div>
                                                <h3 className="text-[18px] font-bold" style={{ color: 'var(--color-text-main)' }}>Payment Calculator</h3>
                                                <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-muted)' }}>Estimate your monthly payments and total interest.</p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-6">
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <label className="text-[13px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Loan Amount (MAD)</label>
                                                    <span className="text-[14px] font-bold" style={{ color: 'var(--color-text-main)' }}>{formatCurrency(calcAmount)}</span>
                                                </div>
                                                <input 
                                                    type="range" min="10000" max="2000000" step="10000" 
                                                    value={calcAmount} onChange={(e) => setCalcAmount(e.target.value)} 
                                                    className="w-full accent-[var(--color-gold)] cursor-pointer" 
                                                />
                                            </div>
                                            
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <label className="text-[13px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Interest Rate (%)</label>
                                                    <span className="text-[14px] font-bold text-emerald-400">{calcRate}%</span>
                                                </div>
                                                <input 
                                                    type="range" min="1.0" max="15.0" step="0.1" 
                                                    value={calcRate} onChange={(e) => setCalcRate(e.target.value)} 
                                                    className="w-full accent-[var(--color-gold)] cursor-pointer" 
                                                />
                                            </div>
                                            
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <label className="text-[13px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Term (Years)</label>
                                                    <span className="text-[14px] font-bold" style={{ color: 'var(--color-text-main)' }}>{calcTerm} Years</span>
                                                </div>
                                                <input 
                                                    type="range" min="1" max="30" step="1" 
                                                    value={calcTerm} onChange={(e) => setCalcTerm(e.target.value)} 
                                                    className="w-full accent-[var(--color-gold)] cursor-pointer" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="lg:col-span-2 rounded-[24px] p-6 lg:p-8 flex flex-col justify-center relative overflow-hidden" 
                                        style={{ background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)', border: '1px solid rgba(212,175,55,0.2)' }}>
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-gold)] opacity-5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3" />
                                        
                                        <h3 className="text-[14px] font-bold uppercase tracking-widest mb-8 text-center" style={{ color: 'var(--color-gold)' }}>Estimated Results</h3>
                                        
                                        <div className="text-center mb-8">
                                            <div className="text-[12px] font-semibold text-white/50 mb-2">Estimated Monthly Payment</div>
                                            <div className="text-[42px] font-bold leading-none text-white tracking-tight">
                                                MAD {formatCurrency(calcResults.payment)}
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-white/10">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[13px] font-medium text-white/60">Principal Amount</span>
                                                <span className="text-[14px] font-bold text-white">MAD {formatCurrency(calcAmount)}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[13px] font-medium text-white/60">Total Interest</span>
                                                <span className="text-[14px] font-bold text-emerald-400">MAD {formatCurrency(calcResults.totalInterest)}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[13px] font-medium text-white/60">Total Cost of Loan</span>
                                                <span className="text-[14px] font-bold text-white">MAD {formatCurrency(calcResults.totalPayment)}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-8 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5">
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--color-gold)' }} />
                                                <div className="text-[11px] leading-relaxed text-white/60">
                                                    This calculator is for illustrative purposes only. Actual rates and payments may vary based on your credit score and financial profile.
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
