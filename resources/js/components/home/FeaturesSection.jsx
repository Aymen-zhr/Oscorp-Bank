import { motion } from 'framer-motion';
import {
    Sparkles,
    Shield,
    ArrowRightLeft,
    FileText,
    Landmark,
    Receipt,
    CreditCard,
    TrendingUp,
    ArrowRight,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const featureIcons = [
    Sparkles,
    CreditCard,
    ArrowRightLeft,
    Landmark,
    Receipt,
    FileText,
];

export default function FeaturesSection() {
    const { t } = useTranslation();

    const features = [
        {
            icon: featureIcons[0],
            title: t('home.features.items.0.title'),
            desc: t('home.features.items.0.desc'),
        },
        {
            icon: featureIcons[1],
            title: t('home.features.items.1.title'),
            desc: t('home.features.items.1.desc'),
        },
        {
            icon: featureIcons[2],
            title: t('home.features.items.2.title'),
            desc: t('home.features.items.2.desc'),
        },
        {
            icon: featureIcons[3],
            title: t('home.features.items.3.title'),
            desc: t('home.features.items.3.desc'),
        },
        {
            icon: featureIcons[4],
            title: t('home.features.items.4.title'),
            desc: t('home.features.items.4.desc'),
        },
        {
            icon: featureIcons[5],
            title: t('home.features.items.5.title'),
            desc: t('home.features.items.5.desc'),
        },
    ];
    return (
        <section
            id="features"
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
                                {t('home.features.badge')}
                            </span>
                        </div>
                        <h2 className="text-[40px] leading-[1.1] font-semibold tracking-tight text-[var(--color-text-main)] md:text-[56px]">
                            {t('home.features.title1')}
                            <br />
                            <span className="font-light text-[var(--color-text-muted)] italic">
                                {t('home.features.title2')}
                            </span>
                        </h2>
                    </div>
                    <p className="max-w-sm text-[15px] font-medium text-[var(--color-text-muted)] md:text-right">
                        {t('home.features.subtitle')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-2 lg:grid-cols-3">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            className="group relative bg-[var(--color-bg-base)] p-10 transition-colors duration-500 hover:bg-[var(--color-bg-elevated)]"
                        >
                            <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] transition-colors duration-500 group-hover:border-[var(--color-gold)]">
                                <f.icon className="h-4 w-4 text-[var(--color-text-main)] transition-colors duration-500 group-hover:text-[var(--color-gold)]" />
                            </div>
                            <h3 className="mb-3 text-[15px] font-bold tracking-tight text-[var(--color-text-main)]">
                                {f.title}
                            </h3>
                            <p className="mb-8 text-[13px] leading-relaxed font-medium text-[var(--color-text-muted)]">
                                {f.desc}
                            </p>

                            <div className="flex cursor-pointer items-center gap-2 text-[11px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase transition-colors duration-500 group-hover:text-[var(--color-gold)]">
                                {t('home.features.examine')}{' '}
                                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
