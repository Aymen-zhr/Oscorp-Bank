import { Head, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { ArrowDownToLine, CheckCircle, Copy, Search, X, Share2, QrCode, Download, ShieldCheck, Clock } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import { QRCodeCanvas } from 'qrcode.react';
import { TIMEOUTS, ROUTES } from '@/constants';

export default function Receive({ balance, recentReceives = [], contacts = [] }) {
    const { t } = useTranslation();
    const { format, code } = useCurrency();
    const { props } = usePage();
    const [copied, setCopied] = useState(false);
    
    // Request Payment State
    const [requestSearch, setRequestSearch] = useState('');
    const [requestResults, setRequestResults] = useState([]);
    const [selectedRequester, setSelectedRequester] = useState(null);
    const [showRequestResults, setShowRequestResults] = useState(false);
    const [requestAmount, setRequestAmount] = useState('');
    const [requestNote, setRequestNote] = useState('');
    const [requestSending, setRequestSending] = useState(false);
    const [requestSuccess, setRequestSuccess] = useState(false);

    const myRIB = props.rib?.full || 'MA64 0079 9901 1234 5678 9012 34';

    const copyRIB = () => {
        navigator.clipboard.writeText(myRIB);
        setCopied(true);
        setTimeout(() => setCopied(false), TIMEOUTS.copyFeedback);
    };

    const copyLink = () => {
        const url = `${window.location.origin}/send?to=${encodeURIComponent(myRIB)}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), TIMEOUTS.copyFeedback);
    };

    const downloadQR = () => {
        const canvas = document.getElementById("receive-qr");
        if (!canvas) return;
        const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `OSCORP_QR_${myRIB.replace(/\\s/g, '_')}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const searchUsers = useCallback(async (query) => {
        if (!query || query.length < 2) {
            setRequestResults([]);
            return;
        }
        try {
            const res = await fetch(`${ROUTES.contacts}/search?q=${encodeURIComponent(query)}`);
            const results = await res.json();
            setRequestResults(results);
        } catch (e) {
            console.error('Search failed:', e);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (requestSearch.length >= 2 && !selectedRequester) {
                searchUsers(requestSearch);
                setShowRequestResults(true);
            } else {
                setRequestResults([]);
                setShowRequestResults(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [requestSearch, searchUsers, selectedRequester]);

    const selectRequester = (user) => {
        setSelectedRequester(user);
        setRequestSearch(user.name);
        setShowRequestResults(false);
        setRequestResults([]);
    };

    const clearRequester = () => {
        setSelectedRequester(null);
        setRequestSearch('');
    };

    const sendRequest = () => {
        if (!selectedRequester || !requestAmount || parseFloat(requestAmount) <= 0) return;
        setRequestSending(true);
        router.post('/receive', {
            amount: parseFloat(requestAmount),
            requester_id: selectedRequester.id,
            note: requestNote || null,
        }, {
            onSuccess: () => {
                setRequestSuccess(true);
                setRequestAmount('');
                setRequestSearch('');
                setSelectedRequester(null);
                setRequestNote('');
                setTimeout(() => setRequestSuccess(false), TIMEOUTS.successMessage);
            },
            onFinish: () => setRequestSending(false),
        });
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
            <Head title="OSCORP | Receive Money" />
            <Sidebar active="receive" />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Topbar />

                <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-32 lg:pb-8">
                    <div className="max-w-5xl mx-auto space-y-6">

                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--color-text-main)' }}>{t('receive_page.title')}</h1>
                                <p className="text-sm font-medium opacity-50 mt-1" style={{ color: 'var(--color-text-main)' }}>{t('receive_page.subtitle')}</p>
                            </div>
                            <div className="md:text-right">
                                <div className="text-[11px] font-bold uppercase tracking-widest opacity-40 mb-1" style={{ color: 'var(--color-text-main)' }}>{t('receive_page.balance')}</div>
                                <div className="text-2xl font-black" style={{ color: 'var(--color-text-main)' }}>
                                    {format(balance)} <span className="text-sm opacity-50 ml-1">{code}</span>
                                </div>
                            </div>
                        </div>

                        {/* Success Message */}
                        <AnimatePresence>
                            {requestSuccess && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-sm font-bold flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5" />
                                    {t('receive_page.request_sent')}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                            
                            {/* Left Section (Details & Request) */}
                            <div className="lg:col-span-2 space-y-5">
                                
                                {/* RIB Display */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-[24px] p-6" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                                            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-main)' }}>Your Bank Details</h2>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-8">
                                        <div className="text-[11px] font-bold uppercase tracking-widest opacity-50 mb-2" style={{ color: 'var(--color-text-main)' }}>{t('receive_page.your_rib')}</div>
                                        <div className="font-mono text-2xl lg:text-3xl tracking-widest font-bold" style={{ color: 'var(--color-text-main)' }}>
                                            {myRIB.match(/.{1,4}/g).join(' ')}
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button onClick={copyRIB} className="flex-1 py-4 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-colors border text-white"
                                            style={{ background: copied ? '#10B981' : 'transparent', borderColor: copied ? '#10B981' : 'var(--color-border)', color: copied ? '#FFF' : 'var(--color-text-main)' }}>
                                            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            {copied ? t('receive_page.copied') : t('receive_page.copy_rib')}
                                        </button>
                                        <button onClick={copyLink} className="flex-1 py-4 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-colors border hover:bg-white/5"
                                            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }}>
                                            <Share2 className="w-4 h-4" />
                                            {t('receive_page.copy_link')}
                                        </button>
                                    </div>
                                </div>

                                {/* Request Payment Form */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-[24px] p-6 space-y-5" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <ArrowDownToLine className="w-5 h-5 text-purple-500" />
                                        <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-main)' }}>{t('receive_page.request_title')}</h2>
                                    </div>
                                    <p className="text-sm font-medium opacity-50" style={{ color: 'var(--color-text-main)' }}>Send a payment request directly to an Oscorp user.</p>

                                    <div className="space-y-6 pt-4 border-t border-white/5" style={{ borderColor: 'var(--color-border)' }}>
                                        {/* From Field */}
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-bold uppercase tracking-widest opacity-50" style={{ color: 'var(--color-text-main)' }}>{t('receive_page.from')}</label>
                                            <div className="relative">
                                                <div className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${selectedRequester ? 'border-purple-500 bg-purple-500/5' : 'bg-black/20 hover:border-white/20'}`} style={!selectedRequester ? { borderColor: 'var(--color-border)', background: 'var(--color-bg-elevated)' } : {}}>
                                                    <Search className={`w-5 h-5 ${selectedRequester ? 'text-purple-500' : 'opacity-30'}`} style={!selectedRequester ? { color: 'var(--color-text-main)' } : {}} />
                                                    <input type="text" value={requestSearch} onChange={e => setRequestSearch(e.target.value)}
                                                        onFocus={() => requestResults.length > 0 && setShowRequestResults(true)}
                                                        placeholder={t('receive_page.search_from')}
                                                        className="flex-1 bg-transparent text-base font-bold outline-none placeholder:opacity-30 placeholder:font-medium" style={{ color: 'var(--color-text-main)' }} />
                                                    {selectedRequester && (
                                                        <button onClick={clearRequester} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                                                            <X className="w-5 h-5 opacity-50" style={{ color: 'var(--color-text-main)' }} />
                                                        </button>
                                                    )}
                                                </div>
                                                
                                                <AnimatePresence>
                                                    {showRequestResults && requestResults.length > 0 && (
                                                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                                                            className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 rounded-xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl" style={{ background: 'var(--color-bg-card)' }}>
                                                            <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                                                                {requestResults.map(user => (
                                                                    <button key={user.id} onClick={() => selectRequester(user)}
                                                                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-left">
                                                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 bg-purple-500/10 text-purple-500">
                                                                            {getInitials(user.name)}
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-sm font-bold" style={{ color: 'var(--color-text-main)' }}>{user.name}</div>
                                                                            <div className="text-xs opacity-50" style={{ color: 'var(--color-text-main)' }}>{user.email}</div>
                                                                        </div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        {/* Amount Field */}
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-bold uppercase tracking-widest opacity-50" style={{ color: 'var(--color-text-main)' }}>{t('receive_page.request_amount')}</label>
                                            <div className="flex items-center gap-3 w-full py-3 px-5 rounded-xl border transition-all hover:border-white/20 focus-within:border-purple-500 bg-black/20" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-elevated)' }}>
                                                <span className="text-xl font-black opacity-30 shrink-0" style={{ color: 'var(--color-text-main)' }}>{code}</span>
                                                <input type="number" placeholder="0.00" value={requestAmount} onChange={e => setRequestAmount(e.target.value)}
                                                    className="flex-1 bg-transparent text-3xl font-black outline-none placeholder:opacity-20" 
                                                    style={{ color: 'var(--color-text-main)' }} />
                                            </div>
                                        </div>

                                        {/* Note Field */}
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-bold uppercase tracking-widest opacity-50" style={{ color: 'var(--color-text-main)' }}>{t('send_page.note_label')}</label>
                                            <input type="text" value={requestNote} onChange={e => setRequestNote(e.target.value)}
                                                placeholder={t('send_page.note_placeholder')}
                                                className="w-full py-4 px-5 rounded-xl text-sm font-medium outline-none border transition-all bg-black/20 hover:border-white/20 focus:border-purple-500 placeholder:opacity-30"
                                                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-main)', background: 'var(--color-bg-elevated)' }} />
                                        </div>

                                        {/* Submit Request */}
                                        <div className="pt-2">
                                            <button onClick={sendRequest} disabled={requestSending || !selectedRequester || !requestAmount}
                                                className="w-full h-14 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all disabled:opacity-30 text-white"
                                                style={{ background: '#8B5CF6' }}>
                                                {requestSending ? (
                                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                                                ) : (
                                                    <>{t('receive_page.send_request')} <ArrowDownToLine className="w-4 h-4" /></>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Section (QR & History) */}
                            <div className="space-y-5">
                                
                                {/* QR Code Display */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-[24px] p-8 flex flex-col items-center text-center" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
                                    <h3 className="text-[11px] font-bold uppercase tracking-widest opacity-50 mb-2" style={{ color: 'var(--color-text-main)' }}>{t('receive_page.asset_qr')}</h3>
                                    <p className="text-xs font-medium opacity-50 mb-6" style={{ color: 'var(--color-text-main)' }}>{t('receive_page.qr_desc')}</p>
                                    
                                    <div className="bg-white p-4 rounded-2xl mb-6">
                                        <QRCodeCanvas
                                            id="receive-qr"
                                            value={`${window.location.origin}/send?to=${encodeURIComponent(myRIB)}`}
                                            size={160}
                                            level="H"
                                            includeMargin={false}
                                            imageSettings={{ src: "/logo_premium.png", height: 36, width: 36, excavate: true }}
                                        />
                                    </div>
                                    
                                    <button onClick={downloadQR} className="w-full py-3 rounded-xl border font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors hover:bg-white/5"
                                        style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }}>
                                        <Download className="w-4 h-4" />
                                        {t('receive_page.download_qr')}
                                    </button>
                                </div>

                                {/* Recent History */}
                                {recentReceives.length > 0 && (
                                    <div className="bg-white/[0.02] border border-white/5 rounded-[24px] p-6" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
                                        <div className="flex items-center gap-2 mb-6">
                                            <Clock className="w-4 h-4 opacity-40" style={{ color: 'var(--color-text-main)' }} />
                                            <h3 className="text-[11px] font-bold uppercase tracking-widest opacity-50" style={{ color: 'var(--color-text-main)' }}>{t('receive_page.incoming_log')}</h3>
                                        </div>
                                        <div className="space-y-4">
                                            {recentReceives.slice(0, 5).map((r, i) => (
                                                <div key={i} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center text-xs font-bold">
                                                            {getInitials(r.merchant?.replace('Received from ', '') || '?')}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold" style={{ color: 'var(--color-text-main)' }}>{r.merchant?.replace('Received from ', '')}</div>
                                                            <div className="text-[10px] font-medium opacity-50 mt-0.5" style={{ color: 'var(--color-text-main)' }}>{new Date(r.transacted_at).toLocaleDateString()}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm font-bold text-[#10B981]">+{format(r.amount)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
                input[type=number]::-webkit-inner-spin-button, 
                input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
            `}} />
        </div>
    );
}
