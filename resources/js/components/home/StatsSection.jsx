import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function Counter({ end, suffix = '', prefix = '' }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const step = end / 60;
        const timer = setInterval(() => {
            start += step;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [inView, end]);

    return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

const stats = [
    { label: 'Elite Clients',      end: 12000, suffix: '+',    prefix: '' },
    { label: 'Assets Managed',     end: 4.2,   suffix: 'B',    prefix: '$', isDecimal: true },
    { label: 'Transactions / day', end: 98000, suffix: '+',    prefix: '' },
    { label: 'System Uptime',      end: 99.9,  suffix: '%',    prefix: '', isDecimal: true },
];

export default function StatsSection() {
    return (
        <section id="stats" className="py-20 px-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(180deg, var(--color-bg-base), var(--color-bg-card) 50%, var(--color-bg-base))' }} />
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(var(--color-gold) 1px, transparent 1px), linear-gradient(90deg, var(--color-gold) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="text-center mb-14">
                    <h2 className="text-[36px] font-bold tracking-tight text-[var(--color-text-main)]">Numbers That Define Us</h2>
                    <p className="text-[15px] text-[var(--color-text-muted)] mt-3">The scale and trust of the world's most elite private bank.</p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((s, i) => (
                        <motion.div key={s.label}
                            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                            className="text-center p-8 rounded-[28px] relative overflow-hidden"
                            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                            <div className="absolute top-0 left-0 right-0 h-[2px]"
                                style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }} />
                            <div className="text-[42px] font-bold tracking-tight mb-2" style={{ color: 'var(--color-gold)' }}>
                                {s.isDecimal
                                    ? <><span>{s.prefix}</span><span>{s.end}</span><span>{s.suffix}</span></>
                                    : <Counter end={s.end} suffix={s.suffix} prefix={s.prefix} />
                                }
                            </div>
                            <div className="text-[13px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
