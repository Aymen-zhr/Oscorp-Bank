import { motion } from 'framer-motion';
import { Shield, Brain, Award } from 'lucide-react';

const pillars = [
    { icon: Shield, title: 'Absolute Privacy',   desc: 'Your financial data is encrypted end-to-end. We never share, sell, or compromise your information. Ever.', color: '#34D399' },
    { icon: Brain,  title: 'AI Intelligence',    desc: 'Oscar AI monitors your portfolio 24/7, delivering institutional-grade insights previously reserved for hedge funds.', color: 'var(--color-gold)' },
    { icon: Award,  title: 'Elite Excellence',   desc: 'White-glove service, platinum-tier features, and zero compromise on quality — for clients who accept nothing less.', color: '#A78BFA' },
];

export default function AboutSection() {
    return (
        <section id="about" className="py-24 px-6 relative overflow-hidden">
            {/* Background wash */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 50% 50%, var(--color-gold), transparent 70%)' }} />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left */}
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-[11px] font-bold uppercase tracking-wider"
                            style={{ background: 'var(--color-gold-bg)', border: '1px solid var(--color-border)', color: 'var(--color-gold)' }}>
                            About OSCORP
                        </div>
                        <h2 className="text-[40px] font-bold tracking-tight text-[var(--color-text-main)] mb-6 leading-tight">
                            Private Banking,<br />
                            <span className="bg-clip-text text-transparent"
                                style={{ backgroundImage: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))' }}>
                                Reimagined.
                            </span>
                        </h2>
                        <p className="text-[15px] text-[var(--color-text-muted)] leading-relaxed mb-6">
                            OSCORP Private Bank was founded on a single conviction: that exceptional individuals deserve exceptional banking. We combine the discretion of traditional private banking with the power of cutting-edge AI — delivering a platform that works as hard as you do.
                        </p>
                        <p className="text-[15px] text-[var(--color-text-muted)] leading-relaxed">
                            From real-time portfolio analytics to seamless international transfers, every feature is crafted with precision. Your wealth is not just managed here — it is elevated.
                        </p>

                        <div className="mt-10 flex gap-10">
                            {[
                                { value: '12K+',  label: 'Elite Clients' },
                                { value: '$4.2B', label: 'Assets Managed' },
                                { value: '99.9%', label: 'Uptime SLA' },
                            ].map(s => (
                                <div key={s.label}>
                                    <div className="text-[28px] font-bold" style={{ color: 'var(--color-gold)' }}>{s.value}</div>
                                    <div className="text-[12px] text-[var(--color-text-muted)] font-medium">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: pillars */}
                    <div className="space-y-5">
                        {pillars.map((p, i) => (
                            <motion.div key={p.title}
                                initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                                whileHover={{ x: 4 }}
                                className="flex gap-5 p-6 rounded-[24px]"
                                style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                                    style={{ background: `${p.color}15`, border: `1px solid ${p.color}30` }}>
                                    <p.icon className="w-5 h-5" style={{ color: p.color }} />
                                </div>
                                <div>
                                    <div className="text-[15px] font-bold text-[var(--color-text-main)] mb-1.5">{p.title}</div>
                                    <div className="text-[13px] text-[var(--color-text-muted)] leading-relaxed">{p.desc}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
