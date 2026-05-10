/* ── Logo.dev config ───────────────────────────────────────── */
export const LOGO_KEY = import.meta.env.VITE_LOGO_DEV_KEY || '';
export const LOGO_BASE_URL = 'https://img.logo.dev';

/* ── Dicebear avatar config ─────────────────────────────────── */
export const DICEBEAR_BASE_URL = 'https://api.dicebear.com/9.x';

/* ── Category colours ──────────────────────────────────────── */
export const CAT_COLOR = {
    Food: '#F59E0B',
    Dining: '#F97316',
    Groceries: '#84CC16',
    Transport: '#6366F1',
    Entertainment: '#EC4899',
    Bills: '#EF4444',
    Utilities: '#06B6D4',
    Shopping: '#10B981',
    Health: '#8B5CF6',
    Telecoms: '#3B82F6',
    Transfer: '#D4AF37',
    Salary: '#22C55E',
    Rent: '#F43F5E',
    Wellness: '#A78BFA',
    default: '#64748B',
};

export function catColor(category) {
    return CAT_COLOR[category] || CAT_COLOR.default;
}

/* ── Avatar colours palette ─────────────────────────────────── */
export const AVATAR_COLORS = [
    '#D4AF37',
    '#3B82F6',
    '#10B981',
    '#8B5CF6',
    '#F59E0B',
    '#EC4899',
    '#EF4444',
    '#06B6D4',
];

/* ── Status colours ────────────────────────────────────────── */
export const STATUS_COLORS = {
    credit: '#10B981',
    debit: '#EF4444',
    pending: '#F59E0B',
    success: '#10B981',
    error: '#EF4444',
    info: '#3B82F6',
    gold: 'var(--color-gold)',
};

/* ── Domain map for merchant logos ─────────────────────────── */
export const DOMAIN_MAP = {
    netflix: 'netflix.com',
    spotify: 'spotify.com',
    amazon: 'amazon.com',
    apple: 'apple.com',
    google: 'google.com',
    microsoft: 'microsoft.com',
    youtube: 'youtube.com',
    adobe: 'adobe.com',
    dropbox: 'dropbox.com',
    zoom: 'zoom.us',
    slack: 'slack.com',
    paypal: 'paypal.com',
    steam: 'steampowered.com',
    airbnb: 'airbnb.com',
    uber: 'uber.com',
    github: 'github.com',
    openai: 'openai.com',
    playstation: 'playstation.com',
    mcdonald: 'mcdonalds.com',
    starbucks: 'starbucks.com',
    kfc: 'kfc.com',
    'pizza hut': 'pizzahut.com',
    domino: 'dominos.com',
    carrefour: 'carrefour.com',
    zara: 'zara.com',
    'h&m': 'hm.com',
    jumia: 'jumia.ma',
    marjane: 'marjane.ma',
    inwi: 'inwi.ma',
    'maroc telecom': 'iam.ma',
    orange: 'orange.ma',
    lydec: 'lydec.ma',
    bmce: 'banqueofafrica.com',
    attijariwafa: 'attijariwafabank.com',
    cih: 'cihbank.com',
    wafacash: 'wafacash.ma',
};

export function getDomain(merchant) {
    if (!merchant) {
        return null;
    }

    const lower = merchant.toLowerCase();

    for (const [key, domain] of Object.entries(DOMAIN_MAP)) {
        if (lower.includes(key)) {
            return domain;
        }
    }

    return null;
}

export function getLogoUrl(merchant) {
    const domain = getDomain(merchant);

    if (domain) {
        return `${LOGO_BASE_URL}/${domain}?token=${LOGO_KEY}&size=80&format=png`;
    }

    return null;
}

export function getFallbackAvatarUrl(name) {
    const colors = [
        'D4AF37',
        '10B981',
        '6366F1',
        'F59E0B',
        'EC4899',
        '8B5CF6',
        '06B6D4',
        'EF4444',
        '3B82F6',
        '84CC16',
    ];
    const color = colors[Math.abs(hashCode(name)) % colors.length];

    return `${DICEBEAR_BASE_URL}/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=${color}`;
}

function hashCode(str) {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }

    return hash;
}

/* ── Timeout constants (ms) ────────────────────────────────── */
export const TIMEOUTS = {
    copyFeedback: 2000,
    successMessage: 5000,
    inputFocus: 100,
    searchDebounce: 300,
};

/* ── Route paths ───────────────────────────────────────────── */
export const ROUTES = {
    dashboard: '/dashboard',
    transactions: '/transactions',
    transfer: '/transfer',
    send: '/send',
    receive: '/receive',
    subscriptions: '/subscriptions',
    contacts: '/contacts',
    'split-bills': '/split-bills',
    account: '/account',
    cards: '/cards',
    allocations: '/allocations',
    loans: '/loans',
    taxes: '/taxes',
    reports: '/reports',
    ai: '/ai',
    settings: '/settings',
    notifications: '/notifications',
};

/* ── Partner domains for homepage ──────────────────────────── */
export const PARTNERS = [
    { name: 'Visa', domain: 'visa.com' },
    { name: 'Mastercard', domain: 'mastercard.com' },
    { name: 'PayPal', domain: 'paypal.com' },
    { name: 'Stripe', domain: 'stripe.com' },
    { name: 'Bloomberg', domain: 'bloomberg.com' },
    { name: 'HSBC', domain: 'hsbc.com' },
    { name: 'JPMorgan', domain: 'jpmorgan.com' },
    { name: 'BlackRock', domain: 'blackrock.com' },
    { name: 'Goldman Sachs', domain: 'goldmansachs.com' },
    { name: 'Fidelity', domain: 'fidelity.com' },
    { name: 'AmEx', domain: 'americanexpress.com' },
    { name: 'Swift', domain: 'swift.com' },
];

/* ── Contact info for homepage ─────────────────────────────── */
export const CONTACT_INFO = [
    {
        icon: 'Mail',
        labelKey: 'contact.email_label',
        valueKey: 'contact.email',
    },
    {
        icon: 'Phone',
        labelKey: 'contact.phone_label',
        valueKey: 'contact.phone',
    },
    {
        icon: 'MapPin',
        labelKey: 'contact.address_label',
        valueKey: 'contact.address',
    },
];

/* ── Quick bill icon definitions ───────────────────────────── */
export const QUICK_BILL_ICONS = [
    { value: 'tv', color: '#E50914' },
    { value: 'music', color: '#1DB954' },
    { value: 'gamepad-2', color: '#107C10' },
    { value: 'palette', color: '#FF0000' },
    { value: 'utensils', color: '#F59E0B' },
    { value: 'wifi', color: '#3B82F6' },
    { value: 'receipt', color: '#D4AF37' },
];

/* ── Quick transfer amounts ────────────────────────────────── */
export const QUICK_AMOUNTS = [500, 1000, 2500, 5000, 10000];

/* ── App-wide color constants ─────────────────────────────── */
export const COLORS = {
    credit: '#10B981',
    debit: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    gold: '#D4AF37',
    purple: '#8B5CF6',
    success: '#10B981',
    error: '#EF4444',
    default: '#64748B',
    chartPalette: [
        '#D4AF37',
        '#10B981',
        '#6366F1',
        '#F59E0B',
        '#EC4899',
        '#8B5CF6',
        '#06B6D4',
        '#EF4444',
        '#3B82F6',
        '#84CC16',
    ],
};

/* ── Loan form limits ─────────────────────────────────────── */
export const LOAN_LIMITS = {
    amount: { min: 10000, max: 2000000, step: 10000 },
    rate: { min: 1.0, max: 15.0, step: 0.1 },
    term: { min: 1, max: 30, step: 1 },
};

/* ── Validation limits ────────────────────────────────────── */
export const VALIDATION = {
    ribMinLength: 16,
};
