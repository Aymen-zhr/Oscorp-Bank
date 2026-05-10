import { Head, Link, router, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import {
    Search,
    DollarSign,
    Activity,
    Clock,
    AlertCircle,
    ChevronRight,
    X,
    User,
    Filter,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

function StatusBadge({ status }) {
    const map = {
        completed: {
            bg: 'rgba(16,185,129,0.12)',
            color: '#10b981',
            label: 'Completed',
        },
        pending: {
            bg: 'rgba(245,158,11,0.12)',
            color: '#f59e0b',
            label: 'Pending',
        },
        failed: {
            bg: 'rgba(239,68,68,0.12)',
            color: '#ef4444',
            label: 'Failed',
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

function TypeBadge({ type }) {
    const colors = {
        credit: '#10b981',
        debit: '#ef4444',
        transfer: '#3b82f6',
    };
    return (
        <span
            style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: colors[type] || 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
            }}
        >
            {type}
        </span>
    );
}

export default function AdminTransactions({
    transactions,
    stats,
    filters,
    selectedUser,
}) {
    const { data, setData, get } = useForm({
        search: filters?.search || '',
        status: filters?.status || '',
        type: filters?.type || '',
        user_id: filters?.user_id || '',
    });

    const [userSearch, setUserSearch] = useState('');
    const [userResults, setUserResults] = useState([]);
    const [searchingUsers, setSearchingUsers] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        get('/admin/transactions', {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const searchUsers = useCallback(async (q) => {
        if (!q.trim()) {
            setUserResults([]);
            return;
        }
        setSearchingUsers(true);
        try {
            const res = await fetch(
                `/admin/transactions/search-users?q=${encodeURIComponent(q)}`,
            );
            const data = await res.json();
            setUserResults(data);
        } catch {
            setUserResults([]);
        }
        setSearchingUsers(false);
    }, []);

    const selectUser = (user) => {
        router.get(
            '/admin/transactions',
            { user_id: user.id },
            { preserveState: true },
        );
        setUserResults([]);
        setUserSearch('');
    };

    const clearUser = () => {
        router.get('/admin/transactions', {}, { preserveState: true });
    };

    const statCards = [
        {
            label: 'Total',
            value: stats.total?.toLocaleString(),
            icon: DollarSign,
            color: 'var(--color-gold)',
            bg: 'var(--color-gold-bg)',
        },
        {
            label: 'Today',
            value: stats.today_count?.toLocaleString(),
            icon: Activity,
            color: '#10b981',
            bg: 'rgba(16,185,129,0.1)',
        },
        {
            label: 'Pending',
            value: stats.pending,
            icon: Clock,
            color: '#f59e0b',
            bg: 'rgba(245,158,11,0.1)',
        },
        {
            label: 'Failed',
            value: stats.failed,
            icon: AlertCircle,
            color: '#ef4444',
            bg: 'rgba(239,68,68,0.1)',
        },
    ];

    return (
        <>
            <Head title="Admin - Transactions" />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
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
                        Transactions
                    </h1>
                    <p
                        style={{
                            marginTop: '0.25rem',
                            fontSize: '0.875rem',
                            color: 'var(--color-text-muted)',
                        }}
                    >
                        Monitor and manage all system transactions
                    </p>
                </div>

                {/* Stats */}
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
                                    fontSize: '1.5rem',
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
                                {selectedUser.name.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        color: 'var(--color-text-main)',
                                    }}
                                >
                                    {selectedUser.name}
                                </div>
                                <div
                                    style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--color-text-muted)',
                                    }}
                                >
                                    {selectedUser.count} transactions
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
                                                    transition:
                                                        'background 0.15s',
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
                                                <div
                                                    style={{
                                                        flex: 1,
                                                        minWidth: 0,
                                                    }}
                                                >
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
                                                        {u.email} ·{' '}
                                                        {u.transaction_count}{' '}
                                                        txns
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

                {/* Filters & Search */}
                {selectedUser && (
                    <form
                        onSubmit={handleSearch}
                        style={{
                            display: 'flex',
                            gap: '0.75rem',
                            flexWrap: 'wrap',
                        }}
                    >
                        <div
                            style={{
                                position: 'relative',
                                flex: '1',
                                minWidth: '200px',
                            }}
                        >
                            <Search
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
                                value={data.search}
                                onChange={(e) =>
                                    setData('search', e.target.value)
                                }
                                placeholder="Search merchant..."
                                style={{
                                    width: '100%',
                                    padding:
                                        '0.625rem 0.75rem 0.625rem 2.25rem',
                                    borderRadius: '0.625rem',
                                    border: '1px solid var(--color-border)',
                                    background: 'var(--color-bg-card)',
                                    color: 'var(--color-text-main)',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            style={{
                                padding: '0.625rem 0.75rem',
                                borderRadius: '0.625rem',
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-bg-card)',
                                color: 'var(--color-text-main)',
                                fontSize: '0.875rem',
                                outline: 'none',
                            }}
                        >
                            <option value="">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                        <select
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            style={{
                                padding: '0.625rem 0.75rem',
                                borderRadius: '0.625rem',
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-bg-card)',
                                color: 'var(--color-text-main)',
                                fontSize: '0.875rem',
                                outline: 'none',
                            }}
                        >
                            <option value="">All Types</option>
                            <option value="credit">Credit</option>
                            <option value="debit">Debit</option>
                            <option value="transfer">Transfer</option>
                        </select>
                        <button
                            type="submit"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                padding: '0.625rem 1rem',
                                borderRadius: '0.625rem',
                                background: 'var(--color-gold-bg)',
                                color: 'var(--color-gold)',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                            }}
                        >
                            <Filter
                                style={{
                                    width: '0.875rem',
                                    height: '0.875rem',
                                }}
                            />{' '}
                            Filter
                        </button>
                    </form>
                )}

                {/* Table */}
                {selectedUser && transactions ? (
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
                                        'Merchant',
                                        'Amount',
                                        'Type',
                                        'Status',
                                        'Date',
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
                                {transactions.data?.map((tx, i) => (
                                    <tr
                                        key={tx.id}
                                        style={{
                                            borderBottom:
                                                i < transactions.data.length - 1
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
                                        <td style={{ padding: '0.75rem 1rem' }}>
                                            <div
                                                style={{
                                                    fontSize: '0.8125rem',
                                                    fontWeight: 600,
                                                    color: 'var(--color-text-main)',
                                                }}
                                            >
                                                {tx.merchant || '—'}
                                            </div>
                                            {tx.category && (
                                                <div
                                                    style={{
                                                        fontSize: '0.6875rem',
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    {tx.category}
                                                </div>
                                            )}
                                        </td>
                                        <td
                                            style={{
                                                padding: '0.75rem 1rem',
                                                fontSize: '0.875rem',
                                                fontWeight: 700,
                                                color:
                                                    tx.type === 'credit'
                                                        ? '#10b981'
                                                        : 'var(--color-text-main)',
                                            }}
                                        >
                                            {tx.type === 'credit' ? '+' : '-'}
                                            {Number(
                                                tx.amount,
                                            ).toLocaleString()}{' '}
                                            MAD
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem' }}>
                                            <TypeBadge type={tx.type} />
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem' }}>
                                            <StatusBadge status={tx.status} />
                                        </td>
                                        <td
                                            style={{
                                                padding: '0.75rem 1rem',
                                                fontSize: '0.75rem',
                                                color: 'var(--color-text-muted)',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {tx.transacted_at}
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem' }}>
                                            <Link
                                                href={`/admin/transactions/${tx.id}`}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '1.75rem',
                                                    height: '1.75rem',
                                                    borderRadius: '0.5rem',
                                                    color: 'var(--color-text-muted)',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.15s',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background =
                                                        'var(--color-gold-bg)';
                                                    e.currentTarget.style.color =
                                                        'var(--color-gold)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background =
                                                        'transparent';
                                                    e.currentTarget.style.color =
                                                        'var(--color-text-muted)';
                                                }}
                                            >
                                                <ChevronRight
                                                    style={{
                                                        width: '1rem',
                                                        height: '1rem',
                                                    }}
                                                />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {transactions.data?.length === 0 && (
                            <div
                                style={{
                                    padding: '3rem',
                                    textAlign: 'center',
                                    color: 'var(--color-text-muted)',
                                    fontSize: '0.875rem',
                                }}
                            >
                                No transactions found
                            </div>
                        )}
                        {transactions.last_page > 1 && (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 1rem',
                                    borderTop: '1px solid var(--color-border)',
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--color-text-muted)',
                                    }}
                                >
                                    Showing {transactions.from}–
                                    {transactions.to} of {transactions.total}
                                </span>
                                <div
                                    style={{ display: 'flex', gap: '0.25rem' }}
                                >
                                    {transactions.links.map((link, i) =>
                                        link.url ? (
                                            <button
                                                key={i}
                                                onClick={() =>
                                                    router.get(
                                                        link.url,
                                                        {
                                                            search:
                                                                data.search ||
                                                                undefined,
                                                            status:
                                                                data.status ||
                                                                undefined,
                                                            type:
                                                                data.type ||
                                                                undefined,
                                                            user_id:
                                                                data.user_id ||
                                                                undefined,
                                                        },
                                                        {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                        },
                                                    )
                                                }
                                                style={{
                                                    padding: '0.25rem 0.625rem',
                                                    borderRadius: '0.5rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    background: link.active
                                                        ? 'var(--color-gold)'
                                                        : 'var(--color-bg-elevated)',
                                                    color: link.active
                                                        ? '#000'
                                                        : 'var(--color-text-muted)',
                                                }}
                                            >
                                                {link.label.includes('Previous')
                                                    ? '‹'
                                                    : link.label.includes(
                                                            'Next',
                                                        )
                                                      ? '›'
                                                      : link.label}
                                            </button>
                                        ) : null,
                                    )}
                                </div>
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
                        <DollarSign
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
                            Search for a user above to view their transactions
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

AdminTransactions.layout = (page) => (
    <AdminLayout children={page} active="transactions" />
);
