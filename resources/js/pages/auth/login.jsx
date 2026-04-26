import { useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Brain, Lock, Mail, ArrowRight } from 'lucide-react';

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

    return (
        <div className="min-h-screen w-full bg-[var(--color-canvas)] text-white font-sans flex items-center justify-center relative overflow-hidden selection:bg-[var(--color-purple)] selection:text-white">
            <Head title="NeuroBank | Authorization Core" />

            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle,rgba(191,0,255,0.15),transparent_70%)] rounded-full pointer-events-none blur-3xl"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle,rgba(255,0,127,0.1),transparent_70%)] rounded-full pointer-events-none blur-3xl"></div>

            <div className="w-full max-w-[420px] p-8 z-10">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-purple)] to-[var(--color-pink)] rounded-2xl grid place-items-center mb-6 shadow-[0_0_30px_rgba(191,0,255,0.3)] border border-[rgba(255,255,255,0.1)] relative group">
                        <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Brain className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-[28px] font-bold tracking-tight mb-2">NeuroBank Core</h1>
                    <p className="text-[13px] text-muted-foreground uppercase tracking-[2px]">Terminal Authorization Required</p>
                </div>

                {status && (
                    <div className="mb-6 font-medium text-[13px] text-[#00FF80] bg-[rgba(0,255,128,0.1)] p-3 rounded-lg border border-[rgba(0,255,128,0.2)] text-center">
                        {status}
                    </div>
                )}

                <div className="bg-[#15141D] border border-[rgba(191,0,255,0.15)] rounded-2xl p-7 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-purple)] via-[var(--color-pink)] to-[var(--color-lime)]"></div>
                    
                    <form onSubmit={submit} className="flex flex-col gap-5 mt-2">
                        <div>
                            <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-[1px] mb-2">
                                Operator Email
                            </label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full bg-[#1C1A27] border border-[rgba(191,0,255,0.2)] rounded-xl py-3 pl-10 pr-4 text-[14px] text-white outline-none transition-all focus:border-[var(--color-purple)] focus:shadow-[0_0_0_3px_rgba(191,0,255,0.15)] placeholder:text-white/20"
                                    placeholder="george@oscorp.com"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </div>
                            {errors.email && <div className="mt-2 text-[12px] text-[var(--color-pink)] font-medium">{errors.email}</div>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-[1px]">
                                    Passkey
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href="/forgot-password"
                                        className="text-[11px] text-[var(--color-purple)] hover:text-[var(--color-pink)] transition-colors font-semibold"
                                    >
                                        Recover Access
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="w-full bg-[#1C1A27] border border-[rgba(191,0,255,0.2)] rounded-xl py-3 pl-10 pr-4 text-[14px] text-white outline-none transition-all focus:border-[var(--color-purple)] focus:shadow-[0_0_0_3px_rgba(191,0,255,0.15)] placeholder:text-white/20"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </div>
                            {errors.password && <div className="mt-2 text-[12px] text-[var(--color-pink)] font-medium">{errors.password}</div>}
                        </div>

                        <div className="flex items-center mt-1">
                            <label className="flex items-center gap-2.5 cursor-pointer group">
                                <div className="relative flex items-center justify-center w-5 h-5 rounded-[6px] border border-[rgba(191,0,255,0.3)] bg-[#1C1A27] group-hover:border-[var(--color-purple)] transition-colors">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="absolute w-full h-full opacity-0 cursor-pointer"
                                    />
                                    {data.remember && (
                                        <div className="w-2.5 h-2.5 rounded-[2px] bg-gradient-to-br from-[var(--color-purple)] to-[var(--color-pink)]"></div>
                                    )}
                                </div>
                                <span className="text-[13px] text-muted-foreground group-hover:text-white transition-colors">Maintain active session</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-4 w-full bg-gradient-to-r from-[var(--color-purple)] to-[var(--color-pink)] hover:to-[var(--color-purple)] text-white font-bold text-[14px] py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(191,0,255,0.25)] hover:shadow-[0_0_30px_rgba(191,0,255,0.4)] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Authenticating...' : 'Initialize Uplink'}
                            {!processing && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>
                </div>
                
                <div className="mt-8 text-center text-[11px] text-muted-foreground uppercase tracking-[1.5px] opacity-60">
                    O.S.C.O.R.P. Security Infrastructure v4.2
                </div>
            </div>
        </div>
    );
}
