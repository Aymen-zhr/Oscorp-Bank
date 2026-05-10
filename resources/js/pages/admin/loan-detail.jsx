import { Head, Link, useForm, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    IdCard,
    Landmark,
    Calendar,
    DollarSign,
    Percent,
    Clock,
    Check,
    X,
    FileText,
    AlertCircle,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

function StatusBadge({ status }) {
    const colors = {
        pending: {
            bg: 'rgba(245,158,11,0.15)',
            color: '#f59e0b',
            label: 'Pending',
        },
        approved: {
            bg: 'rgba(16,185,129,0.15)',
            color: '#10b981',
            label: 'Approved',
        },
        rejected: {
            bg: 'rgba(239,68,68,0.15)',
            color: '#ef4444',
            label: 'Rejected',
        },
        active: {
            bg: 'rgba(59,130,246,0.15)',
            color: '#3b82f6',
            label: 'Active',
        },
        completed: {
            bg: 'rgba(16,185,129,0.15)',
            color: '#10b981',
            label: 'Completed',
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
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--color-text-main)',
                }}
            >
                {value}
            </div>
        </div>
    );
}

export default function AdminLoanDetail({ loan, flash }) {
    const { data, setData, post, processing } = useForm({
        admin_notes: loan.admin_notes || '',
    });

    const handleApprove = () => {
        router.post(
            `/admin/loans/${loan.id}/approve`,
            {},
            { preserveScroll: true },
        );
    };

    const handleReject = (e) => {
        e.preventDefault();
        post(`/admin/loans/${loan.id}/reject`, { preserveScroll: true });
    };

    return (
        <>
            <Head title={`Admin - Loan #${loan.id}`} />
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
                        justifyContent: 'space-between',
                        gap: '1rem',
                        flexWrap: 'wrap',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                        }}
                    >
                        <Link
                            href="/admin/loans"
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
                                e.currentTarget.style.color =
                                    'var(--color-gold)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor =
                                    'var(--color-border)';
                                e.currentTarget.style.color =
                                    'var(--color-text-muted)';
                            }}
                        >
                            <ArrowLeft
                                style={{ width: '1rem', height: '1rem' }}
                            />
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
                                    {loan.type}
                                </h1>
                                <StatusBadge status={loan.status} />
                            </div>
                            <p
                                style={{
                                    fontSize: '0.8125rem',
                                    color: 'var(--color-text-muted)',
                                    marginTop: '0.125rem',
                                }}
                            >
                                Loan #{loan.id} · Applied {loan.created_at}
                            </p>
                        </div>
                    </div>
                </div>

                {flash?.success && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            padding: '0.875rem 1rem',
                            borderRadius: '0.75rem',
                            background: 'rgba(16,185,129,0.1)',
                            border: '1px solid rgba(16,185,129,0.2)',
                            fontSize: '0.875rem',
                            color: '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}
                    >
                        <Check style={{ width: '1rem', height: '1rem' }} />{' '}
                        {flash.success}
                    </motion.div>
                )}

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
                        value={`${Number(loan.amount).toLocaleString()} ${stats?.currency || 'MAD'}`}
                        icon={DollarSign}
                    />
                    <MetricCard
                        label="Rate"
                        value={`${loan.rate}%`}
                        icon={Percent}
                    />
                    <MetricCard
                        label="Term"
                        value={`${loan.term_months} months`}
                        icon={Calendar}
                    />
                    <MetricCard
                        label="Monthly"
                        value={
                            loan.monthly_payment
                                ? `${Number(loan.monthly_payment).toLocaleString()} ${stats?.currency || 'MAD'}`
                                : 'TBD'
                        }
                        icon={Clock}
                    />
                </div>

                {/* Main Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1fr) 280px',
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
                        {/* Purpose */}
                        {loan.purpose && (
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
                                        Purpose
                                    </span>
                                </div>
                                <p
                                    style={{
                                        padding: '1rem 1.125rem',
                                        fontSize: '0.875rem',
                                        lineHeight: 1.6,
                                        color: 'var(--color-text-muted)',
                                    }}
                                >
                                    {loan.purpose}
                                </p>
                            </motion.div>
                        )}

                        {/* Review Decision */}
                        {loan.status === 'pending' && (
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.08 }}
                                style={{
                                    background: 'var(--color-bg-card)',
                                    border: '1px solid rgba(245,158,11,0.2)',
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
                                        background: 'rgba(245,158,11,0.05)',
                                    }}
                                >
                                    <AlertCircle
                                        style={{
                                            width: '0.875rem',
                                            height: '0.875rem',
                                            color: '#f59e0b',
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            color: 'var(--color-text-main)',
                                        }}
                                    >
                                        Review Decision
                                    </span>
                                </div>
                                <div
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
                                                color: 'var(--color-gold)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.1em',
                                            }}
                                        >
                                            Admin Notes
                                        </label>
                                        <textarea
                                            value={data.admin_notes}
                                            onChange={(e) =>
                                                setData(
                                                    'admin_notes',
                                                    e.target.value,
                                                )
                                            }
                                            rows={3}
                                            placeholder="Add notes about this decision..."
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '0.625rem',
                                                border: '1px solid var(--color-border)',
                                                background:
                                                    'var(--color-bg-base)',
                                                color: 'var(--color-text-main)',
                                                fontSize: '0.875rem',
                                                outline: 'none',
                                                resize: 'none',
                                                boxSizing: 'border-box',
                                                transition:
                                                    'border-color 0.15s',
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
                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '0.75rem',
                                        }}
                                    >
                                        <button
                                            onClick={handleApprove}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                padding: '0.875rem',
                                                borderRadius: '0.75rem',
                                                background:
                                                    'rgba(16,185,129,0.1)',
                                                color: '#10b981',
                                                border: '1px solid rgba(16,185,129,0.2)',
                                                cursor: 'pointer',
                                                fontSize: '0.875rem',
                                                fontWeight: 700,
                                                transition: 'background 0.15s',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background =
                                                    'rgba(16,185,129,0.2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background =
                                                    'rgba(16,185,129,0.1)';
                                            }}
                                        >
                                            <Check
                                                style={{
                                                    width: '1rem',
                                                    height: '1rem',
                                                }}
                                            />{' '}
                                            Approve
                                        </button>
                                        <button
                                            onClick={handleReject}
                                            disabled={processing}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                padding: '0.875rem',
                                                borderRadius: '0.75rem',
                                                background:
                                                    'rgba(239,68,68,0.1)',
                                                color: '#ef4444',
                                                border: '1px solid rgba(239,68,68,0.2)',
                                                cursor: processing
                                                    ? 'not-allowed'
                                                    : 'pointer',
                                                fontSize: '0.875rem',
                                                fontWeight: 700,
                                                opacity: processing ? 0.7 : 1,
                                                transition: 'background 0.15s',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!processing)
                                                    e.currentTarget.style.background =
                                                        'rgba(239,68,68,0.2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background =
                                                    'rgba(239,68,68,0.1)';
                                            }}
                                        >
                                            <X
                                                style={{
                                                    width: '1rem',
                                                    height: '1rem',
                                                }}
                                            />{' '}
                                            {processing
                                                ? 'Processing...'
                                                : 'Reject'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Review History */}
                        {(loan.admin_notes ||
                            loan.approved_at ||
                            loan.rejected_at) && (
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.12 }}
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
                                    Review History
                                </div>
                                <div
                                    style={{
                                        padding: '1rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.75rem',
                                    }}
                                >
                                    {loan.approved_at && (
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '0.75rem',
                                                padding: '0.875rem',
                                                borderRadius: '0.75rem',
                                                background:
                                                    'rgba(16,185,129,0.05)',
                                                border: '1px solid rgba(16,185,129,0.15)',
                                            }}
                                        >
                                            <Check
                                                style={{
                                                    width: '1rem',
                                                    height: '1rem',
                                                    color: '#10b981',
                                                    flexShrink: 0,
                                                    marginTop: '0.125rem',
                                                }}
                                            />
                                            <div>
                                                <div
                                                    style={{
                                                        fontSize: '0.875rem',
                                                        fontWeight: 600,
                                                        color: '#10b981',
                                                    }}
                                                >
                                                    Approved on{' '}
                                                    {loan.approved_at}
                                                </div>
                                                {loan.approved_by_name && (
                                                    <div
                                                        style={{
                                                            fontSize: '0.75rem',
                                                            color: '#10b981',
                                                            opacity: 0.7,
                                                        }}
                                                    >
                                                        By:{' '}
                                                        {loan.approved_by_name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {loan.rejected_at && (
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '0.875rem',
                                                borderRadius: '0.75rem',
                                                background:
                                                    'rgba(239,68,68,0.05)',
                                                border: '1px solid rgba(239,68,68,0.15)',
                                            }}
                                        >
                                            <X
                                                style={{
                                                    width: '1rem',
                                                    height: '1rem',
                                                    color: '#ef4444',
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <div
                                                style={{
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                    color: '#ef4444',
                                                }}
                                            >
                                                Rejected on {loan.rejected_at}
                                            </div>
                                        </div>
                                    )}
                                    {loan.admin_notes && (
                                        <div
                                            style={{
                                                padding: '0.875rem',
                                                borderRadius: '0.75rem',
                                                background:
                                                    'var(--color-bg-base)',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: '0.6875rem',
                                                    color: 'var(--color-text-muted)',
                                                    marginBottom: '0.375rem',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.08em',
                                                }}
                                            >
                                                Admin Notes
                                            </div>
                                            <p
                                                style={{
                                                    fontSize: '0.875rem',
                                                    color: 'var(--color-text-main)',
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                {loan.admin_notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Applicant Sidebar */}
                    <div>
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
                                Applicant
                            </div>
                            <div style={{ padding: '0.875rem' }}>
                                <Link
                                    href={`/admin/users/${loan.user.id}`}
                                    style={{
                                        display: 'block',
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
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
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
                                            {loan.user.name
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
                                                {loan.user.name}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: '0.75rem',
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                {loan.user.tag}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.375rem',
                                    }}
                                >
                                    {[
                                        {
                                            icon: Mail,
                                            label: 'Email',
                                            value: loan.user.email,
                                        },
                                        {
                                            icon: Phone,
                                            label: 'Phone',
                                            value: loan.user.phone || '—',
                                        },
                                        {
                                            icon: IdCard,
                                            label: 'CIN',
                                            value: loan.user.cin || '—',
                                        },
                                    ].map((item) => (
                                        <div
                                            key={item.label}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.625rem',
                                                padding: '0.5rem 0.625rem',
                                                borderRadius: '0.5rem',
                                                background:
                                                    'var(--color-bg-base)',
                                                fontSize: '0.8125rem',
                                            }}
                                        >
                                            <item.icon
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
                                                    marginRight: '0.25rem',
                                                }}
                                            >
                                                {item.label}:
                                            </span>
                                            <span
                                                style={{
                                                    color: 'var(--color-text-main)',
                                                    fontWeight: 500,
                                                    marginLeft: 'auto',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminLoanDetail.layout = (page) => (
    <AdminLayout children={page} active="loans" />
);
