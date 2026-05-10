import { Head, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import {
    CreditCard,
    Landmark,
    Copy,
    Check,
    ShieldCheck,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
    Info,
    Eye,
    EyeOff,
    Download,
    ChevronRight,
    History,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import { TIMEOUTS } from '@/constants';

export default function Cards({
    user,
    card,
    rib,
    account,
    stats,
    recentTransactions = [],
}) {
    const [showFullCard, setShowFullCard] = useState(false);
    const [copied, setCopied] = useState(null);
    const { t, locale } = useTranslation();
    const { format } = useCurrency();

    const copyToClipboard = (text, key) => {
        navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), TIMEOUTS.copyFeedback);
    };

    // Using useCurrency hook instead of formatCurrency

    return (
        <div
            className="flex h-screen w-full overflow-hidden font-sans antialiased selection:bg-[var(--color-gold)] selection:text-[var(--color-gold-fg)]"
            style={{ background: 'var(--color-bg-base)' }}
        >
            <Head title="Card Information" />
            <Sidebar active="cards" />

            <div className="relative flex flex-1 flex-col overflow-hidden">
                {/* Background Ambient Glows (Stabilized) */}
                <div className="pointer-events-none fixed top-0 right-0 z-0 h-[500px] w-[500px] rounded-full bg-[var(--color-gold)] opacity-[0.03] blur-[120px]" />
                <div className="pointer-events-none fixed bottom-0 left-0 z-0 h-[400px] w-[400px] rounded-full bg-blue-500 opacity-[0.02] blur-[100px]" />

                <Topbar />

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="custom-scrollbar flex-1 overflow-y-auto px-6 py-8 pb-32 md:pb-8"
                >
                    <div className="mx-auto max-w-7xl space-y-8">
                        {/* Header */}
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                            <div>
                                <h1 className="text-[32px] font-bold tracking-tight text-[var(--color-text-main)]">
                                    {t('cards.title')}
                                </h1>
                                <p className="mt-1 text-[14px] text-[var(--color-text-muted)]">
                                    {t('cards.subtitle')}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-5 py-2.5 text-[13px] font-bold text-[var(--color-text-main)] transition-all hover:bg-[var(--color-bg-card)]">
                                    <Download className="h-4 w-4" />{' '}
                                    {t('cards.statements')}
                                </button>
                                <button className="flex items-center gap-2 rounded-xl bg-[var(--color-gold)] px-5 py-2.5 text-[13px] font-bold text-[var(--color-gold-fg)] shadow-[var(--color-gold)]/20 shadow-lg transition-all hover:brightness-110">
                                    <Zap className="h-4 w-4" />{' '}
                                    {t('cards.transfer_funds')}
                                </button>
                            </div>
                        </div>

                        {/* Top Cards Grid */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
                            {/* Card Section */}
                            <div className="space-y-6 lg:col-span-5">
                                <h3 className="px-1 text-[12px] font-bold tracking-[0.2em] text-[var(--color-text-muted)] uppercase">
                                    {t('cards.active_card')}
                                </h3>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="group relative h-[280px] w-full cursor-pointer overflow-hidden rounded-[28px] shadow-2xl"
                                    style={{
                                        background:
                                            'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
                                        border: '1px solid rgba(212,175,55,0.3)',
                                        boxShadow:
                                            '0 20px 40px -15px rgba(0,0,0,0.5)',
                                    }}
                                >
                                    {/* Card Textures */}
                                    <div
                                        className="pointer-events-none absolute inset-0 opacity-20"
                                        style={{
                                            backgroundImage:
                                                'radial-gradient(circle at 20% 20%, rgba(212,175,55,0.4) 0%, transparent 40%)',
                                        }}
                                    />
                                    <div
                                        className="pointer-events-none absolute inset-0 opacity-10"
                                        style={{
                                            background:
                                                'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")',
                                        }}
                                    />

                                    <div className="relative z-10 flex h-full flex-col justify-between p-8">
                                        <div className="flex items-start justify-between">
                                            <div className="flex flex-col">
                                                <span className="mb-1 text-[10px] font-bold tracking-widest text-[var(--color-gold)] uppercase">
                                                    OSCORP PRIVATE
                                                </span>
                                                <span className="text-[20px] font-bold tracking-wider text-white/90 italic">
                                                    PLATINUM
                                                </span>
                                            </div>
                                            <div className="flex h-10 w-14 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur-md">
                                                <div className="-mr-3 h-8 w-8 rounded-full bg-red-500/80 mix-blend-screen" />
                                                <div className="h-8 w-8 rounded-full bg-yellow-500/80 mix-blend-screen" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-6">
                                                <div className="font-mono text-[22px] tracking-[0.2em] text-white">
                                                    {showFullCard
                                                        ? card.full_number
                                                        : `••••  ••••  ••••  ${card.number}`}
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowFullCard(
                                                            !showFullCard,
                                                        );
                                                    }}
                                                    className="rounded-lg bg-white/5 p-2 transition-colors hover:bg-white/10"
                                                >
                                                    {showFullCard ? (
                                                        <EyeOff className="h-4 w-4 text-white/60" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-white/60" />
                                                    )}
                                                </button>
                                            </div>

                                            <div className="flex gap-12">
                                                <div>
                                                    <div className="mb-1 text-[8px] font-bold tracking-widest text-white/40 uppercase">
                                                        Card Holder
                                                    </div>
                                                    <div className="text-[14px] font-bold tracking-widest text-white/90 uppercase">
                                                        {card.holder}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="mb-1 text-[8px] font-bold tracking-widest text-white/40 uppercase">
                                                        Expires
                                                    </div>
                                                    <div className="text-[14px] font-bold text-white/90">
                                                        {card.expiry}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="mb-1 text-[8px] font-bold tracking-widest text-white/40 uppercase">
                                                        CVV
                                                    </div>
                                                    <div className="text-[14px] font-bold text-white/90">
                                                        {showFullCard
                                                            ? '774'
                                                            : '•••'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Chip */}
                                    <div className="absolute top-1/2 left-8 h-10 w-12 -translate-y-1/2 overflow-hidden rounded-lg border border-black/10 bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 opacity-80">
                                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-[2px] p-1 opacity-40">
                                            {[...Array(9)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="border border-black/20"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4">
                                        <div className="mb-2 text-[11px] font-bold text-[var(--color-text-muted)] uppercase">
                                            {t('cards.spending_limit')}
                                        </div>
                                        <div className="text-[18px] font-bold text-[var(--color-text-main)]">
                                            {format(card.limit)}
                                        </div>
                                    </div>
                                    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4">
                                        <div className="mb-2 text-[11px] font-bold text-[var(--color-text-muted)] uppercase">
                                            {t('cards.available_credit')}
                                        </div>
                                        <div className="text-[18px] font-bold text-emerald-400">
                                            {format(card.available)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Account Details / RIB Section */}
                            <div className="space-y-6 lg:col-span-7">
                                <h3 className="px-1 text-[12px] font-bold tracking-[0.2em] text-[var(--color-text-muted)] uppercase">
                                    {t('cards.account_identifiers')}
                                </h3>

                                <div className="relative overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8">
                                    <div className="absolute top-0 right-0 h-48 w-48 translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-gold)] opacity-[0.03] blur-[40px]" />

                                    <div className="relative z-10 space-y-8">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/10">
                                                    <Landmark className="h-6 w-6 text-[var(--color-gold)]" />
                                                </div>
                                                <div>
                                                    <div className="text-[18px] font-bold text-[var(--color-text-main)]">
                                                        {account.type}
                                                    </div>
                                                    <div className="text-[13px] text-[var(--color-text-muted)]">
                                                        {account.branch}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold tracking-wider text-emerald-400 uppercase">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                                {account.status}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-8 pt-4 md:grid-cols-2">
                                            <div className="space-y-4">
                                                <div className="group">
                                                    <div className="mb-1.5 flex items-center justify-between">
                                                        <span className="text-[11px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase">
                                                            {t(
                                                                'cards.rib_full',
                                                            )}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                copyToClipboard(
                                                                    rib.full,
                                                                    'full',
                                                                )
                                                            }
                                                            className="rounded-lg p-1.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white/5"
                                                        >
                                                            {copied ===
                                                            'full' ? (
                                                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                                                            ) : (
                                                                <Copy className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 font-mono text-[15px] font-bold tracking-wide text-[var(--color-text-main)]">
                                                        {rib.full}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <div className="mb-1 text-[10px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase">
                                                            {t(
                                                                'cards.bank_code',
                                                            )}
                                                        </div>
                                                        <div className="font-mono text-[14px] font-bold text-[var(--color-text-main)]">
                                                            {rib.bank_code}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="mb-1 text-[10px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase">
                                                            {t(
                                                                'cards.branch_code',
                                                            )}
                                                        </div>
                                                        <div className="font-mono text-[14px] font-bold text-[var(--color-text-main)]">
                                                            {rib.branch_code}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="group">
                                                    <div className="mb-1.5 flex items-center justify-between">
                                                        <span className="text-[11px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase">
                                                            {t(
                                                                'cards.account_number',
                                                            )}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                copyToClipboard(
                                                                    rib.account_number,
                                                                    'acc',
                                                                )
                                                            }
                                                            className="rounded-lg p-1.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white/5"
                                                        >
                                                            {copied ===
                                                            'acc' ? (
                                                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                                                            ) : (
                                                                <Copy className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 font-mono text-[15px] font-bold tracking-wide text-[var(--color-text-main)]">
                                                        {rib.account_number}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <div className="mb-1 text-[10px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase">
                                                            {t('cards.rib_key')}
                                                        </div>
                                                        <div className="font-mono text-[14px] font-bold text-[var(--color-text-main)]">
                                                            {rib.rib_key}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="mb-1 text-[10px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase">
                                                            {t(
                                                                'cards.opened_on',
                                                            )}
                                                        </div>
                                                        <div className="text-[14px] font-bold text-[var(--color-text-main)]">
                                                            {account.opened}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 border-t border-[var(--color-border)] pt-6">
                                            <div className="shrink-0 rounded-lg bg-blue-500/10 p-2">
                                                <Info className="h-4 w-4 text-blue-400" />
                                            </div>
                                            <p className="text-[12px] leading-relaxed text-[var(--color-text-muted)]">
                                                {t('cards.rib_description')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent History / Stats Grid */}
                        <div className="grid grid-cols-1 gap-8 pb-10 lg:grid-cols-12">
                            {/* Activity Stats */}
                            <div className="space-y-6 lg:col-span-4">
                                <h3 className="px-1 text-[12px] font-bold tracking-[0.2em] text-[var(--color-text-muted)] uppercase">
                                    {t('cards.engagement_metrics')}
                                </h3>
                                <div className="space-y-6 rounded-[28px] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-xl bg-emerald-500/10 p-2">
                                                <ArrowDownRight className="h-4 w-4 text-emerald-400" />
                                            </div>
                                            <span className="text-[13px] font-bold text-[var(--color-text-main)]">
                                                {t('cards.total_inflow')}
                                            </span>
                                        </div>
                                        <span className="text-[14px] font-bold text-emerald-400">
                                            +{format(stats.total_credits)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-xl bg-red-500/10 p-2">
                                                <ArrowUpRight className="h-4 w-4 text-red-400" />
                                            </div>
                                            <span className="text-[13px] font-bold text-[var(--color-text-main)]">
                                                {t('cards.total_outflow')}
                                            </span>
                                        </div>
                                        <span className="text-[14px] font-bold text-red-400">
                                            -{format(stats.total_debits)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-xl bg-blue-500/10 p-2">
                                                <History className="h-4 w-4 text-blue-400" />
                                            </div>
                                            <span className="text-[13px] font-bold text-[var(--color-text-main)]">
                                                {t('cards.monthly_volume')}
                                            </span>
                                        </div>
                                        <span className="text-[14px] font-bold text-[var(--color-text-main)]">
                                            {stats.transaction_count} Tx
                                        </span>
                                    </div>

                                    <div className="mt-4 rounded-2xl border border-[var(--color-gold)]/10 bg-gradient-to-br from-[var(--color-gold-bg)] to-transparent p-4">
                                        <div className="mb-2 flex items-center gap-3">
                                            <ShieldCheck className="h-4 w-4 text-[var(--color-gold)]" />
                                            <span className="text-[12px] font-bold text-[var(--color-gold)]">
                                                {t('cards.security_status')}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-[var(--color-text-muted)]">
                                            {t('cards.security_desc')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Transactions Mini List */}
                            <div className="space-y-6 lg:col-span-8">
                                <div className="flex items-center justify-between px-1">
                                    <h3 className="text-[12px] font-bold tracking-[0.2em] text-[var(--color-text-muted)] uppercase">
                                        {t('cards.recent_activity')}
                                    </h3>
                                    <button className="flex items-center gap-1 text-[12px] font-bold text-[var(--color-gold)] hover:underline">
                                        {t('cards.view_all')}{' '}
                                        <ChevronRight className="h-3 w-3" />
                                    </button>
                                </div>
                                <div className="overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-bg-card)]">
                                    <div className="divide-y divide-[var(--color-border)]">
                                        {recentTransactions.map((tx, i) => (
                                            <div
                                                key={tx.id}
                                                className="group flex items-center justify-between p-5 transition-colors hover:bg-white/5"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className="flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white shadow-lg"
                                                        style={{
                                                            background:
                                                                tx.logo_color ||
                                                                'var(--color-gold)',
                                                        }}
                                                    >
                                                        {tx.merchant.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-[14px] font-bold text-[var(--color-text-main)]">
                                                            {tx.merchant}
                                                        </div>
                                                        <div className="text-[12px] text-[var(--color-text-muted)]">
                                                            {tx.category} •{' '}
                                                            {new Date(
                                                                tx.transacted_at,
                                                            ).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className={`text-[15px] font-bold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-[var(--color-text-main)]'}`}
                                                >
                                                    {tx.type === 'credit'
                                                        ? '+'
                                                        : '-'}
                                                    {format(tx.amount)}
                                                </div>
                                            </div>
                                        ))}
                                        {recentTransactions.length === 0 && (
                                            <div className="p-10 text-center text-[14px] text-[var(--color-text-muted)]">
                                                {t('cards.no_recent')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
