import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Mail,
    AtSign,
    Phone,
    Calendar,
    ShieldCheck,
    CreditCard,
    ArrowRight,
    Copy,
    Check,
    LogOut,
    Sparkles,
    Key,
    Bell,
    Fingerprint,
    Globe,
    ChevronDown,
    CheckCircle2,
    IdCard,
    Map,
    Flag,
    Users,
    Briefcase,
    MapPin,
} from 'lucide-react';
import UserAvatar from '@/components/dashboard/UserAvatar';
import { TIMEOUTS, ROUTES } from '@/constants';

export default function Account({
    user,
    security,
    financial,
    currency: currentCurrency,
    currencies,
}) {
    const [copied, setCopied] = useState(false);
    const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
    const { t, locale } = useTranslation();
    const { format, code, info: currencyInfo } = useCurrency();

    const copyTag = () => {
        navigator.clipboard.writeText(user.tag);
        setCopied(true);
        setTimeout(() => setCopied(false), TIMEOUTS.copyFeedback);
    };

    const changeCurrency = (newCode) => {
        router.post(
            ROUTES.account + '/currency',
            { currency: newCode },
            {
                preserveScroll: true,
                onSuccess: () => setShowCurrencyPicker(false),
            },
        );
    };

    return (
        <div
            className="flex h-screen w-full overflow-hidden font-sans antialiased"
            style={{ background: 'var(--color-bg-base)' }}
        >
            <Head title="Account Details" />
            <Sidebar active="account" />

            <div className="relative flex flex-1 flex-col overflow-hidden">
                <Topbar balance={financial.balance} />

                <main className="custom-scrollbar flex-1 overflow-y-auto p-8 pb-32 md:pb-8">
                    <div className="mx-auto max-w-5xl space-y-8">
                        {/* Hero Header */}
                        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                            <div className="flex items-center gap-6">
                                <div className="group relative">
                                    <motion.div whileHover={{ scale: 1.05 }}>
                                        <UserAvatar
                                            user={user}
                                            size="w-24 h-24"
                                            className="rounded-[32px]"
                                            isDark={true} // Dashboard is usually dark
                                        />
                                    </motion.div>
                                    <div className="absolute -right-2 -bottom-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-2 shadow-lg">
                                        <Sparkles className="h-4 w-4 text-[var(--color-gold)]" />
                                    </div>
                                </div>
                                <div>
                                    <h1
                                        className="text-[32px] font-bold tracking-tight"
                                        style={{
                                            color: 'var(--color-text-main)',
                                        }}
                                    >
                                        {user.name || 'Account Holder'}
                                    </h1>
                                    <div className="mt-1 flex items-center gap-3">
                                        <button
                                            onClick={copyTag}
                                            className="flex items-center gap-2 rounded-full px-3 py-1 text-[13px] font-bold transition-all hover:bg-white/5 active:scale-95"
                                            style={{
                                                background:
                                                    'var(--color-gold-bg)',
                                                color: 'var(--color-gold)',
                                                border: '1px solid var(--color-gold-border)',
                                            }}
                                        >
                                            <AtSign className="h-3.5 w-3.5" />
                                            {user.tag}
                                            {copied ? (
                                                <Check className="h-3 w-3" />
                                            ) : (
                                                <Copy className="h-3 w-3 opacity-50" />
                                            )}
                                        </button>
                                        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold tracking-wider text-emerald-400 uppercase">
                                            <ShieldCheck className="h-3 w-3" />{' '}
                                            {t('account.verified_status')}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="hidden text-right md:block">
                                    <div className="text-[11px] font-bold tracking-widest uppercase opacity-40">
                                        {t('account.client_since')}
                                    </div>
                                    <div
                                        className="text-[15px] font-bold"
                                        style={{
                                            color: 'var(--color-text-main)',
                                        }}
                                    >
                                        {user.created_at}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {/* Personal Intel */}
                            <div className="space-y-6 lg:col-span-2">
                                <section
                                    className="space-y-6 rounded-[32px] p-8"
                                    style={{
                                        background: 'var(--color-bg-card)',
                                        border: '1px solid var(--color-border)',
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <h3
                                            className="text-[18px] font-bold"
                                            style={{
                                                color: 'var(--color-text-main)',
                                            }}
                                        >
                                            {t('account.credentials')}
                                        </h3>
                                        <button
                                            onClick={() =>
                                                router.visit(ROUTES.settings)
                                            }
                                            className="text-[13px] font-bold transition-all hover:text-[var(--color-gold)]"
                                            style={{
                                                color: 'var(--color-text-muted)',
                                            }}
                                        >
                                            {t('account.edit_profile')}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                        {[
                                            {
                                                label: 'Primary Email',
                                                value: user.email,
                                                Icon: Mail,
                                            },
                                            {
                                                label: 'Mobile Identity',
                                                value: user.phone,
                                                Icon: Phone,
                                            },
                                            {
                                                label: 'Digital Handle',
                                                value: user.tag,
                                                Icon: AtSign,
                                            },
                                            {
                                                label: 'Professional Title',
                                                value: user.job_title,
                                                Icon: Briefcase,
                                            },
                                            {
                                                label: 'Residential Address',
                                                value: user.address,
                                                Icon: MapPin,
                                            },
                                            {
                                                label: 'National ID (CIN)',
                                                value: user.cin,
                                                Icon: IdCard,
                                            },
                                            {
                                                label: 'Date of Birth',
                                                value: user.date_of_birth,
                                                Icon: Calendar,
                                            },
                                            {
                                                label: 'Place of Birth',
                                                value: user.place_of_birth,
                                                Icon: Map,
                                            },
                                            {
                                                label: 'Nationality',
                                                value: user.nationality,
                                                Icon: Flag,
                                            },
                                            {
                                                label: 'Gender',
                                                value: user.gender,
                                                Icon: Users,
                                            },
                                        ].map((item, i) => (
                                            <div
                                                key={i}
                                                className="flex items-start gap-4 rounded-2xl p-4 transition-all"
                                                style={{
                                                    background:
                                                        'var(--color-bg-elevated)',
                                                    border: '1px solid var(--color-border)',
                                                }}
                                            >
                                                <div
                                                    className="rounded-xl p-3"
                                                    style={{
                                                        background:
                                                            'var(--color-bg-base)',
                                                        border: '1px solid var(--color-border)',
                                                    }}
                                                >
                                                    <item.Icon
                                                        className="h-4 w-4"
                                                        style={{
                                                            color: 'var(--color-gold)',
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="mb-1 text-[11px] font-bold tracking-wider uppercase opacity-40">
                                                        {item.label}
                                                    </div>
                                                    <div
                                                        className="text-[14px] font-semibold tracking-tight"
                                                        style={{
                                                            color: 'var(--color-text-main)',
                                                        }}
                                                    >
                                                        {item.value}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Security & Verification */}
                                <section
                                    className="space-y-6 rounded-[32px] p-8"
                                    style={{
                                        background: 'var(--color-bg-card)',
                                        border: '1px solid var(--color-border)',
                                    }}
                                >
                                    <h3
                                        className="text-[18px] font-bold"
                                        style={{
                                            color: 'var(--color-text-main)',
                                        }}
                                    >
                                        {t('account.security_protocols')}
                                    </h3>

                                    <div className="space-y-4">
                                        {[
                                            {
                                                title: t('account.two_factor'),
                                                desc: t(
                                                    'account.two_factor_desc',
                                                ),
                                                enabled:
                                                    security.two_factor_enabled,
                                                Icon: Key,
                                            },
                                            {
                                                title: t(
                                                    'account.email_verification',
                                                ),
                                                desc: t(
                                                    'account.email_verification_desc',
                                                ),
                                                enabled:
                                                    security.email_verified,
                                                Icon: ShieldCheck,
                                            },
                                            {
                                                title: t(
                                                    'account.activity_notifications',
                                                ),
                                                desc: t(
                                                    'account.activity_notifications_desc',
                                                ),
                                                enabled: true,
                                                Icon: Bell,
                                            },
                                        ].map((item, i) => (
                                            <div
                                                key={i}
                                                className="group flex items-center justify-between rounded-2xl p-4 transition-all"
                                                style={{
                                                    border: '1px solid var(--color-border)',
                                                }}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className="rounded-xl p-3 transition-all group-hover:bg-[var(--color-gold-bg)] group-hover:text-[var(--color-gold)]"
                                                        style={{
                                                            background:
                                                                'var(--color-bg-base)',
                                                            border: '1px solid var(--color-border)',
                                                        }}
                                                    >
                                                        <item.Icon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div
                                                            className="text-[14px] font-bold tracking-tight"
                                                            style={{
                                                                color: 'var(--color-text-main)',
                                                            }}
                                                        >
                                                            {item.title}
                                                        </div>
                                                        <div
                                                            className="text-[11px]"
                                                            style={{
                                                                color: 'var(--color-text-muted)',
                                                            }}
                                                        >
                                                            {item.desc}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={`h-2 w-2 rounded-full ${item.enabled ? 'bg-emerald-500' : 'bg-red-500'}`}
                                                    />
                                                    <span className="text-[11px] font-bold tracking-widest uppercase">
                                                        {item.enabled
                                                            ? t(
                                                                  'account.active',
                                                              )
                                                            : t(
                                                                  'account.inactive',
                                                              )}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* Stats Sidebar */}
                            <div className="space-y-8">
                                <section
                                    className="relative space-y-8 overflow-hidden rounded-[32px] p-8"
                                    style={{
                                        background: 'var(--color-bg-card)',
                                        border: '1px solid var(--color-border)',
                                    }}
                                >
                                    <div
                                        className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full opacity-20 blur-3xl"
                                        style={{
                                            background: 'var(--color-gold)',
                                        }}
                                    />

                                    <h3
                                        className="relative z-10 text-[18px] font-bold"
                                        style={{
                                            color: 'var(--color-text-main)',
                                        }}
                                    >
                                        {t('account.financial_snapshot')}
                                    </h3>

                                    <div className="relative z-10 space-y-6">
                                        <div>
                                            <div className="mb-1 text-[11px] font-bold tracking-widest uppercase opacity-40">
                                                {t('account.live_liquidity')}
                                            </div>
                                            <div
                                                className="text-[32px] font-bold tracking-tight"
                                                style={{
                                                    color: 'var(--color-gold)',
                                                }}
                                            >
                                                {format(financial.balance)}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div
                                                className="rounded-2xl p-4"
                                                style={{
                                                    background:
                                                        'var(--color-bg-elevated)',
                                                    border: '1px solid var(--color-border)',
                                                }}
                                            >
                                                <div className="mb-1 text-[10px] font-bold tracking-widest uppercase opacity-40">
                                                    {t('account.total_spent')}
                                                </div>
                                                <div
                                                    className="text-[15px] font-bold"
                                                    style={{
                                                        color: 'var(--color-text-main)',
                                                    }}
                                                >
                                                    {format(
                                                        financial.total_spending,
                                                    )}
                                                </div>
                                            </div>
                                            <div
                                                className="rounded-2xl p-4"
                                                style={{
                                                    background:
                                                        'var(--color-bg-elevated)',
                                                    border: '1px solid var(--color-border)',
                                                }}
                                            >
                                                <div className="mb-1 text-[10px] font-bold tracking-widest uppercase opacity-40">
                                                    {t('account.total_inflow')}
                                                </div>
                                                <div
                                                    className="text-[15px] font-bold"
                                                    style={{
                                                        color: 'var(--color-text-main)',
                                                    }}
                                                >
                                                    {format(
                                                        financial.total_received,
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[14px] font-bold transition-all hover:opacity-80"
                                        style={{
                                            background: 'var(--color-gold)',
                                            color: '#000',
                                        }}
                                    >
                                        {t('account.view_ledger')}{' '}
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </section>

                                <section
                                    className="space-y-6 rounded-[32px] p-8"
                                    style={{
                                        background: 'var(--color-bg-card)',
                                        border: '1px solid var(--color-border)',
                                    }}
                                >
                                    <h3
                                        className="text-[18px] font-bold"
                                        style={{
                                            color: 'var(--color-text-main)',
                                        }}
                                    >
                                        {t('account.preferences')}
                                    </h3>
                                    <div className="space-y-3">
                                        <div
                                            className="flex w-full items-center justify-between rounded-2xl p-4"
                                            style={{
                                                background:
                                                    'var(--color-bg-elevated)',
                                                border: '1px solid var(--color-border)',
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Globe className="h-4 w-4 opacity-50" />
                                                <span
                                                    className="text-[13px] font-semibold"
                                                    style={{
                                                        color: 'var(--color-text-main)',
                                                    }}
                                                >
                                                    {t('account.language')}
                                                </span>
                                            </div>
                                            <span
                                                className="text-[12px] font-bold"
                                                style={{
                                                    color: 'var(--color-gold)',
                                                }}
                                            >
                                                English (MA)
                                            </span>
                                        </div>

                                        <div className="relative">
                                            <button
                                                onClick={() =>
                                                    setShowCurrencyPicker(
                                                        !showCurrencyPicker,
                                                    )
                                                }
                                                className="flex w-full items-center justify-between rounded-2xl p-4 transition-all hover:bg-[var(--color-gold-bg)]"
                                                style={{
                                                    background:
                                                        'var(--color-bg-elevated)',
                                                    border: `1px solid ${showCurrencyPicker ? 'var(--color-gold-border)' : 'var(--color-border)'}`,
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <CreditCard className="h-4 w-4 opacity-50" />
                                                    <span
                                                        className="text-[13px] font-semibold"
                                                        style={{
                                                            color: 'var(--color-text-main)',
                                                        }}
                                                    >
                                                        {t(
                                                            'account.base_currency',
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="text-[12px] font-bold"
                                                        style={{
                                                            color: 'var(--color-gold)',
                                                        }}
                                                    >
                                                        {
                                                            currencyInfo.symbol_native
                                                        }{' '}
                                                        {code}
                                                    </span>
                                                    <ChevronDown
                                                        className={`h-4 w-4 transition-transform ${showCurrencyPicker ? 'scale-125' : ''}`}
                                                        style={{
                                                            color: 'var(--color-text-muted)',
                                                        }}
                                                    />
                                                </div>
                                            </button>

                                            <AnimatePresence>
                                                {showCurrencyPicker && (
                                                    <motion.div
                                                        initial={{
                                                            opacity: 0,
                                                            y: -8,
                                                            scale: 0.96,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                            scale: 1,
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            y: -8,
                                                            scale: 0.96,
                                                        }}
                                                        transition={{
                                                            duration: 0.15,
                                                        }}
                                                        className="absolute z-50 mt-2 w-full rounded-2xl p-2 shadow-2xl"
                                                        style={{
                                                            background:
                                                                'var(--color-bg-card)',
                                                            border: '1px solid var(--color-border)',
                                                            backdropFilter:
                                                                'blur(20px)',
                                                        }}
                                                    >
                                                        {Object.entries(
                                                            currencies,
                                                        ).map(
                                                            ([
                                                                curCode,
                                                                curInfo,
                                                            ]) => (
                                                                <button
                                                                    key={
                                                                        curCode
                                                                    }
                                                                    onClick={() =>
                                                                        changeCurrency(
                                                                            curCode,
                                                                        )
                                                                    }
                                                                    className="flex w-full items-center justify-between rounded-xl p-3 transition-all hover:bg-white/5"
                                                                    style={
                                                                        curCode ===
                                                                        code
                                                                            ? {
                                                                                  background:
                                                                                      'var(--color-gold-bg)',
                                                                              }
                                                                            : {}
                                                                    }
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <span
                                                                            className="text-[16px] font-bold"
                                                                            style={{
                                                                                color: 'var(--color-text-main)',
                                                                            }}
                                                                        >
                                                                            {
                                                                                curInfo.symbol_native
                                                                            }
                                                                        </span>
                                                                        <div className="text-left">
                                                                            <div
                                                                                className="text-[13px] font-semibold"
                                                                                style={{
                                                                                    color: 'var(--color-text-main)',
                                                                                }}
                                                                            >
                                                                                {
                                                                                    curCode
                                                                                }
                                                                            </div>
                                                                            <div
                                                                                className="text-[10px]"
                                                                                style={{
                                                                                    color: 'var(--color-text-muted)',
                                                                                }}
                                                                            >
                                                                                {
                                                                                    curInfo.name
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span
                                                                            className="font-mono text-[10px]"
                                                                            style={{
                                                                                color: 'var(--color-text-muted)',
                                                                            }}
                                                                        >
                                                                            {curCode ===
                                                                            'MAD'
                                                                                ? code
                                                                                : curCode}
                                                                            ={' '}
                                                                            {curInfo.rate.toFixed(
                                                                                curInfo.decimal_digits,
                                                                            )}{' '}
                                                                            {
                                                                                curCode
                                                                            }
                                                                        </span>
                                                                        {curCode ===
                                                                            code && (
                                                                            <CheckCircle2
                                                                                className="h-4 w-4"
                                                                                style={{
                                                                                    color: 'var(--color-gold)',
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </button>
                                                            ),
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/10 py-4 text-[14px] font-bold text-red-500 transition-all hover:bg-red-500/20">
                                        <LogOut className="h-4 w-4" />{' '}
                                        {t('account.logout')}
                                    </button>
                                </section>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
