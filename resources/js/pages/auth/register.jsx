import { useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';

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

    const inputClass = "w-full bg-[#1C1A27] border border-[rgba(212,175,55,0.1)] rounded-xl py-3 pl-10 pr-4 text-[14px] text-white outline-none transition-all focus:border-[var(--color-gold)] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] placeholder:text-white/20";

    return (
        <AuthLayout activeTab="register" title="Open Your Account" subtitle="Join the private banking network">
            <Head title="OSCORP | Deployment Phase" />

            <form onSubmit={submit} className="flex flex-col gap-5">
                <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[1px] mb-2">
                        Operator Name
                    </label>
                    <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                            <User className="w-4 h-4" />
                        </div>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            className={inputClass}
                            placeholder="Full Name"
                            required
                            autoFocus
                            onChange={(e) => setData('name', e.target.value)}
                        />
                    </div>
                    {errors.name && <div className="mt-2 text-[12px] text-red-400 font-medium">{errors.name}</div>}
                </div>

                <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[1px] mb-2">
                        Communications Uplink (Email)
                    </label>
                    <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                            <Mail className="w-4 h-4" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className={inputClass}
                            placeholder="operator@oscorp.com"
                            required
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    {errors.email && <div className="mt-2 text-[12px] text-red-400 font-medium">{errors.email}</div>}
                </div>

                <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[1px] mb-2">
                        Encryption Key (Password)
                    </label>
                    <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className={inputClass}
                            placeholder="••••••••"
                            required
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </div>
                    {errors.password && <div className="mt-2 text-[12px] text-red-400 font-medium">{errors.password}</div>}
                </div>

                <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[1px] mb-2">
                        Verify Encryption Key
                    </label>
                    <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className={inputClass}
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
                    className="mt-4 w-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] hover:brightness-110 text-black font-bold text-[14px] py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                    {processing ? 'Processing Deployment...' : 'Establish Secure Account'}
                    {!processing && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
            </form>

            <div className="mt-8 text-center lg:hidden">
                <p className="text-[13px] text-[var(--color-text-muted)]">
                    Already part of the network?{' '}
                    <Link href="/login" className="text-[var(--color-gold)] hover:text-white transition-colors font-bold">
                        Re-authenticate
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
