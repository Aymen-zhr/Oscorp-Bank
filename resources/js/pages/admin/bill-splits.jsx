import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import {
    Receipt,
    Users,
    CheckCircle2,
    Clock,
    TrendingUp,
    X,
    User,
    ChevronRight,
    Trash2,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

function BillStatusBadge({ status }) {
    const map = {
        active: {
            bg: 'rgba(59,130,246,0.12)',
            color: '#3b82f6',
            label: 'Active',
        },
        paid: { bg: 'rgba(16,185,129,0.12)', color: '#10b981', label: 'Paid' },
        cancelled: {
            bg: 'rgba(239,68,68,0.12)',
            color: '#ef4444',
            label: 'Cancelled',
        },
        pending: {
            bg: 'rgba(245,158,11,0.12)',
            color: '#f59e0b',
            label: 'Pending',
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

export default function AdminBillSplits({
    bills,
    stats,
    filters,
    selectedUser,
}) {
    const [userSearch, setUserSearch] = useState('');
    const [userResults, setUserResults] = useState([]);
    const [searchingUsers, setSearchingUsers] = useState(false);

    const searchUsers = useCallback(async (q) => {
        if (!q.trim()) {
            setUserResults([]);
            return;
        }
        setSearchingUsers(true);
        try {
            const res = await fetch(
                `/admin/bill-splits/search-users?q=${encodeURIComponent(q)}`,
            );
            setUserResults(await res.json());
        } catch {
            setUserResults([]);
        }
        setSearchingUsers(false);
    }, []);

    const selectUser = (user) => {
        router.get(
            '/admin/bill-splits',
            { user_id: user.id },
            { preserveState: true },
        );
        setUserResults([]);
        setUserSearch('');
    };

    const clearUser = () => {
        router.get('/admin/bill-splits', {}, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Delete this bill split?')) {
            router.delete(`/admin/bill-splits/${id}`, { preserveScroll: true });
        }
    };

    const statCards = [
        {
            label: 'Total Bills',
            value: stats.total_bills,
            icon: Receipt,
            color: 'var(--color-gold)',
            bg: 'var(--color-gold-bg)',
        },
        {
            label: 'Active',
            value: stats.active_bills,
            icon: Clock,
            color: '#3b82f6',
            bg: 'rgba(59,130,246,0.1)',
        },
        {
            label: 'Completed',
            value: stats.completed_bills,
            icon: CheckCircle2,
            color: '#10b981',
            bg: 'rgba(16,185,129,0.1)',
        },
        {
            label: 'Total Value',
            value: `${Number(stats.total_value).toLocaleString()} ${stats.currency}`,
            icon: TrendingUp,
            color: '#a78bfa',
            bg: 'rgba(167,139,250,0.1)',
        },
    ];

    return (
        <>
            <Head title="Admin - Bill Splits" />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
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
                        Bill Splits
                    </h1>
                    <p
                        style={{
                            marginTop: '0.25rem',
                            fontSize: '0.875rem',
                            color: 'var(--color-text-muted)',
                        }}
                    >
                        Manage user bill splits and group expenses
                    </p>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(160px, 1fr))',
                        gap: '0.875rem',
                    }}
                >
                    {statCards.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            style={{
                                background: 'var(--color-bg-card)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '0.875rem',
                                padding: '1rem 1.125rem',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '0.625rem',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '1.75rem',
                                        height: '1.75rem',
                                        borderRadius: '0.5rem',
                                        background: s.bg,
                                    }}
                                >
                                    <s.icon
                                        style={{
                                            width: '0.875rem',
                                            height: '0.875rem',
                                            color: s.color,
                                        }}
                                    />
                                </div>
                                <span
                                    style={{
                                        fontSize: '0.6875rem',
                                        color: 'var(--color-text-muted)',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.06em',
                                    }}
                                >
                                    {s.label}
                                </span>
                            </div>
                            <div
                                style={{
                                    fontSize: '1.375rem',
                                    fontWeight: 700,
                                    color: 'var(--color-text-main)',
                                }}
                            >
                                {s.value}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* User Picker */}
                <div
                    style={{
                        background: 'var(--color-bg-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '0.875rem',
                        padding: '1rem 1.25rem',
                    }}
                >
                    <div
                        style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: 'var(--color-text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            marginBottom: '0.625rem',
                        }}
                    >
                        Filter by User
                    </div>
                    {selectedUser ? (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                            }}
                        >
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
                                {(selectedUser.name?.charAt(0) || '?').toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        color: 'var(--color-text-main)',
                                    }}
                                >
                                    {selectedUser.name || `User #${selectedUser.id}`}
                                </div>
                                <div
                                    style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--color-text-muted)',
                                    }}
                                >
                                    {selectedUser.count} bills
                                </div>
                            </div>
                            <button
                                onClick={clearUser}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    fontSize: '0.75rem',
                                    color: '#ef4444',
                                    background: 'rgba(239,68,68,0.1)',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    padding: '0.375rem 0.625rem',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                }}
                            >
                                <X
                                    style={{
                                        width: '0.75rem',
                                        height: '0.75rem',
                                    }}
                                />{' '}
                                Clear
                            </button>
                        </div>
                    ) : (
                        <div style={{ position: 'relative' }}>
                            <User
                                style={{
                                    position: 'absolute',
                                    left: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '1rem',
                                    height: '1rem',
                                    color: 'var(--color-text-muted)',
                                }}
                            />
                            <input
                                type="text"
                                value={userSearch}
                                onChange={(e) => {
                                    setUserSearch(e.target.value);
                                    searchUsers(e.target.value);
                                }}
                                placeholder="Search user by name, email or tag..."
                                style={{
                                    width: '100%',
                                    padding:
                                        '0.625rem 0.75rem 0.625rem 2.25rem',
                                    borderRadius: '0.625rem',
                                    border: '1px solid var(--color-border)',
                                    background: 'var(--color-bg-base)',
                                    color: 'var(--color-text-main)',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                            />
                            {(userResults.length > 0 || searchingUsers) && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: 'calc(100% + 4px)',
                                        left: 0,
                                        right: 0,
                                        background: 'var(--color-bg-card)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: '0.75rem',
                                        overflow: 'hidden',
                                        zIndex: 10,
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                    }}
                                >
                                    {searchingUsers ? (
                                        <div
                                            style={{
                                                padding: '1rem',
                                                textAlign: 'center',
                                                fontSize: '0.8125rem',
                                                color: 'var(--color-text-muted)',
                                            }}
                                        >
                                            Searching...
                                        </div>
                                    ) : (
                                        userResults.map((u) => (
                                            <button
                                                key={u.id}
                                                onClick={() => selectUser(u)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    width: '100%',
                                                    padding: '0.625rem 1rem',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background =
                                                        'var(--color-bg-elevated)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background =
                                                        'none';
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: '1.75rem',
                                                        height: '1.75rem',
                                                        borderRadius: '50%',
                                                        background:
                                                            'var(--color-gold-bg)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                        fontSize: '0.6875rem',
                                                        fontWeight: 700,
                                                        color: 'var(--color-gold)',
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {u.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div>
                                                    <div
                                                        style={{
                                                            fontSize:
                                                                '0.8125rem',
                                                            fontWeight: 600,
                                                            color: 'var(--color-text-main)',
                                                        }}
                                                    >
                                                        {u.name}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize:
                                                                '0.6875rem',
                                                            color: 'var(--color-text-muted)',
                                                        }}
                                                    >
                                                        {u.tag} · {u.bill_count}{' '}
                                                        bills
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {selectedUser && bills ? (
                    <div
                        style={{
                            background: 'var(--color-bg-card)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '1rem',
                            overflow: 'hidden',
                        }}
                    >
                        <table
                            style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                            }}
                        >
                            <thead>
                                <tr
                                    style={{
                                        borderBottom:
                                            '1px solid var(--color-border)',
                                    }}
                                >
                                    {[
                                        'Title',
                                        'Total',
                                        'Participants',
                                        'Status',
                                        'Created',
                                        '',
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            style={{
                                                padding: '0.75rem 1rem',
                                                textAlign: 'left',
                                                fontSize: '0.6875rem',
                                                fontWeight: 700,
                                                color: 'var(--color-text-muted)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.08em',
                                            }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {bills.data?.map((bill, i) => (
                                    <tr
                                        key={bill.id}
                                        style={{
                                            borderBottom:
                                                i < bills.data.length - 1
                                                    ? '1px solid var(--color-border)'
                                                    : 'none',
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
                                        <td
                                            style={{
                                                padding: '0.75rem 1rem',
                                                fontSize: '0.8125rem',
                                                fontWeight: 600,
                                                color: 'var(--color-text-main)',
                                            }}
                                        >
                                            {bill.title || '—'}
                                        </td>
                                        <td
                                            style={{
                                                padding: '0.75rem 1rem',
                                                fontSize: '0.875rem',
                                                fontWeight: 700,
                                                color: 'var(--color-text-main)',
                                            }}
                                        >
                                            {Number(
                                                bill.total_amount,
                                            ).toLocaleString()}{' '}
                                            MAD
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem' }}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.375rem',
                                                }}
                                            >
                                                <Users
                                                    style={{
                                                        width: '0.875rem',
                                                        height: '0.875rem',
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                />
                                                <span
                                                    style={{
                                                        fontSize: '0.8125rem',
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    {bill.participants_count ||
                                                        '—'}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem' }}>
                                            <BillStatusBadge
                                                status={bill.status}
                                            />
                                        </td>
                                        <td
                                            style={{
                                                padding: '0.75rem 1rem',
                                                fontSize: '0.75rem',
                                                color: 'var(--color-text-muted)',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {bill.created_at}
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem' }}>
                                            <button
                                                onClick={() =>
                                                    handleDelete(bill.id)
                                                }
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '1.75rem',
                                                    height: '1.75rem',
                                                    borderRadius: '0.5rem',
                                                    color: 'var(--color-text-muted)',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.15s',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background =
                                                        'rgba(239,68,68,0.1)';
                                                    e.currentTarget.style.color =
                                                        '#ef4444';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background =
                                                        'none';
                                                    e.currentTarget.style.color =
                                                        'var(--color-text-muted)';
                                                }}
                                            >
                                                <Trash2
                                                    style={{
                                                        width: '0.875rem',
                                                        height: '0.875rem',
                                                    }}
                                                />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {bills.data?.length === 0 && (
                            <div
                                style={{
                                    padding: '3rem',
                                    textAlign: 'center',
                                    color: 'var(--color-text-muted)',
                                    fontSize: '0.875rem',
                                }}
                            >
                                No bill splits found
                            </div>
                        )}
                    </div>
                ) : (
                    <div
                        style={{
                            background: 'var(--color-bg-card)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '1rem',
                            padding: '3rem',
                            textAlign: 'center',
                        }}
                    >
                        <Receipt
                            style={{
                                width: '2.5rem',
                                height: '2.5rem',
                                color: 'var(--color-text-muted)',
                                opacity: 0.3,
                                margin: '0 auto 0.75rem',
                            }}
                        />
                        <p
                            style={{
                                color: 'var(--color-text-muted)',
                                fontSize: '0.875rem',
                            }}
                        >
                            Search for a user above to view their bill splits
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

AdminBillSplits.layout = (page) => (
    <AdminLayout children={page} active="bill-splits" />
);
