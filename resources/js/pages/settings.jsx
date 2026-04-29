import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
    User, Lock, Bell, Shield, Globe, Download, Trash2, 
    Check, Camera, Loader2, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';

export default function Settings({ user, preferences, security }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('profile');
    const [exporting, setExporting] = useState(false);
    
    // --- Profile Form ---
    const profileForm = useForm({
        name: user.name,
        email: user.email,
        avatar: user.avatar || 'adventurer',
    });

    const [avatarPreview, setAvatarPreview] = useState(`https://api.dicebear.com/9.x/${user.avatar || 'adventurer'}/svg?seed=${user.name}&backgroundColor=111827`);
    
    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.post('/settings/profile', {
            preserveScroll: true,
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
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'preferences', label: 'Preferences', icon: Bell },
        { id: 'data', label: 'Data', icon: Download },
    ];

    return (
        <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
            <Head title="OSCORP | Settings" />
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto">
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between">
                            <div>
                                <h1 className="text-[28px] font-bold" style={{ color: 'var(--color-text-main)' }}>Settings</h1>
                                <p className="text-[14px]" style={{ color: 'var(--color-text-muted)' }}>Manage your account configurations</p>
                            </div>
                            {flash?.success && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[13px] font-medium">
                                    <Check className="w-4 h-4" /> {flash.success}
                                </motion.div>
                            )}
                        </motion.div>

                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Sidebar Tabs */}
                            <div className="w-full md:w-56 shrink-0">
                                <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex-shrink-0 w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all ${
                                                activeTab === tab.id ? '' : 'hover:bg-[var(--color-bg-elevated)]'
                                            }`}
                                            style={activeTab === tab.id 
                                                ? { background: 'var(--color-gold-bg)', color: 'var(--color-gold)' }
                                                : { color: 'var(--color-text-muted)' }
                                            }
                                        >
                                            <tab.icon className="w-5 h-5 shrink-0" />
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <motion.div 
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    className="p-6 md:p-8 rounded-[24px]" 
                                    style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
                                >
                                    {/* ── PROFILE TAB ── */}
                                    {activeTab === 'profile' && (
                                        <form onSubmit={handleProfileSubmit}>
                                            <h2 className="text-[18px] font-semibold mb-6" style={{ color: 'var(--color-text-main)' }}>Profile Information</h2>
                                            
                                            <div className="flex items-center gap-6 mb-8 p-5 rounded-2xl" style={{ background: 'var(--color-bg-elevated)' }}>
                                                <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-[var(--color-gold)]/30 relative group">
                                                    <img src={avatarPreview} alt={user.name} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                        <Camera className="w-6 h-6 text-white" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-[16px] font-bold" style={{ color: 'var(--color-text-main)' }}>{user.name}</div>
                                                    <div className="text-[13px] mb-2" style={{ color: 'var(--color-text-muted)' }}>{user.email}</div>
                                                    <select 
                                                        value={profileForm.data.avatar}
                                                        onChange={e => {
                                                            profileForm.setData('avatar', e.target.value);
                                                            setAvatarPreview(`https://api.dicebear.com/9.x/${e.target.value}/svg?seed=${profileForm.data.name}&backgroundColor=111827`);
                                                        }}
                                                        className="text-[12px] bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-md px-2 py-1 outline-none"
                                                        style={{ color: 'var(--color-text-main)' }}
                                                    >
                                                        <option value="adventurer">Adventurer Style</option>
                                                        <option value="bottts">Bot Style</option>
                                                        <option value="avataaars">Avatar Style</option>
                                                        <option value="initials">Initials</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-5">
                                                <div>
                                                    <label className="text-[12px] uppercase tracking-wider font-semibold block mb-2" style={{ color: 'var(--color-text-muted)' }}>Full Name</label>
                                                    <input 
                                                        type="text" 
                                                        value={profileForm.data.name} 
                                                        onChange={e => profileForm.setData('name', e.target.value)}
                                                        className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-elevated)] border outline-none focus:border-[var(--color-gold)] transition-colors"
                                                        style={{ color: 'var(--color-text-main)', borderColor: profileForm.errors.name ? '#EF4444' : 'var(--color-border)' }}
                                                    />
                                                    {profileForm.errors.name && <div className="text-red-400 text-[12px] mt-1">{profileForm.errors.name}</div>}
                                                </div>
                                                <div>
                                                    <label className="text-[12px] uppercase tracking-wider font-semibold block mb-2" style={{ color: 'var(--color-text-muted)' }}>Email Address</label>
                                                    <input 
                                                        type="email" 
                                                        value={profileForm.data.email} 
                                                        onChange={e => profileForm.setData('email', e.target.value)}
                                                        className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-elevated)] border outline-none focus:border-[var(--color-gold)] transition-colors"
                                                        style={{ color: 'var(--color-text-main)', borderColor: profileForm.errors.email ? '#EF4444' : 'var(--color-border)' }}
                                                    />
                                                    {profileForm.errors.email && <div className="text-red-400 text-[12px] mt-1">{profileForm.errors.email}</div>}
                                                </div>
                                                
                                                <div className="flex justify-end pt-4">
                                                    <button 
                                                        type="submit" 
                                                        disabled={profileForm.processing || !profileForm.isDirty}
                                                        className="px-6 py-2.5 rounded-xl font-bold text-[14px] transition-all disabled:opacity-50 flex items-center gap-2"
                                                        style={{ background: 'var(--color-gold)', color: '#000' }}
                                                    >
                                                        {profileForm.processing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Profile'}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    )}

                                    {/* ── SECURITY TAB ── */}
                                    {activeTab === 'security' && (
                                        <form onSubmit={handlePasswordSubmit}>
                                            <h2 className="text-[18px] font-semibold mb-6" style={{ color: 'var(--color-text-main)' }}>Security & Password</h2>
                                            
                                            <div className="mb-8 p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Lock className="w-5 h-5 text-emerald-400" />
                                                        <div>
                                                            <div className="text-[14px] font-bold" style={{ color: 'var(--color-text-main)' }}>Two-Factor Authentication</div>
                                                            <div className="text-[12px]" style={{ color: 'var(--color-text-muted)' }}>Your account is secured with 2FA</div>
                                                        </div>
                                                    </div>
                                                    <div className="px-3 py-1.5 rounded-full text-[12px] bg-emerald-500/10 text-emerald-400 font-bold">
                                                        Enabled
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-5">
                                                {/* Current Password */}
                                                <div>
                                                    <label className="text-[12px] uppercase tracking-wider font-semibold block mb-2" style={{ color: 'var(--color-text-muted)' }}>Current Password</label>
                                                    <div className="relative">
                                                        <input 
                                                            type={showPassword.current ? 'text' : 'password'} 
                                                            value={passwordForm.data.current_password} 
                                                            onChange={e => passwordForm.setData('current_password', e.target.value)}
                                                            className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-elevated)] border outline-none focus:border-[var(--color-gold)] transition-colors pr-10"
                                                            style={{ color: 'var(--color-text-main)', borderColor: passwordForm.errors.current_password ? '#EF4444' : 'var(--color-border)' }}
                                                        />
                                                        <button type="button" onClick={() => setShowPassword(p => ({...p, current: !p.current}))} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]">
                                                            {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                    {passwordForm.errors.current_password && <div className="text-red-400 text-[12px] mt-1">{passwordForm.errors.current_password}</div>}
                                                </div>

                                                {/* New Password */}
                                                <div>
                                                    <label className="text-[12px] uppercase tracking-wider font-semibold block mb-2" style={{ color: 'var(--color-text-muted)' }}>New Password</label>
                                                    <div className="relative">
                                                        <input 
                                                            type={showPassword.new ? 'text' : 'password'} 
                                                            value={passwordForm.data.password} 
                                                            onChange={e => passwordForm.setData('password', e.target.value)}
                                                            className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-elevated)] border outline-none focus:border-[var(--color-gold)] transition-colors pr-10"
                                                            style={{ color: 'var(--color-text-main)', borderColor: passwordForm.errors.password ? '#EF4444' : 'var(--color-border)' }}
                                                        />
                                                        <button type="button" onClick={() => setShowPassword(p => ({...p, new: !p.new}))} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]">
                                                            {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                    {passwordForm.errors.password && <div className="text-red-400 text-[12px] mt-1">{passwordForm.errors.password}</div>}
                                                </div>

                                                {/* Confirm Password */}
                                                <div>
                                                    <label className="text-[12px] uppercase tracking-wider font-semibold block mb-2" style={{ color: 'var(--color-text-muted)' }}>Confirm New Password</label>
                                                    <div className="relative">
                                                        <input 
                                                            type={showPassword.confirm ? 'text' : 'password'} 
                                                            value={passwordForm.data.password_confirmation} 
                                                            onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                                                            className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-elevated)] border outline-none focus:border-[var(--color-gold)] transition-colors pr-10"
                                                            style={{ color: 'var(--color-text-main)', borderColor: passwordForm.errors.password_confirmation ? '#EF4444' : 'var(--color-border)' }}
                                                        />
                                                    </div>
                                                </div>
                                                
                                                <div className="flex justify-end pt-4">
                                                    <button 
                                                        type="submit" 
                                                        disabled={passwordForm.processing || !passwordForm.data.password}
                                                        className="px-6 py-2.5 rounded-xl font-bold text-[14px] transition-all disabled:opacity-50 flex items-center gap-2"
                                                        style={{ background: 'var(--color-gold)', color: '#000' }}
                                                    >
                                                        {passwordForm.processing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    )}

                                    {/* ── PREFERENCES TAB ── */}
                                    {activeTab === 'preferences' && (
                                        <form onSubmit={handlePreferencesSubmit}>
                                            <h2 className="text-[18px] font-semibold mb-6" style={{ color: 'var(--color-text-main)' }}>Platform Preferences</h2>
                                            
                                            <div className="space-y-4">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl gap-4" style={{ background: 'var(--color-bg-elevated)' }}>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--color-bg-base)] shrink-0">
                                                            <Globe className="w-5 h-5 text-[var(--color-gold)]" />
                                                        </div>
                                                        <div>
                                                            <div className="text-[14px] font-bold" style={{ color: 'var(--color-text-main)' }}>Base Currency</div>
                                                            <div className="text-[12px]" style={{ color: 'var(--color-text-muted)' }}>Primary currency for reporting</div>
                                                        </div>
                                                    </div>
                                                    <select 
                                                        value={preferencesForm.data.currency}
                                                        onChange={e => preferencesForm.setData('currency', e.target.value)}
                                                        className="bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-xl px-4 py-2 outline-none text-[14px] font-medium w-full sm:w-32"
                                                        style={{ color: 'var(--color-text-main)' }}
                                                    >
                                                        <option value="MAD">MAD</option>
                                                        <option value="USD">USD</option>
                                                        <option value="EUR">EUR</option>
                                                        <option value="GBP">GBP</option>
                                                    </select>
                                                </div>

                                                <div className="flex items-center justify-between p-5 rounded-2xl" style={{ background: 'var(--color-bg-elevated)' }}>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--color-bg-base)] shrink-0">
                                                            <Bell className="w-5 h-5 text-[var(--color-gold)]" />
                                                        </div>
                                                        <div>
                                                            <div className="text-[14px] font-bold" style={{ color: 'var(--color-text-main)' }}>Push Notifications</div>
                                                            <div className="text-[12px]" style={{ color: 'var(--color-text-muted)' }}>Alerts for transactions & reports</div>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        type="button"
                                                        onClick={() => preferencesForm.setData('notifications', !preferencesForm.data.notifications)}
                                                        className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${preferencesForm.data.notifications ? 'justify-end' : 'justify-start'}`}
                                                        style={{ background: preferencesForm.data.notifications ? 'var(--color-gold)' : 'var(--color-bg-base)', border: '1px solid var(--color-border)' }}
                                                    >
                                                        <motion.div layout className="w-4 h-4 rounded-full" style={{ background: preferencesForm.data.notifications ? '#000' : 'var(--color-text-muted)' }} />
                                                    </button>
                                                </div>
                                                
                                                <div className="flex justify-end pt-4">
                                                    <button 
                                                        type="submit" 
                                                        disabled={preferencesForm.processing || !preferencesForm.isDirty}
                                                        className="px-6 py-2.5 rounded-xl font-bold text-[14px] transition-all disabled:opacity-50 flex items-center gap-2"
                                                        style={{ background: 'var(--color-gold)', color: '#000' }}
                                                    >
                                                        {preferencesForm.processing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Preferences'}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    )}

                                    {/* ── DATA TAB ── */}
                                    {activeTab === 'data' && (
                                        <div>
                                            <h2 className="text-[18px] font-semibold mb-6" style={{ color: 'var(--color-text-main)' }}>Data & Privacy</h2>
                                            
                                            <div className="p-5 rounded-2xl mb-5 border border-white/5" style={{ background: 'var(--color-bg-elevated)' }}>
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--color-gold-bg)' }}>
                                                            <Download className="w-5 h-5 text-[var(--color-gold)]" />
                                                        </div>
                                                        <div>
                                                            <div className="text-[14px] font-bold" style={{ color: 'var(--color-text-main)' }}>Export Archive</div>
                                                            <div className="text-[12px]" style={{ color: 'var(--color-text-muted)' }}>Download all transactions & history in CSV/JSON format.</div>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={handleExport}
                                                        disabled={exporting}
                                                        className="px-5 py-2.5 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition-all hover:brightness-110 disabled:opacity-50 w-full sm:w-auto"
                                                        style={{ background: 'var(--color-gold)', color: '#000' }}
                                                    >
                                                        {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Download className="w-4 h-4" /> Export</>}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5">
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-red-500/10">
                                                            <AlertCircle className="w-5 h-5 text-red-500" />
                                                        </div>
                                                        <div>
                                                            <div className="text-[14px] font-bold text-red-500">Delete Account</div>
                                                            <div className="text-[12px] leading-relaxed mt-1" style={{ color: 'var(--color-text-muted)' }}>
                                                                Permanently delete your OSCORP account, history, and active subscriptions. This action is irreversible and requires confirmation.
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button className="px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:bg-red-500 hover:text-white border border-red-500/50 text-red-500 w-full sm:w-auto shrink-0 bg-red-500/10">
                                                        Delete Account
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}