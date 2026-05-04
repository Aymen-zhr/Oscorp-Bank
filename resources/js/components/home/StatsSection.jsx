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
    { label: 'Elite Clients', end: 12000, suffix: '+', prefix: '' },
    { label: 'Assets Managed', end: 4.2, suffix: 'B', prefix: '$', isDecimal: true },
    { label: 'Transactions / day', end: 98000, suffix: '+', prefix: '' },
    { label: 'System Uptime', end: 99.9, suffix: '%', prefix: '', isDecimal: true },
];

export default function StatsSection() {
    return (
        <section id="stats" className="py-32 px-6 border-t border-[var(--color-border)]">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                    className="text-center mb-20">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6 text-[10px] font-bold uppercase tracking-[0.2em] border border-[var(--color-border)] bg-[var(--color-bg-card)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
                        <span className="text-[var(--color-text-main)]">Global Scale</span>
                    </div>
                    <h2 className="text-[40px] md:text-[56px] font-semibold tracking-tight text-[var(--color-text-main)] leading-[1.1] mb-6">
                        Empirical Data.
                    </h2>
                    <p className="text-[15px] text-[var(--color-text-muted)] font-medium max-w-lg mx-auto">
                        The sheer scale and unyielding reliability of the Oscorp architecture.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[24px] overflow-hidden text-center">
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            className="text-center p-10 bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-elevated)] transition-colors duration-500 flex flex-col justify-center"
                        >
                            <div className="text-[32px] md:text-[40px] font-semibold tracking-tighter mb-2 text-[var(--color-text-main)]">
                                {s.isDecimal
                                    ? <><span>{s.prefix}</span><span>{s.end}</span><span>{s.suffix}</span></>
                                    : <Counter end={s.end} suffix={s.suffix} prefix={s.prefix} />
                                }
                            </div>
                            <div className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
