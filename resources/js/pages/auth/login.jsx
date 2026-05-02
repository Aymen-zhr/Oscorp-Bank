import { useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    const inputClass = "w-full bg-[#1C1A27] border border-[rgba(212,175,55,0.1)] rounded-xl py-3 pl-10 pr-4 text-[14px] text-white outline-none transition-all focus:border-[var(--color-gold)] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] placeholder:text-white/20";

    return (
        <AuthLayout activeTab="login" title="Welcome Back" subtitle="Access your secure dashboard">
            <Head title="OSCORP | Terminal Authorization" />

            {status && (
                <div className="mb-6 font-medium text-[13px] text-emerald-400 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="flex flex-col gap-5">
                <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[1px] mb-2">
                        Operator Email
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
                            placeholder="george@oscorp.com"
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    {errors.email && <div className="mt-2 text-[12px] text-red-400 font-medium">{errors.email}</div>}
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[1px]">
                            Passkey
                        </label>
                        {canResetPassword && (
                            <Link href="/forgot-password" className="text-[11px] text-[var(--color-gold)] hover:text-white transition-colors font-semibold">
                                Recover Access
                            </Link>
                        )}
                    </div>
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
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </div>
                    {errors.password && <div className="mt-2 text-[12px] text-red-400 font-medium">{errors.password}</div>}
                </div>

                <div className="flex items-center mt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                        <div className="relative flex items-center justify-center w-5 h-5 rounded-[6px] border border-[rgba(212,175,55,0.3)] bg-[#1C1A27] group-hover:border-[var(--color-gold)] transition-colors">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="absolute w-full h-full opacity-0 cursor-pointer"
                            />
                            {data.remember && (
                                <div className="w-2.5 h-2.5 rounded-[2px] bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)]"></div>
                            )}
                        </div>
                        <span className="text-[13px] text-[var(--color-text-muted)] group-hover:text-white transition-colors">Maintain active session</span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="mt-4 w-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] hover:brightness-110 text-black font-bold text-[14px] py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                    {processing ? 'Authenticating...' : 'Initialize Uplink'}
                    {!processing && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
            </form>

            <div className="mt-8 text-center lg:hidden">
                <p className="text-[13px] text-[var(--color-text-muted)]">
                    New operator?{' '}
                    <Link href="/register" className="text-[var(--color-gold)] hover:text-white transition-colors font-bold">
                        Request Deployment
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
