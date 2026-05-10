import { Head, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import {
    Calendar,
    CreditCard,
    Clock,
    Activity,
    PauseCircle,
    PlayCircle,
    MoreHorizontal,
    Download,
    ShieldCheck,
    Zap,
    Loader2,
} from 'lucide-react';
import { useState } from 'react';
import {
    LOGO_KEY,
    LOGO_BASE_URL,
    DICEBEAR_BASE_URL,
    COLORS,
    getLogoUrl,
    getFallbackAvatarUrl,
} from '@/constants';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';

export default function Subscriptions({
    subscriptions = [],
    billingHistory = [],
    stats = {},
}) {
    const [activeTab, setActiveTab] = useState('active');
    const [togglingSub, setTogglingSub] = useState(null);
    const { t } = useTranslation();
    const { format, code } = useCurrency();

    return (
        <div
            className="flex h-screen w-full overflow-hidden"
            style={{ background: 'var(--color-bg-base)' }}
        >
            <Head title="OSCORP | Subscriptions" />
            <Sidebar active="subscriptions" />

            <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
                <Topbar />

                {/* Ambient Backgrounds Removed for Dark Luxury Aesthetic */}

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 },
                        },
                    }}
                    className="z-10 flex-1 overflow-y-auto p-4 lg:p-8"
                >
                    <div className="mx-auto max-w-6xl space-y-8">
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
                                    className="text-3xl font-black tracking-tight"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    Subscriptions
                                </h1>
                                <p
                                    className="mt-1 text-sm font-medium opacity-50"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    Manage digital assets and recurring
                                    liabilities.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2 md:text-right">
                                <ShieldCheck
                                    className="h-4 w-4 opacity-50"
                                    style={{ color: 'var(--color-text-main)' }}
                                />
                                <span
                                    className="text-[11px] font-bold tracking-widest uppercase opacity-50"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    Secure Billing
                                </span>
                            </div>
                        </motion.div>

                        {/* Stats Grid */}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            className="grid grid-cols-1 gap-6 md:grid-cols-3"
                        >
                            {[
                                {
                                    label: 'Active Subscriptions',
                                    value: stats.activeCount || 0,
                                    icon: Activity,
                                    color: COLORS.credit,
                                    isCurrency: false,
                                },
                                {
                                    label: 'Est. Monthly Spend',
                                    value: stats.monthlySpend || 0,
                                    icon: CreditCard,
                                    color: COLORS.gold,
                                    isCurrency: true,
                                },
                                {
                                    label: 'Projected Yearly',
                                    value: stats.yearlySpend || 0,
                                    icon: Calendar,
                                    color: COLORS.purple,
                                    isCurrency: true,
                                },
                            ].map((stat, idx) => (
                                <motion.div
                                    key={stat.label}
                                    className="group flex flex-col justify-between rounded-[24px] border border-white/5 bg-white/[0.02] p-6 transition-colors hover:border-white/20"
                                    style={{
                                        background: 'var(--color-bg-card)',
                                        borderColor: 'var(--color-border)',
                                    }}
                                >
                                    <div className="mb-6 flex items-center justify-between">
                                        <div
                                            className="text-[11px] font-bold tracking-widest uppercase opacity-50"
                                            style={{
                                                color: 'var(--color-text-main)',
                                            }}
                                        >
                                            {stat.label}
                                        </div>
                                        <div
                                            className="flex h-10 w-10 items-center justify-center rounded-xl border transition-transform group-hover:scale-105"
                                            style={{
                                                background: `${stat.color}10`,
                                                borderColor: `${stat.color}20`,
                                            }}
                                        >
                                            <stat.icon
                                                className="h-5 w-5"
                                                style={{ color: stat.color }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div
                                            className="text-3xl font-black tracking-tighter"
                                            style={{
                                                color: 'var(--color-text-main)',
                                            }}
                                        >
                                            {stat.isCurrency
                                                ? format(stat.value)
                                                : stat.value}
                                            {stat.isCurrency && (
                                                <span className="ml-1 text-sm opacity-50">
                                                    {code}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Tabs */}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                        >
                            <div className="relative mb-8 flex flex-wrap gap-6 border-b border-white/5 pb-4">
                                <div
                                    className="absolute bottom-[-1px] h-[2px] bg-white transition-all duration-300"
                                    style={{
                                        width:
                                            activeTab === 'active'
                                                ? '120px'
                                                : '100px',
                                        transform:
                                            activeTab === 'active'
                                                ? 'translateX(0)'
                                                : 'translateX(144px)',
                                    }}
                                />
                                {[
                                    { id: 'active', label: 'My Subscriptions' },
                                    { id: 'billing', label: 'Billing Ledger' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`pb-2 text-[11px] font-bold tracking-widest uppercase transition-all ${activeTab === tab.id ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                                        style={{
                                            color: 'var(--color-text-main)',
                                        }}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Active Subscriptions Grid */}
                            <AnimatePresence mode="wait">
                                {activeTab === 'active' && (
                                    <motion.div
                                        key="active"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                                    >
                                        {subscriptions.map((sub, idx) => (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.95,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                transition={{
                                                    delay: idx * 0.05,
                                                }}
                                                key={sub.id}
                                                className="group flex flex-col rounded-[24px] border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-white/20"
                                                style={{
                                                    background:
                                                        'var(--color-bg-card)',
                                                    borderColor:
                                                        'var(--color-border)',
                                                }}
                                            >
                                                <div className="mb-6 flex items-start justify-between">
                                                    <div className="flex h-14 w-14 items-center justify-center rounded-[16px] border border-white/5 bg-black/20 p-2 transition-colors group-hover:border-white/20">
                                                        <img
                                                            src={
                                                                getLogoUrl(
                                                                    sub.name,
                                                                ) ||
                                                                `${LOGO_BASE_URL}/${sub.domain}?token=${LOGO_KEY}&size=80&format=png`
                                                            }
                                                            alt={sub.name}
                                                            className="h-full w-full rounded-lg object-contain"
                                                            onError={(e) => {
                                                                e.target.onerror =
                                                                    null;
                                                                e.target.src =
                                                                    getFallbackAvatarUrl(
                                                                        sub.name,
                                                                    );
                                                            }}
                                                        />
                                                    </div>
                                                    <div
                                                        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${sub.status === 'Active' ? `bg-[${COLORS.credit}]/10 border-[${COLORS.credit}]/20` : 'border-white/5 bg-white/5'}`}
                                                    >
                                                        {sub.status ===
                                                        'Active' ? (
                                                            <>
                                                                <div
                                                                    className="h-1.5 w-1.5 rounded-full"
                                                                    style={{
                                                                        background:
                                                                            COLORS.credit,
                                                                    }}
                                                                />
                                                                <span
                                                                    className="text-[9px] font-bold tracking-widest uppercase"
                                                                    style={{
                                                                        color: COLORS.credit,
                                                                    }}
                                                                >
                                                                    Active
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
                                                                <span className="text-[9px] font-bold tracking-widest text-white/50 uppercase">
                                                                    Paused
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mb-6 flex-1">
                                                    <h3
                                                        className="mb-1 text-xl font-black"
                                                        style={{
                                                            color: 'var(--color-text-main)',
                                                        }}
                                                    >
                                                        {sub.name}
                                                    </h3>
                                                    <div
                                                        className="text-[11px] font-bold tracking-widest uppercase opacity-50"
                                                        style={{
                                                            color: 'var(--color-text-main)',
                                                        }}
                                                    >
                                                        {sub.plan}
                                                    </div>
                                                </div>

                                                <div className="space-y-4 border-t border-white/5 pt-6">
                                                    <div className="flex items-center justify-between">
                                                        <div
                                                            className="text-[11px] font-bold tracking-widest uppercase opacity-50"
                                                            style={{
                                                                color: 'var(--color-text-main)',
                                                            }}
                                                        >
                                                            {sub.billingCycle}
                                                        </div>
                                                        <div
                                                            className="text-xl font-black tracking-tighter"
                                                            style={{
                                                                color: 'var(--color-text-main)',
                                                            }}
                                                        >
                                                            {format(sub.price)}{' '}
                                                            <span className="text-xs font-bold opacity-50">
                                                                {code}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/20 p-3"
                                                        style={{
                                                            background:
                                                                'var(--color-bg-elevated)',
                                                            borderColor:
                                                                'var(--color-border)',
                                                        }}
                                                    >
                                                        <Clock
                                                            className="h-4 w-4 opacity-30"
                                                            style={{
                                                                color: 'var(--color-text-main)',
                                                            }}
                                                        />
                                                        <div
                                                            className="text-xs font-medium opacity-50"
                                                            style={{
                                                                color: 'var(--color-text-main)',
                                                            }}
                                                        >
                                                            {sub.status ===
                                                            'Active'
                                                                ? `Next billing on ${sub.nextBilling}`
                                                                : `Subscription paused`}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-6 flex gap-3">
                                                    {sub.status === 'Active' ? (
                                                        <button
                                                            onClick={() => {
                                                                setTogglingSub(
                                                                    sub.id,
                                                                );
                                                                router.post(
                                                                    `/subscriptions/${sub.id}/pause`,
                                                                    {
                                                                        name: sub.name,
                                                                    },
                                                                    {
                                                                        onFinish:
                                                                            () =>
                                                                                setTogglingSub(
                                                                                    null,
                                                                                ),
                                                                    },
                                                                );
                                                            }}
                                                            disabled={
                                                                togglingSub ===
                                                                sub.id
                                                            }
                                                            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] text-[10px] font-bold tracking-widest uppercase transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                                                            style={{
                                                                color: 'var(--color-text-main)',
                                                            }}
                                                        >
                                                            {togglingSub ===
                                                            sub.id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <PauseCircle className="h-4 w-4" />
                                                            )}
                                                            Pause
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                setTogglingSub(
                                                                    sub.id,
                                                                );
                                                                router.post(
                                                                    `/subscriptions/${sub.id}/resume`,
                                                                    {
                                                                        name: sub.name,
                                                                    },
                                                                    {
                                                                        onFinish:
                                                                            () =>
                                                                                setTogglingSub(
                                                                                    null,
                                                                                ),
                                                                    },
                                                                );
                                                            }}
                                                            disabled={
                                                                togglingSub ===
                                                                sub.id
                                                            }
                                                            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] text-[10px] font-bold tracking-widest uppercase transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                                                            style={{
                                                                color: 'var(--color-text-main)',
                                                            }}
                                                        >
                                                            {togglingSub ===
                                                            sub.id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <PlayCircle className="h-4 w-4" />
                                                            )}
                                                            Resume
                                                        </button>
                                                    )}
                                                    <button
                                                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] transition-colors hover:bg-white/10"
                                                        style={{
                                                            color: 'var(--color-text-main)',
                                                        }}
                                                    >
                                                        <MoreHorizontal className="h-4 w-4 opacity-50" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}

                                {/* Billing History Content */}
                                {activeTab === 'billing' && (
                                    <motion.div
                                        key="billing"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden rounded-[24px] border border-white/5 bg-white/[0.02]"
                                        style={{
                                            background: 'var(--color-bg-card)',
                                            borderColor: 'var(--color-border)',
                                        }}
                                    >
                                        <div className="flex items-center justify-between border-b border-white/5 p-6">
                                            <div>
                                                <h3
                                                    className="text-sm font-black"
                                                    style={{
                                                        color: 'var(--color-text-main)',
                                                    }}
                                                >
                                                    Transaction Ledger
                                                </h3>
                                                <p
                                                    className="mt-1 text-[11px] font-bold tracking-widest uppercase opacity-40"
                                                    style={{
                                                        color: 'var(--color-text-main)',
                                                    }}
                                                >
                                                    Recent Subscription Charges
                                                </p>
                                            </div>
                                            <div
                                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-black/20"
                                                style={{
                                                    background:
                                                        'var(--color-bg-elevated)',
                                                    borderColor:
                                                        'var(--color-border)',
                                                }}
                                            >
                                                <Zap
                                                    className="h-4 w-4 opacity-50"
                                                    style={{
                                                        color: 'var(--color-text-main)',
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="divide-y divide-white/5">
                                            {billingHistory.map(
                                                (item, index) => (
                                                    <div
                                                        key={item.id}
                                                        className="group flex cursor-pointer items-center justify-between p-6 transition-colors hover:bg-white/[0.02]"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div
                                                                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border border-white/5 bg-black/20 p-2 transition-colors group-hover:border-white/20"
                                                                style={{
                                                                    background:
                                                                        'var(--color-bg-elevated)',
                                                                }}
                                                            >
                                                                <img
                                                                    src={
                                                                        getLogoUrl(
                                                                            item.description,
                                                                        ) ||
                                                                        `${LOGO_BASE_URL}/${item.domain}?token=${LOGO_KEY}&size=60&format=png`
                                                                    }
                                                                    alt={
                                                                        item.description
                                                                    }
                                                                    className="h-full w-full rounded-lg object-contain"
                                                                    onError={(
                                                                        e,
                                                                    ) => {
                                                                        e.target.onerror =
                                                                            null;
                                                                        e.target.src =
                                                                            getFallbackAvatarUrl(
                                                                                item.description,
                                                                            );
                                                                    }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <div
                                                                    className="text-sm font-bold"
                                                                    style={{
                                                                        color: 'var(--color-text-main)',
                                                                    }}
                                                                >
                                                                    {
                                                                        item.description
                                                                    }
                                                                </div>
                                                                <div className="mt-1 flex items-center gap-2">
                                                                    <span
                                                                        className="text-[11px] font-bold tracking-widest uppercase opacity-40"
                                                                        style={{
                                                                            color: 'var(--color-text-main)',
                                                                        }}
                                                                    >
                                                                        {
                                                                            item.date
                                                                        }
                                                                    </span>
                                                                    <span className="h-1 w-1 rounded-full bg-white/20" />
                                                                    <span
                                                                        className="text-[11px] font-bold tracking-widest uppercase opacity-30"
                                                                        style={{
                                                                            color: 'var(--color-text-main)',
                                                                        }}
                                                                    >
                                                                        #
                                                                        {
                                                                            item.id
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-6">
                                                            <div className="text-right">
                                                                <div
                                                                    className="text-base font-black tracking-tighter"
                                                                    style={{
                                                                        color: 'var(--color-text-main)',
                                                                    }}
                                                                >
                                                                    {format(
                                                                        item.amount,
                                                                    )}{' '}
                                                                    <span className="text-[10px] font-bold opacity-50">
                                                                        {code}
                                                                    </span>
                                                                </div>
                                                                <span
                                                                    className="mt-0.5 block text-[9px] font-bold tracking-widest uppercase"
                                                                    style={{
                                                                        color: COLORS.credit,
                                                                    }}
                                                                >
                                                                    {
                                                                        item.status
                                                                    }
                                                                </span>
                                                            </div>
                                                            <button
                                                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] opacity-0 transition-colors group-hover:opacity-100 hover:bg-white/10"
                                                                style={{
                                                                    color: 'var(--color-text-main)',
                                                                }}
                                                            >
                                                                <Download className="h-4 w-4 opacity-50" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ),
                                            )}

                                            {billingHistory.length === 0 && (
                                                <div className="flex flex-col items-center justify-center p-12 text-center">
                                                    <Zap className="mb-4 h-8 w-8 opacity-20" />
                                                    <div
                                                        className="text-[11px] font-bold tracking-widest uppercase opacity-40"
                                                        style={{
                                                            color: 'var(--color-text-main)',
                                                        }}
                                                    >
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
