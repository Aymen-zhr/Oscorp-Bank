import { motion } from 'framer-motion';
import { Sparkles, Shield, ArrowRightLeft, FileText, Landmark, Receipt, CreditCard, TrendingUp } from 'lucide-react';

const features = [
    { icon: Sparkles,       title: 'Oscar AI',              desc: 'Real-time AI insights on burn rate, capital reserves, and investment opportunities tailored to your portfolio.', color: 'var(--color-gold)' },
    { icon: CreditCard,     title: 'Accounts & Cards',      desc: 'Platinum metal cards, detailed RIB identifiers, and full account visibility across all assets.', color: '#A78BFA' },
    { icon: ArrowRightLeft, title: 'Smart Transactions',    desc: 'Instant domestic and international transfers with live merchant logos and category intelligence.', color: '#34D399' },
    { icon: Landmark,       title: 'Private Loans',         desc: 'Flexible loan structures with competitive rates, real-time amortization schedules, and instant approval.', color: '#60A5FA' },
    { icon: Receipt,        title: 'Tax Management',        desc: 'Automated tax calculations, deduction tracking, and downloadable fiscal reports — all in one place.', color: '#F97316' },
    { icon: FileText,       title: 'Analytics & Reports',   desc: 'Deep financial reporting with custom date ranges, spending breakdowns, and exportable statements.', color: '#F472B6' },
];

export default function FeaturesSection() {
    return (
        <section id="features" className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-[11px] font-bold uppercase tracking-wider"
                        style={{ background: 'var(--color-gold-bg)', border: '1px solid var(--color-border)', color: 'var(--color-gold)' }}>
                        <TrendingUp className="w-3 h-3" /> Platform Features
                    </div>
                    <h2 className="text-[40px] font-bold tracking-tight text-[var(--color-text-main)] mb-4">
                        Everything Your Wealth Needs
                    </h2>
                    <p className="text-[16px] text-[var(--color-text-muted)] max-w-xl mx-auto">
                        A complete private banking suite engineered for those who demand excellence.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((f, i) => (
                        <motion.div key={f.title}
                            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                            whileHover={{ y: -6, scale: 1.02 }}
                            className="p-7 rounded-[28px] relative overflow-hidden group cursor-default"
                            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                            {/* Hover glow */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[28px]"
                                style={{ background: `radial-gradient(circle at 30% 30%, ${f.color}10, transparent 60%)` }} />
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                                style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                                <f.icon className="w-5 h-5" style={{ color: f.color }} />
                            </div>
                            <h3 className="text-[17px] font-bold text-[var(--color-text-main)] mb-3">{f.title}</h3>
                            <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed">{f.desc}</p>
                            <div className="mt-5 text-[12px] font-bold flex items-center gap-1" style={{ color: f.color }}>
                                Learn more →
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
