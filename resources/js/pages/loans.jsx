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
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Background Fixed Glows (Stabilized) */}
                <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[var(--color-gold)] opacity-[0.03] rounded-full blur-[120px] pointer-events-none z-0" />
                <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-blue-500 opacity-[0.02] rounded-full blur-[100px] pointer-events-none z-0" />
                
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
                                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[20px] -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-10 transition-opacity" style={{ background: stat.color }} />
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
                                    { id: 'calculator', label: 'Payment Calculator' },
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
                                <div className="grid grid-cols-1 gap-4">
                                    {activeLoans.length === 0 ? (
                                        <div className="text-center py-16 rounded-[24px]" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                            <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg-elevated)] flex items-center justify-center mx-auto mb-4">
                                                <Landmark className="w-8 h-8 text-[var(--color-text-muted)] opacity-50" />
                                            </div>
                                            <h3 className="font-bold mb-1" style={{ color: 'var(--color-text-main)' }}>No Active Loans</h3>
                                            <p className="text-[13px]" style={{ color: 'var(--color-text-muted)' }}>You don't have any outstanding credit facilities.</p>
                                        </div>
                                    ) : (
                                        activeLoans.map((loan) => (
                                            <motion.div key={loan.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="rounded-[24px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-gold-bg)' }}>
                                                        <Clock className="w-6 h-6" style={{ color: 'var(--color-gold)' }} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-[16px]" style={{ color: 'var(--color-text-main)' }}>{loan.type}</h4>
                                                        <div className="text-[12px]" style={{ color: 'var(--color-text-muted)' }}>{loan.bank_name} • Account ending in {loan.account_suffix}</div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1 md:px-8">
                                                    <div>
                                                        <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>Outstanding</div>
                                                        <div className="text-[15px] font-bold" style={{ color: 'var(--color-text-main)' }}>MAD {formatCurrency(loan.remaining)}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>Monthly</div>
                                                        <div className="text-[15px] font-bold" style={{ color: 'var(--color-text-main)' }}>MAD {formatCurrency(loan.monthly_payment)}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>Interest</div>
                                                        <div className="text-[15px] font-bold text-emerald-400">{loan.rate}%</div>
                                                    </div>
                                                    <div className="hidden lg:block">
                                                        <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>Next Due</div>
                                                        <div className="text-[15px] font-bold" style={{ color: 'var(--color-text-main)' }}>{loan.next_payment}</div>
                                                    </div>
                                                </div>
                                                <button className="px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:bg-[var(--color-bg-elevated)]" style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}>
                                                    Details
                                                </button>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* ── Loan Offers Content ── */}
                            {activeTab === 'offers' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {loanOffers.map((offer) => {
                                        const Icon = ICON_MAP[offer.icon] || Landmark;
                                        return (
                                            <motion.div key={offer.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
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
                                        style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-gold)] opacity-5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3" />
                                        
                                        <h3 className="text-[14px] font-bold uppercase tracking-widest mb-8 text-center" style={{ color: 'var(--color-gold)' }}>Estimated Results</h3>
                                        
                                        <div className="text-center mb-8 relative z-10">
                                            <div className="text-[12px] font-semibold mb-2" style={{ color: 'var(--color-text-muted)' }}>Estimated Monthly Payment</div>
                                            <div className="text-[42px] font-bold leading-none tracking-tight" style={{ color: 'var(--color-text-main)' }}>
                                                MAD {formatCurrency(calcResults.payment)}
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-6 border-t relative z-10" style={{ borderColor: 'var(--color-border)' }}>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[13px] font-medium" style={{ color: 'var(--color-text-muted)' }}>Principal Amount</span>
                                                <span className="text-[14px] font-bold" style={{ color: 'var(--color-text-main)' }}>MAD {formatCurrency(calcAmount)}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[13px] font-medium" style={{ color: 'var(--color-text-muted)' }}>Total Interest</span>
                                                <span className="text-[14px] font-bold text-emerald-400">MAD {formatCurrency(calcResults.totalInterest)}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[13px] font-medium" style={{ color: 'var(--color-text-muted)' }}>Total Cost of Loan</span>
                                                <span className="text-[14px] font-bold" style={{ color: 'var(--color-text-main)' }}>MAD {formatCurrency(calcResults.totalPayment)}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-8 p-4 rounded-xl relative z-10" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--color-gold)' }} />
                                                <div className="text-[11px] leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
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
