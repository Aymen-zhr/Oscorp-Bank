import { useState, useRef, useEffect } from 'react';
import { Send, X, Terminal } from 'lucide-react';
import { usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { useCurrency } from '../../hooks/useCurrency';

// Website Logo Component (Hexagon)
const OscorpLogo = ({ size = 20, color = 'currentColor', strokeWidth = 6 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M50 10L15 32V68L50 90L85 68V32L50 10Z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
        />
        <path
            d="M50 30L35 39V61L50 70L65 61V39L50 30Z"
            fill={color}
            fillOpacity="0.2"
            stroke={color}
            strokeWidth="2"
        />
    </svg>
);

export default function OISPanel() {
    const { props } = usePage();
    const { t } = useTranslation();
    const { format } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            role: 'ai',
            text: t('dashboard.ois_welcome', {
                name:
                    props.auth?.user?.name ||
                    t('dashboard.ois_default_account_holder'),
                balance: format(props.balance || 0),
            }),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async (text) => {
        if (!text.trim() || isLoading) return;

        const newMsgId = Date.now().toString();
        const newMsg = { id: newMsgId, role: 'user', text };
        const updatedMessages = [...messages, newMsg];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document.querySelector('meta[name="csrf-token"]')
                            ?.content || '',
                },
                body: JSON.stringify({
                    messages: updatedMessages,
                }),
            });

            const data = await response.json();
            const aiMsgId = (Date.now() + 1).toString();

            if (data.error) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: aiMsgId,
                        role: 'ai',
                        text: t('dashboard.ois_system_error', {
                            error: data.error,
                        }),
                    },
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    { id: aiMsgId, role: 'ai', text: data.reply },
                ]);

                if (data.data_updated) {
                    router.reload({
                        only: ['balance', 'totalSpending', 'transactions'],
                    });
                }
            }
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    role: 'ai',
                    text: t('dashboard.ois_network_error'),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(input);
        }
    };

    const renderText = (text) => {
        const parts = text.split('\n').map((line, i) => (
            <span key={i}>
                <span
                    dangerouslySetInnerHTML={{
                        __html: line.replace(
                            /\*\*(.*?)\*\*/g,
                            '<strong>$1</strong>',
                        ),
                    }}
                />
                {i !== text.split('\n').length - 1 && <br />}
            </span>
        ));
        return parts;
    };

    return (
        <>
            {/* Animated Luxury AI Toggle */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group fixed right-7 bottom-7 z-[900] flex h-[56px] w-[56px] cursor-pointer items-center justify-center overflow-hidden rounded-full border border-[rgba(212,175,55,0.5)] bg-gradient-to-br from-[#D4AF37] to-[#B8860B] shadow-[0_0_24px_rgba(212,175,55,0.3)]"
                title={t('dashboard.ois_access_tooltip')}
            >
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    className="absolute inset-[-2px] rounded-full border-[1px] border-dashed border-white/40"
                />
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#1A1612] to-[#0A0908]"
                    style={{ boxShadow: 'inset 0 0 10px rgba(212,175,55,0.8)' }}
                >
                    <OscorpLogo size={24} color="#D4AF37" strokeWidth={8} />
                </motion.div>
            </motion.button>

            {/* Sliding Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{
                            x: '100%',
                            opacity: 0,
                            transition: {
                                type: 'spring',
                                bounce: 0,
                                duration: 0.4,
                            },
                        }}
                        transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 200,
                        }}
                        className="fixed top-0 right-0 z-[1000] flex h-screen w-[420px] max-w-full flex-col shadow-2xl"
                        style={{
                            background: 'var(--color-bg-card)',
                            borderLeft: '1px solid var(--color-border)',
                            backdropFilter: 'blur(30px)',
                        }}
                    >
                        <div className="relative flex shrink-0 items-center justify-between overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-bg-base)] p-5">
                            <motion.div
                                animate={{
                                    opacity: [0.1, 0.3, 0.1],
                                    x: [-50, 100],
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute top-0 left-0 h-[1px] w-1/2 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent"
                            />

                            <div className="relative z-10 flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] shadow-[0_0_15px_var(--color-glow-primary)]">
                                    <OscorpLogo
                                        size={20}
                                        color="white"
                                        strokeWidth={10}
                                    />
                                </div>
                                <div>
                                    <div className="text-[15px] font-bold tracking-wide text-[var(--color-gold)]">
                                        {t('dashboard.ois_panel_title')}
                                    </div>
                                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px] tracking-widest text-[var(--color-text-muted)] uppercase">
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#34d399] shadow-[0_0_5px_#34d399]"></span>
                                        {t(
                                            'dashboard.ois_clearance_unrestricted',
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="z-10 flex h-8 w-8 items-center justify-center rounded-xl border border-transparent text-[var(--color-text-muted)] transition-all hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-main)]"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Chat History */}
                        <div className="scrollbar-thin scrollbar-thumb-[var(--color-border)] scrollbar-track-transparent flex flex-1 flex-col gap-5 overflow-y-auto p-5">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl p-4 text-[13.5px] leading-[1.6] ${
                                            msg.role === 'user'
                                                ? 'rounded-tr-sm bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] font-bold text-[#0A0908] shadow-[0_4px_15px_var(--color-glow-primary)]'
                                                : 'rounded-tl-sm border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-main)]'
                                        }`}
                                    >
                                        {msg.role === 'ai' &&
                                            msg.id !== 'welcome' && (
                                                <div className="mb-2 flex items-center gap-1.5 border-b border-[var(--color-border)] pb-2">
                                                    <Terminal className="h-3.5 w-3.5 text-[var(--color-bronze)]" />
                                                    <span className="font-mono text-[10px] tracking-widest text-[var(--color-text-muted)] uppercase">
                                                        {t(
                                                            'dashboard.ois_analysis_result',
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        {renderText(msg.text)}
                                    </div>
                                </div>
                            ))}

                            {/* Processing Animation */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex w-full justify-start"
                                >
                                    <div className="flex items-center gap-3 rounded-2xl rounded-tl-sm border border-[var(--color-gold)]/20 bg-[var(--color-bg-elevated)] p-4">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-gold)]/20 border-t-[var(--color-gold)]" />
                                        <span className="font-mono text-[12px] tracking-widest text-[var(--color-gold)] uppercase">
                                            {t('dashboard.ois_processing')}
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="relative shrink-0 border-t border-[var(--color-border)] bg-[var(--color-bg-card)] p-4 pb-6">
                            {/* Scanning line animation */}
                            {isLoading && (
                                <motion.div
                                    animate={{ y: [0, 60, 0] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'linear',
                                    }}
                                    className="pointer-events-none absolute top-0 left-0 z-20 h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--color-gold-bg)] to-transparent"
                                />
                            )}

                            <div className="group relative">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={t(
                                        'dashboard.ois_input_placeholder',
                                    )}
                                    className="w-full resize-none overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-base)] py-3.5 pr-12 pl-4 text-[13.5px] text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] shadow-inner transition-all focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]/50 focus:outline-none"
                                    rows="1"
                                    disabled={isLoading}
                                    style={{
                                        minHeight: '52px',
                                        maxHeight: '120px',
                                    }}
                                />
                                <button
                                    onClick={() => handleSend(input)}
                                    disabled={isLoading || !input.trim()}
                                    className="absolute top-2 right-2 bottom-2 flex w-9 items-center justify-center rounded-lg border border-[var(--color-border-hover)] bg-[var(--color-gold-bg)] text-[var(--color-gold)] transition-all hover:bg-[var(--color-gold)] hover:text-[var(--color-gold-fg)] disabled:border-transparent disabled:opacity-50 disabled:hover:bg-[var(--color-gold-bg)] disabled:hover:text-[var(--color-gold)]"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="mt-2 text-center text-[10px] tracking-wide text-[var(--color-text-muted)]">
                                {t('dashboard.ois_input_hint')}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
