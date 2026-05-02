import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Lock, Bell, Shield, Globe, Download, Trash2, 
    Check, Camera, Loader2, AlertCircle, Eye, EyeOff,
    Upload, X, Image as ImageIcon, Sparkles, ChevronRight
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';

export default function Settings({ user, preferences, security }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('profile');
    const [exporting, setExporting] = useState(false);
    const fileInputRef = useRef(null);
    
    // --- Profile Form ---
    const profileForm = useForm({
        name: user.name,
        email: user.email,
        avatar: user.avatar || 'adventurer',
    });

    const [avatarPreview, setAvatarPreview] = useState(
        user.avatar?.startsWith('/') 
            ? user.avatar 
            : `https://api.dicebear.com/9.x/${user.avatar || 'adventurer'}/svg?seed=${user.name}&backgroundColor=111827`
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
        profileForm.post('/settings/profile', {
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
    const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.post('/settings/password', {
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
        preferencesForm.post('/settings/preferences', {
            preserveScroll: true,
        });
    };

    // --- Actions ---
    const handleExport = () => {
        setExporting(true);
        setTimeout(() => setExporting(false), 2000);
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User, desc: 'Personal details & avatar' },
        { id: 'security', label: 'Security', icon: Shield, desc: 'Password & protection' },
        { id: 'preferences', label: 'Preferences', icon: Bell, desc: 'System & notifications' },
        { id: 'data', label: 'Data', icon: Download, desc: 'Exports & privacy' },
    ];


    return (
        <div className="flex h-screen w-full overflow-hidden bg-[var(--color-bg-base)]">
            <Head title="OSCORP | Settings" />
            <Sidebar active="settings" />
            
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Background Glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-gold)]/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
                
                <Topbar />
                
                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar relative z-10">
                    <div className="max-w-5xl mx-auto">
                        <header className="mb-10">
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }} 
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-4 mb-2"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] flex items-center justify-center shadow-[0_8px_20px_rgba(212,175,55,0.3)]">
                                    <Sparkles className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-[var(--color-text-main)] tracking-tight">Account Architecture</h1>
                                    <p className="text-[14px] text-[var(--color-text-muted)] font-medium">Fine-tune your OSCORP experience</p>
                                </div>
                            </motion.div>
                            
                            {flash?.success && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    className="mt-6 flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[14px] font-semibold backdrop-blur-md"
                                >
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    {flash.success}
                                </motion.div>
                            )}
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                            {/* Navigation */}
                            <div className="space-y-2">
                                {tabs.map((tab) => (
                                    <motion.button
                                        key={tab.id}
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 relative group ${
                                            activeTab === tab.id ? 'shadow-lg' : 'hover:bg-[var(--color-bg-elevated)]'
                                        }`}
                                        style={activeTab === tab.id 
                                            ? { background: 'linear-gradient(135deg, var(--color-bg-card), var(--color-bg-elevated))', border: '1px solid var(--color-border)' }
                                            : { color: 'var(--color-text-muted)' }
                                        }
                                    >
                                        {activeTab === tab.id && (
                                            <motion.div 
                                                layoutId="activeTabGlow"
                                                className="absolute inset-0 bg-[var(--color-gold)]/5 rounded-2xl blur-md -z-10"
                                            />
                                        )}
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                            activeTab === tab.id ? 'bg-[var(--color-gold)] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] group-hover:text-[var(--color-text-main)]'
                                        }`}>
                                            <tab.icon className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <div className={`text-[14px] font-bold ${activeTab === tab.id ? 'text-[var(--color-text-main)]' : ''}`}>{tab.label}</div>
                                            <div className="text-[11px] font-medium opacity-60 truncate w-32">{tab.desc}</div>
                                        </div>
                                        {activeTab === tab.id && (
                                            <ChevronRight className="w-4 h-4 ml-auto text-[var(--color-gold)]" />
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
                                    transition={{ duration: 0.4, ease: "circOut" }}
                                    className="p-8 md:p-10 rounded-[32px] border border-[var(--color-border)] backdrop-blur-xl relative overflow-hidden" 
                                    style={{ background: 'linear-gradient(165deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))' }}
                                >
                                    {/* Glassmorphism Shine */}
                                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 blur-3xl rounded-full pointer-events-none" />
                                    
                                    {/* ── PROFILE TAB ── */}
                                    {activeTab === 'profile' && (
                                        <form onSubmit={handleProfileSubmit} className="relative z-10">
                                            <div className="flex flex-col md:flex-row items-start md:items-center gap-10 mb-12">
                                                <div className="relative group">
                                                    <motion.div 
                                                        whileHover={{ scale: 1.05 }}
                                                        className="w-32 h-32 rounded-[32px] overflow-hidden ring-4 ring-[var(--color-gold)]/20 shadow-2xl relative"
                                                    >
                                                        <img src={avatarPreview} alt={user.name} className="w-full h-full object-cover bg-[var(--color-bg-base)]" />
                                                        <div 
                                                            onClick={() => fileInputRef.current?.click()}
                                                            className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-[2px]"
                                                        >
                                                            <Camera className="w-8 h-8 text-[var(--color-gold)] mb-1" />
                                                            <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Change</span>
                                                        </div>
                                                        
                                                        {profileForm.processing && (
                                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                                                                <Loader2 className="w-8 h-8 text-[var(--color-gold)] animate-spin" />
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                    <input 
                                                        type="file" 
                                                        ref={fileInputRef} 
                                                        onChange={handleFileChange} 
                                                        className="hidden" 
                                                        accept="image/*"
                                                    />
                                                </div>

                                                <div className="flex-1 space-y-4">
                                                    <div>
                                                        <h3 className="text-[18px] font-bold text-[var(--color-text-main)] mb-1">Profile Identity</h3>
                                                        <p className="text-[13px] text-[var(--color-text-muted)] font-medium mb-4">Click the avatar preview to upload a custom holographic identifier.</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold text-[var(--color-gold)] uppercase tracking-[2px]">Full Name</label>
                                                        <div className="relative group">
                                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-gold)] transition-colors" />
                                                            <input 
                                                                type="text" 
                                                                value={profileForm.data.name} 
                                                                onChange={e => profileForm.setData('name', e.target.value)}
                                                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-[var(--color-gold)]/50 focus:ring-4 focus:ring-[var(--color-gold)]/5 transition-all text-[15px] font-medium text-[var(--color-text-main)]"
                                                                placeholder="Enter your name"
                                                            />
                                                        </div>
                                                        {profileForm.errors.name && <p className="text-red-400 text-[12px] font-medium pl-1">{profileForm.errors.name}</p>}
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold text-[var(--color-gold)] uppercase tracking-[2px]">Email Address</label>
                                                        <div className="relative group">
                                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-gold)] transition-colors" />
                                                            <input 
                                                                type="email" 
                                                                value={profileForm.data.email} 
                                                                onChange={e => profileForm.setData('email', e.target.value)}
                                                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-[var(--color-gold)]/50 focus:ring-4 focus:ring-[var(--color-gold)]/5 transition-all text-[15px] font-medium text-[var(--color-text-main)]"
                                                                placeholder="Enter your email"
                                                            />
                                                        </div>
                                                        {profileForm.errors.email && <p className="text-red-400 text-[12px] font-medium pl-1">{profileForm.errors.email}</p>}
                                                    </div>
                                                </div>
                                                
                                                <div className="flex justify-end pt-6">
                                                    <motion.button 
                                                        type="submit" 
                                                        disabled={profileForm.processing || !profileForm.isDirty}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="px-10 py-4 rounded-2xl font-bold text-[15px] transition-all disabled:opacity-50 flex items-center gap-3 shadow-[0_10px_25px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_35px_rgba(212,175,55,0.4)]"
                                                        style={{ background: 'linear-gradient(to right, var(--color-gold), var(--color-gold-dark))', color: '#000' }}
                                                    >
                                                        {profileForm.processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5" /> Save Changes</>}
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </form>
                                    )}

                                    {/* ── SECURITY TAB ── */}
                                    {activeTab === 'security' && (
                                        <form onSubmit={handlePasswordSubmit} className="relative z-10 space-y-8">
                                            <div className="p-6 rounded-[24px] bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 backdrop-blur-md">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                                                            <Shield className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-[16px] font-bold text-[var(--color-text-main)]">Fortified Security</h3>
                                                            <p className="text-[12px] text-emerald-400/80 font-medium italic">Two-Factor Authentication is currently active</p>
                                                        </div>
                                                    </div>
                                                    <div className="px-4 py-2 rounded-full text-[12px] bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20">
                                                        Protected
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-[2px]">Current Protocol</label>
                                                    <div className="relative group">
                                                        <input 
                                                            type={showPassword.current ? 'text' : 'password'} 
                                                            value={passwordForm.data.current_password} 
                                                            onChange={e => passwordForm.setData('current_password', e.target.value)}
                                                            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-[var(--color-gold)] transition-all text-[15px] pr-12 text-[var(--color-text-main)]"
                                                            placeholder="••••••••••••"
                                                        />
                                                        <button type="button" onClick={() => setShowPassword(p => ({...p, current: !p.current}))} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors">
                                                            {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                    {passwordForm.errors.current_password && <p className="text-red-400 text-[12px] font-medium pl-1">{passwordForm.errors.current_password}</p>}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-[2px]">New Encryption</label>
                                                        <div className="relative group">
                                                            <input 
                                                                type={showPassword.new ? 'text' : 'password'} 
                                                                value={passwordForm.data.password} 
                                                                onChange={e => passwordForm.setData('password', e.target.value)}
                                                                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-[var(--color-gold)] transition-all text-[15px] pr-12 text-[var(--color-text-main)]"
                                                                placeholder="Create new password"
                                                            />
                                                            <button type="button" onClick={() => setShowPassword(p => ({...p, new: !p.new}))} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors">
                                                                {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                            </button>
                                                        </div>
                                                        {passwordForm.errors.password && <p className="text-red-400 text-[12px] font-medium pl-1">{passwordForm.errors.password}</p>}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-[2px]">Confirm Encryption</label>
                                                        <input 
                                                            type={showPassword.confirm ? 'text' : 'password'} 
                                                            value={passwordForm.data.password_confirmation} 
                                                            onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                                                            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-[var(--color-gold)] transition-all text-[15px] text-[var(--color-text-main)]"
                                                            placeholder="Repeat new password"
                                                        />
                                                    </div>
                                                </div>
                                                
                                                <div className="flex justify-end pt-4">
                                                    <motion.button 
                                                        type="submit" 
                                                        disabled={passwordForm.processing || !passwordForm.data.password}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="px-8 py-3.5 rounded-2xl font-bold text-[14px] transition-all disabled:opacity-50 flex items-center gap-2 bg-white text-black hover:bg-white/90 shadow-xl"
                                                    >
                                                        {passwordForm.processing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Firewall'}
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </form>
                                    )}

                                    {/* ── PREFERENCES TAB ── */}
                                    {activeTab === 'preferences' && (
                                        <form onSubmit={handlePreferencesSubmit} className="relative z-10 space-y-6">
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-12 h-12 rounded-2xl bg-[var(--color-gold)]/10 flex items-center justify-center text-[var(--color-gold)]">
                                                    <Sparkles className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-[18px] font-bold text-[var(--color-text-main)]">Operational Flux</h3>
                                                    <p className="text-[13px] text-[var(--color-text-muted)] font-medium">Calibrate your banking environment</p>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="p-6 rounded-[28px] bg-white/5 border border-white/10 hover:border-[var(--color-gold)]/30 transition-all group">
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div className="w-12 h-12 rounded-2xl bg-[var(--color-bg-base)] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                                            <Globe className="w-6 h-6 text-[var(--color-gold)]" />
                                                        </div>
                                                        <select 
                                                            value={preferencesForm.data.currency}
                                                            onChange={e => preferencesForm.setData('currency', e.target.value)}
                                                            className="bg-[var(--color-bg-elevated)] border border-white/10 rounded-xl px-4 py-2 outline-none text-[14px] font-bold text-[var(--color-gold)]"
                                                        >
                                                            <option value="MAD">MAD</option>
                                                            <option value="USD">USD</option>
                                                            <option value="EUR">EUR</option>
                                                            <option value="GBP">GBP</option>
                                                        </select>
                                                    </div>
                                                    <h4 className="font-bold text-[16px] text-[var(--color-text-main)] mb-1">Global Currency</h4>
                                                    <p className="text-[12px] text-[var(--color-text-muted)] font-medium leading-relaxed">The atomic unit for all your financial transactions and reporting.</p>
                                                </div>

                                                <div className="p-6 rounded-[28px] bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all group">
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div className="w-12 h-12 rounded-2xl bg-[var(--color-bg-base)] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                                            <Bell className="w-6 h-6 text-blue-400" />
                                                        </div>
                                                        <button 
                                                            type="button"
                                                            onClick={() => preferencesForm.setData('notifications', !preferencesForm.data.notifications)}
                                                            className={`w-14 h-7 rounded-full flex items-center p-1 transition-all duration-500 ${preferencesForm.data.notifications ? 'bg-blue-500' : 'bg-white/10'}`}
                                                        >
                                                            <motion.div 
                                                                layout 
                                                                className="w-5 h-5 rounded-full bg-white shadow-lg"
                                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                                style={{ marginLeft: preferencesForm.data.notifications ? 'auto' : '0' }}
                                                            />
                                                        </button>
                                                    </div>
                                                    <h4 className="font-bold text-[16px] text-[var(--color-text-main)] mb-1">Neural Alerts</h4>
                                                    <p className="text-[12px] text-[var(--color-text-muted)] font-medium leading-relaxed">Real-time telemetry for every transaction and system event.</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex justify-end pt-8">
                                                <motion.button 
                                                    type="submit" 
                                                    disabled={preferencesForm.processing || !preferencesForm.isDirty}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="px-10 py-4 rounded-2xl font-bold text-[15px] transition-all bg-[var(--color-text-main)] text-[var(--color-bg-base)] hover:opacity-90 shadow-2xl"
                                                >
                                                    {preferencesForm.processing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Apply Calibration'}
                                                </motion.button>
                                            </div>
                                        </form>
                                    )}

                                    {/* ── DATA TAB ── */}
                                    {activeTab === 'data' && (
                                        <div className="relative z-10 space-y-8">
                                            <div className="grid grid-cols-1 gap-6">
                                                <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                                        <Download className="w-24 h-24 text-[var(--color-gold)]" />
                                                    </div>
                                                    <div className="relative z-10">
                                                        <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2 flex items-center gap-3">
                                                            <Download className="w-6 h-6 text-[var(--color-gold)]" />
                                                            Data Extraction
                                                        </h3>
                                                        <p className="text-[14px] text-[var(--color-text-muted)] font-medium mb-8 max-w-md leading-relaxed">
                                                            Retrieve a comprehensive holographic archive of your entire banking history in high-fidelity JSON or CSV format.
                                                        </p>
                                                        <motion.button 
                                                            onClick={handleExport}
                                                            disabled={exporting}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            className="px-8 py-4 rounded-2xl bg-[var(--color-gold)] text-black font-bold text-[15px] shadow-[0_10px_20px_rgba(212,175,55,0.2)] flex items-center gap-3"
                                                        >
                                                            {exporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Download className="w-5 h-5" /> Initiate Export</>}
                                                        </motion.button>
                                                    </div>
                                                </div>

                                                <div className="p-8 rounded-[32px] bg-red-500/5 border border-red-500/20 group hover:bg-red-500/10 transition-all">
                                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                                                        <div className="flex items-start gap-5">
                                                            <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center shrink-0 shadow-inner">
                                                                <Trash2 className="w-7 h-7 text-red-500" />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-xl font-bold text-red-500 mb-1">Terminal Deletion</h3>
                                                                <p className="text-[13px] text-red-400/70 font-medium leading-relaxed max-w-sm">
                                                                    Permanently purge your OSCORP presence. This action is atomic and irreversible. All assets and history will be vaporized.
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <motion.button 
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="px-8 py-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 font-bold text-[14px] hover:bg-red-500 hover:text-white transition-all shadow-lg"
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