import { Head, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { User, Mail, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';

export default function Profile({ mustVerifyEmail, status }) {
    const { auth, errors } = usePage().props;
    const { t } = useTranslation();
    const user = auth.user;

    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
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
            <Head title="OSCORP | Profile Settings" />

            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-lg"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-[var(--color-gold)]/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-[var(--color-gold)]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[var(--color-text-main)]">Profile Information</h2>
                            <p className="text-[13px] text-[var(--color-text-muted)]">Update your account details</p>
                        </div>
                    </div>

                    {recentlySuccessful && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 flex items-center gap-2 font-medium text-[13px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Profile updated successfully.
                        </motion.div>
                    )}

                    {mustVerifyEmail && !user.email_verified_at && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 flex items-center gap-2 font-medium text-[13px] text-amber-600 dark:text-amber-400 bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/20"
                        >
                            <AlertCircle className="w-4 h-4" />
                            Your email address is unverified.
                        </motion.div>
                    )}

                    {status && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6 font-medium text-[13px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20"
                        >
                            {status}
                        </motion.div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
                            <div className="relative group">
                                <motion.div
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                                    animate={{ color: 'var(--color-gold)' }}
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
                                    placeholder={t('settings.profile.full_name_placeholder')}
                                    autoComplete="name"
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <label htmlFor="name" className={labelClasses('name')}>
                                    Full Name
                                </label>
                            </div>
                            {errors.name && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 pl-2 text-[12px] text-red-500 font-medium">
                                    {errors.name}
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
                                    <Mail className="w-5 h-5" />
                                </motion.div>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className={inputClasses('email')}
                                    placeholder={t('settings.profile.email_placeholder')}
                                    autoComplete="email"
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <label htmlFor="email" className={labelClasses('email')}>
                                    Email Address
                                </label>
                            </div>
                            {errors.email && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 pl-2 text-[12px] text-red-500 font-medium">
                                    {errors.email}
                                </motion.p>
                            )}
                        </motion.div>

                        <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible" className="flex items-center justify-end pt-2">
                            <motion.button
                                type="submit"
                                disabled={processing}
                                whileHover={{ scale: processing ? 1 : 1.01 }}
                                whileTap={{ scale: processing ? 1 : 0.98 }}
                                className="bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] hover:brightness-110 text-black font-bold text-[14px] px-6 py-3 rounded-xl transition-all shadow-[0_4px_20px_rgba(212,175,55,0.3)] flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {processing ? 'Saving...' : 'Save Changes'}
                            </motion.button>
                        </motion.div>
                    </form>
                </motion.div>
            </div>
        </>
    );
}
