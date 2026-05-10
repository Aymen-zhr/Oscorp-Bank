import { Head, router, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import {
    Target,
    Plus,
    DollarSign,
    Calendar,
    TrendingUp,
    Unlock,
    Trash2,
    CheckCircle2,
    X,
    Car,
    Monitor,
    Home,
    Plane,
    GraduationCap,
    Gift,
    PiggyBank,
} from 'lucide-react';

const iconOptions = [
    { value: 'car', icon: Car, labelKey: 'goals.categories.car' },
    { value: 'monitor', icon: Monitor, labelKey: 'goals.categories.pc' },
    { value: 'home', icon: Home, labelKey: 'goals.categories.house' },
    { value: 'plane', icon: Plane, labelKey: 'goals.categories.travel' },
    {
        value: 'graduation-cap',
        icon: GraduationCap,
        labelKey: 'goals.categories.education',
    },
    { value: 'gift', icon: Gift, labelKey: 'goals.categories.gift' },
    {
        value: 'piggy-bank',
        icon: PiggyBank,
        labelKey: 'goals.categories.savings',
    },
    { value: 'target', icon: Target, labelKey: 'goals.categories.other' },
];

function getIconComponent(name) {
    const option = iconOptions.find((o) => o.value === name);
    return option ? option.icon : Target;
}

export default function Goals({ goals }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [depositGoalId, setDepositGoalId] = useState(null);
    const [showUnlockModal, setShowUnlockModal] = useState(null);
    const [createStep, setCreateStep] = useState(1);
    const { t, locale } = useTranslation();
    const { format, code } = useCurrency();

    const {
        data: formData,
        setData,
        post: formPost,
        reset,
        processing,
    } = useForm({
        name: '',
        icon: 'target',
        target_amount: '',
        target_months: '',
        is_automatic: false,
    });

    const {
        data: depositData,
        setData: setDepositData,
        post: depositPost,
        reset: resetDeposit,
        processing: depositProcessing,
    } = useForm({
        amount: '',
    });

    const activeGoals = useMemo(
        () => goals.filter((g) => g.status === 'active'),
        [goals],
    );
    const completedGoals = useMemo(
        () => goals.filter((g) => g.status === 'completed'),
        [goals],
    );
    const unlockedGoals = useMemo(
        () => goals.filter((g) => g.status === 'unlocked'),
        [goals],
    );

    const totalSaved = useMemo(
        () => goals.reduce((sum, g) => sum + parseFloat(g.current_savings), 0),
        [goals],
    );
    const totalTarget = useMemo(
        () =>
            goals
                .filter((g) => g.status === 'active')
                .reduce((sum, g) => sum + parseFloat(g.target_amount), 0),
        [goals],
    );

    const handleCreateGoal = (e) => {
        e.preventDefault();
        formPost('/goals', {
            onSuccess: () => {
                reset();
                setShowCreateModal(false);
                setCreateStep(1);
            },
        });
    };

    const handleDeposit = (e, goalId) => {
        e.preventDefault();
        depositPost(`/goals/${goalId}/deposit`, {
            onSuccess: () => {
                resetDeposit();
                setDepositGoalId(null);
            },
        });
    };

    const handleUnlock = (goalId) => {
        router.post(`/goals/${goalId}/unlock`);
        setShowUnlockModal(null);
    };

    const handleDelete = (goalId) => {
        router.delete(`/goals/${goalId}`);
    };

    const monthlySavingsPreview =
        formData.target_amount && formData.target_months
            ? (
                  parseFloat(formData.target_amount) /
                  parseInt(formData.target_months)
              ).toFixed(2)
            : null;

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[var(--color-bg-base)] font-sans text-[var(--color-text-main)] antialiased selection:bg-[var(--color-gold)] selection:text-[var(--color-gold-fg)]">
            <Head title="OSCORP Goals" />

            <Sidebar active="goals" />

            <div className="relative flex flex-1 flex-col overflow-hidden">
                {/* Background Fixed Glows (Stabilized) */}
                <div className="pointer-events-none fixed top-0 right-0 z-0 h-[500px] w-[500px] rounded-full bg-[var(--color-gold)] opacity-[0.03] blur-[120px]" />
                <div className="pointer-events-none fixed bottom-0 left-0 z-0 h-[400px] w-[400px] rounded-full bg-blue-500 opacity-[0.02] blur-[100px]" />

                <Topbar />

                <div className="flex-1 space-y-6 overflow-y-auto p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="flex items-center gap-3 text-3xl font-bold">
                                <Target className="h-8 w-8 text-[var(--color-gold)]" />
                                {t('goals.title')}
                            </h1>
                            <p className="mt-1 text-[var(--color-text-muted)]">
                                {t('goals.subtitle')}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold transition-all hover:scale-105 active:scale-95"
                            style={{
                                background:
                                    'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                                color: '#000',
                            }}
                        >
                            <Plus className="h-5 w-5" />
                            {t('goals.new_goal')}
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl p-5"
                            style={{
                                background:
                                    'linear-gradient(135deg, var(--color-bg-card), var(--color-bg-elevated))',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            <div className="mb-1 text-sm text-[var(--color-text-muted)]">
                                {t('goals.active_goals')}
                            </div>
                            <div className="text-3xl font-bold">
                                {activeGoals.length}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="rounded-2xl p-5"
                            style={{
                                background:
                                    'linear-gradient(135deg, var(--color-bg-card), var(--color-bg-elevated))',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            <div className="mb-1 text-sm text-[var(--color-text-muted)]">
                                {t('goals.total_saved')}
                            </div>
                            <div className="text-3xl font-bold text-[var(--color-gold)]">
                                {format(totalSaved)}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-2xl p-5"
                            style={{
                                background:
                                    'linear-gradient(135deg, var(--color-bg-card), var(--color-bg-elevated))',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            <div className="mb-1 text-sm text-[var(--color-text-muted)]">
                                {t('goals.remaining')}
                            </div>
                            <div className="text-3xl font-bold">
                                {format(totalTarget)}
                            </div>
                        </motion.div>
                    </div>

                    {/* Active Goals */}
                    <div>
                        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                            <TrendingUp className="h-5 w-5 text-[var(--color-gold)]" />
                            {t('goals.active_goals')}
                        </h2>

                        {activeGoals.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="rounded-2xl p-12 text-center"
                                style={{
                                    background:
                                        'linear-gradient(135deg, var(--color-bg-card), var(--color-bg-elevated))',
                                    border: '1px solid var(--color-border)',
                                }}
                            >
                                <PiggyBank className="mx-auto mb-4 h-16 w-16 text-[var(--color-text-muted)] opacity-50" />
                                <h3 className="mb-2 text-xl font-semibold">
                                    {t('goals.no_active_goals')}
                                </h3>
                                <p className="mb-4 text-[var(--color-text-muted)]">
                                    {t('goals.create_first_goal')}
                                </p>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold transition-all hover:scale-105"
                                    style={{
                                        background: 'var(--color-gold-bg)',
                                        color: 'var(--color-gold)',
                                    }}
                                >
                                    <Plus className="h-5 w-5" />
                                    {t('goals.create_goal')}
                                </button>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {activeGoals.map((goal, index) => {
                                    const Icon = getIconComponent(goal.icon);
                                    return (
                                        <motion.div
                                            key={goal.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="rounded-2xl p-5 transition-all hover:translate-y-[-2px]"
                                            style={{
                                                background:
                                                    'linear-gradient(135deg, var(--color-bg-card), var(--color-bg-elevated))',
                                                border: '1px solid var(--color-border)',
                                            }}
                                        >
                                            <div className="mb-4 flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="flex h-12 w-12 items-center justify-center rounded-xl"
                                                        style={{
                                                            background:
                                                                'var(--color-gold-bg)',
                                                        }}
                                                    >
                                                        <Icon className="h-6 w-6 text-[var(--color-gold)]" />
                                                    </div>
                                                    <div>
                                                        <h3 className="flex items-center gap-2 text-lg font-bold">
                                                            {goal.name}
                                                            {goal.is_automatic && (
                                                                <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-emerald-400 uppercase">
                                                                    {t(
                                                                        'goals.auto',
                                                                    )}
                                                                </span>
                                                            )}
                                                        </h3>
                                                        <div className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                                                            <Calendar className="h-3 w-3" />
                                                            {goal.target_months}{' '}
                                                            {t(
                                                                'goals.months_label',
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(goal.id)
                                                    }
                                                    className="rounded-lg p-2 text-[var(--color-text-muted)] transition-all hover:bg-red-500/10 hover:text-red-400"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="mb-4">
                                                <div className="mb-2 flex justify-between text-sm">
                                                    <span className="text-[var(--color-text-muted)]">
                                                        {t('goals.progress')}
                                                    </span>
                                                    <span className="font-semibold text-[var(--color-gold)]">
                                                        {goal.progress}%
                                                    </span>
                                                </div>
                                                <div
                                                    className="h-3 overflow-hidden rounded-full"
                                                    style={{
                                                        background:
                                                            'var(--color-bg-base)',
                                                    }}
                                                >
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{
                                                            width: `${goal.progress}%`,
                                                        }}
                                                        transition={{
                                                            duration: 1,
                                                            ease: 'easeOut',
                                                        }}
                                                        className="h-full rounded-full"
                                                        style={{
                                                            background:
                                                                'linear-gradient(90deg, var(--color-gold), var(--color-gold-dark))',
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Amounts */}
                                            <div className="mb-4 grid grid-cols-4 gap-3">
                                                <div>
                                                    <div className="mb-0.5 text-xs text-[var(--color-text-muted)]">
                                                        {t('goals.saved')}
                                                    </div>
                                                    <div className="font-semibold">
                                                        {format(
                                                            goal.current_savings,
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="mb-0.5 text-xs text-[var(--color-text-muted)]">
                                                        {t('goals.target')}
                                                    </div>
                                                    <div className="font-semibold">
                                                        {format(
                                                            goal.target_amount,
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="mb-0.5 text-xs text-[var(--color-text-muted)]">
                                                        {t('goals.remaining')}
                                                    </div>
                                                    <div className="font-semibold text-red-400">
                                                        {format(
                                                            goal.remaining_amount,
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="mb-0.5 text-xs text-[var(--color-text-muted)]">
                                                        {t('goals.per_month')}
                                                    </div>
                                                    <div className="font-semibold text-[var(--color-gold)]">
                                                        {format(
                                                            goal.monthly_savings,
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Deposit Button */}
                                            <button
                                                onClick={() =>
                                                    setDepositGoalId(goal.id)
                                                }
                                                className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                                                style={{
                                                    background:
                                                        'var(--color-gold-bg)',
                                                    color: 'var(--color-gold)',
                                                    border: '1px solid var(--color-gold)/30',
                                                }}
                                            >
                                                <DollarSign className="h-4 w-4" />
                                                {t('goals.deposit')}
                                            </button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Completed Goals */}
                    {completedGoals.length > 0 && (
                        <div>
                            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                {t('goals.completed_title')}
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {completedGoals.map((goal) => {
                                    const Icon = getIconComponent(goal.icon);
                                    return (
                                        <motion.div
                                            key={goal.id}
                                            className="rounded-2xl border-2 p-5"
                                            style={{
                                                background:
                                                    'linear-gradient(135deg, var(--color-bg-card), var(--color-bg-elevated))',
                                                borderColor:
                                                    'var(--color-gold)/50',
                                            }}
                                        >
                                            <div className="mb-4 flex items-center gap-3">
                                                <div
                                                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                                                    style={{
                                                        background:
                                                            'var(--color-gold-bg)',
                                                    }}
                                                >
                                                    <Icon className="h-6 w-6 text-[var(--color-gold)]" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold">
                                                        {goal.name}
                                                    </h3>
                                                    <div className="text-sm font-semibold text-green-500">
                                                        {t(
                                                            'goals.goal_reached',
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <div
                                                    className="h-3 overflow-hidden rounded-full"
                                                    style={{
                                                        background:
                                                            'var(--color-bg-base)',
                                                    }}
                                                >
                                                    <div className="h-full w-full rounded-full bg-green-500" />
                                                </div>
                                            </div>

                                            <div className="mb-4 text-center">
                                                <div className="text-2xl font-bold text-[var(--color-gold)]">
                                                    {format(
                                                        goal.current_savings,
                                                    )}
                                                </div>
                                                <div className="text-sm text-[var(--color-text-muted)]">
                                                    {t(
                                                        'goals.available_to_unlock',
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    setShowUnlockModal(goal.id)
                                                }
                                                className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                                                style={{
                                                    background:
                                                        'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                                                    color: '#000',
                                                }}
                                            >
                                                <Unlock className="h-4 w-4" />
                                                {t('goals.unlock_amount', {
                                                    amount: format(
                                                        goal.current_savings,
                                                    ),
                                                })}
                                            </button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Unlocked Goals */}
                    {unlockedGoals.length > 0 && (
                        <div>
                            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                                <CheckCircle2 className="h-5 w-5 text-[var(--color-gold)]" />
                                {t('goals.unlocked_goals')}
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {unlockedGoals.map((goal) => {
                                    const Icon = getIconComponent(goal.icon);
                                    return (
                                        <motion.div
                                            key={goal.id}
                                            className="rounded-2xl p-5 opacity-70"
                                            style={{
                                                background:
                                                    'linear-gradient(135deg, var(--color-bg-card), var(--color-bg-elevated))',
                                                border: '1px solid var(--color-border)',
                                            }}
                                        >
                                            <div className="mb-3 flex items-center gap-3">
                                                <div
                                                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                                                    style={{
                                                        background:
                                                            'var(--color-gold-bg)',
                                                    }}
                                                >
                                                    <Icon className="h-6 w-6 text-[var(--color-gold)]" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold">
                                                        {goal.name}
                                                    </h3>
                                                    <div className="text-sm text-[var(--color-gold)]">
                                                        {t(
                                                            'goals.funds_unlocked',
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-xl font-bold">
                                                {format(goal.current_savings)}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Goal Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setShowCreateModal(false);
                                setCreateStep(1);
                                reset();
                            }}
                            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-[101] flex items-center justify-center"
                        >
                            <div
                                className="mx-4 w-full max-w-lg rounded-2xl p-6"
                                style={{
                                    background: 'var(--color-bg-elevated)',
                                    border: '1px solid var(--color-border)',
                                    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                                }}
                            >
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">
                                        {t('goals.create_new_goal')}
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setShowCreateModal(false);
                                            setCreateStep(1);
                                            reset();
                                        }}
                                        className="rounded-lg p-2 transition-colors hover:bg-white/5"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Step Indicator */}
                                <div className="mb-6 flex gap-2">
                                    <div
                                        className={`h-1 flex-1 rounded-full transition-all ${createStep >= 1 ? 'bg-[var(--color-gold)]' : 'bg-[var(--color-bg-base)]'}`}
                                    />
                                    <div
                                        className={`h-1 flex-1 rounded-full transition-all ${createStep >= 2 ? 'bg-[var(--color-gold)]' : 'bg-[var(--color-bg-base)]'}`}
                                    />
                                </div>

                                <form onSubmit={handleCreateGoal}>
                                    {createStep === 1 && (
                                        <>
                                            {/* Goal Name */}
                                            <div className="mb-4">
                                                <label className="mb-2 block text-sm font-medium text-[var(--color-text-muted)]">
                                                    {t('goals.goal_name')}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder={t(
                                                        'goals.goal_name_placeholder',
                                                    )}
                                                    className="w-full rounded-xl px-4 py-3 text-base transition-all outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50"
                                                    style={{
                                                        background:
                                                            'var(--color-bg-base)',
                                                        border: '1px solid var(--color-border)',
                                                        color: 'var(--color-text-main)',
                                                    }}
                                                    required
                                                />
                                            </div>

                                            {/* Icon Selection */}
                                            <div className="mb-6">
                                                <label className="mb-2 block text-sm font-medium text-[var(--color-text-muted)]">
                                                    {t('goals.category_icon')}
                                                </label>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {iconOptions.map((opt) => {
                                                        const Icon = opt.icon;
                                                        const isSelected =
                                                            formData.icon ===
                                                            opt.value;
                                                        return (
                                                            <button
                                                                key={opt.value}
                                                                type="button"
                                                                onClick={() =>
                                                                    setData(
                                                                        'icon',
                                                                        opt.value,
                                                                    )
                                                                }
                                                                className={`flex flex-col items-center gap-1 rounded-xl p-3 transition-all ${isSelected ? 'ring-2 ring-[var(--color-gold)]' : 'hover:bg-white/5'}`}
                                                                style={
                                                                    isSelected
                                                                        ? {
                                                                              background:
                                                                                  'var(--color-gold-bg)',
                                                                          }
                                                                        : {
                                                                              background:
                                                                                  'var(--color-bg-base)',
                                                                          }
                                                                }
                                                            >
                                                                <Icon
                                                                    className={`h-6 w-6 ${isSelected ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-muted)]'}`}
                                                                />
                                                                <span
                                                                    className={`text-xs ${isSelected ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-muted)]'}`}
                                                                >
                                                                    {t(
                                                                        opt.labelKey,
                                                                    )}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    formData.name &&
                                                    setCreateStep(2)
                                                }
                                                disabled={!formData.name}
                                                className="w-full rounded-xl py-3 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                                                style={{
                                                    background:
                                                        'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                                                    color: '#000',
                                                }}
                                            >
                                                {t('common.next')}
                                            </button>
                                        </>
                                    )}

                                    {createStep === 2 && (
                                        <>
                                            {/* Target Amount */}
                                            <div className="mb-4">
                                                <label className="mb-2 block text-sm font-medium text-[var(--color-text-muted)]">
                                                    {t('goals.target_amount')}
                                                </label>
                                                <div className="relative">
                                                    <DollarSign className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[var(--color-text-muted)]" />
                                                    <input
                                                        type="number"
                                                        value={
                                                            formData.target_amount
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'target_amount',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder={t(
                                                            'goals.target_amount_placeholder',
                                                        )}
                                                        min="1"
                                                        step="0.01"
                                                        className="w-full rounded-xl py-3 pr-4 pl-12 text-base transition-all outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50"
                                                        style={{
                                                            background:
                                                                'var(--color-bg-base)',
                                                            border: '1px solid var(--color-border)',
                                                            color: 'var(--color-text-main)',
                                                        }}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Timeframe */}
                                            <div className="mb-6">
                                                <label className="mb-2 block text-sm font-medium text-[var(--color-text-muted)]">
                                                    {t('goals.timeframe')}
                                                </label>
                                                <div className="relative">
                                                    <Calendar className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[var(--color-text-muted)]" />
                                                    <input
                                                        type="number"
                                                        value={
                                                            formData.target_months
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'target_months',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder={t(
                                                            'goals.timeframe_placeholder',
                                                        )}
                                                        min="1"
                                                        max="120"
                                                        className="w-full rounded-xl py-3 pr-4 pl-12 text-base transition-all outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50"
                                                        style={{
                                                            background:
                                                                'var(--color-bg-base)',
                                                            border: '1px solid var(--color-border)',
                                                            color: 'var(--color-text-main)',
                                                        }}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Auto-Save Toggle */}
                                            <div
                                                className="mb-6 rounded-2xl p-4"
                                                style={{
                                                    background:
                                                        'var(--color-bg-base)',
                                                    border: '1px solid var(--color-border)',
                                                }}
                                            >
                                                <div className="mb-2 flex items-center justify-between">
                                                    <div>
                                                        <div className="text-sm font-bold">
                                                            {t(
                                                                'goals.automatic_savings',
                                                            )}
                                                        </div>
                                                        <div className="text-[11px] text-[var(--color-text-muted)]">
                                                            {t(
                                                                'goals.auto_save_desc',
                                                            )}
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setData(
                                                                'is_automatic',
                                                                !formData.is_automatic,
                                                            )
                                                        }
                                                        className={`flex h-6 w-12 rounded-full p-1 transition-all duration-300 ${formData.is_automatic ? 'justify-end bg-[var(--color-gold)]' : 'justify-start bg-white/10'}`}
                                                    >
                                                        <div className="h-4 w-4 rounded-full bg-black shadow-sm" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Monthly Savings Preview */}
                                            {monthlySavingsPreview && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        y: 10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    className="mb-6 rounded-xl p-4"
                                                    style={{
                                                        background:
                                                            'var(--color-gold-bg)',
                                                        border: '1px solid var(--color-gold)/30',
                                                    }}
                                                >
                                                    <div className="mb-1 text-sm text-[var(--color-text-muted)]">
                                                        {t(
                                                            'goals.you_need_save',
                                                        )}
                                                    </div>
                                                    <div className="text-2xl font-bold text-[var(--color-gold)]">
                                                        {format(
                                                            monthlySavingsPreview,
                                                        )}
                                                        <span className="text-base font-normal">
                                                            {t(
                                                                'goals.per_month_label',
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="mt-1 text-sm text-[var(--color-text-muted)]">
                                                        {' '}
                                                        {t(
                                                            'goals.save_for_months',
                                                            {
                                                                months: formData.target_months,
                                                                amount: format(
                                                                    formData.target_amount,
                                                                ),
                                                            },
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}

                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setCreateStep(1)
                                                    }
                                                    className="flex-1 rounded-xl py-3 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                                                    style={{
                                                        background:
                                                            'var(--color-bg-base)',
                                                        border: '1px solid var(--color-border)',
                                                    }}
                                                >
                                                    {t('common.back')}
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="flex-1 rounded-xl py-3 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                                    style={{
                                                        background:
                                                            'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                                                        color: '#000',
                                                    }}
                                                >
                                                    {processing
                                                        ? t('goals.creating')
                                                        : t(
                                                              'goals.create_goal_submit',
                                                          )}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Deposit Modal */}
            <AnimatePresence>
                {depositGoalId && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setDepositGoalId(null);
                                resetDeposit();
                            }}
                            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-[101] flex items-center justify-center"
                        >
                            <div
                                className="mx-4 w-full max-w-md rounded-2xl p-6"
                                style={{
                                    background: 'var(--color-bg-elevated)',
                                    border: '1px solid var(--color-border)',
                                    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                                }}
                            >
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">
                                        {t('goals.deposit_to_goal')}
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setDepositGoalId(null);
                                            resetDeposit();
                                        }}
                                        className="rounded-lg p-2 transition-colors hover:bg-white/5"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <form
                                    onSubmit={(e) =>
                                        handleDeposit(e, depositGoalId)
                                    }
                                >
                                    <div className="mb-6">
                                        <label className="mb-2 block text-sm font-medium text-[var(--color-text-muted)]">
                                            {t('goals.amount_deposit')}
                                        </label>
                                        <div className="relative">
                                            <DollarSign className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[var(--color-text-muted)]" />
                                            <input
                                                type="number"
                                                value={depositData.amount}
                                                onChange={(e) =>
                                                    setDepositData(
                                                        'amount',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={t(
                                                    'goals.deposit_amount_placeholder',
                                                )}
                                                min="0.01"
                                                step="0.01"
                                                className="w-full rounded-xl py-3 pr-4 pl-12 text-lg transition-all outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50"
                                                style={{
                                                    background:
                                                        'var(--color-bg-base)',
                                                    border: '1px solid var(--color-border)',
                                                    color: 'var(--color-text-main)',
                                                }}
                                                required
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={
                                            depositProcessing ||
                                            !depositData.amount
                                        }
                                        className="w-full rounded-xl py-3 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                        style={{
                                            background:
                                                'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                                            color: '#000',
                                        }}
                                    >
                                        {depositProcessing
                                            ? t('goals.processing_deposit')
                                            : t('goals.deposit_btn')}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Unlock Modal */}
            <AnimatePresence>
                {showUnlockModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowUnlockModal(null)}
                            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-[101] flex items-center justify-center"
                        >
                            <div
                                className="mx-4 w-full max-w-md rounded-2xl p-6 text-center"
                                style={{
                                    background: 'var(--color-bg-elevated)',
                                    border: '1px solid var(--color-border)',
                                    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                                }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 200,
                                        delay: 0.2,
                                    }}
                                    className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full"
                                    style={{
                                        background: 'var(--color-gold-bg)',
                                    }}
                                >
                                    <Unlock className="h-10 w-10 text-[var(--color-gold)]" />
                                </motion.div>

                                <h2 className="mb-2 text-2xl font-bold">
                                    {t('goals.unlock_funds')}
                                </h2>
                                <p className="mb-4 text-[var(--color-text-muted)]">
                                    {t('goals.unlock_description', {
                                        amount:
                                            goals.find(
                                                (g) => g.id === showUnlockModal,
                                            )?.current_savings || 0,
                                    })}
                                </p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowUnlockModal(null)}
                                        className="flex-1 rounded-xl py-3 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        style={{
                                            background: 'var(--color-bg-base)',
                                            border: '1px solid var(--color-border)',
                                        }}
                                    >
                                        {t('common.cancel')}
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleUnlock(showUnlockModal)
                                        }
                                        className="flex-1 rounded-xl py-3 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        style={{
                                            background:
                                                'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                                            color: '#000',
                                        }}
                                    >
                                        {t('goals.unlock_funds_btn')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
