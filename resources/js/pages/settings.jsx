import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Lock,
    Bell,
    Shield,
    Globe,
    Download,
    Trash2,
    Check,
    Camera,
    Loader2,
    AlertCircle,
    Eye,
    EyeOff,
    Upload,
    X,
    ImageIcon,
    Sparkles,
    ChevronRight,
    Phone,
    AtSign,
    Briefcase,
    MapPin,
    IdCard,
    Calendar,
    Map,
    Flag,
    Users,
    Palette,
    Sun,
    Moon,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { themes, themeNames } from '@/config/themes';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import UserAvatar from '@/components/dashboard/UserAvatar';
import AutocompleteInput from '@/components/AutocompleteInput';
import {
    nationalities,
    moroccanCities,
    jobTitles,
    moroccanAddresses,
} from '@/data/locations';
import { DICEBEAR_BASE_URL, TIMEOUTS, ROUTES } from '@/constants';

export default function Settings({ user, preferences, security }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('profile');
    const [exporting, setExporting] = useState(false);
    const fileInputRef = useRef(null);

    // --- Profile Form ---
    const profileForm = useForm({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || 'adventurer',
        phone: user.phone || '',
        tag: user.tag || '',
        job_title: user.job_title || '',
        address: user.address || '',
        cin: user.cin || '',
        date_of_birth: user.date_of_birth || '',
        place_of_birth: user.place_of_birth || '',
        nationality: user.nationality || '',
        gender: user.gender || '',
    });

    const [avatarPreview, setAvatarPreview] = useState(
        user.avatar?.startsWith('/')
            ? user.avatar
            : `${DICEBEAR_BASE_URL}/${user.avatar || 'adventurer'}/svg?seed=${user.name}&backgroundColor=111827`,
    );

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            profileForm.setData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.post(ROUTES.settings + '/profile', {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    // --- Password Form ---
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.post(ROUTES.settings + '/password', {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    // --- Preferences Form ---
    const preferencesForm = useForm({
        currency: preferences.currency,
        timezone: preferences.timezone,
        notifications: preferences.notifications,
    });

    const handlePreferencesSubmit = (e) => {
        e.preventDefault();
        preferencesForm.post(ROUTES.settings + '/preferences', {
            preserveScroll: true,
        });
    };

    // --- Actions ---
    const handleExport = () => {
        setExporting(true);
        setTimeout(() => setExporting(false), TIMEOUTS.copyFeedback);
    };

    const tabs = [
        {
            id: 'profile',
            label: 'Profile',
            icon: User,
            desc: 'Personal details & avatar',
        },
        {
            id: 'security',
            label: 'Security',
            icon: Shield,
            desc: 'Password & protection',
        },
        {
            id: 'preferences',
            label: 'Preferences',
            icon: Bell,
            desc: 'System & notifications',
        },
        {
            id: 'appearance',
            label: 'Appearance',
            icon: Palette,
            desc: 'Themes & display',
        },
        {
            id: 'data',
            label: 'Data',
            icon: Download,
            desc: 'Exports & privacy',
        },
    ];

    const { themeName, setTheme, isDark, toggleTheme } = useTheme();

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[var(--color-bg-base)]">
            <Head title="OSCORP | Settings" />
            <Sidebar active="settings" />

            <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
                {/* Background Glows */}
                <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-[var(--color-gold)]/5 blur-[120px]" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-blue-500/5 blur-[100px]" />

                <Topbar />

                <div className="custom-scrollbar relative z-10 flex-1 overflow-y-auto p-6 pb-32 md:p-10 md:pb-10">
                    <div className="mx-auto max-w-5xl">
                        <header className="mb-10">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-2 flex items-center gap-4"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] shadow-[0_8px_20px_rgba(212,175,55,0.3)]">
                                    <Sparkles className="h-6 w-6 text-[var(--color-gold-fg)]" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-main)]">
                                        Account Architecture
                                    </h1>
                                    <p className="text-[14px] font-medium text-[var(--color-text-muted)]">
                                        Fine-tune your OSCORP experience
                                    </p>
                                </div>
                            </motion.div>

                            {flash?.success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-[14px] font-semibold text-emerald-400 backdrop-blur-md"
                                >
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20">
                                        <Check className="h-4 w-4" />
                                    </div>
                                    {flash.success}
                                </motion.div>
                            )}
                        </header>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
                            {/* Navigation */}
                            <div className="space-y-2">
                                {tabs.map((tab) => (
                                    <motion.button
                                        key={tab.id}
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`group relative flex w-full items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 ${
                                            activeTab === tab.id
                                                ? 'shadow-lg'
                                                : 'hover:bg-[var(--color-bg-elevated)]'
                                        }`}
                                        style={
                                            activeTab === tab.id
                                                ? {
                                                      background:
                                                          'linear-gradient(135deg, var(--color-bg-card), var(--color-bg-elevated))',
                                                      border: '1px solid var(--color-border)',
                                                  }
                                                : {
                                                      color: 'var(--color-text-muted)',
                                                  }
                                        }
                                    >
                                        {activeTab === tab.id && (
                                            <motion.div
                                                layoutId="activeTabGlow"
                                                className="absolute inset-0 -z-10 rounded-2xl bg-[var(--color-gold)]/5 blur-md"
                                            />
                                        )}
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                                                activeTab === tab.id
                                                    ? 'bg-[var(--color-gold)] text-[var(--color-gold-fg)] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                                                    : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] group-hover:text-[var(--color-text-main)]'
                                            }`}
                                        >
                                            <tab.icon className="h-5 w-5" />
                                        </div>
                                        <div className="text-left">
                                            <div
                                                className={`text-[14px] font-bold ${activeTab === tab.id ? 'text-[var(--color-text-main)]' : ''}`}
                                            >
                                                {tab.label}
                                            </div>
                                            <div className="w-32 truncate text-[11px] font-medium opacity-60">
                                                {tab.desc}
                                            </div>
                                        </div>
                                        {activeTab === tab.id && (
                                            <ChevronRight className="ml-auto h-4 w-4 text-[var(--color-gold)]" />
                                        )}
                                    </motion.button>
                                ))}
                            </div>

                            {/* Content Area */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{
                                        duration: 0.4,
                                        ease: 'circOut',
                                    }}
                                    className="relative overflow-hidden rounded-[32px] border border-[var(--color-border)] p-8 backdrop-blur-xl md:p-10"
                                    style={{
                                        background:
                                            'linear-gradient(165deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                                    }}
                                >
                                    {/* Glassmorphism Shine */}
                                    <div className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

                                    {/* ── PROFILE TAB ── */}
                                    {activeTab === 'profile' && (
                                        <form
                                            onSubmit={handleProfileSubmit}
                                            className="relative z-10"
                                        >
                                            <div className="mb-12 flex flex-col items-start gap-10 md:flex-row md:items-center">
                                                <div className="group relative">
                                                    <motion.div
                                                        whileHover={{
                                                            scale: 1.05,
                                                        }}
                                                        className="relative h-32 w-32 overflow-hidden rounded-[32px] shadow-2xl ring-4 ring-[var(--color-gold)]/20"
                                                    >
                                                        {profileForm.data
                                                            .avatar instanceof
                                                        File ? (
                                                            <img
                                                                src={
                                                                    avatarPreview
                                                                }
                                                                alt={user.name}
                                                                className="h-full w-full bg-[var(--color-bg-base)] object-cover"
                                                            />
                                                        ) : (
                                                            <UserAvatar
                                                                user={{
                                                                    ...user,
                                                                    avatar: profileForm
                                                                        .data
                                                                        .avatar,
                                                                }}
                                                                size="w-full h-full"
                                                                className="rounded-none shadow-none ring-0"
                                                            />
                                                        )}
                                                        <div
                                                            onClick={() =>
                                                                fileInputRef.current?.click()
                                                            }
                                                            className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/60 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100"
                                                        >
                                                            <Camera className="mb-1 h-8 w-8 text-[var(--color-gold)]" />
                                                            <span className="text-[10px] font-bold tracking-tighter text-white uppercase">
                                                                Change
                                                            </span>
                                                        </div>

                                                        {profileForm.processing && (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                                                <Loader2 className="h-8 w-8 animate-spin text-[var(--color-gold)]" />
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                </div>

                                                <div className="flex-1 space-y-4">
                                                    <div>
                                                        <h3 className="mb-1 text-[18px] font-bold text-[var(--color-text-main)]">
                                                            Profile Identity
                                                        </h3>
                                                        <p className="mb-4 text-[13px] font-medium text-[var(--color-text-muted)]">
                                                            Click the avatar
                                                            preview to upload a
                                                            custom holographic
                                                            identifier.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold tracking-[2px] text-[var(--color-gold)] uppercase">
                                                            Full Name
                                                        </label>
                                                        <div className="group relative">
                                                            <User className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-gold)]" />
                                                            <input
                                                                type="text"
                                                                value={
                                                                    profileForm
                                                                        .data
                                                                        .name
                                                                }
                                                                onChange={(e) =>
                                                                    profileForm.setData(
                                                                        'name',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pr-4 pl-12 text-[15px] font-medium text-[var(--color-text-main)] transition-all outline-none focus:border-[var(--color-gold)]/50 focus:ring-4 focus:ring-[var(--color-gold)]/5"
                                                                placeholder="Enter your name"
                                                            />
                                                        </div>
                                                        {profileForm.errors
                                                            .name && (
                                                            <p className="pl-1 text-[12px] font-medium text-red-400">
                                                                {
                                                                    profileForm
                                                                        .errors
                                                                        .name
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold tracking-[2px] text-[var(--color-gold)] uppercase">
                                                            Email Address
                                                        </label>
                                                        <div className="group relative">
                                                            <Globe className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-gold)]" />
                                                            <input
                                                                type="email"
                                                                value={
                                                                    profileForm
                                                                        .data
                                                                        .email
                                                                }
                                                                onChange={(e) =>
                                                                    profileForm.setData(
                                                                        'email',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pr-4 pl-12 text-[15px] font-medium text-[var(--color-text-main)] transition-all outline-none focus:border-[var(--color-gold)]/50 focus:ring-4 focus:ring-[var(--color-gold)]/5"
                                                                placeholder="Enter your email"
                                                            />
                                                        </div>
                                                        {profileForm.errors
                                                            .email && (
                                                            <p className="pl-1 text-[12px] font-medium text-red-400">
                                                                {
                                                                    profileForm
                                                                        .errors
                                                                        .email
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold tracking-[2px] text-[var(--color-gold)] uppercase">
                                                            Phone Number
                                                        </label>
                                                        <div className="group relative">
                                                            <Phone className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-gold)]" />
                                                            <input
                                                                type="tel"
                                                                value={
                                                                    profileForm
                                                                        .data
                                                                        .phone
                                                                }
                                                                onChange={(e) =>
                                                                    profileForm.setData(
                                                                        'phone',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pr-4 pl-12 text-[15px] font-medium text-[var(--color-text-main)] transition-all outline-none focus:border-[var(--color-gold)]/50 focus:ring-4 focus:ring-[var(--color-gold)]/5"
                                                                placeholder="+212 600 000 000"
                                                            />
                                                        </div>
                                                        {profileForm.errors
                                                            .phone && (
                                                            <p className="pl-1 text-[12px] font-medium text-red-400">
                                                                {
                                                                    profileForm
                                                                        .errors
                                                                        .phone
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold tracking-[2px] text-[var(--color-gold)] uppercase">
                                                            Digital Handle
                                                        </label>
                                                        <div className="group relative">
                                                            <AtSign className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-gold)]" />
                                                            <input
                                                                type="text"
                                                                value={
                                                                    profileForm
                                                                        .data
                                                                        .tag
                                                                }
                                                                onChange={(e) =>
                                                                    profileForm.setData(
                                                                        'tag',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pr-4 pl-12 text-[15px] font-medium text-[var(--color-text-main)] transition-all outline-none focus:border-[var(--color-gold)]/50 focus:ring-4 focus:ring-[var(--color-gold)]/5"
                                                                placeholder="@username"
                                                            />
                                                        </div>
                                                        {profileForm.errors
                                                            .tag && (
                                                            <p className="pl-1 text-[12px] font-medium text-red-400">
                                                                {
                                                                    profileForm
                                                                        .errors
                                                                        .tag
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold tracking-[2px] text-[var(--color-gold)] uppercase">
                                                            Job Title
                                                        </label>
                                                        <AutocompleteInput
                                                            id="job_title"
                                                            value={
                                                                profileForm.data
                                                                    .job_title
                                                            }
                                                            onChange={(val) =>
                                                                profileForm.setData(
                                                                    'job_title',
                                                                    val,
                                                                )
                                                            }
                                                            options={jobTitles}
                                                            placeholder="e.g. Executive Director"
                                                            icon={Briefcase}
                                                            label="Job Title"
                                                            error={
                                                                profileForm
                                                                    .errors
                                                                    .job_title
                                                            }
                                                        />
                                                        {profileForm.errors
                                                            .job_title && (
                                                            <p className="pl-1 text-[12px] font-medium text-red-400">
                                                                {
                                                                    profileForm
                                                                        .errors
                                                                        .job_title
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold tracking-[2px] text-[var(--color-gold)] uppercase">
                                                            Residential Address
                                                        </label>
                                                        <AutocompleteInput
                                                            id="address"
                                                            value={
                                                                profileForm.data
                                                                    .address
                                                            }
                                                            onChange={(val) =>
                                                                profileForm.setData(
                                                                    'address',
                                                                    val,
                                                                )
                                                            }
                                                            options={
                                                                moroccanAddresses
                                                            }
                                                            placeholder="Enter your full address"
                                                            icon={MapPin}
                                                            label="Residential Address"
                                                            error={
                                                                profileForm
                                                                    .errors
                                                                    .address
                                                            }
                                                        />
                                                        {profileForm.errors
                                                            .address && (
                                                            <p className="pl-1 text-[12px] font-medium text-red-400">
                                                                {
                                                                    profileForm
                                                                        .errors
                                                                        .address
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="pt-4 pb-2">
                                                    <h4 className="flex items-center gap-2 text-[14px] font-bold text-[var(--color-text-main)]">
                                                        <IdCard className="h-4 w-4 text-[var(--color-gold)]" />
                                                        Identity Details
                                                    </h4>
                                                </div>

                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold tracking-[2px] text-[var(--color-gold)] uppercase">
                                                            National ID (CIN)
                                                        </label>
                                                        <div className="group relative">
                                                            <IdCard className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-gold)]" />
                                                            <input
                                                                type="text"
                                                                value={
                                                                    profileForm
                                                                        .data
                                                                        .cin
                                                                }
                                                                onChange={(e) =>
                                                                    profileForm.setData(
                                                                        'cin',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pr-4 pl-12 text-[15px] font-medium text-[var(--color-text-main)] transition-all outline-none focus:border-[var(--color-gold)]/50 focus:ring-4 focus:ring-[var(--color-gold)]/5"
                                                                placeholder="e.g. AB123456"
                                                            />
                                                        </div>
                                                        {profileForm.errors
                                                            .cin && (
                                                            <p className="pl-1 text-[12px] font-medium text-red-400">
                                                                {
                                                                    profileForm
                                                                        .errors
                                                                        .cin
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold tracking-[2px] text-[var(--color-gold)] uppercase">
                                                            Date of Birth
                                                        </label>
                                                        <div className="group relative">
                                                            <Calendar className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-gold)]" />
                                                            <input
                                                                type="date"
                                                                value={
                                                                    profileForm
                                                                        .data
                                                                        .date_of_birth
                                                                }
                                                                onChange={(e) =>
                                                                    profileForm.setData(
                                                                        'date_of_birth',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pr-4 pl-12 text-[15px] font-medium text-[var(--color-text-main)] transition-all outline-none focus:border-[var(--color-gold)]/50 focus:ring-4 focus:ring-[var(--color-gold)]/5"
                                                            />
                                                        </div>
                                                        {profileForm.errors
                                                            .date_of_birth && (
                                                            <p className="pl-1 text-[12px] font-medium text-red-400">
                                                                {
                                                                    profileForm
                                                                        .errors
                                                                        .date_of_birth
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold tracking-[2px] text-[var(--color-gold)] uppercase">
                                                            Place of Birth
                                                        </label>
                                                        <AutocompleteInput
                                                            id="place_of_birth"
                                                            value={
                                                                profileForm.data
                                                                    .place_of_birth
                                                            }
                                                            onChange={(val) =>
                                                                profileForm.setData(
                                                                    'place_of_birth',
                                                                    val,
                                                                )
                                                            }
                                                            options={
                                                                moroccanCities
                                                            }
                                                            placeholder="e.g. Casablanca"
                                                            icon={Map}
                                                            label="Place of Birth"
                                                            error={
                                                                profileForm
                                                                    .errors
                                                                    .place_of_birth
                                                            }
                                                        />
                                                        {profileForm.errors
                                                            .place_of_birth && (
                                                            <p className="pl-1 text-[12px] font-medium text-red-400">
                                                                {
                                                                    profileForm
                                                                        .errors
                                                                        .place_of_birth
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold tracking-[2px] text-[var(--color-gold)] uppercase">
                                                            Nationality
                                                        </label>
                                                        <AutocompleteInput
                                                            id="nationality"
                                                            value={
                                                                profileForm.data
                                                                    .nationality
                                                            }
                                                            onChange={(val) =>
                                                                profileForm.setData(
                                                                    'nationality',
                                                                    val,
                                                                )
                                                            }
                                                            options={
                                                                nationalities
                                                            }
                                                            placeholder="e.g. Moroccan"
                                                            icon={Flag}
                                                            label="Nationality"
                                                            error={
                                                                profileForm
                                                                    .errors
                                                                    .nationality
                                                            }
                                                        />
                                                        {profileForm.errors
                                                            .nationality && (
                                                            <p className="pl-1 text-[12px] font-medium text-red-400">
                                                                {
                                                                    profileForm
                                                                        .errors
                                                                        .nationality
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold tracking-[2px] text-[var(--color-gold)] uppercase">
                                                            Gender
                                                        </label>
                                                        <div className="group relative">
                                                            <Users className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-gold)]" />
                                                            <select
                                                                value={
                                                                    profileForm
                                                                        .data
                                                                        .gender
                                                                }
                                                                onChange={(e) =>
                                                                    profileForm.setData(
                                                                        'gender',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full cursor-pointer appearance-none rounded-2xl border border-white/10 bg-white/5 py-4 pr-4 pl-12 text-[15px] font-medium text-[var(--color-text-main)] transition-all outline-none focus:border-[var(--color-gold)]/50 focus:ring-4 focus:ring-[var(--color-gold)]/5"
                                                            >
                                                                <option value="">
                                                                    Select
                                                                    Gender
                                                                </option>
                                                                <option value="male">
                                                                    Male
                                                                </option>
                                                                <option value="female">
                                                                    Female
                                                                </option>
                                                            </select>
                                                        </div>
                                                        {profileForm.errors
                                                            .gender && (
                                                            <p className="pl-1 text-[12px] font-medium text-red-400">
                                                                {
                                                                    profileForm
                                                                        .errors
                                                                        .gender
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex justify-end pt-6">
                                                    <motion.button
                                                        type="submit"
                                                        disabled={
                                                            profileForm.processing ||
                                                            !profileForm.isDirty
                                                        }
                                                        whileHover={{
                                                            scale: 1.02,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.98,
                                                        }}
                                                        className="flex items-center gap-3 rounded-2xl px-10 py-4 text-[15px] font-bold shadow-[0_10px_25px_rgba(212,175,55,0.3)] transition-all hover:shadow-[0_15px_35px_rgba(212,175,55,0.4)] disabled:opacity-50"
                                                        style={{
                                                            background:
                                                                'linear-gradient(to right, var(--color-gold), var(--color-gold-dark))',
                                                            color: '#000',
                                                        }}
                                                    >
                                                        {profileForm.processing ? (
                                                            <Loader2 className="h-5 w-5 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <Check className="h-5 w-5" />{' '}
                                                                Save Changes
                                                            </>
                                                        )}
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </form>
                                    )}

                                    {/* ── SECURITY TAB ── */}
                                    {activeTab === 'security' && (
                                        <form
                                            onSubmit={handlePasswordSubmit}
                                            className="relative z-10 space-y-8"
                                        >
                                            <div className="rounded-[24px] border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-6 backdrop-blur-md">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 shadow-inner">
                                                            <Shield className="h-6 w-6" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-[16px] font-bold text-[var(--color-text-main)]">
                                                                Fortified
                                                                Security
                                                            </h3>
                                                            <p className="text-[12px] font-medium text-emerald-400/80 italic">
                                                                Two-Factor
                                                                Authentication
                                                                is currently
                                                                active
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="rounded-full bg-emerald-500 px-4 py-2 text-[12px] font-bold text-black shadow-lg shadow-emerald-500/20">
                                                        Protected
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[11px] font-bold tracking-[2px] text-[var(--color-text-muted)] uppercase">
                                                        Current Protocol
                                                    </label>
                                                    <div className="group relative">
                                                        <input
                                                            type={
                                                                showPassword.current
                                                                    ? 'text'
                                                                    : 'password'
                                                            }
                                                            value={
                                                                passwordForm
                                                                    .data
                                                                    .current_password
                                                            }
                                                            onChange={(e) =>
                                                                passwordForm.setData(
                                                                    'current_password',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 pr-12 text-[15px] text-[var(--color-text-main)] transition-all outline-none focus:border-[var(--color-gold)]"
                                                            placeholder="••••••••••••"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setShowPassword(
                                                                    (p) => ({
                                                                        ...p,
                                                                        current:
                                                                            !p.current,
                                                                    }),
                                                                )
                                                            }
                                                            className="absolute top-1/2 right-4 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-gold)]"
                                                        >
                                                            {showPassword.current ? (
                                                                <EyeOff className="h-5 w-5" />
                                                            ) : (
                                                                <Eye className="h-5 w-5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    {passwordForm.errors
                                                        .current_password && (
                                                        <p className="pl-1 text-[12px] font-medium text-red-400">
                                                            {
                                                                passwordForm
                                                                    .errors
                                                                    .current_password
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold tracking-[2px] text-[var(--color-text-muted)] uppercase">
                                                            New Encryption
                                                        </label>
                                                        <div className="group relative">
                                                            <input
                                                                type={
                                                                    showPassword.new
                                                                        ? 'text'
                                                                        : 'password'
                                                                }
                                                                value={
                                                                    passwordForm
                                                                        .data
                                                                        .password
                                                                }
                                                                onChange={(e) =>
                                                                    passwordForm.setData(
                                                                        'password',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 pr-12 text-[15px] text-[var(--color-text-main)] transition-all outline-none focus:border-[var(--color-gold)]"
                                                                placeholder="Create new password"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setShowPassword(
                                                                        (
                                                                            p,
                                                                        ) => ({
                                                                            ...p,
                                                                            new: !p.new,
                                                                        }),
                                                                    )
                                                                }
                                                                className="absolute top-1/2 right-4 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-gold)]"
                                                            >
                                                                {showPassword.new ? (
                                                                    <EyeOff className="h-5 w-5" />
                                                                ) : (
                                                                    <Eye className="h-5 w-5" />
                                                                )}
                                                            </button>
                                                        </div>
                                                        {passwordForm.errors
                                                            .password && (
                                                            <p className="pl-1 text-[12px] font-medium text-red-400">
                                                                {
                                                                    passwordForm
                                                                        .errors
                                                                        .password
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold tracking-[2px] text-[var(--color-text-muted)] uppercase">
                                                            Confirm Encryption
                                                        </label>
                                                        <input
                                                            type={
                                                                showPassword.confirm
                                                                    ? 'text'
                                                                    : 'password'
                                                            }
                                                            value={
                                                                passwordForm
                                                                    .data
                                                                    .password_confirmation
                                                            }
                                                            onChange={(e) =>
                                                                passwordForm.setData(
                                                                    'password_confirmation',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-[15px] text-[var(--color-text-main)] transition-all outline-none focus:border-[var(--color-gold)]"
                                                            placeholder="Repeat new password"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-end pt-4">
                                                    <motion.button
                                                        type="submit"
                                                        disabled={
                                                            passwordForm.processing ||
                                                            !passwordForm.data
                                                                .password
                                                        }
                                                        whileHover={{
                                                            scale: 1.02,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.98,
                                                        }}
                                                        className="flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-[14px] font-bold text-black shadow-xl transition-all hover:bg-white/90 disabled:opacity-50"
                                                    >
                                                        {passwordForm.processing ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            'Update Firewall'
                                                        )}
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </form>
                                    )}

                                    {/* ── PREFERENCES TAB ── */}
                                    {activeTab === 'preferences' && (
                                        <form
                                            onSubmit={handlePreferencesSubmit}
                                            className="relative z-10 space-y-6"
                                        >
                                            <div className="mb-8 flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
                                                    <Sparkles className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-[18px] font-bold text-[var(--color-text-main)]">
                                                        Operational Flux
                                                    </h3>
                                                    <p className="text-[13px] font-medium text-[var(--color-text-muted)]">
                                                        Calibrate your banking
                                                        environment
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                <div
                                                    className="group rounded-[28px] border p-6 transition-all"
                                                    style={{
                                                        borderColor:
                                                            'var(--color-border)',
                                                        background:
                                                            'var(--color-bg-card)',
                                                    }}
                                                >
                                                    <div className="mb-6 flex items-center justify-between">
                                                        <div
                                                            className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg transition-transform group-hover:scale-110"
                                                            style={{
                                                                background:
                                                                    'var(--color-bg-base)',
                                                            }}
                                                        >
                                                            <Globe
                                                                className="h-6 w-6"
                                                                style={{
                                                                    color: 'var(--color-gold)',
                                                                }}
                                                            />
                                                        </div>
                                                        <select
                                                            value={
                                                                preferencesForm
                                                                    .data
                                                                    .currency
                                                            }
                                                            onChange={(e) =>
                                                                preferencesForm.setData(
                                                                    'currency',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="rounded-xl border px-4 py-2 text-[14px] font-bold outline-none"
                                                            style={{
                                                                borderColor:
                                                                    'var(--color-border)',
                                                                background:
                                                                    'var(--color-bg-elevated)',
                                                                color: 'var(--color-gold)',
                                                            }}
                                                        >
                                                            <option value="MAD">
                                                                MAD
                                                            </option>
                                                            <option value="USD">
                                                                USD
                                                            </option>
                                                            <option value="EUR">
                                                                EUR
                                                            </option>
                                                            <option value="GBP">
                                                                GBP
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <h4 className="mb-1 text-[16px] font-bold text-[var(--color-text-main)]">
                                                        Global Currency
                                                    </h4>
                                                    <p className="text-[12px] leading-relaxed font-medium text-[var(--color-text-muted)]">
                                                        The atomic unit for all
                                                        your financial
                                                        transactions and
                                                        reporting.
                                                    </p>
                                                </div>

                                                <div
                                                    className="group rounded-[28px] border p-6 transition-all"
                                                    style={{
                                                        borderColor:
                                                            'var(--color-border)',
                                                        background:
                                                            'var(--color-bg-card)',
                                                    }}
                                                >
                                                    <div className="mb-6 flex items-center justify-between">
                                                        <div
                                                            className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg transition-transform group-hover:scale-110"
                                                            style={{
                                                                background:
                                                                    'var(--color-bg-base)',
                                                            }}
                                                        >
                                                            <Bell
                                                                className="h-6 w-6"
                                                                style={{
                                                                    color: 'var(--color-gold)',
                                                                }}
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                preferencesForm.setData(
                                                                    'notifications',
                                                                    !preferencesForm
                                                                        .data
                                                                        .notifications,
                                                                )
                                                            }
                                                            className="flex h-7 w-14 items-center rounded-full p-1 transition-all duration-500"
                                                            style={{
                                                                background:
                                                                    preferencesForm
                                                                        .data
                                                                        .notifications
                                                                        ? 'var(--color-gold)'
                                                                        : 'var(--color-bg-elevated)',
                                                            }}
                                                        >
                                                            <motion.div
                                                                layout
                                                                className="h-5 w-5 rounded-full shadow-lg"
                                                                style={{
                                                                    background:
                                                                        preferencesForm
                                                                            .data
                                                                            .notifications
                                                                            ? '#000'
                                                                            : '#fff',
                                                                    marginLeft:
                                                                        preferencesForm
                                                                            .data
                                                                            .notifications
                                                                            ? 'auto'
                                                                            : '0',
                                                                }}
                                                                transition={{
                                                                    type: 'spring',
                                                                    stiffness: 500,
                                                                    damping: 30,
                                                                }}
                                                            />
                                                        </button>
                                                    </div>
                                                    <h4 className="mb-1 text-[16px] font-bold text-[var(--color-text-main)]">
                                                        Neural Alerts
                                                    </h4>
                                                    <p className="text-[12px] leading-relaxed font-medium text-[var(--color-text-muted)]">
                                                        Real-time telemetry for
                                                        every transaction and
                                                        system event.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex justify-end pt-8">
                                                <motion.button
                                                    type="submit"
                                                    disabled={
                                                        preferencesForm.processing ||
                                                        !preferencesForm.isDirty
                                                    }
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="rounded-2xl px-10 py-4 text-[15px] font-bold shadow-2xl transition-all hover:opacity-90"
                                                    style={{
                                                        background:
                                                            'var(--color-text-main)',
                                                        color: 'var(--color-bg-base)',
                                                    }}
                                                >
                                                    {preferencesForm.processing ? (
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                    ) : (
                                                        'Apply Calibration'
                                                    )}
                                                </motion.button>
                                            </div>
                                        </form>
                                    )}

                                    {/* ── APPEARANCE TAB ── */}
                                    {activeTab === 'appearance' && (
                                        <div className="relative z-10 space-y-8">
                                            <div className="mb-8 flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
                                                    <Palette className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-[18px] font-bold text-[var(--color-text-main)]">
                                                        Visual Identity
                                                    </h3>
                                                    <p className="text-[13px] font-medium text-[var(--color-text-muted)]">
                                                        Customize your OSCORP
                                                        experience
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Creative Theme Selector */}
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-[14px] font-bold text-[var(--color-text-main)]">
                                                        Select Theme
                                                    </h4>
                                                    <span className="text-[11px] font-medium text-[var(--color-text-muted)]">
                                                        {themeNames.length}{' '}
                                                        themes available
                                                    </span>
                                                </div>

                                                {/* Featured Theme Preview */}
                                                {themes[themeName] && (
                                                    <motion.div
                                                        key={themeName}
                                                        initial={{
                                                            opacity: 0,
                                                            y: 20,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        transition={{
                                                            duration: 0.5,
                                                        }}
                                                        className="relative overflow-hidden rounded-[32px] p-8"
                                                        style={{
                                                            background: `linear-gradient(135deg, ${themes[themeName].colors['--color-bg-card']}, ${themes[themeName].colors['--color-bg-elevated']})`,
                                                            border: `1px solid ${themes[themeName].colors['--color-border']}`,
                                                        }}
                                                    >
                                                        <div className="mb-4 flex items-center justify-between">
                                                            <div>
                                                                <h3
                                                                    className="text-[24px] font-black"
                                                                    style={{
                                                                        color: themes[
                                                                            themeName
                                                                        ]
                                                                            .colors[
                                                                            '--color-text-main'
                                                                        ],
                                                                    }}
                                                                >
                                                                    {
                                                                        themes[
                                                                            themeName
                                                                        ].name
                                                                    }
                                                                </h3>
                                                                <p
                                                                    className="text-[12px] font-medium"
                                                                    style={{
                                                                        color: themes[
                                                                            themeName
                                                                        ]
                                                                            .colors[
                                                                            '--color-text-muted'
                                                                        ],
                                                                    }}
                                                                >
                                                                    {
                                                                        themes[
                                                                            themeName
                                                                        ]
                                                                            .description
                                                                    }
                                                                </p>
                                                            </div>
                                                            {themes[themeName]
                                                                .lightMode && (
                                                                <div
                                                                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                                                                    style={{
                                                                        background: `${themes[themeName].colors['--color-gold']}15`,
                                                                    }}
                                                                >
                                                                    {isDark ? (
                                                                        <Moon
                                                                            className="h-5 w-5"
                                                                            style={{
                                                                                color: themes[
                                                                                    themeName
                                                                                ]
                                                                                    .colors[
                                                                                    '--color-gold'
                                                                                ],
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <Sun
                                                                            className="h-5 w-5"
                                                                            style={{
                                                                                color: themes[
                                                                                    themeName
                                                                                ]
                                                                                    .colors[
                                                                                    '--color-gold'
                                                                                ],
                                                                            }}
                                                                        />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Live Preview Mockup */}
                                                        <div className="grid grid-cols-3 gap-3">
                                                            <div className="col-span-2 space-y-2">
                                                                <div
                                                                    className="h-3 w-32 rounded-full"
                                                                    style={{
                                                                        background: `${themes[themeName].colors['--color-gold']}40`,
                                                                    }}
                                                                />
                                                                <div
                                                                    className="h-2 w-48 rounded-full"
                                                                    style={{
                                                                        background: `${themes[themeName].colors['--color-text-muted']}30`,
                                                                    }}
                                                                />
                                                                <div className="mt-4 space-y-2">
                                                                    {[
                                                                        1, 2, 3,
                                                                    ].map(
                                                                        (i) => (
                                                                            <div
                                                                                key={
                                                                                    i
                                                                                }
                                                                                className="flex items-center gap-2"
                                                                            >
                                                                                <div
                                                                                    className="h-8 w-8 rounded-lg"
                                                                                    style={{
                                                                                        background:
                                                                                            themes[
                                                                                                themeName
                                                                                            ]
                                                                                                .colors[
                                                                                                '--color-bg-elevated'
                                                                                            ],
                                                                                    }}
                                                                                />
                                                                                <div className="flex-1 space-y-1">
                                                                                    <div
                                                                                        className="h-2 w-3/4 rounded-full"
                                                                                        style={{
                                                                                            background: `${themes[themeName].colors['--color-text-muted']}40`,
                                                                                        }}
                                                                                    />
                                                                                    <div
                                                                                        className="h-2 w-1/2 rounded-full"
                                                                                        style={{
                                                                                            background: `${themes[themeName].colors['--color-border']}60`,
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                <div
                                                                                    className="h-6 w-16 rounded-lg"
                                                                                    style={{
                                                                                        background: `${themes[themeName].colors['--color-gold']}30`,
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <div
                                                                    className="h-20 rounded-xl"
                                                                    style={{
                                                                        background:
                                                                            themes[
                                                                                themeName
                                                                            ]
                                                                                .colors[
                                                                                '--color-bg-elevated'
                                                                            ],
                                                                    }}
                                                                />
                                                                <div
                                                                    className="h-12 rounded-xl"
                                                                    style={{
                                                                        background: `${themes[themeName].colors['--color-gold']}20`,
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Color Palette */}
                                                        <div className="mt-6 flex gap-2">
                                                            {Object.entries(
                                                                themes[
                                                                    themeName
                                                                ].colors,
                                                            )
                                                                .filter(
                                                                    ([key]) =>
                                                                        key.includes(
                                                                            'gold',
                                                                        ) ||
                                                                        key.includes(
                                                                            'text-main',
                                                                        ) ||
                                                                        key.includes(
                                                                            'bg-base',
                                                                        ),
                                                                )
                                                                .slice(0, 5)
                                                                .map(
                                                                    ([
                                                                        key,
                                                                        value,
                                                                    ]) => (
                                                                        <div
                                                                            key={
                                                                                key
                                                                            }
                                                                            className="h-8 flex-1 rounded-lg border-2 transition-transform hover:scale-110"
                                                                            style={{
                                                                                background:
                                                                                    value,
                                                                                borderColor:
                                                                                    themes[
                                                                                        themeName
                                                                                    ]
                                                                                        .colors[
                                                                                        '--color-border'
                                                                                    ],
                                                                            }}
                                                                            title={key.replace(
                                                                                '--color-',
                                                                                '',
                                                                            )}
                                                                        />
                                                                    ),
                                                                )}
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {/* Theme Hexagon Grid */}
                                                <div className="grid grid-cols-3 gap-4 md:grid-cols-5 lg:grid-cols-7">
                                                    {themeNames.map(
                                                        (name, idx) => {
                                                            const theme =
                                                                themes[name];
                                                            const isActive =
                                                                themeName ===
                                                                name;
                                                            return (
                                                                <motion.button
                                                                    key={name}
                                                                    initial={{
                                                                        opacity: 0,
                                                                        scale: 0.8,
                                                                        y: 20,
                                                                    }}
                                                                    animate={{
                                                                        opacity: 1,
                                                                        scale: 1,
                                                                        y: 0,
                                                                    }}
                                                                    transition={{
                                                                        delay:
                                                                            idx *
                                                                            0.02,
                                                                        type: 'spring',
                                                                        stiffness: 200,
                                                                        damping: 15,
                                                                    }}
                                                                    whileHover={{
                                                                        scale: 1.1,
                                                                        y: -12,
                                                                        transition:
                                                                            {
                                                                                type: 'spring',
                                                                                stiffness: 300,
                                                                                damping: 10,
                                                                            },
                                                                    }}
                                                                    whileTap={{
                                                                        scale: 0.95,
                                                                    }}
                                                                    onClick={() =>
                                                                        setTheme(
                                                                            name,
                                                                        )
                                                                    }
                                                                    className={`group relative flex flex-col items-center gap-2 rounded-2xl p-4 transition-all duration-300 ${
                                                                        isActive
                                                                            ? 'shadow-2xl'
                                                                            : 'hover:shadow-xl'
                                                                    }`}
                                                                    style={{
                                                                        background:
                                                                            isActive
                                                                                ? `linear-gradient(135deg, ${theme.colors['--color-bg-card']}, ${theme.colors['--color-bg-elevated']})`
                                                                                : theme
                                                                                      .colors[
                                                                                      '--color-bg-card'
                                                                                  ],
                                                                        border: `2px solid ${isActive ? theme.colors['--color-gold'] : theme.colors['--color-border']}`,
                                                                        boxShadow:
                                                                            isActive
                                                                                ? `0 10px 40px ${theme.colors['--color-gold']}30`
                                                                                : 'none',
                                                                    }}
                                                                >
                                                                    {/* Animated Background Glow */}
                                                                    {isActive && (
                                                                        <motion.div
                                                                            layoutId="themeGlow"
                                                                            className="absolute inset-0 rounded-2xl"
                                                                            style={{
                                                                                background: `radial-gradient(circle at 50% 50%, ${theme.colors['--color-gold']}20, transparent)`,
                                                                                filter: 'blur(20px)',
                                                                                zIndex: -1,
                                                                            }}
                                                                            initial={{
                                                                                opacity: 0,
                                                                            }}
                                                                            animate={{
                                                                                opacity: 1,
                                                                            }}
                                                                            transition={{
                                                                                duration: 0.5,
                                                                            }}
                                                                        />
                                                                    )}

                                                                    {/* Theme Circle Preview */}
                                                                    <div
                                                                        className="relative h-16 w-16 rounded-[24px] transition-transform duration-300 group-hover:scale-110"
                                                                        style={{
                                                                            background: `linear-gradient(135deg, ${theme.colors['--color-gold']}, ${theme.colors['--color-bg-elevated']})`,
                                                                            boxShadow: `0 4px 15px ${theme.colors['--color-gold']}40`,
                                                                        }}
                                                                    >
                                                                        {/* Inner Pattern */}
                                                                        <div
                                                                            className="absolute inset-1 rounded-[20px]"
                                                                            style={{
                                                                                background:
                                                                                    theme
                                                                                        .colors[
                                                                                        '--color-bg-card'
                                                                                    ],
                                                                            }}
                                                                        >
                                                                            <div
                                                                                className="absolute inset-2 rounded-[16px]"
                                                                                style={{
                                                                                    background:
                                                                                        theme
                                                                                            .colors[
                                                                                            '--color-gold'
                                                                                        ],
                                                                                    opacity: 0.3,
                                                                                }}
                                                                            />
                                                                        </div>

                                                                        {/* Active Check */}
                                                                        {isActive && (
                                                                            <motion.div
                                                                                initial={{
                                                                                    scale: 0,
                                                                                    opacity: 0,
                                                                                }}
                                                                                animate={{
                                                                                    scale: 1,
                                                                                    opacity: 1,
                                                                                }}
                                                                                transition={{
                                                                                    type: 'spring',
                                                                                    stiffness: 400,
                                                                                    damping: 10,
                                                                                }}
                                                                                transition={{
                                                                                    type: 'spring',
                                                                                    stiffness: 500,
                                                                                }}
                                                                                className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full"
                                                                                style={{
                                                                                    background:
                                                                                        theme
                                                                                            .colors[
                                                                                            '--color-gold'
                                                                                        ],
                                                                                }}
                                                                            >
                                                                                <Check
                                                                                    className="h-3 w-3"
                                                                                    style={{
                                                                                        color: theme
                                                                                            .colors[
                                                                                            '--color-bg-base'
                                                                                        ],
                                                                                    }}
                                                                                />
                                                                            </motion.div>
                                                                        )}
                                                                    </div>

                                                                    {/* Theme Name */}
                                                                    <span
                                                                        className="text-[10px] font-black tracking-wide"
                                                                        style={{
                                                                            color: isActive
                                                                                ? theme
                                                                                      .colors[
                                                                                      '--color-gold'
                                                                                  ]
                                                                                : theme
                                                                                      .colors[
                                                                                      '--color-text-main'
                                                                                  ],
                                                                        }}
                                                                    >
                                                                        {
                                                                            theme.name
                                                                        }
                                                                    </span>

                                                                    {/* Light Mode Indicator */}
                                                                    {theme.lightMode && (
                                                                        <div
                                                                            className="absolute -right-1 -bottom-1 opacity-40"
                                                                            style={{
                                                                                color: theme
                                                                                    .colors[
                                                                                    '--color-text-muted'
                                                                                ],
                                                                            }}
                                                                        >
                                                                            <Sun className="h-3 w-3" />
                                                                        </div>
                                                                    )}
                                                                </motion.button>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </div>

                                            {/* Light/Dark Mode Toggle */}
                                            <div className="space-y-6">
                                                <h4 className="text-[14px] font-bold text-[var(--color-text-main)]">
                                                    Display Mode
                                                </h4>
                                                {themes[themeName]
                                                    ?.lightMode ? (
                                                    <div
                                                        className="flex items-center justify-between rounded-2xl border p-5"
                                                        style={{
                                                            borderColor:
                                                                'var(--color-border)',
                                                            background:
                                                                'var(--color-bg-card)',
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div
                                                                className="flex h-10 w-10 items-center justify-center rounded-xl"
                                                                style={{
                                                                    background:
                                                                        'var(--color-bg-elevated)',
                                                                }}
                                                            >
                                                                {isDark ? (
                                                                    <Moon
                                                                        className="h-5 w-5"
                                                                        style={{
                                                                            color: 'var(--color-gold)',
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <Sun
                                                                        className="h-5 w-5"
                                                                        style={{
                                                                            color: 'var(--color-gold)',
                                                                        }}
                                                                    />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="text-[14px] font-bold text-[var(--color-text-main)]">
                                                                    {isDark
                                                                        ? 'Dark Mode'
                                                                        : 'Light Mode'}
                                                                </div>
                                                                <div className="text-[11px] font-medium text-[var(--color-text-muted)]">
                                                                    Toggle
                                                                    between
                                                                    light and
                                                                    dark
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={
                                                                toggleTheme
                                                            }
                                                            className="flex h-7 w-14 items-center rounded-full p-1 transition-all duration-500"
                                                            style={{
                                                                background:
                                                                    isDark
                                                                        ? 'var(--color-gold)'
                                                                        : 'var(--color-bg-elevated)',
                                                            }}
                                                        >
                                                            <motion.div
                                                                layout
                                                                className="h-5 w-5 rounded-full shadow-lg"
                                                                style={{
                                                                    background:
                                                                        isDark
                                                                            ? '#000'
                                                                            : '#fff',
                                                                    marginLeft:
                                                                        isDark
                                                                            ? 'auto'
                                                                            : '0',
                                                                }}
                                                                transition={{
                                                                    type: 'spring',
                                                                    stiffness: 500,
                                                                    damping: 30,
                                                                }}
                                                            />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="rounded-2xl border p-5"
                                                        style={{
                                                            borderColor:
                                                                'var(--color-border)',
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div
                                                                className="flex h-10 w-10 items-center justify-center rounded-xl"
                                                                style={{
                                                                    background:
                                                                        'var(--color-bg-elevated)',
                                                                }}
                                                            >
                                                                <Moon
                                                                    className="h-5 w-5"
                                                                    style={{
                                                                        color: 'var(--color-text-muted)',
                                                                    }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="text-[14px] font-bold text-[var(--color-text-main)]">
                                                                    Dark Mode
                                                                    Only
                                                                </div>
                                                                <div className="text-[11px] font-medium text-[var(--color-text-muted)]">
                                                                    This theme
                                                                    does not
                                                                    support
                                                                    light mode
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* ── DATA TAB ── */}
                                    {activeTab === 'data' && (
                                        <div className="relative z-10 space-y-8">
                                            <div className="grid grid-cols-1 gap-6">
                                                <div
                                                    className="group relative overflow-hidden rounded-[32px] border p-8 transition-all hover:opacity-90"
                                                    style={{
                                                        borderColor:
                                                            'var(--color-border)',
                                                        background:
                                                            'var(--color-bg-card)',
                                                    }}
                                                >
                                                    <div className="absolute top-0 right-0 p-8 opacity-10 transition-opacity group-hover:opacity-20">
                                                        <Download
                                                            className="h-24 w-24"
                                                            style={{
                                                                color: 'var(--color-gold)',
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="relative z-10">
                                                        <h3 className="mb-2 flex items-center gap-3 text-xl font-bold text-[var(--color-text-main)]">
                                                            <Download
                                                                className="h-6 w-6"
                                                                style={{
                                                                    color: 'var(--color-gold)',
                                                                }}
                                                            />
                                                            Data Extraction
                                                        </h3>
                                                        <p className="mb-8 max-w-md text-[14px] leading-relaxed font-medium text-[var(--color-text-muted)]">
                                                            Retrieve a
                                                            comprehensive
                                                            holographic archive
                                                            of your entire
                                                            banking history in
                                                            high-fidelity JSON
                                                            or CSV format.
                                                        </p>
                                                        <motion.button
                                                            onClick={
                                                                handleExport
                                                            }
                                                            disabled={exporting}
                                                            whileHover={{
                                                                scale: 1.02,
                                                            }}
                                                            whileTap={{
                                                                scale: 0.98,
                                                            }}
                                                            className="flex items-center gap-3 rounded-2xl px-8 py-4 text-[15px] font-bold text-black shadow-lg"
                                                            style={{
                                                                background:
                                                                    'var(--color-gold)',
                                                            }}
                                                        >
                                                            {exporting ? (
                                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                            ) : (
                                                                <>
                                                                    <Download className="h-5 w-5" />{' '}
                                                                    Initiate
                                                                    Export
                                                                </>
                                                            )}
                                                        </motion.button>
                                                    </div>
                                                </div>

                                                <div
                                                    className="group rounded-[32px] border p-8 transition-all"
                                                    style={{
                                                        borderColor:
                                                            'rgba(239, 68, 68, 0.2)',
                                                        background:
                                                            'rgba(239, 68, 68, 0.05)',
                                                    }}
                                                >
                                                    <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                                                        <div className="flex items-start gap-5">
                                                            <div
                                                                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-inner"
                                                                style={{
                                                                    background:
                                                                        'rgba(239, 68, 68, 0.2)',
                                                                }}
                                                            >
                                                                <Trash2 className="h-7 w-7 text-red-500" />
                                                            </div>
                                                            <div>
                                                                <h3 className="mb-1 text-xl font-bold text-red-500">
                                                                    Terminal
                                                                    Deletion
                                                                </h3>
                                                                <p
                                                                    className="max-w-sm text-[13px] leading-relaxed font-medium"
                                                                    style={{
                                                                        color: 'rgba(248, 113, 113, 0.7)',
                                                                    }}
                                                                >
                                                                    Permanently
                                                                    purge your
                                                                    OSCORP
                                                                    presence.
                                                                    This action
                                                                    is atomic
                                                                    and
                                                                    irreversible.
                                                                    All assets
                                                                    and history
                                                                    will be
                                                                    vaporized.
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <motion.button
                                                            whileHover={{
                                                                scale: 1.05,
                                                            }}
                                                            whileTap={{
                                                                scale: 0.95,
                                                            }}
                                                            className="rounded-2xl border px-8 py-4 text-[14px] font-bold shadow-lg transition-all hover:text-white"
                                                            style={{
                                                                borderColor:
                                                                    'rgba(239, 68, 68, 0.3)',
                                                                background:
                                                                    'rgba(239, 68, 68, 0.1)',
                                                                color: '#ef4444',
                                                            }}
                                                        >
                                                            Execute Deletion
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
