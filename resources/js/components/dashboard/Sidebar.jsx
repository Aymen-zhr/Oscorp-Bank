import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import {
    LayoutDashboard, Sparkles, CreditCard, ArrowRightLeft,
    FileText, TrendingUp, Landmark, Receipt, Moon, Sun
} from 'lucide-react';

const now = new Date();
const dateStr = now.toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric' })
    .toUpperCase()
    .replace(/\s\d{4}/, ''); // Remove year

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard',    href: '/dashboard', active: true },
    { icon: Sparkles,        label: 'Neuro AI',     href: '#' },
    { icon: CreditCard,      label: 'Accounts',     href: '#' },
    { icon: ArrowRightLeft,  label: 'Transactions', href: '#' },
    { icon: FileText,        label: 'Reports',      href: '#' },
    { icon: TrendingUp,      label: 'Investments',  href: '#' },
    { icon: Landmark,        label: 'Loans',        href: '#' },
    { icon: Receipt,         label: 'Taxes',        href: '#' },
];

export default function Sidebar() {
    const { props } = usePage();
    const user = props.auth?.user;
    const userName = user?.name?.split(' ')[0] ?? 'George';
    const { isDark, toggleTheme } = useTheme();

    return (
        <aside
            className="w-[260px] min-w-[260px] flex flex-col h-full overflow-y-auto"
            style={{ background: 'var(--color-bg-base)', borderRight: '1px solid var(--color-border)' }}
        >
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-5 pt-5 pb-4">
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', boxShadow: '0 0 14px var(--color-glow-primary)' }}
                >
                    {/* Grid-like logo matching reference */}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.9"/>
                        <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.9"/>
                        <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.9"/>
                        <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.5"/>
                    </svg>
                </div>
                <span className="font-bold text-[15px] tracking-wide text-[var(--color-text-main)]">NeuroBank</span>
            </div>

            {/* User Card */}
            <div
                className="mx-3 mb-5 rounded-2xl p-4"
                style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
            >
                {/* Avatar + Toggle buttons */}
                <div className="flex items-start justify-between mb-3">
                    <div
                        className="w-11 h-11 rounded-xl overflow-hidden shrink-0"
                        style={{ border: '1px solid var(--color-border)' }}
                    >
                        <img
                            src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${userName}&backgroundColor=111827`}
                            alt={userName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Pill toggle: Moon | Sun */}
                    <div
                        className="flex items-center rounded-full p-[3px] gap-1"
                        style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}
                    >
                        <button
                            onClick={toggleTheme}
                            className="w-[34px] h-[28px] rounded-full flex items-center justify-center transition-all duration-300"
                            style={isDark
                                ? { background: 'var(--color-gold-bg)', color: 'var(--color-gold)', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }
                                : { background: 'transparent', color: 'var(--color-text-muted)' }
                            }
                        >
                            <Moon className="w-[14px] h-[14px]" strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="w-[34px] h-[28px] rounded-full flex items-center justify-center transition-all duration-300"
                            style={!isDark
                                ? { background: 'var(--color-gold-bg)', color: 'var(--color-gold)', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }
                                : { background: 'transparent', color: 'var(--color-text-muted)' }
                            }
                        >
                            <Sun className="w-[14px] h-[14px]" strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                {/* Date + Welcome text */}
                <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-[2px] font-semibold mb-1.5">{dateStr}</div>
                <div className="text-[18px] font-bold text-[var(--color-text-main)] leading-[1.25]">
                    Welcome back,<br />{userName}!
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col gap-0.5 px-3 flex-1">
                {navItems.map(({ icon: Icon, label, href, active }) => (
                    <Link
                        key={label}
                        href={href}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-all ${
                            active
                                ? 'text-[var(--color-text-main)] font-bold'
                                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                        }`}
                        style={active ? { background: 'var(--color-gold-bg)' } : {}}
                    >
                        <Icon
                            className="w-4 h-4 shrink-0"
                            style={{ color: active ? 'var(--color-gold)' : 'var(--color-text-muted)' }}
                        />
                        {label}
                    </Link>
                ))}
            </nav>

            {/* Activate NeuroBank Pro — Gold Theme */}
            <div className="px-3 pb-5 pt-4">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="rounded-2xl p-4 cursor-pointer relative overflow-hidden"
                    style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', boxShadow: '0 4px 20px var(--color-glow-primary)' }}
                >
                    <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute inset-0"
                        style={{ background: 'radial-gradient(circle at 80% 20%, var(--color-gold-bg), transparent 60%)' }}
                    />
                    <div className="relative flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                            style={{ background: 'var(--color-gold-bg)', border: '1px solid var(--color-border)' }}
                        >
                            <Sparkles className="w-4 h-4 text-[var(--color-gold)]" />
                        </div>
                        <div>
                            <div className="text-[13px] font-bold text-[var(--color-gold)] mb-0.5 tracking-wide">NeuroBank Elite</div>
                            <div className="text-[11px] text-[var(--color-text-muted)]">Unlock private wealth AI</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </aside>
    );
}
