import { useEffect, useState, useMemo } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Mail,
    Lock,
    ArrowRight,
    Eye,
    EyeOff,
    Check,
    X,
    ShieldCheck,
} from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';

function PasswordStrength({ password }) {
    const checks = useMemo(() => {
        return [
            { label: '8+ Characters', met: password.length >= 8 },
            { label: 'Uppercase', met: /[A-Z]/.test(password) },
            { label: 'Lowercase', met: /[a-z]/.test(password) },
            { label: 'Number', met: /\d/.test(password) },
            { label: 'Special Symbol', met: /[^A-Za-z0-9]/.test(password) },
        ];
    }, [password]);

    const strength = checks.filter((c) => c.met).length;
    const strengthPercent = (strength / checks.length) * 100;
    const strengthColor =
        strength <= 1
            ? '#ef4444'
            : strength <= 2
              ? '#f59e0b'
              : strength <= 4
                ? '#3b82f6'
                : '#10b981';
    const strengthLabel =
        strength <= 1
            ? 'Vulnerable'
            : strength <= 2
              ? 'Weak'
              : strength <= 4
                ? 'Moderate'
                : 'Secure';

    if (!password) return null;

    return (
        <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-base)] p-3.5"
        >
            <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-[1px] text-[var(--color-text-muted)] uppercase">
                    <ShieldCheck className="h-3.5 w-3.5" /> Security Level
                </span>
                <motion.span
                    className="rounded-md px-2 py-0.5 text-[11px] font-bold tracking-[1px] uppercase"
                    style={{
                        color: strengthColor,
                        backgroundColor: `${strengthColor}15`,
                    }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.3 }}
                    key={strengthLabel}
                >
                    {strengthLabel}
                </motion.span>
            </div>

            <div className="relative mb-4 h-1.5 overflow-hidden rounded-full bg-[var(--color-border)]">
                <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                        backgroundColor: strengthColor,
                        boxShadow: `0 0 10px ${strengthColor}`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${strengthPercent}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>

            <div className="grid grid-cols-2 gap-2">
                {checks.map((check, i) => (
                    <motion.div
                        key={check.label}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group/check flex cursor-default items-center gap-2"
                    >
                        <motion.div
                            animate={{
                                backgroundColor: check.met
                                    ? 'rgba(16,185,129,0.1)'
                                    : 'transparent',
                                borderColor: check.met
                                    ? 'rgba(16,185,129,0.3)'
                                    : 'var(--color-border)',
                            }}
                            className="flex h-3.5 w-3.5 items-center justify-center rounded-full border transition-colors"
                        >
                            {check.met ? (
                                <Check className="h-2.5 w-2.5 text-emerald-500" />
                            ) : null}
                        </motion.div>
                        <span
                            className={`text-[10px] font-bold tracking-[0.5px] uppercase transition-colors ${check.met ? 'text-[var(--color-text-main)]' : 'text-[var(--color-text-muted)]'}`}
                        >
                            {check.label}
                        </span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post('/register');
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

    const passwordsMatch =
        data.password &&
        data.password_confirmation &&
        data.password === data.password_confirmation;
    const passwordsMismatch =
        data.password_confirmation &&
        data.password !== data.password_confirmation;

    const fieldVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
        }),
    };

    return (
        <>
            <Head title="OSCORP | Deployment Phase" />

            <form onSubmit={submit} className="flex flex-col gap-4">
                <motion.div
                    custom={0}
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="group relative">
                        <motion.div
                            className="absolute top-1/2 left-4 z-10 -translate-y-1/2"
                            animate={{
                                color:
                                    focusedField === 'name' || data.name
                                        ? 'var(--color-gold)'
                                        : 'var(--color-text-muted)',
                                scale: focusedField === 'name' ? 1.1 : 1,
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            <User className="h-5 w-5" />
                        </motion.div>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            className={inputClasses('name')}
                            placeholder="Operator Name"
                            required
                            autoFocus
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <label htmlFor="name" className={labelClasses('name')}>
                            Operator Name
                        </label>
                        {data.name && !errors.name && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-1/2 right-4 -translate-y-1/2"
                            >
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                </div>
                            </motion.div>
                        )}
                    </div>
                    {errors.name && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-1 pl-2 text-[12px] font-medium text-red-500"
                        >
                            {errors.name}
                        </motion.p>
                    )}
                </motion.div>

                <motion.div
                    custom={1}
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="group relative">
                        <motion.div
                            className="absolute top-1/2 left-4 z-10 -translate-y-1/2"
                            animate={{
                                color:
                                    focusedField === 'email' || data.email
                                        ? 'var(--color-gold)'
                                        : 'var(--color-text-muted)',
                                scale: focusedField === 'email' ? 1.1 : 1,
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            <Mail className="h-5 w-5" />
                        </motion.div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className={inputClasses('email')}
                            placeholder="Communications Uplink"
                            required
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <label
                            htmlFor="email"
                            className={labelClasses('email')}
                        >
                            Communications Uplink (Email)
                        </label>
                        {data.email && !errors.email && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-1/2 right-4 -translate-y-1/2"
                            >
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                </div>
                            </motion.div>
                        )}
                    </div>
                    {errors.email && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-1 pl-2 text-[12px] font-medium text-red-500"
                        >
                            {errors.email}
                        </motion.p>
                    )}
                </motion.div>

                <motion.div
                    custom={2}
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="group relative">
                        <motion.div
                            className="absolute top-1/2 left-4 z-10 -translate-y-1/2"
                            animate={{
                                color:
                                    focusedField === 'password' || data.password
                                        ? 'var(--color-gold)'
                                        : 'var(--color-text-muted)',
                                scale: focusedField === 'password' ? 1.1 : 1,
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
                            placeholder="Encryption Key"
                            required
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
                            Encryption Key (Password)
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
                    <AnimatePresence>
                        {data.password && (
                            <PasswordStrength password={data.password} />
                        )}
                    </AnimatePresence>
                    {errors.password && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-1 pl-2 text-[12px] font-medium text-red-500"
                        >
                            {errors.password}
                        </motion.p>
                    )}
                </motion.div>

                <motion.div
                    custom={3}
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="group relative">
                        <motion.div
                            className="absolute top-1/2 left-4 z-10 -translate-y-1/2"
                            animate={{
                                color:
                                    focusedField === 'password_confirmation' ||
                                    data.password_confirmation
                                        ? 'var(--color-gold)'
                                        : 'var(--color-text-muted)',
                                scale:
                                    focusedField === 'password_confirmation'
                                        ? 1.1
                                        : 1,
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            <Lock className="h-5 w-5" />
                        </motion.div>
                        <input
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className={inputClasses('password_confirmation')}
                            placeholder="Verify Encryption Key"
                            required
                            onFocus={() =>
                                setFocusedField('password_confirmation')
                            }
                            onBlur={() => setFocusedField(null)}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                        />
                        <label
                            htmlFor="password_confirmation"
                            className={labelClasses('password_confirmation')}
                        >
                            Verify Encryption Key
                        </label>
                        <motion.button
                            type="button"
                            className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-md p-1 text-[var(--color-text-muted)] transition-colors hover:bg-black/5 hover:text-[var(--color-text-main)] dark:hover:bg-white/5"
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                        >
                            <motion.div
                                animate={{
                                    scale: showConfirmPassword ? 1.2 : 1,
                                    opacity: showConfirmPassword ? 1 : 0.7,
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </motion.div>
                        </motion.button>
                    </div>
                    {errors.password_confirmation && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-1 pl-2 text-[12px] font-medium text-red-500"
                        >
                            {errors.password_confirmation}
                        </motion.p>
                    )}
                    <AnimatePresence>
                        {passwordsMatch && (
                            <motion.p
                                initial={{
                                    opacity: 0,
                                    height: 0,
                                    marginTop: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                    height: 'auto',
                                    marginTop: 8,
                                }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="flex items-center gap-1.5 pl-2 text-[12px] font-bold text-emerald-500"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Check className="h-4 w-4" />
                                </motion.div>
                                Keys Match
                            </motion.p>
                        )}
                        {passwordsMismatch && (
                            <motion.p
                                initial={{
                                    opacity: 0,
                                    height: 0,
                                    marginTop: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                    height: 'auto',
                                    marginTop: 8,
                                }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="flex items-center gap-1.5 pl-2 text-[12px] font-bold text-red-500"
                            >
                                <X className="h-4 w-4" />
                                Keys do not match
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>

                <motion.div
                    custom={4}
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-2"
                >
                    <motion.button
                        type="submit"
                        disabled={processing}
                        whileHover={{ scale: processing ? 1 : 1.01 }}
                        whileTap={{ scale: processing ? 1 : 0.98 }}
                        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] py-4 text-[15px] font-bold text-[var(--color-gold-fg)] shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition-all hover:shadow-[0_8px_30px_rgba(212,175,55,0.5)] hover:brightness-110 disabled:opacity-50"
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
                        {processing
                            ? 'Processing Deployment...'
                            : 'Establish Secure Account'}
                        {!processing && (
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        )}
                    </motion.button>
                </motion.div>
            </form>

            <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
            >
                <div className="relative flex items-center gap-4">
                    <div className="h-px flex-1 bg-[var(--color-border)]" />
                    <span className="text-[11px] font-bold tracking-[1px] text-[var(--color-text-muted)] uppercase">
                        or sign up with
                    </span>
                    <div className="h-px flex-1 bg-[var(--color-border)]" />
                </div>

                <a
                    href="/auth/google/redirect"
                    className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-6 py-3.5 text-[14px] font-bold text-[var(--color-text-main)] transition-all hover:border-[var(--color-gold)] hover:shadow-[0_0_0_1px_rgba(212,175,55,0.2)]"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                </a>
            </motion.div>

            <motion.div
                className="mt-10 text-center lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <p className="text-[13px] font-medium text-[var(--color-text-muted)]">
                    Already part of the network?{' '}
                    <Link
                        href="/login"
                        className="group font-bold text-[var(--color-gold)] transition-colors hover:text-[var(--color-gold-dark)]"
                    >
                        <span className="group-hover:underline">
                            Re-authenticate
                        </span>
                    </Link>
                </p>
            </motion.div>
        </>
    );
}

Register.layout = (page) => (
    <AuthLayout
        children={page}
        activeTab="register"
        title="Open Your Account"
        subtitle="Join the private banking network"
    />
);
