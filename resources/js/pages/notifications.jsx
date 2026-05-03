import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, Clock, ShieldAlert, ArrowLeft } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';

export default function Notifications({ notifications }) {
    const markAsRead = (id) => {
        router.post(`/notifications/${id}/mark-read`, {}, { preserveScroll: true });
    };

    const handleAccept = (contactId, notificationId) => {
        router.post(`/contacts/${contactId}/accept`, {}, {
            onSuccess: () => markAsRead(notificationId)
        });
    };

    const handleDeny = (contactId, notificationId) => {
        router.post(`/contacts/${contactId}/deny`, {}, {
            onSuccess: () => markAsRead(notificationId)
        });
    };

    const markAllAsRead = () => {
        router.post('/notifications/mark-all-read', {}, { preserveScroll: true });
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
            case 'alert': return <ShieldAlert className="w-5 h-5 text-red-400" />;
            case 'info':
            default: return <Clock className="w-5 h-5 text-[var(--color-gold)]" />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'success': return 'bg-emerald-500/10';
            case 'alert': return 'bg-red-500/10';
            case 'info':
            default: return 'bg-[var(--color-gold-bg)]';
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[var(--color-bg-base)] text-[var(--color-text-main)] font-sans antialiased selection:bg-[var(--color-gold)] selection:text-white transition-colors duration-0">
            <Head title="Notifications - Oscorp" />
            
            <Sidebar active="notifications" />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                <Topbar />

                <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto custom-scrollbar">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Link href="/dashboard" className="p-2 rounded-xl hover:bg-[var(--color-bg-elevated)] transition-colors text-[var(--color-text-muted)] hover:text-white">
                                    <ArrowLeft className="w-5 h-5" />
                                </Link>
                                <h1 className="text-2xl font-bold tracking-wide" style={{ color: 'var(--color-text-main)' }}>Communication Array</h1>
                            </div>
                            <p className="text-[13px] text-[var(--color-text-muted)] ml-12">
                                Encrypted log of all system and account events.
                            </p>
                        </div>

                        <button 
                            onClick={markAllAsRead}
                            className="px-4 py-2 rounded-xl text-[13px] font-semibold text-[var(--color-gold)] border border-[var(--color-gold)]/30 hover:bg-[var(--color-gold-bg)] transition-colors flex items-center gap-2"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Acknowledge All
                        </button>
                    </div>

                    {/* Notifications List */}
                    <div className="space-y-4">
                        {notifications.data.length === 0 ? (
                            <div className="text-center py-16 p-8 rounded-2xl" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                <div className="w-16 h-16 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center mx-auto mb-4">
                                    <Bell className="w-8 h-8 text-[var(--color-text-muted)] opacity-50" />
                                </div>
                                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text-main)' }}>Log is empty</h3>
                                <p className="text-[13px] text-[var(--color-text-muted)]">No recent events detected by the system.</p>
                            </div>
                        ) : (
                            notifications.data.map((notification, index) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={notification.id} 
                                    className={`p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all relative overflow-hidden ${notification.read_at ? 'opacity-70' : 'shadow-[0_0_15px_rgba(212,175,55,0.05)]'}`}
                                    style={{ 
                                        background: 'var(--color-bg-card)', 
                                        border: `1px solid ${notification.read_at ? 'var(--color-border)' : 'rgba(212,175,55,0.3)'}` 
                                    }}
                                >
                                    {!notification.read_at && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-gold)] shadow-[0_0_10px_var(--color-gold)]" />
                                    )}
                                    
                                    <div className="flex items-start gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1 ${getBgColor(notification.data.type)}`}>
                                            {getIcon(notification.data.type)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-semibold" style={{ color: 'var(--color-text-main)' }}>
                                                    {notification.data.title}
                                                </h3>
                                                {!notification.read_at && (
                                                    <span className="px-2 py-0.5 rounded bg-[var(--color-gold)] text-black text-[9px] font-bold uppercase tracking-wider">New</span>
                                                )}
                                            </div>
                                            <p className="text-[13px] text-[var(--color-text-muted)] mb-2 break-words">
                                                {notification.data.message}
                                            </p>
                                            <div className="text-[11px] font-mono text-[var(--color-text-muted)] opacity-60">
                                                {new Date(notification.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {notification.data.action_type === 'contact_request' && !notification.read_at && (
                                            <>
                                                <button 
                                                    onClick={() => handleAccept(notification.data.contact_id, notification.id)}
                                                    className="shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-bold bg-[var(--color-gold)] text-black hover:brightness-110 transition-all self-start sm:self-center"
                                                >
                                                    Accept
                                                </button>
                                                <button 
                                                    onClick={() => handleDeny(notification.data.contact_id, notification.id)}
                                                    className="shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors self-start sm:self-center"
                                                >
                                                    Deny
                                                </button>
                                            </>
                                        )}

                                        {!notification.read_at && (
                                            <button 
                                                onClick={() => markAsRead(notification.id)}
                                                className="shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-medium border border-[var(--color-border)] hover:bg-[var(--color-bg-elevated)] transition-colors self-start sm:self-center"
                                            >
                                                {notification.data.action_type === 'contact_request' ? 'Ignore' : 'Mark Read'}
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Pagination Controls could go here if there are multiple pages */}
                    {notifications.last_page > 1 && (
                        <div className="flex justify-center mt-8 gap-2">
                            <div className="text-[12px] text-[var(--color-text-muted)] font-mono">
                                Page {notifications.current_page} of {notifications.last_page}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
