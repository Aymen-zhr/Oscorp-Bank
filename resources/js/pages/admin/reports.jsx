import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Users,
    DollarSign,
    TrendingUp,
    Landmark,
    Activity,
    BarChart3,
    Crown,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminReports({
    systemStats,
    userGrowth,
    revenueByMonth,
    topUsers,
}) {
    const statCards = [
        {
            label: 'Total Users',
            value: systemStats.total_users?.toLocaleString(),
            icon: Users,
            color: 'var(--color-gold)',
            bg: 'var(--color-gold-bg)',
        },
        {
            label: 'Active (7d)',
            value: systemStats.active_users_7d?.toLocaleString(),
            icon: Activity,
            color: '#10b981',
            bg: 'rgba(16,185,129,0.1)',
        },
        {
            label: 'Transaction Volume',
            value: `${Number(systemStats.total_transaction_volume).toLocaleString()} MAD`,
            icon: DollarSign,
            color: '#3b82f6',
            bg: 'rgba(59,130,246,0.1)',
        },
        {
            label: 'Active Loan Value',
            value: `${Number(systemStats.total_loan_volume).toLocaleString()} MAD`,
            icon: Landmark,
            color: '#f59e0b',
            bg: 'rgba(245,158,11,0.1)',
        },
    ];

    const maxGrowth = Math.max(...userGrowth.map((d) => d.count), 1);
    const maxRevenue = Math.max(
        ...revenueByMonth.map((m) => Number(m.total)),
        1,
    );

    return (
        <>
            <Head title="Admin - Reports" />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.75rem',
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: '1.625rem',
                            fontWeight: 700,
                            color: 'var(--color-text-main)',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Reports
                    </h1>
                    <p
                        style={{
                            marginTop: '0.25rem',
                            fontSize: '0.875rem',
                            color: 'var(--color-text-muted)',
                        }}
                    >
                        System analytics and performance insights
                    </p>
                </div>

                {/* Stats */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(190px, 1fr))',
                        gap: '0.875rem',
                    }}
                >
                    {statCards.map((card, i) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            style={{
                                background: 'var(--color-bg-card)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '1rem',
                                padding: '1.25rem',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '0 1rem 0 60px',
                                    background: card.bg,
                                    opacity: 0.5,
                                }}
                            />
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '2.25rem',
                                    height: '2.25rem',
                                    borderRadius: '0.625rem',
                                    background: card.bg,
                                    marginBottom: '0.875rem',
                                }}
                            >
                                <card.icon
                                    style={{
                                        width: '1.125rem',
                                        height: '1.125rem',
                                        color: card.color,
                                    }}
                                />
                            </div>
                            <div
                                style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    color: 'var(--color-text-main)',
                                    lineHeight: 1,
                                }}
                            >
                                {card.value}
                            </div>
                            <div
                                style={{
                                    marginTop: '0.25rem',
                                    fontSize: '0.75rem',
                                    color: 'var(--color-text-muted)',
                                }}
                            >
                                {card.label}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Charts */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '1.25rem',
                    }}
                >
                    {/* User Growth */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.32 }}
                        style={{
                            background: 'var(--color-bg-card)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '1rem',
                            padding: '1.25rem',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '1.25rem',
                            }}
                        >
                            <BarChart3
                                style={{
                                    width: '1rem',
                                    height: '1rem',
                                    color: 'var(--color-gold)',
                                }}
                            />
                            <span
                                style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: 'var(--color-text-main)',
                                }}
                            >
                                User Growth (30 Days)
                            </span>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'flex-end',
                                gap: '2px',
                                height: '120px',
                            }}
                        >
                            {userGrowth.map((day, i) => {
                                const height = Math.max(
                                    (day.count / maxGrowth) * 100,
                                    2,
                                );
                                return (
                                    <div
                                        key={i}
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                            height: '100%',
                                        }}
                                        title={`${day.count} users on ${day.date}`}
                                    >
                                        <div
                                            style={{
                                                width: '100%',
                                                borderRadius: '2px 2px 0 0',
                                                background:
                                                    day.count > 0
                                                        ? 'var(--color-gold)'
                                                        : 'var(--color-bg-elevated)',
                                                opacity:
                                                    day.count > 0 ? 0.7 : 0.3,
                                                height: `${height}%`,
                                                transition: 'opacity 0.15s',
                                                cursor: 'pointer',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.opacity =
                                                    '1';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.opacity =
                                                    day.count > 0
                                                        ? '0.7'
                                                        : '0.3';
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: '0.5rem',
                                fontSize: '0.6875rem',
                                color: 'var(--color-text-muted)',
                            }}
                        >
                            <span>30 days ago</span>
                            <span>Today</span>
                        </div>
                    </motion.div>

                    {/* Revenue by Month */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        style={{
                            background: 'var(--color-bg-card)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '1rem',
                            padding: '1.25rem',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '1.25rem',
                            }}
                        >
                            <TrendingUp
                                style={{
                                    width: '1rem',
                                    height: '1rem',
                                    color: '#10b981',
                                }}
                            />
                            <span
                                style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: 'var(--color-text-main)',
                                }}
                            >
                                Revenue by Month
                            </span>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'flex-end',
                                gap: '6px',
                                height: '120px',
                            }}
                        >
                            {revenueByMonth.map((month, i) => {
                                const height = Math.max(
                                    (Number(month.total) / maxRevenue) * 100,
                                    2,
                                );
                                return (
                                    <div
                                        key={i}
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                            height: '100%',
                                            gap: '4px',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '100%',
                                                borderRadius: '3px 3px 0 0',
                                                background: '#10b981',
                                                opacity: 0.65,
                                                height: `${height}%`,
                                                transition: 'opacity 0.15s',
                                                cursor: 'pointer',
                                            }}
                                            title={`${month.total} MAD in ${month.month}`}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.opacity =
                                                    '1';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.opacity =
                                                    '0.65';
                                            }}
                                        />
                                        <span
                                            style={{
                                                fontSize: '0.5625rem',
                                                color: 'var(--color-text-muted)',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {month.month?.substring(5)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>

                {/* Top Users */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{
                        background: 'var(--color-bg-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '1rem',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '1rem 1.25rem',
                            borderBottom: '1px solid var(--color-border)',
                        }}
                    >
                        <Crown
                            style={{
                                width: '1rem',
                                height: '1rem',
                                color: 'var(--color-gold)',
                            }}
                        />
                        <span
                            style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: 'var(--color-text-main)',
                            }}
                        >
                            Top Users by Transactions
                        </span>
                    </div>
                    <div
                        style={{
                            padding: '0.75rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.375rem',
                        }}
                    >
                        {topUsers.map((user, i) => {
                            const maxTx = topUsers[0]?.transaction_count || 1;
                            const barWidth =
                                (user.transaction_count / maxTx) * 100;
                            const medals = ['🥇', '🥈', '🥉'];
                            return (
                                <div
                                    key={user.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.875rem',
                                        padding: '0.75rem',
                                        borderRadius: '0.75rem',
                                        background:
                                            i < 3
                                                ? 'var(--color-bg-elevated)'
                                                : 'transparent',
                                        transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background =
                                            'var(--color-bg-elevated)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background =
                                            i < 3
                                                ? 'var(--color-bg-elevated)'
                                                : 'transparent';
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '2rem',
                                            textAlign: 'center',
                                            fontSize:
                                                i < 3 ? '1rem' : '0.75rem',
                                            fontWeight: 700,
                                            color: 'var(--color-text-muted)',
                                            flexShrink: 0,
                                        }}
                                    >
                                        {i < 3 ? medals[i] : i + 1}
                                    </div>
                                    <div
                                        style={{
                                            width: '2rem',
                                            height: '2rem',
                                            borderRadius: '50%',
                                            background: 'var(--color-gold-bg)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            color: 'var(--color-gold)',
                                            flexShrink: 0,
                                        }}
                                    >
                                        {(user.name?.charAt(0) || '?').toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div
                                            style={{
                                                fontSize: '0.8125rem',
                                                fontWeight: 600,
                                                color: 'var(--color-text-main)',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {user.name || `User #${user.id}`}
                                        </div>
                                        <div
                                            style={{
                                                marginTop: '0.25rem',
                                                height: '3px',
                                                borderRadius: '100px',
                                                background:
                                                    'var(--color-bg-base)',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    height: '100%',
                                                    width: `${barWidth}%`,
                                                    background:
                                                        'var(--color-gold)',
                                                    borderRadius: '100px',
                                                    transition:
                                                        'width 0.5s ease',
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '0.875rem',
                                            fontWeight: 700,
                                            color: 'var(--color-gold)',
                                            flexShrink: 0,
                                        }}
                                    >
                                        {user.transaction_count}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </>
    );
}

AdminReports.layout = (page) => (
    <AdminLayout children={page} active="reports" />
);
