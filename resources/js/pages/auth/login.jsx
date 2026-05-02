import { useEffect, useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [isHoveringSubmit, setIsHoveringSubmit] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    const fieldVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
        }),
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
            <Head title="OSCORP | Terminal Authorization" />

            <AnimatePresence>
                {status && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="font-medium text-[13px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20 text-center"
                    >
                        {status}
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={submit} className="flex flex-col gap-5">
                <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
                    <div className="relative group">
                        <motion.div
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                            animate={{ color: focusedField === 'email' || data.email ? 'var(--color-gold)' : 'var(--color-text-muted)' }}
                            transition={{ duration: 0.2 }}
                        >
                            <Mail className="w-5 h-5" />
                        </motion.div>
                        
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className={inputClasses('email')}
                            placeholder="Operator Email"
                            autoComplete="username"
                            autoFocus
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <label htmlFor="email" className={labelClasses('email')}>
                            Operator Email
                        </label>

                        {data.email && !errors.email && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute right-4 top-1/2 -translate-y-1/2"
                            >
                                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                </div>
                            </motion.div>
                        )}
                    </div>
                    {errors.email && (
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-2 pl-2 text-[12px] text-red-500 font-medium">
                            {errors.email}
                        </motion.p>
                    )}
                </motion.div>

                <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
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
                    
                    <div className="flex justify-end mt-2 px-1">
                        {canResetPassword && (
                            <Link href="/forgot-password" className="text-[11px] text-[var(--color-gold)] hover:text-[var(--color-gold-dark)] transition-colors font-bold tracking-wide uppercase">
                                Recover Access
                            </Link>
                        )}
                    </div>

                    {errors.password && (
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-1 pl-2 text-[12px] text-red-500 font-medium">
                            {errors.password}
                        </motion.p>
                    )}
                </motion.div>

                <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible" className="mt-2">
                    <label className="flex items-center gap-3 cursor-pointer group w-fit">
                        <motion.div
                            className="relative flex items-center justify-center w-5 h-5 rounded-[6px] border transition-colors"
                            style={{
                                borderColor: data.remember ? 'var(--color-gold)' : 'var(--color-border)',
                                backgroundColor: data.remember ? 'var(--color-gold-bg)' : 'transparent',
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="absolute w-full h-full opacity-0 cursor-pointer"
                            />
                            {data.remember && (
                                <motion.svg
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                    viewBox="0 0 12 12"
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    stroke="var(--color-gold)"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="2,6 5,9 10,3" />
                                </motion.svg>
                            )}
                        </motion.div>
                        <span className="text-[13px] font-medium text-[var(--color-text-muted)] group-hover:text-[var(--color-text-main)] transition-colors">Maintain secure connection</span>
                    </label>
                </motion.div>

                <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
                    <motion.button
                        type="submit"
                        disabled={processing}
                        whileHover={{ scale: processing ? 1 : 1.01 }}
                        whileTap={{ scale: processing ? 1 : 0.98 }}
                        onHoverStart={() => setIsHoveringSubmit(true)}
                        onHoverEnd={() => setIsHoveringSubmit(false)}
                        className="mt-6 w-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] hover:brightness-110 text-black font-bold text-[15px] py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.5)] flex items-center justify-center gap-2 group disabled:opacity-50 relative overflow-hidden"
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
                            animate={{ x: ['0%', '200%'] }}
                            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
                        />
                        {processing ? 'Authenticating...' : 'Initialize Uplink'}
                        {!processing && (
                            <motion.div
                                animate={{ x: isHoveringSubmit ? 4 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ArrowRight className="w-4 h-4" />
                            </motion.div>
                        )}
                    </motion.button>
                </motion.div>
            </form>

            <motion.div
                className="mt-10 text-center lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <p className="text-[13px] text-[var(--color-text-muted)] font-medium">
                    New operator?{' '}
                    <Link href="/register" className="text-[var(--color-gold)] hover:text-[var(--color-gold-dark)] transition-colors font-bold group">
                        <span className="group-hover:underline">Request Deployment</span>
                    </Link>
                </p>
            </motion.div>
        </>
    );
}

Login.layout = page => (
    <AuthLayout 
        children={page} 
        activeTab="login" 
        title="Welcome Back" 
        subtitle="Access your secure dashboard" 
    />
);
