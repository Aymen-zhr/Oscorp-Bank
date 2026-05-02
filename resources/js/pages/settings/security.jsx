import { Head, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Shield, Key, CheckCircle2 } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';

export default function Security({ canManageTwoFactor, twoFactorEnabled, requiresConfirmation }) {
    const { errors } = usePage().props;
    const { t } = useTranslation();

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();
        passwordForm.put(route('user-password.update'), {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
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
        ${passwordForm[field] ? 'top-2.5 translate-y-0 text-[9px] uppercase tracking-[1px] font-bold' : ''}
    `;

    return (
        <>
            <Head title="OSCORP | Security Settings" />

            <div className="max-w-2xl mx-auto space-y-8">
                {canManageTwoFactor && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-lg"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-[var(--color-gold)]/10 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-[var(--color-gold)]" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-[var(--color-text-main)]">Two-Factor Authentication</h2>
                                <p className="text-[13px] text-[var(--color-text-muted)]">Add an extra layer of security</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-bg-base)] border border-[var(--color-border)]">
                            <div className="flex items-center gap-3">
                                {twoFactorEnabled ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                ) : (
                                    <Shield className="w-5 h-5 text-[var(--color-text-muted)]" />
                                )}
                                <div>
                                    <p className="text-[14px] font-medium text-[var(--color-text-main)]">
                                        {twoFactorEnabled ? 'Enabled' : 'Not Enabled'}
                                    </p>
                                    <p className="text-[12px] text-[var(--color-text-muted)]">
                                        {twoFactorEnabled
                                            ? 'Your account is protected with 2FA'
                                            : requiresConfirmation
                                                ? 'Password confirmation required to enable'
                                                : 'Enable to secure your account'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-lg"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-[var(--color-gold)]/10 flex items-center justify-center">
                            <Key className="w-5 h-5 text-[var(--color-gold)]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[var(--color-text-main)]">Update Password</h2>
                            <p className="text-[13px] text-[var(--color-text-muted)]">Ensure your account uses a secure password</p>
                        </div>
                    </div>

                    {passwordForm.recentlySuccessful && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 flex items-center gap-2 font-medium text-[13px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Password updated successfully.
                        </motion.div>
                    )}

                    <form onSubmit={updatePassword} className="space-y-6">
                        <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
                            <div className="relative group">
                                <motion.div
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                                    animate={{ color: 'var(--color-gold)' }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Key className="w-5 h-5" />
                                </motion.div>

                                <input
                                    id="current_password"
                                    type="password"
                                    name="current_password"
                                    value={passwordForm.current_password}
                                    className={inputClasses('current_password')}
                                    placeholder={t('settings.security.current_password_placeholder')}
                                    autoComplete="current-password"
                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                />
                                <label htmlFor="current_password" className={labelClasses('current_password')}>
                                    Current Password
                                </label>
                            </div>
                            {errors.current_password && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 pl-2 text-[12px] text-red-500 font-medium">
                                    {errors.current_password}
                                </motion.p>
                            )}
                        </motion.div>

                        <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                            <div className="relative group">
                                <motion.div
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                                    animate={{ color: 'var(--color-gold)' }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Key className="w-5 h-5" />
                                </motion.div>

                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={passwordForm.password}
                                    className={inputClasses('password')}
                                    placeholder="New Password"
                                    autoComplete="new-password"
                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                />
                                <label htmlFor="password" className={labelClasses('password')}>
                                    New Password
                                </label>
                            </div>
                            {errors.password && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 pl-2 text-[12px] text-red-500 font-medium">
                                    {errors.password}
                                </motion.p>
                            )}
                        </motion.div>

                        <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                            <div className="relative group">
                                <motion.div
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                                    animate={{ color: 'var(--color-gold)' }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Key className="w-5 h-5" />
                                </motion.div>

                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={passwordForm.password_confirmation}
                                    className={inputClasses('password_confirmation')}
                                    placeholder="Confirm Password"
                                    autoComplete="new-password"
                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                />
                                <label htmlFor="password_confirmation" className={labelClasses('password_confirmation')}>
                                    Confirm Password
                                </label>
                            </div>
                        </motion.div>

                        <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible" className="flex items-center justify-end pt-2">
                            <motion.button
                                type="submit"
                                disabled={passwordForm.processing}
                                whileHover={{ scale: passwordForm.processing ? 1 : 1.01 }}
                                whileTap={{ scale: passwordForm.processing ? 1 : 0.98 }}
                                className="bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] hover:brightness-110 text-black font-bold text-[14px] px-6 py-3 rounded-xl transition-all shadow-[0_4px_20px_rgba(212,175,55,0.3)] flex items-center gap-2 disabled:opacity-50"
                            >
                                <Key className="w-4 h-4" />
                                {passwordForm.processing ? 'Updating...' : 'Update Password'}
                            </motion.button>
                        </motion.div>
                    </form>
                </motion.div>
            </div>
        </>
    );
}
