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

    const inputClasses = (field) =>
        `peer w-full bg-[var(--color-bg-base)] border rounded-xl px-12 pt-7 pb-3 text-[15px] font-medium text-[var(--color-text-main)] outline-none transition-all duration-300 placeholder-transparent ${
            errors[field]
                ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.1)]'
                : 'border-[var(--color-border)] focus:border-[var(--color-gold)] focus:shadow-[0_0_0_1px_rgba(212,175,55,0.2)] hover:border-[var(--color-border-hover)]'
        }`;

    const labelClasses = (
        field,
    ) => `absolute left-12 text-[var(--color-text-muted)] transition-all duration-300 pointer-events-none 
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
                <p className="text-[13px] font-medium text-[var(--color-text-muted)]">
                    This is a secure area. Please confirm your password before
                    proceeding.
                </p>
            </motion.div>

            {status && (
                <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                    className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-center text-[13px] font-medium text-emerald-600 dark:text-emerald-400"
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
                    <div className="group relative">
                        <motion.div
                            className="absolute top-1/2 left-4 z-10 -translate-y-1/2"
                            animate={{
                                color:
                                    focusedField === 'password' || data.password
                                        ? 'var(--color-gold)'
                                        : 'var(--color-text-muted)',
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            <Lock className="h-5 w-5" />
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
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                        />
                        <label
                            htmlFor="password"
                            className={labelClasses('password')}
                        >
                            Passkey
                        </label>

                        <motion.button
                            type="button"
                            className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-md p-1 text-[var(--color-text-muted)] transition-colors hover:bg-black/5 hover:text-[var(--color-text-main)] dark:hover:bg-white/5"
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <motion.div
                                animate={{
                                    scale: showPassword ? 1.2 : 1,
                                    opacity: showPassword ? 1 : 0.7,
                                }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 400,
                                    damping: 17,
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </motion.div>
                        </motion.button>
                    </div>

                    {errors.password && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 pl-2 text-[12px] font-medium text-red-500"
                        >
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
                        className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] py-4 text-[15px] font-bold text-[var(--color-gold-fg)] shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition-all hover:shadow-[0_8px_30px_rgba(212,175,55,0.5)] hover:brightness-110 disabled:opacity-50"
                    >
                        <motion.div
                            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{ x: ['0%', '200%'] }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                repeatDelay: 4,
                            }}
                        />
                        {processing ? 'Confirming...' : 'Confirm Password'}
                        {!processing && <ArrowRight className="h-4 w-4" />}
                    </motion.button>
                </motion.div>
            </form>
        </>
    );
}

ConfirmPassword.layout = (page) => (
    <AuthLayout
        children={page}
        activeTab="confirm-password"
        title="Secure Verification"
        subtitle="Confirm your identity"
    />
);
