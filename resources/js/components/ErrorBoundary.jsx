import { Component } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo.componentStack);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div
                    className="flex min-h-screen items-center justify-center"
                    style={{ background: 'var(--color-bg-base)' }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mx-4 max-w-md rounded-2xl p-8 text-center"
                        style={{
                            background: 'var(--color-bg-card)',
                            border: '1px solid var(--color-border)',
                        }}
                    >
                        <AlertTriangle
                            className="mx-auto mb-4 h-12 w-12"
                            style={{ color: '#F59E0B' }}
                        />
                        <h2
                            className="mb-2 text-xl font-bold"
                            style={{ color: 'var(--color-text-main)' }}
                        >
                            Something went wrong
                        </h2>
                        <p
                            className="mb-6 text-sm"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            An unexpected error occurred. Please try refreshing
                            the page.
                        </p>
                        <button
                            onClick={this.handleReset}
                            className="mx-auto flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all hover:opacity-80"
                            style={{
                                background: 'var(--color-gold)',
                                color: '#000',
                            }}
                        >
                            <RefreshCw className="h-4 w-4" /> Return Home
                        </button>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}
