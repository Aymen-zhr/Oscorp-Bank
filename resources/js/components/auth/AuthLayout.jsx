import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, ArrowRightLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * -20,
    opacity: Math.random() * 0.4 + 0.1,
}));

function MagneticLogo({ children }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const ref = useRef(null);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } =
            ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const distanceX = clientX - centerX;
        const distanceY = clientY - centerY;

        // Only attract if within range
        if (Math.abs(distanceX) < 150 && Math.abs(distanceY) < 150) {
            setPosition({ x: distanceX * 0.25, y: distanceY * 0.25 });
        } else {
            setPosition({ x: 0, y: 0 });
        }
    };

    const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{
                type: 'spring',
                stiffness: 150,
                damping: 15,
                mass: 0.1,
            }}
            className="cursor-pointer"
        >
            {children}
        </motion.div>
    );
}

export default function AuthLayout({ activeTab, children, title, subtitle }) {
    const isLogin = activeTab === 'login';
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const leftContainerRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (leftContainerRef.current) {
                const rect = leftContainerRef.current.getBoundingClientRect();
                if (e.clientX <= rect.width) {
                    setMousePos({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                    });
                }
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            className="relative flex min-h-screen w-full overflow-hidden selection:bg-[var(--color-gold)] selection:text-[var(--color-gold-fg)]"
            style={{
                background: 'var(--color-bg-base)',
                color: 'var(--color-text-main)',
            }}
        >
            {/* Left Column: Atmospheric Branding */}
            <div
                ref={leftContainerRef}
                className="relative hidden items-center justify-center overflow-hidden lg:flex lg:w-1/2"
                style={{ background: '#0A0908' }}
            >
                {/* Dynamic Mouse Glow */}
                <motion.div
                    className="pointer-events-none absolute z-0 h-[800px] w-[800px] rounded-full opacity-40"
                    style={{
                        background:
                            'radial-gradient(circle, rgba(212,175,55,0.12), transparent 70%)',
                        left: mousePos.x - 400,
                        top: mousePos.y - 400,
                    }}
                />

                {/* Particles */}
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                    {particles.map((p) => (
                        <motion.div
                            key={p.id}
                            className="absolute rounded-full"
                            style={{
                                width: p.size,
                                height: p.size,
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                                backgroundColor: `rgba(212, 175, 55, ${p.opacity})`,
                            }}
                            animate={{
                                y: [0, -100, 0],
                                opacity: [
                                    p.opacity,
                                    p.opacity * 0.2,
                                    p.opacity,
                                ],
                            }}
                            transition={{
                                duration: p.duration,
                                repeat: Infinity,
                                ease: 'linear',
                                delay: p.delay,
                            }}
                        />
                    ))}
                </div>

                {/* Branding Content */}
                <div className="relative z-10 flex flex-col items-center">
                    <MagneticLogo>
                        <motion.div
                            className="group relative mb-8 flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl"
                            style={{
                                background: 'var(--color-bg-elevated)',
                                border: '1px solid var(--color-border)',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)]/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                            <svg
                                width="56"
                                height="56"
                                viewBox="0 0 100 100"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="relative z-10"
                            >
                                <path
                                    d="M50 10L15 32V68L50 90L85 68V32L50 10Z"
                                    stroke="url(#goldGradAuth)"
                                    strokeWidth="6"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M50 30L35 39V61L50 70L65 61V39L50 30Z"
                                    fill="url(#goldGradAuth)"
                                    fillOpacity="0.2"
                                    stroke="url(#goldGradAuth)"
                                    strokeWidth="2"
                                />
                                <defs>
                                    <linearGradient
                                        id="goldGradAuth"
                                        x1="15"
                                        y1="10"
                                        x2="85"
                                        y2="90"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stopColor="#D4AF37" />
                                        <stop
                                            offset="0.5"
                                            stopColor="#FFD700"
                                        />
                                        <stop offset="1" stopColor="#B8860B" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </motion.div>
                    </MagneticLogo>

                    <div className="text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-2 text-6xl font-black tracking-tighter text-white"
                        >
                            OSCORP
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-[14px] font-bold tracking-[0.5em] text-[var(--color-gold)] uppercase"
                        >
                            Private Banking
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Right Column: Form */}
            <div className="relative z-10 flex w-full flex-col items-center justify-center p-4 sm:p-6 lg:w-1/2 lg:p-12">
                {/* Mobile Header */}
                <div className="mb-8 flex items-center gap-3 sm:mb-12 lg:hidden">
                    <div
                        className="flex h-10 w-10 items-center justify-center rounded-2xl sm:h-12 sm:w-12"
                        style={{
                            background:
                                'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                        }}
                    >
                        <Shield className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter sm:text-3xl">
                        OSCORP
                    </span>
                </div>

                {/* Tab Switcher */}
                <div className="relative mb-10 w-full max-w-[460px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-1.5 shadow-2xl">
                    <div className="relative flex">
                        <motion.div
                            layoutId="auth-pill"
                            className="absolute top-0 bottom-0 rounded-xl shadow-lg"
                            style={{
                                left: isLogin ? '0%' : '50%',
                                width: '50%',
                                background:
                                    'linear-gradient(to right, var(--color-gold), var(--color-gold-dark))',
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 30,
                            }}
                        />
                        <Link
                            href="/login"
                            className={`relative z-10 w-1/2 py-3.5 text-center text-[13px] font-black tracking-widest uppercase transition-colors duration-300 ${isLogin ? 'text-[var(--color-gold-fg)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'}`}
                        >
                            Log In
                        </Link>
                        <Link
                            href="/register"
                            className={`relative z-10 w-1/2 py-3.5 text-center text-[13px] font-black tracking-widest uppercase transition-colors duration-300 ${!isLogin ? 'text-[var(--color-gold-fg)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'}`}
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>

                <div className="relative w-full max-w-[460px]">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={activeTab}
                            initial={{
                                opacity: 0,
                                x: isLogin ? -20 : 20,
                                filter: 'blur(10px)',
                            }}
                            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                            exit={{
                                opacity: 0,
                                x: isLogin ? 20 : -20,
                                filter: 'blur(10px)',
                            }}
                            transition={{
                                duration: 0.4,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            <div className="mb-10 text-center lg:text-left">
                                <motion.h2
                                    layoutId="auth-title"
                                    className="mb-3 text-4xl font-black tracking-tight text-[var(--color-text-main)] lg:text-5xl"
                                >
                                    {title}
                                </motion.h2>
                                <motion.p
                                    layoutId="auth-subtitle"
                                    className="text-[16px] leading-relaxed font-medium text-[var(--color-text-muted)]"
                                >
                                    {subtitle}
                                </motion.p>
                            </div>
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
