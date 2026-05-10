import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, Clock, ShieldAlert, ArrowLeft } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { ROUTES } from '@/constants';

export default function Notifications({ notifications }) {
    const markAsRead = (id) => {
        router.post(
            `${ROUTES.notifications}/${id}/mark-read`,
            {},
            { preserveScroll: true },
        );
    };

    const handleAccept = (contactId, notificationId) => {
        router.post(
            `${ROUTES.contacts}/${contactId}/accept`,
            {},
            {
                onSuccess: () => markAsRead(notificationId),
            },
        );
    };

    const handleDeny = (contactId, notificationId) => {
        router.post(
            `${ROUTES.contacts}/${contactId}/deny`,
            {},
            {
                onSuccess: () => markAsRead(notificationId),
            },
        );
    };

    const markAllAsRead = () => {
        router.post(
            ROUTES.notifications + '/mark-all-read',
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
        <div className="flex h-screen w-full overflow-hidden bg-[var(--color-bg-base)] font-sans text-[var(--color-text-main)] antialiased transition-colors duration-0 selection:bg-[var(--color-gold)] selection:text-[var(--color-gold-fg)]">
            <Head title="Notifications - Oscorp" />

            <Sidebar active="notifications" />

            <div className="relative flex flex-1 flex-col overflow-hidden">
                <Topbar />

                <div className="custom-scrollbar mx-auto w-full max-w-4xl flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-3">
                                <Link
                                    href="/dashboard"
                                    className="rounded-xl p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-white"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Link>
                                <h1
                                    className="text-2xl font-bold tracking-wide"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    Communication Array
                                </h1>
                            </div>
                            <p className="ml-12 text-[13px] text-[var(--color-text-muted)]">
                                Encrypted log of all system and account events.
                            </p>
                        </div>

                        <button
                            onClick={markAllAsRead}
                            className="flex items-center gap-2 rounded-xl border border-[var(--color-gold)]/30 px-4 py-2 text-[13px] font-semibold text-[var(--color-gold)] transition-colors hover:bg-[var(--color-gold-bg)]"
                        >
                            <CheckCircle className="h-4 w-4" />
                            Acknowledge All
                        </button>
                    </div>

                    {/* Notifications List */}
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
                                    Log is empty
                                </h3>
                                <p className="text-[13px] text-[var(--color-text-muted)]">
                                    No recent events detected by the system.
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

                                    <div className="flex items-center gap-2">
                                        {notification.data.action_type ===
                                            'contact_request' &&
                                            !notification.read_at && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            handleAccept(
                                                                notification
                                                                    .data
                                                                    .contact_id,
                                                                notification.id,
                                                            )
                                                        }
                                                        className="shrink-0 self-start rounded-lg bg-[var(--color-gold)] px-3 py-1.5 text-[12px] font-bold text-[var(--color-gold-fg)] transition-all hover:brightness-110 sm:self-center"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeny(
                                                                notification
                                                                    .data
                                                                    .contact_id,
                                                                notification.id,
                                                            )
                                                        }
                                                        className="shrink-0 self-start rounded-lg border border-red-500/30 px-3 py-1.5 text-[12px] font-medium text-red-400 transition-colors hover:bg-red-500/10 sm:self-center"
                                                    >
                                                        Deny
                                                    </button>
                                                </>
                                            )}

                                        {!notification.read_at && (
                                            <button
                                                onClick={() =>
                                                    markAsRead(notification.id)
                                                }
                                                className="shrink-0 self-start rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[12px] font-medium transition-colors hover:bg-[var(--color-bg-elevated)] sm:self-center"
                                            >
                                                {notification.data
                                                    .action_type ===
                                                'contact_request'
                                                    ? 'Ignore'
                                                    : 'Mark Read'}
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Pagination Controls could go here if there are multiple pages */}
                    {notifications.last_page > 1 && (
                        <div className="mt-8 flex justify-center gap-2">
                            <div className="font-mono text-[12px] text-[var(--color-text-muted)]">
                                Page {notifications.current_page} of{' '}
                                {notifications.last_page}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
