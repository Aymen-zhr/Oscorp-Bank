import { motion } from 'framer-motion';
import { Shield, Brain, Award } from 'lucide-react';

const pillars = [
    { icon: Shield, title: 'Absolute Privacy', desc: 'End-to-end encryption. Zero data sharing. Complete financial sovereignty.' },
    { icon: Brain, title: 'Cognitive Engine', desc: 'Real-time portfolio intelligence previously reserved for top-tier hedge funds.' },
    { icon: Award, title: 'Platinum Standard', desc: 'White-glove architecture and zero compromise on execution quality.' },
];

export default function AboutSection() {
    return (
        <section id="about" className="py-32 px-6 border-t border-[var(--color-border)] relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-8 text-[10px] font-bold uppercase tracking-[0.2em] border border-[var(--color-border)] bg-[var(--color-bg-card)]">
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)]" />
                            <span className="text-[var(--color-text-main)]">The Oscorp Standard</span>
                        </div>
                        <h2 className="text-[40px] md:text-[56px] font-semibold tracking-tight text-[var(--color-text-main)] mb-8 leading-[1.1]">
                            Banking,<br />
                            <span className="text-[var(--color-text-muted)] italic font-light">
                                Elevated.
                            </span>
                        </h2>
                        <p className="text-[15px] text-[var(--color-text-muted)] leading-relaxed mb-6 font-medium max-w-md">
                            Oscorp Private Bank operates on a singular mandate: uncompromising excellence. We merge traditional Swiss banking discretion with the sheer power of advanced algorithmic intelligence.
                        </p>
                        <p className="text-[15px] text-[var(--color-text-muted)] leading-relaxed font-medium max-w-md">
                            Your capital is not merely stored; it is strategically positioned, relentlessly monitored, and instantly accessible.
                        </p>

                        <div className="mt-8 md:mt-12 grid grid-cols-3 gap-4 sm:gap-8 border-t border-[var(--color-border)] pt-6 md:pt-8">
                            {[
                                { value: '12K+', label: 'Elite Clients' },
                                { value: '$4.2B', label: 'Assets Managed' },
                                { value: '99.9%', label: 'Uptime SLA' },
                            ].map(s => (
                                <div key={s.label}>
                                    <div className="text-[24px] font-semibold text-[var(--color-text-main)] tracking-tight">{s.value}</div>
                                    <div className="text-[11px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider mt-1">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="flex flex-col gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[24px] overflow-hidden">
                        {pillars.map((p, i) => (
                            <motion.div
                                key={p.title}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                className="flex gap-6 p-8 bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-elevated)] transition-colors duration-500 group"
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-[var(--color-border)] bg-[var(--color-bg-base)] group-hover:border-[var(--color-gold)] transition-colors duration-500"
                                >
                                    <p.icon className="w-4 h-4 text-[var(--color-text-main)] group-hover:text-[var(--color-gold)] transition-colors duration-500" />
                                </div>
                                <div>
                                    <div className="text-[14px] font-bold text-[var(--color-text-main)] mb-2 tracking-tight">{p.title}</div>
                                    <div className="text-[13px] text-[var(--color-text-muted)] leading-relaxed font-medium">{p.desc}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
