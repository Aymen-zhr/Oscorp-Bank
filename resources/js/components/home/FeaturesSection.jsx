import { motion } from 'framer-motion';
import { Sparkles, Shield, ArrowRightLeft, FileText, Landmark, Receipt, CreditCard, TrendingUp, ArrowRight } from 'lucide-react';

const features = [
    { icon: Sparkles, title: 'Oscar AI Engine', desc: 'Real-time intelligence on burn rate, capital reserves, and custom investment parameters.' },
    { icon: CreditCard, title: 'Asset Visibility', desc: 'Consolidated view of liquid cash, private equity, and real estate allocations in one interface.' },
    { icon: ArrowRightLeft, title: 'Global Liquidity', desc: 'Zero-latency domestic and international transfers with institutional-grade routing.' },
    { icon: Landmark, title: 'Private Credit', desc: 'Bespoke loan structures with real-time amortization and exclusive capital access.' },
    { icon: Receipt, title: 'Fiscal Architecture', desc: 'Automated tax structuring, deduction tracking, and exportable audit-ready reports.' },
    { icon: FileText, title: 'Deep Analytics', desc: 'Granular financial reporting with custom date ranges and precise portfolio weighting.' },
];

export default function FeaturesSection() {
    return (
        <section id="features" className="py-32 px-6 border-t border-[var(--color-border)]">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6 text-[10px] font-bold uppercase tracking-[0.2em] border border-[var(--color-border)] bg-[var(--color-bg-card)]">
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
                            <span className="text-[var(--color-text-main)]">Platform Specifications</span>
                        </div>
                        <h2 className="text-[40px] md:text-[56px] font-semibold tracking-tight text-[var(--color-text-main)] leading-[1.1]">
                            Institutional Grade.<br />
                            <span className="text-[var(--color-text-muted)] italic font-light">Zero Compromise.</span>
                        </h2>
                    </div>
                    <p className="text-[15px] text-[var(--color-text-muted)] max-w-sm md:text-right font-medium">
                        A definitive suite of wealth management tools engineered for absolute precision and control.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[24px] overflow-hidden">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            className="p-10 relative group bg-[var(--color-bg-base)] hover:bg-[var(--color-bg-elevated)] transition-colors duration-500"
                        >
                            <div className="w-10 h-10 mb-8 border border-[var(--color-border)] bg-[var(--color-bg-card)] rounded-xl flex items-center justify-center group-hover:border-[var(--color-gold)] transition-colors duration-500">
                                <f.icon className="w-4 h-4 text-[var(--color-text-main)] group-hover:text-[var(--color-gold)] transition-colors duration-500" />
                            </div>
                            <h3 className="text-[15px] font-bold text-[var(--color-text-main)] mb-3 tracking-tight">{f.title}</h3>
                            <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed font-medium mb-8">{f.desc}</p>
                            
                            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] group-hover:text-[var(--color-gold)] flex items-center gap-2 transition-colors duration-500 cursor-pointer">
                                Examine Module <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
