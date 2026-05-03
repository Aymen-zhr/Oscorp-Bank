import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Mail, AtSign, Phone, Calendar, ShieldCheck, 
    CreditCard, ArrowRight, Copy, Check, LogOut,
    Sparkles, Key, Bell, Fingerprint, Globe, ChevronDown, CheckCircle2
} from 'lucide-react';

export default function Account({ user, security, financial, currency: currentCurrency, currencies }) {
    const [copied, setCopied] = useState(false);
    const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
    const { t, locale } = useTranslation();
    const { format, code, info: currencyInfo } = useCurrency();

    const copyTag = () => {
        navigator.clipboard.writeText(user.tag);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const changeCurrency = (newCode) => {
        router.post('/account/currency', { currency: newCode }, {
            preserveScroll: true,
            onSuccess: () => setShowCurrencyPicker(false),
        });
    };

    return (
        <div className="flex h-screen w-full overflow-hidden font-sans antialiased" style={{ background: 'var(--color-bg-base)' }}>
            <Head title="Account Details" />
            <Sidebar active="account" />
            
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <Topbar balance={financial.balance} />
                
                <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
                    <div className="max-w-5xl mx-auto space-y-8 pb-12">
                        
                        {/* Hero Header */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-[32px] font-bold shadow-2xl transition-all group-hover:scale-105"
                                        style={{ background: 'var(--color-gold-bg)', color: 'var(--color-gold)', border: '2px solid var(--color-gold)' }}>
                                        {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover rounded-3xl" /> : user.name.charAt(0)}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-lg">
                                        <Sparkles className="w-4 h-4 text-[var(--color-gold)]" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-[32px] font-bold tracking-tight" style={{ color: 'var(--color-text-main)' }}>{user.name}</h1>
                                    <div className="flex items-center gap-3 mt-1">
                                        <button onClick={copyTag} className="flex items-center gap-2 px-3 py-1 rounded-full text-[13px] font-bold transition-all hover:bg-white/5 active:scale-95"
                                            style={{ background: 'var(--color-gold-bg)', color: 'var(--color-gold)', border: '1px solid var(--color-gold-border)' }}>
                                            <AtSign className="w-3.5 h-3.5" />
                                            {user.tag}
                                            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3 opacity-50" />}
                                        </button>
                                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            <ShieldCheck className="w-3 h-3" /> {t('account.verified_status')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden md:block">
                                    <div className="text-[11px] font-bold uppercase tracking-widest opacity-40">{t('account.client_since')}</div>
                                    <div className="text-[15px] font-bold" style={{ color: 'var(--color-text-main)' }}>{user.created_at}</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* Personal Intel */}
                            <div className="lg:col-span-2 space-y-6">
                                <section className="p-8 rounded-[32px] space-y-6" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[18px] font-bold" style={{ color: 'var(--color-text-main)' }}>{t('account.credentials')}</h3>
                                        <button className="text-[13px] font-bold transition-all hover:text-[var(--color-gold)]" style={{ color: 'var(--color-text-muted)' }}>{t('account.edit_profile')}</button>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {[
{ label: t('account.primary_email'), value: user.email, Icon: Mail },
{ label: t('account.mobile_identity'), value: user.phone, Icon: Phone },
{ label: t('account.digital_handle'), value: user.tag, Icon: AtSign },
{ label: t('account.last_auth'), value: user.last_login, Icon: Fingerprint },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl transition-all" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
                                                <div className="p-3 rounded-xl" style={{ background: 'var(--color-bg-base)', border: '1px solid var(--color-border)' }}>
                                                    <item.Icon className="w-4 h-4" style={{ color: 'var(--color-gold)' }} />
                                                </div>
                                                <div>
                                                    <div className="text-[11px] font-bold uppercase tracking-wider opacity-40 mb-1">{item.label}</div>
                                                    <div className="text-[14px] font-semibold tracking-tight" style={{ color: 'var(--color-text-main)' }}>{item.value}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Security & Verification */}
                                <section className="p-8 rounded-[32px] space-y-6" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                    <h3 className="text-[18px] font-bold" style={{ color: 'var(--color-text-main)' }}>{t('account.security_protocols')}</h3>
                                    
                                    <div className="space-y-4">
                                        {[
{ title: t('account.two_factor'), desc: t('account.two_factor_desc'), enabled: security.two_factor_enabled, Icon: Key },
{ title: t('account.email_verification'), desc: t('account.email_verification_desc'), enabled: security.email_verified, Icon: ShieldCheck },
{ title: t('account.activity_notifications'), desc: t('account.activity_notifications_desc'), enabled: true, Icon: Bell },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl transition-all group" style={{ border: '1px solid var(--color-border)' }}>
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 rounded-xl transition-all group-hover:bg-[var(--color-gold-bg)] group-hover:text-[var(--color-gold)]" style={{ background: 'var(--color-bg-base)', border: '1px solid var(--color-border)' }}>
                                                        <item.Icon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="text-[14px] font-bold tracking-tight" style={{ color: 'var(--color-text-main)' }}>{item.title}</div>
                                                        <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{item.desc}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${item.enabled ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                    <span className="text-[11px] font-bold uppercase tracking-widest">{item.enabled ? t('account.active') : t('account.inactive')}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* Stats Sidebar */}
                            <div className="space-y-8">
                                <section className="p-8 rounded-[32px] space-y-8 relative overflow-hidden" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                    <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-20" style={{ background: 'var(--color-gold)' }} />
                                    
                                    <h3 className="text-[18px] font-bold relative z-10" style={{ color: 'var(--color-text-main)' }}>{t('account.financial_snapshot')}</h3>
                                    
                                    <div className="space-y-6 relative z-10">
                                        <div>
                                            <div className="text-[11px] font-bold uppercase tracking-widest opacity-40 mb-1">{t('account.live_liquidity')}</div>
                                             <div className="text-[32px] font-bold tracking-tight" style={{ color: 'var(--color-gold)' }}>{format(financial.balance)}</div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-2xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
                                                <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">{t('account.total_spent')}</div>
                                                 <div className="text-[15px] font-bold" style={{ color: 'var(--color-text-main)' }}>{format(financial.total_spending)}</div>
                                            </div>
                                            <div className="p-4 rounded-2xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
                                                <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">{t('account.total_inflow')}</div>
                                                 <div className="text-[15px] font-bold" style={{ color: 'var(--color-text-main)' }}>{format(financial.total_received)}</div>
                                            </div>
                                        </div>
                                    </div>
 
                                    <button className="w-full py-4 rounded-2xl text-[14px] font-bold transition-all flex items-center justify-center gap-2 hover:opacity-80"
                                        style={{ background: 'var(--color-gold)', color: '#000' }}>
                                        {t('account.view_ledger')} <ArrowRight className="w-4 h-4" />
                                    </button>
                                </section>
 
                                <section className="p-8 rounded-[32px] space-y-6" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                    <h3 className="text-[18px] font-bold" style={{ color: 'var(--color-text-main)' }}>{t('account.preferences')}</h3>
                                    <div className="space-y-3">
                                        <div className="w-full flex items-center justify-between p-4 rounded-2xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
                                            <div className="flex items-center gap-3">
                                                <Globe className="w-4 h-4 opacity-50" />
                                                <span className="text-[13px] font-semibold" style={{ color: 'var(--color-text-main)' }}>{t('account.language')}</span>
                                            </div>
                                            <span className="text-[12px] font-bold" style={{ color: 'var(--color-gold)' }}>English (MA)</span>
                                        </div>
                                        
                                        <div className="relative">
                                            <button 
                                                onClick={() => setShowCurrencyPicker(!showCurrencyPicker)}
                                                className="w-full flex items-center justify-between p-4 rounded-2xl transition-all hover:bg-[var(--color-gold-bg)]" 
                                                style={{ background: 'var(--color-bg-elevated)', border: `1px solid ${showCurrencyPicker ? 'var(--color-gold-border)' : 'var(--color-border)'}` }}>
                                                <div className="flex items-center gap-3">
                                                    <CreditCard className="w-4 h-4 opacity-50" />
                                                    <span className="text-[13px] font-semibold" style={{ color: 'var(--color-text-main)' }}>{t('account.base_currency')}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[12px] font-bold" style={{ color: 'var(--color-gold)' }}>{currencyInfo.symbol_native} {code}</span>
                                                    <ChevronDown className={`w-4 h-4 transition-transform ${showCurrencyPicker ? 'rotate-180' : ''}`} style={{ color: 'var(--color-text-muted)' }} />
                                                </div>
                                            </button>

                                            <AnimatePresence>
                                                {showCurrencyPicker && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                                        transition={{ duration: 0.15 }}
                                                        className="absolute z-50 w-full mt-2 p-2 rounded-2xl shadow-2xl" 
                                                        style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', backdropFilter: 'blur(20px)' }}>
                                                        {Object.entries(currencies).map(([curCode, curInfo]) => (
                                                            <button
                                                                key={curCode}
                                                                onClick={() => changeCurrency(curCode)}
                                                                className="w-full flex items-center justify-between p-3 rounded-xl transition-all hover:bg-white/5"
                                                                style={curCode === code ? { background: 'var(--color-gold-bg)' } : {}}>
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-[16px] font-bold" style={{ color: 'var(--color-text-main)' }}>{curInfo.symbol_native}</span>
                                                                    <div className="text-left">
                                                                        <div className="text-[13px] font-semibold" style={{ color: 'var(--color-text-main)' }}>{curCode}</div>
                                                                        <div className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{curInfo.name}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[10px] font-mono" style={{ color: 'var(--color-text-muted)' }}>1 MAD = {curInfo.rate.toFixed(curInfo.decimal_digits)} {curCode}</span>
                                                                    {curCode === code && <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--color-gold)' }} />}
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                    
                                    <button className="w-full py-4 rounded-2xl text-[14px] font-bold transition-all flex items-center justify-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20">
                                        <LogOut className="w-4 h-4" /> {t('account.logout')}
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
