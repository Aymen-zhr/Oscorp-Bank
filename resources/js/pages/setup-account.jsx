import { useState, useEffect, useRef, useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Phone,
    Briefcase,
    MapPin,
    ArrowRight,
    Check,
    ArrowLeft,
    IdCard,
    Calendar,
    Map,
    Flag,
    Users,
    Camera,
    Loader2,
    ChevronRight,
    User,
    AlertCircle,
    ShieldCheck,
    Sparkles,
    Upload,
    X,
} from 'lucide-react';
import AutocompleteInput from '@/components/AutocompleteInput';
import * as locations from '@/data/locations';

const IconMap = {
    Phone,
    Briefcase,
    MapPin,
    IdCard,
    Calendar,
    Map,
    Flag,
    Users,
    Camera,
    User,
};

const validators = {
    phone: (v) => {
        const c = v.replace(/[\s\-\(\)]/g, '');
        return !c
            ? { v: false, m: 'Required' }
            : /^(\+212\d{9}|0\d{9}|\+\d{9,15})$/.test(c)
              ? { v: true }
              : { v: false, m: 'Invalid format' };
    },
    cin: (v) =>
        !v
            ? { v: false, m: 'Required' }
            : /^[A-Za-z]{1,2}\d{6}$/.test(v.replace(/\s/g, ''))
              ? { v: true }
              : { v: false, m: 'e.g. AB123456' },
    date_of_birth: (v) => {
        if (!v) return { v: false, m: 'Required' };
        const a = new Date().getFullYear() - new Date(v).getFullYear();
        return isNaN(new Date(v).getTime())
            ? { v: false, m: 'Invalid' }
            : a < 18
              ? { v: false, m: 'Must be 18+' }
              : { v: true };
    },
};

const hints = {
    phone: 'e.g. +212 600 000 000',
    job_title: 'Type to search your profession',
    address: 'Your residential area in Morocco',
    cin: '1–2 letters followed by 6 digits',
    date_of_birth: 'You must be at least 18 years old',
    place_of_birth: 'The city where you were born',
    nationality: 'As stated on your official documents',
};

const stepDescriptions = {
    contact: 'Your primary contact number for account alerts',
    professional: 'Your occupation and current address',
    identity: 'Your national ID and date of birth',
    origin: 'Your birth city and nationality',
    personal: 'Basic personal information',
    avatar: 'Add a profile photo (optional)',
    summary: 'Review all your details before submitting',
};

const suggestions = {};

function SuggestInput({
    id,
    type,
    value,
    onChange,
    placeholder,
    icon: Icon,
    error,
    ok,
}) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    const fieldSuggestions = suggestions[id] || [];
    const filtered = fieldSuggestions.filter(
        (s) =>
            !value ||
            s.toLowerCase().includes(value.toLowerCase().replace(/\s/g, '')),
    );

    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target))
                setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={wrapperRef} className="relative">
            {Icon && (
                <Icon
                    className={`pointer-events-none absolute top-1/2 left-3 z-10 h-3.5 w-3.5 -translate-y-1/2 transition-colors ${
                        ok === true
                            ? 'text-emerald-400'
                            : open
                              ? 'text-[var(--color-gold)]'
                              : 'text-[var(--color-text-muted)]/40'
                    }`}
                />
            )}
            <input
                id={id}
                type={type || 'text'}
                value={value}
                autoComplete="off"
                className={`w-full rounded-xl border bg-[var(--color-bg-base)] px-4 py-2.5 pl-9 text-sm text-[var(--color-text-main)] transition-all outline-none placeholder:text-[var(--color-text-muted)]/30 ${
                    error
                        ? 'border-red-500/40'
                        : ok === true
                          ? 'border-emerald-500/40'
                          : open
                            ? 'border-[var(--color-gold)]/60'
                            : 'border-[var(--color-border)]/50'
                }`}
                placeholder={placeholder}
                onFocus={() => setOpen(true)}
                onChange={(e) => {
                    onChange(e.target.value);
                    setOpen(true);
                }}
            />
            <AnimatePresence>
                {ok === true && value && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
                    >
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {open && filtered.length > 0 && (
                    <motion.ul
                        initial={{ opacity: 0, y: 4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-[var(--color-border)]/60 p-1 shadow-xl"
                        style={{
                            background: 'rgba(16,16,16,0.95)',
                            backdropFilter: 'blur(24px)',
                        }}
                    >
                        {filtered.slice(0, 7).map((s, i) => (
                            <motion.li
                                key={s}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.03 }}
                                onClick={() => {
                                    onChange(s);
                                    setOpen(false);
                                }}
                                className="group flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 font-mono text-[12px] text-[var(--color-text-main)] transition-colors hover:bg-[var(--color-gold)]/10 hover:text-[var(--color-gold)]"
                            >
                                <span className="h-1 w-1 flex-shrink-0 rounded-full bg-[var(--color-gold)]/30 transition-colors group-hover:bg-[var(--color-gold)]" />
                                {s}
                            </motion.li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function SetupAccount({ setupConfig }) {
    const [step, setStep] = useState(1);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [validations, setValidations] = useState({});
    const [dragging, setDragging] = useState(false);
    const [validationAttempted, setValidationAttempted] = useState(false);
    const fileInputRef = useRef(null);

    const steps = useMemo(() => {
        const base = setupConfig?.steps || [];
        return [
            ...base,
            { id: 'summary', label: 'Review', icon: 'User', fields: [] },
        ];
    }, [setupConfig]);

    const { data, setData, post, processing, errors } = useForm({
        phone: '',
        job_title: '',
        address: '',
        cin: '',
        date_of_birth: '',
        place_of_birth: '',
        nationality: '',
        gender: '',
        avatar: null,
    });

    useEffect(() => {
        const v = {};
        Object.keys(data).forEach((k) => {
            if (k !== 'avatar') v[k] = validators[k]?.(data[k]);
        });
        setValidations(v);
    }, [data]);

    const isValid = (n) => (!data[n] ? null : (validations[n]?.v ?? true));

    const canProceed = () => {
        const c = steps[step - 1];
        if (c.id === 'summary' || c.id === 'avatar') return true;
        return c.fields
            .filter((f) => f.required)
            .every((f) => isValid(f.name) === true);
    };

    const next = () => {
        if (canProceed() && step < steps.length) setStep((s) => s + 1);
    };
    const prev = () => {
        if (step > 1) setStep((s) => s - 1);
    };

    const processFile = (file) => {
        if (
            file &&
            file.type.startsWith('image/') &&
            file.size <= 2 * 1024 * 1024
        ) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleFileChange = (e) => processFile(e.target.files?.[0]);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        processFile(e.dataTransfer.files?.[0]);
    };

    const submit = (e) => {
        e.preventDefault();
        const all = steps
            .slice(0, -1)
            .flatMap((s) => s.fields)
            .filter((f) => f.required)
            .every((f) => isValid(f.name) === true);
        setValidationAttempted(true);
        if (!all) return;
        post('/setup-account', { forceFormData: true });
    };

    const quickSuggestions = (key) => {
        const all = locations[key] || [];
        if (!all.length) return [];
        const shuffled = [...all].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 5);
    };

    const current = steps[step - 1];
    const CurrentIcon = IconMap[current.icon] || User;
    const totalSteps = Math.max(steps.length - 1, 1);
    const pct = Math.min((step / totalSteps) * 100, 100);

    return (
        <>
            <Head title="OSCORP | Setup Account" />
            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg)] p-4">
                {/* Ambient blobs */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden">
                    <motion.div
                        className="absolute -top-60 -left-60 h-[40rem] w-[40rem] rounded-full blur-[140px]"
                        style={{
                            background:
                                'radial-gradient(circle, rgba(212,175,55,0.07), transparent)',
                        }}
                        animate={{
                            scale: [1, 1.15, 1],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 9,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                    <motion.div
                        className="absolute -right-60 -bottom-60 h-[36rem] w-[36rem] rounded-full blur-[140px]"
                        style={{
                            background:
                                'radial-gradient(circle, rgba(212,175,55,0.05), transparent)',
                        }}
                        animate={{
                            scale: [1.15, 1, 1.15],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 9,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 w-full max-w-3xl"
                >
                    {/* Brand */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)]">
                                <ShieldCheck className="h-3.5 w-3.5 text-[var(--color-gold-fg)]" />
                            </div>
                            <span className="text-sm font-bold tracking-tight text-[var(--color-text-main)]">
                                OSCORP
                            </span>
                            <span className="border-l border-[var(--color-border)]/30 pl-2.5 text-xs text-[var(--color-text-muted)]/50">
                                Account Setup
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-muted)]">
                            <span className="font-semibold text-[var(--color-gold)]">
                                {step}
                            </span>
                            <span className="opacity-40">/</span>
                            <span>{totalSteps}</span>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-6 h-[2px] overflow-hidden rounded-full bg-[var(--color-border)]/30">
                        <motion.div
                            className="h-full rounded-full"
                            style={{
                                background:
                                    'linear-gradient(90deg, var(--color-gold-dark), var(--color-gold))',
                            }}
                            initial={false}
                            animate={{ width: `${pct}%` }}
                            transition={{
                                duration: 0.5,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                        />
                    </div>

                    {/* Main panel */}
                    <div className="grid grid-cols-[220px_1fr] gap-4">
                        {/* Left: Step navigator */}
                        <div className="flex flex-col gap-1 self-start rounded-2xl border border-[var(--color-border)]/40 bg-[var(--color-bg-card)]/40 p-4 backdrop-blur-2xl">
                            <p className="mb-2 px-1 text-[10px] font-semibold tracking-widest text-[var(--color-text-muted)]/50 uppercase">
                                Steps
                            </p>
                            {steps.map((s, i) => {
                                const SI = IconMap[s.icon] || User;
                                const stepNum = i + 1;
                                const isDone = stepNum < step;
                                const isCurrent = stepNum === step;
                                const isLast = i === steps.length - 1;
                                return (
                                    <motion.button
                                        key={s.id}
                                        type="button"
                                        onClick={() => {
                                            if (isDone) setStep(stepNum);
                                        }}
                                        className={`group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-all ${isCurrent ? 'border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/10' : isDone ? 'cursor-pointer opacity-70 hover:bg-white/5 hover:opacity-100' : 'cursor-default opacity-35'}`}
                                    >
                                        <div
                                            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg transition-all ${isCurrent ? 'bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] shadow-[var(--color-gold)]/30 shadow-sm' : isDone ? 'bg-emerald-500/15' : 'bg-[var(--color-border)]/20'}`}
                                        >
                                            {isDone ? (
                                                <Check className="h-3 w-3 text-emerald-400" />
                                            ) : (
                                                <SI
                                                    className={`h-3 w-3 ${isCurrent ? 'text-[var(--color-gold-fg)]' : 'text-[var(--color-text-muted)]'}`}
                                                />
                                            )}
                                        </div>
                                        <span
                                            className={`truncate text-[12px] font-medium ${isCurrent ? 'text-[var(--color-gold)]' : isDone ? 'text-[var(--color-text-main)]' : 'text-[var(--color-text-muted)]'}`}
                                        >
                                            {isLast ? 'Review' : s.label}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Right: Form */}
                        <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-bg-card)]/50 p-6 backdrop-blur-2xl">
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--color-gold)]/[0.025] to-transparent" />

                            {/* Step header */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`hdr-${step}`}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                    className="mb-5"
                                >
                                    <div className="flex items-center gap-3">
                                        <motion.div
                                            key={`icon-${step}`}
                                            initial={{
                                                scale: 0,
                                                opacity: 0,
                                            }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 400,
                                                damping: 20,
                                            }}
                                            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] shadow-[var(--color-gold)]/20 shadow-md"
                                        >
                                            <CurrentIcon className="h-5 w-5 text-[var(--color-gold-fg)]" />
                                        </motion.div>
                                        <div>
                                            <h1 className="text-base font-bold tracking-tight text-[var(--color-text-main)]">
                                                {current.id === 'summary'
                                                    ? 'Review & Confirm'
                                                    : current.label}
                                            </h1>
                                            <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
                                                {stepDescriptions[current.id] ||
                                                    ''}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <form onSubmit={submit}>
                                <div className="min-h-[220px]">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={current.id}
                                            initial={{ opacity: 0, x: 16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -16 }}
                                            transition={{
                                                duration: 0.28,
                                                ease: [0.16, 1, 0.3, 1],
                                            }}
                                            className="space-y-4"
                                        >
                                            {/* SUMMARY STEP */}
                                            {current.id === 'summary' ? (
                                                <div className="space-y-4">
                                                    {/* Validation warning */}
                                                    {validationAttempted &&
                                                        !steps
                                                            .slice(0, -1)
                                                            .flatMap(
                                                                (s) => s.fields,
                                                            )
                                                            .filter(
                                                                (f) =>
                                                                    f.required,
                                                            )
                                                            .every((f) =>
                                                                isValid(f.name),
                                                            ) && (
                                                            <motion.div
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: -8,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3"
                                                            >
                                                                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                                                                <div className="text-[12px] text-amber-200">
                                                                    Some
                                                                    required
                                                                    fields are
                                                                    missing or
                                                                    invalid.
                                                                    Please go
                                                                    back and
                                                                    complete all
                                                                    steps.
                                                                </div>
                                                            </motion.div>
                                                        )}

                                                    {/* Server errors */}
                                                    {Object.keys(errors)
                                                        .length > 0 && (
                                                        <motion.div
                                                            initial={{
                                                                opacity: 0,
                                                                y: -8,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                y: 0,
                                                            }}
                                                            className="space-y-1.5 rounded-xl border border-red-500/30 bg-red-500/5 p-3"
                                                        >
                                                            {Object.entries(
                                                                errors,
                                                            ).map(
                                                                ([
                                                                    field,
                                                                    msg,
                                                                ]) => (
                                                                    <p
                                                                        key={
                                                                            field
                                                                        }
                                                                        className="flex items-center gap-2 text-[12px] text-red-400"
                                                                    >
                                                                        <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                                                                        {msg}
                                                                    </p>
                                                                ),
                                                            )}
                                                        </motion.div>
                                                    )}

                                                    <div className="grid grid-cols-2 gap-2">
                                                        {steps
                                                            .slice(0, -1)
                                                            .flatMap(
                                                                (s) => s.fields,
                                                            )
                                                            .filter(
                                                                (f) =>
                                                                    f.type !==
                                                                    'file',
                                                            )
                                                            .map((f, i) => {
                                                                const FI =
                                                                    IconMap[
                                                                        f.icon
                                                                    ] || User;
                                                                const ok =
                                                                    isValid(
                                                                        f.name,
                                                                    );
                                                                const err =
                                                                    errors[
                                                                        f.name
                                                                    ];
                                                                return (
                                                                    <motion.div
                                                                        key={
                                                                            f.name
                                                                        }
                                                                        initial={{
                                                                            opacity: 0,
                                                                            y: 8,
                                                                        }}
                                                                        animate={{
                                                                            opacity: 1,
                                                                            y: 0,
                                                                        }}
                                                                        transition={{
                                                                            delay:
                                                                                i *
                                                                                0.04,
                                                                        }}
                                                                        className={`flex items-start gap-2.5 rounded-xl border p-3 ${
                                                                            err
                                                                                ? 'border-red-500/30 bg-red-500/5'
                                                                                : ok ===
                                                                                        false &&
                                                                                    validationAttempted
                                                                                  ? 'border-amber-500/30 bg-amber-500/5'
                                                                                  : 'border-[var(--color-border)]/30 bg-white/[0.025]'
                                                                        }`}
                                                                    >
                                                                        <div
                                                                            className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${
                                                                                err
                                                                                    ? 'bg-red-500/10'
                                                                                    : ok ===
                                                                                        true
                                                                                      ? 'bg-emerald-500/10'
                                                                                      : 'bg-[var(--color-border)]/10'
                                                                            }`}
                                                                        >
                                                                            <FI
                                                                                className={`h-3.5 w-3.5 ${
                                                                                    err
                                                                                        ? 'text-red-400'
                                                                                        : ok ===
                                                                                            true
                                                                                          ? 'text-emerald-400'
                                                                                          : 'text-[var(--color-text-muted)]/40'
                                                                                }`}
                                                                            />
                                                                        </div>
                                                                        <div className="min-w-0 flex-1">
                                                                            <p className="mb-0.5 text-[10px] tracking-wider text-[var(--color-text-muted)] uppercase">
                                                                                {
                                                                                    f.label
                                                                                }
                                                                            </p>
                                                                            <div className="flex items-center gap-1">
                                                                                <p
                                                                                    className={`truncate text-[12px] font-semibold ${
                                                                                        err
                                                                                            ? 'text-red-400'
                                                                                            : ok ===
                                                                                                true
                                                                                              ? 'text-[var(--color-text-main)]'
                                                                                              : 'text-amber-400'
                                                                                    }`}
                                                                                >
                                                                                    {data[
                                                                                        f
                                                                                            .name
                                                                                    ] ||
                                                                                        '—'}
                                                                                </p>
                                                                                {ok ===
                                                                                    true &&
                                                                                    !err && (
                                                                                        <Check className="h-3 w-3 flex-shrink-0 text-emerald-400" />
                                                                                    )}
                                                                            </div>
                                                                            {err && (
                                                                                <p className="mt-1 flex items-center gap-1 text-[10px] text-red-400">
                                                                                    <AlertCircle className="h-2.5 w-2.5" />
                                                                                    {
                                                                                        err
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </motion.div>
                                                                );
                                                            })}
                                                    </div>
                                                </div>
                                            ) : /* AVATAR STEP */
                                            current.id === 'avatar' ? (
                                                <div className="flex flex-col items-center gap-4 py-2">
                                                    <motion.div
                                                        className={`group relative h-28 w-28 cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all ${dragging ? 'scale-105 border-[var(--color-gold)]' : 'border-[var(--color-border)]/50 hover:border-[var(--color-gold)]/50'}`}
                                                        whileHover={{
                                                            scale: 1.03,
                                                        }}
                                                        onDragOver={(e) => {
                                                            e.preventDefault();
                                                            setDragging(true);
                                                        }}
                                                        onDragLeave={() =>
                                                            setDragging(false)
                                                        }
                                                        onDrop={handleDrop}
                                                        onClick={() =>
                                                            fileInputRef.current?.click()
                                                        }
                                                    >
                                                        {avatarPreview ? (
                                                            <>
                                                                <img
                                                                    src={
                                                                        avatarPreview
                                                                    }
                                                                    alt="Avatar"
                                                                    className="h-full w-full object-cover"
                                                                />
                                                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                                                                    <Camera className="h-5 w-5 text-white" />
                                                                    <span className="text-[10px] text-white/80">
                                                                        Change
                                                                    </span>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[var(--color-bg-base)]">
                                                                <Upload className="h-6 w-6 text-[var(--color-text-muted)]/30" />
                                                                <span className="px-2 text-center text-[10px] text-[var(--color-text-muted)]/40">
                                                                    Drop or
                                                                    click
                                                                </span>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                    {avatarPreview && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setAvatarPreview(
                                                                    null,
                                                                );
                                                                setData(
                                                                    'avatar',
                                                                    null,
                                                                );
                                                            }}
                                                            className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)] transition-colors hover:text-red-400"
                                                        >
                                                            <X className="h-3 w-3" />{' '}
                                                            Remove photo
                                                        </button>
                                                    )}
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        onChange={
                                                            handleFileChange
                                                        }
                                                        className="hidden"
                                                        accept="image/*"
                                                    />
                                                    <p className="text-[11px] text-[var(--color-text-muted)]/50">
                                                        PNG, JPG up to 2MB ·
                                                        Optional
                                                    </p>
                                                </div>
                                            ) : /* GENDER STEP — card picker */
                                            current.fields.some(
                                                  (f) => f.type === 'select',
                                              ) ? (
                                                current.fields.map((f) => (
                                                    <div
                                                        key={f.name}
                                                        className="space-y-1.5"
                                                    >
                                                        <label className="px-0.5 text-[11px] font-semibold tracking-widest text-[var(--color-text-muted)] uppercase">
                                                            {f.label}
                                                        </label>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {(
                                                                f.options || []
                                                            ).map((o) => {
                                                                const selected =
                                                                    data[
                                                                        f.name
                                                                    ] ===
                                                                    o.value;
                                                                return (
                                                                    <motion.button
                                                                        key={
                                                                            o.value
                                                                        }
                                                                        type="button"
                                                                        whileHover={{
                                                                            scale: 1.02,
                                                                        }}
                                                                        whileTap={{
                                                                            scale: 0.97,
                                                                        }}
                                                                        onClick={() =>
                                                                            setData(
                                                                                f.name,
                                                                                o.value,
                                                                            )
                                                                        }
                                                                        className={`flex items-center justify-center gap-2 rounded-xl border py-4 text-sm font-semibold transition-all ${selected ? 'border-[var(--color-gold)]/50 bg-[var(--color-gold)]/10 text-[var(--color-gold)]' : 'border-[var(--color-border)]/40 text-[var(--color-text-muted)] hover:border-[var(--color-border)] hover:bg-white/5'}`}
                                                                    >
                                                                        {selected && (
                                                                            <Check className="h-3.5 w-3.5" />
                                                                        )}
                                                                        {
                                                                            o.label
                                                                        }
                                                                    </motion.button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                /* REGULAR FIELDS */
                                                current.fields.map((f, idx) => {
                                                    const FI =
                                                        IconMap[f.icon] || User;
                                                    const ok = isValid(f.name);
                                                    const has = !!data[f.name];
                                                    const err = errors[f.name];
                                                    return (
                                                        <motion.div
                                                            key={f.name}
                                                            initial={{
                                                                opacity: 0,
                                                                y: 10,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                y: 0,
                                                            }}
                                                            transition={{
                                                                delay:
                                                                    idx * 0.07,
                                                            }}
                                                            className="space-y-1.5"
                                                        >
                                                            <label
                                                                htmlFor={f.name}
                                                                className="flex items-center gap-1.5 px-0.5 text-[11px] font-semibold tracking-widest text-[var(--color-text-muted)] uppercase"
                                                            >
                                                                <FI className="h-3 w-3" />
                                                                {f.label}
                                                                {f.required && (
                                                                    <span className="text-[var(--color-gold)]/60">
                                                                        *
                                                                    </span>
                                                                )}
                                                            </label>

                                                            {f.type ===
                                                            'autocomplete' ? (
                                                                <>
                                                                    <AutocompleteInput
                                                                        id={
                                                                            f.name
                                                                        }
                                                                        value={
                                                                            data[
                                                                                f
                                                                                    .name
                                                                            ]
                                                                        }
                                                                        onChange={(
                                                                            v,
                                                                        ) =>
                                                                            setData(
                                                                                f.name,
                                                                                v,
                                                                            )
                                                                        }
                                                                        options={
                                                                            locations[
                                                                                f
                                                                                    .options_key
                                                                            ] ||
                                                                            []
                                                                        }
                                                                        placeholder={
                                                                            f.placeholder
                                                                        }
                                                                        icon={
                                                                            FI
                                                                        }
                                                                        label={
                                                                            f.label
                                                                        }
                                                                        error={
                                                                            err
                                                                        }
                                                                    />
                                                                    <AnimatePresence>
                                                                        {!has &&
                                                                            !err && (
                                                                                <motion.div
                                                                                    initial={{
                                                                                        opacity: 0,
                                                                                        y: 4,
                                                                                    }}
                                                                                    animate={{
                                                                                        opacity: 1,
                                                                                        y: 0,
                                                                                    }}
                                                                                    exit={{
                                                                                        opacity: 0,
                                                                                    }}
                                                                                    className="flex flex-wrap gap-1.5 pt-1"
                                                                                >
                                                                                    {quickSuggestions(
                                                                                        f.options_key,
                                                                                    ).map(
                                                                                        (
                                                                                            s,
                                                                                            si,
                                                                                        ) => (
                                                                                            <motion.button
                                                                                                key={
                                                                                                    s
                                                                                                }
                                                                                                type="button"
                                                                                                initial={{
                                                                                                    opacity: 0,
                                                                                                    scale: 0.85,
                                                                                                }}
                                                                                                animate={{
                                                                                                    opacity: 1,
                                                                                                    scale: 1,
                                                                                                }}
                                                                                                transition={{
                                                                                                    delay:
                                                                                                        si *
                                                                                                        0.04,
                                                                                                }}
                                                                                                whileHover={{
                                                                                                    scale: 1.06,
                                                                                                    y: -1,
                                                                                                }}
                                                                                                whileTap={{
                                                                                                    scale: 0.94,
                                                                                                }}
                                                                                                onClick={() =>
                                                                                                    setData(
                                                                                                        f.name,
                                                                                                        s,
                                                                                                    )
                                                                                                }
                                                                                                className="cursor-pointer rounded-lg border border-[var(--color-border)]/40 bg-white/[0.025] px-2.5 py-1 text-[10px] text-[var(--color-text-muted)] transition-all hover:border-[var(--color-gold)]/30 hover:bg-[var(--color-gold)]/5 hover:text-[var(--color-gold)]"
                                                                                            >
                                                                                                {
                                                                                                    s
                                                                                                }
                                                                                            </motion.button>
                                                                                        ),
                                                                                    )}
                                                                                </motion.div>
                                                                            )}
                                                                    </AnimatePresence>
                                                                </>
                                                            ) : suggestions[
                                                                  f.name
                                                              ] ? (
                                                                <SuggestInput
                                                                    id={f.name}
                                                                    type={
                                                                        f.type
                                                                    }
                                                                    value={
                                                                        data[
                                                                            f
                                                                                .name
                                                                        ]
                                                                    }
                                                                    onChange={(
                                                                        v,
                                                                    ) =>
                                                                        setData(
                                                                            f.name,
                                                                            v,
                                                                        )
                                                                    }
                                                                    placeholder={
                                                                        f.placeholder ||
                                                                        hints[
                                                                            f
                                                                                .name
                                                                        ]
                                                                    }
                                                                    icon={FI}
                                                                    error={err}
                                                                    ok={ok}
                                                                />
                                                            ) : (
                                                                <div className="relative">
                                                                    <input
                                                                        id={
                                                                            f.name
                                                                        }
                                                                        type={
                                                                            f.type
                                                                        }
                                                                        value={
                                                                            data[
                                                                                f
                                                                                    .name
                                                                            ]
                                                                        }
                                                                        className={`w-full rounded-xl border bg-[var(--color-bg-base)] px-4 py-2.5 pl-9 text-sm text-[var(--color-text-main)] transition-all outline-none placeholder:text-[var(--color-text-muted)]/30 ${err ? 'border-red-500/40' : ok === true ? 'border-emerald-500/40' : 'border-[var(--color-border)]/50 focus:border-[var(--color-gold)]/60'}`}
                                                                        placeholder={
                                                                            f.placeholder ||
                                                                            hints[
                                                                                f
                                                                                    .name
                                                                            ]
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            setData(
                                                                                f.name,
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                    />
                                                                    <FI
                                                                        className={`absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 transition-colors ${ok === true ? 'text-emerald-400' : 'text-[var(--color-text-muted)]/40'}`}
                                                                    />
                                                                    <AnimatePresence>
                                                                        {ok ===
                                                                            true &&
                                                                            has && (
                                                                                <motion.div
                                                                                    initial={{
                                                                                        scale: 0,
                                                                                    }}
                                                                                    animate={{
                                                                                        scale: 1,
                                                                                    }}
                                                                                    exit={{
                                                                                        scale: 0,
                                                                                    }}
                                                                                    className="absolute top-1/2 right-3 -translate-y-1/2"
                                                                                >
                                                                                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                                                                                </motion.div>
                                                                            )}
                                                                    </AnimatePresence>
                                                                </div>
                                                            )}

                                                            <AnimatePresence>
                                                                {err && (
                                                                    <motion.p
                                                                        initial={{
                                                                            opacity: 0,
                                                                            y: -4,
                                                                        }}
                                                                        animate={{
                                                                            opacity: 1,
                                                                            y: 0,
                                                                        }}
                                                                        exit={{
                                                                            opacity: 0,
                                                                        }}
                                                                        className="flex items-center gap-1 pl-1 text-[10px] text-red-400"
                                                                    >
                                                                        <AlertCircle className="h-3 w-3" />
                                                                        {err}
                                                                    </motion.p>
                                                                )}
                                                                {!err &&
                                                                    ok ===
                                                                        false &&
                                                                    has && (
                                                                        <motion.p
                                                                            initial={{
                                                                                opacity: 0,
                                                                                y: -4,
                                                                            }}
                                                                            animate={{
                                                                                opacity: 1,
                                                                                y: 0,
                                                                            }}
                                                                            exit={{
                                                                                opacity: 0,
                                                                            }}
                                                                            className="pl-1 text-[10px] text-amber-400"
                                                                        >
                                                                            {
                                                                                validations[
                                                                                    f
                                                                                        .name
                                                                                ]
                                                                                    ?.m
                                                                            }
                                                                        </motion.p>
                                                                    )}
                                                                {!has &&
                                                                    !err &&
                                                                    hints[
                                                                        f.name
                                                                    ] &&
                                                                    !suggestions[
                                                                        f.name
                                                                    ] && (
                                                                        <motion.p
                                                                            initial={{
                                                                                opacity: 0,
                                                                            }}
                                                                            animate={{
                                                                                opacity: 1,
                                                                            }}
                                                                            exit={{
                                                                                opacity: 0,
                                                                            }}
                                                                            className="pl-1 text-[10px] text-[var(--color-text-muted)]/40"
                                                                        >
                                                                            {
                                                                                hints[
                                                                                    f
                                                                                        .name
                                                                                ]
                                                                            }
                                                                        </motion.p>
                                                                    )}
                                                            </AnimatePresence>
                                                        </motion.div>
                                                    );
                                                })
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Navigation */}
                                <div className="mt-6 flex gap-2.5 border-t border-[var(--color-border)]/30 pt-4">
                                    {step > 1 && (
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.96 }}
                                            onClick={prev}
                                            className="rounded-xl border border-[var(--color-border)]/50 p-2.5 text-[var(--color-text-muted)] transition-colors hover:bg-white/5 hover:text-[var(--color-text-main)]"
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                        </motion.button>
                                    )}

                                    {step === steps.length ? (
                                        <motion.button
                                            type="submit"
                                            disabled={processing}
                                            whileHover={{
                                                scale: processing ? 1 : 1.02,
                                            }}
                                            whileTap={{
                                                scale: processing ? 1 : 0.98,
                                            }}
                                            className="relative flex-1 overflow-hidden rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50"
                                            style={{
                                                background:
                                                    'linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))',
                                                color: '#000',
                                            }}
                                        >
                                            <motion.div
                                                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                                animate={{ x: ['0%', '200%'] }}
                                                transition={{
                                                    duration: 2.5,
                                                    repeat: Infinity,
                                                    repeatDelay: 1.5,
                                                }}
                                            />
                                            {processing ? (
                                                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                                            ) : (
                                                <span className="flex items-center justify-center gap-2">
                                                    <Sparkles className="h-4 w-4" />
                                                    Complete Setup
                                                </span>
                                            )}
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={next}
                                            disabled={!canProceed()}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40"
                                            style={{
                                                background: canProceed()
                                                    ? 'linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))'
                                                    : undefined,
                                                color: canProceed()
                                                    ? '#000'
                                                    : undefined,
                                                border: canProceed()
                                                    ? 'none'
                                                    : '1px solid rgba(255,255,255,0.1)',
                                                backgroundColor: canProceed()
                                                    ? undefined
                                                    : 'transparent',
                                            }}
                                        >
                                            <span
                                                className={
                                                    canProceed()
                                                        ? 'text-[var(--color-gold-fg)]'
                                                        : 'text-[var(--color-text-muted)]'
                                                }
                                            >
                                                Continue
                                            </span>
                                            <ArrowRight
                                                className={`h-4 w-4 ${canProceed() ? 'text-[var(--color-gold-fg)]' : 'text-[var(--color-text-muted)]'}`}
                                            />
                                        </motion.button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    <p className="mt-5 text-center text-[10px] tracking-widest text-[var(--color-text-muted)]/25 uppercase">
                        OSCORP Private Banking · Secured
                    </p>
                </motion.div>
            </div>
        </>
    );
}
