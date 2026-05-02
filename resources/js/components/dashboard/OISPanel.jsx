import { useState, useRef, useEffect } from 'react';
import { Send, X, Terminal, BrainCircuit } from 'lucide-react';
import { usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { useCurrency } from '../../hooks/useCurrency';

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
                name: props.auth?.user?.name || t('dashboard.ois_default_account_holder'),
                balance: format(props.balance || 0)
            })
        }
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
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
                },
                body: JSON.stringify({
                    messages: updatedMessages,
                })
            });

            const data = await response.json();
            const aiMsgId = (Date.now() + 1).toString();
            
            if (data.error) {
                setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', text: t('dashboard.ois_system_error', { error: data.error }) }]);
            } else {
                setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', text: data.reply }]);
                
                if (data.data_updated) {
                    router.reload({ only: ['balance', 'totalSpending', 'transactions'] });
                }
            }
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: t('dashboard.ois_network_error') }]);
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
                <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
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
                className="fixed bottom-7 right-7 w-[56px] h-[56px] rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] border border-[rgba(212,175,55,0.5)] cursor-pointer z-[900] shadow-[0_0_24px_rgba(212,175,55,0.3)] flex items-center justify-center overflow-hidden group"
                title={t('dashboard.ois_access_tooltip')}
            >
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-2px] border-[1px] border-dashed border-white/40 rounded-full"
                />
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1A1612] to-[#0A0908] flex items-center justify-center relative z-10"
                    style={{ boxShadow: 'inset 0 0 10px rgba(212,175,55,0.8)' }}
                >
                    <BrainCircuit className="w-5 h-5 text-[#D4AF37]" />
                </motion.div>
            </motion.button>

            {/* Sliding Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0, transition: { type: 'spring', bounce: 0, duration: 0.4 } }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-screen w-[420px] max-w-full z-[1000] flex flex-col shadow-2xl"
                        style={{ 
                            background: 'var(--color-bg-card)', 
                            borderLeft: '1px solid var(--color-border)',
                            backdropFilter: 'blur(30px)',
                        }}
                    >
                        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] relative overflow-hidden shrink-0 bg-[var(--color-bg-base)]">
                            <motion.div 
                                animate={{ opacity: [0.1, 0.3, 0.1], x: [-50, 100] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute top-0 left-0 h-[1px] w-1/2 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent"
                            />
                            
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] shadow-[0_0_15px_var(--color-glow-primary)]">
                                    <BrainCircuit className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <div className="text-[15px] font-bold text-[var(--color-gold)] tracking-wide">{t('dashboard.ois_panel_title')}</div>
                                    <div className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-1.5 mt-0.5 uppercase tracking-widest">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] shadow-[0_0_5px_#34d399] animate-pulse"></span>
                                        {t('dashboard.ois_clearance_unrestricted')}
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-elevated)] transition-all z-10 border border-transparent hover:border-[var(--color-border-hover)]"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Chat History */}
                        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 scrollbar-thin scrollbar-thumb-[var(--color-border)] scrollbar-track-transparent">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl p-4 text-[13.5px] leading-[1.6] ${
                                        msg.role === 'user' 
                                            ? 'bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[#0A0908] rounded-tr-sm shadow-[0_4px_15px_var(--color-glow-primary)] font-bold'
                                            : 'bg-[var(--color-bg-card)] text-[var(--color-text-main)] rounded-tl-sm border border-[var(--color-border)]'
                                    }`}>
                                        {msg.role === 'ai' && msg.id !== 'welcome' && (
                                            <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-[var(--color-border)]">
                                                <Terminal className="w-3.5 h-3.5 text-[var(--color-bronze)]" />
                                                <span className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-widest">{t('dashboard.ois_analysis_result')}</span>
                                            </div>
                                        )}
                                        {renderText(msg.text)}
                                    </div>
                                </div>
                            ))}

                            {/* Processing Animation */}
                            {isLoading && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="flex w-full justify-start"
                                >
                                    <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-gold)]/20 rounded-2xl rounded-tl-sm p-4 flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-full border-2 border-[var(--color-gold)]/20 border-t-[var(--color-gold)] animate-spin" />
                                        <span className="text-[12px] font-mono text-[var(--color-gold)] tracking-widest uppercase">{t('dashboard.ois_processing')}</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-[var(--color-bg-card)] border-t border-[var(--color-border)] shrink-0 pb-6 relative">
                            {/* Scanning line animation */}
                            {isLoading && (
                                <motion.div 
                                    animate={{ y: [0, 60, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold-bg)] to-transparent pointer-events-none z-20"
                                />
                            )}
                            
                            <div className="relative group">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={t('dashboard.ois_input_placeholder')}
                                    className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-xl py-3.5 pl-4 pr-12 text-[13.5px] text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]/50 resize-none overflow-hidden transition-all shadow-inner"
                                    rows="1"
                                    disabled={isLoading}
                                    style={{ minHeight: '52px', maxHeight: '120px' }}
                                />
                                <button
                                    onClick={() => handleSend(input)}
                                    disabled={isLoading || !input.trim()}
                                    className="absolute right-2 top-2 bottom-2 w-9 rounded-lg bg-[var(--color-gold-bg)] hover:bg-[var(--color-gold)] text-[var(--color-gold)] hover:text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:hover:bg-[var(--color-gold-bg)] disabled:hover:text-[var(--color-gold)] border border-[var(--color-border-hover)] disabled:border-transparent"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="text-center mt-2 text-[10px] text-[var(--color-text-muted)] tracking-wide">
                                {t('dashboard.ois_input_hint')}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
