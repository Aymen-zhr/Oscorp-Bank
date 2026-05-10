import { Head, router, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import {
    Send,
    ArrowRightLeft,
    Users,
    Clock,
    CheckCircle2,
    X,
    Wallet,
    Plus,
    Search,
    ArrowUpRight,
    ArrowDownLeft,
} from 'lucide-react';

import { QUICK_AMOUNTS, ROUTES } from '@/constants';

export default function Transfer({
    balance,
    recentTransfers = [],
    beneficiaries = [],
}) {
    const [step, setStep] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const { t, locale } = useTranslation();
    const { format, code } = useCurrency();

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        recipient: '',
        recipient_account: '',
        bank: '',
        note: '',
    });

    const filteredBeneficiaries = useMemo(
        () =>
            beneficiaries.filter((b) =>
                b.merchant.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        [beneficiaries, searchQuery],
    );

    const handleBeneficiarySelect = (name) => {
        setData('recipient', name);
        setStep(2);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(ROUTES.transfer, {
            onSuccess: () => {
                reset();
                setStep(1);
            },
        });
    };

    // Using useCurrency hook instead

    const fmtDate = (date) => {
        return new Date(date).toLocaleDateString(locale || 'en-MA', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[var(--color-bg-base)] font-sans text-[var(--color-text-main)] antialiased">
            <Head title="OSCORP | Transfer" />
            <Sidebar active="transfer" />

            <div className="flex flex-1 flex-col overflow-hidden">
                <Topbar />

                <div className="flex-1 overflow-y-auto px-6 py-8">
                    <div className="mx-auto max-w-4xl space-y-6">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between"
                        >
                            <div>
                                <h1 className="flex items-center gap-3 text-[28px] font-bold">
                                    <ArrowRightLeft className="h-7 w-7 text-[var(--color-gold)]" />
                                    {t('transfer.title')}
                                </h1>
                                <p
                                    className="mt-1 text-[14px]"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    {t('transfer.subtitle')}
                                </p>
                            </div>
                            <div
                                className="rounded-2xl px-5 py-3"
                                style={{
                                    background: 'var(--color-bg-card)',
                                    border: '1px solid var(--color-border)',
                                }}
                            >
                                <div
                                    className="text-[11px] font-semibold tracking-wider uppercase"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    {t('transfer.available_balance')}
                                </div>
                                <div className="text-[22px] font-bold text-[var(--color-gold)]">
                                    {format(balance)} {code}
                                </div>
                            </div>
                        </motion.div>

                        {/* Step Indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-3"
                        >
                            <div
                                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-bold ${step >= 1 ? 'text-[var(--color-gold-fg)]' : 'text-[var(--color-text-muted)]'}`}
                                style={
                                    step >= 1
                                        ? { background: 'var(--color-gold)' }
                                        : {
                                              background:
                                                  'var(--color-bg-elevated)',
                                              border: '1px solid var(--color-border)',
                                          }
                                }
                            >
                                <Users className="h-4 w-4" />{' '}
                                {t('transfer.select_recipient')}
                            </div>
                            <div
                                className="h-px flex-1"
                                style={{ background: 'var(--color-border)' }}
                            />
                            <div
                                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-bold ${step >= 2 ? 'text-[var(--color-gold-fg)]' : 'text-[var(--color-text-muted)]'}`}
                                style={
                                    step >= 2
                                        ? { background: 'var(--color-gold)' }
                                        : {
                                              background:
                                                  'var(--color-bg-elevated)',
                                              border: '1px solid var(--color-border)',
                                          }
                                }
                            >
                                <Send className="h-4 w-4" />{' '}
                                {t('transfer.enter_amount')}
                            </div>
                        </motion.div>

                        {/* Step 1: Select Recipient */}
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    {/* Beneficiaries */}
                                    <div
                                        className="rounded-2xl p-6"
                                        style={{
                                            background: 'var(--color-bg-card)',
                                            border: '1px solid var(--color-border)',
                                        }}
                                    >
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="text-[16px] font-bold">
                                                {t(
                                                    'transfer.saved_beneficiaries',
                                                )}
                                            </h3>
                                            <div
                                                className="flex w-60 items-center gap-2 rounded-xl px-3 py-2"
                                                style={{
                                                    background:
                                                        'var(--color-bg-elevated)',
                                                    border: '1px solid var(--color-border)',
                                                }}
                                            >
                                                <Search
                                                    className="h-3.5 w-3.5"
                                                    style={{
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) =>
                                                        setSearchQuery(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder={t(
                                                        'transfer.search_placeholder',
                                                    )}
                                                    className="w-full bg-transparent text-[12px] outline-none"
                                                    style={{
                                                        color: 'var(--color-text-main)',
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                            {filteredBeneficiaries.map(
                                                (b, i) => (
                                                    <motion.button
                                                        key={b.merchant}
                                                        whileHover={{
                                                            scale: 1.03,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.97,
                                                        }}
                                                        onClick={() =>
                                                            handleBeneficiarySelect(
                                                                b.merchant,
                                                            )
                                                        }
                                                        className="rounded-xl p-4 text-center transition-all hover:shadow-lg"
                                                        style={{
                                                            background:
                                                                'var(--color-bg-elevated)',
                                                            border: '1px solid var(--color-border)',
                                                        }}
                                                    >
                                                        <div
                                                            className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl"
                                                            style={{
                                                                background: `${b.color}20`,
                                                            }}
                                                        >
                                                            <span
                                                                className="text-[20px] font-bold"
                                                                style={{
                                                                    color: b.color,
                                                                }}
                                                            >
                                                                {b.merchant.charAt(
                                                                    0,
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div
                                                            className="truncate text-[12px] font-semibold"
                                                            style={{
                                                                color: 'var(--color-text-main)',
                                                            }}
                                                        >
                                                            {b.merchant}
                                                        </div>
                                                        <div
                                                            className="text-[10px]"
                                                            style={{
                                                                color: 'var(--color-text-muted)',
                                                            }}
                                                        >
                                                            {t(
                                                                'transfer.transfers_count',
                                                                {
                                                                    count: b.count,
                                                                },
                                                            )}
                                                        </div>
                                                    </motion.button>
                                                ),
                                            )}

                                            <motion.button
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => {
                                                    setData('recipient', '');
                                                    setStep(2);
                                                }}
                                                className="rounded-xl border-2 border-dashed p-4 text-center transition-all"
                                                style={{
                                                    background: 'transparent',
                                                    borderColor:
                                                        'var(--color-border)',
                                                }}
                                            >
                                                <div
                                                    className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl"
                                                    style={{
                                                        background:
                                                            'var(--color-bg-base)',
                                                    }}
                                                >
                                                    <Plus
                                                        className="h-6 w-6"
                                                        style={{
                                                            color: 'var(--color-text-muted)',
                                                        }}
                                                    />
                                                </div>
                                                <div
                                                    className="text-[12px] font-semibold"
                                                    style={{
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    {t(
                                                        'transfer.new_recipient',
                                                    )}
                                                </div>
                                            </motion.button>
                                        </div>
                                    </div>

                                    {/* Recent Transfers */}
                                    {recentTransfers.length > 0 && (
                                        <div
                                            className="rounded-2xl p-6"
                                            style={{
                                                background:
                                                    'var(--color-bg-card)',
                                                border: '1px solid var(--color-border)',
                                            }}
                                        >
                                            <h3 className="mb-4 text-[16px] font-bold">
                                                {t('transfer.recent_transfers')}
                                            </h3>
                                            <div className="space-y-2">
                                                {recentTransfers
                                                    .slice(0, 5)
                                                    .map((tx) => (
                                                        <motion.div
                                                            key={tx.id}
                                                            whileHover={{
                                                                background:
                                                                    'var(--color-bg-elevated)',
                                                            }}
                                                            className="flex items-center justify-between rounded-xl p-3 transition-colors"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                                                                    style={{
                                                                        background: `${tx.logo_color}20`,
                                                                    }}
                                                                >
                                                                    <ArrowUpRight
                                                                        className="h-4 w-4"
                                                                        style={{
                                                                            color: tx.logo_color,
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <div
                                                                        className="text-[14px] font-semibold"
                                                                        style={{
                                                                            color: 'var(--color-text-main)',
                                                                        }}
                                                                    >
                                                                        {
                                                                            tx.merchant
                                                                        }
                                                                    </div>
                                                                    <div
                                                                        className="text-[11px]"
                                                                        style={{
                                                                            color: 'var(--color-text-muted)',
                                                                        }}
                                                                    >
                                                                        {fmtDate(
                                                                            tx.transacted_at,
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-[14px] font-bold text-red-400">
                                                                -
                                                                {format(
                                                                    tx.amount,
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Step 2: Enter Amount */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <form onSubmit={handleSubmit}>
                                        <div
                                            className="rounded-2xl p-8"
                                            style={{
                                                background:
                                                    'var(--color-bg-card)',
                                                border: '1px solid var(--color-border)',
                                            }}
                                        >
                                            <div className="mb-8 flex items-center justify-between">
                                                <h3 className="text-[18px] font-bold">
                                                    {t(
                                                        'transfer.transfer_details',
                                                    )}
                                                </h3>
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(1)}
                                                    className="rounded-lg p-2 transition-colors hover:bg-white/5"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </div>

                                            {/* Recipient */}
                                            <div className="mb-6">
                                                <label
                                                    className="mb-2 block text-[11px] font-semibold tracking-wider uppercase"
                                                    style={{
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    {t('transfer.recipient')}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.recipient}
                                                    onChange={(e) =>
                                                        setData(
                                                            'recipient',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder={t(
                                                        'transfer.recipient_placeholder',
                                                    )}
                                                    className="w-full rounded-xl px-4 py-3 text-base transition-all outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50"
                                                    style={{
                                                        background:
                                                            'var(--color-bg-elevated)',
                                                        border: '1px solid var(--color-border)',
                                                        color: 'var(--color-text-main)',
                                                    }}
                                                    required
                                                />
                                                {errors.recipient && (
                                                    <p className="mt-1 text-[12px] text-red-400">
                                                        {errors.recipient}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Account (optional) */}
                                            <div className="mb-6 grid grid-cols-2 gap-4">
                                                <div>
                                                    <label
                                                        className="mb-2 block text-[11px] font-semibold tracking-wider uppercase"
                                                        style={{
                                                            color: 'var(--color-text-muted)',
                                                        }}
                                                    >
                                                        {t(
                                                            'transfer.account_number',
                                                        )}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            data.recipient_account
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'recipient_account',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder={t(
                                                            'transfer.account_placeholder',
                                                        )}
                                                        className="w-full rounded-xl px-4 py-3 text-base transition-all outline-none"
                                                        style={{
                                                            background:
                                                                'var(--color-bg-elevated)',
                                                            border: '1px solid var(--color-border)',
                                                            color: 'var(--color-text-main)',
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label
                                                        className="mb-2 block text-[11px] font-semibold tracking-wider uppercase"
                                                        style={{
                                                            color: 'var(--color-text-muted)',
                                                        }}
                                                    >
                                                        {t('transfer.bank')}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={data.bank}
                                                        onChange={(e) =>
                                                            setData(
                                                                'bank',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder={t(
                                                            'transfer.bank_placeholder',
                                                        )}
                                                        className="w-full rounded-xl px-4 py-3 text-base transition-all outline-none"
                                                        style={{
                                                            background:
                                                                'var(--color-bg-elevated)',
                                                            border: '1px solid var(--color-border)',
                                                            color: 'var(--color-text-main)',
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Amount */}
                                            <div className="mb-6">
                                                <label
                                                    className="mb-2 block text-[11px] font-semibold tracking-wider uppercase"
                                                    style={{
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    {t('transfer.amount')}
                                                </label>
                                                <div className="relative">
                                                    <Wallet
                                                        className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2"
                                                        style={{
                                                            color: 'var(--color-text-muted)',
                                                        }}
                                                    />
                                                    <input
                                                        type="number"
                                                        value={data.amount}
                                                        onChange={(e) =>
                                                            setData(
                                                                'amount',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder={t(
                                                            'transfer.amount_placeholder',
                                                        )}
                                                        min="1"
                                                        step="0.01"
                                                        className="w-full rounded-xl py-3 pr-4 pl-12 text-2xl font-bold transition-all outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50"
                                                        style={{
                                                            background:
                                                                'var(--color-bg-elevated)',
                                                            border: '1px solid var(--color-border)',
                                                            color: 'var(--color-gold)',
                                                        }}
                                                        required
                                                    />
                                                </div>
                                                {errors.amount && (
                                                    <p className="mt-1 text-[12px] text-red-400">
                                                        {errors.amount}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Quick Amounts */}
                                            <div className="mb-6">
                                                <div
                                                    className="mb-2 text-[11px] font-semibold tracking-wider uppercase"
                                                    style={{
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    {t(
                                                        'transfer.quick_amounts',
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {QUICK_AMOUNTS.map(
                                                        (amount) => (
                                                            <button
                                                                key={amount}
                                                                type="button"
                                                                onClick={() =>
                                                                    setData(
                                                                        'amount',
                                                                        amount,
                                                                    )
                                                                }
                                                                className="rounded-xl px-4 py-2 text-[13px] font-semibold transition-all"
                                                                style={{
                                                                    background:
                                                                        data.amount ===
                                                                        String(
                                                                            amount,
                                                                        )
                                                                            ? 'var(--color-gold)'
                                                                            : 'var(--color-bg-elevated)',
                                                                    color:
                                                                        data.amount ===
                                                                        String(
                                                                            amount,
                                                                        )
                                                                            ? '#000'
                                                                            : 'var(--color-text-muted)',
                                                                    border: `1px solid ${data.amount === String(amount) ? 'var(--color-gold)' : 'var(--color-border)'}`,
                                                                }}
                                                            >
                                                                {format(amount)}{' '}
                                                                {code}
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                            </div>

                                            {/* Note */}
                                            <div className="mb-8">
                                                <label
                                                    className="mb-2 block text-[11px] font-semibold tracking-wider uppercase"
                                                    style={{
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    {t('transfer.note')}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.note}
                                                    onChange={(e) =>
                                                        setData(
                                                            'note',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder={t(
                                                        'transfer.note_placeholder',
                                                    )}
                                                    className="w-full rounded-xl px-4 py-3 text-base transition-all outline-none"
                                                    style={{
                                                        background:
                                                            'var(--color-bg-elevated)',
                                                        border: '1px solid var(--color-border)',
                                                        color: 'var(--color-text-main)',
                                                    }}
                                                />
                                            </div>

                                            {/* Summary */}
                                            {data.amount && data.recipient && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        y: 10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    className="mb-8 rounded-xl p-4"
                                                    style={{
                                                        background:
                                                            'var(--color-gold-bg)',
                                                        border: '1px solid var(--color-gold)/30',
                                                    }}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div
                                                                className="text-[12px] font-semibold"
                                                                style={{
                                                                    color: 'var(--color-text-muted)',
                                                                }}
                                                            >
                                                                {t(
                                                                    'transfer.sending',
                                                                )}
                                                            </div>
                                                            <div className="text-[24px] font-bold text-[var(--color-gold)]">
                                                                {format(
                                                                    data.amount,
                                                                )}{' '}
                                                                {code}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div
                                                                className="text-[12px] font-semibold"
                                                                style={{
                                                                    color: 'var(--color-text-muted)',
                                                                }}
                                                            >
                                                                {t(
                                                                    'transfer.to',
                                                                )}
                                                            </div>
                                                            <div
                                                                className="text-[16px] font-bold"
                                                                style={{
                                                                    color: 'var(--color-text-main)',
                                                                }}
                                                            >
                                                                {data.recipient}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(1)}
                                                    className="flex-1 rounded-xl py-3.5 font-semibold transition-all"
                                                    style={{
                                                        background:
                                                            'var(--color-bg-elevated)',
                                                        border: '1px solid var(--color-border)',
                                                    }}
                                                >
                                                    {t('common.back')}
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={
                                                        processing ||
                                                        !data.amount ||
                                                        !data.recipient
                                                    }
                                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                                                    style={{
                                                        background:
                                                            'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                                                        color: '#000',
                                                    }}
                                                >
                                                    <Send className="h-4 w-4" />
                                                    {processing
                                                        ? t('common.processing')
                                                        : t(
                                                              'transfer.send_money',
                                                          )}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
