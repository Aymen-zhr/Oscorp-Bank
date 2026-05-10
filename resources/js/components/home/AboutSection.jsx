import { motion } from 'framer-motion';
import { Shield, Brain, Award } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const pillarIcons = [Shield, Brain, Award];

export default function AboutSection() {
    const { t } = useTranslation();

    const pillars = [
        {
            icon: pillarIcons[0],
            title: t('home.about.pillars.0.title'),
            desc: t('home.about.pillars.0.desc'),
        },
        {
            icon: pillarIcons[1],
            title: t('home.about.pillars.1.title'),
            desc: t('home.about.pillars.1.desc'),
        },
        {
            icon: pillarIcons[2],
            title: t('home.about.pillars.2.title'),
            desc: t('home.about.pillars.2.desc'),
        },
    ];
    return (
        <section
            id="about"
            className="relative overflow-hidden border-t border-[var(--color-border)] px-6 py-32"
        >
            <div className="relative z-10 mx-auto max-w-7xl">
                <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-2 text-[10px] font-bold tracking-[0.2em] uppercase">
                            <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-text-muted)]" />
                            <span className="text-[var(--color-text-main)]">
                                {t('home.about.badge')}
                            </span>
                        </div>
                        <h2 className="mb-8 text-[40px] leading-[1.1] font-semibold tracking-tight text-[var(--color-text-main)] md:text-[56px]">
                            {t('home.about.title1')}
                            <br />
                            <span className="font-light text-[var(--color-text-muted)] italic">
                                {t('home.about.title2')}
                            </span>
                        </h2>
                        <p className="mb-6 max-w-md text-[15px] leading-relaxed font-medium text-[var(--color-text-muted)]">
                            {t('home.about.paragraph1')}
                        </p>
                        <p className="max-w-md text-[15px] leading-relaxed font-medium text-[var(--color-text-muted)]">
                            {t('home.about.paragraph2')}
                        </p>

                        <div className="mt-8 grid grid-cols-3 gap-4 border-t border-[var(--color-border)] pt-6 sm:gap-8 md:mt-12 md:pt-8">
                            {[
                                {
                                    value: t('home.about.stats.0.value'),
                                    label: t('home.about.stats.0.label'),
                                },
                                {
                                    value: t('home.about.stats.1.value'),
                                    label: t('home.about.stats.1.label'),
                                },
                                {
                                    value: t('home.about.stats.2.value'),
                                    label: t('home.about.stats.2.label'),
                                },
                            ].map((s) => (
                                <div key={s.label}>
                                    <div className="text-[24px] font-semibold tracking-tight text-[var(--color-text-main)]">
                                        {s.value}
                                    </div>
                                    <div className="mt-1 text-[11px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase">
                                        {s.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="flex flex-col gap-px overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-[var(--color-border)]">
                        {pillars.map((p, i) => (
                            <motion.div
                                key={p.title}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                className="group flex gap-6 bg-[var(--color-bg-card)] p-8 transition-colors duration-500 hover:bg-[var(--color-bg-elevated)]"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-base)] transition-colors duration-500 group-hover:border-[var(--color-gold)]">
                                    <p.icon className="h-4 w-4 text-[var(--color-text-main)] transition-colors duration-500 group-hover:text-[var(--color-gold)]" />
                                </div>
                                <div>
                                    <div className="mb-2 text-[14px] font-bold tracking-tight text-[var(--color-text-main)]">
                                        {p.title}
                                    </div>
                                    <div className="text-[13px] leading-relaxed font-medium text-[var(--color-text-muted)]">
                                        {p.desc}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
