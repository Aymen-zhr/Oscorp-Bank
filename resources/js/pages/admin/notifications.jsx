import React from 'react';
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, Clock, ShieldAlert } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminNotifications({ notifications }) {
    const markAsRead = (id) => {
        router.post(
            `/admin/notifications/${id}/mark-read`,
            {},
            { preserveScroll: true },
        );
    };

    const markAllAsRead = () => {
        router.post(
            '/admin/notifications/mark-all-read',
            {},
            { preserveScroll: true },
        );
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-emerald-400" />;
            case 'alert':
                return <ShieldAlert className="h-5 w-5 text-red-400" />;
            case 'info':
            default:
                return <Clock className="h-5 w-5 text-[var(--color-gold)]" />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'success':
                return 'bg-emerald-500/10';
            case 'alert':
                return 'bg-red-500/10';
            case 'info':
            default:
                return 'bg-[var(--color-gold-bg)]';
        }
    };

    return (
        <AdminLayout active="notifications">
            <Head title="Admin Notifications - Oscorp" />
            <div className="custom-scrollbar mx-auto w-full max-w-4xl flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1
                            className="text-2xl font-bold tracking-wide"
                            style={{ color: 'var(--color-text-main)' }}
                        >
                            System Notifications
                        </h1>
                        <p className="mt-2 text-[13px] text-[var(--color-text-muted)]">
                            All system events, user activities, and alerts.
                        </p>
                    </div>

                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 rounded-xl border border-[var(--color-gold)]/30 px-4 py-2 text-[13px] font-semibold text-[var(--color-gold)] transition-colors hover:bg-[var(--color-gold-bg)]"
                    >
                        <CheckCircle className="h-4 w-4" />
                        Mark All Read
                    </button>
                </div>

                <div className="space-y-4">
                    {notifications.data.length === 0 ? (
                        <div
                            className="rounded-2xl p-8 py-16 text-center"
                            style={{
                                background: 'var(--color-bg-card)',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg-elevated)]">
                                <Bell className="h-8 w-8 text-[var(--color-text-muted)] opacity-50" />
                            </div>
                            <h3
                                className="mb-2 font-semibold"
                                style={{ color: 'var(--color-text-main)' }}
                            >
                                No notifications
                            </h3>
                            <p className="text-[13px] text-[var(--color-text-muted)]">
                                No recent system events detected.
                            </p>
                        </div>
                    ) : (
                        notifications.data.map((notification, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={notification.id}
                                className={`relative flex flex-col justify-between gap-4 overflow-hidden rounded-2xl p-5 transition-all sm:flex-row sm:items-center ${notification.read_at ? 'opacity-70' : 'shadow-[0_0_15px_rgba(212,175,55,0.05)]'}`}
                                style={{
                                    background: 'var(--color-bg-card)',
                                    border: `1px solid ${notification.read_at ? 'var(--color-border)' : 'rgba(212,175,55,0.3)'}`,
                                }}
                            >
                                {!notification.read_at && (
                                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-[var(--color-gold)] shadow-[0_0_10px_var(--color-gold)]" />
                                )}

                                <div className="flex items-start gap-4">
                                    <div
                                        className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${getBgColor(notification.data.type)}`}
                                    >
                                        {getIcon(notification.data.type)}
                                    </div>
                                    <div>
                                        <div className="mb-1 flex items-center gap-3">
                                            <h3
                                                className="font-semibold"
                                                style={{
                                                    color: 'var(--color-text-main)',
                                                }}
                                            >
                                                {notification.data.title}
                                            </h3>
                                            {!notification.read_at && (
                                                <span className="rounded bg-[var(--color-gold)] px-2 py-0.5 text-[9px] font-bold tracking-wider text-[var(--color-gold-fg)] uppercase">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                        <p className="mb-2 text-[13px] break-words text-[var(--color-text-muted)]">
                                            {notification.data.message}
                                        </p>
                                        <div className="font-mono text-[11px] text-[var(--color-text-muted)] opacity-60">
                                            {new Date(
                                                notification.created_at,
                                            ).toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                {!notification.read_at && (
                                    <button
                                        onClick={() =>
                                            markAsRead(notification.id)
                                        }
                                        className="shrink-0 self-start rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[12px] font-medium transition-colors hover:bg-[var(--color-bg-elevated)] sm:self-center"
                                    >
                                        Mark Read
                                    </button>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>

                {notifications.last_page > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        <div className="font-mono text-[12px] text-[var(--color-text-muted)]">
                            Page {notifications.current_page} of{' '}
                            {notifications.last_page}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
