import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { useTranslation } from '@/hooks/useTranslation';
import {
    Landmark,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CheckCircle,
    AlertCircle,
    Percent,
    Calculator,
    FileText,
    Home,
    Car,
    User,
    Briefcase,
    GraduationCap,
    X,
    Check,
    XCircle,
    Clock3,
    ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { COLORS, LOAN_LIMITS } from '@/constants';
import { useCurrency } from '@/hooks/useCurrency';
import { router } from '@inertiajs/react';

const ICON_MAP = {
    Home,
    Car,
    User,
    Briefcase,
    GraduationCap,
    Landmark,
};

const STATUS_COLORS = {
    pending: {
        bg: 'rgba(245,158,11,0.15)',
        text: '#f59e0b',
        label: 'Pending Approval',
    },
    approved: {
        bg: 'rgba(16,185,129,0.15)',
        text: '#10b981',
        label: 'Approved',
    },
    active: { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6', label: 'Active' },
    rejected: {
        bg: 'rgba(239,68,68,0.15)',
        text: '#ef4444',
        label: 'Rejected',
    },
    completed: {
        bg: 'rgba(16,185,129,0.15)',
        text: '#10b981',
        label: 'Completed',
    },
};

export default function Loans({
    activeLoans = [],
    loanOffers = [],
    pendingApplications = [],
    stats = {},
}) {
    const { t } = useTranslation();
    const { format: formatCurrency, code } = useCurrency();
    const [activeTab, setActiveTab] = useState('active');
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [applyForm, setApplyForm] = useState({
        type: 'Personal Loan',
        amount: 100000,
        term_months: 60,
        purpose: '',
    });

    // Update term when loan type changes
    const handleTypeChange = (type) => {
        setApplyForm({ ...applyForm, type, term_months: getSelectedTerm() });
    };

    // Calculate monthly payment
    const getMonthlyPayment = () => {
        const p = applyForm.amount;
        const r = getSelectedRate() / 100 / 12;
        const n = applyForm.term_months;
        if (p <= 0 || n <= 0) return 0;
        return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    };

    // Calculate total repayment
    const getTotalRepayment = () => {
        const payment = getMonthlyPayment();
        if (payment <= 0) return 0;
        return payment * applyForm.term_months;
    };

    // Calculate total interest
    const getTotalInterest = () => {
        const total = getTotalRepayment();
        return total - applyForm.amount;
    };

    // Get progress percentage for visual bar
    const getProgressPct = () => {
        const total = getTotalRepayment();
        if (total <= 0) return '0%';
        return `${Math.min(100, (applyForm.amount / total) * 100)}%`;
    };
    const [applying, setApplying] = useState(false);
    const [calcMode, setCalcMode] = useState('amount');
    const [targetPayment, setTargetPayment] = useState(0);

    // Calculator State
    const [calcAmount, setCalcAmount] = useState(100000);
    const [calcRate, setCalcRate] = useState(5.5);
    const [calcTerm, setCalcTerm] = useState(5);

    // Get rate for selected loan type
    const getSelectedRate = () => {
        const rateMap = {
            'Personal Loan': 6.5,
            'Business Loan': 5.2,
            'Education Loan': 3.5,
            'Home Mortgage': 4.2,
            'Auto Loan': 5.8,
            'Investment Loan': 7.2,
        };
        return rateMap[applyForm.type] || 6.5;
    };

    // Get term for selected loan type
    const getSelectedTerm = () => {
        const termMap = {
            'Personal Loan': 60,
            'Business Loan': 120,
            'Education Loan': 84,
            'Home Mortgage': 360,
            'Auto Loan': 72,
            'Investment Loan': 60,
        };
        return termMap[applyForm.type] || 60;
    };

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
            totalPayment: totalPayment,
        };
    })();

    const handleApply = () => {
        setApplying(true);
        router.post('/loans/apply', applyForm, {
            onSuccess: () => {
                setShowApplyModal(false);
                setApplying(false);
            },
            onError: () => setApplying(false),
        });
    };

    const getStatusBadge = (status) => {
        const config = STATUS_COLORS[status] || STATUS_COLORS.pending;
        return (
            <div
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
                style={{ background: config.bg }}
            >
                {status === 'pending' && (
                    <Clock3
                        className="h-3 w-3"
                        style={{ color: config.text }}
                    />
                )}
                {status === 'approved' && (
                    <Check className="h-3 w-3" style={{ color: config.text }} />
                )}
                {status === 'active' && (
                    <CheckCircle
                        className="h-3 w-3"
                        style={{ color: config.text }}
                    />
                )}
                {status === 'rejected' && (
                    <XCircle
                        className="h-3 w-3"
                        style={{ color: config.text }}
                    />
                )}
                {status === 'completed' && (
                    <CheckCircle
                        className="h-3 w-3"
                        style={{ color: config.text }}
                    />
                )}
                <span
                    className="text-[10px] font-bold tracking-wider uppercase"
                    style={{ color: config.text }}
                >
                    {config.label}
                </span>
            </div>
        );
    };

    return (
        <div
            className="flex h-screen w-full overflow-hidden font-sans antialiased"
            style={{ background: 'var(--color-bg-base)' }}
        >
            <Head title="OSCORP | Loans" />
            <Sidebar active="loans" />
            <div className="relative flex flex-1 flex-col overflow-hidden">
                {/* Background Fixed Glows */}
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
                        {/* Header */}
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
                                    Loans & Credit
                                </h1>
                                <p
                                    className="mt-1 text-[14px]"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    Manage your active loans and explore new
                                    financing options.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowApplyModal(true)}
                                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold transition-all hover:opacity-80"
                                style={{
                                    background: 'var(--color-gold)',
                                    color: '#000',
                                    boxShadow:
                                        '0 4px 15px rgba(212,175,55,0.3)',
                                }}
                            >
                                <Plus className="h-4 w-4" /> Apply for Loan
                            </button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4"
                        >
                            {[
                                {
                                    label: t(
                                        'loans.stats.outstanding',
                                        'Total Outstanding',
                                    ),
                                    value: `${formatCurrency(stats.totalOutstanding || 0)}`,
                                    icon: Landmark,
                                    color: COLORS.warning,
                                },
                                {
                                    label: t(
                                        'loans.stats.monthly',
                                        'Monthly Payments',
                                    ),
                                    value: `${formatCurrency(stats.monthlyPayments || 0)}`,
                                    icon: ArrowUpRight,
                                    color: COLORS.debit,
                                },
                                {
                                    label: t(
                                        'loans.stats.rate',
                                        'Average Rate',
                                    ),
                                    value: `${stats.averageRate || 0}%`,
                                    icon: Percent,
                                    color: COLORS.info,
                                },
                                {
                                    label: t(
                                        'loans.stats.paid',
                                        'Paid Off This Year',
                                    ),
                                    value: `${formatCurrency(stats.paidOffThisYear || 0)}`,
                                    icon: ArrowDownRight,
                                    color: COLORS.credit,
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

                        {/* Pending Applications */}
                        {pendingApplications.length > 0 && (
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 },
                                }}
                                className="rounded-[24px] p-6"
                                style={{
                                    background: 'var(--color-bg-card)',
                                    border: '1px solid var(--color-border)',
                                }}
                            >
                                <h3
                                    className="mb-4 text-[16px] font-bold"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    Pending Applications
                                </h3>
                                <div className="space-y-3">
                                    {pendingApplications.map((app) => (
                                        <div
                                            key={app.id}
                                            className="flex items-center justify-between rounded-xl p-4"
                                            style={{
                                                background:
                                                    'var(--color-bg-elevated)',
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                {getStatusBadge('pending')}
                                                <div>
                                                    <div
                                                        className="text-[14px] font-bold"
                                                        style={{
                                                            color: 'var(--color-text-main)',
                                                        }}
                                                    >
                                                        {app.type}
                                                    </div>
                                                    <div
                                                        className="text-[11px]"
                                                        style={{
                                                            color: 'var(--color-text-muted)',
                                                        }}
                                                    >
                                                        {formatCurrency(
                                                            app.amount,
                                                        )}{' '}
                                                        • {app.term}
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="text-[11px]"
                                                style={{
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                Applied: {app.created_at}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Tabs */}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                        >
                            <div className="mb-6 flex flex-wrap gap-2">
                                {[
                                    { id: 'active', label: 'Active Loans' },
                                    { id: 'offers', label: 'Loan Offers' },
                                    {
                                        id: 'calculator',
                                        label: 'Payment Calculator',
                                    },
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

                            {/* Active Loans Content */}
                            {activeTab === 'active' && (
                                <div className="grid grid-cols-1 gap-4">
                                    {activeLoans.length === 0 ? (
                                        <div
                                            className="rounded-[24px] py-16 text-center"
                                            style={{
                                                background:
                                                    'var(--color-bg-card)',
                                                border: '1px solid var(--color-border)',
                                            }}
                                        >
                                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-bg-elevated)]">
                                                <Landmark className="h-8 w-8 text-[var(--color-text-muted)] opacity-50" />
                                            </div>
                                            <h3
                                                className="mb-1 font-bold"
                                                style={{
                                                    color: 'var(--color-text-main)',
                                                }}
                                            >
                                                No Active Loans
                                            </h3>
                                            <p
                                                className="text-[13px]"
                                                style={{
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                You don't have any outstanding
                                                credit facilities.
                                            </p>
                                        </div>
                                    ) : (
                                        activeLoans.map((loan) => (
                                            <motion.div
                                                key={loan.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex flex-col justify-between gap-6 rounded-[24px] p-6 md:flex-row md:items-center"
                                                style={{
                                                    background:
                                                        'var(--color-bg-card)',
                                                    border: '1px solid var(--color-border)',
                                                }}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className="flex h-12 w-12 items-center justify-center rounded-xl"
                                                        style={{
                                                            background:
                                                                'var(--color-bg-elevated)',
                                                        }}
                                                    >
                                                        {loan.status ===
                                                            'pending' && (
                                                            <Clock3
                                                                className="h-6 w-6"
                                                                style={{
                                                                    color: '#f59e0b',
                                                                }}
                                                            />
                                                        )}
                                                        {loan.status ===
                                                            'approved' && (
                                                            <Check
                                                                className="h-6 w-6"
                                                                style={{
                                                                    color: '#10b981',
                                                                }}
                                                            />
                                                        )}
                                                        {(loan.status ===
                                                            'active' ||
                                                            !loan.status) && (
                                                            <Landmark
                                                                className="h-6 w-6"
                                                                style={{
                                                                    color: 'var(--color-gold)',
                                                                }}
                                                            />
                                                        )}
                                                        {loan.status ===
                                                            'rejected' && (
                                                            <XCircle
                                                                className="h-6 w-6"
                                                                style={{
                                                                    color: '#ef4444',
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4
                                                                className="text-[16px] font-bold"
                                                                style={{
                                                                    color: 'var(--color-text-main)',
                                                                }}
                                                            >
                                                                {loan.type}
                                                            </h4>
                                                            {loan.status &&
                                                                getStatusBadge(
                                                                    loan.status,
                                                                )}
                                                        </div>
                                                        <div
                                                            className="text-[12px]"
                                                            style={{
                                                                color: 'var(--color-text-muted)',
                                                            }}
                                                        >
                                                            {loan.purpose ||
                                                                'General financing'}{' '}
                                                            • {loan.term}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid flex-1 grid-cols-2 gap-8 md:grid-cols-4 md:px-8">
                                                    <div>
                                                        <div
                                                            className="mb-1 text-[10px] font-bold tracking-widest uppercase"
                                                            style={{
                                                                color: 'var(--color-text-muted)',
                                                            }}
                                                        >
                                                            Outstanding
                                                        </div>
                                                        <div
                                                            className="text-[15px] font-bold"
                                                            style={{
                                                                color: 'var(--color-text-main)',
                                                            }}
                                                        >
                                                            {formatCurrency(
                                                                loan.balance ||
                                                                    loan.remaining ||
                                                                    0,
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div
                                                            className="mb-1 text-[10px] font-bold tracking-widest uppercase"
                                                            style={{
                                                                color: 'var(--color-text-muted)',
                                                            }}
                                                        >
                                                            Monthly Payment
                                                        </div>
                                                        <div
                                                            className="text-[15px] font-bold"
                                                            style={{
                                                                color: 'var(--color-text-main)',
                                                            }}
                                                        >
                                                            {formatCurrency(
                                                                loan.monthlyPayment ||
                                                                    loan.monthly_payment ||
                                                                    0,
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div
                                                            className="mb-1 text-[10px] font-bold tracking-widest uppercase"
                                                            style={{
                                                                color: 'var(--color-text-muted)',
                                                            }}
                                                        >
                                                            Interest
                                                        </div>
                                                        <div className="text-[15px] font-bold text-emerald-400">
                                                            {loan.rate}%
                                                        </div>
                                                    </div>
                                                    <div className="hidden lg:block">
                                                        <div
                                                            className="mb-1 text-[10px] font-bold tracking-widest uppercase"
                                                            style={{
                                                                color: 'var(--color-text-muted)',
                                                            }}
                                                        >
                                                            Next Due
                                                        </div>
                                                        <div
                                                            className="text-[15px] font-bold"
                                                            style={{
                                                                color: 'var(--color-text-main)',
                                                            }}
                                                        >
                                                            {loan.nextPayment ||
                                                                loan.next_payment ||
                                                                'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Loan Offers Content */}
                            {activeTab === 'offers' && (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {loanOffers.map((offer) => {
                                        const Icon =
                                            ICON_MAP[offer.icon] || Landmark;
                                        return (
                                            <motion.div
                                                key={offer.type}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="group relative flex flex-col overflow-hidden rounded-[24px] p-6 transition-all hover:-translate-y-1"
                                                style={{
                                                    background:
                                                        'var(--color-bg-card)',
                                                    border: offer.featured
                                                        ? '2px solid var(--color-gold)'
                                                        : '1px solid var(--color-border)',
                                                    boxShadow: offer.featured
                                                        ? '0 10px 30px -10px rgba(212,175,55,0.2)'
                                                        : 'none',
                                                }}
                                            >
                                                {offer.featured && (
                                                    <div
                                                        className="absolute top-4 right-4 rounded-md px-3 py-1 text-[10px] font-bold tracking-wider uppercase"
                                                        style={{
                                                            background:
                                                                'var(--color-gold)',
                                                            color: 'black',
                                                        }}
                                                    >
                                                        Recommended
                                                    </div>
                                                )}
                                                <div
                                                    className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110"
                                                    style={{
                                                        background:
                                                            offer.featured
                                                                ? 'rgba(212,175,55,0.15)'
                                                                : 'var(--color-bg-elevated)',
                                                    }}
                                                >
                                                    <Icon
                                                        className="h-7 w-7"
                                                        style={{
                                                            color: offer.featured
                                                                ? 'var(--color-gold)'
                                                                : 'var(--color-text-main)',
                                                        }}
                                                    />
                                                </div>
                                                <div className="mb-6 flex-1">
                                                    <h3
                                                        className="mb-1 text-[20px] font-bold"
                                                        style={{
                                                            color: 'var(--color-text-main)',
                                                        }}
                                                    >
                                                        {offer.type}
                                                    </h3>
                                                    <div
                                                        className="text-[13px] font-medium"
                                                        style={{
                                                            color: 'var(--color-text-muted)',
                                                        }}
                                                    >
                                                        {t(
                                                            'loans.borrow_up_to',
                                                            'Borrow up to',
                                                        )}{' '}
                                                        {formatCurrency(
                                                            offer.maxAmount,
                                                        )}
                                                    </div>
                                                </div>
                                                <div
                                                    className="mb-6 space-y-3 rounded-xl p-4"
                                                    style={{
                                                        background:
                                                            'var(--color-bg-base)',
                                                    }}
                                                >
                                                    <div className="flex items-center justify-between text-[14px]">
                                                        <span
                                                            className="font-medium"
                                                            style={{
                                                                color: 'var(--color-text-muted)',
                                                            }}
                                                        >
                                                            Interest Rate
                                                        </span>
                                                        <span className="font-bold text-emerald-400">
                                                            From {offer.rate}%
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-[14px]">
                                                        <span
                                                            className="font-medium"
                                                            style={{
                                                                color: 'var(--color-text-muted)',
                                                            }}
                                                        >
                                                            Term
                                                        </span>
                                                        <span
                                                            className="font-bold"
                                                            style={{
                                                                color: 'var(--color-text-main)',
                                                            }}
                                                        >
                                                            {offer.term}
                                                        </span>
                                                    </div>
                                                    {offer.preApproved && (
                                                        <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-400">
                                                            <CheckCircle className="h-3 w-3" />
                                                            Pre-approved
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setSelectedOffer(offer);
                                                        setShowOfferModal(true);
                                                    }}
                                                    className="w-full rounded-xl py-3 text-[14px] font-bold transition-opacity hover:opacity-90"
                                                    style={{
                                                        background:
                                                            offer.featured
                                                                ? 'var(--color-gold)'
                                                                : 'var(--color-bg-elevated)',
                                                        color: offer.featured
                                                            ? 'black'
                                                            : 'var(--color-text-main)',
                                                    }}
                                                >
                                                    View Details
                                                </button>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Loan Calculator Content */}
                            {activeTab === 'calculator' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid grid-cols-1 gap-8 lg:grid-cols-5"
                                >
                                    <div
                                        className="rounded-[32px] p-8 lg:col-span-3 lg:p-10"
                                        style={{
                                            background: 'var(--color-bg-card)',
                                            border: '1px solid var(--color-border)',
                                        }}
                                    >
                                        <div
                                            className="mb-10 flex items-center gap-4 border-b pb-8"
                                            style={{
                                                borderColor:
                                                    'var(--color-border)',
                                            }}
                                        >
                                            <div
                                                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                                                style={{
                                                    background:
                                                        'rgba(212,175,55,0.1)',
                                                }}
                                            >
                                                <Calculator className="h-6 w-6 text-[var(--color-gold)]" />
                                            </div>
                                            <div>
                                                <h3
                                                    className="text-[20px] font-bold tracking-tight"
                                                    style={{
                                                        color: 'var(--color-text-main)',
                                                    }}
                                                >
                                                    Precision Loan Calculator
                                                </h3>
                                                <p
                                                    className="text-[13px]"
                                                    style={{
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    Fine-tune your financial
                                                    plan with real-time
                                                    projections.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                            <div className="sm:col-span-2">
                                                <label
                                                    className="mb-3 block text-[11px] font-bold tracking-[0.1em] uppercase"
                                                    style={{
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    Loan Amount ({code})
                                                </label>
                                                <div className="group relative">
                                                    <input
                                                        type="number"
                                                        value={calcAmount}
                                                        onChange={(e) =>
                                                            setCalcAmount(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-2xl border bg-transparent p-5 pl-12 text-[18px] font-bold transition-all focus:ring-2 focus:ring-[var(--color-gold)]/20 focus:outline-none"
                                                        style={{
                                                            borderColor:
                                                                'var(--color-border)',
                                                            color: 'var(--color-text-main)',
                                                            background:
                                                                'var(--color-bg-elevated)',
                                                        }}
                                                    />
                                                    <div className="absolute top-1/2 left-5 -translate-y-1/2 text-[18px] font-bold text-[var(--color-gold)]">
                                                        {code}
                                                    </div>
                                                </div>
                                                <div className="mt-3 flex gap-2">
                                                    {[
                                                        100000, 250000, 500000,
                                                        1000000,
                                                    ].map((amt) => (
                                                        <button
                                                            key={amt}
                                                            onClick={() =>
                                                                setCalcAmount(
                                                                    amt,
                                                                )
                                                            }
                                                            className="rounded-lg px-3 py-1.5 text-[10px] font-bold transition-colors hover:bg-[var(--color-gold)] hover:text-black"
                                                            style={{
                                                                background:
                                                                    'var(--color-bg-elevated)',
                                                                border: '1px solid var(--color-border)',
                                                                color: 'var(--color-text-muted)',
                                                            }}
                                                        >
                                                            {formatCurrency(
                                                                amt,
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label
                                                    className="mb-3 block text-[11px] font-bold tracking-[0.1em] uppercase"
                                                    style={{
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    Interest Rate (%)
                                                </label>
                                                <div className="group relative">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={calcRate}
                                                        onChange={(e) =>
                                                            setCalcRate(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-2xl border bg-transparent p-5 pr-12 text-[18px] font-bold transition-all focus:ring-2 focus:ring-[var(--color-gold)]/20 focus:outline-none"
                                                        style={{
                                                            borderColor:
                                                                'var(--color-border)',
                                                            color: 'var(--color-text-main)',
                                                            background:
                                                                'var(--color-bg-elevated)',
                                                        }}
                                                    />
                                                    <div className="absolute top-1/2 right-5 -translate-y-1/2 text-[18px] font-bold text-[var(--color-gold)]">
                                                        %
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label
                                                    className="mb-3 block text-[11px] font-bold tracking-[0.1em] uppercase"
                                                    style={{
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    Loan Term (Years)
                                                </label>
                                                <div className="group relative">
                                                    <input
                                                        type="number"
                                                        value={calcTerm}
                                                        onChange={(e) =>
                                                            setCalcTerm(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-2xl border bg-transparent p-5 pr-16 text-[18px] font-bold transition-all focus:ring-2 focus:ring-[var(--color-gold)]/20 focus:outline-none"
                                                        style={{
                                                            borderColor:
                                                                'var(--color-border)',
                                                            color: 'var(--color-text-main)',
                                                            background:
                                                                'var(--color-bg-elevated)',
                                                        }}
                                                    />
                                                    <div
                                                        className="absolute top-1/2 right-5 -translate-y-1/2 text-[11px] font-bold tracking-widest uppercase"
                                                        style={{
                                                            color: 'var(--color-text-muted)',
                                                        }}
                                                    >
                                                        Years
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="relative flex flex-col overflow-hidden rounded-[32px] p-8 lg:col-span-2 lg:p-10"
                                        style={{
                                            background: 'var(--color-bg-card)',
                                            border: '1px solid var(--color-border)',
                                        }}
                                    >
                                        <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/2 rounded-full bg-[var(--color-gold)] opacity-5 blur-[60px]" />
                                        <h3
                                            className="mb-10 text-center text-[12px] font-bold tracking-[0.3em] uppercase"
                                            style={{
                                                color: 'var(--color-gold)',
                                            }}
                                        >
                                            Financial Projection
                                        </h3>

                                        <div className="relative z-10 mb-12 text-center">
                                            <div
                                                className="mb-3 text-[13px] font-semibold"
                                                style={{
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                Estimated Monthly Payment
                                            </div>
                                            <div
                                                className="text-[48px] leading-none font-bold tracking-tighter"
                                                style={{
                                                    color: 'var(--color-text-main)',
                                                }}
                                            >
                                                {formatCurrency(
                                                    calcResults.payment,
                                                )}
                                            </div>
                                        </div>

                                        <div
                                            className="relative z-10 space-y-6 border-t pt-8"
                                            style={{
                                                borderColor:
                                                    'var(--color-border)',
                                            }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className="text-[14px] font-medium"
                                                    style={{
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    Principal Amount
                                                </span>
                                                <span
                                                    className="text-[15px] font-bold"
                                                    style={{
                                                        color: 'var(--color-text-main)',
                                                    }}
                                                >
                                                    {formatCurrency(calcAmount)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className="text-[14px] font-medium"
                                                    style={{
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    Total Interest
                                                </span>
                                                <span className="text-[15px] font-bold text-emerald-400">
                                                    +
                                                    {formatCurrency(
                                                        calcResults.totalInterest,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className="text-[14px] font-medium"
                                                    style={{
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    Total Cost
                                                </span>
                                                <span
                                                    className="text-[15px] font-bold"
                                                    style={{
                                                        color: 'var(--color-text-main)',
                                                    }}
                                                >
                                                    {formatCurrency(
                                                        calcResults.totalPayment,
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="relative z-10 mt-auto pt-8">
                                            <div
                                                className="rounded-2xl p-5"
                                                style={{
                                                    background:
                                                        'var(--color-bg-elevated)',
                                                    border: '1px solid var(--color-border)',
                                                }}
                                            >
                                                <div className="flex items-start gap-4">
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
                                                        These results are
                                                        estimates based on the
                                                        provided inputs. Final
                                                        terms will be determined
                                                        during the application
                                                        review process.
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setApplyForm({
                                                        ...applyForm,
                                                        amount: Number(
                                                            calcAmount,
                                                        ),
                                                        term_months:
                                                            Number(calcTerm) *
                                                            12,
                                                    });
                                                    setShowApplyModal(true);
                                                }}
                                                className="mt-6 w-full rounded-2xl py-4 text-[14px] font-bold text-black transition-all hover:opacity-90 active:scale-95"
                                                style={{
                                                    background:
                                                        'var(--color-gold)',
                                                }}
                                            >
                                                Apply with These Terms
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Loan Offer Detail Modal */}
            {showOfferModal && selectedOffer && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowOfferModal(false)}
                >
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 25,
                        }}
                        className="relative z-10 w-full max-w-lg overflow-hidden rounded-[40px]"
                        style={{
                            background: 'var(--color-bg-card)',
                            border: selectedOffer.featured
                                ? '2px solid var(--color-gold)'
                                : '1px solid var(--color-border)',
                            boxShadow: selectedOffer.featured
                                ? '0 40px 80px -20px rgba(0,0,0,0.9), 0 0 120px -40px rgba(212,175,55,0.08)'
                                : '0 40px 80px -20px rgba(0,0,0,0.9)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative overflow-hidden p-8">
                            {selectedOffer.featured && (
                                <div className="absolute top-4 right-4 rounded-md bg-[var(--color-gold)] px-3 py-1 text-[10px] font-bold tracking-wider text-black uppercase">
                                    Recommended
                                </div>
                            )}
                            <button
                                onClick={() => setShowOfferModal(false)}
                                className="group absolute top-4 left-4 rounded-2xl p-2.5 transition-all hover:bg-[var(--color-bg-elevated)] active:scale-95"
                            >
                                <X
                                    className="h-5 w-5"
                                    style={{ color: 'var(--color-text-muted)' }}
                                />
                            </button>

                            <div className="flex flex-col items-center pt-6 text-center">
                                <div
                                    className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl"
                                    style={{
                                        background: selectedOffer.featured
                                            ? 'rgba(212,175,55,0.15)'
                                            : 'var(--color-bg-elevated)',
                                    }}
                                >
                                    {(() => {
                                        const Icon =
                                            ICON_MAP[selectedOffer.icon] ||
                                            Landmark;
                                        return (
                                            <Icon
                                                className="h-10 w-10"
                                                style={{
                                                    color: selectedOffer.featured
                                                        ? 'var(--color-gold)'
                                                        : 'var(--color-text-main)',
                                                }}
                                            />
                                        );
                                    })()}
                                </div>
                                <h2
                                    className="mb-2 text-[28px] font-bold tracking-tight"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    {selectedOffer.type}
                                </h2>
                                <p
                                    className="mb-8 text-[14px] font-medium"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    Borrow up to{' '}
                                    {formatCurrency(selectedOffer.maxAmount)}
                                </p>
                            </div>

                            <div
                                className="mb-8 space-y-5 rounded-[24px] p-6"
                                style={{ background: 'var(--color-bg-base)' }}
                            >
                                <div className="flex items-center justify-between">
                                    <span
                                        className="text-[13px] font-medium"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                        }}
                                    >
                                        Interest Rate
                                    </span>
                                    <span className="text-[18px] font-bold text-emerald-400">
                                        From {selectedOffer.rate}%
                                    </span>
                                </div>
                                <div
                                    className="h-px"
                                    style={{
                                        background: 'var(--color-border)',
                                        opacity: 0.3,
                                    }}
                                />
                                <div className="flex items-center justify-between">
                                    <span
                                        className="text-[13px] font-medium"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                        }}
                                    >
                                        Loan Term
                                    </span>
                                    <span
                                        className="text-[18px] font-bold"
                                        style={{
                                            color: 'var(--color-text-main)',
                                        }}
                                    >
                                        {selectedOffer.term}
                                    </span>
                                </div>
                                <div
                                    className="h-px"
                                    style={{
                                        background: 'var(--color-border)',
                                        opacity: 0.3,
                                    }}
                                />
                                <div className="flex items-center justify-between">
                                    <span
                                        className="text-[13px] font-medium"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                        }}
                                    >
                                        Maximum Amount
                                    </span>
                                    <span
                                        className="text-[18px] font-bold"
                                        style={{
                                            color: 'var(--color-text-main)',
                                        }}
                                    >
                                        {formatCurrency(
                                            selectedOffer.maxAmount,
                                        )}
                                    </span>
                                </div>
                                {selectedOffer.preApproved && (
                                    <>
                                        <div
                                            className="h-px"
                                            style={{
                                                background:
                                                    'var(--color-border)',
                                                opacity: 0.3,
                                            }}
                                        />
                                        <div className="flex items-center justify-center gap-2 text-[13px] font-bold text-emerald-400">
                                            <CheckCircle className="h-4 w-4" />
                                            You are pre-approved for this offer
                                        </div>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={() => {
                                    setShowOfferModal(false);
                                    setApplyForm({
                                        ...applyForm,
                                        type: selectedOffer.type,
                                        term_months:
                                            parseInt(selectedOffer.term) * 12,
                                    });
                                    setShowApplyModal(true);
                                }}
                                className="w-full rounded-2xl py-4 text-[15px] font-bold transition-all hover:opacity-90 active:scale-[0.98]"
                                style={{
                                    background:
                                        'linear-gradient(135deg, var(--color-gold), #D4AF37)',
                                    color: '#000',
                                    boxShadow:
                                        '0 15px 35px -5px rgba(212,175,55,0.3)',
                                }}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Take This Offer
                                    <ArrowUpRight className="h-4 w-4" />
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Apply Loan Modal */}
            {showApplyModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowApplyModal(false)}
                >
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 25,
                        }}
                        className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[40px]"
                        style={{
                            background: 'var(--color-bg-card)',
                            border: '1px solid rgba(212,175,55,0.15)',
                            boxShadow:
                                '0 40px 80px -20px rgba(0, 0, 0, 0.9), 0 0 120px -40px rgba(212,175,55,0.08)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="relative overflow-hidden">
                            <div className="flex items-center justify-between p-8 pb-0">
                                <div>
                                    <motion.h2
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-[28px] font-bold tracking-tight"
                                        style={{
                                            color: 'var(--color-text-main)',
                                        }}
                                    >
                                        Apply for {applyForm.type}
                                    </motion.h2>
                                    <motion.p
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="mt-1 text-[13px]"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                        }}
                                    >
                                        {getSelectedRate()}% fixed •{' '}
                                        {applyForm.term_months} months • Up to{' '}
                                        {formatCurrency(LOAN_LIMITS.amount.max)}
                                    </motion.p>
                                </div>
                                <button
                                    onClick={() => setShowApplyModal(false)}
                                    className="group rounded-2xl p-2.5 transition-all hover:bg-[var(--color-bg-elevated)] active:scale-95"
                                >
                                    <X
                                        className="h-5 w-5 transition-colors"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                        }}
                                    />
                                </button>
                            </div>

                            {/* Progress Steps */}
                            <div className="flex gap-2 px-8 pt-6">
                                {['Solution', 'Amount', 'Review'].map(
                                    (step, i) => (
                                        <div
                                            key={step}
                                            className="flex flex-1 items-center gap-2"
                                        >
                                            <div
                                                className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-500"
                                                style={{
                                                    background:
                                                        i === 0
                                                            ? 'var(--color-gold)'
                                                            : 'var(--color-bg-elevated)',
                                                    color:
                                                        i === 0
                                                            ? '#000'
                                                            : 'var(--color-text-muted)',
                                                }}
                                            >
                                                {i < 1 ? (
                                                    <Check className="h-3.5 w-3.5" />
                                                ) : (
                                                    i + 1
                                                )}
                                            </div>
                                            <span
                                                className={`text-[10px] font-bold tracking-wider uppercase transition-colors ${i === 0 ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-muted)]/40'}`}
                                            >
                                                {step}
                                            </span>
                                            {i < 2 && (
                                                <div
                                                    className="mt-3 h-[1px] flex-1"
                                                    style={{
                                                        background:
                                                            'var(--color-border)',
                                                    }}
                                                />
                                            )}
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-0 lg:grid-cols-5">
                            {/* Left: Form */}
                            <div className="col-span-3 p-8 pr-6">
                                <div className="space-y-8">
                                    {/* Loan Type */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 }}
                                    >
                                        <label
                                            className="mb-4 flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase"
                                            style={{
                                                color: 'var(--color-gold)',
                                            }}
                                        >
                                            <div className="h-1 w-6 rounded-full bg-[var(--color-gold)]" />
                                            Select Your Solution
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                {
                                                    id: 'Personal Loan',
                                                    icon: User,
                                                    label: 'Personal',
                                                    apr: '6.5%',
                                                },
                                                {
                                                    id: 'Home Mortgage',
                                                    icon: Home,
                                                    label: 'Mortgage',
                                                    apr: '4.2%',
                                                },
                                                {
                                                    id: 'Auto Loan',
                                                    icon: Car,
                                                    label: 'Auto',
                                                    apr: '5.8%',
                                                },
                                                {
                                                    id: 'Education Loan',
                                                    icon: GraduationCap,
                                                    label: 'Education',
                                                    apr: '3.5%',
                                                },
                                                {
                                                    id: 'Business Loan',
                                                    icon: Briefcase,
                                                    label: 'Business',
                                                    apr: '5.2%',
                                                },
                                                {
                                                    id: 'Investment Loan',
                                                    icon: Landmark,
                                                    label: 'Invest',
                                                    apr: '7.2%',
                                                },
                                            ].map((type) => (
                                                <motion.button
                                                    key={type.id}
                                                    onClick={() =>
                                                        handleTypeChange(
                                                            type.id,
                                                        )
                                                    }
                                                    whileHover={{
                                                        scale: 1.03,
                                                        y: -2,
                                                    }}
                                                    whileTap={{ scale: 0.97 }}
                                                    className="group relative flex flex-col items-center gap-2.5 rounded-[24px] p-5 transition-all duration-300"
                                                    style={{
                                                        background:
                                                            applyForm.type ===
                                                            type.id
                                                                ? 'linear-gradient(135deg, var(--color-gold), #D4AF37)'
                                                                : 'var(--color-bg-elevated)',
                                                        border: `1.5px solid ${applyForm.type === type.id ? 'var(--color-gold)' : 'var(--color-border)'}`,
                                                        boxShadow:
                                                            applyForm.type ===
                                                            type.id
                                                                ? '0 10px 30px -5px rgba(212,175,55,0.3)'
                                                                : 'none',
                                                    }}
                                                >
                                                    {applyForm.type ===
                                                        type.id && (
                                                        <motion.div
                                                            layoutId="selectedGlow"
                                                            className="absolute inset-0 rounded-[24px] opacity-20 blur-xl"
                                                            style={{
                                                                background:
                                                                    'var(--color-gold)',
                                                            }}
                                                        />
                                                    )}
                                                    <type.icon
                                                        className={`relative z-10 h-6 w-6 transition-transform duration-300 ${applyForm.type === type.id ? 'scale-110 text-black' : 'text-[var(--color-gold)] opacity-60 group-hover:opacity-100'}`}
                                                    />
                                                    <span
                                                        className={`relative z-10 text-[11px] font-bold transition-colors ${applyForm.type === type.id ? 'text-black' : 'text-[var(--color-text-main)]'}`}
                                                    >
                                                        {type.label}
                                                    </span>
                                                    <span
                                                        className={`relative z-10 text-[9px] font-medium ${applyForm.type === type.id ? 'text-black/60' : 'text-[var(--color-text-muted)]'}`}
                                                    >
                                                        {type.apr}
                                                    </span>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Amount & Term */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.25 }}
                                        className="grid grid-cols-2 gap-6"
                                    >
                                        <div className="space-y-2">
                                            <label
                                                className="flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase"
                                                style={{
                                                    color: 'var(--color-gold)',
                                                }}
                                            >
                                                <div className="h-1 w-6 rounded-full bg-[var(--color-gold)]" />
                                                Loan Amount
                                            </label>
                                            <div className="group relative">
                                                <input
                                                    type="number"
                                                    value={
                                                        applyForm.amount || ''
                                                    }
                                                    onChange={(e) =>
                                                        setApplyForm({
                                                            ...applyForm,
                                                            amount: Number(
                                                                e.target.value,
                                                            ),
                                                        })
                                                    }
                                                    placeholder="0"
                                                    className="w-full rounded-2xl border-2 bg-transparent p-5 pl-16 text-[20px] font-bold transition-all hover:border-[var(--color-gold)]/30 focus:border-[var(--color-gold)] focus:outline-none"
                                                    style={{
                                                        borderColor:
                                                            'var(--color-border)',
                                                        color: 'var(--color-text-main)',
                                                        background:
                                                            'var(--color-bg-elevated)',
                                                    }}
                                                />
                                                <div className="absolute top-1/2 left-5 -translate-y-1/2 text-[18px] font-bold text-[var(--color-gold)]/40">
                                                    {code}
                                                </div>
                                                <div
                                                    className="absolute top-1/2 right-5 -translate-y-1/2 text-[10px] font-bold tracking-widest uppercase opacity-30"
                                                    style={{
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    Max:{' '}
                                                    {formatCurrency(
                                                        LOAN_LIMITS.amount.max,
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                className="flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase"
                                                style={{
                                                    color: 'var(--color-gold)',
                                                }}
                                            >
                                                <div className="h-1 w-6 rounded-full bg-[var(--color-gold)]" />
                                                Term
                                            </label>
                                            <div className="group relative">
                                                <select
                                                    value={
                                                        applyForm.term_months
                                                    }
                                                    onChange={(e) =>
                                                        setApplyForm({
                                                            ...applyForm,
                                                            term_months: Number(
                                                                e.target.value,
                                                            ),
                                                        })
                                                    }
                                                    className="w-full cursor-pointer appearance-none rounded-2xl border-2 bg-transparent p-5 pr-12 text-[18px] font-bold transition-all hover:border-[var(--color-gold)]/30 focus:border-[var(--color-gold)] focus:outline-none"
                                                    style={{
                                                        borderColor:
                                                            'var(--color-border)',
                                                        color: 'var(--color-text-main)',
                                                        background:
                                                            'var(--color-bg-elevated)',
                                                    }}
                                                >
                                                    {[
                                                        12, 24, 36, 48, 60, 72,
                                                        84, 120, 180, 240, 360,
                                                    ].map((m) => (
                                                        <option
                                                            key={m}
                                                            value={m}
                                                            className="bg-[var(--color-bg-card)] text-[14px]"
                                                        >
                                                            {m} months ({m / 12}{' '}
                                                            {m >= 12
                                                                ? 'years'
                                                                : 'year'}
                                                            )
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 opacity-40">
                                                    <ChevronDown
                                                        className="h-5 w-5"
                                                        style={{
                                                            color: 'var(--color-text-muted)',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Purpose */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.35 }}
                                    >
                                        <label
                                            className="mb-2 flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase"
                                            style={{
                                                color: 'var(--color-gold)',
                                            }}
                                        >
                                            <div className="h-1 w-6 rounded-full bg-[var(--color-gold)]" />
                                            Purpose (Optional)
                                        </label>
                                        <textarea
                                            value={applyForm.purpose}
                                            onChange={(e) =>
                                                setApplyForm({
                                                    ...applyForm,
                                                    purpose: e.target.value,
                                                })
                                            }
                                            placeholder="Describe the purpose of this loan..."
                                            rows={2}
                                            className="w-full resize-none rounded-2xl border-2 bg-transparent p-4 text-[13px] transition-all hover:border-[var(--color-gold)]/30 focus:border-[var(--color-gold)] focus:outline-none"
                                            style={{
                                                borderColor:
                                                    'var(--color-border)',
                                                color: 'var(--color-text-main)',
                                                background:
                                                    'var(--color-bg-elevated)',
                                            }}
                                        />
                                    </motion.div>
                                </div>
                            </div>

                            {/* Right: Preview */}
                            <div
                                className="col-span-2 p-8 pt-6"
                                style={{
                                    background:
                                        'linear-gradient(180deg, rgba(212,175,55,0.04) 0%, rgba(212,175,55,0.02) 100%)',
                                    borderLeft:
                                        '1px solid rgba(212,175,55,0.1)',
                                }}
                            >
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <h4
                                            className="mb-1 text-[10px] font-bold tracking-[0.3em] uppercase opacity-40"
                                            style={{
                                                color: 'var(--color-text-muted)',
                                            }}
                                        >
                                            Monthly Payment
                                        </h4>
                                        <div className="text-[36px] leading-none font-bold tracking-tight text-[var(--color-gold)]">
                                            {formatCurrency(
                                                getMonthlyPayment(),
                                            )}
                                        </div>
                                        <div
                                            className="mt-1 text-[10px] opacity-40"
                                            style={{
                                                color: 'var(--color-text-muted)',
                                            }}
                                        >
                                            First payment in 30 days
                                        </div>
                                    </div>

                                    <div
                                        className="h-[1px]"
                                        style={{
                                            background: 'rgba(212,175,55,0.1)',
                                        }}
                                    />

                                    <div className="space-y-4">
                                        {[
                                            {
                                                label: 'Principal',
                                                value: applyForm.amount,
                                                color: 'var(--color-text-main)',
                                            },
                                            {
                                                label: 'Total Interest',
                                                value: getTotalInterest(),
                                                color: 'text-emerald-400',
                                            },
                                            {
                                                label: 'Total Repayable',
                                                value: getTotalRepayment(),
                                                color: 'var(--color-gold)',
                                                isTotal: true,
                                            },
                                        ].map((item, i) => (
                                            <div
                                                key={item.label}
                                                className="flex items-center justify-between"
                                            >
                                                <span
                                                    className="text-[11px] font-medium"
                                                    style={{
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    {item.label}
                                                </span>
                                                <span
                                                    className={`text-[13px] font-bold ${item.color}`}
                                                >
                                                    {formatCurrency(item.value)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div
                                        className="h-[1px]"
                                        style={{
                                            background: 'rgba(212,175,55,0.1)',
                                        }}
                                    />

                                    {/* Visual indicator */}
                                    <div>
                                        <div
                                            className="mb-2 flex justify-between text-[9px] font-bold tracking-widest uppercase"
                                            style={{
                                                color: 'var(--color-text-muted)',
                                            }}
                                        >
                                            <span>Principal</span>
                                            <span>Total Cost</span>
                                        </div>
                                        <div
                                            className="h-2 w-full overflow-hidden rounded-full"
                                            style={{
                                                background:
                                                    'var(--color-bg-elevated)',
                                            }}
                                        >
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: getProgressPct(),
                                                }}
                                                transition={{
                                                    duration: 0.8,
                                                    ease: 'easeOut',
                                                }}
                                                className="h-full rounded-full"
                                                style={{
                                                    background:
                                                        'linear-gradient(90deg, var(--color-gold), #D4AF37)',
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <motion.button
                                        onClick={handleApply}
                                        disabled={applying || !applyForm.amount}
                                        whileHover={
                                            !applying
                                                ? {
                                                      scale: 1.02,
                                                      boxShadow:
                                                          '0 20px 40px -10px rgba(212,175,55,0.4)',
                                                  }
                                                : {}
                                        }
                                        whileTap={
                                            !applying ? { scale: 0.98 } : {}
                                        }
                                        className="relative w-full overflow-hidden rounded-2xl py-5 text-[15px] font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50"
                                        style={{
                                            background:
                                                'linear-gradient(135deg, var(--color-gold), #D4AF37)',
                                            color: '#000',
                                            boxShadow:
                                                '0 15px 35px -5px rgba(212,175,55,0.3)',
                                        }}
                                    >
                                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                                        {applying ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{
                                                        duration: 1,
                                                        repeat: Infinity,
                                                        ease: 'linear',
                                                    }}
                                                    className="h-5 w-5 rounded-full border-2 border-black/20 border-t-black"
                                                />
                                                Processing...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                Complete Application
                                                <ArrowUpRight className="h-4 w-4" />
                                            </span>
                                        )}
                                    </motion.button>

                                    <p
                                        className="text-center text-[9px] leading-relaxed opacity-30"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                        }}
                                    >
                                        By proceeding, you agree to OSCORP's
                                        lending terms and credit review process.
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
