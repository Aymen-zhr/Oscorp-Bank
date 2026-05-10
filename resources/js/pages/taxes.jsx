import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import {
    Receipt,
    Download,
    Upload,
    Calendar,
    AlertCircle,
    CheckCircle,
    Clock,
    TrendingUp,
    Calculator,
    Building2,
    Briefcase,
    FileText,
    Search,
} from 'lucide-react';
import { useState } from 'react';
import { COLORS } from '@/constants';

const ICON_MAP = {
    CheckCircle,
    Clock,
    TrendingUp,
    Receipt,
    Calendar,
};

export default function Taxes({
    taxDocuments = [],
    taxCategories = [],
    upcomingDeadlines = [],
    stats = {},
}) {
    const { t } = useTranslation();
    const { format: formatCurrency, code } = useCurrency();
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
        if (taxableIncome <= 30000) {
            tax = 0;
        } else if (taxableIncome <= 50000) {
            tax = (taxableIncome - 30000) * 0.1;
        } else if (taxableIncome <= 60000) {
            tax = 2000 + (taxableIncome - 50000) * 0.2;
        } else if (taxableIncome <= 80000) {
            tax = 4000 + (taxableIncome - 60000) * 0.3;
        } else if (taxableIncome <= 180000) {
            tax = 10000 + (taxableIncome - 80000) * 0.34;
        } else {
            tax = 44000 + (taxableIncome - 180000) * 0.38;
        }

        let effectiveRate = gross > 0 ? (tax / gross) * 100 : 0;

        return {
            taxableIncome: taxableIncome,
            estimatedTax: tax,
            effectiveRate: effectiveRate,
            netIncome: gross - tax,
        };
    })();

    return (
        <div
            className="flex h-screen w-full overflow-hidden font-sans antialiased"
            style={{ background: 'var(--color-bg-base)' }}
        >
            <Head title="OSCORP | Taxes" />
            <Sidebar active="taxes" />
            <div className="relative flex flex-1 flex-col overflow-hidden">
                {/* Background Fixed Glows (Stabilized) */}
                <div className="pointer-events-none fixed top-0 right-0 z-0 h-[500px] w-[500px] rounded-full bg-[var(--color-gold)] opacity-[0.03] blur-[120px]" />
                <div className="pointer-events-none fixed bottom-0 left-0 z-0 h-[400px] w-[400px] rounded-full bg-blue-500 opacity-[0.02] blur-[100px]" />

                <Topbar />
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.05 },
                        },
                    }}
                    className="flex-1 overflow-y-auto px-6 py-8"
                >
                    <div className="mx-auto max-w-7xl space-y-8">
                        {/* ── Header ── */}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: -20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            className="flex flex-col justify-between gap-4 md:flex-row md:items-end"
                        >
                            <div>
                                <h1
                                    className="text-[28px] font-bold tracking-tight"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    Tax Center
                                </h1>
                                <p
                                    className="mt-1 text-[14px]"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    Track tax obligations, manage documents, and
                                    calculate estimates.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-bold transition-all hover:opacity-80"
                                    style={{
                                        background: 'var(--color-bg-elevated)',
                                        border: '1px solid var(--color-border)',
                                        color: 'var(--color-text-main)',
                                    }}
                                >
                                    <Upload className="h-4 w-4" /> Upload
                                    Document
                                </button>
                                <button
                                    onClick={() => setActiveTab('estimator')}
                                    className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold transition-all hover:opacity-80"
                                    style={{
                                        background: 'var(--color-gold)',
                                        color: '#000',
                                        boxShadow:
                                            '0 4px 15px rgba(212,175,55,0.3)',
                                    }}
                                >
                                    <Calculator className="h-4 w-4" /> Tax
                                    Estimator
                                </button>
                            </div>
                        </motion.div>

                        {/* ── Stats ── */}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4"
                        >
                            {[
                                {
                                    label: 'Total Paid (YTD)',
                                    value: `${code} ${formatCurrency(stats.totalPaidThisYear || 0)}`,
                                    icon: CheckCircle,
                                    color: COLORS.credit,
                                },
                                {
                                    label: 'Pending Payment',
                                    value: `${code} ${formatCurrency(stats.pendingPayment || 0)}`,
                                    icon: Clock,
                                    color: COLORS.warning,
                                },
                                {
                                    label: t(
                                        'taxes.stats.estimated',
                                        'Estimated Annual',
                                    ),
                                    value: `${formatCurrency(stats.estimatedAnnual || 0)} ${code}`,
                                    icon: TrendingUp,
                                    color: '#3B82F6',
                                },
                                {
                                    label: t(
                                        'taxes.stats.deductions',
                                        'Tax Deductions',
                                    ),
                                    value: `${formatCurrency(stats.taxDeductions || 0)} ${code}`,
                                    icon: Receipt,
                                    color: 'var(--color-gold)',
                                },
                            ].map((stat, idx) => (
                                <motion.div
                                    key={stat.label}
                                    whileHover={{ y: -4 }}
                                    className="group relative overflow-hidden rounded-[24px] p-6"
                                    style={{
                                        background: 'var(--color-bg-card)',
                                        border: '1px solid var(--color-border)',
                                    }}
                                >
                                    <div
                                        className="absolute top-0 right-0 h-24 w-24 translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-[20px] transition-opacity group-hover:opacity-10"
                                        style={{ background: stat.color }}
                                    />
                                    <div className="relative z-10 mb-4 flex items-center justify-between">
                                        <div
                                            className="flex h-10 w-10 items-center justify-center rounded-xl"
                                            style={{
                                                background: `${stat.color}15`,
                                                border: `1px solid ${stat.color}30`,
                                            }}
                                        >
                                            <stat.icon
                                                className="h-5 w-5"
                                                style={{ color: stat.color }}
                                            />
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <div
                                            className="mb-1 text-[12px] font-bold tracking-[0.1em] uppercase"
                                            style={{
                                                color: 'var(--color-text-muted)',
                                            }}
                                        >
                                            {stat.label}
                                        </div>
                                        <div
                                            className="text-[22px] font-bold"
                                            style={{
                                                color: 'var(--color-text-main)',
                                            }}
                                        >
                                            {stat.value}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* ── Tabs ── */}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                        >
                            <div className="mb-6 flex flex-wrap gap-2">
                                {[
                                    { id: 'overview', label: 'Tax Overview' },
                                    { id: 'documents', label: 'Documents' },
                                    { id: 'deadlines', label: 'Deadlines' },
                                    { id: 'estimator', label: 'Tax Estimator' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`rounded-xl px-5 py-2.5 text-[14px] font-bold transition-all ${activeTab === tab.id ? 'text-[var(--color-gold-fg)]' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-main)]'}`}
                                        style={
                                            activeTab === tab.id
                                                ? {
                                                      background:
                                                          'var(--color-gold)',
                                                      boxShadow:
                                                          '0 4px 15px rgba(212,175,55,0.2)',
                                                  }
                                                : {
                                                      border: '1px solid transparent',
                                                  }
                                        }
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* ── Overview Content ── */}
                            {activeTab === 'overview' && (
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="rounded-[24px] p-6 lg:p-8"
                                        style={{
                                            background: 'var(--color-bg-card)',
                                            border: '1px solid var(--color-border)',
                                        }}
                                    >
                                        <h3
                                            className="mb-6 text-[18px] font-bold"
                                            style={{
                                                color: 'var(--color-text-main)',
                                            }}
                                        >
                                            Tax Breakdown
                                        </h3>
                                        <div className="space-y-6">
                                            {taxCategories.map((item) => (
                                                <div
                                                    key={item.category}
                                                    className="group"
                                                >
                                                    <div className="mb-2 flex items-center justify-between text-[14px] font-medium">
                                                        <span
                                                            style={{
                                                                color: 'var(--color-text-main)',
                                                            }}
                                                        >
                                                            {item.category}
                                                        </span>
                                                        <span
                                                            style={{
                                                                color: 'var(--color-text-main)',
                                                            }}
                                                        >
                                                            {code}{' '}
                                                            {formatCurrency(
                                                                calcResults.netIncome,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="h-2 overflow-hidden rounded-full"
                                                        style={{
                                                            background:
                                                                'var(--color-bg-elevated)',
                                                        }}
                                                    >
                                                        <motion.div
                                                            initial={{
                                                                width: 0,
                                                            }}
                                                            animate={{
                                                                width: `${item.percentage}%`,
                                                            }}
                                                            transition={{
                                                                duration: 1,
                                                            }}
                                                            className="relative h-full rounded-full"
                                                            style={{
                                                                background:
                                                                    item.color,
                                                            }}
                                                        >
                                                            <div
                                                                className="absolute inset-0 bg-white/20"
                                                                style={{
                                                                    backgroundImage:
                                                                        'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)',
                                                                    backgroundSize:
                                                                        '1rem 1rem',
                                                                }}
                                                            />
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="rounded-[24px] p-6 lg:p-8"
                                        style={{
                                            background: 'var(--color-bg-card)',
                                            border: '1px solid var(--color-border)',
                                        }}
                                    >
                                        <h3
                                            className="mb-6 text-[18px] font-bold"
                                            style={{
                                                color: 'var(--color-text-main)',
                                            }}
                                        >
                                            Upcoming Deadlines
                                        </h3>
                                        <div className="space-y-4">
                                            {upcomingDeadlines
                                                .slice(0, 3)
                                                .map((deadline, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center justify-between rounded-xl p-4"
                                                        style={{
                                                            background:
                                                                'var(--color-bg-elevated)',
                                                            border: '1px solid var(--color-border)',
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-bg-base)]">
                                                                <Calendar className="h-5 w-5 text-[var(--color-gold)]" />
                                                            </div>
                                                            <div>
                                                                <div
                                                                    className="text-[14px] font-bold"
                                                                    style={{
                                                                        color: 'var(--color-text-main)',
                                                                    }}
                                                                >
                                                                    {
                                                                        deadline.description
                                                                    }
                                                                </div>
                                                                <div
                                                                    className="mt-0.5 text-[12px] font-medium"
                                                                    style={{
                                                                        color: 'var(--color-text-muted)',
                                                                    }}
                                                                >
                                                                    {
                                                                        deadline.deadline
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={`rounded-md px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase ${deadline.daysLeft < 30 ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}
                                                        >
                                                            {deadline.daysLeft}{' '}
                                                            Days
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                        <div
                                            className="mt-6 flex items-start gap-3 rounded-xl p-4"
                                            style={{
                                                background:
                                                    'rgba(212,175,55,0.05)',
                                                border: '1px solid rgba(212,175,55,0.2)',
                                            }}
                                        >
                                            <AlertCircle
                                                className="mt-0.5 h-5 w-5 shrink-0"
                                                style={{
                                                    color: 'var(--color-gold)',
                                                }}
                                            />
                                            <div
                                                className="text-[12px] leading-relaxed font-medium"
                                                style={{
                                                    color: 'var(--color-gold)',
                                                }}
                                            >
                                                Action Required: You have a
                                                quarterly tax payment coming up.
                                                We recommend setting up auto-pay
                                                to avoid any late penalties.
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}

                            {/* ── Documents Content ── */}
                            {activeTab === 'documents' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="overflow-hidden rounded-[24px]"
                                    style={{
                                        background: 'var(--color-bg-card)',
                                        border: '1px solid var(--color-border)',
                                    }}
                                >
                                    <div
                                        className="flex flex-col justify-between gap-4 border-b p-6 md:flex-row md:items-center"
                                        style={{
                                            borderColor: 'var(--color-border)',
                                        }}
                                    >
                                        <div>
                                            <h3
                                                className="text-[18px] font-bold"
                                                style={{
                                                    color: 'var(--color-text-main)',
                                                }}
                                            >
                                                Tax Document Library
                                            </h3>
                                            <p
                                                className="mt-0.5 text-[13px]"
                                                style={{
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                Access your previously filed
                                                returns and summaries
                                            </p>
                                        </div>
                                        <div
                                            className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2 md:w-auto"
                                            style={{
                                                background:
                                                    'var(--color-bg-elevated)',
                                                border: '1px solid var(--color-border)',
                                            }}
                                        >
                                            <Search
                                                className="h-4 w-4"
                                                style={{
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Search documents..."
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full bg-transparent text-[13px] outline-none"
                                                style={{
                                                    color: 'var(--color-text-main)',
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 bg-[var(--color-bg-base)]/30 p-6 md:grid-cols-2 lg:grid-cols-3">
                                        {taxDocuments
                                            .filter((d) =>
                                                d.name
                                                    .toLowerCase()
                                                    .includes(
                                                        searchQuery.toLowerCase(),
                                                    ),
                                            )
                                            .map((doc, idx) => {
                                                const Icon =
                                                    ICON_MAP[doc.icon] ||
                                                    FileText;
                                                return (
                                                    <motion.div
                                                        key={doc.id}
                                                        whileHover={{ y: -2 }}
                                                        className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl p-5 transition-colors"
                                                        style={{
                                                            background:
                                                                'var(--color-bg-elevated)',
                                                            border: '1px solid var(--color-border)',
                                                        }}
                                                    >
                                                        <div className="mb-4 flex items-start justify-between">
                                                            <div
                                                                className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                                                                style={{
                                                                    background:
                                                                        'rgba(212,175,55,0.1)',
                                                                }}
                                                            >
                                                                <Icon
                                                                    className="h-5 w-5"
                                                                    style={{
                                                                        color: 'var(--color-gold)',
                                                                    }}
                                                                />
                                                            </div>
                                                            <span
                                                                className={`rounded-md px-2 py-1 text-[10px] font-bold tracking-wider uppercase ${doc.status === 'Filed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}
                                                            >
                                                                {doc.status}
                                                            </span>
                                                        </div>

                                                        <div className="flex-1">
                                                            <h4
                                                                className="mb-1 text-[15px] font-bold transition-colors group-hover:text-[var(--color-gold)]"
                                                                style={{
                                                                    color: 'var(--color-text-main)',
                                                                }}
                                                            >
                                                                {doc.name}
                                                            </h4>
                                                            <div
                                                                className="mb-4 text-[12px] font-medium"
                                                                style={{
                                                                    color: 'var(--color-text-muted)',
                                                                }}
                                                            >
                                                                {doc.type} •{' '}
                                                                {code}{' '}
                                                                {formatCurrency(
                                                                    doc.amount,
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div
                                                            className="mt-auto flex items-center justify-between border-t pt-4"
                                                            style={{
                                                                borderColor:
                                                                    'var(--color-border)',
                                                            }}
                                                        >
                                                            <span
                                                                className="text-[11px] font-semibold"
                                                                style={{
                                                                    color: 'var(--color-text-muted)',
                                                                }}
                                                            >
                                                                Filed:{' '}
                                                                {doc.date}
                                                            </span>
                                                            <button
                                                                className="flex items-center gap-1.5 text-[12px] font-bold transition-opacity hover:opacity-80"
                                                                style={{
                                                                    color: 'var(--color-gold)',
                                                                }}
                                                            >
                                                                Download{' '}
                                                                <Download className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                    </div>
                                </motion.div>
                            )}

                            {/* ── Deadlines Content ── */}
                            {activeTab === 'deadlines' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-4"
                                >
                                    {upcomingDeadlines.map(
                                        (deadline, index) => (
                                            <div
                                                key={index}
                                                className="rounded-[24px] p-6"
                                                style={{
                                                    background:
                                                        'var(--color-bg-card)',
                                                    border: '1px solid var(--color-border)',
                                                }}
                                            >
                                                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                                                    <div className="flex items-start gap-5">
                                                        <div
                                                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                                                            style={{
                                                                background:
                                                                    'var(--color-gold-bg)',
                                                            }}
                                                        >
                                                            <Calendar
                                                                className="h-6 w-6"
                                                                style={{
                                                                    color: 'var(--color-gold)',
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <h3
                                                                className="mb-1 text-[18px] font-bold"
                                                                style={{
                                                                    color: 'var(--color-text-main)',
                                                                }}
                                                            >
                                                                {
                                                                    deadline.description
                                                                }
                                                            </h3>
                                                            <div
                                                                className="flex items-center gap-2 text-[13px] font-medium"
                                                                style={{
                                                                    color: 'var(--color-text-muted)',
                                                                }}
                                                            >
                                                                <Clock className="h-4 w-4" />
                                                                <span>
                                                                    {code}{' '}
                                                                    {formatCurrency(
                                                                        calcResults.netIncome,
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between md:flex-col md:items-end md:text-right">
                                                        <div>
                                                            <div
                                                                className={`text-[32px] leading-none font-bold ${deadline.daysLeft < 30 ? 'text-red-500' : 'text-[var(--color-gold)]'}`}
                                                            >
                                                                {
                                                                    deadline.daysLeft
                                                                }
                                                            </div>
                                                            <div
                                                                className="mt-1 text-[11px] font-bold tracking-widest uppercase"
                                                                style={{
                                                                    color: 'var(--color-text-muted)',
                                                                }}
                                                            >
                                                                Days Remaining
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className="mt-6 flex flex-col gap-3 border-t pt-6 sm:flex-row"
                                                    style={{
                                                        borderColor:
                                                            'var(--color-border)',
                                                    }}
                                                >
                                                    <button
                                                        className="flex-1 rounded-xl py-2.5 text-[14px] font-bold transition-opacity hover:opacity-90"
                                                        style={{
                                                            background:
                                                                'var(--color-gold)',
                                                            color: '#000',
                                                        }}
                                                    >
                                                        Pay Now
                                                    </button>
                                                    <button
                                                        className="flex-1 rounded-xl py-2.5 text-[14px] font-bold transition-all hover:bg-[var(--color-bg-base)]"
                                                        style={{
                                                            background:
                                                                'transparent',
                                                            border: '1px solid var(--color-border)',
                                                            color: 'var(--color-text-main)',
                                                        }}
                                                    >
                                                        Set Reminder
                                                    </button>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </motion.div>
                            )}

                            {/* ── Tax Estimator Content ── */}
                            {activeTab === 'estimator' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid grid-cols-1 gap-6 lg:grid-cols-5"
                                >
                                    <div
                                        className="rounded-[24px] p-6 lg:col-span-3 lg:p-8"
                                        style={{
                                            background: 'var(--color-bg-card)',
                                            border: '1px solid var(--color-border)',
                                        }}
                                    >
                                        <div
                                            className="mb-8 flex items-center gap-3 border-b pb-6"
                                            style={{
                                                borderColor:
                                                    'var(--color-border)',
                                            }}
                                        >
                                            <div
                                                className="flex h-10 w-10 items-center justify-center rounded-xl"
                                                style={{
                                                    background:
                                                        'rgba(212,175,55,0.15)',
                                                }}
                                            >
                                                <Calculator className="h-5 w-5 text-[var(--color-gold)]" />
                                            </div>
                                            <div>
                                                <h3
                                                    className="text-[18px] font-bold"
                                                    style={{
                                                        color: 'var(--color-text-main)',
                                                    }}
                                                >
                                                    Progressive Tax Estimator
                                                </h3>
                                                <p
                                                    className="text-[13px] font-medium"
                                                    style={{
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    Estimate your tax liability
                                                    based on Moroccan tax
                                                    brackets.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div>
                                                <div className="mb-2 flex justify-between">
                                                    <label
                                                        className="text-[13px] font-bold tracking-wider uppercase"
                                                        style={{
                                                            color: 'var(--color-text-muted)',
                                                        }}
                                                    >
                                                        Gross Annual Income
                                                    </label>
                                                    <span
                                                        className="text-[15px] font-bold"
                                                        style={{
                                                            color: 'var(--color-text-main)',
                                                        }}
                                                    >
                                                        {code}{' '}
                                                        {formatCurrency(
                                                            calcGross,
                                                        )}
                                                    </span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="30000"
                                                    max="2000000"
                                                    step="10000"
                                                    value={calcGross}
                                                    onChange={(e) =>
                                                        setCalcGross(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full cursor-pointer accent-[var(--color-gold)]"
                                                />
                                            </div>

                                            <div>
                                                <div className="mb-2 flex justify-between">
                                                    <label
                                                        className="text-[13px] font-bold tracking-wider uppercase"
                                                        style={{
                                                            color: 'var(--color-text-muted)',
                                                        }}
                                                    >
                                                        Total Deductions
                                                    </label>
                                                    <span className="text-[15px] font-bold text-emerald-400">
                                                        {code}{' '}
                                                        {formatCurrency(
                                                            calcDeductions,
                                                        )}
                                                    </span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="500000"
                                                    step="5000"
                                                    value={calcDeductions}
                                                    onChange={(e) =>
                                                        setCalcDeductions(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full cursor-pointer accent-[var(--color-gold)]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="relative flex flex-col justify-center overflow-hidden rounded-[24px] p-6 lg:col-span-2 lg:p-8"
                                        style={{
                                            background: 'var(--color-bg-card)',
                                            border: '1px solid var(--color-border)',
                                        }}
                                    >
                                        <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/2 rounded-full bg-[var(--color-gold)] opacity-5 blur-[60px]" />

                                        <h3
                                            className="mb-8 text-center text-[14px] font-bold tracking-widest uppercase"
                                            style={{
                                                color: 'var(--color-gold)',
                                            }}
                                        >
                                            Estimated Results
                                        </h3>

                                        <div className="relative z-10 mb-8 text-center">
                                            <div
                                                className="mb-2 text-[12px] font-semibold"
                                                style={{
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                Estimated Tax Due
                                            </div>
                                            <div
                                                className="text-[42px] leading-none font-bold tracking-tight"
                                                style={{
                                                    color: 'var(--color-text-main)',
                                                }}
                                            >
                                                {code}{' '}
                                                {formatCurrency(
                                                    calcResults.estimatedTax,
                                                )}
                                            </div>
                                        </div>

                                        <div
                                            className="relative z-10 space-y-4 border-t pt-6"
                                            style={{
                                                borderColor:
                                                    'var(--color-border)',
                                            }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className="text-[13px] font-medium"
                                                    style={{
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    Taxable Income
                                                </span>
                                                <span
                                                    className="text-[14px] font-bold"
                                                    style={{
                                                        color: 'var(--color-text-main)',
                                                    }}
                                                >
                                                    {code}{' '}
                                                    {formatCurrency(
                                                        calcResults.taxableIncome,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className="text-[13px] font-medium"
                                                    style={{
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    Effective Tax Rate
                                                </span>
                                                <span className="text-[14px] font-bold text-emerald-500">
                                                    {calcResults.effectiveRate.toFixed(
                                                        1,
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className="text-[13px] font-medium"
                                                    style={{
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    Estimated Net Income
                                                </span>
                                                <span
                                                    className="text-[14px] font-bold"
                                                    style={{
                                                        color: 'var(--color-text-main)',
                                                    }}
                                                >
                                                    {code}{' '}
                                                    {formatCurrency(
                                                        calcResults.taxableIncome,
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div
                                            className="relative z-10 mt-8 rounded-xl p-4"
                                            style={{
                                                background:
                                                    'var(--color-bg-elevated)',
                                                border: '1px solid var(--color-border)',
                                            }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <AlertCircle
                                                    className="mt-0.5 h-5 w-5 shrink-0"
                                                    style={{
                                                        color: 'var(--color-gold)',
                                                    }}
                                                />
                                                <div
                                                    className="text-[11px] leading-relaxed"
                                                    style={{
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    This estimate assumes
                                                    standard progressive tax
                                                    brackets and does not
                                                    substitute professional tax
                                                    advice.
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
