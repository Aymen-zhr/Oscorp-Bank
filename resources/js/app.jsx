import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'framer-motion';
import ErrorBoundary from './components/ErrorBoundary';

const appName = import.meta.env.VITE_APP_NAME || 'My App';

import { ThemeProvider } from './contexts/ThemeContext';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.jsx', { eager: true });
        return pages[`./pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        const { locale = 'en', isRTL = false } = props.initialPage.props;
        document.documentElement.lang = locale;
        document.documentElement.dir = 'ltr'; // Always use LTR as requested
        root.render(
            <ErrorBoundary>
                <ThemeProvider>
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={props.initialPage.url}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full w-full"
                        >
                            <App {...props} />
                        </motion.div>
                    </AnimatePresence>
                </ThemeProvider>
            </ErrorBoundary>
        );
    },
    progress: {
        color: '#D4AF37',
    },
});