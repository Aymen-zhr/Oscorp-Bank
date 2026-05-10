import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Lock,
    Bell,
    Shield,
    CreditCard,
    Eye,
    EyeOff,
} from 'lucide-react';

export default function Settings({ auth }) {
    const user = auth?.user;

    const { data, setData, post, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        job_title: user?.job_title || '',
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const {
        data: notifData,
        setData: setNotifData,
        post: postNotif,
        processing: notifProcessing,
    } = useForm({
        email_notifications: true,
        push_notifications: true,
        loan_alerts: true,
        transaction_alerts: true,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        post('/admin/settings/profile', { preserveScroll: true });
    };

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        post('/admin/settings/password', {
            preserveScroll: true,
            onSuccess: () => {
                setData('current_password', '');
                setData('password', '');
                setData('password_confirmation', '');
            },
        });
    };

    const handleNotificationUpdate = (e) => {
        e.preventDefault();
        postNotif('/admin/settings/notifications');
    };

    return (
        <AdminLayout active="settings">
            <Head title="Admin Settings - Oscorp" />
            <div className="mx-auto max-w-4xl flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1
                        className="text-2xl font-bold tracking-wide"
                        style={{ color: 'var(--color-text-main)' }}
                    >
                        Admin Settings
                    </h1>
                    <p className="mt-2 text-[13px] text-[var(--color-text-muted)]">
                        Manage your account and preferences.
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Profile Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl p-6"
                        style={{
                            background: 'var(--color-bg-card)',
                            border: '1px solid var(--color-border)',
                        }}
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '2.5rem',
                                    height: '2.5rem',
                                    borderRadius: '0.75rem',
                                    background: 'var(--color-gold-bg)',
                                }}
                            >
                                <User
                                    style={{
                                        width: '1.25rem',
                                        height: '1.25rem',
                                        color: 'var(--color-gold)',
                                    }}
                                />
                            </div>
                            <div>
                                <h2
                                    className="text-lg font-semibold"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    Profile Information
                                </h2>
                                <p
                                    className="text-[12px]"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    Update your account details
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={handleProfileUpdate}
                            className="space-y-4"
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label
                                        className="mb-1.5 block text-[13px] font-medium"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                        }}
                                    >
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="w-full rounded-xl border px-4 py-2.5 text-[13px] transition-all focus:ring-2 focus:ring-[var(--color-gold)]/20 focus:outline-none"
                                        style={{
                                            background: 'var(--color-bg-base)',
                                            borderColor: 'var(--color-border)',
                                            color: 'var(--color-text-main)',
                                        }}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="mb-1.5 block text-[13px] font-medium"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                        }}
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        className="w-full rounded-xl border px-4 py-2.5 text-[13px] transition-all focus:ring-2 focus:ring-[var(--color-gold)]/20 focus:outline-none"
                                        style={{
                                            background: 'var(--color-bg-base)',
                                            borderColor: 'var(--color-border)',
                                            color: 'var(--color-text-main)',
                                        }}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="mb-1.5 block text-[13px] font-medium"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                        }}
                                    >
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData('phone', e.target.value)
                                        }
                                        className="w-full rounded-xl border px-4 py-2.5 text-[13px] transition-all focus:ring-2 focus:ring-[var(--color-gold)]/20 focus:outline-none"
                                        style={{
                                            background: 'var(--color-bg-base)',
                                            borderColor: 'var(--color-border)',
                                            color: 'var(--color-text-main)',
                                        }}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="mb-1.5 block text-[13px] font-medium"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                        }}
                                    >
                                        Job Title
                                    </label>
                                    <input
                                        type="text"
                                        value={data.job_title}
                                        onChange={(e) =>
                                            setData('job_title', e.target.value)
                                        }
                                        className="w-full rounded-xl border px-4 py-2.5 text-[13px] transition-all focus:ring-2 focus:ring-[var(--color-gold)]/20 focus:outline-none"
                                        style={{
                                            background: 'var(--color-bg-base)',
                                            borderColor: 'var(--color-border)',
                                            color: 'var(--color-text-main)',
                                        }}
                                        placeholder="e.g. System Administrator"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-[var(--color-gold)] px-6 py-2.5 text-[13px] font-bold text-[var(--color-gold-fg)] transition-all hover:brightness-110 disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Profile'}
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    {/* Change Password */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-2xl p-6"
                        style={{
                            background: 'var(--color-bg-card)',
                            border: '1px solid var(--color-border)',
                        }}
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '2.5rem',
                                    height: '2.5rem',
                                    borderRadius: '0.75rem',
                                    background: 'rgba(239,68,68,0.1)',
                                }}
                            >
                                <Lock
                                    style={{
                                        width: '1.25rem',
                                        height: '1.25rem',
                                        color: '#ef4444',
                                    }}
                                />
                            </div>
                            <div>
                                <h2
                                    className="text-lg font-semibold"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    Change Password
                                </h2>
                                <p
                                    className="text-[12px]"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    Update your login password
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={handlePasswordUpdate}
                            className="space-y-4"
                        >
                            <div>
                                <label
                                    className="mb-1.5 block text-[13px] font-medium"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    Current Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        value={data.current_password}
                                        onChange={(e) =>
                                            setData(
                                                'current_password',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border px-4 py-2.5 pr-12 text-[13px] transition-all focus:ring-2 focus:ring-[var(--color-gold)]/20 focus:outline-none"
                                        style={{
                                            background: 'var(--color-bg-base)',
                                            borderColor: 'var(--color-border)',
                                            color: 'var(--color-text-main)',
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--color-text-muted)]"
                                    >
                                        {showPassword ? (
                                            <EyeOff
                                                style={{
                                                    width: '1rem',
                                                    height: '1rem',
                                                }}
                                            />
                                        ) : (
                                            <Eye
                                                style={{
                                                    width: '1rem',
                                                    height: '1rem',
                                                }}
                                            />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label
                                        className="mb-1.5 block text-[13px] font-medium"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                        }}
                                    >
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={
                                                showNewPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    'password',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border px-4 py-2.5 pr-12 text-[13px] transition-all focus:ring-2 focus:ring-[var(--color-gold)]/20 focus:outline-none"
                                            style={{
                                                background:
                                                    'var(--color-bg-base)',
                                                borderColor:
                                                    'var(--color-border)',
                                                color: 'var(--color-text-main)',
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowNewPassword(
                                                    !showNewPassword,
                                                )
                                            }
                                            className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--color-text-muted)]"
                                        >
                                            {showNewPassword ? (
                                                <EyeOff
                                                    style={{
                                                        width: '1rem',
                                                        height: '1rem',
                                                    }}
                                                />
                                            ) : (
                                                <Eye
                                                    style={{
                                                        width: '1rem',
                                                        height: '1rem',
                                                    }}
                                                />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label
                                        className="mb-1.5 block text-[13px] font-medium"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                        }}
                                    >
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                'password_confirmation',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border px-4 py-2.5 text-[13px] transition-all focus:ring-2 focus:ring-[var(--color-gold)]/20 focus:outline-none"
                                        style={{
                                            background: 'var(--color-bg-base)',
                                            borderColor: 'var(--color-border)',
                                            color: 'var(--color-text-main)',
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-[var(--color-gold)] px-6 py-2.5 text-[13px] font-bold text-[var(--color-gold-fg)] transition-all hover:brightness-110 disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Updating...'
                                        : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    {/* Notification Preferences */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-2xl p-6"
                        style={{
                            background: 'var(--color-bg-card)',
                            border: '1px solid var(--color-border)',
                        }}
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '2.5rem',
                                    height: '2.5rem',
                                    borderRadius: '0.75rem',
                                    background: 'rgba(59,130,246,0.1)',
                                }}
                            >
                                <Bell
                                    style={{
                                        width: '1.25rem',
                                        height: '1.25rem',
                                        color: '#3b82f6',
                                    }}
                                />
                            </div>
                            <div>
                                <h2
                                    className="text-lg font-semibold"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    Notification Preferences
                                </h2>
                                <p
                                    className="text-[12px]"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    Control how you receive alerts
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={handleNotificationUpdate}
                            className="space-y-4"
                        >
                            <div className="space-y-3">
                                {[
                                    {
                                        key: 'email_notifications',
                                        label: 'Email Notifications',
                                        desc: 'Receive notifications via email',
                                    },
                                    {
                                        key: 'push_notifications',
                                        label: 'Push Notifications',
                                        desc: 'Browser push notifications',
                                    },
                                    {
                                        key: 'loan_alerts',
                                        label: 'Loan Alerts',
                                        desc: 'Get notified about pending loans',
                                    },
                                    {
                                        key: 'transaction_alerts',
                                        label: 'Transaction Alerts',
                                        desc: 'Notifications for large transactions',
                                    },
                                ].map(({ key, label, desc }) => (
                                    <div
                                        key={key}
                                        className="flex items-center justify-between rounded-xl p-4"
                                        style={{
                                            background: 'var(--color-bg-base)',
                                        }}
                                    >
                                        <div>
                                            <div
                                                className="text-[14px] font-medium"
                                                style={{
                                                    color: 'var(--color-text-main)',
                                                }}
                                            >
                                                {label}
                                            </div>
                                            <div
                                                className="text-[12px]"
                                                style={{
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                {desc}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setNotifData(
                                                    key,
                                                    !notifData[key],
                                                )
                                            }
                                            className={`relative h-6 w-11 rounded-full transition-colors ${notifData[key] ? 'bg-[var(--color-gold)]' : 'bg-gray-600'}`}
                                        >
                                            <div
                                                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${notifData[key] ? 'translate-x-5' : 'translate-x-0.5'}`}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={notifProcessing}
                                    className="rounded-xl bg-[var(--color-gold)] px-6 py-2.5 text-[13px] font-bold text-[var(--color-gold-fg)] transition-all hover:brightness-110 disabled:opacity-50"
                                >
                                    {notifProcessing
                                        ? 'Saving...'
                                        : 'Save Preferences'}
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    {/* Security Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-2xl p-6"
                        style={{
                            background: 'var(--color-bg-card)',
                            border: '1px solid var(--color-border)',
                        }}
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '2.5rem',
                                    height: '2.5rem',
                                    borderRadius: '0.75rem',
                                    background: 'rgba(16,185,129,0.1)',
                                }}
                            >
                                <Shield
                                    style={{
                                        width: '1.25rem',
                                        height: '1.25rem',
                                        color: '#10b981',
                                    }}
                                />
                            </div>
                            <div>
                                <h2
                                    className="text-lg font-semibold"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    Security
                                </h2>
                                <p
                                    className="text-[12px]"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    Manage security preferences
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div
                                className="flex items-center justify-between rounded-xl p-4"
                                style={{ background: 'var(--color-bg-base)' }}
                            >
                                <div className="flex items-center gap-3">
                                    <CreditCard
                                        style={{
                                            width: '1.25rem',
                                            height: '1.25rem',
                                            color: 'var(--color-text-muted)',
                                        }}
                                    />
                                    <div>
                                        <div
                                            className="text-[14px] font-medium"
                                            style={{
                                                color: 'var(--color-text-main)',
                                            }}
                                        >
                                            Sessions
                                        </div>
                                        <div
                                            className="text-[12px]"
                                            style={{
                                                color: 'var(--color-text-muted)',
                                            }}
                                        >
                                            Manage active sessions
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() =>
                                        router.post(
                                            '/admin/settings/logout-other-devices',
                                        )
                                    }
                                    className="rounded-lg border px-4 py-2 text-[12px] font-medium transition-colors hover:bg-[var(--color-bg-elevated)]"
                                    style={{
                                        borderColor: 'var(--color-border)',
                                        color: 'var(--color-text-main)',
                                    }}
                                >
                                    Logout Other Devices
                                </button>
                            </div>

                            <div
                                className="flex items-center justify-between rounded-xl p-4"
                                style={{ background: 'var(--color-bg-base)' }}
                            >
                                <div className="flex items-center gap-3">
                                    <Shield
                                        style={{
                                            width: '1.25rem',
                                            height: '1.25rem',
                                            color: 'var(--color-text-muted)',
                                        }}
                                    />
                                    <div>
                                        <div
                                            className="text-[14px] font-medium"
                                            style={{
                                                color: 'var(--color-text-main)',
                                            }}
                                        >
                                            Two-Factor Authentication
                                        </div>
                                        <div
                                            className="text-[12px]"
                                            style={{
                                                color: 'var(--color-text-muted)',
                                            }}
                                        >
                                            Add extra security to your account
                                        </div>
                                    </div>
                                </div>
                                <button className="rounded-lg bg-[var(--color-gold)] px-4 py-2 text-[12px] font-bold text-[var(--color-gold-fg)] transition-all hover:brightness-110">
                                    Enable 2FA
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AdminLayout>
    );
}
