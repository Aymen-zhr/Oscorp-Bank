import { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Smartphone } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';

export default function TwoFactorChallenge({ status, recovery }) {
    const [focusedField, setFocusedField] = useState(null);
    const [method, setMethod] = useState('code');

    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
        recovery_code: '',
    });

    useEffect(() => {
        return () => {
            reset('code', 'recovery_code');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('two-factor.login'));
    };

    const inputClasses = (field) => `peer w-full bg-[var(--color-bg-base)] border rounded-xl px-12 pt-7 pb-3 text-[15px] font-medium text-[var(--color-text-main)] outline-none transition-all duration-300 placeholder-transparent ${
        errors[field]
            ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.1)]'
            : 'border-[var(--color-border)] focus:border-[var(--color-gold)] focus:shadow-[0_0_0_1px_rgba(212,175,55,0.2)] hover:border-[var(--color-border-hover)]'
    }`;

    const labelClasses = (field) => `absolute left-12 text-[var(--color-text-muted)] transition-all duration-300 pointer-events-none 
        peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[14px] 
        peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[9px] peer-focus:uppercase peer-focus:tracking-[1px] peer-focus:font-bold peer-focus:text-[var(--color-gold)]
        ${data[field] ? 'top-2.5 translate-y-0 text-[9px] uppercase tracking-[1px] font-bold' : ''}
    `;

    return (
        <>
            <Head title="OSCORP | Two-Factor Verification" />

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 text-center"
            >
                <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--color-gold)]/10 flex items-center justify-center">
                        <Shield className="w-7 h-7 text-[var(--color-gold)]" />
                    </div>
                </div>
                <p className="text-[13px] text-[var(--color-text-muted)] font-medium">
                    {recovery
                        ? 'Enter one of your emergency recovery codes to access your account.'
                        : 'Enter the 6-digit code from your authenticator app.'}
                </p>
            </motion.div>

            {status && (
                <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                    className="font-medium text-[13px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20 text-center"
                >
                    {status}
                </motion.div>
            )}

            <form onSubmit={submit} className="flex flex-col gap-5">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
                >
                    {!recovery ? (
                        <div className="relative group">
                            <motion.div
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                                animate={{ color: focusedField === 'code' || data.code ? 'var(--color-gold)' : 'var(--color-text-muted)' }}
                                transition={{ duration: 0.2 }}
                            >
                                <Smartphone className="w-5 h-5" />
                            </motion.div>

                            <input
                                id="code"
                                type="text"
                                name="code"
                                value={data.code}
                                className={inputClasses('code')}
                                placeholder="6-digit code"
                                autoComplete="one-time-code"
                                autoFocus
                                maxLength={6}
                                onFocus={() => setFocusedField('code')}
                                onBlur={() => setFocusedField(null)}
                                onChange={(e) => setData('code', e.target.value.replace(/\D/g, ''))}
                            />
                            <label htmlFor="code" className={labelClasses('code')}>
                                Verification Code
                            </label>
                        </div>
                    ) : (
                        <div className="relative group">
                            <motion.div
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                                animate={{ color: focusedField === 'recovery_code' || data.recovery_code ? 'var(--color-gold)' : 'var(--color-text-muted)' }}
                                transition={{ duration: 0.2 }}
                            >
                                <Shield className="w-5 h-5" />
                            </motion.div>

                            <input
                                id="recovery_code"
                                type="text"
                                name="recovery_code"
                                value={data.recovery_code}
                                className={inputClasses('recovery_code')}
                                placeholder="Recovery code"
                                autoComplete="one-time-code"
                                autoFocus
                                onFocus={() => setFocusedField('recovery_code')}
                                onBlur={() => setFocusedField(null)}
                                onChange={(e) => setData('recovery_code', e.target.value)}
                            />
                            <label htmlFor="recovery_code" className={labelClasses('recovery_code')}>
                                Recovery Code
                            </label>
                        </div>
                    )}

                    {errors.code && (
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-2 pl-2 text-[12px] text-red-500 font-medium">
                            {errors.code}
                        </motion.p>
                    )}
                    {errors.recovery_code && (
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-2 pl-2 text-[12px] text-red-500 font-medium">
                            {errors.recovery_code}
                        </motion.p>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
                >
                    <motion.button
                        type="submit"
                        disabled={processing}
                        whileHover={{ scale: processing ? 1 : 1.01 }}
                        whileTap={{ scale: processing ? 1 : 0.98 }}
                        className="mt-6 w-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] hover:brightness-110 text-black font-bold text-[15px] py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.5)] flex items-center justify-center gap-2 group disabled:opacity-50 relative overflow-hidden"
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
                            animate={{ x: ['0%', '200%'] }}
                            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
                        />
                        {processing ? 'Verifying...' : 'Verify Identity'}
                        {!processing && (
                            <ArrowRight className="w-4 h-4" />
                        )}
                    </motion.button>

                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={() => setMethod(method === 'code' ? 'recovery' : 'code')}
                            className="text-[11px] text-[var(--color-gold)] hover:text-[var(--color-gold-dark)] transition-colors font-bold tracking-wide uppercase"
                        >
                            {recovery
                                ? 'Use authentication code instead'
                                : 'Use a recovery code'}
                        </button>
                    </div>
                </motion.div>
            </form>
        </>
    );
}

TwoFactorChallenge.layout = page => (
    <AuthLayout 
        children={page} 
        activeTab="two-factor" 
        title="Two-Factor Verification" 
        subtitle="Complete the security check" 
    />
);
