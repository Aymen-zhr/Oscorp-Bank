import { useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import en from '../translations/en.json';
import fr from '../translations/fr.json';
import ar from '../translations/ar.json';

const dictionaries = { en, fr, ar };

function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export function useTranslation() {
    const { props } = usePage();
    const locale = props.locale || 'en';

    const dict = useMemo(() => {
        return dictionaries[locale] || dictionaries.en;
    }, [locale]);

    const t = (key, params = {}) => {
        let str = getNestedValue(dict, key) || getNestedValue(dictionaries.en, key) || key;

        Object.entries(params).forEach(([paramKey, value]) => {
            str = str.replace(`{${paramKey}}`, String(value));
        });

        return str;
    };

    return { t, locale, dict };
}

export default useTranslation;
