import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'framer-motion';
import ErrorBoundary from './components/ErrorBoundary';

import { ThemeProvider } from './contexts/ThemeContext';

const appName = import.meta.env.VITE_APP_NAME || 'My App';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.jsx', { eager: true });
        return pages[`./pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        console.log('App mounting...', props.initialPage.url);

        if (typeof document === 'undefined') {
            return; // Skip SSR
        }

        const root = createRoot(el);

        const { locale = 'en' } = props.initialPage.props;
        document.documentElement.lang = locale;
        document.documentElement.dir = 'ltr'; // Always use LTR as requested

        root.render(
            <ErrorBoundary>
                <ThemeProvider>
                    <App {...props} />
                </ThemeProvider>
            </ErrorBoundary>,
        );
    },
    progress: {
        color: '#D4AF37',
    },
});
