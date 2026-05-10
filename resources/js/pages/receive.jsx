import { Head, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import {
    ArrowDownToLine,
    CheckCircle,
    Copy,
    Search,
    X,
    Share2,
    QrCode,
    Download,
    ShieldCheck,
    Clock,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import { QRCodeCanvas } from 'qrcode.react';
import { TIMEOUTS, ROUTES, COLORS } from '@/constants';

export default function Receive({
    balance,
    recentReceives = [],
    contacts = [],
}) {
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
        const canvas = document.getElementById('receive-qr');
        if (!canvas) return;
        const pngUrl = canvas
            .toDataURL('image/png')
            .replace('image/png', 'image/octet-stream');
        let downloadLink = document.createElement('a');
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
            const res = await fetch(
                `${ROUTES.contacts}/search?q=${encodeURIComponent(query)}`,
            );
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
        if (
            !selectedRequester ||
            !requestAmount ||
            parseFloat(requestAmount) <= 0
        )
            return;
        setRequestSending(true);
        router.post(
            '/receive',
            {
                amount: parseFloat(requestAmount),
                requester_id: selectedRequester.id,
                note: requestNote || null,
            },
            {
                onSuccess: () => {
                    setRequestSuccess(true);
                    setRequestAmount('');
                    setRequestSearch('');
                    setSelectedRequester(null);
                    setRequestNote('');
                    setTimeout(
                        () => setRequestSuccess(false),
                        TIMEOUTS.successMessage,
                    );
                },
                onFinish: () => setRequestSending(false),
            },
        );
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div
            className="flex h-screen w-full overflow-hidden"
            style={{ background: 'var(--color-bg-base)' }}
        >
            <Head title="OSCORP | Receive Money" />
            <Sidebar active="receive" />

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <Topbar />

                <div className="flex-1 overflow-y-auto p-4 pb-32 lg:p-8 lg:pb-8">
                    <div className="mx-auto max-w-5xl space-y-6">
                        {/* Header */}
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                            <div>
                                <h1
                                    className="text-3xl font-black tracking-tight"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    {t('receive_page.title')}
                                </h1>
                                <p
                                    className="mt-1 text-sm font-medium opacity-50"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    {t('receive_page.subtitle')}
                                </p>
                            </div>
                            <div className="md:text-right">
                                <div
                                    className="mb-1 text-[11px] font-bold tracking-widest uppercase opacity-40"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    {t('receive_page.balance')}
                                </div>
                                <div
                                    className="text-2xl font-black"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    {format(balance)}{' '}
                                    <span className="ml-1 text-sm opacity-50">
                                        {code}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Success Message */}
                        <AnimatePresence>
                            {requestSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center gap-3 rounded-xl p-4 text-sm font-bold"
                                    style={{
                                        background: `${COLORS.credit}1A`,
                                        border: `1px solid ${COLORS.credit}33`,
                                        color: COLORS.credit,
                                    }}
                                >
                                    <CheckCircle className="h-5 w-5" />
                                    {t('receive_page.request_sent')}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                            {/* Left Section (Details & Request) */}
                            <div className="space-y-5 lg:col-span-2">
                                {/* RIB Display */}
                                <div
                                    className="rounded-[24px] border border-white/5 bg-white/[0.02] p-6"
                                    style={{
                                        background: 'var(--color-bg-card)',
                                        borderColor: 'var(--color-border)',
                                    }}
                                >
                                    <div className="mb-6 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck
                                                className="h-5 w-5"
                                                style={{ color: COLORS.credit }}
                                            />
                                            <h2
                                                className="text-sm font-bold tracking-widest uppercase"
                                                style={{
                                                    color: 'var(--color-text-main)',
                                                }}
                                            >
                                                Your Bank Details
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <div
                                            className="mb-2 text-[11px] font-bold tracking-widest uppercase opacity-50"
                                            style={{
                                                color: 'var(--color-text-main)',
                                            }}
                                        >
                                            {t('receive_page.your_rib')}
                                        </div>
                                        <div
                                            className="font-mono text-2xl font-bold tracking-widest lg:text-3xl"
                                            style={{
                                                color: 'var(--color-text-main)',
                                            }}
                                        >
                                            {myRIB.match(/.{1,4}/g).join(' ')}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4 sm:flex-row">
                                        <button
                                            onClick={copyRIB}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-4 text-sm font-bold tracking-widest text-white uppercase transition-colors"
                                            style={{
                                                background: copied
                                                    ? COLORS.credit
                                                    : 'transparent',
                                                borderColor: copied
                                                    ? COLORS.credit
                                                    : 'var(--color-border)',
                                                color: copied
                                                    ? '#FFF'
                                                    : 'var(--color-text-main)',
                                            }}
                                        >
                                            {copied ? (
                                                <CheckCircle className="h-4 w-4" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                            {copied
                                                ? t('receive_page.copied')
                                                : t('receive_page.copy_rib')}
                                        </button>
                                        <button
                                            onClick={copyLink}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-4 text-sm font-bold tracking-widest uppercase transition-colors hover:bg-white/5"
                                            style={{
                                                borderColor:
                                                    'var(--color-border)',
                                                color: 'var(--color-text-main)',
                                            }}
                                        >
                                            <Share2 className="h-4 w-4" />
                                            {t('receive_page.copy_link')}
                                        </button>
                                    </div>
                                </div>

                                {/* Request Payment Form */}
                                <div
                                    className="space-y-5 rounded-[24px] border border-white/5 bg-white/[0.02] p-6"
                                    style={{
                                        background: 'var(--color-bg-card)',
                                        borderColor: 'var(--color-border)',
                                    }}
                                >
                                    <div className="mb-2 flex items-center gap-2">
                                        <ArrowDownToLine className="h-5 w-5 text-purple-500" />
                                        <h2
                                            className="text-sm font-bold tracking-widest uppercase"
                                            style={{
                                                color: 'var(--color-text-main)',
                                            }}
                                        >
                                            {t('receive_page.request_title')}
                                        </h2>
                                    </div>
                                    <p
                                        className="text-sm font-medium opacity-50"
                                        style={{
                                            color: 'var(--color-text-main)',
                                        }}
                                    >
                                        Send a payment request directly to an
                                        Oscorp user.
                                    </p>

                                    <div
                                        className="space-y-6 border-t border-white/5 pt-4"
                                        style={{
                                            borderColor: 'var(--color-border)',
                                        }}
                                    >
                                        {/* From Field */}
                                        <div className="space-y-3">
                                            <label
                                                className="text-[11px] font-bold tracking-widest uppercase opacity-50"
                                                style={{
                                                    color: 'var(--color-text-main)',
                                                }}
                                            >
                                                {t('receive_page.from')}
                                            </label>
                                            <div className="relative">
                                                <div
                                                    className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${selectedRequester ? 'border-purple-500 bg-purple-500/5' : 'bg-black/20 hover:border-white/20'}`}
                                                    style={
                                                        !selectedRequester
                                                            ? {
                                                                  borderColor:
                                                                      'var(--color-border)',
                                                                  background:
                                                                      'var(--color-bg-elevated)',
                                                              }
                                                            : {}
                                                    }
                                                >
                                                    <Search
                                                        className={`h-5 w-5 ${selectedRequester ? 'text-purple-500' : 'opacity-30'}`}
                                                        style={
                                                            !selectedRequester
                                                                ? {
                                                                      color: 'var(--color-text-main)',
                                                                  }
                                                                : {}
                                                        }
                                                    />
                                                    <input
                                                        type="text"
                                                        value={requestSearch}
                                                        onChange={(e) =>
                                                            setRequestSearch(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onFocus={() =>
                                                            requestResults.length >
                                                                0 &&
                                                            setShowRequestResults(
                                                                true,
                                                            )
                                                        }
                                                        placeholder={t(
                                                            'receive_page.search_from',
                                                        )}
                                                        className="flex-1 bg-transparent text-base font-bold outline-none placeholder:font-medium placeholder:opacity-30"
                                                        style={{
                                                            color: 'var(--color-text-main)',
                                                        }}
                                                    />
                                                    {selectedRequester && (
                                                        <button
                                                            onClick={
                                                                clearRequester
                                                            }
                                                            className="rounded-lg p-1 transition-colors hover:bg-white/10"
                                                        >
                                                            <X
                                                                className="h-5 w-5 opacity-50"
                                                                style={{
                                                                    color: 'var(--color-text-main)',
                                                                }}
                                                            />
                                                        </button>
                                                    )}
                                                </div>

                                                <AnimatePresence>
                                                    {showRequestResults &&
                                                        requestResults.length >
                                                            0 && (
                                                            <motion.div
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: 5,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                exit={{
                                                                    opacity: 0,
                                                                    y: 5,
                                                                }}
                                                                className="absolute top-[calc(100%+8px)] right-0 left-0 z-50 overflow-hidden rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl"
                                                                style={{
                                                                    background:
                                                                        'var(--color-bg-card)',
                                                                }}
                                                            >
                                                                <div className="custom-scrollbar max-h-[250px] overflow-y-auto">
                                                                    {requestResults.map(
                                                                        (
                                                                            user,
                                                                        ) => (
                                                                            <button
                                                                                key={
                                                                                    user.id
                                                                                }
                                                                                onClick={() =>
                                                                                    selectRequester(
                                                                                        user,
                                                                                    )
                                                                                }
                                                                                className="flex w-full items-center gap-4 border-b border-white/5 px-4 py-3 text-left transition-colors last:border-0 hover:bg-white/5"
                                                                            >
                                                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-xs font-bold text-purple-500">
                                                                                    {getInitials(
                                                                                        user.name,
                                                                                    )}
                                                                                </div>
                                                                                <div>
                                                                                    <div
                                                                                        className="text-sm font-bold"
                                                                                        style={{
                                                                                            color: 'var(--color-text-main)',
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            user.name
                                                                                        }
                                                                                    </div>
                                                                                    <div
                                                                                        className="text-xs opacity-50"
                                                                                        style={{
                                                                                            color: 'var(--color-text-main)',
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            user.email
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </button>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        {/* Amount Field */}
                                        <div className="space-y-3">
                                            <label
                                                className="text-[11px] font-bold tracking-widest uppercase opacity-50"
                                                style={{
                                                    color: 'var(--color-text-main)',
                                                }}
                                            >
                                                {t(
                                                    'receive_page.request_amount',
                                                )}
                                            </label>
                                            <div
                                                className="flex w-full items-center gap-3 rounded-xl border bg-black/20 px-5 py-3 transition-all focus-within:border-purple-500 hover:border-white/20"
                                                style={{
                                                    borderColor:
                                                        'var(--color-border)',
                                                    background:
                                                        'var(--color-bg-elevated)',
                                                }}
                                            >
                                                <span
                                                    className="shrink-0 text-xl font-black opacity-30"
                                                    style={{
                                                        color: 'var(--color-text-main)',
                                                    }}
                                                >
                                                    {code}
                                                </span>
                                                <input
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={requestAmount}
                                                    onChange={(e) =>
                                                        setRequestAmount(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="flex-1 bg-transparent text-3xl font-black outline-none placeholder:opacity-20"
                                                    style={{
                                                        color: 'var(--color-text-main)',
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Note Field */}
                                        <div className="space-y-3">
                                            <label
                                                className="text-[11px] font-bold tracking-widest uppercase opacity-50"
                                                style={{
                                                    color: 'var(--color-text-main)',
                                                }}
                                            >
                                                {t('send_page.note_label')}
                                            </label>
                                            <input
                                                type="text"
                                                value={requestNote}
                                                onChange={(e) =>
                                                    setRequestNote(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={t(
                                                    'send_page.note_placeholder',
                                                )}
                                                className="w-full rounded-xl border bg-black/20 px-5 py-4 text-sm font-medium transition-all outline-none placeholder:opacity-30 hover:border-white/20 focus:border-purple-500"
                                                style={{
                                                    borderColor:
                                                        'var(--color-border)',
                                                    color: 'var(--color-text-main)',
                                                    background:
                                                        'var(--color-bg-elevated)',
                                                }}
                                            />
                                        </div>

                                        {/* Submit Request */}
                                        <div className="pt-2">
                                            <button
                                                onClick={sendRequest}
                                                disabled={
                                                    requestSending ||
                                                    !selectedRequester ||
                                                    !requestAmount
                                                }
                                                className="flex h-14 w-full items-center justify-center gap-3 rounded-xl text-sm font-bold tracking-widest text-white uppercase transition-all disabled:opacity-30"
                                                style={{
                                                    background: COLORS.purple,
                                                }}
                                            >
                                                {requestSending ? (
                                                    <motion.div
                                                        animate={{
                                                            scale: [1, 1.3, 1],
                                                            opacity: [
                                                                1, 0.6, 1,
                                                            ],
                                                        }}
                                                        transition={{
                                                            repeat: Infinity,
                                                            duration: 1.2,
                                                            ease: 'easeInOut',
                                                        }}
                                                        className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                                                    />
                                                ) : (
                                                    <>
                                                        {t(
                                                            'receive_page.send_request',
                                                        )}{' '}
                                                        <ArrowDownToLine className="h-4 w-4" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Section (QR & History) */}
                            <div className="space-y-5">
                                {/* QR Code Display */}
                                <div
                                    className="flex flex-col items-center rounded-[24px] border border-white/5 bg-white/[0.02] p-8 text-center"
                                    style={{
                                        background: 'var(--color-bg-card)',
                                        borderColor: 'var(--color-border)',
                                    }}
                                >
                                    <h3
                                        className="mb-2 text-[11px] font-bold tracking-widest uppercase opacity-50"
                                        style={{
                                            color: 'var(--color-text-main)',
                                        }}
                                    >
                                        {t('receive_page.asset_qr')}
                                    </h3>
                                    <p
                                        className="mb-6 text-xs font-medium opacity-50"
                                        style={{
                                            color: 'var(--color-text-main)',
                                        }}
                                    >
                                        {t('receive_page.qr_desc')}
                                    </p>

                                    <div className="mb-6 rounded-2xl bg-white p-4">
                                        <QRCodeCanvas
                                            id="receive-qr"
                                            value={`${window.location.origin}/send?to=${encodeURIComponent(myRIB)}`}
                                            size={160}
                                            level="H"
                                            includeMargin={false}
                                            imageSettings={{
                                                src: '/logo_premium.png',
                                                height: 36,
                                                width: 36,
                                                excavate: true,
                                            }}
                                        />
                                    </div>

                                    <button
                                        onClick={downloadQR}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-xs font-bold tracking-widest uppercase transition-colors hover:bg-white/5"
                                        style={{
                                            borderColor: 'var(--color-border)',
                                            color: 'var(--color-text-main)',
                                        }}
                                    >
                                        <Download className="h-4 w-4" />
                                        {t('receive_page.download_qr')}
                                    </button>
                                </div>

                                {/* Recent History */}
                                {recentReceives.length > 0 && (
                                    <div
                                        className="rounded-[24px] border border-white/5 bg-white/[0.02] p-6"
                                        style={{
                                            background: 'var(--color-bg-card)',
                                            borderColor: 'var(--color-border)',
                                        }}
                                    >
                                        <div className="mb-6 flex items-center gap-2">
                                            <Clock
                                                className="h-4 w-4 opacity-40"
                                                style={{
                                                    color: 'var(--color-text-main)',
                                                }}
                                            />
                                            <h3
                                                className="text-[11px] font-bold tracking-widest uppercase opacity-50"
                                                style={{
                                                    color: 'var(--color-text-main)',
                                                }}
                                            >
                                                {t('receive_page.incoming_log')}
                                            </h3>
                                        </div>
                                        <div className="space-y-4">
                                            {recentReceives
                                                .slice(0, 5)
                                                .map((r, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-center justify-between"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold"
                                                                style={{
                                                                    background: `${COLORS.credit}1A`,
                                                                    color: COLORS.credit,
                                                                }}
                                                            >
                                                                {getInitials(
                                                                    r.merchant?.replace(
                                                                        'Received from ',
                                                                        '',
                                                                    ) || '?',
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div
                                                                    className="text-sm font-bold"
                                                                    style={{
                                                                        color: 'var(--color-text-main)',
                                                                    }}
                                                                >
                                                                    {r.merchant?.replace(
                                                                        'Received from ',
                                                                        '',
                                                                    )}
                                                                </div>
                                                                <div
                                                                    className="mt-0.5 text-[10px] font-medium opacity-50"
                                                                    style={{
                                                                        color: 'var(--color-text-main)',
                                                                    }}
                                                                >
                                                                    {new Date(
                                                                        r.transacted_at,
                                                                    ).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="text-sm font-bold"
                                                            style={{
                                                                color: COLORS.credit,
                                                            }}
                                                        >
                                                            +{format(r.amount)}
                                                        </div>
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

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
                input[type=number]::-webkit-inner-spin-button, 
                input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
            `,
                }}
            />
        </div>
    );
}
