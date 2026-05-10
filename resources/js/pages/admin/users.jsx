import { Head, Link, router, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Search,
    Users,
    ChevronRight,
    Shield,
    UserCheck,
    Crown,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminUsers({ users, filters, flash }) {
    const { data, setData, get } = useForm({ search: filters.search || '' });

    const handleSearch = (e) => {
        e.preventDefault();
        get('/admin/users', { preserveState: true, preserveScroll: true });
    };

    return (
        <>
            <Head title="Admin - Users" />
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
                        flexWrap: 'wrap',
                        gap: '0.75rem',
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
                            Users
                        </h1>
                        <p
                            style={{
                                marginTop: '0.25rem',
                                fontSize: '0.875rem',
                                color: 'var(--color-text-muted)',
                            }}
                        >
                            {users.total?.toLocaleString()} registered accounts
                        </p>
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
                        }}
                    >
                        {flash.success}
                    </motion.div>
                )}

                {/* Search */}
                <form
                    onSubmit={handleSearch}
                    style={{ position: 'relative', maxWidth: '420px' }}
                >
                    <Search
                        style={{
                            position: 'absolute',
                            left: '0.875rem',
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
                        onChange={(e) => setData('search', e.target.value)}
                        placeholder="Search by name, email, CIN, phone..."
                        style={{
                            width: '100%',
                            padding: '0.625rem 1rem 0.625rem 2.5rem',
                            borderRadius: '0.75rem',
                            border: '1px solid var(--color-border)',
                            background: 'var(--color-bg-card)',
                            color: 'var(--color-text-main)',
                            fontSize: '0.875rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'border-color 0.15s',
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--color-gold)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'var(--color-border)';
                        }}
                    />
                </form>

                {/* Table */}
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
                    <table
                        style={{ width: '100%', borderCollapse: 'collapse' }}
                    >
                        <thead>
                            <tr
                                style={{
                                    borderBottom:
                                        '1px solid var(--color-border)',
                                }}
                            >
                                {[
                                    'User',
                                    'CIN',
                                    'Phone',
                                    'Joined',
                                    'Role',
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
                                        className={
                                            h === 'CIN' || h === 'Phone'
                                                ? 'hidden md:table-cell'
                                                : ''
                                        }
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((user, i) => (
                                <tr
                                    key={user.id}
                                    style={{
                                        borderBottom:
                                            i < users.data.length - 1
                                                ? '1px solid var(--color-border)'
                                                : 'none',
                                        transition: 'background 0.15s',
                                        cursor: 'pointer',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background =
                                            'var(--color-bg-elevated)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background =
                                            'transparent';
                                    }}
                                    onClick={() =>
                                        router.get(`/admin/users/${user.id}`)
                                    }
                                >
                                    <td style={{ padding: '0.75rem 1rem' }}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: '2.25rem',
                                                    height: '2.25rem',
                                                    borderRadius: '50%',
                                                    background: user.is_admin
                                                        ? 'linear-gradient(135deg, #D4AF37, #B8860B)'
                                                        : 'var(--color-bg-elevated)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.8125rem',
                                                    fontWeight: 700,
                                                    color: user.is_admin
                                                        ? '#000'
                                                        : 'var(--color-gold)',
                                                    flexShrink: 0,
                                                    border: '1px solid var(--color-border)',
                                                }}
                                            >
                                                {user.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                            <div>
                                                <div
                                                    style={{
                                                        fontSize: '0.875rem',
                                                        fontWeight: 600,
                                                        color: 'var(--color-text-main)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.375rem',
                                                    }}
                                                >
                                                    {user.name}
                                                    {user.is_admin && (
                                                        <Crown
                                                            style={{
                                                                width: '0.75rem',
                                                                height: '0.75rem',
                                                                color: 'var(--color-gold)',
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: '0.75rem',
                                                        color: 'var(--color-text-muted)',
                                                    }}
                                                >
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td
                                        className="hidden md:table-cell"
                                        style={{
                                            padding: '0.75rem 1rem',
                                            fontSize: '0.8125rem',
                                            color: 'var(--color-text-muted)',
                                            fontFamily: 'monospace',
                                        }}
                                    >
                                        {user.cin || '—'}
                                    </td>
                                    <td
                                        className="hidden md:table-cell"
                                        style={{
                                            padding: '0.75rem 1rem',
                                            fontSize: '0.8125rem',
                                            color: 'var(--color-text-muted)',
                                        }}
                                    >
                                        {user.phone || '—'}
                                    </td>
                                    <td
                                        style={{
                                            padding: '0.75rem 1rem',
                                            fontSize: '0.75rem',
                                            color: 'var(--color-text-muted)',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {user.created_at}
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem' }}>
                                        <span
                                            style={{
                                                padding: '0.2rem 0.625rem',
                                                borderRadius: '100px',
                                                fontSize: '0.6875rem',
                                                fontWeight: 700,
                                                background: user.is_admin
                                                    ? 'var(--color-gold-bg)'
                                                    : 'var(--color-bg-elevated)',
                                                color: user.is_admin
                                                    ? 'var(--color-gold)'
                                                    : 'var(--color-text-muted)',
                                            }}
                                        >
                                            {user.is_admin ? 'Admin' : 'User'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem' }}>
                                        <Link
                                            href={`/admin/users/${user.id}`}
                                            onClick={(e) => e.stopPropagation()}
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

                    {users.data.length === 0 && (
                        <div style={{ padding: '4rem', textAlign: 'center' }}>
                            <Users
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
                                No users found
                            </p>
                        </div>
                    )}

                    {users.last_page > 1 && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.75rem 1rem',
                                borderTop: '1px solid var(--color-border)',
                                flexWrap: 'wrap',
                                gap: '0.5rem',
                            }}
                        >
                            <span
                                style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--color-text-muted)',
                                }}
                            >
                                Showing {users.from}–{users.to} of{' '}
                                {users.total?.toLocaleString()}
                            </span>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                {users.links.map((link, i) =>
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
                                                transition: 'opacity 0.15s',
                                            }}
                                        >
                                            {link.label === '&laquo; Previous'
                                                ? '‹'
                                                : link.label === 'Next &raquo;'
                                                  ? '›'
                                                  : link.label}
                                        </button>
                                    ) : null,
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </>
    );
}

AdminUsers.layout = (page) => <AdminLayout children={page} active="users" />;
