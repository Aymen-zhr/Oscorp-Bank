import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Users,
    Landmark,
    Clock,
    TrendingUp,
    ChevronRight,
    UserPlus,
    AlertCircle,
    CheckCircle2,
    Shield,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

function StatCard({ label, value, icon: Icon, color, bg, delay = 0, sub }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.3 }}
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
                    width: '80px',
                    height: '80px',
                    borderRadius: '0 1rem 0 80px',
                    background: bg,
                    opacity: 0.35,
                }}
            />
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.875rem',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '2.25rem',
                        height: '2.25rem',
                        borderRadius: '0.625rem',
                        background: bg,
                    }}
                >
                    <Icon
                        style={{ width: '1.125rem', height: '1.125rem', color }}
                    />
                </div>
            </div>
            <div
                style={{
                    fontSize: '1.625rem',
                    fontWeight: 700,
                    color: 'var(--color-text-main)',
                    lineHeight: 1,
                }}
            >
                {value}
            </div>
            <div
                style={{
                    marginTop: '0.25rem',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                }}
            >
                {label}
            </div>
            {sub && (
                <div
                    style={{
                        marginTop: '0.5rem',
                        fontSize: '0.6875rem',
                        color,
                        fontWeight: 600,
                    }}
                >
                    {sub}
                </div>
            )}
        </motion.div>
    );
}

function LoanStatusBadge({ status }) {
    const map = {
        pending: {
            bg: 'rgba(245,158,11,0.12)',
            color: '#f59e0b',
            label: 'Pending',
        },
        active: {
            bg: 'rgba(59,130,246,0.12)',
            color: '#3b82f6',
            label: 'Active',
        },
        approved: {
            bg: 'rgba(16,185,129,0.12)',
            color: '#10b981',
            label: 'Approved',
        },
        rejected: {
            bg: 'rgba(239,68,68,0.12)',
            color: '#ef4444',
            label: 'Rejected',
        },
        completed: {
            bg: 'rgba(16,185,129,0.12)',
            color: '#10b981',
            label: 'Completed',
        },
    };
    const c = map[status] || map.pending;
    return (
        <span
            style={{
                padding: '0.2rem 0.6rem',
                borderRadius: '100px',
                fontSize: '0.6875rem',
                fontWeight: 700,
                background: c.bg,
                color: c.color,
                textTransform: 'capitalize',
            }}
        >
            {c.label}
        </span>
    );
}

export default function AdminDashboard({ stats }) {
    const statCards = [
        {
            label: 'Total Users',
            value: stats.total_users.toLocaleString(),
            icon: Users,
            color: 'var(--color-gold)',
            bg: 'var(--color-gold-bg)',
            sub: 'Registered accounts',
        },
        {
            label: 'Pending Loans',
            value: stats.total_loans_pending,
            icon: Clock,
            color: '#f59e0b',
            bg: 'rgba(245,158,11,0.12)',
            sub: 'Awaiting review',
        },
        {
            label: 'Active Loans',
            value: stats.total_loans_active,
            icon: CheckCircle2,
            color: '#10b981',
            bg: 'rgba(16,185,129,0.12)',
            sub: 'Currently disbursed',
        },
        {
            label: 'Active Loan Value',
            value: `${Number(stats.total_loan_amount).toLocaleString()} MAD`,
            icon: TrendingUp,
            color: '#3b82f6',
            bg: 'rgba(59,130,246,0.12)',
            sub: 'Total capital deployed',
        },
    ];

    return (
        <>
            <Head title="Admin Dashboard" />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.75rem',
                }}
            >
                {/* Header */}
                <div>
                    <h1
                        style={{
                            fontSize: '1.625rem',
                            fontWeight: 700,
                            color: 'var(--color-text-main)',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Dashboard
                    </h1>
                    <p
                        style={{
                            marginTop: '0.25rem',
                            fontSize: '0.875rem',
                            color: 'var(--color-text-muted)',
                        }}
                    >
                        System overview and key metrics
                    </p>
                </div>

                {/* Stat Cards */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                    }}
                >
                    {statCards.map((card, i) => (
                        <StatCard key={card.label} {...card} delay={i * 0.07} />
                    ))}
                </div>

                {/* Tables Row */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '1.25rem',
                    }}
                >
                    {/* Recent Users */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.32 }}
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
                                justifyContent: 'space-between',
                                padding: '1rem 1.25rem',
                                borderBottom: '1px solid var(--color-border)',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}
                            >
                                <UserPlus
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
                                    Recent Users
                                </span>
                            </div>
                            <Link
                                href="/admin/users"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    fontSize: '0.75rem',
                                    color: 'var(--color-gold)',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                }}
                            >
                                View all{' '}
                                <ChevronRight
                                    style={{
                                        width: '0.875rem',
                                        height: '0.875rem',
                                    }}
                                />
                            </Link>
                        </div>
                        <div>
                            {stats.recent_users.length === 0 ? (
                                <div
                                    style={{
                                        padding: '2rem',
                                        textAlign: 'center',
                                        color: 'var(--color-text-muted)',
                                        fontSize: '0.875rem',
                                    }}
                                >
                                    No users yet
                                </div>
                            ) : (
                                stats.recent_users.map((user, i) => (
                                    <Link
                                        key={user.id}
                                        href={`/admin/users/${user.id}`}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem 1.25rem',
                                            borderBottom:
                                                i <
                                                stats.recent_users.length - 1
                                                    ? '1px solid var(--color-border)'
                                                    : 'none',
                                            textDecoration: 'none',
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background =
                                                'var(--color-bg-elevated)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background =
                                                'transparent';
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '2rem',
                                                height: '2rem',
                                                borderRadius: '50%',
                                                background:
                                                    'var(--color-gold-bg)',
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
                                                    fontSize: '0.75rem',
                                                    color: 'var(--color-text-muted)',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {user.email}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '0.6875rem',
                                                color: 'var(--color-text-muted)',
                                                flexShrink: 0,
                                            }}
                                        >
                                            {user.created_at}
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </motion.div>

                    {/* Recent Loans */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
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
                                justifyContent: 'space-between',
                                padding: '1rem 1.25rem',
                                borderBottom: '1px solid var(--color-border)',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}
                            >
                                <Landmark
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
                                    Recent Loans
                                </span>
                            </div>
                            <Link
                                href="/admin/loans"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    fontSize: '0.75rem',
                                    color: 'var(--color-gold)',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                }}
                            >
                                View all{' '}
                                <ChevronRight
                                    style={{
                                        width: '0.875rem',
                                        height: '0.875rem',
                                    }}
                                />
                            </Link>
                        </div>
                        <div>
                            {stats.recent_loans.length === 0 ? (
                                <div
                                    style={{
                                        padding: '2rem',
                                        textAlign: 'center',
                                        color: 'var(--color-text-muted)',
                                        fontSize: '0.875rem',
                                    }}
                                >
                                    No loans yet
                                </div>
                            ) : (
                                stats.recent_loans.map((loan, i) => (
                                    <Link
                                        key={loan.id}
                                        href={`/admin/loans/${loan.id}`}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem 1.25rem',
                                            borderBottom:
                                                i <
                                                stats.recent_loans.length - 1
                                                    ? '1px solid var(--color-border)'
                                                    : 'none',
                                            textDecoration: 'none',
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background =
                                                'var(--color-bg-elevated)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background =
                                                'transparent';
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '2rem',
                                                height: '2rem',
                                                borderRadius: '0.5rem',
                                                background:
                                                    'rgba(59,130,246,0.12)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <Landmark
                                                style={{
                                                    width: '0.875rem',
                                                    height: '0.875rem',
                                                    color: '#3b82f6',
                                                }}
                                            />
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
                                                {loan.user_name} — {loan.type}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: '0.6875rem',
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                {Number(
                                                    loan.amount,
                                                ).toLocaleString()}{' '}
                                                MAD
                                            </div>
                                        </div>
                                        <LoanStatusBadge status={loan.status} />
                                    </Link>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.48 }}
                    style={{
                        background: 'var(--color-bg-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '1rem',
                        padding: '1.25rem',
                    }}
                >
                    <div
                        style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: 'var(--color-text-main)',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}
                    >
                        <Shield
                            style={{
                                width: '1rem',
                                height: '1rem',
                                color: 'var(--color-gold)',
                            }}
                        />
                        Quick Actions
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.625rem',
                        }}
                    >
                        {[
                            {
                                label: 'Manage Users',
                                href: '/admin/users',
                                color: 'var(--color-gold)',
                                bg: 'var(--color-gold-bg)',
                            },
                            {
                                label: 'Review Loans',
                                href: '/admin/loans',
                                color: '#f59e0b',
                                bg: 'rgba(245,158,11,0.1)',
                            },
                            {
                                label: 'Transactions',
                                href: '/admin/transactions',
                                color: '#3b82f6',
                                bg: 'rgba(59,130,246,0.1)',
                            },
                            {
                                label: 'Reports',
                                href: '/admin/reports',
                                color: '#10b981',
                                bg: 'rgba(16,185,129,0.1)',
                            },
                        ].map((action) => (
                            <Link
                                key={action.label}
                                href={action.href}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '0.625rem',
                                    fontSize: '0.8125rem',
                                    fontWeight: 600,
                                    color: action.color,
                                    background: action.bg,
                                    textDecoration: 'none',
                                    transition: 'opacity 0.15s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.opacity = '0.8';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.opacity = '1';
                                }}
                            >
                                {action.label}
                                <ChevronRight
                                    style={{
                                        width: '0.75rem',
                                        height: '0.75rem',
                                    }}
                                />
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </div>
        </>
    );
}

AdminDashboard.layout = (page) => (
    <AdminLayout children={page} active="dashboard" />
);
