import { useState, useRef, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Send, Paperclip, BrainCircuit, Plus, Trash2, MessageSquare,
    PieChart, TrendingUp, Target, BarChart3, Wallet, Activity,
    X, Menu, ChevronRight
} from 'lucide-react';
import { 
    LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie, 
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend 
} from 'recharts';
import Sidebar from '@/components/dashboard/Sidebar';

const CHART_COLORS = ['#D4AF37', '#10B981', '#6366F1', '#F59E0B', '#EC4899', '#8B5CF6'];

export default function AIChat({ auth }) {
    const userName = auth?.user?.name || 'User';
    
    const quickActions = [
        { id: 'spending', label: 'Spending Analysis', icon: PieChart, color: '#D4AF37', prompt: 'Analyze my spending patterns and provide recommendations' },
        { id: 'income', label: 'Income Overview', icon: TrendingUp, color: '#10B981', prompt: 'Show me my income versus expenses breakdown' },
        { id: 'budget', label: 'Budget Strategy', icon: Target, color: '#6366F1', prompt: 'Create an optimized monthly budget for my lifestyle' },
        { id: 'forecast', label: 'Future Projection', icon: BarChart3, color: '#F59E0B', prompt: 'Forecast my financial trajectory for the coming months' },
        { id: 'savings', label: 'Wealth Building', icon: Wallet, color: '#EC4899', prompt: 'Create a strategic savings plan for me' },
        { id: 'investment', label: 'Investment Ideas', icon: Activity, color: '#8B5CF6', prompt: 'Suggest an investment strategy aligned with my profile' },
    ];

    const [chatHistory, setChatHistory] = useState([
        { id: 1, title: 'Welcome to Oscar', timestamp: new Date(), messages: [] }
    ]);
    const [activeChatId, setActiveChatId] = useState(1);
    const [messages, setMessages] = useState([
        { id: 'init', role: 'ai', text: 'Greetings, Executive. I am Oscar, your OSCORP financial intelligence. How may I serve your wealth today?', timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const createNewChat = () => {
        const newChat = {
            id: Date.now(),
            title: 'New Conversation',
            timestamp: new Date(),
            messages: []
        };
        setChatHistory(prev => [newChat, ...prev]);
        setActiveChatId(newChat.id);
        setMessages([{ id: 'init', role: 'ai', text: 'Greetings, Executive. A fresh conversation awaits. What shall we discuss regarding your finances?', timestamp: new Date() }]);
    };

    const selectChat = (chat) => {
        setActiveChatId(chat.id);
        if (chat.messages.length > 0) {
            setMessages(chat.messages);
        } else {
            setMessages([{ id: 'init', role: 'ai', text: 'Greetings, Executive. A fresh conversation awaits. What shall we discuss regarding your finances?', timestamp: new Date() }]);
        }
    };

    const deleteChat = (e, chatId) => {
        e.stopPropagation();
        setChatHistory(prev => prev.filter(c => c.id !== chatId));
        if (activeChatId === chatId && chatHistory.length > 1) {
            const remaining = chatHistory.filter(c => c.id !== chatId);
            selectChat(remaining[0]);
        }
    };

    const handleQuickAction = (action) => {
        handleSend(action.prompt);
    };

    const handleSend = async (messageText) => {
        if (!messageText?.trim() || isLoading) return;

        const userMsg = { id: Date.now(), role: 'user', text: messageText, timestamp: new Date() };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        // Update chat title if first message
        setChatHistory(prev => prev.map(chat => 
            chat.id === activeChatId && chat.title === 'New Chat'
                ? { ...chat, title: messageText.slice(0, 30) + (messageText.length > 30 ? '...' : ''), messages: updatedMessages }
                : { ...chat, messages: updatedMessages }
        ));

        try {
            const response = await fetch('/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
                },
                body: JSON.stringify({ message: messageText })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ reply: 'Apologies — systems indicate an issue. (Please retry)' }));
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    role: 'ai',
                    text: errorData.reply || `Error: ${response.status}`,
                    timestamp: new Date()
                }]);
                setIsLoading(false);
                return;
            }

            const data = await response.json();
            const aiMsg = {
                id: Date.now() + 1,
                role: 'ai',
                text: data.reply || 'Directive processed.',
                timestamp: new Date(),
                hasChart: data.hasChart || false,
                chartType: data.chartType || 'line',
                chartTitle: data.chartTitle || 'Financial Overview',
                chartData: data.chartData || null,
                hasPlan: data.hasPlan || false,
                planData: data.planData || null
            };
            
            const finalMessages = [...updatedMessages, aiMsg];
            setMessages(finalMessages);
            
            setChatHistory(prev => prev.map(chat => 
                chat.id === activeChatId ? { ...chat, messages: finalMessages } : chat
            ));
        } catch (error) {
            console.error('AI Chat Error:', error);
            setMessages(prev => [...prev, { 
                id: Date.now(), 
                role: 'ai', 
                text: 'Apologies, Executive — a momentary systems hiccup. (Do retry your query)',
                timestamp: new Date()
            }]);
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

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderChart = (chartType, chartData) => {
        if (!chartData) return null;
        const { labels, datasets } = chartData;
        
        if (chartType === 'pie') {
            const pieData = labels.map((label, i) => ({
                name: label,
                value: datasets[0]?.data[i] || 0,
                color: CHART_COLORS[i % CHART_COLORS.length]
            }));
            return (
                <ResponsiveContainer width="100%" height={260}>
                    <RePieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value" labelLine={false}>
                            {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#0A0A0B', border: '1px solid #D4AF37/20', borderRadius: '8px' }} formatter={(v) => `${v.toLocaleString()} MAD`} />
                        <Legend />
                    </RePieChart>
                </ResponsiveContainer>
            );
        }

        if (chartType === 'area' || chartType === 'line') {
            const chartDataFormatted = labels.map((label, i) => {
                const point = { name: label };
                datasets.forEach(ds => { point[ds.name] = ds.data[i]; });
                return point;
            });
            const ChartComponent = chartType === 'area' ? AreaChart : LineChart;
            return (
                <ResponsiveContainer width="100%" height={260}>
                    <ChartComponent data={chartDataFormatted}>
                        <defs>
                            {datasets.map((ds, i) => (
                                <linearGradient key={i} id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={ds.color || CHART_COLORS[i]} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={ds.color || CHART_COLORS[i]} stopOpacity={0}/>
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                        <XAxis dataKey="name" stroke="#6B7280" fontSize={11} />
                        <YAxis stroke="#6B7280" fontSize={11} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={{ background: '#0A0A0B', border: '1px solid #D4AF37/20', borderRadius: '8px' }} formatter={(v) => `${v?.toLocaleString()} MAD`} />
                        <Legend />
                        {datasets.map((ds, i) => (
                            chartType === 'area' ? (
                                <Area key={i} type="monotone" dataKey={ds.name} stroke={ds.color || CHART_COLORS[i]} fillOpacity={1} fill={`url(#grad${i})`} strokeWidth={2} />
                            ) : (
                                <Line key={i} type="monotone" dataKey={ds.name} stroke={ds.color || CHART_COLORS[i]} strokeWidth={2} dot={{ fill: ds.color || CHART_COLORS[i], r: 4 }} />
                            )
                        ))}
                    </ChartComponent>
                </ResponsiveContainer>
            );
        }

        if (chartType === 'bar') {
            const chartDataFormatted = labels.map((label, i) => {
                const point = { name: label };
                datasets.forEach(ds => { point[ds.name] = ds.data[i]; });
                return point;
            });
            return (
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={chartDataFormatted}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                        <XAxis dataKey="name" stroke="#6B7280" fontSize={11} />
                        <YAxis stroke="#6B7280" fontSize={11} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={{ background: '#0A0A0B', border: '1px solid #D4AF37/20', borderRadius: '8px' }} formatter={(v) => `${v?.toLocaleString()} MAD`} />
                        <Legend />
                        {datasets.map((ds, i) => (
                            <Bar key={i} dataKey={ds.name} fill={ds.color || CHART_COLORS[i]} radius={[4, 4, 0, 0]} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            );
        }
        return null;
    };

    const renderPlan = (planData) => {
        if (!planData) return null;
        return (
            <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#D4AF37]/20">
                    <Target className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-[14px] font-semibold text-[#D4AF37]">{planData.title}</span>
                </div>

                {planData.summary && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Object.entries(planData.summary).map(([key, val]) => (
                            <div key={key} className="bg-[#0A0A0B] rounded-lg p-2 border border-white/5">
                                <div className="text-[9px] text-[#64748B] uppercase">{key.replace('_', ' ')}</div>
                                <div className="text-[14px] font-bold text-[#F8FAFC]">{typeof val === 'number' ? val.toLocaleString() : val} MAD</div>
                            </div>
                        ))}
                    </div>
                )}

                {planData.goals && (
                    <div className="space-y-2">
                        {planData.goals.map((goal, i) => (
                            <div key={i} className="flex items-center justify-between bg-[#0A0A0B] rounded-lg p-2 border border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-6 rounded-full" style={{ backgroundColor: goal.color }}></div>
                                    <span className="text-[12px] text-[#CBD5E1]">{goal.category}</span>
                                </div>
                                <span className="text-[12px] font-bold text-[#F8FAFC]">{goal.amount?.toLocaleString()} MAD</span>
                            </div>
                        ))}
                    </div>
                )}

                {planData.allocation && (
                    <div className="flex gap-2">
                        {planData.allocation.map((alloc, i) => (
                            <div key={i} className="flex-1 bg-[#0A0A0B] rounded-lg p-3 border border-white/5 text-center">
                                <div className="text-[20px] font-bold" style={{ color: alloc.color }}>{alloc.percentage}%</div>
                                <div className="text-[10px] text-[#94A3B8]">{alloc.asset}</div>
                            </div>
                        ))}
                    </div>
                )}

                {(planData.recommendations || planData.recommended_actions) && (
                    <div className="space-y-1">
                        {(planData.recommendations || planData.recommended_actions).map((rec, i) => (
                            <div key={i} className="flex items-start gap-2 text-[11px] text-[#CBD5E1]">
                                <ChevronRight className="w-3 h-3 text-[#D4AF37] shrink-0 mt-0.5" />
                                <span>{rec}</span>
                            </div>
                        ))}
                    </div>
                )}

                {planData.milestones && (
                    <div className="space-y-1">
                        {planData.milestones.map((m, i) => (
                            <div key={i} className={`flex items-center justify-between p-2 rounded-lg border ${m.completed ? 'border-[#10B981]/30 bg-[#10B981]/5' : 'border-white/5 bg-[#0A0A0B]'}`}>
                                <span className="text-[11px] text-[#CBD5E1]">{m.name}</span>
                                <span className="text-[11px] font-bold text-[#F8FAFC]">{m.amount?.toLocaleString()} MAD</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[var(--color-bg-base)] text-[var(--color-text-main)] font-sans antialiased">
            <Head title="OSCORP AI | Intelligence System" />
            <Sidebar />

            <div className="flex-1 flex min-w-0">
                {/* Chat History Sidebar */}
                <div className={`${showHistory ? 'w-64' : 'w-0'} transition-all duration-300 bg-[#0A0A0B] border-r border-white/5 flex flex-col overflow-hidden`}>
                    <div className="p-4 border-b border-white/5">
                        <button onClick={createNewChat} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-[13px] hover:brightness-110 transition-all shadow-[0_0_15px_rgba(212,175,55,0.15)]" style={{ background: 'var(--color-gold)', color: '#0A0A0B' }}>
                            <Plus className="w-4 h-4" /> New Chat
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {chatHistory.map(chat => (
                            <div key={chat.id} onClick={() => selectChat(chat)} className={`group flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-colors ${activeChatId === chat.id ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/20' : 'hover:bg-white/5 border border-transparent'}`}>
                                <MessageSquare className={`w-4 h-4 shrink-0 ${activeChatId === chat.id ? 'text-[#D4AF37]' : 'text-[#64748B]'}`} />
                                <span className="text-[12px] text-[#CBD5E1] truncate flex-1">{chat.title}</span>
                                <button onClick={(e) => deleteChat(e, chat.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all">
                                    <Trash2 className="w-3 h-3 text-[#64748B]" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col min-w-0" style={{ background: 'radial-gradient(ellipse at top right, var(--color-gold-bg), transparent 50%)' }}>
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0A0A0B]/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setShowHistory(!showHistory)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <Menu className="w-5 h-5 text-[#64748B]" />
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg p-[1px] shadow-[0_0_10px_rgba(212,175,55,0.2)]" style={{ background: 'linear-gradient(to bottom right, var(--color-gold), transparent)' }}>
                                    <div className="w-full h-full bg-[#0A0A0B] rounded-md flex items-center justify-center">
                                        <BrainCircuit className="w-4 h-4" style={{ color: 'var(--color-gold)' }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[14px] font-semibold text-[#F8FAFC]">Oscar</div>
                                    <div className="text-[10px] text-[#64748B]">Financial Intelligence</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-4">
                        <div className="max-w-3xl mx-auto space-y-4">
                            <AnimatePresence>
                                {messages.map((msg) => (
                                    <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        {msg.role === 'ai' && (
                                            <div className="w-8 h-8 rounded-lg p-[1px] shrink-0 mt-1 shadow-[0_0_10px_rgba(212,175,55,0.15)]" style={{ background: 'linear-gradient(to bottom right, var(--color-gold), transparent)' }}>
                                                <div className="w-full h-full bg-[#0A0A0B] rounded-md flex items-center justify-center">
                                                    <BrainCircuit className="w-4 h-4" style={{ color: 'var(--color-gold)' }} />
                                                </div>
                                            </div>
                                        )}
                                        <div className={`max-w-[75%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                                            <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${msg.role === 'user' ? 'bg-[#18181B] text-[#F8FAFC] rounded-tr-sm' : 'bg-[#11100C] text-[#CBD5E1] rounded-tl-sm border border-[#D4AF37]/10'}`}>
                                                <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#D4AF37]">$1</strong>').replace(/\n/g, '<br/>') }} />
                                                
                                                {msg.hasChart && msg.chartData && (
                                                    <div className="mt-4 pt-4 border-t border-white/5">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
                                                            <span className="text-[12px] font-semibold text-[#D4AF37]">{msg.chartTitle}</span>
                                                        </div>
                                                        {renderChart(msg.chartType, msg.chartData)}
                                                    </div>
                                                )}
                                                {msg.hasPlan && msg.planData && renderPlan(msg.planData)}
                                            </div>
                                            <div className="text-[10px] text-[#475569] mt-1 px-1">{formatTime(msg.timestamp)}</div>
                                        </div>
                                        {msg.role === 'user' && (
                                            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#D4AF37]/30 shrink-0">
                                                <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${userName}&backgroundColor=111827`} alt="User" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {isLoading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                                    <div className="w-8 h-8 rounded-lg p-[1px] shrink-0 shadow-[0_0_10px_rgba(212,175,55,0.15)]" style={{ background: 'linear-gradient(to bottom right, var(--color-gold), transparent)' }}>
                                        <div className="w-full h-full bg-[#0A0A0B] rounded-md flex items-center justify-center">
                                            <BrainCircuit className="w-4 h-4 animate-pulse" style={{ color: 'var(--color-gold)' }} />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-tl-sm border" style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-gold-bg)' }}>
                                        {[0, 150, 300].map(delay => (
                                            <span key={delay} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--color-gold)', animationDelay: `${delay}ms` }}></span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="px-4 pb-2">
                        <div className="max-w-3xl mx-auto">
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                                {quickActions.map((action, i) => (
                                    <motion.button 
                                        key={action.id} 
                                        initial={{ opacity: 0, y: 10 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => handleQuickAction(action)} 
                                        disabled={isLoading} 
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-[11px] text-[#94A3B8] whitespace-nowrap disabled:opacity-50 hover:bg-white/10 hover:border-white/10"
                                        style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}
                                    >
                                        <action.icon className="w-3.5 h-3.5" style={{ color: action.color }} />
                                        {action.label}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Input */}
                    <div className="px-4 pb-4">
                        <div className="max-w-3xl mx-auto relative group">
                            <div className="absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" style={{ background: 'linear-gradient(to right, transparent, var(--color-gold-bg), transparent)' }} />
                            <div className="relative flex items-center bg-[#0A0A0B] border rounded-2xl px-4 py-3 transition-all focus-within:border-[var(--color-gold)]" style={{ borderColor: 'var(--color-border)' }}>
                                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask anything about your finances..." className="flex-1 bg-transparent text-[14px] text-[#F8FAFC] placeholder-[#475569] outline-none" disabled={isLoading} />
                                <button onClick={() => handleSend(input)} disabled={!input.trim() || isLoading} className="p-2 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 shadow-[0_0_10px_rgba(212,175,55,0.15)]" style={{ background: 'var(--color-gold)', color: '#0A0A0B' }}>
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}