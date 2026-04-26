import { Bell, Search, TrendingUp, ArrowDownLeft, ArrowUpRight, Zap } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Topbar() {
    const { props } = usePage();
    const balance = props.balance ?? 0;
    const transactions = props.transactions ?? [];
    const totalSpending = props.totalSpending ?? 0;
    const [searchFocused, setSearchFocused] = useState(false);

    const now = new Date();
    const month = now.toLocaleString('en-GB', { month: 'long', year: 'numeric' });
    const day = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });

    const credits = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + Number(t.amount), 0);
    const debits = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + Number(t.amount), 0);

    return (
        <div className="flex items-center justify-between px-6 py-3 shrink-0 gap-4"
            style={{ background: 'var(--color-bg-card)', borderBottom: '1px solid var(--color-border)', backdropFilter: 'blur(20px)' }}
        >
            {/* Left: Title + date */}
            <div className="flex flex-col min-w-0">
                <div className="text-[18px] font-bold text-[var(--color-text-main)] leading-tight">Dashboard</div>
                <div className="text-[11px] text-[var(--color-text-muted)] tracking-wide">{day}</div>
            </div>

            {/* Center: Quick stat pills */}
            <div className="flex items-center gap-2 flex-1 justify-center">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-semibold"
                    style={{ background: 'var(--color-gold-bg)', border: '1px solid var(--color-border)', color: 'var(--color-gold)' }}
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] shadow-[0_0_8px_var(--color-gold)]" />
                    {Number(balance).toLocaleString()} MAD
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-emerald-400"
                    style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}
                >
                    <ArrowDownLeft className="w-3 h-3" />
                    +{Number(credits).toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-[var(--color-text-muted)]"
                    style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}
                >
                    <ArrowUpRight className="w-3 h-3" />
                    -{Number(debits).toLocaleString()}
                </div>
            </div>

            {/* Right: Search + actions */}
            <div className="flex items-center gap-2">
                <motion.div
                    animate={{ width: searchFocused ? 220 : 160 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] cursor-text overflow-hidden"
                    style={{ background: 'var(--color-bg-elevated)', border: `1px solid ${searchFocused ? 'var(--color-gold)' : 'var(--color-border)'}`, transition: 'border-color 0.2s' }}
                    onClick={() => setSearchFocused(true)}
                >
                    <Search className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" />
                    <input
                        className="bg-transparent outline-none text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] text-[12px] w-full"
                        placeholder="Search ledgers..."
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                    />
                </motion.div>

                <button className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-elevated)] transition-all border border-transparent hover:border-[var(--color-border-hover)] relative">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[var(--color-gold)] rounded-full shadow-[0_0_6px_var(--color-gold)]" />
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold text-black transition-all hover:brightness-110 hover:-translate-y-px shadow-[0_4px_15px_rgba(212,175,55,0.3)]"
                    style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))' }}
                >
                    <Zap className="w-3.5 h-3.5" />
                    Quick Transfer
                </button>
            </div>
        </div>
    );
}
