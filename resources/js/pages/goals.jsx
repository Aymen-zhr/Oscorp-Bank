import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import {
    Target, Plus, DollarSign, Calendar, TrendingUp,
    Unlock, Trash2, CheckCircle2, X, Car, Monitor,
    Home, Plane, GraduationCap, Gift, PiggyBank
} from 'lucide-react';

const iconOptions = [
    { value: 'car', icon: Car, label: 'Car' },
    { value: 'monitor', icon: Monitor, label: 'PC' },
    { value: 'home', icon: Home, label: 'House' },
    { value: 'plane', icon: Plane, label: 'Travel' },
    { value: 'graduation-cap', icon: GraduationCap, label: 'Education' },
    { value: 'gift', icon: Gift, label: 'Gift' },
    { value: 'piggy-bank', icon: PiggyBank, label: 'Savings' },
    { value: 'target', icon: Target, label: 'Other' },
];

function getIconComponent(name) {
    const option = iconOptions.find(o => o.value === name);
    return option ? option.icon : Target;
}

export default function Goals({ goals }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [depositGoalId, setDepositGoalId] = useState(null);
    const [showUnlockModal, setShowUnlockModal] = useState(null);
    const [createStep, setCreateStep] = useState(1);

    const { data: formData, setData, post: formPost, reset, processing } = useForm({
        name: '',
        icon: 'target',
        target_amount: '',
        target_months: '',
    });

    const { data: depositData, setData: setDepositData, post: depositPost, reset: resetDeposit, processing: depositProcessing } = useForm({
        amount: '',
    });

    const activeGoals = goals.filter(g => g.status === 'active');
    const completedGoals = goals.filter(g => g.status === 'completed');
    const unlockedGoals = goals.filter(g => g.status === 'unlocked');

    const totalSaved = goals.reduce((sum, g) => sum + parseFloat(g.current_savings), 0);
    const totalTarget = goals.filter(g => g.status === 'active').reduce((sum, g) => sum + parseFloat(g.target_amount), 0);

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

    const monthlySavingsPreview = formData.target_amount && formData.target_months
        ? (parseFloat(formData.target_amount) / parseInt(formData.target_months)).toFixed(2)
        : null;

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[var(--color-bg-base)] text-[var(--color-text-main)] font-sans antialiased selection:bg-[var(--color-gold)] selection:text-white">
            <Head title="OSCORP Goals" />

            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                <Topbar />

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                <Target className="w-8 h-8 text-[var(--color-gold)]" />
                                Savings Goals
                            </h1>
                            <p className="text-[var(--color-text-muted)] mt-1">Track and achieve your financial milestones</p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
                            style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', color: '#000' }}
                        >
                            <Plus className="w-5 h-5" />
                            New Goal
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl p-5"
                            style={{ background: 'linear-gradient(135deg, var(--color-bg-card), var(--color-bg-elevated))', border: '1px solid var(--color-border)' }}
                        >
                            <div className="text-sm text-[var(--color-text-muted)] mb-1">Active Goals</div>
                            <div className="text-3xl font-bold">{activeGoals.length}</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="rounded-2xl p-5"
                            style={{ background: 'linear-gradient(135deg, var(--color-bg-card), var(--color-bg-elevated))', border: '1px solid var(--color-border)' }}
                        >
                            <div className="text-sm text-[var(--color-text-muted)] mb-1">Total Saved</div>
                            <div className="text-3xl font-bold text-[var(--color-gold)]">${totalSaved.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-2xl p-5"
                            style={{ background: 'linear-gradient(135deg, var(--color-bg-card), var(--color-bg-elevated))', border: '1px solid var(--color-border)' }}
                        >
                            <div className="text-sm text-[var(--color-text-muted)] mb-1">Remaining to Goal</div>
                            <div className="text-3xl font-bold">${totalTarget.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                        </motion.div>
                    </div>

                    {/* Active Goals */}
                    <div>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[var(--color-gold)]" />
                            Active Goals
                        </h2>

                        {activeGoals.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="rounded-2xl p-12 text-center"
                                style={{ background: 'linear-gradient(135deg, var(--color-bg-card), var(--color-bg-elevated))', border: '1px solid var(--color-border)' }}
                            >
                                <PiggyBank className="w-16 h-16 mx-auto text-[var(--color-text-muted)] mb-4 opacity-50" />
                                <h3 className="text-xl font-semibold mb-2">No active goals yet</h3>
                                <p className="text-[var(--color-text-muted)] mb-4">Create your first savings goal and start building towards your dreams</p>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all hover:scale-105"
                                    style={{ background: 'var(--color-gold-bg)', color: 'var(--color-gold)' }}
                                >
                                    <Plus className="w-5 h-5" />
                                    Create Goal
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
                                            style={{ background: 'linear-gradient(135deg, var(--color-bg-card), var(--color-bg-elevated))', border: '1px solid var(--color-border)' }}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                                                        style={{ background: 'var(--color-gold-bg)' }}
                                                    >
                                                        <Icon className="w-6 h-6 text-[var(--color-gold)]" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg">{goal.name}</h3>
                                                        <div className="text-sm text-[var(--color-text-muted)] flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {goal.target_months} months
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(goal.id)}
                                                    className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-400 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="mb-4">
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-[var(--color-text-muted)]">Progress</span>
                                                    <span className="font-semibold text-[var(--color-gold)]">{goal.progress}%</span>
                                                </div>
                                                <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${goal.progress}%` }}
                                                        transition={{ duration: 1, ease: 'easeOut' }}
                                                        className="h-full rounded-full"
                                                        style={{ background: 'linear-gradient(90deg, var(--color-gold), var(--color-gold-dark))' }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Amounts */}
                                            <div className="grid grid-cols-4 gap-3 mb-4">
                                                <div>
                                                    <div className="text-xs text-[var(--color-text-muted)] mb-0.5">Saved</div>
                                                    <div className="font-semibold">${parseFloat(goal.current_savings).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-[var(--color-text-muted)] mb-0.5">Target</div>
                                                    <div className="font-semibold">${parseFloat(goal.target_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-[var(--color-text-muted)] mb-0.5">Remaining</div>
                                                    <div className="font-semibold text-red-400">${parseFloat(goal.remaining_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-[var(--color-text-muted)] mb-0.5">Per Month</div>
                                                    <div className="font-semibold text-[var(--color-gold)]">${parseFloat(goal.monthly_savings).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                                </div>
                                            </div>

                                            {/* Deposit Button */}
                                            <button
                                                onClick={() => setDepositGoalId(goal.id)}
                                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                                                style={{ background: 'var(--color-gold-bg)', color: 'var(--color-gold)', border: '1px solid var(--color-gold)/30' }}
                                            >
                                                <DollarSign className="w-4 h-4" />
                                                Deposit
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
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                Completed - Ready to Unlock
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {completedGoals.map((goal) => {
                                    const Icon = getIconComponent(goal.icon);
                                    return (
                                        <motion.div
                                            key={goal.id}
                                            className="rounded-2xl p-5 border-2"
                                            style={{ background: 'linear-gradient(135deg, var(--color-bg-card), var(--color-bg-elevated))', borderColor: 'var(--color-gold)/50' }}
                                        >
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-gold-bg)' }}>
                                                    <Icon className="w-6 h-6 text-[var(--color-gold)]" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg">{goal.name}</h3>
                                                    <div className="text-sm text-green-500 font-semibold">Goal Reached!</div>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
                                                    <div className="h-full rounded-full bg-green-500 w-full" />
                                                </div>
                                            </div>

                                            <div className="text-center mb-4">
                                                <div className="text-2xl font-bold text-[var(--color-gold)]">${parseFloat(goal.current_savings).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                                <div className="text-sm text-[var(--color-text-muted)]">Available to unlock</div>
                                            </div>

                                            <button
                                                onClick={() => setShowUnlockModal(goal.id)}
                                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                                                style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', color: '#000' }}
                                            >
                                                <Unlock className="w-4 h-4" />
                                                Unlock ${parseFloat(goal.current_savings).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-[var(--color-gold)]" />
                                Unlocked Goals
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {unlockedGoals.map((goal) => {
                                    const Icon = getIconComponent(goal.icon);
                                    return (
                                        <motion.div
                                            key={goal.id}
                                            className="rounded-2xl p-5 opacity-70"
                                            style={{ background: 'linear-gradient(135deg, var(--color-bg-card), var(--color-bg-elevated))', border: '1px solid var(--color-border)' }}
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-gold-bg)' }}>
                                                    <Icon className="w-6 h-6 text-[var(--color-gold)]" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg">{goal.name}</h3>
                                                    <div className="text-sm text-[var(--color-gold)]">Funds Unlocked</div>
                                                </div>
                                            </div>
                                            <div className="text-xl font-bold">${parseFloat(goal.current_savings).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
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
                            onClick={() => { setShowCreateModal(false); setCreateStep(1); reset(); }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-[101] flex items-center justify-center"
                        >
                            <div
                                className="w-full max-w-lg rounded-2xl p-6 mx-4"
                                style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold">Create New Goal</h2>
                                    <button
                                        onClick={() => { setShowCreateModal(false); setCreateStep(1); reset(); }}
                                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Step Indicator */}
                                <div className="flex gap-2 mb-6">
                                    <div className={`h-1 flex-1 rounded-full transition-all ${createStep >= 1 ? 'bg-[var(--color-gold)]' : 'bg-[var(--color-bg-base)]'}`} />
                                    <div className={`h-1 flex-1 rounded-full transition-all ${createStep >= 2 ? 'bg-[var(--color-gold)]' : 'bg-[var(--color-bg-base)]'}`} />
                                </div>

                                <form onSubmit={handleCreateGoal}>
                                    {createStep === 1 && (
                                        <>
                                            {/* Goal Name */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium mb-2 text-[var(--color-text-muted)]">Goal Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={e => setData('name', e.target.value)}
                                                    placeholder="e.g., New Car, Gaming PC"
                                                    className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all focus:ring-2 focus:ring-[var(--color-gold)]/50"
                                                    style={{ background: 'var(--color-bg-base)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}
                                                    required
                                                />
                                            </div>

                                            {/* Icon Selection */}
                                            <div className="mb-6">
                                                <label className="block text-sm font-medium mb-2 text-[var(--color-text-muted)]">Category Icon</label>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {iconOptions.map((opt) => {
                                                        const Icon = opt.icon;
                                                        const isSelected = formData.icon === opt.value;
                                                        return (
                                                            <button
                                                                key={opt.value}
                                                                type="button"
                                                                onClick={() => setData('icon', opt.value)}
                                                                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${isSelected ? 'ring-2 ring-[var(--color-gold)]' : 'hover:bg-white/5'}`}
                                                                style={isSelected ? { background: 'var(--color-gold-bg)' } : { background: 'var(--color-bg-base)' }}
                                                            >
                                                                <Icon className={`w-6 h-6 ${isSelected ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-muted)]'}`} />
                                                                <span className={`text-xs ${isSelected ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-muted)]'}`}>{opt.label}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => formData.name && setCreateStep(2)}
                                                disabled={!formData.name}
                                                className="w-full py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                                style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', color: '#000' }}
                                            >
                                                Next
                                            </button>
                                        </>
                                    )}

                                    {createStep === 2 && (
                                        <>
                                            {/* Target Amount */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium mb-2 text-[var(--color-text-muted)]">Target Amount ($)</label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                                                    <input
                                                        type="number"
                                                        value={formData.target_amount}
                                                        onChange={e => setData('target_amount', e.target.value)}
                                                        placeholder="5000"
                                                        min="1"
                                                        step="0.01"
                                                        className="w-full pl-12 pr-4 py-3 rounded-xl text-base outline-none transition-all focus:ring-2 focus:ring-[var(--color-gold)]/50"
                                                        style={{ background: 'var(--color-bg-base)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Timeframe */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium mb-2 text-[var(--color-text-muted)]">Timeframe (months)</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                                                    <input
                                                        type="number"
                                                        value={formData.target_months}
                                                        onChange={e => setData('target_months', e.target.value)}
                                                        placeholder="12"
                                                        min="1"
                                                        max="120"
                                                        className="w-full pl-12 pr-4 py-3 rounded-xl text-base outline-none transition-all focus:ring-2 focus:ring-[var(--color-gold)]/50"
                                                        style={{ background: 'var(--color-bg-base)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Monthly Savings Preview */}
                                            {monthlySavingsPreview && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="mb-6 p-4 rounded-xl"
                                                    style={{ background: 'var(--color-gold-bg)', border: '1px solid var(--color-gold)/30' }}
                                                >
                                                    <div className="text-sm text-[var(--color-text-muted)] mb-1">You need to save</div>
                                                    <div className="text-2xl font-bold text-[var(--color-gold)]">${monthlySavingsPreview}<span className="text-base font-normal">/month</span></div>
                                                    <div className="text-sm text-[var(--color-text-muted)] mt-1">for {formData.target_months} months to reach ${parseFloat(formData.target_amount).toLocaleString()}</div>
                                                </motion.div>
                                            )}

                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setCreateStep(1)}
                                                    className="flex-1 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                                                    style={{ background: 'var(--color-bg-base)', border: '1px solid var(--color-border)' }}
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="flex-1 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                                    style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', color: '#000' }}
                                                >
                                                    {processing ? 'Creating...' : 'Create Goal'}
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
                            onClick={() => { setDepositGoalId(null); resetDeposit(); }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-[101] flex items-center justify-center"
                        >
                            <div
                                className="w-full max-w-md rounded-2xl p-6 mx-4"
                                style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold">Deposit to Goal</h2>
                                    <button
                                        onClick={() => { setDepositGoalId(null); resetDeposit(); }}
                                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={(e) => handleDeposit(e, depositGoalId)}>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium mb-2 text-[var(--color-text-muted)]">Amount ($)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                                            <input
                                                type="number"
                                                value={depositData.amount}
                                                onChange={e => setDepositData('amount', e.target.value)}
                                                placeholder="100"
                                                min="0.01"
                                                step="0.01"
                                                className="w-full pl-12 pr-4 py-3 rounded-xl text-lg outline-none transition-all focus:ring-2 focus:ring-[var(--color-gold)]/50"
                                                style={{ background: 'var(--color-bg-base)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}
                                                required
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={depositProcessing || !depositData.amount}
                                        className="w-full py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                        style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', color: '#000' }}
                                    >
                                        {depositProcessing ? 'Processing...' : 'Deposit'}
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
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-[101] flex items-center justify-center"
                        >
                            <div
                                className="w-full max-w-md rounded-2xl p-6 mx-4 text-center"
                                style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                                    className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                                    style={{ background: 'var(--color-gold-bg)' }}
                                >
                                    <Unlock className="w-10 h-10 text-[var(--color-gold)]" />
                                </motion.div>

                                <h2 className="text-2xl font-bold mb-2">Unlock Your Funds?</h2>
                                <p className="text-[var(--color-text-muted)] mb-4">
                                    You've reached your goal! Unlock ${goals.find(g => g.id === showUnlockModal)?.current_savings || 0} to your main balance.
                                </p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowUnlockModal(null)}
                                        className="flex-1 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        style={{ background: 'var(--color-bg-base)', border: '1px solid var(--color-border)' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleUnlock(showUnlockModal)}
                                        className="flex-1 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', color: '#000' }}
                                    >
                                        Unlock Funds
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
