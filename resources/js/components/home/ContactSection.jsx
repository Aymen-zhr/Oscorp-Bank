import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowRight, CheckCircle } from 'lucide-react';

const info = [
    { icon: Mail,    label: 'Email',    value: 'contact@oscorp.bank' },
    { icon: Phone,   label: 'Phone',    value: '+212 522 000 000' },
    { icon: MapPin,  label: 'Address',  value: 'Twin Center, Casablanca, Morocco' },
];

export default function ContactSection() {
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
    };

    const inputClass = "w-full py-3 px-4 rounded-xl text-[14px] outline-none transition-all bg-[#1C1A27] border text-white placeholder:text-white/20 focus:border-[var(--color-gold)] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] border-[rgba(212,175,55,0.15)]";

    return (
        <section id="contact" className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-[11px] font-bold uppercase tracking-wider"
                        style={{ background: 'var(--color-gold-bg)', border: '1px solid var(--color-border)', color: 'var(--color-gold)' }}>
                        Get In Touch
                    </div>
                    <h2 className="text-[40px] font-bold tracking-tight text-[var(--color-text-main)] mb-4">Contact Our Team</h2>
                    <p className="text-[16px] text-[var(--color-text-muted)] max-w-lg mx-auto">
                        Ready to elevate your banking experience? Our private banking team is available 24/7.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    {/* Info panel */}
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                        className="lg:col-span-2 space-y-5">
                        {info.map(it => (
                            <div key={it.label} className="flex items-center gap-4 p-5 rounded-[20px]"
                                style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: 'var(--color-gold-bg)', border: '1px solid var(--color-border)' }}>
                                    <it.icon className="w-4 h-4" style={{ color: 'var(--color-gold)' }} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">{it.label}</div>
                                    <div className="text-[14px] font-semibold text-[var(--color-text-main)]">{it.value}</div>
                                </div>
                            </div>
                        ))}

                        <div className="p-6 rounded-[20px] relative overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.1), transparent)', border: '1px solid var(--color-border)' }}>
                            <div className="text-[15px] font-bold text-[var(--color-text-main)] mb-2">Private Onboarding</div>
                            <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed">
                                Schedule a dedicated session with a private banking advisor. Complimentary for qualified clients.
                            </p>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                        className="lg:col-span-3 p-8 rounded-[28px] relative overflow-hidden"
                        style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                        <div className="absolute top-0 left-0 right-0 h-[2px]"
                            style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }} />

                        {sent ? (
                            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                                <CheckCircle className="w-14 h-14 text-emerald-400 mb-4" />
                                <div className="text-[20px] font-bold text-[var(--color-text-main)] mb-2">Message Sent</div>
                                <p className="text-[14px] text-[var(--color-text-muted)]">Our team will contact you within 24 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">Full Name</label>
                                        <input className={inputClass} placeholder="Your name" required value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">Email</label>
                                        <input type="email" className={inputClass} placeholder="you@example.com" required value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">Subject</label>
                                    <input className={inputClass} placeholder="How can we help?" value={form.subject} onChange={e => setForm(p => ({...p, subject: e.target.value}))} />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">Message</label>
                                    <textarea rows={5} className={`${inputClass} resize-none`} placeholder="Tell us about your banking needs..." required value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))} />
                                </div>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                                    className="w-full py-3.5 rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 group"
                                    style={{ background: 'var(--color-gold)', color: '#000', boxShadow: '0 6px 20px rgba(212,175,55,0.3)' }}>
                                    Send Message
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
