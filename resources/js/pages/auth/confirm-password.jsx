import { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';

export default function ConfirmPassword({ status }) {
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'));
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
            <Head title="OSCORP | Confirm Authorization" />

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 text-center"
            >
                <p className="text-[13px] text-[var(--color-text-muted)] font-medium">
                    This is a secure area. Please confirm your password before proceeding.
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
                    <div className="relative group">
                        <motion.div
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                            animate={{ color: focusedField === 'password' || data.password ? 'var(--color-gold)' : 'var(--color-text-muted)' }}
                            transition={{ duration: 0.2 }}
                        >
                            <Lock className="w-5 h-5" />
                        </motion.div>

                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            className={inputClasses('password')}
                            placeholder="Passkey"
                            autoComplete="current-password"
                            autoFocus
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <label htmlFor="password" className={labelClasses('password')}>
                            Passkey
                        </label>

                        <motion.button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors z-10 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <motion.div
                                animate={{ rotate: showPassword ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </motion.div>
                        </motion.button>
                    </div>

                    {errors.password && (
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-2 pl-2 text-[12px] text-red-500 font-medium">
                            {errors.password}
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
                        {processing ? 'Confirming...' : 'Confirm Password'}
                        {!processing && (
                            <ArrowRight className="w-4 h-4" />
                        )}
                    </motion.button>
                </motion.div>
            </form>
        </>
    );
}

ConfirmPassword.layout = page => (
    <AuthLayout 
        children={page} 
        activeTab="confirm-password" 
        title="Secure Verification" 
        subtitle="Confirm your identity" 
    />
);
