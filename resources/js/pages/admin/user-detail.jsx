import { Head, Link, useForm, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Mail,
    Phone,
    IdCard,
    Calendar,
    Map,
    Flag,
    Users,
    Briefcase,
    MapPin,
    Shield,
    ShieldOff,
    Save,
    CheckCircle2,
    Landmark,
    Crown,
    Edit3,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

function InfoRow({ icon: Icon, label, value }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 0.875rem',
                borderRadius: '0.625rem',
                background: 'var(--color-bg-base)',
            }}
        >
            <Icon
                style={{
                    width: '0.875rem',
                    height: '0.875rem',
                    color: 'var(--color-gold)',
                    flexShrink: 0,
                }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
                <div
                    style={{
                        fontSize: '0.6875rem',
                        color: 'var(--color-text-muted)',
                    }}
                >
                    {label}
                </div>
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
                    {value || '—'}
                </div>
            </div>
        </div>
    );
}

function FormField({ label, children }) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.375rem',
            }}
        >
            <label
                style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: 'var(--color-gold)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                }}
            >
                {label}
            </label>
            {children}
        </div>
    );
}

const inputStyle = {
    width: '100%',
    padding: '0.625rem 0.875rem',
    borderRadius: '0.625rem',
    border: '1px solid var(--color-border)',
    background: 'var(--color-bg-base)',
    color: 'var(--color-text-main)',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
};

export default function AdminUserDetail({ userData, flash }) {
    const { data, setData, put, processing, errors } = useForm({
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        job_title: userData.job_title || '',
        address: userData.address || '',
        cin: userData.cin || '',
        date_of_birth: userData.date_of_birth || '',
        place_of_birth: userData.place_of_birth || '',
        nationality: userData.nationality || '',
        gender: userData.gender || '',
        is_admin: userData.is_admin,
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/users/${userData.id}`);
    };

    const toggleAdmin = () => {
        router.post(
            `/admin/users/${userData.id}/toggle-admin`,
            {},
            { preserveScroll: true },
        );
    };

    const loanStatusColors = {
        pending: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
        active: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' },
        approved: { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
        rejected: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' },
        completed: { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
    };

    return (
        <>
            <Head title={`Admin - ${userData.name}`} />
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
                            href="/admin/users"
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
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.875rem',
                            }}
                        >
                            <div
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    borderRadius: '50%',
                                    background: userData.is_admin
                                        ? 'linear-gradient(135deg, #D4AF37, #B8860B)'
                                        : 'var(--color-bg-card)',
                                    border: '2px solid var(--color-border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.125rem',
                                    fontWeight: 700,
                                    color: userData.is_admin
                                        ? '#000'
                                        : 'var(--color-gold)',
                                    flexShrink: 0,
                                }}
                            >
                                {(userData.name?.charAt(0) || '?').toUpperCase()}
                            </div>
                            <div>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
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
                                        {userData.name || `User #${userData.id}`}
                                    </h1>
                                    {userData.is_admin && (
                                        <Crown
                                            style={{
                                                width: '1rem',
                                                height: '1rem',
                                                color: 'var(--color-gold)',
                                            }}
                                        />
                                    )}
                                </div>
                                <p
                                    style={{
                                        fontSize: '0.8125rem',
                                        color: 'var(--color-text-muted)',
                                    }}
                                >
                                    {userData.tag} · Joined{' '}
                                    {userData.created_at}
                                </p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={toggleAdmin}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.75rem',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            transition: 'opacity 0.15s',
                            background: userData.is_admin
                                ? 'rgba(239,68,68,0.1)'
                                : 'var(--color-gold-bg)',
                            color: userData.is_admin
                                ? '#ef4444'
                                : 'var(--color-gold)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '0.8';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '1';
                        }}
                    >
                        {userData.is_admin ? (
                            <ShieldOff
                                style={{
                                    width: '0.875rem',
                                    height: '0.875rem',
                                }}
                            />
                        ) : (
                            <Shield
                                style={{
                                    width: '0.875rem',
                                    height: '0.875rem',
                                }}
                            />
                        )}
                        {userData.is_admin ? 'Remove Admin' : 'Make Admin'}
                    </button>
                </div>

                {/* Flash messages */}
                {flash?.success && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.875rem 1rem',
                            borderRadius: '0.75rem',
                            background: 'rgba(16,185,129,0.1)',
                            border: '1px solid rgba(16,185,129,0.2)',
                            fontSize: '0.875rem',
                            color: '#10b981',
                        }}
                    >
                        <CheckCircle2
                            style={{ width: '1rem', height: '1rem' }}
                        />{' '}
                        {flash.success}
                    </motion.div>
                )}
                {flash?.error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            padding: '0.875rem 1rem',
                            borderRadius: '0.75rem',
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.2)',
                            fontSize: '0.875rem',
                            color: '#ef4444',
                        }}
                    >
                        {flash.error}
                    </motion.div>
                )}

                {/* Main Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0,1fr) 300px',
                        gap: '1.25rem',
                    }}
                    className="grid-cols-1 lg:grid-cols-[1fr_300px]"
                >
                    {/* Edit Form */}
                    <form onSubmit={submit}>
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
                                    padding: '1rem 1.25rem',
                                    borderBottom:
                                        '1px solid var(--color-border)',
                                }}
                            >
                                <Edit3
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
                                    Edit User Details
                                </span>
                            </div>
                            <div
                                style={{
                                    padding: '1.25rem',
                                    display: 'grid',
                                    gridTemplateColumns:
                                        'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '1rem',
                                }}
                            >
                                <FormField label="Name">
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        style={inputStyle}
                                        onFocus={(e) => {
                                            e.target.style.borderColor =
                                                'var(--color-gold)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor =
                                                'var(--color-border)';
                                        }}
                                    />
                                </FormField>
                                <FormField label="Email">
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        style={inputStyle}
                                        onFocus={(e) => {
                                            e.target.style.borderColor =
                                                'var(--color-gold)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor =
                                                'var(--color-border)';
                                        }}
                                    />
                                </FormField>
                                {[
                                    {
                                        key: 'phone',
                                        label: 'Phone',
                                        type: 'tel',
                                    },
                                    {
                                        key: 'job_title',
                                        label: 'Job Title',
                                        type: 'text',
                                    },
                                    { key: 'cin', label: 'CIN', type: 'text' },
                                    {
                                        key: 'date_of_birth',
                                        label: 'Date of Birth',
                                        type: 'date',
                                    },
                                    {
                                        key: 'place_of_birth',
                                        label: 'Place of Birth',
                                        type: 'text',
                                    },
                                    {
                                        key: 'nationality',
                                        label: 'Nationality',
                                        type: 'text',
                                    },
                                ].map((field) => (
                                    <FormField
                                        key={field.key}
                                        label={field.label}
                                    >
                                        <input
                                            type={field.type}
                                            value={data[field.key]}
                                            onChange={(e) =>
                                                setData(
                                                    field.key,
                                                    e.target.value,
                                                )
                                            }
                                            style={inputStyle}
                                            onFocus={(e) => {
                                                e.target.style.borderColor =
                                                    'var(--color-gold)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor =
                                                    'var(--color-border)';
                                            }}
                                        />
                                        {errors[field.key] && (
                                            <p
                                                style={{
                                                    fontSize: '0.6875rem',
                                                    color: '#ef4444',
                                                }}
                                            >
                                                {errors[field.key]}
                                            </p>
                                        )}
                                    </FormField>
                                ))}
                                <FormField label="Address">
                                    <input
                                        type="text"
                                        value={data.address}
                                        onChange={(e) =>
                                            setData('address', e.target.value)
                                        }
                                        style={inputStyle}
                                        onFocus={(e) => {
                                            e.target.style.borderColor =
                                                'var(--color-gold)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor =
                                                'var(--color-border)';
                                        }}
                                    />
                                </FormField>
                                <FormField label="Gender">
                                    <select
                                        value={data.gender}
                                        onChange={(e) =>
                                            setData('gender', e.target.value)
                                        }
                                        style={{
                                            ...inputStyle,
                                            appearance: 'none',
                                        }}
                                    >
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </FormField>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    padding: '0 1.25rem 1.25rem',
                                }}
                            >
                                <button
                                    type="submit"
                                    disabled={processing}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.625rem 1.25rem',
                                        borderRadius: '0.75rem',
                                        background:
                                            'linear-gradient(135deg, var(--color-gold), #b8860b)',
                                        color: '#000',
                                        fontWeight: 700,
                                        fontSize: '0.875rem',
                                        border: 'none',
                                        cursor: processing
                                            ? 'not-allowed'
                                            : 'pointer',
                                        opacity: processing ? 0.7 : 1,
                                    }}
                                >
                                    <Save
                                        style={{
                                            width: '0.875rem',
                                            height: '0.875rem',
                                        }}
                                    />
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </motion.div>
                    </form>

                    {/* Sidebar */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}
                    >
                        {/* Quick Info */}
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
                                    padding: '0.875rem 1rem',
                                    borderBottom:
                                        '1px solid var(--color-border)',
                                    fontSize: '0.8125rem',
                                    fontWeight: 600,
                                    color: 'var(--color-text-main)',
                                }}
                            >
                                Quick Info
                            </div>
                            <div
                                style={{
                                    padding: '0.875rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem',
                                }}
                            >
                                <InfoRow
                                    icon={Mail}
                                    label="Email"
                                    value={userData.email}
                                />
                                <InfoRow
                                    icon={Phone}
                                    label="Phone"
                                    value={userData.phone}
                                />
                                <InfoRow
                                    icon={IdCard}
                                    label="CIN"
                                    value={userData.cin}
                                />
                                <InfoRow
                                    icon={Flag}
                                    label="Nationality"
                                    value={userData.nationality}
                                />
                            </div>
                        </motion.div>

                        {/* Loans */}
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
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.8125rem',
                                    fontWeight: 600,
                                    color: 'var(--color-text-main)',
                                }}
                            >
                                <Landmark
                                    style={{
                                        width: '0.875rem',
                                        height: '0.875rem',
                                        color: 'var(--color-gold)',
                                    }}
                                />
                                Loans ({userData.loans.length})
                            </div>
                            <div style={{ padding: '0.625rem' }}>
                                {userData.loans.length === 0 ? (
                                    <p
                                        style={{
                                            padding: '1rem',
                                            textAlign: 'center',
                                            fontSize: '0.8125rem',
                                            color: 'var(--color-text-muted)',
                                        }}
                                    >
                                        No loans yet
                                    </p>
                                ) : (
                                    userData.loans.slice(0, 5).map((loan) => {
                                        const sc =
                                            loanStatusColors[loan.status] ||
                                            loanStatusColors.pending;
                                        return (
                                            <Link
                                                key={loan.id}
                                                href={`/admin/loans/${loan.id}`}
                                                style={{
                                                    display: 'block',
                                                    padding: '0.625rem 0.75rem',
                                                    borderRadius: '0.625rem',
                                                    textDecoration: 'none',
                                                    transition:
                                                        'background 0.15s',
                                                    marginBottom: '0.25rem',
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
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'space-between',
                                                        marginBottom: '0.25rem',
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontSize:
                                                                '0.8125rem',
                                                            fontWeight: 600,
                                                            color: 'var(--color-text-main)',
                                                        }}
                                                    >
                                                        {loan.type}
                                                    </span>
                                                    <span
                                                        style={{
                                                            padding:
                                                                '0.125rem 0.5rem',
                                                            borderRadius:
                                                                '100px',
                                                            fontSize: '0.6rem',
                                                            fontWeight: 700,
                                                            background: sc.bg,
                                                            color: sc.color,
                                                            textTransform:
                                                                'capitalize',
                                                        }}
                                                    >
                                                        {loan.status}
                                                    </span>
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: '0.75rem',
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    {Number(
                                                        loan.amount,
                                                    ).toLocaleString()}{' '}
                                                    MAD
                                                </div>
                                            </Link>
                                        );
                                    })
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminUserDetail.layout = (page) => (
    <AdminLayout children={page} active="users" />
);
