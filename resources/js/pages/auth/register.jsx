import { useEffect, useState, useMemo } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, Check, X, ShieldCheck } from 'lucide-react';
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
    const strengthColor = strength <= 1 ? '#ef4444' : strength <= 2 ? '#f59e0b' : strength <= 4 ? '#3b82f6' : '#10b981';
    const strengthLabel = strength <= 1 ? 'Vulnerable' : strength <= 2 ? 'Weak' : strength <= 4 ? 'Moderate' : 'Secure';

    if (!password) return null;

    return (
        <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-base)]"
        >
            <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-[1px] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Security Level
                </span>
                <motion.span
                    className="text-[11px] font-bold uppercase tracking-[1px] px-2 py-0.5 rounded-md"
                    style={{ color: strengthColor, backgroundColor: `${strengthColor}15` }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.3 }}
                    key={strengthLabel}
                >
                    {strengthLabel}
                </motion.span>
            </div>
            
            <div className="h-1.5 rounded-full bg-[var(--color-border)] overflow-hidden relative mb-4">
                <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ backgroundColor: strengthColor, boxShadow: `0 0 10px ${strengthColor}` }}
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
                        className="flex items-center gap-2 group/check cursor-default"
                    >
                        <motion.div
                            animate={{
                                backgroundColor: check.met ? 'rgba(16,185,129,0.1)' : 'transparent',
                                borderColor: check.met ? 'rgba(16,185,129,0.3)' : 'var(--color-border)',
                            }}
                            className="w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-colors"
                        >
                            {check.met ? (
                                <Check className="w-2.5 h-2.5 text-emerald-500" />
                            ) : null}
                        </motion.div>
                        <span className={`text-[10px] font-bold tracking-[0.5px] uppercase transition-colors ${check.met ? 'text-[var(--color-text-main)]' : 'text-[var(--color-text-muted)]'}`}>
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

    const passwordsMatch = data.password && data.password_confirmation && data.password === data.password_confirmation;
    const passwordsMismatch = data.password_confirmation && data.password !== data.password_confirmation;

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
                <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
                    <div className="relative group">
                        <motion.div
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                            animate={{ color: focusedField === 'name' || data.name ? 'var(--color-gold)' : 'var(--color-text-muted)', scale: focusedField === 'name' ? 1.1 : 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <User className="w-5 h-5" />
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
                                className="absolute right-4 top-1/2 -translate-y-1/2"
                            >
                                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                </div>
                            </motion.div>
                        )}
                    </div>
                    {errors.name && (
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-1 pl-2 text-[12px] text-red-500 font-medium">
                            {errors.name}
                        </motion.p>
                    )}
                </motion.div>

                <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                    <div className="relative group">
                        <motion.div
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                            animate={{ color: focusedField === 'email' || data.email ? 'var(--color-gold)' : 'var(--color-text-muted)', scale: focusedField === 'email' ? 1.1 : 1 }}
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
                            placeholder="Communications Uplink"
                            required
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <label htmlFor="email" className={labelClasses('email')}>
                            Communications Uplink (Email)
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
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-1 pl-2 text-[12px] text-red-500 font-medium">
                            {errors.email}
                        </motion.p>
                    )}
                </motion.div>

                <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                    <div className="relative group">
                        <motion.div
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                            animate={{ color: focusedField === 'password' || data.password ? 'var(--color-gold)' : 'var(--color-text-muted)', scale: focusedField === 'password' ? 1.1 : 1 }}
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
                            placeholder="Encryption Key"
                            required
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <label htmlFor="password" className={labelClasses('password')}>
                            Encryption Key (Password)
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
                    <AnimatePresence>
                        {data.password && (
                            <PasswordStrength password={data.password} />
                        )}
                    </AnimatePresence>
                    {errors.password && (
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-1 pl-2 text-[12px] text-red-500 font-medium">
                            {errors.password}
                        </motion.p>
                    )}
                </motion.div>

                <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
                    <div className="relative group">
                        <motion.div
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                            animate={{ color: focusedField === 'password_confirmation' || data.password_confirmation ? 'var(--color-gold)' : 'var(--color-text-muted)', scale: focusedField === 'password_confirmation' ? 1.1 : 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Lock className="w-5 h-5" />
                        </motion.div>
                        <input
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className={inputClasses('password_confirmation')}
                            placeholder="Verify Encryption Key"
                            required
                            onFocus={() => setFocusedField('password_confirmation')}
                            onBlur={() => setFocusedField(null)}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                        <label htmlFor="password_confirmation" className={labelClasses('password_confirmation')}>
                            Verify Encryption Key
                        </label>
                        <motion.button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors z-10 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <motion.div
                                animate={{ rotate: showConfirmPassword ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </motion.div>
                        </motion.button>
                    </div>
                    {errors.password_confirmation && (
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-1 pl-2 text-[12px] text-red-500 font-medium">
                            {errors.password_confirmation}
                        </motion.p>
                    )}
                    <AnimatePresence>
                        {passwordsMatch && (
                            <motion.p
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="pl-2 text-[12px] text-emerald-500 font-bold flex items-center gap-1.5"
                            >
                                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.3 }}>
                                    <Check className="w-4 h-4" />
                                </motion.div>
                                Keys Match
                            </motion.p>
                        )}
                        {passwordsMismatch && (
                            <motion.p
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="pl-2 text-[12px] text-red-500 font-bold flex items-center gap-1.5"
                            >
                                <X className="w-4 h-4" />
                                Keys do not match
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>

                <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible" className="mt-2">
                    <motion.button
                        type="submit"
                        disabled={processing}
                        whileHover={{ scale: processing ? 1 : 1.01 }}
                        whileTap={{ scale: processing ? 1 : 0.98 }}
                        className="w-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] hover:brightness-110 text-black font-bold text-[15px] py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.5)] flex items-center justify-center gap-2 group disabled:opacity-50 relative overflow-hidden"
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
                            animate={{ x: ['0%', '200%'] }}
                            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
                        />
                        {processing ? 'Processing Deployment...' : 'Establish Secure Account'}
                        {!processing && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
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
                    Already part of the network?{' '}
                    <Link href="/login" className="text-[var(--color-gold)] hover:text-[var(--color-gold-dark)] transition-colors font-bold group">
                        <span className="group-hover:underline">Re-authenticate</span>
                    </Link>
                </p>
            </motion.div>
        </>
    );
}

Register.layout = page => (
    <AuthLayout 
        children={page} 
        activeTab="register" 
        title="Open Your Account" 
        subtitle="Join the private banking network" 
    />
);
