import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { 
    FileText, TrendingUp, TrendingDown, Download, Calendar, 
    BarChart3, PieChart, LineChart,
    ArrowUpRight, ArrowDownLeft, Wallet, Search,
    Home, ShoppingBag, Car, Coffee, Zap, Plus
} from 'lucide-react';
import { useState } from 'react';

const ICON_MAP = {
    TrendingUp, TrendingDown, BarChart3, PieChart, LineChart, FileText
};

const CATEGORY_STYLES = {
    'Housing & Rent': { color: '#8B5CF6', icon: Home },
    'Food & Dining': { color: '#F59E0B', icon: Coffee },
    'Transportation': { color: '#3B82F6', icon: Car },
    'Shopping': { color: '#EC4899', icon: ShoppingBag },
    'Utilities': { color: '#EF4444', icon: Zap },
    'Other': { color: '#10B981', icon: Plus },
    'default': { color: '#6B7280', icon: FileText }
};

export default function Reports({ stats, monthlyData = [], spendingCategories = [], reportCategories = [] }) {
    const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
    const [searchQuery, setSearchQuery] = useState('');

    const maxMonthlyValue = Math.max(...monthlyData.map(d => Math.max(d.income, d.expenses)), 1000) * 1.1;

    const enhancedSpendingCategories = spendingCategories.map(cat => ({
        ...cat,
        ...(CATEGORY_STYLES[cat.category] || CATEGORY_STYLES.default)
    }));

    const enhancedReportCategories = reportCategories.map(report => ({
        ...report,
        icon: ICON_MAP[report.icon] || FileText
    }));

    return (
        <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
            <Head title="OSCORP | Reports" />
            <Sidebar active="reports" />
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
                                <h1 className="text-[28px] font-bold tracking-tight" style={{ color: 'var(--color-text-main)' }}>Financial Analytics</h1>
                                <p className="text-[14px] mt-1" style={{ color: 'var(--color-text-muted)' }}>Analyze your cash flow, spending patterns, and generate reports.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
                                    <Calendar className="w-4 h-4 text-[var(--color-text-muted)]" />
                                    <select
                                        value={selectedPeriod}
                                        onChange={(e) => setSelectedPeriod(e.target.value)}
                                        className="bg-transparent text-[13px] font-medium outline-none cursor-pointer"
                                        style={{ color: 'var(--color-text-main)' }}
                                    >
                                        <option value="Monthly">Monthly View</option>
                                        <option value="Quarterly">Quarterly View</option>
                                        <option value="Annual">Annual View</option>
                                    </select>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all hover:opacity-80" style={{ background: 'var(--color-gold-bg)', color: 'var(--color-gold)', border: '1px solid var(--color-gold)/20' }}>
                                    <Download className="w-4 h-4" />
                                    Export Data
                                </button>
                            </div>
                        </motion.div>

                        {/* ── Top Stat Cards ── */}
                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {[
                                { label: 'Total Income', value: stats?.total_credits || '0', change: '+12.5%', positive: true, icon: ArrowDownLeft, color: '#34D399', bg: 'rgba(52,211,153,0.05)' },
                                { label: 'Total Expenses', value: stats?.total_debits || '0', change: '-3.2%', positive: true, icon: ArrowUpRight, color: '#EF4444', bg: 'rgba(239,68,68,0.05)' },
                                { label: 'Net Savings', value: stats?.net_savings || '0', change: stats?.net_savings_change || '+0%', positive: stats?.net_savings_positive ?? true, icon: Wallet, color: 'var(--color-gold)', bg: 'var(--color-gold-bg)' },
                            ].map((stat, idx) => (
                                <motion.div 
                                    key={stat.label} 
                                    whileHover={{ y: -4 }}
                                    className="rounded-[24px] p-6 relative overflow-hidden group" 
                                    style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 opacity-20 transition-opacity group-hover:opacity-40" style={{ background: stat.color }} />
                                    
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: stat.bg, border: `1px solid ${stat.color}30` }}>
                                            <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                                        </div>
                                        <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide flex items-center gap-1 ${stat.positive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {stat.change}
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="text-[12px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</div>
                                        <div className="text-[32px] font-bold leading-none" style={{ color: 'var(--color-text-main)' }}>
                                            {stat.value} <span className="text-[14px] font-medium opacity-50">MAD</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* ── Charts Section ── */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            
                            {/* Trend Chart */}
                            <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="lg:col-span-3 rounded-[24px] p-6 flex flex-col" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-[18px] font-bold" style={{ color: 'var(--color-text-main)' }}>Cash Flow Trend</h3>
                                        <p className="text-[13px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Income vs Expenses over the last 6 months</p>
                                    </div>
                                    <div className="flex items-center gap-4 text-[12px] font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-[#34D399]" />
                                            <span style={{ color: 'var(--color-text-muted)' }}>Income</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                                            <span style={{ color: 'var(--color-text-muted)' }}>Expenses</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex-1 flex items-end justify-between gap-2 h-[240px] pb-2">
                                    {monthlyData.map((item, idx) => (
                                        <div key={item.month} className="flex flex-col items-center gap-3 flex-1 group">
                                            <div className="w-full flex justify-center items-end gap-1.5 h-full relative">
                                                {/* Tooltip on hover */}
                                                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[11px] whitespace-nowrap shadow-xl z-20 pointer-events-none">
                                                    <div className="text-emerald-400 font-bold">In: {item.income.toLocaleString()}</div>
                                                    <div className="text-red-400 font-bold">Out: {item.expenses.toLocaleString()}</div>
                                                </div>
                                                
                                                {/* Income Bar */}
                                                <div 
                                                    className="w-1/3 max-w-[24px] rounded-t-md bg-[#34D399] transition-all duration-500 ease-out group-hover:opacity-100 opacity-80" 
                                                    style={{ height: `${(item.income / maxMonthlyValue) * 100}%`, boxShadow: '0 0 10px rgba(52,211,153,0.2)' }} 
                                                />
                                                {/* Expense Bar */}
                                                <div 
                                                    className="w-1/3 max-w-[24px] rounded-t-md bg-[#EF4444] transition-all duration-500 ease-out group-hover:opacity-100 opacity-80" 
                                                    style={{ height: `${(item.expenses / maxMonthlyValue) * 100}%`, boxShadow: '0 0 10px rgba(239,68,68,0.2)' }} 
                                                />
                                            </div>
                                            <div className="text-[12px] font-semibold" style={{ color: 'var(--color-text-muted)' }}>{item.month}</div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Spending Breakdown */}
                            <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }} className="lg:col-span-2 rounded-[24px] p-6 flex flex-col" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                <div className="mb-6">
                                    <h3 className="text-[18px] font-bold" style={{ color: 'var(--color-text-main)' }}>Spending Breakdown</h3>
                                    <p className="text-[13px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Where your money goes this period</p>
                                </div>
                                
                                <div className="space-y-5 flex-1">
                                    {enhancedSpendingCategories.map((item, idx) => (
                                        <div key={item.category} className="group">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: `${item.color}15` }}>
                                                        <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                                                    </div>
                                                    <span className="text-[14px] font-medium" style={{ color: 'var(--color-text-main)' }}>{item.category}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[14px] font-bold" style={{ color: 'var(--color-text-main)' }}>{item.amount}</span>
                                                </div>
                                            </div>
                                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-elevated)' }}>
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.percentage}%` }}
                                                    transition={{ duration: 1, delay: 0.2 + (idx * 0.1) }}
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
                        </div>

                        {/* ── Generated Reports Library ── */}
                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="rounded-[24px] overflow-hidden" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                            <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: 'var(--color-border)' }}>
                                <div>
                                    <h3 className="text-[18px] font-bold" style={{ color: 'var(--color-text-main)' }}>Document Library</h3>
                                    <p className="text-[13px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Access your previously generated reports</p>
                                </div>
                                <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl w-full sm:w-auto" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
                                    <Search className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                                    <input 
                                        type="text" 
                                        placeholder="Search reports..." 
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="bg-transparent text-[13px] outline-none w-full"
                                        style={{ color: 'var(--color-text-main)' }}
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-[var(--color-bg-base)]/30">
                                {enhancedReportCategories
                                    .filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                    .map((report, idx) => (
                                    <motion.div 
                                        key={report.name} 
                                        whileHover={{ y: -2 }}
                                        className="p-5 rounded-2xl flex flex-col group transition-colors cursor-pointer relative overflow-hidden"
                                        style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: `${report.color}15` }}>
                                                <report.icon className="w-5 h-5" style={{ color: report.color }} />
                                            </div>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${report.status === 'Ready' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                {report.status}
                                            </span>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h4 className="text-[15px] font-bold mb-1 group-hover:text-[var(--color-gold)] transition-colors" style={{ color: 'var(--color-text-main)' }}>{report.name}</h4>
                                            <div className="text-[12px] font-medium mb-4" style={{ color: 'var(--color-text-muted)' }}>{report.type} • {report.period}</div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between pt-4 mt-auto border-t" style={{ borderColor: 'var(--color-border)' }}>
                                            <span className="text-[11px] font-semibold" style={{ color: 'var(--color-text-muted)' }}>{report.date}</span>
                                            {report.status === 'Ready' ? (
                                                <button className="flex items-center gap-1.5 text-[12px] font-bold hover:opacity-80 transition-opacity" style={{ color: 'var(--color-gold)' }}>
                                                    Download <Download className="w-3.5 h-3.5" />
                                                </button>
                                            ) : (
                                                <span className="text-[12px] font-bold italic" style={{ color: 'var(--color-text-muted)' }}>Generating...</span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                    </div>
                </motion.div>
            </div>
        </div>
    );
}
