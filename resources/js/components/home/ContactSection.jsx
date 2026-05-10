import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const ICON_MAP = { Mail, Phone, MapPin };

const contactData = [
    {
        icon: 'Mail',
        labelKey: 'contact.email_label',
        valueKey: 'contact.email',
    },
    {
        icon: 'Phone',
        labelKey: 'contact.phone_label',
        valueKey: 'contact.phone',
    },
    {
        icon: 'MapPin',
        labelKey: 'contact.address_label',
        valueKey: 'contact.address',
    },
];

export default function ContactSection() {
    const { t } = useTranslation();
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [focusedField, setFocusedField] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
    };

    const inputClass = (field) =>
        `w-full py-4 px-5 rounded-xl text-[14px] font-medium outline-none transition-all duration-300 bg-[var(--color-bg-base)] text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] border ${
            focusedField === field
                ? 'border-[var(--color-text-main)] shadow-none'
                : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
        }`;

    return (
        <section
            id="contact"
            className="border-t border-[var(--color-border)] px-6 py-32"
        >
            <div className="mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-20 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end"
                >
                    <div className="max-w-2xl">
                        <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-2 text-[10px] font-bold tracking-[0.2em] uppercase">
                            <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
                            <span className="text-[var(--color-text-main)]">
                                {t('contact.section_label', 'Client Relations')}
                            </span>
                        </div>
                        <h2 className="text-[40px] leading-[1.1] font-semibold tracking-tight text-[var(--color-text-main)] md:text-[56px]">
                            {t('contact.section_title', 'Initiate Contact.')}
                        </h2>
                    </div>
                    <p className="max-w-sm text-[15px] font-medium text-[var(--color-text-muted)] md:text-right">
                        {t(
                            'contact.section_desc',
                            'Our private banking directors are available 24/7 to structure your transition to Oscorp.',
                        )}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-4 lg:col-span-2"
                    >
                        <div className="flex flex-col gap-px overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-[var(--color-border)]">
                            {contactData.map((it, i) => {
                                const Icon = ICON_MAP[it.icon];
                                return (
                                    <div
                                        key={it.labelKey}
                                        className="flex items-center gap-6 bg-[var(--color-bg-card)] p-6"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-base)]">
                                            <Icon className="h-4 w-4 text-[var(--color-text-main)]" />
                                        </div>
                                        <div>
                                            <div className="mb-1 text-[10px] font-bold tracking-widest text-[var(--color-text-muted)] uppercase">
                                                {t(it.labelKey)}
                                            </div>
                                            <div className="text-[14px] font-semibold text-[var(--color-text-main)]">
                                                {t(it.valueKey)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8">
                            <div className="mb-2 text-[14px] font-bold tracking-tight text-[var(--color-text-main)]">
                                {t(
                                    'contact.onboarding_title',
                                    'Private Onboarding',
                                )}
                            </div>
                            <p className="text-[13px] leading-relaxed font-medium text-[var(--color-text-muted)]">
                                {t(
                                    'contact.onboarding_desc',
                                    'Schedule a dedicated architectural session with a director. Complimentary for verified high-net-worth clients.',
                                )}
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 lg:col-span-3 lg:p-10"
                    >
                        {sent ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex h-full flex-col items-center justify-center py-20 text-center"
                            >
                                <CheckCircle className="mb-6 h-12 w-12 text-[var(--color-text-main)]" />
                                <div className="mb-2 text-[24px] font-semibold tracking-tight text-[var(--color-text-main)]">
                                    {t(
                                        'contact.transmission_title',
                                        'Transmission Secured',
                                    )}
                                </div>
                                <p className="max-w-sm text-[14px] font-medium text-[var(--color-text-muted)]">
                                    {t(
                                        'contact.transmission_desc',
                                        'A director will review your inquiry and initiate contact within 24 hours.',
                                    )}
                                </p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-3 block text-[11px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase">
                                            {t(
                                                'contact.form_name',
                                                'Legal Name',
                                            )}
                                        </label>
                                        <input
                                            className={inputClass('name')}
                                            placeholder={t(
                                                'contact.form_name_placeholder',
                                                'John Doe',
                                            )}
                                            required
                                            value={form.name}
                                            onFocus={() =>
                                                setFocusedField('name')
                                            }
                                            onBlur={() => setFocusedField(null)}
                                            onChange={(e) =>
                                                setForm((p) => ({
                                                    ...p,
                                                    name: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-3 block text-[11px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase">
                                            {t(
                                                'contact.form_email',
                                                'Primary Email',
                                            )}
                                        </label>
                                        <input
                                            type="email"
                                            className={inputClass('email')}
                                            placeholder={t(
                                                'contact.form_email_placeholder',
                                                'johndoe@example.com',
                                            )}
                                            required
                                            value={form.email}
                                            onFocus={() =>
                                                setFocusedField('email')
                                            }
                                            onBlur={() => setFocusedField(null)}
                                            onChange={(e) =>
                                                setForm((p) => ({
                                                    ...p,
                                                    email: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-3 block text-[11px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase">
                                        {t(
                                            'contact.form_inquiry',
                                            'Inquiry Type',
                                        )}
                                    </label>
                                    <input
                                        className={inputClass('subject')}
                                        placeholder={t(
                                            'contact.form_inquiry_placeholder',
                                            'e.g. Asset Transfer, Corporate Account',
                                        )}
                                        value={form.subject}
                                        onFocus={() =>
                                            setFocusedField('subject')
                                        }
                                        onBlur={() => setFocusedField(null)}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                subject: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="mb-3 block text-[11px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase">
                                        {t(
                                            'contact.form_message',
                                            'Confidential Message',
                                        )}
                                    </label>
                                    <textarea
                                        rows={5}
                                        className={`${inputClass('message')} resize-none`}
                                        placeholder={t(
                                            'contact.form_message_placeholder',
                                            'Detail your requirements...',
                                        )}
                                        required
                                        value={form.message}
                                        onFocus={() =>
                                            setFocusedField('message')
                                        }
                                        onBlur={() => setFocusedField(null)}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                message: e.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[var(--color-text-main)] py-4 text-[13px] font-bold text-[var(--color-bg-base)] transition-all hover:bg-[var(--color-gold)] hover:text-[var(--color-gold-fg)]"
                                    >
                                        {t(
                                            'contact.form_submit',
                                            'Submit Inquiry',
                                        )}
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
