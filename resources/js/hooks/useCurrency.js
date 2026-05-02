import { usePage } from '@inertiajs/react';

export function useCurrency() {
    const { currency: currencyCode } = usePage().props;

    const currencyMap = {
        MAD: { name: 'Moroccan Dirham', symbol: 'MAD', symbol_native: 'د.م.', locale: 'en-MA', decimal_digits: 2 },
        USD: { name: 'US Dollar', symbol: '$', symbol_native: '$', locale: 'en-US', decimal_digits: 2 },
        EUR: { name: 'Euro', symbol: '€', symbol_native: '€', locale: 'fr-FR', decimal_digits: 2 },
        GBP: { name: 'British Pound', symbol: '£', symbol_native: '£', locale: 'en-GB', decimal_digits: 2 },
        AED: { name: 'UAE Dirham', symbol: 'AED', symbol_native: 'د.إ', locale: 'ar-AE', decimal_digits: 2 },
        SAR: { name: 'Saudi Riyal', symbol: 'SAR', symbol_native: 'ر.س', locale: 'ar-SA', decimal_digits: 2 },
        JPY: { name: 'Japanese Yen', symbol: '¥', symbol_native: '¥', locale: 'ja-JP', decimal_digits: 0 },
        CNY: { name: 'Chinese Yuan', symbol: 'CN¥', symbol_native: 'CN¥', locale: 'zh-CN', decimal_digits: 2 },
    };

    const rates = { MAD: 1, USD: 0.10, EUR: 0.092, GBP: 0.079, AED: 0.37, SAR: 0.38, JPY: 14.95, CNY: 0.72 };

    const code = currencyCode || 'MAD';
    const info = currencyMap[code] || currencyMap['MAD'];
    const rate = rates[code] || 1;

    function convert(amountMAD) {
        return Number((amountMAD * rate).toFixed(info.decimal_digits));
    }

    function format(amountMAD, showSymbol = true) {
        const converted = convert(amountMAD);
        const formatted = converted.toLocaleString(info.locale, {
            minimumFractionDigits: info.decimal_digits,
            maximumFractionDigits: info.decimal_digits,
        });
        return showSymbol ? `${formatted} ${info.symbol}` : formatted;
    }

    function formatNumber(amountMAD) {
        return convert(amountMAD);
    }

    return {
        code,
        info,
        rate,
        convert,
        format,
        formatNumber,
    };
}
