import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    DollarSign,
    Calendar,
    CreditCard,
    Tag,
    FileText,
    Check,
    Mail,
    User,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

function StatusBadge({ status }) {
    const colors = {
        completed: {
            bg: 'rgba(16,185,129,0.15)',
            color: '#10b981',
            label: 'Completed',
        },
        pending: {
            bg: 'rgba(245,158,11,0.15)',
            color: '#f59e0b',
            label: 'Pending',
        },
        failed: {
            bg: 'rgba(239,68,68,0.15)',
            color: '#ef4444',
            label: 'Failed',
        },
    };
    const c = colors[status] || colors.pending;
    return (
        <span
            style={{
                padding: '0.35rem 0.875rem',
                borderRadius: '100px',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: c.bg,
                color: c.color,
            }}
        >
            {c.label}
        </span>
    );
}

function MetricCard({ label, value, icon: Icon }) {
    return (
        <div
            style={{
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '0.875rem',
                padding: '1rem',
            }}
        >
            <Icon
                style={{
                    width: '1rem',
                    height: '1rem',
                    color: 'var(--color-gold)',
                    marginBottom: '0.5rem',
                }}
            />
            <div
                style={{
                    fontSize: '0.6875rem',
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '0.25rem',
                }}
            >
                {label}
            </div>
            <div
                style={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: 'var(--color-text-main)',
                }}
            >
                {value}
            </div>
        </div>
    );
}

export default function AdminTransactionDetail({ transaction }) {
    const { data, setData, patch, processing } = useForm({
        status: transaction.status,
        note: transaction.note || '',
    });

    const handleUpdate = (e) => {
        e.preventDefault();
        patch(`/admin/transactions/${transaction.id}/status`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title={`Admin - Transaction #${transaction.id}`} />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        flexWrap: 'wrap',
                    }}
                >
                    <Link
                        href="/admin/transactions"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '2.25rem',
                            height: '2.25rem',
                            borderRadius: '0.625rem',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-muted)',
                            textDecoration: 'none',
                            transition: 'all 0.15s',
                            flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor =
                                'var(--color-gold)';
                            e.currentTarget.style.color = 'var(--color-gold)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor =
                                'var(--color-border)';
                            e.currentTarget.style.color =
                                'var(--color-text-muted)';
                        }}
                    >
                        <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
                    </Link>
                    <div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                            }}
                        >
                            <h1
                                style={{
                                    fontSize: '1.375rem',
                                    fontWeight: 700,
                                    color: 'var(--color-text-main)',
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                {transaction.merchant}
                            </h1>
                            <StatusBadge status={transaction.status} />
                        </div>
                        <p
                            style={{
                                fontSize: '0.8125rem',
                                color: 'var(--color-text-muted)',
                                marginTop: '0.125rem',
                            }}
                        >
                            Transaction #{transaction.id} ·{' '}
                            {transaction.transacted_at}
                        </p>
                    </div>
                </div>

                {/* Metric Cards */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(160px, 1fr))',
                        gap: '0.875rem',
                    }}
                >
                    <MetricCard
                        label="Amount"
                        value={`${Number(transaction.amount).toLocaleString()} MAD`}
                        icon={DollarSign}
                    />
                    <MetricCard
                        label="Type"
                        value={transaction.type?.toUpperCase()}
                        icon={CreditCard}
                    />
                    <MetricCard
                        label="Date"
                        value={transaction.transacted_at}
                        icon={Calendar}
                    />
                    <MetricCard
                        label="Card"
                        value={
                            transaction.card_last4
                                ? `**** ${transaction.card_last4}`
                                : 'N/A'
                        }
                        icon={CreditCard}
                    />
                </div>

                {/* Main Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0,1fr) 280px',
                        gap: '1.25rem',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}
                    >
                        {/* Update Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
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
                                    padding: '0.875rem 1.125rem',
                                    borderBottom:
                                        '1px solid var(--color-border)',
                                }}
                            >
                                <FileText
                                    style={{
                                        width: '0.875rem',
                                        height: '0.875rem',
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
                                    Update Transaction
                                </span>
                            </div>
                            <form
                                onSubmit={handleUpdate}
                                style={{
                                    padding: '1.125rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                }}
                            >
                                <div>
                                    <label
                                        style={{
                                            display: 'block',
                                            marginBottom: '0.375rem',
                                            fontSize: '0.6875rem',
                                            fontWeight: 700,
                                            color: 'var(--color-text-muted)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em',
                                        }}
                                    >
                                        Status
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) =>
                                            setData('status', e.target.value)
                                        }
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem 0.875rem',
                                            borderRadius: '0.625rem',
                                            border: '1px solid var(--color-border)',
                                            background: 'var(--color-bg-base)',
                                            color: 'var(--color-text-main)',
                                            fontSize: '0.875rem',
                                            outline: 'none',
                                        }}
                                    >
                                        <option value="completed">
                                            Completed
                                        </option>
                                        <option value="pending">Pending</option>
                                        <option value="failed">Failed</option>
                                    </select>
                                </div>
                                <div>
                                    <label
                                        style={{
                                            display: 'block',
                                            marginBottom: '0.375rem',
                                            fontSize: '0.6875rem',
                                            fontWeight: 700,
                                            color: 'var(--color-text-muted)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em',
                                        }}
                                    >
                                        Note
                                    </label>
                                    <textarea
                                        value={data.note}
                                        onChange={(e) =>
                                            setData('note', e.target.value)
                                        }
                                        rows={3}
                                        placeholder="Add a note about this transaction..."
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.625rem',
                                            border: '1px solid var(--color-border)',
                                            background: 'var(--color-bg-base)',
                                            color: 'var(--color-text-main)',
                                            fontSize: '0.875rem',
                                            outline: 'none',
                                            resize: 'none',
                                            boxSizing: 'border-box',
                                            transition: 'border-color 0.15s',
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor =
                                                'var(--color-gold)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor =
                                                'var(--color-border)';
                                        }}
                                    />
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.625rem 1.25rem',
                                            borderRadius: '0.75rem',
                                            background: 'var(--color-gold)',
                                            color: '#000',
                                            fontWeight: 700,
                                            fontSize: '0.875rem',
                                            border: 'none',
                                            cursor: processing
                                                ? 'not-allowed'
                                                : 'pointer',
                                            opacity: processing ? 0.7 : 1,
                                            transition: 'opacity 0.15s',
                                        }}
                                    >
                                        <Check
                                            style={{
                                                width: '0.875rem',
                                                height: '0.875rem',
                                            }}
                                        />
                                        {processing
                                            ? 'Updating...'
                                            : 'Update Transaction'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>

                        {/* Details */}
                        {(transaction.note ||
                            transaction.source ||
                            transaction.category) && (
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.08 }}
                                style={{
                                    background: 'var(--color-bg-card)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '1rem',
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        padding: '0.875rem 1.125rem',
                                        borderBottom:
                                            '1px solid var(--color-border)',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        color: 'var(--color-text-main)',
                                    }}
                                >
                                    Details
                                </div>
                                <div
                                    style={{
                                        padding: '1rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.5rem',
                                    }}
                                >
                                    {transaction.category && (
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                fontSize: '0.875rem',
                                            }}
                                        >
                                            <Tag
                                                style={{
                                                    width: '0.875rem',
                                                    height: '0.875rem',
                                                    color: 'var(--color-gold)',
                                                }}
                                            />
                                            <span
                                                style={{
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                Category:
                                            </span>
                                            <span
                                                style={{
                                                    color: 'var(--color-text-main)',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {transaction.category}
                                            </span>
                                        </div>
                                    )}
                                    {transaction.source && (
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                fontSize: '0.875rem',
                                            }}
                                        >
                                            <Tag
                                                style={{
                                                    width: '0.875rem',
                                                    height: '0.875rem',
                                                    color: 'var(--color-gold)',
                                                }}
                                            />
                                            <span
                                                style={{
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                Source:
                                            </span>
                                            <span
                                                style={{
                                                    color: 'var(--color-text-main)',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {transaction.source}
                                            </span>
                                        </div>
                                    )}
                                    {transaction.note && (
                                        <div
                                            style={{
                                                padding: '0.875rem',
                                                borderRadius: '0.625rem',
                                                background:
                                                    'var(--color-bg-base)',
                                                marginTop: '0.25rem',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: '0.6875rem',
                                                    color: 'var(--color-text-muted)',
                                                    marginBottom: '0.375rem',
                                                }}
                                            >
                                                Note
                                            </div>
                                            <p
                                                style={{
                                                    fontSize: '0.875rem',
                                                    color: 'var(--color-text-main)',
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                {transaction.note}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}
                    >
                        {/* User */}
                        {transaction.user && (
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                style={{
                                    background: 'var(--color-bg-card)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '1rem',
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        padding: '0.875rem 1rem',
                                        borderBottom:
                                            '1px solid var(--color-border)',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        color: 'var(--color-text-main)',
                                    }}
                                >
                                    User
                                </div>
                                <div style={{ padding: '0.875rem' }}>
                                    <Link
                                        href={`/admin/users/${transaction.user.id}`}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.875rem',
                                            borderRadius: '0.75rem',
                                            background: 'var(--color-bg-base)',
                                            textDecoration: 'none',
                                            marginBottom: '0.75rem',
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background =
                                                'var(--color-bg-elevated)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background =
                                                'var(--color-bg-base)';
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '2.5rem',
                                                height: '2.5rem',
                                                borderRadius: '50%',
                                                background:
                                                    'var(--color-gold-bg)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1rem',
                                                fontWeight: 700,
                                                color: 'var(--color-gold)',
                                                flexShrink: 0,
                                            }}
                                        >
                                            {transaction.user.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                    color: 'var(--color-text-main)',
                                                }}
                                            >
                                                {transaction.user.name}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: '0.75rem',
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                {transaction.user.tag}
                                            </div>
                                        </div>
                                    </Link>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.5rem 0.625rem',
                                            borderRadius: '0.5rem',
                                            background: 'var(--color-bg-base)',
                                            fontSize: '0.8125rem',
                                        }}
                                    >
                                        <Mail
                                            style={{
                                                width: '0.875rem',
                                                height: '0.875rem',
                                                color: 'var(--color-text-muted)',
                                                flexShrink: 0,
                                            }}
                                        />
                                        <span
                                            style={{
                                                color: 'var(--color-text-muted)',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {transaction.user.email}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Meta */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.14 }}
                            style={{
                                background: 'var(--color-bg-card)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '1rem',
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                style={{
                                    padding: '0.875rem 1rem',
                                    borderBottom:
                                        '1px solid var(--color-border)',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: 'var(--color-text-main)',
                                }}
                            >
                                Meta
                            </div>
                            <div
                                style={{
                                    padding: '0.875rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.375rem',
                                }}
                            >
                                {[
                                    {
                                        label: 'Category',
                                        value: transaction.category || '—',
                                    },
                                    {
                                        label: 'Created',
                                        value: transaction.created_at,
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            padding: '0.5rem 0.625rem',
                                            borderRadius: '0.5rem',
                                            background: 'var(--color-bg-base)',
                                            fontSize: '0.8125rem',
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: 'var(--color-text-muted)',
                                            }}
                                        >
                                            {item.label}
                                        </span>
                                        <span
                                            style={{
                                                color: 'var(--color-text-main)',
                                                fontWeight: 500,
                                            }}
                                        >
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminTransactionDetail.layout = (page) => (
    <AdminLayout children={page} active="transactions" />
);
