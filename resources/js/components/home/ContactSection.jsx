import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowRight, CheckCircle } from 'lucide-react';

const info = [
    { icon: Mail, label: 'Secure Communication', value: 'client.relations@oscorp.bank' },
    { icon: Phone, label: 'Priority Support', value: '+212 522 000 000' },
    { icon: MapPin, label: 'Global Headquarters', value: 'Twin Center, Casablanca, Morocco' },
];

export default function ContactSection() {
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [focusedField, setFocusedField] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
    };

    const inputClass = (field) => `w-full py-4 px-5 rounded-xl text-[14px] font-medium outline-none transition-all duration-300 bg-[var(--color-bg-base)] text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] border ${
        focusedField === field
            ? 'border-[var(--color-text-main)] shadow-none'
            : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
    }`;

    return (
        <section id="contact" className="py-32 px-6 border-t border-[var(--color-border)]">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6 text-[10px] font-bold uppercase tracking-[0.2em] border border-[var(--color-border)] bg-[var(--color-bg-card)]">
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
                            <span className="text-[var(--color-text-main)]">Client Relations</span>
                        </div>
                        <h2 className="text-[40px] md:text-[56px] font-semibold tracking-tight text-[var(--color-text-main)] leading-[1.1]">
                            Initiate Contact.
                        </h2>
                    </div>
                    <p className="text-[15px] text-[var(--color-text-muted)] max-w-sm md:text-right font-medium">
                        Our private banking directors are available 24/7 to structure your transition to Oscorp.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                        className="lg:col-span-2 space-y-4">
                        
                        <div className="flex flex-col gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[24px] overflow-hidden">
                            {info.map((it, i) => (
                                <div key={it.label} className="flex items-center gap-6 p-6 bg-[var(--color-bg-card)]">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-[var(--color-border)] bg-[var(--color-bg-base)]">
                                        <it.icon className="w-4 h-4 text-[var(--color-text-main)]" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">{it.label}</div>
                                        <div className="text-[14px] font-semibold text-[var(--color-text-main)]">{it.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-8 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-bg-card)]">
                            <div className="text-[14px] font-bold text-[var(--color-text-main)] mb-2 tracking-tight">Private Onboarding</div>
                            <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed font-medium">
                                Schedule a dedicated architectural session with a director. Complimentary for verified high-net-worth clients.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                        className="lg:col-span-3 p-8 lg:p-10 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-bg-card)]">

                        {sent ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center h-full py-20 text-center"
                            >
                                <CheckCircle className="w-12 h-12 text-[var(--color-text-main)] mb-6" />
                                <div className="text-[24px] font-semibold text-[var(--color-text-main)] tracking-tight mb-2">
                                    Transmission Secured
                                </div>
                                <p className="text-[14px] text-[var(--color-text-muted)] font-medium max-w-sm">
                                    A director will review your inquiry and initiate contact within 24 hours.
                                </p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Legal Name</label>
                                        <input className={inputClass('name')} placeholder="John Doe" required value={form.name}
                                            onFocus={() => setFocusedField('name')}
                                            onBlur={() => setFocusedField(null)}
                                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Primary Email</label>
                                        <input type="email" className={inputClass('email')} placeholder="johndoe@example.com" required value={form.email}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Inquiry Type</label>
                                    <input className={inputClass('subject')} placeholder="e.g. Asset Transfer, Corporate Account" value={form.subject}
                                        onFocus={() => setFocusedField('subject')}
                                        onBlur={() => setFocusedField(null)}
                                        onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Confidential Message</label>
                                    <textarea rows={5} className={`${inputClass('message')} resize-none`} placeholder="Detail your requirements..." required value={form.message}
                                        onFocus={() => setFocusedField('message')}
                                        onBlur={() => setFocusedField(null)}
                                        onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
                                </div>
                                
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="w-full py-4 rounded-xl text-[13px] font-bold flex items-center justify-center gap-3 transition-all bg-[var(--color-text-main)] text-[var(--color-bg-base)] hover:bg-[var(--color-gold)] hover:text-black group"
                                    >
                                        Submit Inquiry
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
