import { Head, router, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { useTranslation } from '@/hooks/useTranslation';
import {
    Target, Plus, DollarSign, Calendar, TrendingUp,
    Unlock, Trash2, CheckCircle2, X, Car, Monitor,
    Home, Plane, GraduationCap, Gift, PiggyBank
} from 'lucide-react';

const iconOptions = [
    { value: 'car', icon: Car, labelKey: 'goals.categories.car' },
    { value: 'monitor', icon: Monitor, labelKey: 'goals.categories.pc' },
    { value: 'home', icon: Home, labelKey: 'goals.categories.house' },
    { value: 'plane', icon: Plane, labelKey: 'goals.categories.travel' },
    { value: 'graduation-cap', icon: GraduationCap, labelKey: 'goals.categories.education' },
    { value: 'gift', icon: Gift, labelKey: 'goals.categories.gift' },
    { value: 'piggy-bank', icon: PiggyBank, labelKey: 'goals.categories.savings' },
    { value: 'target', icon: Target, labelKey: 'goals.categories.other' },
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
    const { t, locale } = useTranslation();

    const { data: formData, setData, post: formPost, reset, processing } = useForm({
        name: '',
        icon: 'target',
        target_amount: '',
        target_months: '',
        is_automatic: false,
    });

    const { data: depositData, setData: setDepositData, post: depositPost, reset: resetDeposit, processing: depositProcessing } = useForm({
        amount: '',
    });

    const activeGoals = useMemo(() => goals.filter(g => g.status === 'active'), [goals]);
    const completedGoals = useMemo(() => goals.filter(g => g.status === 'completed'), [goals]);
    const unlockedGoals = useMemo(() => goals.filter(g => g.status === 'unlocked'), [goals]);

    const totalSaved = useMemo(() => goals.reduce((sum, g) => sum + parseFloat(g.current_savings), 0), [goals]);
    const totalTarget = useMemo(() => goals.filter(g => g.status === 'active').reduce((sum, g) => sum + parseFloat(g.target_amount), 0), [goals]);

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
                {/* Background Fixed Glows (Stabilized) */}
                <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[var(--color-gold)] opacity-[0.03] rounded-full blur-[120px] pointer-events-none z-0" />
                <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-blue-500 opacity-[0.02] rounded-full blur-[100px] pointer-events-none z-0" />

                <Topbar />

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                 <Target className="w-8 h-8 text-[var(--color-gold)]" />
                                 {t('goals.title')}
                             </h1>
                             <p className="text-[var(--color-text-muted)] mt-1">{t('goals.subtitle')}</p>
                        </div>
                            <button
                                 onClick={() => setShowCreateModal(true)}
                                 className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
                                 style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', color: '#000' }}
                             >
                                 <Plus className="w-5 h-5" />
                                 {t('goals.new_goal')}
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
                            <div className="text-sm text-[var(--color-text-muted)] mb-1">{t('goals.active_goals')}</div>
                             <div className="text-3xl font-bold">{activeGoals.length}</div>
                         </motion.div>
                         <motion.div
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ delay: 0.1 }}
                             className="rounded-2xl p-5"
                             style={{ background: 'linear-gradient(135deg, var(--color-bg-card), var(--color-bg-elevated))', border: '1px solid var(--color-border)' }}
                         >
                             <div className="text-sm text-[var(--color-text-muted)] mb-1">{t('goals.total_saved')}</div>
                             <div className="text-3xl font-bold text-[var(--color-gold)]">MAD {totalSaved.toLocaleString('en-MA', { minimumFractionDigits: 2 })}</div>
                         </motion.div>
                         <motion.div
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ delay: 0.2 }}
                             className="rounded-2xl p-5"
                             style={{ background: 'linear-gradient(135deg, var(--color-bg-card), var(--color-bg-elevated))', border: '1px solid var(--color-border)' }}
                         >
                             <div className="text-sm text-[var(--color-text-muted)] mb-1">{t('goals.remaining')}</div>
                            <div className="text-3xl font-bold">MAD {totalTarget.toLocaleString('en-MA', { minimumFractionDigits: 2 })}</div>
                        </motion.div>
                    </div>

                    {/* Active Goals */}
                    <div>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                             <TrendingUp className="w-5 h-5 text-[var(--color-gold)]" />
                             {t('goals.active_goals')}
                         </h2>

                         {activeGoals.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="rounded-2xl p-12 text-center"
                                style={{ background: 'linear-gradient(135deg, var(--color-bg-card), var(--color-bg-elevated))', border: '1px solid var(--color-border)' }}
                            >
                                <PiggyBank className="w-16 h-16 mx-auto text-[var(--color-text-muted)] mb-4 opacity-50" />
                                <h3 className="text-xl font-semibold mb-2">{t('goals.no_active_goals')}</h3>
                                 <p className="text-[var(--color-text-muted)] mb-4">{t('goals.create_first_goal')}</p>
                                 <button
                                     onClick={() => setShowCreateModal(true)}
                                     className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all hover:scale-105"
                                     style={{ background: 'var(--color-gold-bg)', color: 'var(--color-gold)' }}
                                 >
                                     <Plus className="w-5 h-5" />
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
                                                        <h3 className="font-bold text-lg flex items-center gap-2">
                                                             {goal.name}
                                                             {goal.is_automatic && (
                                                                 <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold uppercase tracking-wider">{t('goals.auto')}</span>
                                                             )}
                                                         </h3>
                                                         <div className="text-sm text-[var(--color-text-muted)] flex items-center gap-1">
                                                             <Calendar className="w-3 h-3" />
                                                             {goal.target_months} {t('goals.months_label')}
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
                                                     <span className="text-[var(--color-text-muted)]">{t('goals.progress')}</span>
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
                                                     <div className="text-xs text-[var(--color-text-muted)] mb-0.5">{t('goals.saved')}</div>
                                                     <div className="font-semibold">MAD {parseFloat(goal.current_savings).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                                 </div>
                                                 <div>
                                                     <div className="text-xs text-[var(--color-text-muted)] mb-0.5">{t('goals.target')}</div>
                                                     <div className="font-semibold">MAD {parseFloat(goal.target_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                                 </div>
                                                 <div>
                                                     <div className="text-xs text-[var(--color-text-muted)] mb-0.5">{t('goals.remaining')}</div>
                                                     <div className="font-semibold text-red-400">MAD {parseFloat(goal.remaining_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                                 </div>
                                                 <div>
                                                     <div className="text-xs text-[var(--color-text-muted)] mb-0.5">{t('goals.per_month')}</div>
                                                     <div className="font-semibold text-[var(--color-gold)]">MAD {parseFloat(goal.monthly_savings).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                                 </div>
                                             </div>

                                             {/* Deposit Button */}
                                             <button
                                                 onClick={() => setDepositGoalId(goal.id)}
                                                 className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                                                 style={{ background: 'var(--color-gold-bg)', color: 'var(--color-gold)', border: '1px solid var(--color-gold)/30' }}
                                             >
                                                 <DollarSign className="w-4 h-4" />
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
                             <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                 <CheckCircle2 className="w-5 h-5 text-green-500" />
                                 {t('goals.completed_title')}
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
                                                     <div className="text-sm text-green-500 font-semibold">{t('goals.goal_reached')}</div>
                                                 </div>
                                             </div>

                                             <div className="mb-4">
                                                 <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
                                                     <div className="h-full rounded-full bg-green-500 w-full" />
                                                 </div>
                                             </div>

                                             <div className="text-center mb-4">
                                                 <div className="text-2xl font-bold text-[var(--color-gold)]">MAD {parseFloat(goal.current_savings).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                                 <div className="text-sm text-[var(--color-text-muted)]">{t('goals.available_to_unlock')}</div>
                                             </div>

                                             <button
                                                 onClick={() => setShowUnlockModal(goal.id)}
                                                 className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                                                 style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', color: '#000' }}
                                             >
                                                 <Unlock className="w-4 h-4" />
                                                 {t('goals.unlock_amount', { amount: parseFloat(goal.current_savings).toLocaleString('en-US', { minimumFractionDigits: 2 }) })}
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
                                 {t('goals.unlocked_goals')}
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
                                                     <div className="text-sm text-[var(--color-gold)]">{t('goals.funds_unlocked')}</div>
                                                 </div>
                                             </div>
                                            <div className="text-xl font-bold">MAD {parseFloat(goal.current_savings).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
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
                                     <h2 className="text-2xl font-bold">{t('goals.create_new_goal')}</h2>
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
                                                 <label className="block text-sm font-medium mb-2 text-[var(--color-text-muted)]">{t('goals.goal_name')}</label>
                                                 <input
                                                     type="text"
                                                     value={formData.name}
                                                     onChange={e => setData('name', e.target.value)}
                                                     placeholder={t('goals.goal_name_placeholder')}
                                                     className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all focus:ring-2 focus:ring-[var(--color-gold)]/50"
                                                     style={{ background: 'var(--color-bg-base)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}
                                                     required
                                                 />
                                             </div>

                                             {/* Icon Selection */}
                                             <div className="mb-6">
                                                 <label className="block text-sm font-medium mb-2 text-[var(--color-text-muted)]">{t('goals.category_icon')}</label>
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
                                                                 <span className={`text-xs ${isSelected ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-muted)]'}`}>{t(opt.labelKey)}</span>
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
                                                 {t('common.next')}
                                             </button>
                                         </>
                                     )}

                                    {createStep === 2 && (
                                         <>
                                             {/* Target Amount */}
                                             <div className="mb-4">
                                                 <label className="block text-sm font-medium mb-2 text-[var(--color-text-muted)]">{t('goals.target_amount')}</label>
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
                                             <div className="mb-6">
                                                 <label className="block text-sm font-medium mb-2 text-[var(--color-text-muted)]">{t('goals.timeframe')}</label>
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

                                             {/* Auto-Save Toggle */}
                                             <div className="mb-6 p-4 rounded-2xl" style={{ background: 'var(--color-bg-base)', border: '1px solid var(--color-border)' }}>
                                                 <div className="flex items-center justify-between mb-2">
                                                     <div>
                                                         <div className="font-bold text-sm">{t('goals.automatic_savings')}</div>
                                                         <div className="text-[11px] text-[var(--color-text-muted)]">{t('goals.auto_save_desc')}</div>
                                                     </div>
                                                     <button
                                                         type="button"
                                                         onClick={() => setData('is_automatic', !formData.is_automatic)}
                                                         className={`w-12 h-6 rounded-full p-1 transition-all duration-300 flex ${formData.is_automatic ? 'bg-[var(--color-gold)] justify-end' : 'bg-white/10 justify-start'}`}
                                                     >
                                                         <div className="w-4 h-4 rounded-full bg-black shadow-sm" />
                                                     </button>
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
                                                     <div className="text-sm text-[var(--color-text-muted)] mb-1">{t('goals.you_need_save')}</div>
                                                     <div className="text-2xl font-bold text-[var(--color-gold)]">MAD {monthlySavingsPreview}<span className="text-base font-normal">{t('goals.per_month_label')}</span></div>
                                                     <div className="text-sm text-[var(--color-text-muted)] mt-1">{t('goals.save_for_months', { months: formData.target_months, amount: parseFloat(formData.target_amount).toLocaleString() })}</div>
                                                 </motion.div>
                                             )}

                                             <div className="flex gap-3">
                                                 <button
                                                     type="button"
                                                     onClick={() => setCreateStep(1)}
                                                     className="flex-1 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                                                     style={{ background: 'var(--color-bg-base)', border: '1px solid var(--color-border)' }}
                                                 >
                                                     {t('common.back')}
                                                 </button>
                                                 <button
                                                     type="submit"
                                                     disabled={processing}
                                                     className="flex-1 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                                     style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', color: '#000' }}
                                                 >
                                                     {processing ? t('goals.creating') : t('goals.create_goal_submit')}
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
                                     <h2 className="text-2xl font-bold">{t('goals.deposit_to_goal')}</h2>
                                     <button
                                         onClick={() => { setDepositGoalId(null); resetDeposit(); }}
                                         className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                                     >
                                         <X className="w-5 h-5" />
                                     </button>
                                 </div>

                                 <form onSubmit={(e) => handleDeposit(e, depositGoalId)}>
                                     <div className="mb-6">
                                         <label className="block text-sm font-medium mb-2 text-[var(--color-text-muted)]">{t('goals.amount_deposit')}</label>
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
                                         {depositProcessing ? t('goals.processing_deposit') : t('goals.deposit_btn')}
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

                                <h2 className="text-2xl font-bold mb-2">{t('goals.unlock_funds')}</h2>
                                 <p className="text-[var(--color-text-muted)] mb-4">
                                     {t('goals.unlock_description', { amount: goals.find(g => g.id === showUnlockModal)?.current_savings || 0 })}
                                 </p>

                                 <div className="flex gap-3">
                                     <button
                                         onClick={() => setShowUnlockModal(null)}
                                         className="flex-1 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                                         style={{ background: 'var(--color-bg-base)', border: '1px solid var(--color-border)' }}
                                     >
                                         {t('common.cancel')}
                                     </button>
                                     <button
                                         onClick={() => handleUnlock(showUnlockModal)}
                                         className="flex-1 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                                         style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', color: '#000' }}
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
