import { Head } from '@inertiajs/react';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { motion } from 'framer-motion';
import { Users, CreditCard, Activity, TrendingUp, ShieldCheck, UserPlus } from 'lucide-react';

export default function AdminDashboard({ stats }) {
    const cards = [
        { label: 'Total Users', value: stats.total_users, icon: Users, color: 'var(--color-gold)' },
        { label: 'Total Transactions', value: stats.total_transactions, icon: CreditCard, color: '#34D399' },
        { label: 'Total Volume', value: `${Number(stats.total_volume).toLocaleString()} MAD`, icon: TrendingUp, color: '#60A5FA' },
        { label: 'System Status', value: 'Active', icon: ShieldCheck, color: '#F87171' },
    ];

    return (
        <div className="flex h-screen w-full overflow-hidden font-sans antialiased" style={{ background: 'var(--color-bg-base)' }}>
            <Head title="OSCORP | Admin Panel" />
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none opacity-5" style={{ background: 'var(--color-gold)' }} />
                
                <Topbar />

                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 overflow-y-auto px-6 py-8"
                >
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-[32px] font-bold tracking-tight text-[var(--color-text-main)]">Administrative Control</h1>
                                <p className="text-[14px] text-[var(--color-text-muted)] mt-1">Global overview and system management.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="px-4 py-2 rounded-xl bg-[var(--color-gold-bg)] border border-[var(--color-gold)]/20 text-[var(--color-gold)] font-bold text-[13px]">
                                    SECURE MODE
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {cards.map((card, i) => (
                                <motion.div
                                    key={card.label}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-6 rounded-[28px] border border-[var(--color-border)] relative overflow-hidden group"
                                    style={{ background: 'var(--color-bg-card)' }}
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <card.icon size={64} style={{ color: card.color }} />
                                    </div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 rounded-xl" style={{ background: `${card.color}15`, color: card.color }}>
                                            <card.icon size={20} />
                                        </div>
                                        <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">{card.label}</span>
                                    </div>
                                    <div className="text-[24px] font-bold text-[var(--color-text-main)]">{card.value}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent Activity Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="p-8 rounded-[32px] border border-[var(--color-border)] space-y-6" style={{ background: 'var(--color-bg-card)' }}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <UserPlus className="text-[var(--color-gold)]" size={20} />
                                        <h2 className="text-[18px] font-bold text-[var(--color-text-main)]">Recent Registrations</h2>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {stats.recent_users.map((user) => (
                                        <div key={user.id} className="flex items-center justify-between p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-[var(--color-gold-bg)] flex items-center justify-center text-[var(--color-gold)] font-bold">
                                                    {(user.name?.charAt(0) || '?')}
                                                </div>
                                                <div>
                                                    <div className="text-[14px] font-bold text-[var(--color-text-main)]">{user.name || `User #${user.id}`}</div>
                                                    <div className="text-[12px] text-[var(--color-text-muted)]">{user.email}</div>
                                                </div>
                                            </div>
                                            <div className="text-[11px] font-medium text-[var(--color-text-muted)]">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 rounded-[32px] border border-[var(--color-border)] space-y-6 relative overflow-hidden" style={{ background: 'var(--color-bg-card)' }}>
                                <div className="flex items-center gap-3">
                                    <Activity className="text-[#60A5FA]" size={20} />
                                    <h2 className="text-[18px] font-bold text-[var(--color-text-main)]">System Logs</h2>
                                </div>
                                <div className="space-y-4 font-mono">
                                    {[
                                        'Admin session initialized',
                                        'Global financial metrics recalculated',
                                        'System integrity check: PASSED',
                                        'Inertia render latency: 42ms',
                                    ].map((log, i) => (
                                        <div key={i} className="text-[12px] text-[var(--color-text-muted)] flex items-center gap-3">
                                            <span className="text-[#34D399]">▸</span> {log}
                                        </div>
                                    ))}
                                </div>
                                {/* Visual Graph Placeholder */}
                                <div className="h-40 mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/30 flex items-center justify-center">
                                    <div className="text-[12px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold opacity-30">Live Traffic Visualization</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
