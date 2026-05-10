import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import {
    FileText,
    TrendingUp,
    TrendingDown,
    Download,
    Calendar,
    BarChart3,
    PieChart,
    LineChart,
    ArrowUpRight,
    ArrowDownLeft,
    Wallet,
    Search,
    Home,
    ShoppingBag,
    Car,
    Coffee,
    Zap,
    Plus,
} from 'lucide-react';
import { useState } from 'react';
import { COLORS } from '@/constants';

const ICON_MAP = {
    TrendingUp,
    TrendingDown,
    BarChart3,
    PieChart,
    LineChart,
    FileText,
};

const CATEGORY_STYLES = {
    'Housing & Rent': { color: COLORS.purple, icon: Home },
    'Food & Dining': { color: COLORS.warning, icon: Coffee },
    Transportation: { color: '#3B82F6', icon: Car },
    Shopping: { color: '#EC4899', icon: ShoppingBag },
    Utilities: { color: COLORS.debit, icon: Zap },
    Other: { color: COLORS.credit, icon: Plus },
    default: { color: '#6B7280', icon: FileText },
};

export default function Reports({
    stats,
    monthlyData = [],
    spendingCategories = [],
    reportCategories = [],
}) {
    const { t } = useTranslation();
    const { format, code } = useCurrency();
    const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
    const [searchQuery, setSearchQuery] = useState('');

    const maxMonthlyValue =
        Math.max(
            ...monthlyData.map((d) => Math.max(d.income, d.expenses)),
            1000,
        ) * 1.1;

    const enhancedSpendingCategories = spendingCategories.map((cat) => ({
        ...cat,
        ...(CATEGORY_STYLES[cat.category] || CATEGORY_STYLES.default),
    }));

    const enhancedReportCategories = reportCategories.map((report) => ({
        ...report,
        icon: ICON_MAP[report.icon] || FileText,
    }));

    return (
        <div
            className="flex h-screen w-full overflow-hidden"
            style={{ background: 'var(--color-bg-base)' }}
        >
            <Head title="OSCORP | Reports" />
            <Sidebar active="reports" />
            <div className="flex flex-1 flex-col overflow-hidden">
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
                                    {t('reports.title', 'Financial Analytics')}
                                </h1>
                                <p
                                    className="mt-1 text-[14px]"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    {t(
                                        'reports.subtitle',
                                        'Analyze your cash flow, spending patterns, and generate reports.',
                                    )}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div
                                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all"
                                    style={{
                                        background: 'var(--color-bg-elevated)',
                                        border: '1px solid var(--color-border)',
                                    }}
                                >
                                    <Calendar className="h-4 w-4 text-[var(--color-text-muted)]" />
                                    <select
                                        value={selectedPeriod}
                                        onChange={(e) =>
                                            setSelectedPeriod(e.target.value)
                                        }
                                        className="cursor-pointer bg-transparent text-[13px] font-medium outline-none"
                                        style={{
                                            color: 'var(--color-text-main)',
                                        }}
                                    >
                                        <option value="Monthly">
                                            {t(
                                                'reports.monthly',
                                                'Monthly View',
                                            )}
                                        </option>
                                        <option value="Quarterly">
                                            {t(
                                                'reports.quarterly',
                                                'Quarterly View',
                                            )}
                                        </option>
                                        <option value="Annual">
                                            {t('reports.annual', 'Annual View')}
                                        </option>
                                    </select>
                                </div>
                                <button
                                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-medium transition-all hover:opacity-80"
                                    style={{
                                        background: 'var(--color-gold-bg)',
                                        color: 'var(--color-gold)',
                                        border: '1px solid var(--color-gold)/20',
                                    }}
                                >
                                    <Download className="h-4 w-4" />
                                    Export Data
                                </button>
                            </div>
                        </motion.div>

                        {/* ── Top Stat Cards ── */}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            className="grid grid-cols-1 gap-5 md:grid-cols-3"
                        >
                            {[
                                {
                                    label: 'Total Income',
                                    value: stats?.total_credits || '0',
                                    change: '+12.5%',
                                    positive: true,
                                    icon: ArrowDownLeft,
                                    color: '#34D399',
                                    bg: 'rgba(52,211,153,0.05)',
                                },
                                {
                                    label: 'Total Expenses',
                                    value: stats?.total_debits || '0',
                                    change: '-3.2%',
                                    positive: true,
                                    icon: ArrowUpRight,
                                    color: COLORS.debit,
                                    bg: `${COLORS.debit}0D`,
                                },
                                {
                                    label: 'Net Savings',
                                    value: stats?.net_savings || '0',
                                    change: stats?.net_savings_change || '+0%',
                                    positive:
                                        stats?.net_savings_positive ?? true,
                                    icon: Wallet,
                                    color: 'var(--color-gold)',
                                    bg: 'var(--color-gold-bg)',
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
                                        className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[40px] transition-opacity group-hover:opacity-40"
                                        style={{ background: stat.color }}
                                    />

                                    <div className="relative z-10 mb-4 flex items-start justify-between">
                                        <div
                                            className="flex h-12 w-12 items-center justify-center rounded-2xl"
                                            style={{
                                                background: stat.bg,
                                                border: `1px solid ${stat.color}30`,
                                            }}
                                        >
                                            <stat.icon
                                                className="h-6 w-6"
                                                style={{ color: stat.color }}
                                            />
                                        </div>
                                        <div
                                            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${stat.positive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}
                                        >
                                            {stat.change}
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <div
                                            className="mb-1 text-[12px] font-bold tracking-[0.15em] uppercase"
                                            style={{
                                                color: 'var(--color-text-muted)',
                                            }}
                                        >
                                            {stat.label}
                                        </div>
                                        <div
                                            className="text-[32px] leading-none font-bold"
                                            style={{
                                                color: 'var(--color-text-main)',
                                            }}
                                        >
                                            {stat.value}{' '}
                                            <span className="text-[14px] font-medium opacity-50">
                                                {code}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* ── Charts Section ── */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                            {/* Trend Chart */}
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, x: -20 },
                                    visible: { opacity: 1, x: 0 },
                                }}
                                className="flex flex-col rounded-[24px] p-6 lg:col-span-3"
                                style={{
                                    background: 'var(--color-bg-card)',
                                    border: '1px solid var(--color-border)',
                                }}
                            >
                                <div className="mb-8 flex items-center justify-between">
                                    <div>
                                        <h3
                                            className="text-[18px] font-bold"
                                            style={{
                                                color: 'var(--color-text-main)',
                                            }}
                                        >
                                            {t(
                                                'reports.cash_flow',
                                                'Cash Flow Trend',
                                            )}
                                        </h3>
                                        <p
                                            className="mt-0.5 text-[13px]"
                                            style={{
                                                color: 'var(--color-text-muted)',
                                            }}
                                        >
                                            {t(
                                                'reports.cash_flow_desc',
                                                'Income vs Expenses over the last 6 months',
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 text-[12px] font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-[#34D399]" />
                                            <span
                                                style={{
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                Income
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-3 w-3 rounded-full"
                                                style={{
                                                    background: COLORS.debit,
                                                }}
                                            />
                                            <span
                                                style={{
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                Expenses
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex h-[240px] flex-1 items-end justify-between gap-2 pb-2">
                                    {monthlyData.map((item, idx) => (
                                        <div
                                            key={item.month}
                                            className="group flex flex-1 flex-col items-center gap-3"
                                        >
                                            <div className="relative flex h-full w-full items-end justify-center gap-1.5">
                                                {/* Tooltip on hover */}
                                                <div className="pointer-events-none absolute -top-12 z-20 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-[11px] whitespace-nowrap opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                                                    <div className="font-bold text-emerald-400">
                                                        In:{' '}
                                                        {item.income.toLocaleString()}
                                                    </div>
                                                    <div className="font-bold text-red-400">
                                                        Out:{' '}
                                                        {item.expenses.toLocaleString()}
                                                    </div>
                                                </div>

                                                {/* Income Bar */}
                                                <div
                                                    className="w-1/3 max-w-[24px] rounded-t-md bg-[#34D399] opacity-80 transition-all duration-500 ease-out group-hover:opacity-100"
                                                    style={{
                                                        height: `${(item.income / maxMonthlyValue) * 100}%`,
                                                        boxShadow:
                                                            '0 0 10px rgba(52,211,153,0.2)',
                                                    }}
                                                />
                                                {/* Expense Bar */}
                                                <div
                                                    className="w-1/3 max-w-[24px] rounded-t-md opacity-80 transition-all duration-500 ease-out group-hover:opacity-100"
                                                    style={{
                                                        background:
                                                            COLORS.debit,
                                                    }}
                                                    style={{
                                                        height: `${(item.expenses / maxMonthlyValue) * 100}%`,
                                                        boxShadow:
                                                            '0 0 10px rgba(239,68,68,0.2)',
                                                    }}
                                                />
                                            </div>
                                            <div
                                                className="text-[12px] font-semibold"
                                                style={{
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                {item.month}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Spending Breakdown */}
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, x: 20 },
                                    visible: { opacity: 1, x: 0 },
                                }}
                                className="flex flex-col rounded-[24px] p-6 lg:col-span-2"
                                style={{
                                    background: 'var(--color-bg-card)',
                                    border: '1px solid var(--color-border)',
                                }}
                            >
                                <div className="mb-6">
                                    <h3
                                        className="text-[18px] font-bold"
                                        style={{
                                            color: 'var(--color-text-main)',
                                        }}
                                    >
                                        {t(
                                            'reports.spending',
                                            'Spending Breakdown',
                                        )}
                                    </h3>
                                    <p
                                        className="mt-0.5 text-[13px]"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                        }}
                                    >
                                        {t(
                                            'reports.spending_desc',
                                            'Where your money goes this period',
                                        )}
                                    </p>
                                </div>

                                <div className="flex-1 space-y-5">
                                    {enhancedSpendingCategories.map(
                                        (item, idx) => (
                                            <div
                                                key={item.category}
                                                className="group"
                                            >
                                                <div className="mb-2 flex items-center justify-between">
                                                    <div className="flex items-center gap-2.5">
                                                        <div
                                                            className="flex h-7 w-7 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
                                                            style={{
                                                                background: `${item.color}15`,
                                                            }}
                                                        >
                                                            <item.icon
                                                                className="h-3.5 w-3.5"
                                                                style={{
                                                                    color: item.color,
                                                                }}
                                                            />
                                                        </div>
                                                        <span
                                                            className="text-[14px] font-medium"
                                                            style={{
                                                                color: 'var(--color-text-main)',
                                                            }}
                                                        >
                                                            {item.category}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span
                                                            className="text-[14px] font-bold"
                                                            style={{
                                                                color: 'var(--color-text-main)',
                                                            }}
                                                        >
                                                            {item.amount}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div
                                                    className="h-1.5 overflow-hidden rounded-full"
                                                    style={{
                                                        background:
                                                            'var(--color-bg-elevated)',
                                                    }}
                                                >
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{
                                                            width: `${item.percentage}%`,
                                                        }}
                                                        transition={{
                                                            duration: 1,
                                                            delay:
                                                                0.2 + idx * 0.1,
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
                                        ),
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* ── Generated Reports Library ── */}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            className="overflow-hidden rounded-[24px]"
                            style={{
                                background: 'var(--color-bg-card)',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            <div
                                className="flex flex-col justify-between gap-4 border-b p-6 sm:flex-row sm:items-center"
                                style={{ borderColor: 'var(--color-border)' }}
                            >
                                <div>
                                    <h3
                                        className="text-[18px] font-bold"
                                        style={{
                                            color: 'var(--color-text-main)',
                                        }}
                                    >
                                        {t(
                                            'reports.library',
                                            'Document Library',
                                        )}
                                    </h3>
                                    <p
                                        className="mt-0.5 text-[13px]"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                        }}
                                    >
                                        {t(
                                            'reports.library_desc',
                                            'Access your previously generated reports',
                                        )}
                                    </p>
                                </div>
                                <div
                                    className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2 sm:w-auto"
                                    style={{
                                        background: 'var(--color-bg-elevated)',
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
                                        placeholder="Search reports..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-full bg-transparent text-[13px] outline-none"
                                        style={{
                                            color: 'var(--color-text-main)',
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 bg-[var(--color-bg-base)]/30 p-6 md:grid-cols-2 lg:grid-cols-3">
                                {enhancedReportCategories
                                    .filter((r) =>
                                        r.name
                                            .toLowerCase()
                                            .includes(
                                                searchQuery.toLowerCase(),
                                            ),
                                    )
                                    .map((report, idx) => (
                                        <motion.div
                                            key={report.name}
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
                                                        background: `${report.color}15`,
                                                    }}
                                                >
                                                    <report.icon
                                                        className="h-5 w-5"
                                                        style={{
                                                            color: report.color,
                                                        }}
                                                    />
                                                </div>
                                                <span
                                                    className={`rounded-md px-2 py-1 text-[10px] font-bold tracking-wider uppercase ${report.status === 'Ready' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}
                                                >
                                                    {report.status}
                                                </span>
                                            </div>

                                            <div className="flex-1">
                                                <h4
                                                    className="mb-1 text-[15px] font-bold transition-colors group-hover:text-[var(--color-gold)]"
                                                    style={{
                                                        color: 'var(--color-text-main)',
                                                    }}
                                                >
                                                    {report.name}
                                                </h4>
                                                <div
                                                    className="mb-4 text-[12px] font-medium"
                                                    style={{
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    {report.type} •{' '}
                                                    {report.period}
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
                                                    {report.date}
                                                </span>
                                                {report.status === 'Ready' ? (
                                                    <button
                                                        className="flex items-center gap-1.5 text-[12px] font-bold transition-opacity hover:opacity-80"
                                                        style={{
                                                            color: 'var(--color-gold)',
                                                        }}
                                                    >
                                                        Download{' '}
                                                        <Download className="h-3.5 w-3.5" />
                                                    </button>
                                                ) : (
                                                    <span
                                                        className="text-[12px] font-bold italic"
                                                        style={{
                                                            color: 'var(--color-text-muted)',
                                                        }}
                                                    >
                                                        Generating...
                                                    </span>
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
