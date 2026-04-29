import { Bell, Search, Zap, User, Settings, LogOut, ChevronDown, Menu } from 'lucide-react';
import { usePage, Link } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Topbar() {
    const { props } = usePage();
    const balance = props.balance ?? 0;
    let transactions = props.transactions ?? [];
    
    if (transactions?.data) {
        transactions = transactions.data;
    }
    
    const [searchFocused, setSearchFocused] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef(null);
    const user = props.auth?.user;

    const now = new Date();
    const day = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });

    const credits = transactions?.filter ? transactions.filter(t => t.type === 'credit').reduce((s, t) => s + Number(t.amount), 0) : 0;
    const debits = transactions?.filter ? transactions.filter(t => t.type === 'debit').reduce((s, t) => s + Number(t.amount), 0) : 0;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="flex items-center justify-between px-4 md:px-6 py-3 shrink-0 gap-3 md:gap-4 relative z-50"
            style={{ background: 'var(--color-bg-card)', borderBottom: '1px solid var(--color-border)' }}
        >
            {/* Left: Hamburger + Title */}
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))}
                    className="md:hidden p-2 rounded-xl text-[var(--color-text-main)] hover:bg-[var(--color-bg-elevated)] transition-all"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div className="flex flex-col">
                    <motion.h1 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[16px] md:text-[20px] font-bold text-[var(--color-text-main)] truncate max-w-[150px] md:max-w-none"
                    >
                        Welcome, <span style={{ color: 'var(--color-gold)' }}>{user?.name?.split(' ')[0] || 'Executive'}</span>
                    </motion.h1>
                    <div className="hidden md:block text-[11px] text-[var(--color-text-muted)]">{day}</div>
                </div>
            </div>

            {/* Center: Quick stats */}
            <div className="hidden lg:flex items-center gap-3">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl"
                    style={{ background: 'var(--color-gold-bg)', border: '1px solid var(--color-gold)/20' }}
                >
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--color-gold)', boxShadow: '0 0 10px var(--color-gold)' }} />
                    <span className="text-[14px] font-bold text-[var(--color-gold)]">{Number(balance).toLocaleString()} MAD</span>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-emerald-400"
                    style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}
                >
                    <span className="text-[12px] font-semibold">+{Number(credits).toLocaleString()}</span>
                    <span className="text-[10px] text-emerald-400/70">in</span>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-red-400"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                    <span className="text-[12px] font-semibold">-{Number(debits).toLocaleString()}</span>
                    <span className="text-[10px] text-red-400/70">out</span>
                </motion.div>
            </div>

            {/* Right: Search + Actions */}
            <div className="flex items-center gap-3">
                <motion.div
                    animate={{ width: searchFocused ? 200 : 140 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl overflow-hidden"
                    style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}
                >
                    <Search className="w-4 h-4 text-[var(--color-text-muted)]" />
                    <input
                        className="bg-transparent outline-none text-[12px] text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] w-full"
                        placeholder="Search..."
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                    />
                </motion.div>

                <button className="relative p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-gold)] hover:bg-[var(--color-gold-bg)] transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: 'var(--color-gold)', boxShadow: '0 0 8px var(--color-gold)' }} />
                </button>

                {/* User Menu */}
                <div className="relative" ref={menuRef}>
                    <button 
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[var(--color-bg-elevated)] transition-all"
                    >
                        <div className="w-8 h-8 rounded-lg overflow-hidden ring-2 ring-[var(--color-gold)]/30">
                            <img 
                                src={user?.avatar?.startsWith('/') 
                                    ? user.avatar 
                                    : `https://api.dicebear.com/9.x/${user?.avatar || 'adventurer'}/svg?seed=${user?.name || 'user'}&backgroundColor=111827`
                                } 
                                alt="avatar" 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        <ChevronDown className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {showUserMenu && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-full mt-2 w-48 py-2 rounded-xl shadow-xl"
                                style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
                            >
                                <Link href="/account" className="flex items-center gap-2 px-4 py-2 text-[13px] text-[var(--color-text-main)] hover:bg-[var(--color-bg-elevated)]" onClick={() => setShowUserMenu(false)}>
                                    <User className="w-4 h-4" /> My Account
                                </Link>
                                <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-[13px] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)]" onClick={() => setShowUserMenu(false)}>
                                    <Settings className="w-4 h-4" /> Settings
                                </Link>
                                <hr className="my-2" style={{ borderColor: 'var(--color-border)' }} />
                                <button className="flex items-center gap-2 px-4 py-2 text-[13px] text-red-400 hover:bg-red-500/10 w-full">
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}