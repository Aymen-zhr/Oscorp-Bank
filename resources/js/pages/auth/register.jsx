import { useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { User, Lock, Mail, ArrowRight, ShieldCheck, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="min-h-screen w-full bg-[#0A0908] text-white font-sans flex items-center justify-center relative overflow-hidden selection:bg-[var(--color-gold)] selection:text-white">
            <Head title="OSCORP | Deployment Phase" />

            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(212,175,55,0.1),transparent_70%)] rounded-full pointer-events-none blur-3xl"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(212,175,55,0.05),transparent_70%)] rounded-full pointer-events-none blur-3xl"></div>

            <div className="w-full max-w-[460px] p-8 z-10">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center mb-10"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] rounded-2xl grid place-items-center mb-6 shadow-[0_0_30px_rgba(212,175,55,0.3)] border border-[rgba(255,255,255,0.1)] relative group">
                        <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-[28px] font-bold tracking-tight mb-2">OSCORP Registration</h1>
                    <p className="text-[13px] text-[var(--color-text-muted)] uppercase tracking-[2px]">Initialize Private Wealth Account</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#15141D] border border-[rgba(212,175,55,0.15)] rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.6)] relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-gold)] via-[var(--color-gold-dark)] to-[var(--color-gold)]"></div>
                    
                    <form onSubmit={submit} className="flex flex-col gap-5 mt-2">
                        {/* Name */}
                        <div>
                            <label className="block text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[1px] mb-2">
                                Operator Name
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                                    <User className="w-4 h-4" />
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="w-full bg-[#1C1A27] border border-[rgba(212,175,55,0.1)] rounded-xl py-3 pl-11 pr-4 text-[14px] text-white outline-none transition-all focus:border-[var(--color-gold)] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] placeholder:text-white/20"
                                    placeholder="Full Name"
                                    required
                                    autoFocus
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                            </div>
                            {errors.name && <div className="mt-2 text-[12px] text-red-400 font-medium">{errors.name}</div>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[1px] mb-2">
                                Communications Uplink (Email)
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full bg-[#1C1A27] border border-[rgba(212,175,55,0.1)] rounded-xl py-3 pl-11 pr-4 text-[14px] text-white outline-none transition-all focus:border-[var(--color-gold)] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] placeholder:text-white/20"
                                    placeholder="operator@oscorp.com"
                                    required
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </div>
                            {errors.email && <div className="mt-2 text-[12px] text-red-400 font-medium">{errors.email}</div>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[1px] mb-2">
                                Encryption Key (Password)
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="w-full bg-[#1C1A27] border border-[rgba(212,175,55,0.1)] rounded-xl py-3 pl-11 pr-4 text-[14px] text-white outline-none transition-all focus:border-[var(--color-gold)] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] placeholder:text-white/20"
                                    placeholder="••••••••"
                                    required
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </div>
                            {errors.password && <div className="mt-2 text-[12px] text-red-400 font-medium">{errors.password}</div>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[1px] mb-2">
                                Verify Encryption Key
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="w-full bg-[#1C1A27] border border-[rgba(212,175,55,0.1)] rounded-xl py-3 pl-11 pr-4 text-[14px] text-white outline-none transition-all focus:border-[var(--color-gold)] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] placeholder:text-white/20"
                                    placeholder="••••••••"
                                    required
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                            </div>
                            {errors.password_confirmation && <div className="mt-2 text-[12px] text-red-400 font-medium">{errors.password_confirmation}</div>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-4 w-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] hover:brightness-110 text-black font-bold text-[14px] py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {processing ? 'Processing Deployment...' : 'Establish Secure Account'}
                            {!processing && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[13px] text-[var(--color-text-muted)]">
                            Already part of the network?{' '}
                            <Link
                                href="/login"
                                className="text-[var(--color-gold)] hover:text-white transition-colors font-bold"
                            >
                                Re-authenticate
                            </Link>
                        </p>
                    </div>
                </motion.div>
                
                <div className="mt-10 text-center text-[10px] text-[var(--color-text-muted)] uppercase tracking-[2px] opacity-60 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3 h-3" /> Encrypted Deployment v4.2.0
                </div>
            </div>
        </div>
    );
}
