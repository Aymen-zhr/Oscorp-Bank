import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

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
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [inView, end]);

    return (
        <span ref={ref}>
            {prefix}
            {count.toLocaleString()}
            {suffix}
        </span>
    );
}

export default function StatsSection() {
    const { t } = useTranslation();

    const stats = [
        {
            label: t('home.stats.labels.elite_clients'),
            end: 12000,
            suffix: '+',
            prefix: '',
        },
        {
            label: t('home.stats.labels.assets_managed'),
            end: 4.2,
            suffix: 'B',
            prefix: '$',
            isDecimal: true,
        },
        {
            label: t('home.stats.labels.transactions_per_day'),
            end: 98000,
            suffix: '+',
            prefix: '',
        },
        {
            label: t('home.stats.labels.system_uptime'),
            end: 99.9,
            suffix: '%',
            prefix: '',
            isDecimal: true,
        },
    ];
    return (
        <section
            id="stats"
            className="border-t border-[var(--color-border)] px-6 py-32"
        >
            <div className="mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-20 text-center"
                >
                    <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-2 text-[10px] font-bold tracking-[0.2em] uppercase">
                        <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
                        <span className="text-[var(--color-text-main)]">
                            {t('home.stats.badge')}
                        </span>
                    </div>
                    <h2 className="mb-6 text-[40px] leading-[1.1] font-semibold tracking-tight text-[var(--color-text-main)] md:text-[56px]">
                        {t('home.stats.title')}
                    </h2>
                    <p className="mx-auto max-w-lg text-[15px] font-medium text-[var(--color-text-muted)]">
                        {t('home.stats.subtitle')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-[var(--color-border)] text-center lg:grid-cols-4">
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            className="flex flex-col justify-center bg-[var(--color-bg-card)] p-10 text-center transition-colors duration-500 hover:bg-[var(--color-bg-elevated)]"
                        >
                            <div className="mb-2 text-[32px] font-semibold tracking-tighter text-[var(--color-text-main)] md:text-[40px]">
                                {s.isDecimal ? (
                                    <>
                                        <span>{s.prefix}</span>
                                        <span>{s.end}</span>
                                        <span>{s.suffix}</span>
                                    </>
                                ) : (
                                    <Counter
                                        end={s.end}
                                        suffix={s.suffix}
                                        prefix={s.prefix}
                                    />
                                )}
                            </div>
                            <div className="text-[11px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase">
                                {s.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
