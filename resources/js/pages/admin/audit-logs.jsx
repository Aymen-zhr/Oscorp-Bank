import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FileText, Clock } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminAuditLogs({ logs }) {
    const entries = logs?.data || [];

    return (
        <>
            <Head title="Admin - Audit Logs" />
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
                        Audit Logs
                    </h1>
                    <p
                        style={{
                            marginTop: '0.25rem',
                            fontSize: '0.875rem',
                            color: 'var(--color-text-muted)',
                        }}
                    >
                        System activity and change history
                    </p>
                </div>

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
                    {entries.length === 0 ? (
                        <div style={{ padding: '4rem', textAlign: 'center' }}>
                            <FileText
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
                                No audit logs found
                            </p>
                        </div>
                    ) : (
                        <>
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
                                            'Event',
                                            'Subject',
                                            'User',
                                            'IP Address',
                                            'Time',
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
                                    {entries.map((log, i) => (
                                        <tr
                                            key={log.id || i}
                                            style={{
                                                borderBottom:
                                                    i < entries.length - 1
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
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.375rem',
                                                        padding:
                                                            '0.2rem 0.6rem',
                                                        borderRadius: '100px',
                                                        fontSize: '0.6875rem',
                                                        fontWeight: 700,
                                                        background:
                                                            'var(--color-gold-bg)',
                                                        color: 'var(--color-gold)',
                                                    }}
                                                >
                                                    {log.event ||
                                                        log.action ||
                                                        '—'}
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    padding: '0.75rem 1rem',
                                                    fontSize: '0.8125rem',
                                                    color: 'var(--color-text-main)',
                                                }}
                                            >
                                                {log.subject_type
                                                    ? `${log.subject_type} #${log.subject_id}`
                                                    : log.description || '—'}
                                            </td>
                                            <td
                                                style={{
                                                    padding: '0.75rem 1rem',
                                                    fontSize: '0.8125rem',
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                {log.causer_id
                                                    ? `#${log.causer_id}`
                                                    : log.user_id
                                                      ? `#${log.user_id}`
                                                      : '—'}
                                            </td>
                                            <td
                                                style={{
                                                    padding: '0.75rem 1rem',
                                                    fontSize: '0.8125rem',
                                                    color: 'var(--color-text-muted)',
                                                    fontFamily: 'monospace',
                                                }}
                                            >
                                                {log.ip_address || '—'}
                                            </td>
                                            <td
                                                style={{
                                                    padding: '0.75rem 1rem',
                                                    fontSize: '0.75rem',
                                                    color: 'var(--color-text-muted)',
                                                    whiteSpace: 'nowrap',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.375rem',
                                                }}
                                            >
                                                <Clock
                                                    style={{
                                                        width: '0.75rem',
                                                        height: '0.75rem',
                                                        flexShrink: 0,
                                                    }}
                                                />
                                                {log.created_at}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {logs?.last_page > 1 && (
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.75rem 1rem',
                                        borderTop:
                                            '1px solid var(--color-border)',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--color-text-muted)',
                                        }}
                                    >
                                        Showing {logs.from}–{logs.to} of{' '}
                                        {logs.total}
                                    </span>
                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: '0.25rem',
                                        }}
                                    >
                                        {logs.links?.map((link, i) =>
                                            link.url ? (
                                                <button
                                                    key={i}
                                                    onClick={() =>
                                                        router.get(link.url)
                                                    }
                                                    style={{
                                                        padding:
                                                            '0.25rem 0.625rem',
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
                                                    {link.label.includes(
                                                        'Previous',
                                                    )
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
                        </>
                    )}
                </motion.div>
            </div>
        </>
    );
}

AdminAuditLogs.layout = (page) => (
    <AdminLayout children={page} active="audit-logs" />
);
