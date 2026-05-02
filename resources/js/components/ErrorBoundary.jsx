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
                <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--color-bg-base)' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-4 p-8 rounded-2xl text-center"
                        style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
                    >
                        <AlertTriangle className="w-12 h-12 mx-auto mb-4" style={{ color: '#F59E0B' }} />
                        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-main)' }}>
                            Something went wrong
                        </h2>
                        <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
                            An unexpected error occurred. Please try refreshing the page.
                        </p>
                        <button
                            onClick={this.handleReset}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold mx-auto transition-all hover:opacity-80"
                            style={{ background: 'var(--color-gold)', color: '#000' }}
                        >
                            <RefreshCw className="w-4 h-4" /> Return Home
                        </button>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}
